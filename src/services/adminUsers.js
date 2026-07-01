import { supabase } from "../supabase";

async function invoke(action, payload) {
  const { data, error } = await supabase.functions.invoke("admin-users", {
    body: { action, ...payload },
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
}

export function createUser({ email, password, fullName }) {
  return invoke("create_user", { email, password, fullName });
}

export function resetPassword({ userId, newPassword }) {
  return invoke("reset_password", { userId, newPassword });
}
