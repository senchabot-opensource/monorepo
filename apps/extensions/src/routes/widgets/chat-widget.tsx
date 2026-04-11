import { useLiveQuery } from '@tanstack/react-db';
import { createFileRoute } from '@tanstack/react-router';
import React from 'react';
import { z } from 'zod';
import { chatMessagesCollection } from '#/features/widgets/chat-widget/chat-messages';
import { useUnifiedChat } from '#/features/widgets/chat-widget/use-unified-chat';

const TTL_MS = 30_000;

export const getKickId = async (username: string): Promise<string | null> => {
  try {
    const response = await fetch(`https://kick.com/api/v1/channels/${username}`);
    if (!response.ok) throw new Error('Channel not found');
    const data = await response.json<any>();
    return data.chatroom.id.toString();
  } catch (error) {
    console.error('Error while fething channel:', error);
    return null;
  }
};

export const parseEmotes = (text: string, platform: 'twitch' | 'kick') => {
  if (platform === 'kick') {
    const kickEmoteRegex = /\[emote:(\d+):([\w\d\-_]+)\]/g;

    return text.split(kickEmoteRegex).map((part, index) => {
      if (index % 3 === 1) {
        const id = part;
        return (
          <img
            key={`${id}-${index.toString()}`}
            src={`https://files.kick.com/emotes/${id}/fullsize`}
            alt="emote"
            className="inline-block h-8 w-8 mx-1 align-middle object-contain"
          />
        );
      }
      if (index % 3 === 2) return null;
      return part;
    });
  }

  return text;
};

const searchSchema = z.object({
  twitch: z.string().optional(),
  kick: z.string().optional(),
  fontSize: z.number().optional().default(18),
  background: z.boolean().optional(),
});

export const Route = createFileRoute('/widgets/chat-widget')({
  validateSearch: (search) => searchSchema.parse(search),
  loaderDeps: ({ search }) => ({
    kick: search.kick,
  }),
  component: RouteComponent,
  loader: async ({ deps }) => {
    if (!deps.kick) {
      return { kick: null };
    }

    const kick = await getKickId(deps.kick);
    return { kick };
  },
});

function RouteComponent() {
  const search = Route.useSearch();
  const { kick } = Route.useLoaderData();

  useUnifiedChat(search.twitch, kick);

  const [now, setNow] = React.useState(() => Date.now());

  const { data: messages } = useLiveQuery((q) =>
    q
      .from({ collection: chatMessagesCollection })
      .orderBy(({ collection }) => collection.timestamp),
  );

  const visibleMessages = messages.filter((msg) => {
    const receivedAtMs = msg.receivedAt?.getTime() ?? msg.timestamp.getTime();
    return now - receivedAtMs < TTL_MS;
  });

  const hasVisibleMessages = visibleMessages.length > 0;

  React.useEffect(() => {
    if (!hasVisibleMessages) {
      return;
    }

    setNow(Date.now());
    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [hasVisibleMessages]);

  return (
    <div
      className="flex flex-col justify-end min-h-screen w-full p-2.5 text-white overflow-hidden font-sans rounded-md"
      style={{
        fontSize: `${search.fontSize}px`,
        backgroundColor: search.background ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
      }}
    >
      <div className="flex flex-col space-y-0.5">
        {visibleMessages.map((msg) => (
          <div
            key={msg.id}
            className="leading-tight whitespace-pre-wrap wrap-break-word text-left animate-in fade-in slide-in-from-left-2 duration-200"
          >
            <span
              className="mr-2 data-[platform=twitch]:text-purple-500 data-[platform=kick]:text-green-500"
              data-platform={msg.platform}
            >
              [{msg.platform}]
            </span>
            <span style={{ color: msg.color || 'unset' }}>{msg.user}:</span>{' '}
            <span>{parseEmotes(msg.message, msg.platform)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
