import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPage = () => {
  return (
    <div className="container py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center tracking-tight">Privacy Policy</h1>
        
        <div className="space-y-6 text-muted-foreground bg-card p-6 md:p-8 rounded-lg shadow-lg border">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Introduction</h2>
            <p>
              XpertsLaw ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform ("the Platform"). Please read this policy carefully.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Information We Collect</h2>
            <p>
              We may collect personal information such as your name, email address, phone number, and case details when you register an account or use our services. We also collect non-personal information, such as browser type, IP address, and usage data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
            <p>
              We use your information to:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Provide, operate, and maintain the Platform.</li>
              <li>Improve, personalize, and expand our services.</li>
              <li>Understand and analyze how you use the Platform.</li>
              <li>Communicate with you, including for customer service and promotional purposes.</li>
              <li>Process your transactions and manage your consultations.</li>
              <li>Prevent fraud and ensure the security of the Platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Sharing Your Information</h2>
            <p>
              We may share your information with Lawyers on the Platform to facilitate consultations. We may also share information with third-party service providers who assist us in operating the Platform. We will not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Data Security</h2>
            <p>
              We implement reasonable security measures to protect your information. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Your Choices</h2>
            <p>
              You can review and update your account information at any time. You may opt-out of receiving promotional emails from us by following the unsubscribe instructions in those emails.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to collect information about your browsing activities and preferences. You can control the use of cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page. Your continued use of the Platform after such changes constitutes your acceptance of the new policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at privacy@xpertslaw.com.
            </p>
            <p className="mt-2 text-sm">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacyPage;