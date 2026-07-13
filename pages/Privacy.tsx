import React from 'react';
import LegalPageShell from '../components/legal/LegalPageShell';

const Privacy: React.FC = () => {
  return (
    <LegalPageShell
      title="Privacy Policy | DTALES Tech"
      description="Read the DTALES Tech Privacy Policy describing how personal information is collected, used, shared, retained, and protected."
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Privacy Policy', url: '/privacy' },
      ]}
    >
      <header className="space-y-6">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
          PRIVACY POLICY
        </h1>
        <section aria-labelledby="privacy-last-updated" className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
          <h2 id="privacy-last-updated" className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0020BF]">
            Last Updated
          </h2>
          <p className="mt-3 text-sm sm:text-base text-white/70">
            Not specified in the supplied document.
          </p>
        </section>
      </header>

      <section className="space-y-4">
        <p>We respect the privacy of individuals who interact with us and are committed to handling personal information in a responsible, transparent, and lawful manner. This Privacy Policy explains how personal information is collected, used, shared, and protected in connection with our professional services and business operations.</p>
        <p>This policy applies to personal information provided to us through professional communications, including when individuals contact us through our website, email, or other business channels.</p>
      </section>

      <ol className="space-y-10" aria-label="Privacy policy clauses">
        <li className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0020BF] tracking-tight">1. WHO WE ARE AND WHAT WE DO</h2>
          <p>We are a professional services firm providing consulting, content, education, and technology-related services. Our work spans technical documentation, software and platform implementation, education and training, content marketing and strategic consulting, and technology-enabled solutions for businesses.</p>
          <p>Our services are primarily delivered in a business-to-business context and involve collaboration with clients, partners, and professionals across industries and regions.</p>
        </li>

        <li className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0020BF] tracking-tight">1. SCOPE OF THIS POLICY</h2>
          <p>This Privacy Policy applies to personal information that we receive when individuals:</p>
          <ul className="list-disc space-y-2 pl-6 text-white/85">
            <li>contact us through our website contact form,</li>
            <li>communicate with us via email or other professional channels,</li>
            <li>engage with us regarding consulting, content, training, or technology services, or</li>
            <li>participate in discussions, proposals, or service delivery activities.</li>
          </ul>
          <p>This policy does not govern how third parties independently process personal information after it has been shared with them in the course of professional engagements.</p>
        </li>

        <li className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0020BF] tracking-tight">1. PERSONAL INFORMATION WE COLLECT</h2>
          <p>The personal information we collect is limited to what is reasonably necessary for professional communication and service-related purposes. This typically includes:</p>
          <ul className="list-disc space-y-2 pl-6 text-white/85">
            <li>name, email address, phone number, organisation, and role;</li>
            <li>information shared in messages or enquiries submitted to us;</li>
            <li>business-related details provided during discussions, proposals, or collaborations; and</li>
            <li>records of professional correspondence and interactions.</li>
          </ul>
          <p>We do not collect payment information, create user accounts, or intentionally collect personal information unrelated to our services.</p>
        </li>

        <li className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0020BF] tracking-tight">1. HOW WE USE PERSONAL INFORMATION</h2>
          <p>Personal information is used to manage professional communications and deliver our services. This includes responding to enquiries, understanding client needs, preparing proposals, delivering consulting or content-related services, coordinating projects, and maintaining internal records.</p>
          <p>Where relevant, information may also be used to comply with legal or regulatory obligations or to protect legitimate business interests. We do not use personal information for unsolicited marketing, advertising profiling, or unrelated commercial purposes.</p>
        </li>

        <li className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0020BF] tracking-tight">1. SHARING OF PERSONAL INFORMATION</h2>
          <p>In the course of providing services, personal information may be shared internally with team members or externally with clients, collaborators, vendors, or professional partners, where such sharing is reasonably necessary to perform agreed services.</p>
          <p>Any sharing of personal information is limited to what is relevant for professional purposes, and access is restricted to individuals who require it in the course of their work. We do not sell personal information or share it for independent commercial exploitation.</p>
          <p>We do not sell, rent, or disclose personal information for cross-context behavioural advertising or similar commercial purposes.</p>
        </li>

        <li className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0020BF] tracking-tight">1. WEBSITE INFORMATION AND COOKIES</h2>
          <p>Our website may use limited cookies or similar technologies to support basic functionality and understand general usage patterns. These technologies help us maintain website performance and identify technical issues.</p>
          <p>We may also use standard analytics tools that collect aggregated, non-personal information such as browser type, device information, approximate location, and pages visited. This information is used only to understand website usage trends and improve performance and is not used for targeted advertising or profiling.</p>
          <p>Visitors may manage or disable cookies through their browser settings.</p>
        </li>

        <li className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0020BF] tracking-tight">1. CROSS-BORDER PROCESSING</h2>
          <p>As we work with clients, partners, and service providers across different locations, personal information may be accessed or processed in jurisdictions outside the individual’s country of residence.</p>
          <p>Such cross-border processing occurs only for legitimate business purposes and in connection with service delivery. We take reasonable steps to ensure that personal information is handled in a manner consistent with applicable data protection requirements, regardless of where it is processed.</p>
          <p>Where personal information relates to individuals located in jurisdictions with specific data protection requirements, processing and sharing are undertaken in a manner intended to align with such requirements, including reliance on consent where applicable.</p>
        </li>

        <li className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0020BF] tracking-tight">1. LEGAL BASIS FOR PROCESSING</h2>
          <p>Depending on the nature of the interaction and applicable law, personal information is processed on one or more lawful bases, including consent, contractual necessity, legitimate business interests, or compliance with legal obligations.</p>
          <p>Where consent is relied upon, individuals may withdraw consent at any time, which may impact our ability to provide certain services.</p>
        </li>

        <li className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0020BF] tracking-tight">1. DATA RETENTION</h2>
          <p>We retain personal information for as long as it is reasonably necessary to manage professional relationships, provide services, maintain business records, or meet legal or regulatory requirements.</p>
          <p>When personal information is no longer required, or where deletion is requested, we take reasonable steps to delete or anonymise such information from active systems, subject to any operational or legal constraints.</p>
        </li>

        <li className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0020BF] tracking-tight">1. DATA SECURITY</h2>
          <p>We take reasonable and proportionate measures to safeguard personal information against unauthorised access, loss, or misuse. These measures are appropriate to the nature of our operations and the type of information processed.</p>
          <p>While we make good-faith efforts to protect personal information, no method of electronic storage or transmission can be guaranteed to be entirely secure.</p>
        </li>

        <li className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0020BF] tracking-tight">1. RIGHTS AND REQUESTS</h2>
          <p>Personal information processed by us generally relates to identifiable individuals, including individuals acting in a professional or organisational capacity (such as representatives of clients, partners, vendors, or other organisations).</p>
          <p>Where personal information relates to an identifiable individual, that individual may have rights under applicable data protection laws. Subject to applicable legal requirements and limitations, such rights may include:</p>
          <ul className="list-disc space-y-2 pl-6 text-white/85">
            <li>the right to request confirmation of whether personal information relating to them is processed and to obtain access to such information;</li>
            <li>the right to request correction or updating of personal information where it is inaccurate or incomplete;</li>
            <li>the right to request deletion or erasure of personal information where it is no longer required for the purposes for which it was collected or where consent has been withdrawn, subject to lawful limitations;</li>
            <li>the right to withdraw consent at any time where processing is based on consent, without affecting the lawfulness of prior processing.</li>
          </ul>
          <p>Organisations may also contact us to raise queries or requests relating to personal information provided in the course of a business relationship, including information relating to their representatives. Such requests will be handled in accordance with applicable law and any relevant contractual arrangements.</p>
          <p>Requests to exercise rights or raise queries may be submitted using the contact details provided in this Privacy Policy(clause 14). To protect privacy, confidentiality, and security, we may take reasonable steps to verify the identity of the requesting individual or the authority of the person making the request on behalf of an organisation.</p>
          <p>We will address requests within a reasonable timeframe and in accordance with applicable data protection requirements.</p>
        </li>

        <li className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0020BF] tracking-tight">1. CHILDREN’S INFORMATION</h2>
          <p>Our services and communications are intended for professionals and businesses. We do not knowingly collect personal information from children. If we become aware that personal information relating to a minor has been provided to us, we will take steps to delete such information. If you believe that personal information relating to a minor has been inadvertently provided to us, please notify us using the contact details below, and we will take reasonable steps to delete such information.</p>
        </li>

        <li className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0020BF] tracking-tight">1. UPDATES TO THIS POLICY</h2>
          <p>This Privacy Policy may be updated from time to time to reflect changes in our services, practices, or applicable laws. Updated versions will be made available through appropriate channels.</p>
        </li>

        <li className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0020BF] tracking-tight">1. CONTACT INFORMATION</h2>
          <p>If you have any questions, concerns, or requests regarding this Privacy Policy or the handling of personal information, you may contact us at:</p>
          <ul className="list-disc space-y-2 pl-6 text-white/85">
            <li>Email:</li>
            <li>Website:</li>
            <li>Phone:</li>
            <li>Address:</li>
          </ul>
        </li>
      </ol>
    </LegalPageShell>
  );
};

export default Privacy;