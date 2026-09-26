export type FaqCategory =
  | "all"
  | "tickets"
  | "stadium"
  | "payments"
  | "account"
  | "organizers";

export interface FaqItem {
  id: string;
  category: "tickets" | "stadium" | "payments" | "account" | "organizers";
  question: string;
  answer: string;
  popular?: boolean;
  tags?: string[];
}

export interface FaqCategoryConfig {
  id: FaqCategory;
  label: string;
  iconName: string;
  description: string;
}

export interface FaqTopicHighlight {
  id: string;
  title: string;
  description: string;
  category: FaqCategory;
  iconName: string;
}
