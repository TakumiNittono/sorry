import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { messages, user } = await request.json();

    if (!messages?.length || messages[messages.length - 1]?.role !== 'user') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const apiKey = process.env.DIFY_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const lastMessage = messages[messages.length - 1];
    const response = await fetch('https://api.dify.ai/v1/chat-messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: lastMessage.content,
        inputs: { query: lastMessage.content },
        response_mode: 'streaming',
        user: user || 'user-123',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      return NextResponse.json({ error: errorText }, { status: response.status });
    }

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              controller.close();
              break;
            }

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  controller.close();
                  return;
                }

                try {
                  const parsed = JSON.parse(data);
                  if (parsed.event === 'message' && parsed.answer) {
                    controller.enqueue(
                      new TextEncoder().encode(`data: ${JSON.stringify({ content: parsed.answer })}\n\n`)
                    );
                  } else if (parsed.event === 'message_end') {
                    controller.enqueue(
                      new TextEncoder().encode(`data: ${JSON.stringify({ content: parsed.answer || '', done: true })}\n\n`)
                    );
                    controller.close();
                    return;
                  } else if (parsed.event === 'error') {
                    controller.enqueue(
                      new TextEncoder().encode(`data: ${JSON.stringify({ error: parsed.message || 'Unknown error', done: true })}\n\n`)
                    );
                    controller.close();
                    return;
                  }
                } catch (e) {
                  continue;
                }
              }
            }
          }
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

