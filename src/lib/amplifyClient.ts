import { Amplify } from 'aws-amplify';
import awsConfig from '../aws-exports';

console.log('Amplify config: ', awsConfig)
Amplify.configure(awsConfig);

