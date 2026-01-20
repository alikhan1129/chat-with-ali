"use client";
import { useChat } from "@ai-sdk/react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

// Component imports
import ChatBottombar from "@/components/chat/chat-bottombar";
import ChatLanding from "@/components/chat/chat-landing";
import ChatMessageContent from "@/components/chat/chat-message-content";
import { SimplifiedChatView } from "@/components/chat/simple-chat-view";
import { PresetReply } from "@/components/chat/preset-reply";
import { presetReplies, profileInfo, getConfig } from "@/lib/config-loader";
import {
  ChatBubble,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import HelperBoost from "./HelperBoost";
import Image from "next/image";
import { ThemeToggle } from "../ThemeToggle";

// ClientOnly component for client-side rendering
//@ts-ignore
const ClientOnly = ({ children }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
};

// Define Avatar component props interface
interface AvatarProps {
  hasActiveTool: boolean;
}

// Dynamic import of Avatar component
const Avatar = dynamic<AvatarProps>(
  () =>
    Promise.resolve(({ hasActiveTool }: AvatarProps) => {
      // Conditional rendering based on detection
      return (
        <div
          className={`flex items-center justify-center rounded-full transition-all duration-300    ${hasActiveTool ? "h-20 w-20" : "h-28 w-28"}`}
        >
          <div
            className="relative cursor-pointer top-1"
            onClick={() => (window.location.href = "/")}
          >
            {/* <img
              src="/Toon.jpeg"
              alt="Avatar"
              className="h-full w-full object-cover object-[center_top_-5%] scale-95 rounded-full"
            /> */}

            <Image
              width={100}
              height={100}
              src={getConfig().personal.avatar}
              alt="Avatar"
              className="h-full w-full object-cover object-[center_top_-5%] scale-95 rounded-full"
            />
          </div>
        </div>
      );
    }),
  { ssr: false }
);

const MOTION_CONFIG = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: {
    duration: 0.5,
    ease: [0.4, 0, 0.2, 1] as const,
  },
};

const Chat = () => {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query");
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [presetReply, setPresetReply] = useState<{
    question: string;
    reply: string;
    tool: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    setMessages,
    setInput,
    reload,
    addToolResult,
    append,
  } = useChat({
    streamProtocol: "text", // Explicitly set to 'text' to match the backend
    onResponse: (response) => {
      if (response) {
        setLoadingSubmit(false);
      }
    },
    onFinish: () => {
      setLoadingSubmit(false);
    },
    onError: (error) => {
      setLoadingSubmit(false);
      console.error("Chat error:", error.message, error.cause);

      const isQuotaError = 
        error.message?.includes("quota") ||
        error.message?.includes("exceeded") ||
        error.message?.includes("429");

      if (isQuotaError) {
        // Show a friendly notification for quota issues
        toast.error(
          `⚠️ API Quota Exhausted! The AI service limit has been reached. Please contact ${profileInfo.name.split(' ')[0]} directly or use preset questions. Thank you! 🙏`,
          {
            duration: 6000,
            style: {
              background: "#fef3c7",
              border: "1px solid #f59e0b",
              color: "#92400e",
              fontSize: "14px",
              fontWeight: "500",
            },
          }
        );

        setErrorMessage("quota_exhausted");

        try {
          append({
            role: "assistant",
            content: `⚠️ **API Quota Exhausted**\n\nGroq API limit reached. Please contact ${profileInfo.name.split(' ')[0]} directly or use preset questions below.`,
          });
        } catch (appendError) {
          console.error("Failed to append error message:", appendError);
        }
      } else {
        // Show the ACTUAL error to help debugging
        toast.error(`Error: ${error.message || "Unknown chat error"}`);
        // Only set error message for the UI if it's a quota issue, 
        // otherwise let the user see the actual error in the toast
        // setErrorMessage(error.message); 
      }
    },
    onToolCall: (tool) => {
      const toolName = tool.toolCall.toolName;
      console.log("Tool call:", toolName);
    },
  });

  const { currentAIMessage, latestUserMessage, hasActiveTool } = useMemo(() => {
    const latestAIMessageIndex = messages.findLastIndex(
      (m) => m.role === "assistant"
    );
    const latestUserMessageIndex = messages.findLastIndex(
      (m) => m.role === "user"
    );

    const result = {
      currentAIMessage:
        latestAIMessageIndex !== -1 ? messages[latestAIMessageIndex] : null,
      latestUserMessage:
        latestUserMessageIndex !== -1 ? messages[latestUserMessageIndex] : null,
      hasActiveTool: false,
    };

    if (result.currentAIMessage) {
      result.hasActiveTool =
        result.currentAIMessage.parts?.some(
          (part) =>
            part.type === "tool-invocation" &&
            part.toolInvocation?.state === "result"
        ) || false;
    }

    if (latestAIMessageIndex < latestUserMessageIndex) {
      result.currentAIMessage = null;
    }

    return result;
  }, [messages]);

  const isToolInProgress = messages.some(
    (m) =>
      m.role === "assistant" &&
      m.parts?.some(
        (part) =>
          part.type === "tool-invocation" &&
          part.toolInvocation?.state !== "result"
      )
  );

  //@ts-ignore
  const submitQuery = (query) => {
    if (!query.trim() || isToolInProgress) return;

    // Clear any previous error message
    setErrorMessage(null);

    // Check if this is a preset question first
    if (presetReplies[query]) {
      const preset = presetReplies[query];
      setPresetReply({
        question: query,
        reply: preset.reply,
        tool: preset.tool,
      });
      setLoadingSubmit(false);
      return;
    }

    setLoadingSubmit(true);
    setPresetReply(null); // Clear any preset reply when submitting new query
    append({
      role: "user",
      content: query,
    });
  };

  //@ts-ignore
  const submitQueryToAI = (query) => {
    if (!query.trim() || isToolInProgress) return;

    // Clear any previous error message
    setErrorMessage(null);

    // Force AI response, bypass preset checking
    setLoadingSubmit(true);
    setPresetReply(null);
    append({
      role: "user",
      content: query,
    });
  };

  //@ts-ignore
  const handlePresetReply = (question, reply, tool) => {
    setPresetReply({ question, reply, tool });
    setLoadingSubmit(false);
  };

  //@ts-ignore
  const handleGetAIResponse = (question, tool) => {
    setPresetReply(null);
    submitQueryToAI(question); // Use the new function that bypasses presets
  };

  useEffect(() => {
    if (initialQuery && !autoSubmitted) {
      setAutoSubmitted(true);
      setInput("");
      submitQuery(initialQuery);
    }
  }, [initialQuery, autoSubmitted]);

  //@ts-ignore
  const onSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isToolInProgress) return;
    submitQueryToAI(input); // User input should go directly to AI
    setInput("");
  };

  const handleStop = () => {
    stop();
    setLoadingSubmit(false);
  };

  // Check if this is the initial empty state (no messages)
  const isEmptyState =
    !currentAIMessage &&
    !latestUserMessage &&
    !loadingSubmit &&
    !presetReply &&
    !errorMessage;

  // Calculate header height based on state
  const headerHeight = hasActiveTool ? 100 : 160;

  return (
    <div className="relative h-screen overflow-hidden dark:bg-black flex flex-col">
      {/* Fixed Avatar Header with Gradient - REVERTED to original style */}
      <div
        className="fixed top-0 right-0 left-0 z-50 bg-[linear-gradient(to_bottom,rgba(255,255,255,1)_0%,rgba(255,255,255,0.95)_30%,rgba(255,255,255,0.8)_50%,rgba(255,255,255,0)_100%)] dark:bg-none"
      >
        <div className="py-6">
          <div className="flex justify-center">
            <ClientOnly>
              <Avatar hasActiveTool={hasActiveTool} />
            </ClientOnly>
          </div>
        </div>
      </div>

      {/* Messages Area - Maintain scrollable list but with padding for fixed header */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50/30 dark:bg-black" style={{ paddingTop: '180px' }}>
        <div className="container mx-auto max-w-3xl px-4 py-4 space-y-6 min-h-[500px]">
          <AnimatePresence initial={false}>
            {isEmptyState ? (
              <motion.div
                key="landing"
                className="flex min-h-[400px] items-center justify-center"
                {...MOTION_CONFIG}
              >
                <ChatLanding
                  submitQuery={submitQuery}
                  handlePresetReply={handlePresetReply}
                />
              </motion.div>
            ) : (
              <>
                {/* Map through ALL messages like in my-support-ai */}
                {messages.map((m, index) => (
                  <motion.div
                    key={m.id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex w-full ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <ChatBubble variant={m.role === 'user' ? 'sent' : 'received'}>
                      <ChatBubbleMessage>
                        {m.role === 'user' ? (
                          <ChatMessageContent message={m} />
                        ) : (
                          <SimplifiedChatView
                            message={m}
                            isLoading={isLoading && index === messages.length - 1}
                            reload={reload}
                            addToolResult={addToolResult}
                          />
                        )}
                      </ChatBubbleMessage>
                    </ChatBubble>
                  </motion.div>
                ))}

                {/* Show Preset Reply if active */}
                {presetReply && (
                  <div className="w-full">
                    <PresetReply
                      question={presetReply.question}
                      reply={presetReply.reply}
                      tool={presetReply.tool}
                      onGetAIResponse={handleGetAIResponse}
                      onClose={() => setPresetReply(null)}
                    />
                  </div>
                )}

                {/* Show Error if active */}
                {errorMessage && (
                  <div className="w-full">
                     {/* Error UI logic here... */}
                  </div>
                )}
                
                {/* Loading state */}
                {loadingSubmit && !currentAIMessage && (
                  <motion.div key="loading" {...MOTION_CONFIG} className="flex justify-start">
                    <ChatBubble variant="received">
                      <ChatBubbleMessage isLoading />
                    </ChatBubble>
                  </motion.div>
                )}
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="flex-shrink-0 w-full bg-white px-2 pt-3 md:px-0 dark:bg-black border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-3 relative">
            <HelperBoost
              submitQuery={submitQuery}
              setInput={setInput}
              handlePresetReply={handlePresetReply}
            />
            <ChatBottombar
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={onSubmit}
              isLoading={isLoading}
              stop={handleStop}
              isToolInProgress={isToolInProgress}
            />
                  </div>
                </div>
              </div>
            );
          };
export default Chat;
