export type ContactDepartment =
  | "tickets"
  | "payments"
  | "stadium"
  | "organizers"
  | "technical"
  | "general";

export type ContactStatus = "new" | "pending" | "resolved";

export interface ContactDepartmentOption {
  id: ContactDepartment;
  label: string;
  description: string;
  iconName: "Ticket" | "CreditCard" | "ShieldCheck" | "Trophy" | "Wrench" | "HelpCircle";
}

export interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
  department: ContactDepartment | "";
  subject: string;
  message: string;
  attachment: File | null;
}

export interface ContactSubmission {
  id: string;
  ticket_number: string;
  full_name: string;
  email: string;
  phone: string;
  department: ContactDepartment;
  status: ContactStatus;
  subject: string | null;
  message: string;
  attachment_url: string | null;
  attachment_path: string | null;
  attachment_name: string | null;
  attachment_size_bytes: number | null;
  attachment_mime_type: string | null;
  ip_address: string | null;
  admin_notes: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  department?: string;
  search?: string;
}

export interface ContactStatusCounts {
  all: number;
  new: number;
  pending: number;
  resolved: number;
}

export interface PaginatedContactSubmissionsResult {
  submissions: ContactSubmission[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  counts: ContactStatusCounts;
}

export interface ContactSubmissionResult {
  success: boolean;
  message: string;
  ticketNumber?: string;
  code?: string;
}
