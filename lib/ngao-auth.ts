import { NgaoRole } from '@/generated/prisma/enums';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export interface NgaoTokenPayload {
  type: 'ngao';
  ngaoId: string;
  serviceId: string;
  role: NgaoRole;
  locationId?: string;
  subLocationId?: string;
  subCountyId?: string;
}

export function generateNgaoToken(payload: Omit<NgaoTokenPayload, 'type'>): string {
  return jwt.sign({ ...payload, type: 'ngao' }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyNgaoToken(token: string): NgaoTokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as NgaoTokenPayload;
    if (decoded.type !== 'ngao') return null;
    return decoded;
  } catch {
    return null;
  }
}
