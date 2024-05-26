import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
}

export default function Page() {
  return (
    <article>
      <h1>Privacy Policy</h1>

      <p>
        At Senchabot, we take your privacy seriously. This policy outlines how
        we collect, use, and share your personal information.
      </p>

      <h3>Information We Collect</h3>
      <ul>
        <li>User IDs, names and emails on Discord and Twitch.</li>
        <li>Messages and commands sent to Senchabot.</li>
        <li>Usage statistics, including time and frequency of use.</li>
      </ul>

      <h3>How We Use Your Information</h3>
      <ul>
        <li>To provide and improve Senchabot&apos;s services.</li>
        <li>To respond to user inquiries and support requests.</li>
        <li>To monitor and analyze the performance of Senchabot.</li>
      </ul>

      <h3>Information Sharing</h3>
      <li>
        We do not sell or rent your personal information to third parties.
      </li>
      <li>
        We may share your information with service providers who assist us in
        operating Senchabot.
      </li>
      <li>
        We may also disclose your information as required by law or to comply
        with legal process.
      </li>

      <h3>Security</h3>
      <p>
        We take reasonable measures to protect your personal information from
        unauthorized access, use, or disclosure.
      </p>

      <h3>Data Retention</h3>
      <p>
        We will retain your personal information for as long as necessary to
        provide Senchabot&apos;s services or as required by law.
      </p>

      <h3>Changes to this Policy</h3>
      <p>
        We may update this policy from time to time. The updated policy will be
        posted on Senchabot&apos;s website.
      </p>
    </article>
  )
}
