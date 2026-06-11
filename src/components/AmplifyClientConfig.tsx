'use client';

import { Amplify } from 'aws-amplify';
import outputs from '@/lib/amplifyOutputs';

Amplify.configure(outputs);

export default function AmplifyClientConfig() {
  return null;
}

