'use client';
import Header from '@/components/Header';
export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Header/>
      <h1 className="text-3xl font-bold">Privacy Policy</h1>

      <p>
        At Hiking Patches, we take your privacy seriously. This Privacy Policy explains how we collect, use,
        and protect your information.
      </p>

      <h2 className="text-2xl font-semibold mt-6">1. Information We Collect</h2>
      <p>We collect the following information when you use our site:</p>
      <ul className="list-disc list-inside ml-4">
        <li>Your email address if you choose to create an account or contact us</li>
        <li>Your progress on hiking challenges (patches you’ve completed or are working on)</li>
        <li>Any photos you upload as part of your hiking achievements</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6">2. How We Use Your Information</h2>
      <p>We use your information to:</p>
      <ul className="list-disc list-inside ml-4">
        <li>Help you track and manage your hiking progress</li>
        <li>Improve our service and understand how the site is being used</li>
        <li>Respond to questions or feedback you submit</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6">3. Sharing Your Information</h2>
      <p>
        We do not sell or share your personal information with third parties except as required by law or to
        protect the security and integrity of our service.
      </p>

      <h2 className="text-2xl font-semibold mt-6">4. Data Security</h2>
      <p>
        We take appropriate measures to secure your data and protect it from unauthorized access. However, no
        system can be 100% secure, so we encourage you to use a strong password and take care when sharing
        personal details online.
      </p>

      <h2 className="text-2xl font-semibold mt-6">5. Your Choices</h2>
      <p>
        You can delete your account or update your personal information at any time. If you have questions
        about your data or need help, email us at{' '}
        <a href="mailto:support@hiking-patches.com" className="text-blue-600 underline">
          support@hiking-patches.com
        </a>.
      </p>

      <h2 className="text-2xl font-semibold mt-6">6. Updates to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Changes will be posted on this page with an
        updated effective date.
      </p>

      <p className="text-sm text-gray-600">Effective date: July 4, 2025</p>
    </div>
  );
}

