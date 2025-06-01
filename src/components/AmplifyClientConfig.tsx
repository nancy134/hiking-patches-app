'use client';

import { useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import awsconfig from '../aws-exports';

export default function AmplifyClientConfig() {
  useEffect(() => {
    console.log('[Amplify Init] Configuring in browser with:', awsconfig);
    Amplify.configure(awsconfig);
  }, []);

  return null; // no UI, just side effect
}

