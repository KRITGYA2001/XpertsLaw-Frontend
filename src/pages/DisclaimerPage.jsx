import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const DisclaimerPage = () => {
  return (
    <div className="container py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center tracking-tight">Disclaimer</h1>
        
        <div className="space-y-6 text-muted-foreground bg-card p-6 md:p-8 rounded-lg shadow-lg border">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. No Attorney-Client Relationship</h2>
            <p>
              XpertsLaw is a platform that connects users seeking legal services with independent legal professionals. The use of XpertsLaw ("the Platform") does not create an attorney-client relationship between you and XpertsLaw, its owners, employees, or affiliates. XpertsLaw is not a law firm and does not provide legal advice, legal representation, or legal services.
            </p>
            <p className="mt-2">
              Any attorney-client relationship formed through the use of the Platform is solely between the user ("Client") and the independent lawyer ("Lawyer") they choose to engage. XpertsLaw is not a party to any such relationship or agreement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Not Legal Advice</h2>
            <p>
              Any information provided on the Platform, including articles, blog posts, guides, or other content, is for informational purposes only and should not be construed as legal advice. You should not rely on any information on the Platform as a substitute for consultation with a qualified legal professional licensed in your jurisdiction.
            </p>
            <p className="mt-2">
              The law varies by jurisdiction, and the information on the Platform may not be applicable to your specific legal situation. Always seek the advice of a qualified attorney regarding any legal questions or concerns you may have.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Lawyer Information and Verification</h2>
            <p>
              XpertsLaw attempts to verify the licensure and credentials of Lawyers listed on the Platform. However, we do not guarantee the accuracy, completeness, or timeliness of this information. It is the responsibility of the Client to conduct their own due diligence and verify the qualifications, experience, and suitability of any Lawyer before engaging their services.
            </p>
            <p className="mt-2">
              Lawyer profiles, ratings, reviews, and other information provided on the Platform are based on information provided by the Lawyers themselves or by users, and XpertsLaw does not endorse or recommend any particular Lawyer.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. No Guarantees or Endorsements</h2>
            <p>
              XpertsLaw makes no guarantees, representations, or warranties, express or implied, regarding the quality, outcome, or effectiveness of legal services provided by Lawyers found through the Platform. We do not endorse any specific Lawyer or legal opinion.
            </p>
            <p className="mt-2">
              Your reliance on any information or Lawyer found through the Platform is solely at your own risk.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Limitation of Liability</h2>
            <p>
              XpertsLaw, its owners, employees, and affiliates shall not be liable for any damages, losses, or claims arising out of or in connection with your use of the Platform or your engagement of any Lawyer found through the Platform. This includes, but is not limited to, direct, indirect, incidental, special, consequential, or punitive damages.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Third-Party Links</h2>
            <p>
              The Platform may contain links to third-party websites or resources. XpertsLaw is not responsible for the content, accuracy, or practices of these third-party sites. The inclusion of any link does not imply endorsement by XpertsLaw.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Changes to Disclaimer</h2>
            <p>
              We reserve the right to modify this Disclaimer at any time. Any changes will be effective immediately upon posting on the Platform. Your continued use of the Platform after any such changes constitutes your acceptance of the new Disclaimer.
            </p>
            <p className="mt-2 text-sm">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default DisclaimerPage;