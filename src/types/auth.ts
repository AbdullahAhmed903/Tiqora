export type UserRole = "user" | "organizer" | "admin";

export type UserStatus = "active" | "suspended";

export type PermissionSection =
  | "events"
  | "venues"
  | "tickets"
  | "bookings"
  | "coupons"
  | "analytics"
  | "support";

export type AccessLevel = "read" | "write";

export interface Profile {
  id: string;
  username: string;
  email: string | null;
  full_name: string | null;
  phone_number: string | null;
  avatar_url: string | null;
  date_of_birth: string | null; // ISO Date string (YYYY-MM-DD)
  role: UserRole;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

export interface OrganizerPermission {
  id: string;
  user_id: string;
  section: PermissionSection;
  access_level: AccessLevel;
  specializations: string[];
  granted_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface StaffMemberRow extends Profile {
  permissions: OrganizerPermission[];
  specializations: string[];
  granted_by_user?: {
    id: string;
    full_name: string | null;
    email: string | null;
  } | null;
}

export type OrganizerPermissionsMap = Partial<Record<PermissionSection, AccessLevel>>;

export interface AdminAuditLog {
  id: string;
  admin_id: string;
  target_user_id: string | null;
  action: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export type AuthProvider = "email" | "google" | "oauth";

export interface ProfileStats {
  favoritesCount: number;
  ticketsCount: number;
  memberSinceFormatted: string;
}

