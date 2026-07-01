import { supabase } from "../supabase";

// Verilen tabloda, giriş yapan kullanıcıya (ownerId) ait satırları çeker
// ve Supabase Realtime ile değişiklikleri dinler. Herhangi bir ekleme/
// güncelleme/silme olduğunda liste yeniden çekilip callback çağrılır.
export function subscribeOwned(table, ownerId, orderField, callback) {
  let cancelled = false;

  async function fetchAll() {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("ownerId", ownerId)
      .order(orderField, { ascending: false });
    if (!cancelled && !error) callback(data);
  }

  fetchAll();

  const channel = supabase
    .channel(`${table}-${ownerId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table, filter: `ownerId=eq.${ownerId}` },
      fetchAll
    )
    .subscribe();

  return () => {
    cancelled = true;
    supabase.removeChannel(channel);
  };
}

export async function addOwned(table, ownerId, data) {
  const { error } = await supabase.from(table).insert({ ...data, ownerId });
  if (error) throw error;
}

export async function updateOwned(table, id, data) {
  const { error } = await supabase.from(table).update(data).eq("id", id);
  if (error) throw error;
}

export async function removeOwned(table, id) {
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw error;
}
