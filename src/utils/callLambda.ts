// utils/callLambda.ts or inside a client component
import { API } from 'aws-amplify';

export async function callListUsers() {
  try {
    const response = await API.get('https://zlshwrb5h6.execute-api.us-east-1.amazonaws.com/staging', '/list-users', {});
    console.log('Lambda response:', response);
    return response;
  } catch (error) {
    console.error('Lambda call failed:', error);
    throw error;
  }
}

