export interface KickChannelInfo {
  chatroomId: string | null;
  channelId: string | null;
}

export const getKickChannelInfo = async (
  username: string,
): Promise<KickChannelInfo> => {
  try {
    const response = await fetch(
      `https://kick.com/api/v1/channels/${username}`,
    );
    if (!response.ok) throw new Error("Channel not found");
    const data = (await response.json()) as {
      id?: unknown;
      chatroom?: {
        id?: unknown;
      };
    };

    return {
      chatroomId: data.chatroom?.id == null ? null : String(data.chatroom.id),
      channelId: data.id == null ? null : String(data.id),
    };
  } catch (error) {
    console.error("Error while fething channel:", error);
    return { chatroomId: null, channelId: null };
  }
};

export const getKickId = async (username: string): Promise<string | null> => {
  const info = await getKickChannelInfo(username);
  return info.chatroomId;
};
