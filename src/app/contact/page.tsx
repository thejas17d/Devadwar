import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/config/brand";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Contact Us",
};

export default function ContactPage() {
  return (
    <LegalPage title="Contact Us">
      <p>
        We are glad to help with any question about {brand.name}: an experience that did not load, a payment
        concern, a suggestion, or something on the website that you feel is not right. Please write to us and a member
        of our team will reply.
      </p>

      <h2>Customer support</h2>
      <ul>
        <li>
          <strong>Email:</strong> {brand.supportEmail}
        </li>
        <li>
          <strong>Phone:</strong> {brand.supportPhone}
        </li>
        <li>
          <strong>Website:</strong> {brand.name}
        </li>
      </ul>

      <h2>Who we are</h2>
      <ul>
        <li>
          <strong>Legal name:</strong> {brand.legalEntityName}
        </li>
        <li>
          <strong>Registered address:</strong> {brand.registeredAddress}
        </li>
      </ul>
      <p>
        {brand.name} is an independent digital devotional platform. We are not a temple and are not affiliated with
        any temple or religious trust, so we cannot help with temple bookings, sevas, prasad or donations.
      </p>

      <h2>Why there is no contact form</h2>
      <p>
        We have chosen not to put a contact form on this website. A form would mean collecting and storing your
        details on our servers, and we prefer to collect as little as possible. When you email us, you decide exactly
        what you share. We use what you send only to answer your request, as described in our{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </p>

      <h2>What to include in your message</h2>
      <p>Including a few details will help us help you quickly:</p>
      <ul>
        <li>A short description of your question or concern.</li>
        <li>
          If it is about a purchase: the deity and experience you chose, the date and approximate time, and the order
          ID shown on your confirmation screen.
        </li>
        <li>
          If a payment is involved: the amount and the payment method (for example UPI or card). Please share only
          the transaction reference number.
        </li>
        <li>
          If something did not work: the device and browser you were using, and a screenshot if it helps.
        </li>
        <li>How you would like us to reply (email, or phone if you prefer).</li>
      </ul>

      <h3>Please never send us</h3>
      <ul>
        <li>Your full card number, CVV, UPI PIN, OTP, net-banking password or any other secret code.</li>
        <li>The words of your Sankalp. It is private, and we do not need it to help you.</li>
        <li>Any document or information that is not needed for your request.</li>
      </ul>
      <p>
        No one from {brand.name} will ever ask you for a PIN, OTP or password. If someone claiming to be from us does,
        please do not share it, and let us know.
      </p>

      <h2>Response times</h2>
      <ul>
        <li>
          <strong>General questions and support:</strong> we aim to reply within [2 working days &mdash; to be
          confirmed].
        </li>
        <li>
          <strong>Payment or delivery problems:</strong> we aim to reply within [1 working day &mdash; to be
          confirmed] and will explain the next steps. Refunds follow our{" "}
          <Link href="/refunds">Refund &amp; Cancellation Policy</Link>.
        </li>
        <li>
          <strong>Formal complaints:</strong> our Grievance Officer will {brand.grievanceOfficer.responseWindow}. See
          below.
        </li>
      </ul>
      <p>Support hours: [Days and hours &mdash; to be confirmed], excluding public holidays.</p>

      <h2>Complaints and grievances</h2>
      <p>
        If you are unhappy with how a request was handled, or you would like to raise a formal complaint, please
        contact our Grievance Officer. Their name, contact details and the full process are on our{" "}
        <Link href="/grievance">Grievance Redressal</Link> page.
      </p>

      <h2>Privacy requests</h2>
      <p>
        For anything relating to your personal data, such as asking what we hold or asking us to delete an email you
        sent, please write to {brand.grievanceOfficer.email} or {brand.supportEmail}. The{" "}
        <Link href="/privacy">Privacy Policy</Link> explains your rights.
      </p>

      <h2>Demo mode</h2>
      <p>
        {brand.name} currently runs in demo mode. No real payment is taken and no money is charged. If you see a
        charge that you believe is connected to {brand.name}, please contact us straight away with the details above.
      </p>
    </LegalPage>
  );
}
