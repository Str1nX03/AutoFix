"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, X, Send } from "lucide-react";

export default function ChatBotUi() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const suggestions = [
    "What can you actually do?",
    "Why should I use AutoFix instead of a chatbot?",
    "How long does it take to deploy?",
    "Which tools do you integrate with?",
  ];

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

            <div className="flex items-center justify-between border-b border-[#d7cec2] px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f25c05] text-white">
                  <Bot size={18} />
                </div>

                <div>
                  <h3 className="font-semibold text-[#111]">AutoFix</h3>

                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    Online · replies in ~1s
                  </div>
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-2 transition hover:bg-black/5"
              >
                <X size={18} />
              </button>
            </div>

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
                <input
                  type="text"
                  placeholder="Message AutoFix..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}