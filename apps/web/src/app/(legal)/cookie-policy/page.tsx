import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy',
}

export default function Page() {
  return (
    <article>
      <h1>Cookie Policy</h1>

      <p>
        Senchabot uses cookies to enhance the user experience and improve the
        performance of the bot. By using Senchabot, you consent to the use of
        cookies in accordance with this policy.
      </p>

      <p>
        Cookies are small text files that are placed on your device when you use
        Senchabot. They allow Senchabot to remember your preferences and help us
        analyze how you use the bot. This information is used to improve the
        user experience and provide better services.
      </p>

      <p>
        Senchabot uses both session cookies and persistent cookies. Session
        cookies are temporary and are deleted when you close your browser, while
        persistent cookies remain on your device until they expire or you delete
        them.
      </p>

      <p>
        You can control the use of cookies at the individual browser level. If
        you choose to disable cookies, some features of Senchabot may not
        function properly.
      </p>
    </article>
  )
}
