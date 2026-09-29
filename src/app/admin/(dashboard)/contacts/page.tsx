import { Metadata } from "next";
import { getAdminContactSubmissionsAction } from "@/app/actions/contact";
import { ContactTable } from "@/components/admin/contact/contact-table";

export const metadata: Metadata = {
  title: "Contact & Support Inquiries | Admin Console",
  description:
    "Review incoming customer inquiries, support tickets, respond via WhatsApp or Email, and manage resolution statuses on Tiqora.",
};

export default async function AdminContactsPage() {
  const result = await getAdminContactSubmissionsAction({
    page: 1,
    limit: 15,
    status: "all",
  });

  const initialData = result.data || {
    submissions: [],
    totalCount: 0,
    page: 1,
    limit: 15,
    totalPages: 1,
    counts: {
      all: 0,
      new: 0,
      pending: 0,
      resolved: 0,
    },
  };

  return <ContactTable initialData={initialData} />;
}
