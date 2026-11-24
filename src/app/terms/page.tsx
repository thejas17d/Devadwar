import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/config/brand";
import { listPackages, formatINR } from "@/config/packages";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Terms & Conditions",
};

export default function TermsPage() {
  const pkgs = listPackages();

  return (
    <LegalPage title="Terms & Conditions">
      <p>
        Thank you for visiting {brand.name}. These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern your use of the{" "}
        {brand.name} website and the digital experiences offered on it. The website is operated by{" "}
        {brand.legalEntityName}, {brand.registeredAddress} (&ldquo;we&rdquo;, &ldquo;us&rdquo;). By using the website
        you agree to these Terms. If you do not agree, please do not use it.
      </p>

      <h2>1. Nature of the service</h2>
      <p>
        {brand.name} offers <strong>digital devotional content only</strong>: symbolic, on-screen experiences such as
        digital darshan, a presented digital aarti and an interactive digital aarti, with artwork, music and sound
        effects. Everything happens on your own device.
      </p>
      <p>To avoid any misunderstanding, {brand.name} is <strong>not</strong>:</p>
      <ul>
        <li>a temple, or affiliated with, endorsed by or acting for any temple, trust or religious body;</li>
        <li>a service that arranges or performs any puja, seva, archana, homa or ritual by a priest or anyone else;</li>
        <li>a way to obtain temple entry, darshan tickets, priority queues or prasad;</li>
        <li>a channel for donations, offerings or dakshina to any temple or deity;</li>
        <li>a live stream of any temple or real-world ceremony;</li>
        <li>religious, astrological, medical, legal or financial advice.</li>
      </ul>

      <h2>2. Eligibility</h2>
      <p>
        You must be 18 years or older to make a purchase. If you are under 18, you may use the website only with the
        involvement and consent of a parent or lawful guardian, who accepts these Terms on your behalf.
      </p>

      <h2>3. Experiences and pricing</h2>
      <p>The experiences currently available, and their prices, are:</p>
      <ul>
        {pkgs.map((p) => (
          <li key={p.id}>
            <strong>
              {p.name} &mdash; {formatINR(p.pricePaise)}
            </strong>
            : {p.description}
          </li>
        ))}
      </ul>
      <p>
        Prices are in Indian Rupees and are shown before you confirm. [Tax treatment &mdash; e.g. &ldquo;Prices include
        applicable GST&rdquo; &mdash; to be confirmed with a chartered accountant.] There are no hidden fees,
        subscriptions or automatic renewals, and no option is ever pre-selected for you. Each purchase is a one-time
        access to one experience for one deity.
      </p>
      <p>
        The price of an experience reflects only the digital features it includes (for example, the aarti sequence or
        the interactive lamp). <strong>There is no link between the price you pay and any blessing, merit or
        outcome.</strong> Every experience is offered with equal respect.
      </p>
      <p>
        We may change prices or the experiences on offer in future. Any change will not affect a purchase you have
        already completed.
      </p>

      <h2>4. Demo mode</h2>
      <p>
        {brand.name} currently operates in <strong>demo mode</strong>. Checkout is simulated: no real payment is
        requested, no money is charged and any order ID shown is a demo reference. When live payments begin, they will
        be processed by a payment aggregator authorised by the Reserve Bank of India, and these Terms will be updated
        beforehand.
      </p>

      <h2>5. Access and duration</h2>
      <p>
        Once you confirm, the experience opens straight away in your browser. There is no time limit: you may stay as
        long as you wish and leave whenever you choose. Access is tied to your current browser session; if you close
        the tab, the experience ends. You need a reasonably modern browser and a working internet connection to load
        it. Refunds are explained in our <Link href="/refunds">Refund &amp; Cancellation Policy</Link>.
      </p>

      <h2>6. Your Sankalp</h2>
      <p>
        The optional Sankalp note stays only in your browser while the experience is open. It is never sent to or
        stored by us, as explained in our <Link href="/privacy">Privacy Policy</Link>.
      </p>

      <h2>7. No guarantee of spiritual or other outcomes</h2>
      <p>
        Our experiences are symbolic and intended to support a moment of personal reflection and devotion. We do not
        promise, and nothing on the website should be read as promising, that any wish will be fulfilled or that any
        spiritual, material, health, relationship, financial or other result will follow. Your faith and practice are
        your own.
      </p>

      <h2>8. Intellectual property</h2>
      <p>
        The website&rsquo;s design, artwork, illustrations, animations, software, text and procedurally composed music
        are original to us or used under licence, and are protected by law. You may use them only for your personal,
        non-commercial devotional use on the website. Please do not copy, record for redistribution, sell or reuse them
        without our written permission.
      </p>
      <p>
        Deity names, mantras, prayers and traditional devotional texts belong to shared religious and cultural
        heritage. We claim no ownership of them.
      </p>

      <h2>9. Acceptable use and respectful conduct</h2>
      <p>We ask that you use {brand.name} in the spirit it is offered. You agree not to:</p>
      <ul>
        <li>use the website in any unlawful way or for any unlawful purpose;</li>
        <li>use it to mock, insult or hurt the religious feelings of any person or community;</li>
        <li>attempt to bypass checkout, interfere with the website, or access systems you are not authorised to access;</li>
        <li>introduce malware, run automated scraping, or overload the service;</li>
        <li>misrepresent your identity or any connection with us.</li>
      </ul>
      <p>We may restrict access where these Terms are seriously or repeatedly breached.</p>

      <h2>10. Availability</h2>
      <p>
        We work to keep the website available and running smoothly, but we cannot promise it will always be
        uninterrupted or error-free. If a technical problem prevents an experience you paid for from being delivered,
        our <Link href="/refunds">Refund &amp; Cancellation Policy</Link> applies.
      </p>

      <h2>11. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, the website is provided &ldquo;as is&rdquo;. We are not liable for any
        indirect, incidental or consequential loss arising from your use of the website. Our total liability to you
        for any claim relating to a purchase will not exceed the amount you paid for that purchase. Nothing in these
        Terms limits any right you have under the Consumer Protection Act, 2019 or any other law that cannot be
        excluded by agreement.
      </p>

      <h2>12. Governing law and disputes</h2>
      <p>
        These Terms are governed by the laws of India. We encourage you to contact us first so we can try to resolve
        any concern quickly; see our <Link href="/grievance">Grievance Redressal</Link> page. Subject to your rights
        under consumer protection law (including the right to approach a Consumer Commission), the courts at{" "}
        {brand.jurisdictionCity}, India will have jurisdiction.
      </p>

      <h2>13. Changes to these Terms</h2>
      <p>
        We may update these Terms from time to time. The &ldquo;Last updated&rdquo; date above shows the current
        version. Changes apply to future use and purchases, not to purchases already completed.
      </p>

      <h2>14. Contact</h2>
      <p>
        Questions about these Terms? Write to {brand.supportEmail}, or visit our <Link href="/contact">Contact</Link>{" "}
        page. Please also read our <Link href="/disclaimer">Disclaimer</Link>.
      </p>
    </LegalPage>
  );
}
