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
}

const dynamicVoice = new DynamicVoice();

module.exports = { dynamicVoice };
