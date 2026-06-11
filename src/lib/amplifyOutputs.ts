import devOutputs from '../../amplify_outputs.json';
import stagingOutputs from '../../amplify_outputs.staging.json';

// Set NEXT_PUBLIC_AMPLIFY_ENV=staging to point the frontend at the Gen2
// staging branch deploy instead of the dev/sandbox backend.
const outputs = process.env.NEXT_PUBLIC_AMPLIFY_ENV === 'staging' ? stagingOutputs : devOutputs;

export default outputs;
