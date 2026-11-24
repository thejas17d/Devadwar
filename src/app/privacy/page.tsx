import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/config/brand";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  const g = brand.grievanceOfficer;

  return (
    <LegalPage title="Privacy Policy">
      <p>
        Your devotion is personal, and so is your privacy. {brand.name} is designed to collect as little information
        as possible. This policy explains, in plain language, what we handle, what we never collect, and the rights you
        have under the Digital Personal Data Protection Act, 2023 (&ldquo;DPDP Act&rdquo;), the rules made under it,
        and the Information Technology Act, 2000.
      </p>

      <h2>1. Who we are</h2>
      <p>
        {brand.name} is operated by {brand.legalEntityName}, {brand.registeredAddress} (&ldquo;we&rdquo;,
        &ldquo;us&rdquo;). For any personal data we process, we are the <strong>Data Fiduciary</strong> under the DPDP
        Act. You, the person the data is about, are the <strong>Data Principal</strong>.
      </p>
      <p>
        Contact for privacy questions: {g.name}, {g.designation}, {g.email}. See also{" "}
        <Link href="/grievance">Grievance Redressal</Link>.
      </p>

      <h2>2. The short version</h2>
      <ul>
        <li>No accounts, no sign-up, no login.</li>
        <li>No analytics, no tracking scripts, no advertising, no tracking cookies.</li>
        <li>Your Sankalp never leaves your device.</li>
        <li>
          When you begin an experience, our server receives only which deity and which experience you chose. No name,
          email or phone number is sent.
        </li>
        <li>We do not sell, rent or share personal data for marketing.</li>
      </ul>

      <h2>3. What we never collect: your Sankalp</h2>
      <p>
        You may write a private Sankalp (a wish or prayer) before an experience. It is held only in your
        browser&rsquo;s temporary memory while the experience is open. It is <strong>never</strong> sent to our
        servers, <strong>never</strong> saved to your device&rsquo;s storage, <strong>never</strong> included in any
        log or analytics, and <strong>never</strong> seen by us or anyone else. When the experience ends, or you close
        or refresh the page, it is discarded. Because we never receive it, we cannot recover it for you either.
      </p>

      <h2>4. What we do handle</h2>

      <h3>4.1 Information stored on your own device</h3>
      <p>Your browser keeps a small amount of information locally. It stays on your device and is not sent to us.</p>
      <ul>
        <li>
          <strong>localStorage &mdash; sound preferences:</strong> your volume level, whether sound is muted, and
          whether background music is on or off. This lets the website remember your choice next time. It stays until
          you clear your browser data.
        </li>
        <li>
          <strong>sessionStorage &mdash; demo receipt:</strong> the deity, the experience chosen, a demo order ID and
          the amount shown. This lets the experience open correctly after checkout. Your browser removes it
          automatically when you close the tab.
        </li>
      </ul>
      <p>
        You can clear both at any time through your browser settings. The website will still work; it will simply
        forget your sound preferences.
      </p>

      <h3>4.2 Information our server receives</h3>
      <p>
        When you start a (demo) order, your browser sends our server only two pieces of information: a{" "}
        <strong>deity identifier</strong> and a <strong>package identifier</strong>. Our server works out the price
        from its own list and returns a demo order ID. This request contains no personal details.
      </p>
      <p>
        Like almost every website, our hosting provider may automatically record basic technical information when your
        browser connects, such as IP address, browser type and the time of the request. This is used only to keep the
        service secure and working, and is kept for [retention period &mdash; to be confirmed with hosting provider].
        We do not use it to identify or profile you.
      </p>

      <h3>4.3 When you contact us</h3>
      <p>
        If you email or call us, we receive whatever you choose to share, usually your email address or phone number
        and your message. We use it only to reply to you and resolve your request, and keep it for{" "}
        [retention period &mdash; to be confirmed, e.g. up to 12 months after the matter is closed], unless the law
        requires us to keep it longer.
      </p>

      <h2>5. Cookies and tracking</h2>
      <p>
        We do not use advertising cookies, analytics cookies or any third-party tracking technology. We do not embed
        social media trackers. If this ever changes, we will update this policy first and ask for your consent where
        the law requires it, with no option pre-selected.
      </p>

      <h2>6. Payments</h2>
      <p>
        {brand.name} currently runs in <strong>demo mode</strong>. No real payment is taken and no payment details are
        requested.
      </p>
      <p>
        When real payments are introduced, they will be processed by a payment aggregator authorised by the Reserve
        Bank of India (for example, Razorpay). Your card, UPI or bank details will be entered on, and handled by, that
        payment provider under its own privacy policy and security standards. We will not see or store your full card
        number, CVV, UPI PIN or banking credentials. We would receive only what is needed to confirm and reconcile your
        order, such as a transaction reference, amount and payment status. We will update this policy before live
        payments begin.
      </p>

      <h2>7. Why we process data, and the legal basis</h2>
      <ul>
        <li>To deliver the experience you chose (your request to use the service).</li>
        <li>To reply to your questions and complaints (your request to us).</li>
        <li>To keep the website secure and working (a legitimate and necessary use).</li>
        <li>To meet legal obligations, such as tax or consumer law record-keeping, once live payments begin.</li>
      </ul>
      <p>
        Where the law requires your consent, we will ask for it clearly and separately, and you can withdraw it as
        easily as you gave it.
      </p>

      <h2>8. Sharing</h2>
      <p>
        We do not sell or share your personal data with advertisers or data brokers. Limited data may be handled by
        service providers who help us run the website (such as our hosting provider and, in future, our payment
        provider), only on our instructions. We may disclose information if required by law or a valid order of a
        court or government authority.
      </p>

      <h2>9. Your rights as a Data Principal</h2>
      <p>Subject to the DPDP Act and its rules, you have the right to:</p>
      <ul>
        <li>ask for a summary of the personal data we hold about you and how we use it;</li>
        <li>ask us to correct, complete or update it;</li>
        <li>ask us to erase it, where it is no longer needed or you withdraw consent;</li>
        <li>withdraw any consent you have given;</li>
        <li>have your grievance addressed by us;</li>
        <li>nominate another person to exercise your rights in the event of your death or incapacity.</li>
      </ul>
      <p>
        To use any of these rights, write to {g.email}. Since we hold so little, there will often be nothing to
        return, but we will always tell you clearly. If you are not satisfied with our response, you may approach the
        Data Protection Board of India once the relevant provisions are in force.
      </p>

      <h2>10. Children</h2>
      <p>
        Under the DPDP Act, anyone below 18 years of age is a child. {brand.name} does not knowingly collect personal
        data from children. Children may use the website with the involvement and permission of a parent or lawful
        guardian. If we ever need to process a child&rsquo;s personal data (for example, if a child emails us), we will
        seek verifiable consent from a parent or guardian as the law requires. We do not track, profile or target
        advertising at children. If you believe a child has sent us personal data without such consent, please contact
        us and we will delete it.
      </p>

      <h2>11. Security</h2>
      <p>
        We use reasonable security practices, including encrypted (HTTPS) connections and minimal data collection.
        If a personal data breach affects you, we will inform you and the authorities as required by law.
      </p>

      <h2>12. Retention</h2>
      <p>
        We keep personal data only as long as needed for the purpose it was collected for, or as required by law, and
        then delete it. Your Sankalp is never kept at all. Data on your own device stays there until it expires or you
        clear it.
      </p>

      <h2>13. Changes to this policy</h2>
      <p>
        We may update this policy, for example when live payments are introduced or as the DPDP Rules come into force
        in phases. The &ldquo;Last updated&rdquo; date above will change, and for significant changes we will show a
        clear notice on the website.
      </p>

      <h2>14. Contact and grievances</h2>
      <p>
        {g.name}, {g.designation}
        <br />
        Email: {g.email}
        <br />
        Address: {g.address}
      </p>
      <p>
        We will {g.responseWindow}. Full details are on our <Link href="/grievance">Grievance Redressal</Link> page.
      </p>
    </LegalPage>
  );
}
