// types/next.d.ts

import { NextApiRequest } from 'next';

// Extend the NextApiRequest type to include the `user` property
declare module 'next' {
  interface NextApiRequest {
    user?: {
      id: string;
      role: string;
      // Add any other properties from the decoded JWT
    };
  }
}
