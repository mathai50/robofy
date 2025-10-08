export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Statement</h1>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Introduction</h2>
            <p className="text-muted-foreground">
              This Privacy Statement explains how [Your Company Name] collects, uses, and protects your personal data when you visit or interact with our website, hosted within the European Union.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Identity and Contact Details</h2>
            <div className="text-muted-foreground">
              <p><strong>[robofy.uk]</strong></p>
              <p>[online]</p>
              <p>Email: [bytetap@gmail.com]</p>
              <p>Phone: [+918848119336]</p>
            </div>
            <p className="text-muted-foreground mt-4">
              If you have any questions regarding this privacy statement or your personal data, you may contact our Data Protection Officer (DPO): [DPO Name and Contact, if applicable].
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Personal Data We Collect</h2>
            <p className="text-muted-foreground mb-4">We may collect the following personal data when you use our website:</p>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>Name, email address, phone number</li>
              <li>Technical data (IP address, browser type, device information)</li>
              <li>Usage data and cookies</li>
              <li>Any other data you voluntarily provide via forms or communications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">How We Collect Your Data</h2>
            <p className="text-muted-foreground mb-4">Personal data is collected:</p>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>Directly from you (via forms, email, registration)</li>
              <li>Indirectly through cookies and analytics</li>
              <li>From third-party sources, if specified</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Purposes and Legal Bases for Processing</h2>
            <p className="text-muted-foreground mb-4">We process personal data for the following purposes:</p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>To respond to inquiries or provide requested information/services</li>
              <li>To improve website performance and user experience</li>
              <li>To comply with legal obligations</li>
            </ul>
            <p className="text-muted-foreground mb-4">Legal bases for processing include:</p>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>Consent (where required)</li>
              <li>Performance of a contract</li>
              <li>Compliance with legal obligations</li>
              <li>Legitimate interests, such as improving our services (unless overridden by your interests)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Data Sharing and International Transfers</h2>
            <p className="text-muted-foreground mb-4">Personal data may be shared with:</p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Service providers for website operations, hosting, analytics</li>
              <li>Public authorities if required by law</li>
            </ul>
            <p className="text-muted-foreground">
              If data is transferred outside the EU, we ensure adequate safeguards, such as EU-approved standard contractual clauses or adequacy decisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Data Retention</h2>
            <p className="text-muted-foreground">
              Your personal data will be retained only as long as necessary for the purposes described above or as required by law. Retention periods are reviewed regularly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Cookies and Tracking Technologies</h2>
            <p className="text-muted-foreground mb-4">Our website uses cookies and tracking tools to:</p>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>Analyze usage patterns</li>
              <li>Enable core website functionalities</li>
            </ul>
            <p className="text-muted-foreground">
              You may manage cookie preferences via your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Your Rights Under GDPR</h2>
            <p className="text-muted-foreground mb-4">You have the following rights regarding your personal data:</p>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>Right to be informed</li>
              <li>Right of access</li>
              <li>Right to rectification</li>
              <li>Right to erasure ("right to be forgotten")</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability</li>
              <li>Right to object</li>
              <li>Right not to be subject to automated decision-making (including profiling)</li>
            </ul>
            <p className="text-muted-foreground">
              To exercise these rights or withdraw consent, contact our DPO.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Complaints</h2>
            <p className="text-muted-foreground">
              If you believe your rights have been violated, you have the right to lodge a complaint with your local Data Protection Authority.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Changes to This Privacy Statement</h2>
            <p className="text-muted-foreground">
              We may update this privacy statement periodically. All changes will be posted on this page.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">How to Contact Us</h2>
            <p className="text-muted-foreground">
              For privacy-related queries, contact us at [contact@email.com] or reach our DPO directly.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}