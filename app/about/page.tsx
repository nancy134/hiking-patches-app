'use client';

import Link from 'next/link';
import Header from '@/components/Header';

export default function AboutPage() {
  return (
      <div className="max-w-5xl mx-auto p-6 space-y-6">
      <Header />
      <h1 className="text-3xl font-bold">About hiking-patches.com</h1>

      <p>
        hiking-patches.com is built by a small team of hikers who love the challenge and reward of earning
        hiking patches. Whether it's a local trail series, a state-wide challenge, or a national
        accomplishment, we know the thrill of completing a list and receiving your patch in the mail.
      </p>

      <p>
        We're passionate about helping others discover these challenges, stay motivated, and celebrate
        their accomplishments. This site is designed to make it easy to track your progress,
         and get inspired by what others are doing.
      </p>

      <p>
        Have a question or suggestion? We’d love to hear from you. Email us at{' '}
        <a href="mailto:support@hiking-patches.com" className="text-blue-600 underline">
          support@hiking-patches.com
        </a>.
      </p>

      <p>
        You can read our{' '}
        <Link href="/privacy-policy" className="text-blue-600 underline">
          Privacy Policy
        </Link>{' '}
        to learn more about how we handle your data and read our <Link href="/terms" className="text-blue-600 underline">Terms</Link>.
      </p>
    </div>
  );
}

