// @ts-nocheck
import OpenAI from 'openai';
import { SYSTEM_PROMPTS } from './prompt';
import { getContact } from './tools/getContact';
import { getInternship } from './tools/getInternship';
import { getPresentation } from './tools/getPresentation';
import { getProjects } from './tools/getProjects';
import { getResume } from './tools/getResume';
import { getSkills } from './tools/getSkills';

export const maxDuration = 30;

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

// Helper to convert AI SDK tools to OpenAI function format
const toolsMap: Record<string, any> = {
  getProjects,
  getPresentation,
  getResume,
  getContact,
  getSkills,
  getInternship,
};

function convertToolsToOpenAI(tools: Record<string, any>) {
  return Object.entries(tools).map(([name, tool]) => ({
    type: 'function' as const,
    function: {
      name,
      description: tool.description,
      parameters: (tool as any).parameters ? (tool as any).parameters.shape ? {} : {} : {}, // Basic mapping
    },
  }));
}

// More specific tool definitions for OpenAI since the above is too simple
const OPENAI_TOOLS = [
  {
    type: "function" as const,
    function: {
      name: "getPresentation",
      description: "Get a short presentation/bio about Ali",
      parameters: { 
        type: "object", 
        properties: {},
        required: []
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "getProjects",
      description: "Get details about Ali's technical projects and portfolio",
      parameters: { 
        type: "object", 
        properties: {
          query: { type: "string", description: "Optional specific project to look for" }
        },
        required: []
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "getResume",
      description: "Get Ali's professional resume and work history",
      parameters: { 
        type: "object", 
        properties: {
          section: { type: "string", description: "Optional specific section of resume" }
        },
        required: []
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "getContact",
      description: "Get Ali's contact information and social links",
      parameters: { 
        type: "object", 
        properties: {},
        required: []
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "getSkills",
      description: "Get a list of Ali's technical and soft skills",
      parameters: { 
        type: "object", 
        properties: {
          category: { type: "string", description: "Optional skill category (frontend, backend, ai, etc)" }
        },
        required: []
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "getInternship",
      description: "Get information about Ali's internship availability and preferences",
      parameters: { 
        type: "object", 
        properties: {},
        required: []
      }
    }
  }
];

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1].content;
    
    // 1. ROUTING STEP
    const routerResponse = await openai.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPTS.ROUTER },
        { role: 'user', content: lastMessage }
      ],
      temperature: 0,
    });

    const intent = routerResponse.choices[0].message.content || 'GENERAL';
    console.log('[CHAT-API] Detected Intent:', intent);

    // 2. AGENT SELECTION
    let systemContent = SYSTEM_PROMPTS.GENERAL;
    if (intent.includes('PROJECTS')) systemContent = SYSTEM_PROMPTS.PROJECTS;
    else if (intent.includes('RESUME')) systemContent = SYSTEM_PROMPTS.RESUME;
    else if (intent.includes('CONTACT')) systemContent = SYSTEM_PROMPTS.CONTACT;

    // Build message list for OpenAI
    const apiMessages: any[] = [
      { role: 'system', content: systemContent },
      ...messages.map((m: any) => ({
        role: m.role,
        content: m.content,
      }))
    ];

    // 3. TOOL EXECUTION STEP (Non-streaming first call)
    console.log('[CHAT-API] Checking for tool calls...');
    const initialResponse = await openai.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: apiMessages,
      tools: OPENAI_TOOLS,
      tool_choice: 'auto',
    });

    const message = initialResponse.choices[0].message;

    if (message.tool_calls && message.tool_calls.length > 0) {
      console.log(`[CHAT-API] Executing ${message.tool_calls.length} tools`);
      
      apiMessages.push(message);

      for (const toolCall of message.tool_calls) {
        const fnName = (toolCall as any).function.name;
        const fnArgs = JSON.parse((toolCall as any).function.arguments || '{}');
        console.log(`[CHAT-API] Calling tool: ${fnName}`, fnArgs);

        if (toolsMap[fnName]) {
          try {
            // Execute the tool (most of ours are async execute: () => ...)
            const result = await toolsMap[fnName].execute(fnArgs);
            apiMessages.push({
              tool_call_id: toolCall.id,
              role: "tool",
              name: fnName,
              content: JSON.stringify(result)
            });
          } catch (err: any) {
            console.error(`Tool execution failed: ${err.message}`);
            apiMessages.push({
              tool_call_id: toolCall.id,
              role: "tool",
              name: fnName,
              content: JSON.stringify({ error: err.message })
            });
          }
        }
      }

      // Step 4: Stream Final Response after tool results are added
      const stream = await openai.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: apiMessages,
        stream: true,
      });

      return transformOpenAIStream(stream);
    } else {
      // No tools, just stream the response
      const stream = await openai.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: apiMessages,
        stream: true,
      });

      return transformOpenAIStream(stream);
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
}

/**
 * Transforms an OpenAI stream into a standard ReadableStream of text deltas
 */
function transformOpenAIStream(stream: AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>) {
  const encoder = new TextEncoder();
  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }
        controller.close();
      } catch (e) {
        controller.error(e);
      }
    },
  });

  return new Response(readableStream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}