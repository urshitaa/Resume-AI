import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Prevent "removeChild" errors caused by browser extensions modifying the DOM
const origRemoveChild = Node.prototype.removeChild;
Node.prototype.removeChild = function <T extends Node>(child: T): T {
  if (child.parentNode !== this) {
    console.warn("removeChild: node is not a child of this node", child);
    return child;
  }
  return origRemoveChild.call(this, child) as T;
};

const origInsertBefore = Node.prototype.insertBefore;
Node.prototype.insertBefore = function <T extends Node>(newNode: T, refNode: Node | null): T {
  if (refNode && refNode.parentNode !== this) {
    console.warn("insertBefore: refNode is not a child of this node", refNode);
    return newNode;
  }
  return origInsertBefore.call(this, newNode, refNode) as T;
};

createRoot(document.getElementById("root")!).render(<App />);
