### Scheduled event creation system for Twitch live streams

<ul>
  <li>When a message with the url twitch.tv/user is sent to the specified text channel, Senchabot starts checking if this Twitch user is live or not every 2 minutes</li>
  <ul><li>If the Twitch user is live:
    <ul>
      <li>Creates a Discord scheduled event that will start after 30 seconds. After 30 seconds the event starts. (<b>Happening status</b>)</li>
<li>Every 2 minutes it checks if the event name and Twitch stream title are the same, if not, it fetches the Twitch stream title and replaces the event name with it.</li>
    </ul>
  </li>
   <li>If the Twitch user is not live:
    <ul>
      <li>Senchabot deletes the Discord scheduled event.</li>
    </ul>
  </li></ul>
</ul>
