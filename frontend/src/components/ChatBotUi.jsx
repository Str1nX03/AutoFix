"use client";

<<<<<<< HEAD
import { useState, useRef, useEffect } from "react";
=======
import { useState } from "react";
>>>>>>> origin/main
import { AnimatePresence, motion } from "framer-motion";
import { Bot, X, Send } from "lucide-react";

export default function ChatBotUi() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
<<<<<<< HEAD
  const [isLoading, setIsLoading] = useState(false);
  
  // Generate a simple random session ID once when the component loads
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));

  // State to hold the chat history
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hey 👋 I'm AutoFix. I'm trained on this whole product — ask me anything, or try one of the suggestions below.",
    },
  ]);

  const messagesEndRef = useRef(null);
=======
>>>>>>> origin/main

  const suggestions = [
    "What can you actually do?",
    "Why should I use AutoFix instead of a chatbot?",
    "How long does it take to deploy?",
    "Which tools do you integrate with?",
  ];

<<<<<<< HEAD
  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // The function that connects to your FastAPI backend
  const handleSendMessage = async (textToSend) => {
    const finalMessage = textToSend || message;
    if (!finalMessage.trim()) return;

    // 1. Add user's message to the UI instantly
    const newMessages = [...messages, { role: "user", content: finalMessage }];
    setMessages(newMessages);
    setMessage(""); // Clear input field
    setIsLoading(true);

    try {
      // 2. Send the request to your FastAPI backend
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
          messages: newMessages,
        }),
      });

      if (!response.ok) throw new Error("Server responded with an error");

      const data = await response.json();

      // 3. Add the AI's response to the UI
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I'm having trouble connecting to the server right now." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

=======
>>>>>>> origin/main
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence mode="wait">
        {!open ? (
          <motion.button
            key="launcher"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setOpen(true)}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f25c05] text-white shadow-2xl"
          >
            <Bot size={28} />
          </motion.button>
        ) : (
          <motion.div
            key="chatbox"
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ duration: 0.2 }}
            className="relative flex h-[520px] w-[420px] flex-col overflow-hidden rounded-[32px] border border-[#d7cec2] bg-[#f4eee7] shadow-[0_20px_80px_rgba(0,0,0,0.15)]"
          >
            {/* HEADER */}
<<<<<<< HEAD
            <div className="flex items-center justify-between border-b border-[#d7cec2] px-5 py-4 bg-white/50 backdrop-blur-md">
=======

            <div className="flex items-center justify-between border-b border-[#d7cec2] px-5 py-4">
>>>>>>> origin/main
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f25c05] text-white">
                  <Bot size={18} />
                </div>
<<<<<<< HEAD
                <div>
                  <h3 className="font-semibold text-[#111]">AutoFix</h3>
=======

                <div>
                  <h3 className="font-semibold text-[#111]">AutoFix</h3>

>>>>>>> origin/main
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    Online · replies in ~1s
                  </div>
                </div>
              </div>
<<<<<<< HEAD
=======

>>>>>>> origin/main
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-2 transition hover:bg-black/5"
              >
                <X size={18} />
              </button>
            </div>

<<<<<<< HEAD
            {/* CHAT AREA (Dynamically Rendered) */}
            <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  
                  {/* Avatar only for assistant */}
                  {msg.role === "assistant" && (
                    <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f25c05] text-white">
                      <Bot size={16} />
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div className={`max-w-[280px] px-4 py-3 text-[15px] leading-relaxed shadow-sm ${
                    msg.role === "user" 
                    ? "rounded-3xl rounded-tr-md bg-[#f25c05] text-white" 
                    : "rounded-3xl rounded-tl-md bg-white border border-[#d7cec2] text-[#1b1b1b]"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f25c05] text-white">
                    <Bot size={16} />
                  </div>
                  <div className="max-w-[280px] px-4 py-3 rounded-3xl rounded-tl-md bg-white border border-[#d7cec2] text-neutral-500 text-[15px]">
                    <span className="animate-pulse">Thinking...</span>
                  </div>
                </div>
              )}
              
              {/* Invisible div to anchor the auto-scroll */}
              <div ref={messagesEndRef} />
            </div>

            {/* SUGGESTIONS */}
            {messages.length === 1 && (
              <div className="border-t border-[#d7cec2] px-4 py-4 bg-white/50">
                <div className="flex flex-col gap-2">
                  {suggestions.map((item) => (
                    <button
                      key={item}
                      onClick={() => handleSendMessage(item)}
                      className="rounded-full border border-[#d7cec2] bg-[#f8f3ee] px-4 py-2 text-sm text-neutral-700 transition hover:bg-white text-left truncate"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* INPUT AREA */}
            <div className="border-t border-[#d7cec2] bg-[#f4eee7] p-4">
              <form 
                onSubmit={(e) => {
                  e.preventDefault(); 
                  handleSendMessage();
                }}
                className="relative"
              >
=======
            {/* CHAT AREA */}

            <div className="flex-1 overflow-y-auto px-5 py-6">
              <div className="flex gap-3">
                <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#f25c05] text-white">
                  <Bot size={16} />
                </div>

                <div className="max-w-[280px]">
                  <div className="rounded-3xl rounded-tl-md bg-transparent text-[18px] leading-9 text-[#1b1b1b]">
                    Hey 👋 I'm AutoFix. I'm trained on this whole product —
                    ask me anything, or try one of the suggestions below.
                  </div>
                </div>
              </div>
            </div>

            {/* SUGGESTIONS */}

            <div className="border-t border-[#d7cec2] px-4 py-4">
              <div className="flex flex-col gap-3">
                {suggestions.map((item) => (
                  <button
                    key={item}
                    className="rounded-full border border-[#d7cec2] bg-[#f8f3ee] px-4 py-3 text-sm text-neutral-700 transition hover:bg-white"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* INPUT */}

            <div className="border-t border-[#d7cec2] bg-[#f4eee7] p-4">
              <div className="relative">
>>>>>>> origin/main
                <input
                  type="text"
                  placeholder="Message AutoFix..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
<<<<<<< HEAD
                  disabled={isLoading}
                  className="w-full rounded-full border border-[#d7cec2] bg-white px-5 py-3 pr-14 text-sm outline-none disabled:opacity-50"
                />

                <button
                  type="submit"
                  disabled={isLoading || !message.trim()}
                  className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#f2a07f] text-white transition hover:scale-105 disabled:hover:scale-100 disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </form>
=======
                  className="w-full rounded-full border border-[#d7cec2] bg-white px-5 py-3 pr-14 text-sm outline-none"
                />

                <button
                  className="
                    absolute
                    right-2
                    top-1/2
                    flex
                    h-10
                    w-10
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-full
                    bg-[#f2a07f]
                    text-white
                    transition
                    hover:scale-105
                  "
                >
                  <Send size={16} />
                </button>
              </div>
>>>>>>> origin/main
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}