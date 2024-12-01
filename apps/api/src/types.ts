// apps/api/src/types.ts
import { Request } from 'express';
import { User } from '@prisma/client';

export interface AuthenticatedRequest extends Request {
    user?: User;
}

export type UserType = User;

export type PublicUser = {
    id: number;
    email: string;
    name: string;
    role: string;
};