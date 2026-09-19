import { useEffect } from 'react';
import { type AnnouncementColor, chatMessagesCollection } from './chat-messages';

// Demo chat, with "{channel}" standing for the channel the preview names.
const MOCK_MESSAGES: Array<{
  user: string;
  color: string;
  platform: 'twitch' | 'kick';
  badges?: string[];
  message: string;
  replyTo?: { user: string; message: string };
  firstMessage?: boolean;
  variant?: 'announcement' | 'highlighted';
  announcementColor?: AnnouncementColor;
}> = [
  {
    user: 'MonkeyDLuffy',
    color: '#FF4500',
    platform: 'twitch',
    badges: ['broadcaster'],
    message: 'GOMU GOMU NO... GG! 🍖🏴‍☠️',
  },
  {
    user: 'Goku',
    color: '#FFA500',
    platform: 'kick',
    badges: ['broadcaster'],
    message: 'That clutch power level is over 9000! 💥🔥',
  },
  {
    user: 'GojoSatoru',
    color: '#00BFFF',
    platform: 'twitch',
    badges: ['moderator', 'vip'],
    message: 'Throughout heaven and earth, this stream alone is honored 🤞✨',
  },
  {
    user: 'RoronoaZoro',
    color: '#22C55E',
    platform: 'kick',
    badges: ['subscriber'],
    message: 'Wait... which stream is this? I got lost again ⚔️🧭',
    replyTo: { user: 'Goku', message: 'That clutch power level is over 9000! 💥🔥' },
  },
  {
    user: 'NarutoUzumaki',
    color: '#FF8C00',
    platform: 'twitch',
    badges: ['vip', 'subscriber'],
    message: 'Believe it! Best stream on the platform dattebayo! 🍜🍥',
  },
  {
    user: 'Tanjiro',
    color: '#20B2AA',
    platform: 'kick',
    badges: ['subscriber'],
    message: 'Total Concentration... Gaming Breathing, First Form! 🌊⚔️',
  },
  {
    user: 'Frieren',
    color: '#E0E7FF',
    platform: 'twitch',
    badges: ['subscriber'],
    message: "@{channel} I've been watching you for only 80 years, time flies 🪄⏳",
  },
  {
    user: 'AnyaForger',
    color: '#FF69B4',
    platform: 'kick',
    badges: ['vip'],
    message: 'WAKU WAKU!! Peanut power activated! 🥜✨',
  },
  {
    user: 'SungJinwoo',
    color: '#9333EA',
    platform: 'twitch',
    badges: ['broadcaster', 'subscriber'],
    message: 'Arise... and drop a follow! 👑🗡️',
  },
  {
    user: 'LeviAckerman',
    color: '#10B981',
    platform: 'twitch',
    badges: ['moderator'],
    message: 'Clean gameplay and incredible focus! ✨🎮',
  },
  {
    user: 'Nezuko',
    color: '#FF69B4',
    platform: 'kick',
    badges: ['moderator'],
    message: "Mmm-hmm! Let's go team! 🌸🎋",
  },
  {
    user: 'Killua',
    color: '#38BDF8',
    platform: 'twitch',
    badges: ['subscriber', 'vip'],
    message: 'Clip that lightning fast clutch right now! ⚡🐱',
    variant: 'highlighted',
  },
  {
    user: 'Denji',
    color: '#F59E0B',
    platform: 'kick',
    badges: ['subscriber'],
    message: "LET'S GOOOOO TOAST AND JAM ENERGY! 🍞✨",
  },
  {
    user: 'Chopper',
    color: '#38BDF8',
    platform: 'twitch',
    message: 'First time here, Senchabot makes the stream so colorful! 🌸🩺',
    firstMessage: true,
  },
  {
    user: 'Usopp',
    color: '#A3E635',
    platform: 'twitch',
    badges: ['subscriber'],
    message: '!uptime',
  },
  {
    user: 'Nightbot',
    color: '#7C7CE1',
    platform: 'twitch',
    badges: ['moderator'],
    message: 'The stream has been live for 2 hours 14 minutes',
  },
  {
    user: 'Saitama',
    color: '#FACC15',
    platform: 'kick',
    badges: ['subscriber'],
    message: 'One punch victory! Just a gamer having fun 🥊🥚',
  },
  {
    user: 'Senchabot',
    color: '#00DB84',
    platform: 'twitch',
    badges: ['moderator'],
    message: 'Welcome friends to the stream! Type !commands to see what I can do 🍵🚀',
    variant: 'announcement',
    // A plain /announce, whose colors the setup's Announcements checkbox shows.
    announcementColor: 'PRIMARY',
  },
];

/**
 * Demo chat for the setup preview and for a link without channels: a line every 3 s, or `rate`
 * lines a second.
 */
export function useMockChat(enabled: boolean, channel: string, rate: number | undefined) {
  useEffect(() => {
    if (!enabled) return;

    let messageCounter = 0;
    const insertedIds: string[] = [];

    const insertNextMock = () => {
      const item = MOCK_MESSAGES[messageCounter % MOCK_MESSAGES.length];
      const id = `mock-${Date.now()}-${messageCounter}`;
      messageCounter++;
      insertedIds.push(id);

      chatMessagesCollection.insert({
        id,
        user: item.user,
        message: item.message.replace('{channel}', channel),
        platform: item.platform,
        timestamp: new Date(),
        color: item.color,
        badges: item.badges,
        receivedAt: new Date(),
        userLower: item.user.toLowerCase(),
        replyTo: item.replyTo,
        firstMessage: item.firstMessage,
        variant: item.variant,
        announcementColor: item.announcementColor,
      });

      if (insertedIds.length > 20) {
        const oldestId = insertedIds.shift();
        if (oldestId) {
          chatMessagesCollection.delete(oldestId);
        }
      }
    };

    const firstTimer = setTimeout(insertNextMock, 400);
    const interval = setInterval(insertNextMock, rate ? 1000 / rate : 3000);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
      for (const id of insertedIds) {
        chatMessagesCollection.delete(id);
      }
    };
  }, [enabled, rate, channel]);
}
