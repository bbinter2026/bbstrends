// Publica vagas aprovadas no Facebook e Instagram e envia alertas WhatsApp (Cloud API).
// Cada canal só corre se os seus segredos existirem. Vagas sem cartaz (poster_url) são ignoradas.
import { createClient } from "npm:@supabase/supabase-js@2";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const env = (k: string) => Deno.env.get(k);
const G = `https://graph.facebook.com/${env("GRAPH_VERSION") ?? "v21.0"}`; // confirme a versão actual na documentação da Meta
const SITE = (env("SITE_URL") ?? "").replace(/\/$/, "");
const today = () => new Date().toISOString().slice(0, 10);
const post = async (url: string, body: Record<string, unknown>, token?: string) => {
  const r = await fetch(url, { method: "POST", headers: { "content-type": "application/json", ...(token ? { authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(body) });
  return { ok: r.ok, j: await r.json().catch(() => ({})) };
};

Deno.serve(async (req) => {
  if (req.headers.get("x-cron-secret") !== env("CRON_SECRET")) return new Response("forbidden", { status: 403 });
  const out: any = { social: [], alerts: [] };

  // 1) Facebook + Instagram
  if (env("FB_PAGE_ID") && env("FB_PAGE_TOKEN")) {
    const { data: jobs } = await db.from("bbs_jobs").select("*").eq("status", "published").gte("deadline", today())
      .is("social_posted_at", null).not("poster_url", "is", null).limit(5);
    for (const j of jobs ?? []) {
      const caption = `${j.title}\n${j.org} · ${j.prov}\nPrazo: ${j.deadline}\n\nDetalhes e como candidatar-se: ${SITE}/?vaga=${j.id}\n\nNunca pague para se candidatar.\n#EmpregoMoçambique #Vagas`;
      const errs: string[] = []; let fb: string | null = null, ig: string | null = null;
      const f = await post(`${G}/${env("FB_PAGE_ID")}/photos`, { url: j.poster_url, caption, access_token: env("FB_PAGE_TOKEN") });
      if (f.ok) fb = f.j.post_id ?? f.j.id; else errs.push("FB: " + (f.j.error?.message ?? "erro"));
      if (env("IG_USER_ID")) {
        const m = await post(`${G}/${env("IG_USER_ID")}/media`, { image_url: j.poster_url, caption, access_token: env("FB_PAGE_TOKEN") });
        if (m.ok) {
          const p = await post(`${G}/${env("IG_USER_ID")}/media_publish`, { creation_id: m.j.id, access_token: env("FB_PAGE_TOKEN") });
          if (p.ok) ig = p.j.id; else errs.push("IG: " + (p.j.error?.message ?? "erro"));
        } else errs.push("IG: " + (m.j.error?.message ?? "erro"));
      }
      // Se um canal falhar, não repete para evitar posts duplicados; o erro fica registado.
      await db.from("bbs_jobs").update({ social_posted_at: new Date().toISOString(), fb_post_id: fb, ig_post_id: ig, social_error: errs.join(" | ") || null }).eq("id", j.id);
      out.social.push({ id: j.id, fb, ig, errs });
    }
  }

  // 2) Alertas WhatsApp (modelo aprovado pela Meta, só subscritores com consentimento)
  if (env("WA_TOKEN") && env("WA_PHONE_ID")) {
    const { data: jobs } = await db.from("bbs_jobs").select("*").eq("status", "published").gte("deadline", today()).is("alerted_at", null).limit(3);
    const { data: subs } = await db.from("bbs_subscribers").select("*").eq("active", true).eq("consent", true);
    for (const j of jobs ?? []) {
      const to = (subs ?? []).filter((s) => (!s.prov || s.prov === j.prov) && (!s.cat || s.cat === j.cat)).slice(0, 200);
      let sent = 0;
      for (const s of to) {
        const r = await post(`${G}/${env("WA_PHONE_ID")}/messages`, {
          messaging_product: "whatsapp", to: s.whatsapp.replace("+", ""), type: "template",
          template: { name: env("WA_TEMPLATE") ?? "nova_vaga", language: { code: env("WA_LANG") ?? "pt_PT" },
            components: [{ type: "body", parameters: [{ type: "text", text: j.title }, { type: "text", text: `${j.org} (${j.prov})` }, { type: "text", text: `${SITE}/?vaga=${j.id}` }] }] } }, env("WA_TOKEN"));
        if (r.ok) sent++;
      }
      await db.from("bbs_jobs").update({ alerted_at: new Date().toISOString() }).eq("id", j.id);
      out.alerts.push({ id: j.id, recipients: to.length, sent });
    }
  }
  return Response.json(out);
});
