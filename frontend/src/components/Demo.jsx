"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bot, Send, Check } from "lucide-react";

const SUGGESTED = [
  "What can you actually do?",
  "Why should I use AutoFix instead of a chatbot?",
  "How long does it take to deploy?",
  "Which tools do you integrate with?",
];

export default function DemoSection() {
  return (
    <section id="demo" className="bg-[#f5f0e9] py-20 lg:py-28 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        {/* Changed items-center to items-stretch so both columns equal height */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* LEFT SIDE - Removed h-[600px], added h-full */}
          <div className="bg-[#120905] rounded-[32px] p-8 lg:p-12 text-white flex flex-col justify-center h-full">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-bold mb-6">
              ✺ SEE AUTOFIX IN ACTION
            </p>

            {/* Slightly reduced text size from 4.5rem to 4rem for better fit */}
            <h2 className="text-5xl lg:text-[4rem] font-serif font-bold leading-[1.05] tracking-tight">
              See how your
              <br />
              customers
              <br />
              will experience{" "}
              <span className="bg-[#f4d21f] text-black px-2 py-1 inline-block -skew-x-2 transform my-1">
                AutoFix.
              </span>
              {/* <br />
              would meet. */}
            </h2>

            <p className="mt-8 max-w-md text-white/70 leading-relaxed text-[15px]">
              See how AutoFix understands customer questions, retrieves relevant
              business information, and delivers accurate responses in real
              time.
            </p>

            <ul className="mt-10 space-y-4 text-white/90 text-[15px]">
              {[
                "Natural conversations",
                "Private business knowledge",
                "Fast AI chat responses",
              ].map((text) => (
                <li key={text} className="flex items-center gap-3">
                  <Check
                    className="w-5 h-5 text-[#ef4d00] shrink-0"
                    strokeWidth={3}
                  />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT CHAT */}
          <ChatDemo />
        </div>
      </div>
    </section>
  );
}

function ChatDemo() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const scrollRef = useRef(null);

  const sessionId = useRef(
    crypto.randomUUID?.() || Math.random().toString(36).slice(2),
  );

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hey 👋 I'm AutoFix. I'm trained on this whole product — ask me anything, or try one of the suggestions below.",
    },
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  const send = async (textToSend) => {
    if (isLoading) return;

    const finalMessage = textToSend || input;

    if (!finalMessage.trim()) return;

    const updatedMessages = [
      ...messages,
      {
        role: "user",
        text: finalMessage,
      },
    ];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session_id: sessionId.current,
            messages: updatedMessages.map((m) => ({
              role: m.role,
              content: m.text,
            })),
          }),
        },
      );

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.reply || "Sorry, I couldn't generate a response.",
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Connection failed. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#f7f3ed] rounded-[32px] border border-[#d8d0c5] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)] h-full min-h-[540px] flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#d8d0c5] flex items-center justify-between bg-white/50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#ef4d00] flex items-center justify-center shrink-0">
            <Bot className="w-4 h-4 text-white" />
          </div>

          <div>
            <div className="text-sm font-semibold text-black">AutoFix</div>
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Online · replies in ~1s
            </div>
          </div>
        </div>

        <div className="text-[10px] uppercase tracking-[0.1em] font-semibold text-neutral-400">
          Demo
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((m, index) => {
          if (m.role === "user") {
            return (
              <div key={index} className="flex justify-end">
                <div className="max-w-[80%] text-[15px] text-black">
                  {m.text}
                </div>
              </div>
            );
          }

          return (
            <div key={index} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#ef4d00] flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4 text-white" />
              </div>

              <div className="max-w-[420px] text-[15px] leading-relaxed text-black pt-1">
                {m.text}
              </div>
            </div>
          );
        })}

        {/* Loading */}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-[#ef4d00] flex items-center justify-center shrink-0 mt-1">
              <Bot className="w-4 h-4 text-white" />
            </div>

            <div className="flex items-center gap-1 pt-3">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neutral-400" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neutral-400 [animation-delay:120ms]" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neutral-400 [animation-delay:240ms]" />
            </div>
          </div>
        )}
      </div>

      {/* Suggestions + Input */}
      <div className="px-4 pb-4 bg-[#f7f3ed] shrink-0">
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 mb-4 px-2 border-t border-[#d8d0c5] pt-4">
            {SUGGESTED.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                disabled={isLoading}
                className="rounded-full border border-[#d8d0c5] bg-white px-4 py-2 text-[13px] text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300 transition-colors disabled:opacity-50 text-left"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className={`relative bg-white rounded-2xl border border-[#d8d0c5] p-2 flex items-center shadow-sm mx-2 ${
            messages.length > 1 ? "mt-4" : ""
          }`}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message AutoFix..."
            disabled={isLoading}
            className="w-full bg-transparent pl-4 pr-14 py-2 text-[15px] outline-none placeholder:text-neutral-400 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`absolute right-2 w-9 h-9 rounded-full text-white flex items-center justify-center transition-all ${
              input.trim() ? "bg-[#ef4d00] hover:scale-105" : "bg-[#f2b59f]"
            } disabled:opacity-50`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
