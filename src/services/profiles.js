import { supabase } from "../supabase";

// Sadece admin RLS sayesinde tum satirlari gorur; normal kullanici yalnizca kendi satirini gorur.
export function subscribeProfiles(callback) {
  let cancelled = false;

  async function fetchAll() {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("createdAt", { ascending: false });
    if (!cancelled && !error) callback(data);
  }

  fetchAll();

  const channel = supabase
    .channel("profiles-all")
    .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, fetchAll)
    .subscribe();

  return () => {
    cancelled = true;
    supabase.removeChannel(channel);
  };
}

export async function fetchOwnProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
}
