import outputs from './amplifyOutputs';

export const s3Bucket = outputs.storage.bucket_name;
export const s3Region = outputs.storage.aws_region;
export const appSyncUrl = outputs.data.url;
export const appSyncApiKey = outputs.data.api_key;
