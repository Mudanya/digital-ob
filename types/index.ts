import { Case, User, Station, Suspect, Victim, Witness, Evidence, CaseUpdate, CourtFile, OBEntry, County } from "@/generated/prisma/client";
import { CaseCategory, CaseStatus, CasePriority, UserRole, DutyStatus } from "@/generated/prisma/enums";
import { LucideIcon } from "lucide-react";


// Dashboard card types
export interface DashCardItem {
  title: string;
  value: string | number;
  icon: LucideIcon
  change?: string;
  color: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Case with relations
export interface CaseWithRelations extends Case {
  reportedBy: Pick<User, 'id' | 'firstName' | 'lastName' | 'serviceNumber' | 'rank'>;
  assignedTo?: Pick<User, 'id' | 'firstName' | 'lastName' | 'serviceNumber' | 'rank'> | null;
  station: Pick<Station, 'id' | 'name' | 'code'>;
  suspects?: Suspect[];
  victims?: Victim[];
  witnesses?: Witness[];
  evidence?: Evidence[];
  caseUpdates?: CaseUpdate[];
  courtFiles?: CourtFile[];
  obEntry?: OBEntry | null;
}

// User with relations
export interface UserWithRelations extends Omit<User, 'password'> {
  station?: Pick<Station, 'id' | 'name' | 'code'> | null;
  county?: Pick<County, 'id' | 'name' | 'code'> | null;
}

// Auth types
export interface LoginCredentials {
  serviceNumber: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: UserWithRelations;
}

export interface AuthContextType {
  user: UserWithRelations | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

// Dashboard stats
export interface DashboardStats {
  stats: {
    totalCases: {
      count: number;
      change: string;
    };
    pendingCases: {
      count: number;
      urgent: number;
    };
    officersActive: {
      count: number;
      status: string;
    };
    courtCases: {
      count: number;
      thisWeek: number;
    };
  };
  recentCases: Array<{
    id: string;
    obNumber: string;
    title: string;
    category: CaseCategory;
    status: CaseStatus;
    priority: CasePriority;
    location: string;
    reportedBy: string;
    station: string;
    createdAt: Date;
  }>;
  recentActivity: Array<{
    id: string;
    action: string;
    description: string;
    timestamp: Date;
    metadata?: any;
  }>;
  monthlyStats: Array<{
    month: Date;
    count: number;
  }>;
}

// Form types
export interface CreateCaseForm {
  title: string;
  description: string;
  category: CaseCategory;
  priority?: CasePriority;
  location: string;
  latitude?: number;
  longitude?: number;
  incidentDate: string;
  stationId?: string;
}

export interface UpdateCaseForm {
  status?: CaseStatus;
  priority?: CasePriority;
  assignedToId?: string;
  notes?: string;
}

export interface CreateTrafficOffenseForm {
  driverName: string;
  driverIdNumber?: string;
  driverLicense?: string;
  vehicleReg: string;
  offenseType: string;
  location: string;
  latitude?: number;
  longitude?: number;
  fineAmount?: number;
  offenseDate: string;
}

// Export enums for convenience
export {
  UserRole,
  CaseStatus,
  CasePriority,
  CaseCategory,
  DutyStatus,
};