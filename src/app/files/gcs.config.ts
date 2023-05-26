import { StorageOptions } from '@google-cloud/storage';
import * as path from 'path';

export const GCS_CONFIG: StorageOptions = {
  projectId: process.env.PROJECT_KEY,
  keyFilename: path.join(__dirname, `../../../key.json`),
};
