import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
}

export default function Page() {
  return (
    <article>
      <h1>Terms of Service</h1>

      <p>By using Senchabot, you agree to these terms of service.</p>

      <h3>Information We Collect</h3>
      <ol>
        <li>
          Use of Senchabot is at your own risk. We make no warranties or
          guarantees regarding the performance or functionality of Senchabot.
        </li>
        <li>
          Senchabot is intended for use in accordance with Discord&apos;s and
          Twitch&apos;s terms of service. We reserve the right to terminate
          access to Senchabot for users who violate these terms.
        </li>
        <li>
          We reserve the right to modify or discontinue Senchabot at any time
          without notice.
        </li>
        <li>
          Senchabot may include links to third-party websites or services. We
          are not responsible for the content or functionality of these websites
          or services.
        </li>
        <li>
          Senchabot may not be used for illegal purposes or to harass,
          intimidate, or threaten others.
        </li>
        <li>
          We reserve the right to modify these terms of service at any time.
          Your continued use of Senchabot after any modifications to the terms
          indicates your acceptance of the modified terms.
        </li>
      </ol>
    </article>
  )
}
