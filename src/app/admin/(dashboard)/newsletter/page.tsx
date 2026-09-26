import { Metadata } from "next";
import { getNewsletterSubscribersAction } from "@/app/actions/newsletter";
import { NewsletterSubscribersTable } from "@/components/admin/newsletter/newsletter-subscribers-table";

export const metadata: Metadata = {
  title: "Newsletter Subscribers | Admin Console",
  description: "View and manage email subscriptions, moderate status, and export audience lists on Tiqora.",
};

export default async function AdminNewsletterPage() {
  const result = await getNewsletterSubscribersAction({ page: 1, limit: 20, status: "all" });

  const initialData = result.data || {
    subscribers: [],
    totalCount: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
  };

  return <NewsletterSubscribersTable initialData={initialData} />;
}
