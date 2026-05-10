import React, { useState, useRef, useEffect } from "react";
import { Send, X, MessageCircle, Loader2 } from "lucide-react";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const PROMPT_BATCHES = [
  [
    "Tell me about Rumtek Monastery's history and significance",
    "What's the best time to visit Sikkim monasteries?",
    "Guide me through a 3-day monastery tour in Sikkim",
  ],
  [
    "What are the spiritual practices at Tashiding Monastery?",
    "How do I reach Dubdi Monastery from Yuksom?",
    "What festivals are celebrated at Sikkim monasteries?",
  ],
  [
    "Tell me about the architecture of Pemayangtse Monastery",
    "What should I know before visiting Enchey Monastery?",
    "Suggest a monastery itinerary for 5 days in Sikkim",
  ],
  [
    "What is the significance of Buddhist art in Sikkim?",
    "How many monasteries are there in Sikkim?",
    "What are the entry fees for major monasteries?",
  ],
];

const Monastery360Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPromptBatch, setCurrentPromptBatch] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Rotate prompts every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromptBatch((prev) => (prev + 1) % PROMPT_BATCHES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = async (messageContent: string = inputValue) => {
    if (!messageContent.trim()) return;

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      type: "user",
      content: messageContent,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat-bot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageContent,
          conversationHistory: messages,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      console.log("Chat bot response data:", data);
      const assistantMessage: Message = {
        id: `${Date.now()}-assistant`,
        type: "assistant",
        content: data.reply || data.response || "Unable to process your request.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: `${Date.now()}-error`,
        type: "assistant",
        content: "Sorry, I couldn't process your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentPrompts = PROMPT_BATCHES[currentPromptBatch];

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-yellow-400 hover:bg-yellow-500 text-black rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
          >
            <MessageCircle size={28} className="font-bold" />
            <span className="absolute bottom-full mb-3 right-0 bg-black text-yellow-400 px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Ask about monasteries
            </span>
          </button>
        </div>
      )}

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-8 right-8 z-50 w-96 h-[600px] bg-black rounded-3xl shadow-2xl flex flex-col border border-yellow-400/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-6 flex items-center justify-between">
            <div>
              <h3 className="text-black font-serif italic text-xl font-bold">
                Monastery360 Guide
              </h3>
              <p className="text-black/70 text-xs mt-1">
                Your AI companion for monastery exploration
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-black hover:bg-black/10 p-2 rounded-full transition flex-shrink-0"
            >
              <X size={24} />
            </button>
          </div>

          {/* Messages Container */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-900 via-black to-gray-900 space-y-4"
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="bg-yellow-400/10 border border-yellow-400/20 p-4 rounded-full mb-4">
                  <MessageCircle className="text-yellow-400" size={32} />
                </div>
                <h4 className="text-white font-semibold mb-2">
                  Welcome to Monastery360
                </h4>
                <p className="text-gray-400 text-sm max-w-xs">
                  Ask me anything about monasteries, itineraries, or cultural experiences in Sikkim.
                </p>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.type === "user" ? "justify-end" : "justify-start"
                    } animate-fadeIn`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-sm px-4 py-3 rounded-2xl ${
                        msg.type === "user"
                          ? "bg-yellow-400 text-black rounded-br-none font-medium"
                          : "bg-gray-800 text-gray-200 rounded-bl-none text-sm leading-relaxed border border-gray-700"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start animate-fadeIn">
                    <div className="bg-gray-800 text-gray-300 px-4 py-3 rounded-2xl rounded-bl-none flex items-center space-x-2 border border-gray-700">
                      <Loader2 size={16} className="animate-spin text-yellow-400" />
                      <span className="text-xs">Thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Suggested Prompts */}
          {messages.length === 0 && (
            <div className="px-6 py-4 bg-gray-800/50 border-t border-yellow-400/10">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-3">
                Quick Questions
              </p>
              <div className="space-y-2">
                {currentPrompts.map((prompt, idx) => (
                  <button
                    key={`${currentPromptBatch}-${idx}`}
                    onClick={() => sendMessage(prompt)}
                    disabled={isLoading}
                    className="w-full text-left text-xs text-gray-300 hover:text-yellow-400 bg-gray-900/50 hover:bg-yellow-400/10 p-2 rounded-lg border border-gray-700 hover:border-yellow-400/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed line-clamp-2"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 bg-gray-900 border-t border-yellow-400/10">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !isLoading) {
                    sendMessage();
                  }
                }}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className="flex-1 bg-gray-800 text-white placeholder-gray-500 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-gray-700 disabled:opacity-50"
              />
              <button
                onClick={() => sendMessage()}
                disabled={isLoading || !inputValue.trim()}
                className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-600 text-black rounded-full p-3 transition-all disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
        />
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
};

export default Monastery360Chatbot;