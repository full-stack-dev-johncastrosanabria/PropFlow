// Enums
export enum UnitStatus {
  Available = 0,
  Occupied = 1,
  Maintenance = 2,
}

export enum ContractStatus {
  Active = 0,
  Finished = 1,
  Cancelled = 2,
}

export enum PaymentStatus {
  Pending = 0,
  Paid = 1,
  Late = 2,
}

export enum Priority {
  Low = 0,
  Medium = 1,
  High = 2,
}

export enum MaintenanceStatus {
  Open = 0,
  InProgress = 1,
  Closed = 2,
}

export enum LeadStage {
  New = 0,
  Contacted = 1,
  Qualified = 2,
  Viewing = 3,
  Negotiation = 4,
  Won = 5,
  Lost = 6,
}

export enum LeadSource {
  Website = 0,
  Referral = 1,
  SocialMedia = 2,
  Portal = 3,
  WalkIn = 4,
  Other = 5,
}

// Auth types
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
}

export interface LandlordDto {
  id: string;
  email: string;
  fullName: string;
  createdAtUtc: string;
}

export interface AuthResponseDto {
  token: string;
  landlord: LandlordDto;
}

// Property types
export interface PropertyDto {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  notes?: string;
  createdAtUtc: string;
}

export interface CreatePropertyDto {
  name: string;
  address: string;
  city: string;
  country: string;
  notes?: string;
}

export interface UpdatePropertyDto extends CreatePropertyDto {}

// Rental Unit types
export interface RentalUnitDto {
  id: string;
  propertyId: string;
  name: string;
  unitNumber?: string;
  monthlyRent: number;
  currency: string;
  status: UnitStatus;
  createdAtUtc: string;
}

export interface CreateRentalUnitDto {
  propertyId: string;
  name: string;
  unitNumber?: string;
  monthlyRent: number;
  currency: string;
  status: UnitStatus;
}

export interface UpdateRentalUnitDto {
  name: string;
  unitNumber?: string;
  monthlyRent: number;
  currency: string;
  status: UnitStatus;
}

// Tenant types
export interface TenantDto {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  identificationNumber?: string;
  notes?: string;
  createdAtUtc: string;
}

export interface CreateTenantDto {
  fullName: string;
  email: string;
  phone?: string;
  identificationNumber?: string;
  notes?: string;
}

export interface UpdateTenantDto extends CreateTenantDto {}

// Contract types
export interface ContractDto {
  id: string;
  tenantId: string;
  rentalUnitId: string;
  startDate: string;
  endDate?: string;
  monthlyRent: number;
  depositAmount: number;
  currency: string;
  status: ContractStatus;
  createdAtUtc: string;
  tenantName?: string;
  unitName?: string;
}

export interface CreateContractDto {
  tenantId: string;
  rentalUnitId: string;
  startDate: string;
  endDate?: string;
  monthlyRent: number;
  depositAmount: number;
  currency: string;
  status: ContractStatus;
}

export interface UpdateContractDto {
  startDate: string;
  endDate?: string;
  monthlyRent: number;
  depositAmount: number;
  currency: string;
  status: ContractStatus;
}

// Payment types
export interface PaymentDto {
  id: string;
  contractId: string;
  dueDate: string;
  paidDate?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  notes?: string;
  createdAtUtc: string;
}

export interface CreatePaymentDto {
  contractId: string;
  dueDate: string;
  paidDate?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  notes?: string;
}

export interface UpdatePaymentDto extends CreatePaymentDto {}

// Maintenance Request types
export interface MaintenanceRequestDto {
  id: string;
  propertyId: string;
  rentalUnitId?: string;
  title: string;
  description: string;
  priority: Priority;
  status: MaintenanceStatus;
  createdAtUtc: string;
  propertyName?: string;
  unitName?: string;
}

export interface CreateMaintenanceRequestDto {
  propertyId: string;
  rentalUnitId?: string;
  title: string;
  description: string;
  priority: Priority;
  status: MaintenanceStatus;
}

export interface UpdateMaintenanceRequestDto {
  title: string;
  description: string;
  priority: Priority;
  status: MaintenanceStatus;
}

// Lead types
export interface LeadDto {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  source: LeadSource;
  stage: LeadStage;
  estimatedValue: number;
  currency: string;
  interestedIn?: string;
  notes?: string;
  lastContactedUtc?: string;
  createdAtUtc: string;
}

export interface CreateLeadDto {
  fullName: string;
  email: string;
  phone?: string;
  source: LeadSource;
  stage: LeadStage;
  estimatedValue: number;
  currency: string;
  interestedIn?: string;
  notes?: string;
}

export interface UpdateLeadDto extends CreateLeadDto {}

// Productivity (Keller Williams) types
export interface DailyActivityDto {
  id: string;
  date: string;
  contacts: number;
  conversations: number;
  leadsAdded: number;
  appointmentsSet: number;
  appointmentsMet: number;
  agreementsSigned: number;
  offersWritten: number;
  leadGenHours: number;
  notes?: string;
}

export interface UpsertDailyActivityDto {
  date: string;
  contacts: number;
  conversations: number;
  leadsAdded: number;
  appointmentsSet: number;
  appointmentsMet: number;
  agreementsSigned: number;
  offersWritten: number;
  leadGenHours: number;
  notes?: string;
}

export interface ActivityTotalsDto {
  contacts: number;
  conversations: number;
  leadsAdded: number;
  appointmentsSet: number;
  appointmentsMet: number;
  agreementsSigned: number;
  offersWritten: number;
  leadGenHours: number;
  daysLogged: number;
}

export interface DayPointDto {
  date: string;
  label: string;
  contacts: number;
  conversations: number;
  appointmentsMet: number;
  leadGenHours: number;
  blockDone: boolean;
}

export interface ProductivityGoalsDto {
  leadGenHours: number;
  contacts: number;
  conversations: number;
  appointmentsSet: number;
  leadsAdded: number;
  appointmentsMet: number;
}

export interface ProductivitySummaryDto {
  today: string;
  todayActivity: DailyActivityDto;
  weekTotals: ActivityTotalsDto;
  monthTotals: ActivityTotalsDto;
  last30Totals: ActivityTotalsDto;
  leadGenStreak: number;
  bestStreak: number;
  last7Days: DayPointDto[];
  goals: ProductivityGoalsDto;
}

// Dashboard types
export interface StageCountDto {
  stage: number;
  label: string;
  count: number;
  value: number;
}

export interface MonthlyRevenueDto {
  month: string;
  year: number;
  collected: number;
  expected: number;
}

export interface UpcomingPaymentDto {
  id: string;
  tenantName: string;
  unitName: string;
  amount: number;
  currency: string;
  dueDate: string;
  status: number;
  isOverdue: boolean;
  daysUntilDue: number;
}

export interface ExpiringContractDto {
  id: string;
  tenantName: string;
  unitName: string;
  endDate: string;
  daysLeft: number;
  monthlyRent: number;
  currency: string;
}

export interface ActivityItemDto {
  type: string;
  title: string;
  subtitle: string;
  when: string;
}

export interface DashboardDto {
  currency: string;

  totalProperties: number;
  totalUnits: number;
  occupiedUnits: number;
  availableUnits: number;
  maintenanceUnits: number;
  occupancyRate: number;

  collectedThisMonth: number;
  expectedThisMonth: number;
  collectionRate: number;
  outstandingAmount: number;
  overdueAmount: number;
  monthlyRecurringRevenue: number;

  pendingPayments: number;
  latePayments: number;
  paidPaymentsThisMonth: number;

  totalTenants: number;
  activeContracts: number;
  expiringContracts: number;

  openMaintenanceRequests: number;
  inProgressMaintenance: number;
  highPriorityMaintenance: number;

  totalLeads: number;
  activeLeads: number;
  wonLeads: number;
  pipelineValue: number;
  leadsByStage: StageCountDto[];

  revenueTrend: MonthlyRevenueDto[];
  upcomingPayments: UpcomingPaymentDto[];
  expiringContractsList: ExpiringContractDto[];
  recentActivity: ActivityItemDto[];
}
