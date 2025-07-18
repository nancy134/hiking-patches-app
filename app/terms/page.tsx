'use client';
import Header from '@/components/Header';

export default function TermsOfServicePage() {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
    <Header />
      <h1 className="text-3xl font-bold">Terms of Service</h1>

      <p>
        Welcome to Hiking Patches! By using our website, you agree to these Terms of Service. Please read
        them carefully.
      </p>

      <h2 className="text-2xl font-semibold mt-6">1. Use of the Site</h2>
      <p>
        Hiking Patches provides tools for tracking your progress toward completing hiking challenges. You
        agree to use the site in a respectful and lawful manner.
      </p>

      <h2 className="text-2xl font-semibold mt-6">2. User Accounts</h2>
      <p>
        To track your hiking progress, you may create an account. You are responsible for keeping your
        account information secure. Do not share your login credentials with others.
      </p>

      <h2 className="text-2xl font-semibold mt-6">3. Content You Provide</h2>
      <p>
        You may upload information such as hiking patch completions and photos. You retain ownership of your
        content but give Hiking Patches permission to display it as part of the service. Do not upload
        anything you don’t have the rights to share or that violates the law.
      </p>

      <h2 className="text-2xl font-semibold mt-6">4. Termination</h2>
      <p>
        We reserve the right to suspend or terminate your account if you violate these terms or misuse the
        service.
      </p>

      <h2 className="text-2xl font-semibold mt-6">5. Disclaimers</h2>
      <p>
        We make no guarantees about the accuracy or availability of the service. You use the site at your own
        risk. Hiking Patches is not responsible for injuries, accidents, or other issues that may occur while
        hiking.
      </p>

      <h2 className="text-2xl font-semibold mt-6">6. Privacy</h2>
      <p>
        By using the site, you also agree to our{' '}
        <a href="/privacy-policy" className="text-blue-600 underline">
          Privacy Policy
        </a>.
      </p>

      <h2 className="text-2xl font-semibold mt-6">7. Contact</h2>
      <p>
        If you have any questions about these Terms, please email us at{' '}
        <a href="mailto:support@hiking-patches.com" className="text-blue-600 underline">
          support@hiking-patches.com
        </a>.
      </p>

      <p className="text-sm text-gray-600">Effective date: July 4, 2025</p>
    </div>
  );
}

