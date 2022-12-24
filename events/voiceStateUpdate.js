const { dynamicVoice } = require("../utils/dynamicVoice");

module.exports = {
  name: "voiceStateUpdate",
  async execute(oldState, newState) {
    try {
      // Fetch all channels in the guild
      const channels = await newState.guild.channels.fetch();

      // Iterate through channels
      channels.some((_channel) => {
        // Get the number of members in the channel
        const memberCount = [..._channel.members].length;

        const channelId = _channel.id;
        const channel = dynamicVoice.getChannel(channelId);

        // If the channel exists and the number of members in the channel is less than 1, delete the channel
        if (channel && memberCount < 1) {
          // Remove the channel from the dynamicVoice object
          dynamicVoice.removeChannel(channelId);
          // Delete the channel
          _channel.delete();
        }
      });
    } catch (e) {
      // Log any errors that occur
      console.log("ERROR on voiceStateUpdate:", e);
    }
  },
};
