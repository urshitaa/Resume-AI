import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/GlassCard";
import ChatBubble from "@/components/ChatBubble";
import { api, type ChatMessage } from "@/lib/api";

const ChatPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hi! I'm your AI career assistant. Upload your resume on the Dashboard, then come back here to chat about optimizing it for any job. Or just ask me career questions!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const quickPrompts = [
    "Improve my resume",
    "What skills should I learn?",
    "Give me interview questions"
  ];

  const send = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim() || loading) return;
    
    const userMsg: ChatMessage = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const { reply } = await api.chat([...messages, userMsg]);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't process your request. Please check that your backend is running." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="container flex flex-1 flex-col py-6">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 text-2xl font-bold font-heading"
        >
          AI Career <span className="gradient-text">Assistant</span>
        </motion.h1>

        <GlassCard className="flex flex-1 flex-col overflow-hidden p-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ChatBubble role={m.role} content={m.content} />
              </motion.div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                Thinking...
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask about your resume, career tips, interview prep..."
                className="flex-1 rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                onClick={() => send()}
                disabled={loading || !input.trim()}
                className="gradient-bg rounded-lg p-3 text-primary-foreground transition-all hover:shadow-lg disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-3">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => send(prompt)}
                  disabled={loading}
                  className="px-3 py-1.5 text-xs font-medium rounded-full bg-secondary/50 text-secondary-foreground hover:bg-primary/10 hover:text-primary transition-colors border border-border disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </GlassCard>
      </main>
    </div>
  );
};

export default ChatPage;
