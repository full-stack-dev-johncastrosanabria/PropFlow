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

// Dashboard types
export interface DashboardDto {
  totalProperties: number;
  totalUnits: number;
  occupiedUnits: number;
  pendingPayments: number;
  latePayments: number;
  openMaintenanceRequests: number;
}
