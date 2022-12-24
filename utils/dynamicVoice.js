class DynamicVoice {
  channels = [];

  /**
   * Get the list of channels
   * @returns The list of channels
   */
  getChannels() {
    return this.channels;
  }

  /**
   * Add a new channel to the list of channels
   * @param {*} channel The channel data to be saved
   */
  addChannel(channel) {
    this.channels.push({ ...channel, createdAt: Date.now() });
  }

  /**
   * Check if the user has any channels in the list
   * @param {*} userId The ID of the user
   * @returns `true` if the user has at least one channel, `false` otherwise
   */
  userHasChannels(userId) {
    return this.channels.some((channel) => channel.ownerId === userId);
  }

  /**
   * Check if there is a channel with the given name in the list
   * @param {*} channelName The name of the channel
   * @returns `true` if there is a channel with the given name, `false` otherwise
   */
  channelNameInUse(channelName) {
    return this.channels.some((channel) => channel.channelName === channelName);
  }
}

const dynamicVoice = new DynamicVoice();

module.exports = { dynamicVoice };
