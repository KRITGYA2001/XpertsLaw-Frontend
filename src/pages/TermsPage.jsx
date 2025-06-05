import React from 'react';
import { motion } from 'framer-motion';

const TermsPage = () => {
  return (
    <div className="container py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center tracking-tight">Terms of Service</h1>
        
        <div className="space-y-6 text-muted-foreground bg-card p-6 md:p-8 rounded-lg shadow-lg border">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using XpertsLaw ("the Platform"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Platform. We may update these Terms from time to time, and your continued use of the Platform constitutes acceptance of such changes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Platform Services</h2>
            <p>
              XpertsLaw provides a platform to connect users seeking legal services ("Clients") with legal professionals ("Lawyers"). We are not a law firm and do not provide legal advice. Any attorney-client relationship formed is solely between the Client and the Lawyer.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. User Accounts</h2>
            <p>
              To use certain features of the Platform, you may need to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to provide accurate and complete information when creating your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. User Conduct</h2>
            <p>
              You agree not to use the Platform for any unlawful purpose or in any way that could harm the Platform or its users. This includes, but is not limited to, transmitting any harmful code, engaging in fraudulent activities, or violating the rights of others.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Disclaimers</h2>
            <p>
              The Platform is provided "as is" without any warranties. We do not guarantee the accuracy, completeness, or reliability of any information on the Platform, including Lawyer profiles or user-generated content. We are not responsible for the conduct of any Lawyer or Client.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, XpertsLaw shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from your use of the Platform.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Intellectual Property</h2>
            <p>
              All content on the Platform, including text, graphics, logos, and software, is the property of XpertsLaw or its licensors and is protected by intellectual property laws. You may not use, reproduce, or distribute any content from the Platform without our prior written permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of New York, without regard to its conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at legal@xpertslaw.com.
            </p>
            <p className="mt-2 text-sm">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default TermsPage;