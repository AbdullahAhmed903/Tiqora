import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminProfileView } from "@/components/admin/profile/admin-profile-view";
import type { Profile, OrganizerPermission } from "@/types/auth";

export const metadata = {
  title: "My Staff Profile | Tiqora Admin",
  description: "View and manage your staff profile credentials, avatar photo, and permission assignments.",
};

export default async function AdminProfilePage() {
  const supabase = await createClient();

  // 1. Authenticate user session
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/admin/login");
  }

  // 2. Fetch profile from database
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    redirect("/admin");
  }

  // 3. Fetch permissions & specializations from organizer_permissions
  const { data: permsData } = await supabase
    .from("organizer_permissions")
    .select(`
      *,
      granted_by_user:profiles!granted_by(id, full_name, email)
    `)
    .eq("user_id", user.id);

  const permissions: OrganizerPermission[] = (permsData || []).map((p) => ({
    id: p.id,
    user_id: p.user_id,
    section: p.section,
    access_level: p.access_level,
    specializations: Array.isArray(p.specializations) ? p.specializations : [],
    granted_by: p.granted_by,
    created_at: p.created_at,
    updated_at: p.updated_at,
  }));

  // Aggregate specializations
  const specializationsSet = new Set<string>();
  let grantedByUser: { id: string; full_name: string | null; email: string | null } | null = null;

  for (const p of permsData || []) {
    if (Array.isArray(p.specializations)) {
      p.specializations.forEach((s: string) => {
        if (s) specializationsSet.add(s);
      });
    }
    if (p.granted_by_user && !grantedByUser) {
      grantedByUser = p.granted_by_user;
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
          Staff Profile & Credentials
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Manage your personal details, avatar photo, and inspect your security permissions.
        </p>
      </div>

      <AdminProfileView
        initialProfile={profile as Profile}
        permissions={permissions}
        specializations={Array.from(specializationsSet)}
        grantedByUser={grantedByUser}
      />
    </div>
  );
}
