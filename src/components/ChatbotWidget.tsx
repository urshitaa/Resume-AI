import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, ChevronDown, Send, Bot, User, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { api, type ChatMessage } from "@/lib/api";
import { toast } from "sonner";

const MessageBubble = ({ msg }: { msg: ChatMessage }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLong = msg.content.length > 300 && msg.role === "assistant";

  return (
    <div
      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${msg.role === "user"
        ? "bg-primary text-primary-foreground rounded-br-md"
        : "bg-muted/50 rounded-bl-md border border-border/40"
        }`}
    >
      {msg.role === "user" ? (
        msg.content
      ) : (
        <div className="flex flex-col gap-1">
          <div className={`prose prose-sm prose-p:leading-relaxed prose-pre:bg-muted prose-pre:text-foreground dark:prose-invert max-w-none break-words ${!isExpanded && isLong ? 'line-clamp-6 overflow-hidden' : ''}`}>
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
          {isLong && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-1 text-xs font-semibold text-primary hover:underline flex items-center justify-start"
            >
              {isExpanded ? "Read Less" : "Read More..."}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const ChatbotWidget = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! 👋 I'm your Career AI Assistant. Ask me anything about resumes, job hunting, or interview prep!",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      role: "user",
      content: input.trim(),
    };

    const updatedMessages = [...messages, userMsg];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please log in to use the AI assistant.");
        navigate("/login", { state: { from: location.pathname } });
        return;
      }

      const data = await api.chat(updatedMessages);

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch (err: any) {
      if (err.message?.includes("401")) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login", { state: { from: location.pathname } });
      } else {
        toast.error("Sorry, something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button and Tooltip */}
      <AnimatePresence>
        {!isOpen && (
          <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3 pointer-events-none">
            {/* Tooltip */}
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              transition={{ delay: 1, type: "spring", stiffness: 200, damping: 20 }}
              className="mb-2 hidden sm:flex flex-col bg-background/95 backdrop-blur-sm px-4 py-2.5 rounded-2xl rounded-br-sm shadow-xl border border-border/50 text-sm pointer-events-auto cursor-pointer"
              onClick={() => setIsOpen(true)}
            >
              <span className="font-semibold text-foreground">How can I help! ✨</span>
              <span className="text-muted-foreground text-xs mt-0.5">Ask me about your resume.</span>
            </motion.div>

            {/* Chat Button */}
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="flex h-14 w-14 items-center justify-center rounded-full shadow-2xl gradient-bg text-white cursor-pointer pointer-events-auto relative"
              aria-label="Open chat"
            >
              <MessageCircle className="h-6 w-6 relative z-10" />
              <span className="absolute inset-0 rounded-full animate-ping bg-primary/40" />
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.92 }}
            transition={{ type: "spring", damping: 24, stiffness: 280 }}
            className="fixed bottom-6 right-6 z-50 flex flex-col w-[400px] h-[560px] rounded-2xl border border-border/50 bg-background shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 gradient-bg text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                  <Bot className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-semibold text-sm">Career AI Assistant</p>
                  <p className="text-xs opacity-80">Always here to help</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                  aria-label="Minimize chat"
                >
                  <ChevronDown className="h-5 w-5" />
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setMessages([{
                      role: "assistant",
                      content: "Hi! 👋 I'm your Career AI Assistant. Ask me anything about resumes, job hunting, or interview prep!"
                    }]);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2 ${msg.role === "user"
                      ? "justify-end"
                      : "justify-start items-start"
                    }`}
                >
                  {/* Assistant Avatar */}
                  {msg.role === "assistant" && (
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 mt-1">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}

                  <MessageBubble msg={msg} />

                  {/* User Avatar */}
                  {msg.role === "user" && (
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 mt-1">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                  )}
                </div>
              ))}

              {/* Loading */}
              {loading && (
                <div className="flex gap-2 justify-start">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 mt-1">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>

                  <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" />
                      <span
                        className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border/50 px-4 py-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  disabled={loading}
                  className="flex-1 rounded-xl border border-input bg-muted/30 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />

                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="flex h-10 w-10 items-center justify-center rounded-xl gradient-bg text-white disabled:opacity-50 transition-opacity cursor-pointer"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;