import { UserRole } from '@/generated/prisma/enums';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  serviceNumber: string;
  stationId?: string;
  countyId?: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
  });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

// Role hierarchy for authorization
const roleHierarchy: Record<UserRole, number> = {
  INSPECTOR_GENERAL: 10,
  DEPUTY_INSPECTOR_GENERAL: 9,
  COUNTY_COMMANDER: 8,
  OCPD: 7,
  OCS: 6,
  OCP: 5,
  INSPECTOR: 4,
  SERGEANT: 3,
  CORPORAL: 2,
  CONSTABLE: 1,
  ADMIN: 5,
};

export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

export function canAccessStation(
  userRole: UserRole,
  userStationId: string | null | undefined,
  targetStationId: string
): boolean {
  // IG, DIG, County Commanders can access all stations
  if (
    userRole === 'INSPECTOR_GENERAL' ||
    userRole === 'DEPUTY_INSPECTOR_GENERAL' ||
    userRole === 'COUNTY_COMMANDER'
  ) {
    return true;
  }

  // Others can only access their own station
  return userStationId === targetStationId;
}

export function canAccessCounty(
  userRole: UserRole,
  userCountyId: string | null | undefined,
  targetCountyId: string
): boolean {
  // IG, DIG can access all counties
  if (
    userRole === 'INSPECTOR_GENERAL' ||
    userRole === 'DEPUTY_INSPECTOR_GENERAL'
  ) {
    return true;
  }

  // County Commander can only access their county
  if (userRole === 'COUNTY_COMMANDER') {
    return userCountyId === targetCountyId;
  }

  return false;
}
