export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>

          <p className="text-lg font-semibold text-foreground mb-8">Effective Date: {new Date().toLocaleDateString()}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Agreement</h2>
            <p className="text-muted-foreground">
              By engaging Robofy's AI transformation or consulting services ("Services"), you ("Client", "you", or "your") agree to these Terms of Service ("Terms"). If you do not agree, please do not use our Services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Service Scope & Deliverables</h2>
            <p className="text-muted-foreground">
              Robofy offers:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mt-4">
              <li>AI transformation and digital strategy consulting</li>
              <li>Custom AI solutions, automation, and integration advisory</li>
              <li>Web, data, and technology implementation services</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Details of each engagement (scope, deliverables, fees, timelines) are established in separate written statements of work (SOW) or proposals.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Client Responsibilities</h2>
            <p className="text-muted-foreground">
              You agree to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mt-4">
              <li>Provide timely access, information, and resources required for delivery of Services</li>
              <li>Designate a project representative/contact point for decisions and communications</li>
              <li>Review and accept/approve deliverables in a timely manner</li>
              <li>Comply with all applicable laws & regulations for your business or project</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Fees, Payment & Invoicing</h2>
            <p className="text-muted-foreground">
              Fees and payment schedules are agreed in writing for each project. Invoices must be paid as per the agreed terms (typically within 30 days). Late payments may result in delayed work or additional charges.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Intellectual Property & Licensing</h2>
            <p className="text-muted-foreground">
              Unless otherwise agreed in writing:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mt-4">
              <li>Robofy retains IP rights in methodologies, tools, code, and deliverables except for client-specific customizations delivered to you.</li>
              <li>You receive a worldwide, royalty-free license to use deliverables for internal business purposes.</li>
              <li>You agree not to reverse engineer, resell, or commercially exploit deliverables without prior consent.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Confidentiality</h2>
            <p className="text-muted-foreground">
              Both parties agree to protect the confidentiality of each other's proprietary or sensitive information received during the engagement and to not disclose it to third parties except as required by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Data Security & Privacy</h2>
            <p className="text-muted-foreground">
              Robofy will implement commercially reasonable measures to protect client data. Your use of our Services is also governed by our Privacy Policy (available on our website). You are responsible for data you provide, including its collection and lawful processing.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Limitation of Liability & Disclaimer</h2>
            <p className="text-muted-foreground">
              Robofy's Services and recommendations are provided "as is" based on available data and your inputs. We do not guarantee specific business results or uninterrupted service. Robofy is not liable for indirect, incidental, or consequential damages. Total liability for any claim is limited to the amount paid for the specific project or service in question.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Indemnification</h2>
            <p className="text-muted-foreground">
              You agree to indemnify and hold Robofy harmless from any claims, losses, or liabilities resulting from your use or misuse of the deliverables or breach of these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Regulatory Compliance</h2>
            <p className="text-muted-foreground">
              You are responsible for your own compliance with local, national, and international regulations related to the deployment and use of AI tools and technologies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">11. Termination</h2>
            <p className="text-muted-foreground">
              Either party may terminate an engagement in writing with notice if the other party breaches these Terms and does not cure such breach within thirty (30) days. Upon termination, you pay for work performed up to the termination date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">12. Amendments</h2>
            <p className="text-muted-foreground">
              Robofy may update these Terms; clients will be notified of material changes. Continued use of Services constitutes acceptance of revised Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">13. Governing Law & Dispute Resolution</h2>
            <p className="text-muted-foreground">
              These Terms are governed by the laws of [Jurisdiction]. Disputes will be resolved through negotiation, and, if necessary, binding arbitration in [Jurisdiction].
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">14. Contact</h2>
            <p className="text-muted-foreground mb-4">
              For questions, contact:
            </p>
            <div className="text-muted-foreground">
              <p><strong>Robofy</strong></p>
              <p>online</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}