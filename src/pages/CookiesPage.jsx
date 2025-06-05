import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CookiesPage = () => {
  return (
    <div className="container py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center tracking-tight">Cookie Policy</h1>
        
        <div className="space-y-6 text-muted-foreground bg-card p-6 md:p-8 rounded-lg shadow-lg border">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. What are Cookies?</h2>
            <p>
              Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work more efficiently and to provide information to the website owners.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. How We Use Cookies</h2>
            <p>
              XpertsLaw uses cookies for several purposes, including:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><strong>Essential Cookies:</strong> These are necessary for the Platform to function properly, such as enabling user authentication and security features.</li>
              <li><strong>Performance Cookies:</strong> These help us understand how users interact with the Platform by collecting anonymous data on page visits, traffic sources, and other site metrics. This allows us to improve the Platform's performance.</li>
              <li><strong>Functionality Cookies:</strong> These allow the Platform to remember choices you make (like your username or language preference) and provide enhanced, more personalized features.</li>
              <li><strong>Targeting/Advertising Cookies:</strong> These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites. They do not store directly personal information but are based on uniquely identifying your browser and internet device.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Types of Cookies We Use</h2>
            <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>Session Cookies:</strong> These are temporary and expire once you close your browser.</li>
                <li><strong>Persistent Cookies:</strong> These remain on your device for a set period or until you delete them.</li>
                <li><strong>First-party Cookies:</strong> These are set by XpertsLaw directly.</li>
                <li><strong>Third-party Cookies:</strong> These are set by external services we use (e.g., analytics providers).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Managing Cookies</h2>
            <p>
              Most web browsers allow you to control cookies through their settings preferences. You can typically set your browser to notify you when you receive a cookie, giving you the chance to decide whether to accept it. You can also usually set your browser to refuse all cookies or to accept only cookies that are returned to the originating server.
            </p>
            <p className="mt-2">
              However, please note that if you choose to block or delete cookies, some features of the XpertsLaw Platform may not function correctly.
            </p>
            <p className="mt-2">
                For more information on how to manage cookies, visit <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.aboutcookies.org</a> or <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.allaboutcookies.org</a>.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Changes to This Cookie Policy</h2>
            <p>
              We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Contact Us</h2>
            <p>
              If you have any questions about our use of cookies, please contact us at <Link to="/contact" className="text-primary hover:underline">contact@xpertslaw.com</Link>.
            </p>
            <p className="mt-2 text-sm">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default CookiesPage;