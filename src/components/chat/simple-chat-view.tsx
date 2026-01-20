'use client';

import {
  ChatBubble,
  ChatBubbleMessage,
} from '@/components/ui/chat/chat-bubble';
import { Message, ChatRequestOptions } from '@ai-sdk/react';
import { motion } from 'framer-motion';
import ChatMessageContent from './chat-message-content';
import ToolRenderer from './tool-renderer';

interface SimplifiedChatViewProps {
  message: Message;
  isLoading: boolean;
  reload: (
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
  addToolResult?: (args: { toolCallId: string; result: string }) => void;
}

const MOTION_CONFIG = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: {
    duration: 0.5,
    ease: [0.4, 0, 0.2, 1],
  },
};

export function SimplifiedChatView({
  message,
  isLoading,
  reload,
  addToolResult,
}: SimplifiedChatViewProps) {
  if (message.role !== 'assistant') return null;

  // Extract tool invocations
  const toolInvocations =
    message.parts
      ?.filter(
        (part) =>
          part.type === 'tool-invocation' &&
          part.toolInvocation?.state === 'result'
      )
      .map((part) =>
        part.type === 'tool-invocation' ? part.toolInvocation : null
      )
      .filter(Boolean) || [];

  const currentTool = toolInvocations.length > 0 ? [toolInvocations[0]] : [];
  const hasTextContent = (message.content && message.content.trim().length > 0) || 
                         (message.parts?.some(p => p.type === 'text' && p.text && p.text.trim().length > 0) || false);
  const hasTools = currentTool.length > 0;
  
  return (
    <div className="flex w-full flex-col">
      {/* Tool invocation result */}
      {hasTools && (
        <div className="mb-2 w-full">
          <ToolRenderer
            toolInvocations={currentTool}
            messageId={message.id || 'current-msg'}
          />
        </div>
      )}

      {/* Text content */}
      {(hasTextContent || isLoading) && (
        <div className="w-full">
          <ChatMessageContent
            message={message}
            isLast={true}
            isLoading={isLoading}
            reload={reload}
            addToolResult={addToolResult}
            skipToolRendering={true}
          />
          {isLoading && !hasTextContent && (
            <div className="flex space-x-1 mt-2">
              <div className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
