import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/config/brand";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Disclaimer",
};

export default function DisclaimerPage() {
  return (
    <LegalPage title="Disclaimer">
      <p>
        {brand.name} is offered with deep respect for every tradition it draws on. This page explains clearly what our
        experiences are and are not, so that you can enjoy them with the right expectations.
      </p>

      <h2>1. An independent platform</h2>
      <p>
        {brand.name} is an independent digital platform operated by {brand.legalEntityName}. We are{" "}
        <strong>not affiliated with, endorsed by, sponsored by or acting on behalf of</strong> any temple, temple
        board, trust, math, religious organisation or government body.
      </p>
      <p>
        We do not arrange or perform any puja, seva, archana or ritual by a priest. We do not provide temple entry,
        darshan bookings or prasad, and we do not collect donations or offerings for any temple or deity.
      </p>

      <h2>2. Temple and place names</h2>
      <p>
        Where the name of a temple, tirtha or sacred place appears on the website, it is used only as a factual,
        historical or cultural reference, for example to describe a tradition associated with a deity. Such a
        reference does not mean that the temple or its authorities are connected with {brand.name}, have approved our
        content or receive any part of what you pay.
      </p>

      <h2>3. Symbolic digital representations</h2>
      <p>
        The darshan, aarti and other experiences on {brand.name} are <strong>symbolic digital representations</strong>.
        They are created with care and are inspired by widely known devotional practice, but they are not a substitute
        for, or a recreation of, worship at any particular temple. They are not live streams and do not show real
        ceremonies. Customs vary greatly between regions, communities and families; our presentation follows one
        respectful interpretation and is not meant to say how anyone else should worship.
      </p>

      <h2>4. Artwork and music</h2>
      <p>
        The deity images on {brand.name} are original artwork made for us or used under licence. Some are respectful,
        simplified emblem-style placeholder illustrations, which we may refine or replace over time. They are not
        photographs of temple idols (murtis). Our devotional music is original and procedurally composed by our own
        software in traditional styles; it is not a recording of any temple or artist unless we say so.
      </p>
      <p>
        If you believe any image or sound is inaccurate or could cause offence, please{" "}
        <Link href="/contact">let us know</Link>. We take such feedback seriously.
      </p>

      <h2>5. No guarantee of outcomes</h2>
      <p>
        Our experiences are meant to offer a peaceful moment of personal devotion and reflection. We do not claim, and
        nothing on the website should be taken to mean, that taking part will bring any particular spiritual, material,
        health, relationship, career, financial or other result, or that any wish or Sankalp will be fulfilled.
      </p>
      <p>
        The price of an experience reflects only its digital features. Choosing a higher-priced experience does{" "}
        <strong>not</strong> bring a greater blessing or a better outcome.
      </p>

      <h2>6. Not professional advice</h2>
      <p>
        Content on {brand.name} is for general devotional and cultural interest only. It is not religious instruction
        or ruling, astrological guidance, medical or mental-health advice, or legal or financial advice. For such
        matters, please consult your own spiritual guide, priest or family elder, or a qualified professional. If you
        are going through a difficult time, please reach out to someone you trust or a qualified health professional.
      </p>

      <h2>7. Mantras and pronunciation</h2>
      <p>
        Mantras, names and prayers shown on the website, including any transliteration or pronunciation guidance, are
        provided in good faith as an <strong>approximate</strong> aid. Pronunciation, script and wording can differ
        between traditions and regions. For precise recitation, please learn from a teacher or authoritative source in
        your own tradition.
      </p>

      <h2>8. Accuracy and availability</h2>
      <p>
        We try to keep information on the website accurate and up to date, but we cannot guarantee that it is complete
        or free of errors. Information about traditions, festivals or deities is general in nature. The website may
        occasionally be unavailable for maintenance or because of technical problems.
      </p>

      <h2>9. Demo mode</h2>
      <p>
        {brand.name} currently operates in demo mode. Checkout is simulated and no real money is charged. Order IDs
        shown are demo references only.
      </p>

      <h2>10. More information</h2>
      <p>
        Please also read our <Link href="/terms">Terms &amp; Conditions</Link>,{" "}
        <Link href="/privacy">Privacy Policy</Link> and{" "}
        <Link href="/refunds">Refund &amp; Cancellation Policy</Link>. For questions, contact us at{" "}
        {brand.supportEmail}.
      </p>
    </LegalPage>
  );
}
