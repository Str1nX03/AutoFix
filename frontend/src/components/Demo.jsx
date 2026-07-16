"use client";

import React, {
  useState,
  useRef,
  useEffect,
  createContext,
  useContext,
  forwardRef,
  useId,
} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot, Send, Check, Loader2 } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const THEMES = { light: "", dark: ".dark" };

const ChatContext = createContext(null);

export function useChatConfig() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatConfig must be used within a <ChatContainer />");
  }
  return context;
}

const ChatStyle = ({ id, config }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color
  );

  if (!colorConfig.length) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chat=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color = itemConfig.theme?.[theme] || itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  );
};

export const ChatContainer = forwardRef(
  ({ id, className, children, config, ...props }, ref) => {
    const uniqueId = useId();
    const chatId = `chat-${id || uniqueId.replace(/:/g, "")}`;

    return (
      <ChatContext.Provider value={{ config }}>
        <div
          data-chat={chatId}
          ref={ref}
          className={cn(
            "flex flex-col overflow-hidden rounded-[32px] border border-[var(--color-border)] bg-[var(--color-background)] shadow-[0_10px_30px_rgba(0,0,0,0.08)]",
            className
          )}
          {...props}
        >
          <ChatStyle id={chatId} config={config} />
          {children}
        </div>
      </ChatContext.Provider>
    );
  }
);
ChatContainer.displayName = "ChatContainer";

const SUGGESTED = [
  "What can you actually do?",
  "Why should I use AutoFix instead of a chatbot?",
  "How long does it take to deploy?",
  "Which tools do you integrate with?",
];

// Define your color theme using the Config system
const demoChatConfig = {
  primary: { color: "#ef4d00" },
  background: { color: "#f7f3ed" },
  border: { color: "#d8d0c5" },
  buttonDisabled: { color: "#f2b59f" },
};

export default function DemoSection() {
  return (
    <section id="demo" className="bg-[#f5f0e9] py-20 lg:py-28 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-6">
          {/* LEFT SIDE */}
          <div className="flex-shrink-0 w-full lg:w-1/2">
            <div className="bg-[#120905] rounded-[32px] p-8 lg:p-12 text-white flex flex-col justify-center h-full">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-bold mb-6">
                ✺ SEE AUTOFIX IN ACTION
              </p>

              <h2 className="text-5xl lg:text-[4rem] font-serif font-bold leading-[1.05] tracking-tight">
                See how your
                <br />
                customers
                <br />
                will experience{" "}
                <span className="bg-[#f4d21f] text-black px-2 py-1 inline-block -skew-x-2 transform my-1">
                  AutoFix.
                </span>
              </h2>

              <p className="mt-8 max-w-md text-white/70 leading-relaxed text-[15px]">
                See how AutoFix understands customer questions, retrieves
                relevant business information, and delivers accurate responses
                in real time.
              </p>

              <ul className="mt-10 space-y-4 text-[15px] font-semibold">
                {[
                  "Natural conversations",
                  "Private business knowledge",
                  "Fast AI chat responses",
                ].map((text) => (
                  <li key={text} className="flex items-center gap-3 ">
                    <Check
                      className="w-5 h-5 text-[#EF4D00] shrink-0"
                      strokeWidth={3}
                    />
                    <div className="border-b-2 border-[#EF4D00]">{text}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT SIDE - CHAT */}
          <div className="flex-shrink-0 w-full lg:w-1/2">
            <ChatDemo className="w-full h-[700px]" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function ChatDemo({ className }) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isBackendReady, setIsBackendReady] = useState(false);
  const [isCheckingBackend, setIsCheckingBackend] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const sessionId = useRef(
    crypto.randomUUID?.() || Math.random().toString(36).slice(2)
  );

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hey 👋 I'm AutoFix. I'm trained on this whole product — ask me anything, or try one of the suggestions below.",
    },
  ]);

  useEffect(() => {
    let interval;

    const checkBackend = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`);
        const contentType = res.headers.get("content-type");

        if (res.ok && contentType && contentType.includes("application/json")) {
          setIsBackendReady(true);
          setIsCheckingBackend(false);
          setIsHovering(false);
          clearInterval(interval);
        }
      } catch (error) {
        console.log("Backend sleeping....");
      }
    };
    checkBackend();

    interval = setInterval(checkBackend, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isLoading && messages.length > 1 && inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  }, [isLoading, messages.length]);

  const send = async (textToSend) => {
    if (isLoading || !isBackendReady) return;

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
        `${process.env.NEXT_PUBLIC_API_URL || ""}/api/chat`,
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
        }
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
    <>
      {!isBackendReady && isHovering && (
        <div
          className="fixed z-50 pointer-events-none px-3 py-1.5 bg-neutral-900/90 text-white text-[12px] font-medium rounded-lg shadow-xl backdrop-blur-sm whitespace-nowrap"
          style={{
            left: mousePos.x + 16,
            top: mousePos.y + 16,
          }}
        >
          Backend waking up... Please wait
        </div>
      )}

      <ChatContainer
        config={demoChatConfig}
        className={cn("h-full overflow-hidden relative", className)}
        // --- NEW MOUSE EVENT HANDLERS ---
        onMouseMove={(e) => {
          if (!isBackendReady) {
            setMousePos({ x: e.clientX, y: e.clientY });
          }
        }}
        onMouseEnter={() => {
          if (!isBackendReady) setIsHovering(true);
        }}
        onMouseLeave={() => {
          setIsHovering(false);
        }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between bg-white/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-black">AutoFix</div>
              <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Online · replies in ~5s
              </div>
            </div>
          </div>
          <div className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400">
            Demo
          </div>
        </div>

        {/* backend ready check message */}
        {isCheckingBackend && (
          <div className="mx-6 mt-4 rounded-xl border border-yellow-300 bg-yellow-50 px-4 py-3">
            <p className="text-sm font-medium text-black">
              Preparing AutoFix AI
            </p>
            <p className="mt-1 text-xs text-black">
              This demo is hosted on <strong>Render's free tier.</strong> The
              first startup may take up to 60 seconds.
            </p>
          </div>
        )}

        {/* Messages Container */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-6 py-6 space-y-6 min-h-0 scroll-smooth"
        >
          {messages.map((m, index) => {
            if (m.role === "user") {
              return (
                <div key={index} className="flex justify-end">
                  <div className="max-w-[75%] text-[15px] text-black bg-white border border-[var(--color-border)] px-4 py-2 rounded-2xl rounded-tr-sm break-words">
                    {m.text}
                  </div>
                </div>
              );
            }

            return (
              <div key={index} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="max-w-[80%] pt-1 break-words">
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        table: ({ node, ...props }) => (
                          <div className="overflow-x-auto my-4 pb-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-neutral-400">
                            <table
                              className="min-w-full border-collapse border border-[var(--color-border)] text-sm"
                              {...props}
                            />
                          </div>
                        ),
                        thead: ({ node, ...props }) => (
                          <thead className="bg-black/5" {...props} />
                        ),
                        th: ({ node, ...props }) => (
                          <th
                            className="border border-[var(--color-border)] px-4 py-2 text-left font-semibold text-black"
                            {...props}
                          />
                        ),
                        td: ({ node, ...props }) => (
                          <td
                            className="border border-[var(--color-border)] px-4 py-2"
                            {...props}
                          />
                        ),
                      }}
                    >
                      {m.text}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center flex-shrink-0 mt-1">
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

        {/* Input Section */}
        <div className="px-4 py-4 bg-[var(--color-background)] border-t border-[var(--color-border)] flex-shrink-0 space-y-3">
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2">
              {SUGGESTED.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  disabled={isLoading || !isBackendReady}
                  className="rounded-full border border-[var(--color-border)] bg-white px-3 py-1.5 text-[12px] text-neutral-600 hover:bg-neutral-50 transition-colors disabled:opacity-50 whitespace-nowrap disabled:cursor-not-allowed"
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
            className="relative flex items-center gap-2"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isBackendReady ? "Message AutoFix..." : "Waking up backend..."
              }
              disabled={isLoading || !isBackendReady}
              className="flex-1 bg-white rounded-2xl border border-[var(--color-border)] px-4 py-2 text-[15px] outline-none placeholder:text-neutral-400 disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={isLoading || !input.trim() || !isBackendReady}
              className={cn(
                "w-9 h-9 rounded-full text-white flex items-center justify-center transition-all flex-shrink-0 disabled:opacity-50",
                input.trim()
                  ? "bg-[var(--color-primary)] hover:scale-105"
                  : "bg-[var(--color-buttonDisabled)]"
              )}
            >
              {isBackendReady ? (
                <Send className="w-4 h-4" />
              ) : (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
            </button>
          </form>
        </div>
      </ChatContainer>
    </>
  );
}
