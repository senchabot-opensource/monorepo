export interface IChannel {
  channelId: string;
  channelName: string;
  ownerId: string;
  createdAt: number;
}

class DynamicVoice {
  private channels: IChannel[] = [];

  /**
   * Get the list of channels
   * @return {Array} The list of channels
   */
  getChannels() {
    return this.channels;
  }

  /**
   * Add a new channel to the list of channels
   * @param {Object} channel The channel data to be saved
   */
  addChannel(channel: IChannel) {
    if (!channel || !channel.channelId) {
      throw new Error("Invalid channel data");
    }
    this.channels.push({ ...channel, createdAt: Date.now() });
  }

  /**
   * Returns the channel with the given ID
   * @param {String} channelId
   * @returns The channel object, or undefined if not found
   */
  getChannel(channelId: string) {
    const channelIndex = this.getChannelIndex(channelId);

    return this.channels[channelIndex];
  }

  /**
   * Check if the user has any channels in the list
   * @param {String} userId The ID of the user
   * @return {Boolean} `true` if the user has at least one channel, `false` otherwise
   */
  userHasChannels(userId: string) {
    return this.channels.some((channel) => channel.ownerId === userId);
  }

  /**
   * Check if there is a channel with the given name in the list
   * @param {String} channelName The name of the channel
   * @return {Boolean} `true` if there is a channel with the given name, `false` otherwise
   */
  channelNameInUse(channelName: string) {
    return this.channels.some((channel) => channel.channelName === channelName);
  }

  /**
   * Get the index of the channel with the given ID in the list
   * @param {String} channelId
   * @return {Number} The index of the channel, or -1 if it is not found
   */
  getChannelIndex(channelId: string) {
    return this.channels.findIndex(
      (channel) => channel.channelId === channelId
    );
  }

  /**
   * Remove the channel with the given ID from the list
   * @param {String} channelId The ID of the channel to be removed
   */
  removeChannel(channelId: string) {
    const channelIndex = this.getChannelIndex(channelId);

    if (channelIndex === -1) {
      throw new Error(`Channel with ID ${channelId} not found`);
    }

    // Remove the channel from the list
    this.channels.splice(channelIndex, 1);
  }
}

export const dynamicVoice = new DynamicVoice();
