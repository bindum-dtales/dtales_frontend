import React from 'react';
import LegalPageShell from '../components/legal/LegalPageShell';

const Terms: React.FC = () => {
  return (
    <LegalPageShell
      title="Terms & Conditions | DTALES Tech"
      description="Read the DTALES Tech Terms & Conditions governing website use, contact submissions, communications, and professional engagements."
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Terms & Conditions', url: '/terms' },
      ]}
    >
      <header className="space-y-6">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
          TERMS AND CONDITIONS
        </h1>
        <section aria-labelledby="terms-last-updated" className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
          <h2 id="terms-last-updated" className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0020BF]">
            Last Updated
          </h2>
          <p className="mt-3 text-sm sm:text-base text-white/70">
            Not specified in the supplied document.
          </p>
        </section>
      </header>

      <ol className="space-y-10" aria-label="Terms and Conditions clauses">
        <li className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0020BF] tracking-tight">1. PURPOSE OF THESE TERMS</h2>
          <p>These Terms and Conditions (“Terms”) govern access to and use of this website and the manner in which visitors may interact with us, including through contact forms, email, professional communications, and other business channels.</p>
          <p>This website is intended to provide information about our professional services and to facilitate legitimate business or professional interactions with individuals and organisations. It is not a transactional platform and does not support user accounts, online payments, or automated service delivery.</p>
          <p>By accessing this website, submitting information through our contact forms, or otherwise communicating with us through the website, you acknowledge that you have read, understood, and agree to these Terms.</p>
        </li>

        <li className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0020BF] tracking-tight">2. WHO WE ARE AND WHAT WE DO</h2>
          <p>We are a professional services firm providing consulting, content, education, and technology-related services to businesses and professionals.</p>
          <p>Our work typically involves professional discussions, preparation of proposals, advisory services, content or documentation development, training or educational engagements, and technology-enabled support. Services are delivered on a tailored basis following direct communication and mutual agreement and are not provided automatically through the website.</p>
        </li>

        <li className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0020BF] tracking-tight">3. USE OF THE WEBSITE AND COMMUNICATION CHANNELS</h2>
          <section className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-semibold text-white">Website and Communication Tools</h3>
            <p>This website may be used to:</p>
            <ul className="list-disc space-y-2 pl-6 text-white/85">
              <li>access information about our services and areas of work;</li>
              <li>initiate contact with us through contact forms or other published contact details;</li>
              <li>engage in professional discussions or enquiries; and</li>
              <li>support preliminary interactions related to potential or ongoing professional engagements.</li>
            </ul>
            <p>The website does not itself provide professional advice or deliver services.</p>
          </section>
          <section className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-semibold text-white">Contact Forms</h3>
            <p>Our website includes contact forms as a way for visitors to reach us. Contact forms may be used to:</p>
            <ul className="list-disc space-y-2 pl-6 text-white/85">
              <li>make enquiries about our services,</li>
              <li>request discussions or proposals,</li>
              <li>share professional information relevant to a potential engagement, or</li>
              <li>initiate communication with our team.</li>
            </ul>
            <p>Submitting a contact form does not create a contractual relationship, guarantee a response, or confirm acceptance of any engagement.</p>
          </section>
          <section className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-semibold text-white">Information You Provide</h3>
            <p>When using the website, contact forms, or other communication channels, you agree to provide information that is accurate, relevant, and lawful. You should not submit information that:</p>
            <ul className="list-disc space-y-2 pl-6 text-white/85">
              <li>you are not authorised to share,</li>
              <li>is misleading, inappropriate, or unlawful, or</li>
              <li>is unrelated to professional or business communication.</li>
            </ul>
            <p>We request that highly sensitive or regulated information not be submitted through the website unless specifically requested.</p>
          </section>
        </li>

        <li className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0020BF] tracking-tight">4. NATURE OF COMMUNICATIONS</h2>
          <p>Communications initiated through the website or related channels are handled by our team and are intended to support professional dialogue.</p>
          <p>Any responses provided are preliminary and informational in nature and should not be relied upon as professional advice. No professional services, deliverables, or outcomes are provided through the website itself. Formal services commence only after mutual agreement and documentation through a separate written engagement.</p>
        </li>

        <li className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0020BF] tracking-tight">5. PROFESSIONAL ENGAGEMENTS AND SEPARATE AGREEMENTS</h2>
          <p>If you engage us for professional services, the terms governing that engagement, including scope, fees, timelines, confidentiality, data handling, and liability, will be set out in a separate written agreement.</p>
          <p>These website Terms apply only to website use and preliminary communications. In the event of any inconsistency, the terms of the signed engagement agreement will prevail.</p>
        </li>

        <li className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0020BF] tracking-tight">6. INTELLECTUAL PROPERTY</h2>
          <p>All content displayed on this website, including text, documents, frameworks, branding, and materials, is owned by or licensed to us unless otherwise stated.</p>
          <p>Website content may be viewed for general informational purposes only. You may not copy, reproduce, distribute, modify, or use website content for commercial purposes without prior written consent.</p>
        </li>

        <li className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0020BF] tracking-tight">7. CONFIDENTIALITY OF INFORMATION</h2>
          <p>Information shared with us through the website or professional communications may include confidential business information. We use such information solely for evaluating enquiries, communicating with you, and performing agreed services.</p>
          <p>The website is not intended for the submission of sensitive or confidential information. Where enhanced confidentiality is required, this will be addressed through appropriate safeguards as part of a formal engagement.</p>
        </li>

        <li className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0020BF] tracking-tight">8. PRIVACY AND PERSONAL INFORMATION</h2>
          <p>Personal information collected through this website or related communications is handled in accordance with our Privacy Policy, which explains how personal information is collected, used, shared, and protected.</p>
          <p>By submitting information through the website, you acknowledge that such processing is necessary for responding to enquiries and managing professional communications.</p>
        </li>

        <li className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0020BF] tracking-tight">9. THIRD-PARTY SERVICES AND LINKS</h2>
          <p>This website may use standard third-party tools for hosting, analytics, or technical functionality. It may also include links to or references to third-party platforms or services. Any personal information processed through these services is handled in accordance with our Privacy Policy</p>
          <p>We are not responsible for the independent practices, content, or policies of third parties.</p>
        </li>

        <li className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0020BF] tracking-tight">10. DISCLAIMER OF WARRANTIES</h2>
          <p>The website and its content are provided on an “as is” basis for general informational purposes. While we make reasonable efforts to keep information accurate and current:</p>
          <ul className="list-disc space-y-2 pl-6 text-white/85">
            <li>website content does not constitute professional advice,</li>
            <li>reliance on website information alone is at your own risk, and</li>
            <li>outcomes depend on specific circumstances and formal engagement terms.</li>
          </ul>
        </li>

        <li className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0020BF] tracking-tight">11. LIMITATION OF LIABILITY</h2>
          <p>To the extent permitted by applicable law:</p>
          <ul className="list-disc space-y-2 pl-6 text-white/85">
            <li>we are not liable for losses arising from reliance on website content or preliminary communications;</li>
            <li>we do not guarantee responses to enquiries or communications; and</li>
            <li>liability relating to professional services is governed exclusively by the relevant engagement agreement.</li>
          </ul>
          <p>Nothing in these Terms limits liability that cannot be excluded under law.</p>
        </li>

        <li className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0020BF] tracking-tight">12. RESTRICTION OF ACCESS</h2>
          <p>We reserve the right to restrict access to the website or decline communications where use is unlawful, abusive, misleading, or inconsistent with these Terms.</p>
        </li>

        <li className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0020BF] tracking-tight">13. GOVERNING LAW</h2>
          <p>These Terms shall be governed by and construed in accordance with the laws of India. The Courts in Bengaluru, shall have exclusive jurisdiction to entertain any suit or proceeding arising out of this Terms.</p>
        </li>

        <li className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0020BF] tracking-tight">14. UPDATES TO THESE TERMS</h2>
          <p>We may update these Terms from time to time to reflect changes in services, practices, or legal requirements. Updated versions will be published on this website. Continued use after updates constitutes acceptance of the revised Terms.</p>
        </li>

        <li className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0020BF] tracking-tight">15. CONTACT INFORMATION</h2>
          <p>For questions regarding these Terms or our services, you may contact us at:</p>
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

export default Terms;