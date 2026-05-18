// src/pages/PrivacyPolicyPage.jsx
export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-surface px-4 py-8">
      <div className="max-w-3xl mx-auto text-sm text-text">
        <h1 className="text-2xl font-semibold mb-6">Privacy Policy</h1>

        <p className="mb-4">
          This Privacy Policy explains how CareerFlow (“we”, “us”, or “our”) collects, uses, and
          protects your information when you use the Applications Manager product.
        </p>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">1. Information we collect</h2>
          <p className="mb-2">
            We collect information you provide directly, such as your name, email address, and any
            job application data you choose to store in the app.
          </p>
          <p>
            When you connect a Gmail account, we access email content related to job applications in
            order to extract structured application details. We do not use your email data for
            advertising or sell it to third parties.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">2. How we use your information</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To display and manage your job applications inside the dashboard.</li>
            <li>To improve parsing quality and product experience.</li>
            <li>To communicate with you about your account and important updates.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">3. Gmail and Google data</h2>
          <p className="mb-2">
            If you connect your Gmail account, we request access only to the scopes needed to:
          </p>
          <ul className="list-disc pl-5 space-y-1 mb-2">
            <li>Read job‑related emails so we can extract application details.</li>
            <li>Receive notifications when new relevant emails arrive.</li>
          </ul>
          <p>
            You can disconnect Gmail at any time from the Settings page. When disconnected, we stop
            receiving new email data, but existing application records remain in your account until
            you delete them.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">4. Data retention and deletion</h2>
          <p>
            You can delete individual applications or your entire account from the app. Once deleted,
            associated data is removed from our primary systems within a reasonable time period,
            subject to any legal obligations.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">5. Third‑party services</h2>
          <p>
            We may use third‑party infrastructure providers (for example, hosting, databases, and
            monitoring) to run CareerFlow. These providers process data on our behalf and are bound by
            appropriate data protection obligations.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">6. Your rights</h2>
          <p>
            Depending on your location, you may have rights to access, correct, or delete your
            personal data. You can exercise many of these rights directly in the app, or by
            contacting us using the details below.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">7. Contact us</h2>
          <p>
            If you have questions about this Privacy Policy, you can contact us at:
            <br />
            <span className="font-mono">support@careerflow.example</span>
          </p>
        </section>

        <p className="text-xs text-muted mt-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </main>
  );
}