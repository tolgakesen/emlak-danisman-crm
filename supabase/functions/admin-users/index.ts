import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const jwt = (req.headers.get("Authorization") ?? "").replace("Bearer ", "");
    if (!jwt) return json({ error: "Yetkilendirme gerekli." }, 401);

    const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    const { data: userData, error: userError } = await adminClient.auth.getUser(jwt);
    if (userError || !userData?.user) {
      return json({ error: "Geçersiz oturum." }, 401);
    }

    const { data: profile, error: profileError } = await adminClient
      .from("profiles")
      .select("role")
      .eq("id", userData.user.id)
      .single();

    if (profileError || profile?.role !== "admin") {
      return json({ error: "Bu işlem için admin yetkisi gerekiyor." }, 403);
    }

    const body = await req.json();

    if (body.action === "create_user") {
      const { email, password, fullName } = body;
      if (!email || !password) {
        return json({ error: "Email ve şifre gerekli." }, 400);
      }
      const { data, error } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (error) return json({ error: error.message }, 400);

      if (fullName) {
        await adminClient.from("profiles").update({ fullName }).eq("id", data.user.id);
      }
      return json({ ok: true, userId: data.user.id });
    }

    if (body.action === "reset_password") {
      const { userId, newPassword } = body;
      if (!userId || !newPassword) {
        return json({ error: "Kullanıcı ve yeni şifre gerekli." }, 400);
      }
      const { error } = await adminClient.auth.admin.updateUserById(userId, {
        password: newPassword,
      });
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    return json({ error: "Bilinmeyen işlem." }, 400);
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : "Beklenmeyen hata." }, 500);
  }
});
