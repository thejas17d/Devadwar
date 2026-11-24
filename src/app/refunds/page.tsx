import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/config/brand";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
};

export default function RefundsPage() {
  return (
    <LegalPage title="Refund & Cancellation Policy">
      <p>
        We want every visit to {brand.name} to feel fair and peaceful. This policy explains when you can get a refund,
        how to ask for one and how long it takes. If you are ever unsure, please just write to us. We would rather
        help than argue.
      </p>

      <h2>1. Demo mode</h2>
      <p>
        {brand.name} currently runs in <strong>demo mode</strong>. No real money is charged for any experience, so
        there is nothing to refund at present. This policy describes how refunds will work once live payments begin.
        If you see a real charge you believe is linked to {brand.name}, please contact us at once.
      </p>

      <h2>2. How our experiences are delivered</h2>
      <p>
        Every {brand.name} experience is digital content that opens in your browser straight after you confirm your
        purchase. Because it is delivered instantly and is used up as you take part in it, there is no physical
        product to return.
      </p>

      <h2>3. When you are entitled to a refund</h2>
      <p>You will receive a full refund if:</p>
      <ul>
        <li>
          <strong>Charged but not delivered:</strong> you were charged but the experience did not open for you.
        </li>
        <li>
          <strong>Technical failure:</strong> a fault on our side prevented the experience from loading or working
          properly, and we could not fix it for you.
        </li>
        <li>
          <strong>Failed transaction:</strong> your payment failed or was cancelled, but money was still debited from
          your account.
        </li>
        <li>
          <strong>Duplicate charge:</strong> you were charged more than once for the same purchase.
        </li>
        <li>
          <strong>Wrong amount:</strong> you were charged an amount different from the price shown at checkout.
        </li>
      </ul>
      <p>
        In many of these cases, especially failed or duplicate transactions, the payment provider or your bank may
        reverse the amount automatically. If it has not arrived within the timeline below, please contact us.
      </p>

      <h2>4. When a refund is not usually given</h2>
      <p>
        Because the experience is digital and delivered in full the moment it opens, we do not usually offer a refund
        simply because you changed your mind <strong>after the experience has been accessed</strong>. This is not
        meant to be unkind. Once delivered, the content cannot be &ldquo;returned&rdquo;.
      </p>
      <p>
        Our experiences are symbolic and make no promise of any spiritual or other outcome, so a refund cannot be based
        on whether a wish or prayer has been fulfilled.
      </p>
      <p>
        That said, if something about your experience genuinely disappointed you, tell us. We look at every request
        individually and in good faith. Nothing in this policy affects your rights under the Consumer Protection Act,
        2019.
      </p>

      <h2>5. Cancellation</h2>
      <ul>
        <li>
          <strong>Before payment:</strong> you can leave checkout at any time before you confirm. Nothing is charged.
        </li>
        <li>
          <strong>After payment, before the experience opens:</strong> if you were charged but the experience never
          opened, this is treated as &ldquo;charged but not delivered&rdquo; and refunded in full.
        </li>
        <li>
          <strong>No cancellation charges:</strong> we do not charge any fee to cancel or to process a refund.
        </li>
        <li>
          <strong>No subscriptions:</strong> each purchase is a single, one-time payment. There is nothing to
          unsubscribe from and no auto-renewal.
        </li>
      </ul>

      <h2>6. How to request a refund</h2>
      <p>
        Please email {brand.supportEmail} within <strong>[7 days &mdash; placeholder, to be confirmed]</strong> of the
        purchase, with:
      </p>
      <ul>
        <li>the order ID shown on your confirmation screen (if you have it);</li>
        <li>the date and approximate time of the purchase;</li>
        <li>the deity and experience you chose, and the amount charged;</li>
        <li>the payment method and transaction reference number from your bank or UPI app;</li>
        <li>a short description of what went wrong, and a screenshot if it helps.</li>
      </ul>
      <p>
        Please <strong>never</strong> send your card number, CVV, UPI PIN, OTP or passwords. We will never ask for
        them. If you are slightly outside the request window, please write to us anyway and we will consider your
        request fairly.
      </p>

      <h2>7. Refund timeline</h2>
      <ul>
        <li>We will acknowledge your request within [2 working days &mdash; placeholder].</li>
        <li>We will review it and tell you our decision, with reasons if we cannot approve it.</li>
        <li>
          Approved refunds are made <strong>to the original payment method</strong>. They usually reach your account
          within <strong>[5&ndash;7 working days &mdash; placeholder]</strong> after approval, depending on your bank
          or payment provider.
        </li>
      </ul>

      <h2>8. If you are not satisfied</h2>
      <p>
        If you disagree with our decision, you can raise a formal complaint with our Grievance Officer, who will{" "}
        {brand.grievanceOfficer.responseWindow}. Details are on our{" "}
        <Link href="/grievance">Grievance Redressal</Link> page. You can also find our general contact details on the{" "}
        <Link href="/contact">Contact</Link> page.
      </p>

      <h2>9. Changes to this policy</h2>
      <p>
        We may update this policy, especially when live payments begin. The version in force when you made your
        purchase applies to that purchase. See also our <Link href="/terms">Terms &amp; Conditions</Link>.
      </p>
    </LegalPage>
  );
}
