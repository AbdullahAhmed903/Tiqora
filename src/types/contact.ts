export type ContactDepartment =
  | "tickets"
  | "payments"
  | "stadium"
  | "organizers"
  | "technical"
  | "general";

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
