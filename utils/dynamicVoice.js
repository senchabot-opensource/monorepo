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
}

const dynamicVoice = new DynamicVoice();

module.exports = { dynamicVoice };
