import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/config/brand";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Grievance Redressal",
};

export default function GrievancePage() {
  const g = brand.grievanceOfficer;

  return (
    <LegalPage title="Grievance Redressal">
      <p>
        If something has gone wrong, we want to put it right. This page explains how to raise a complaint about{" "}
        {brand.name}, who will handle it and how quickly. It is published in line with the Consumer Protection
        (E-Commerce) Rules, 2020, the Information Technology Act, 2000 and the Digital Personal Data Protection Act,
        2023.
      </p>
      <p>
        For everyday questions, our support team is usually the quickest route; see the{" "}
        <Link href="/contact">Contact</Link> page. You can come straight to the Grievance Officer at any time,
        especially if you are not satisfied with a reply you have received.
      </p>

      <h2>1. Grievance Officer</h2>
      <ul>
        <li>
          <strong>Name:</strong> {g.name}
        </li>
        <li>
          <strong>Designation:</strong> {g.designation}
        </li>
        <li>
          <strong>Email:</strong> {g.email}
        </li>
        <li>
          <strong>Address for correspondence:</strong> {g.address}
        </li>
      </ul>
      <p>
        <strong>Operated by:</strong> {brand.legalEntityName}, {brand.registeredAddress}
      </p>
      <p>
        The Grievance Officer also handles questions and complaints about personal data and privacy, as described in
        our <Link href="/privacy">Privacy Policy</Link>.
      </p>

      <h2>2. What you can raise</h2>
      <ul>
        <li>problems with a purchase, payment, delivery or refund;</li>
        <li>an experience that did not work as described;</li>
        <li>concerns about how your personal data has been handled, or a request to exercise your data rights;</li>
        <li>content you feel is inaccurate, misleading or disrespectful;</li>
        <li>any other concern about how {brand.name} is run.</li>
      </ul>

      <h2>3. How to raise a grievance</h2>
      <ol>
        <li>
          <strong>Write to the Grievance Officer</strong> at {g.email}, or by post to the address above. Please use a
          subject line such as &ldquo;Grievance &mdash; [short description]&rdquo;.
        </li>
        <li>
          <strong>Include the details</strong>: your name and how to reach you, a clear description of the issue, the
          date it happened, and any order ID, transaction reference or screenshot that helps. Please never send card
          numbers, CVV, UPI PIN, OTP or passwords, and there is no need to share your Sankalp.
        </li>
        <li>
          <strong>We acknowledge</strong> your complaint within <strong>48 hours</strong> of receiving it and give you
          a reference number.
        </li>
        <li>
          <strong>We investigate</strong> and may ask you for any further information we need.
        </li>
        <li>
          <strong>We resolve</strong> your complaint and tell you the outcome, with reasons, within{" "}
          <strong>one month</strong> of receiving it.
        </li>
      </ol>
      <p>
        In short, we will {g.responseWindow}. There is no fee for raising a grievance with us.
      </p>

      <h2>4. If you are not satisfied</h2>
      <p>
        We hope to resolve every concern directly. If you are not satisfied with our response, or we have not replied
        within the timelines above, you have the right to seek help from the following independent bodies.
      </p>

      <h3>National Consumer Helpline (NCH)</h3>
      <p>
        Run by the Department of Consumer Affairs, Government of India, the NCH helps consumers resolve complaints
        before going to a Consumer Commission.
      </p>
      <ul>
        <li>
          <strong>Toll-free:</strong> 1915 (or 1800-11-4000)
        </li>
        <li>
          <strong>WhatsApp / SMS:</strong> 8800001915
        </li>
        <li>
          <strong>Online:</strong>{" "}
          <a href="https://consumerhelpline.gov.in" target="_blank" rel="noopener noreferrer">
            consumerhelpline.gov.in
          </a>{" "}
          (also available through the NCH app and the UMANG app)
        </li>
      </ul>

      <h3>Consumer Commissions (e-Jagriti, formerly e-Daakhil)</h3>
      <p>
        You may file a consumer complaint before the appropriate District, State or National Consumer Disputes
        Redressal Commission under the Consumer Protection Act, 2019. Complaints can be filed online through the
        Government&rsquo;s e-Jagriti portal, which replaced the earlier e-Daakhil portal:{" "}
        <a href="https://e-jagriti.gov.in" target="_blank" rel="noopener noreferrer">
          e-jagriti.gov.in
        </a>
        .
      </p>

      <h3>Data Protection Board of India</h3>
      <p>
        For complaints about personal data, once you have raised the matter with us, you may approach the Data
        Protection Board of India under the Digital Personal Data Protection Act, 2023, as its provisions come into
        force.
      </p>

      <p>
        These contact details are provided for your convenience and are maintained by the respective government
        bodies, which may update them. Please check their official websites for the latest information.
      </p>

      <h2>5. Our commitment</h2>
      <ul>
        <li>We treat every complaint fairly, respectfully and confidentially.</li>
        <li>Raising a complaint will never affect how we treat you.</li>
        <li>We use the information you send only to resolve your complaint.</li>
        <li>We learn from complaints and use them to improve {brand.name}.</li>
      </ul>

      <h2>6. Related policies</h2>
      <ul>
        <li>
          <Link href="/refunds">Refund &amp; Cancellation Policy</Link>
        </li>
        <li>
          <Link href="/terms">Terms &amp; Conditions</Link>
        </li>
        <li>
          <Link href="/privacy">Privacy Policy</Link>
        </li>
        <li>
          <Link href="/disclaimer">Disclaimer</Link>
        </li>
      </ul>
    </LegalPage>
  );
}
