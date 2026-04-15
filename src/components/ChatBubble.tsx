import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
}

const ChatBubble = ({ role, content }: ChatBubbleProps) => (
  <div className={cn("flex w-full", role === "user" ? "justify-end" : "justify-start")}>
    <div
      className={cn(
        "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
        role === "user"
          ? "bg-muted text-foreground rounded-br-md"
          : "gradient-bg text-primary-foreground rounded-bl-md"
      )}
    >
      {role === "assistant" ? (
        <div className="prose prose-sm prose-invert max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      ) : (
        content
      )}
    </div>
  </div>
);

export default ChatBubble;
