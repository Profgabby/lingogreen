"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { browserClient } from "@/app/lib/supabase-browser";

// ---- Bilingual copy (English + French) ----
const T = {
  en: {
    brandLine: "Learn Languages Through Life.",
    heroTitle1: "Learn a language.",
    heroTitle2: "Explore the world.",
    heroTitle3: "Grow through real life.",
    heroSub:
      "LingoGreen connects language learning with gardens, food, water, climate, culture, technology and everyday life — turning every lesson into something learners can see, say, understand and do.",
    chips: ["🌱 Learn", "✨ AI Coach", "🧪 Projects", "👥 Community", "📚 Library", "🏆 Certificates"],
    ecosystem: "One account. A whole learning ecosystem.",
    ctaStart: "Start Learning Free →",
    joinNote: "Join learners, teachers, families and schools growing language skills through life.",
    welcome: "Welcome back",
    welcomeSub: "Continue your learning journey.",
    login: "Log in", register: "Create account",
    name: "Full name", email: "Email address", password: "Password",
    forgot: "Forgot password?",
    toRegister: "New to LingoGreen? Create your free account",
    toLogin: "Already have an account? Log in",
    created: "Account created — you can now log in.",
  },
  fr: {
    brandLine: "Apprends les langues par la vie.",
    heroTitle1: "Apprends une langue.",
    heroTitle2: "Explore le monde.",
    heroTitle3: "Grandis par la vie réelle.",
    heroSub:
      "LingoGreen relie l'apprentissage des langues aux jardins, à l'alimentation, à l'eau, au climat, à la culture, à la technologie et à la vie quotidienne — pour que chaque leçon se voie, se dise, se comprenne et se vive.",
    chips: ["🌱 Apprendre", "✨ Coach IA", "🧪 Projets", "👥 Communauté", "📚 Bibliothèque", "🏆 Certificats"],
    ecosystem: "Un seul compte. Tout un écosystème d'apprentissage.",
    ctaStart: "Commencer gratuitement →",
    joinNote: "Rejoins les élèves, enseignants, familles et écoles qui apprennent les langues par la vie.",
    welcome: "Bon retour",
    welcomeSub: "Continue ton parcours d'apprentissage.",
    login: "Se connecter", register: "Créer un compte",
    name: "Nom complet", email: "Email", password: "Mot de passe",
    forgot: "Mot de passe oublié ?",
    toRegister: "Nouveau sur LingoGreen ? Crée ton compte gratuit",
    toLogin: "Déjà un compte ? Se connecter",
    created: "Compte créé — tu peux te connecter.",
  },
};

// LIFEWS visual identity
const C = {
  forest: "#006B3C", forest2: "#064E32",
  gold: "#FDB515",
  cream: "#F7F1E3", offwhite: "#FFFDF8",
  ink: "#26311F", line: "#E4DAC4",
};

export default function LoginPage() {
  const router = useRouter();
  const supabase = browserClient();
  const [lang, setLang] = useState<"en" | "fr">("en");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const t = T[lang];

  async function submit() {
    setMsg(""); setBusy(true);
    try {
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email, password, options: { data: { full_name: fullName } },
        });
        if (error) { setMsg(error.message); return; }
        setMsg(t.created); setMode("login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) { setMsg(error.message); return; }
        router.push("/");
      }
    } finally { setBusy(false); }
  }

  return (
    <div className="lg-root" style={{
      minHeight: "100vh", display: "flex",
      fontFamily: "'Inter', system-ui, sans-serif", background: C.offwhite,
    }}>
      {/* ============ LEFT — HERO ============ */}
      <div className="lg-hero" style={{
        flex: "0 0 60%", position: "relative", overflow: "hidden",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        padding: "44px 54px",
        backgroundImage: `linear-gradient(180deg, rgba(6,78,50,0.62) 0%, rgba(6,78,50,0.50) 40%, rgba(4,45,28,0.86) 100%), url('/lingo-hero.jpg')`,
        backgroundSize: "cover", backgroundPosition: "center", color: "#fff",
      }}>
        {/* brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ display: "inline-flex", width: 52, height: 52, borderRadius: "50%", background: C.offwhite, alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/lifews-logo.png" alt="LIFEWS" width={40} height={40} style={{ objectFit: "contain" }} />
          </span>
          <div>
            <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 27, lineHeight: 1, letterSpacing: ".01em" }}>
              <span style={{ color: "#F4EAD2" }}>LINGO</span><span style={{ color: C.gold }}>GREEN</span>
            </div>
            <div style={{ fontSize: 13, color: "rgba(244,234,210,0.85)", marginTop: 4 }}>{t.brandLine}</div>
          </div>
        </div>

        {/* headline + sub + chips */}
        <div style={{ maxWidth: 620 }}>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: "clamp(30px,3.6vw,50px)", lineHeight: 1.06, margin: "0 0 18px" }}>
            <span style={{ display: "block" }}>{t.heroTitle1}</span>
            <span style={{ display: "block" }}>{t.heroTitle2}</span>
            <span style={{ display: "block", color: C.gold }}>{t.heroTitle3}</span>
          </h1>
          <p style={{ fontSize: 15.5, lineHeight: 1.65, color: "rgba(255,255,255,0.9)", margin: "0 0 24px", maxWidth: 540 }}>
            {t.heroSub}
          </p>

          {/* feature chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
            {t.chips.map((chip) => (
              <span key={chip} style={{
                fontSize: 13.5, fontWeight: 600, color: "#fff",
                background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)",
                borderRadius: 999, padding: "8px 15px", backdropFilter: "blur(4px)", whiteSpace: "nowrap",
              }}>{chip}</span>
            ))}
          </div>

          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 19, marginBottom: 18, color: "#F4EAD2" }}>
            {t.ecosystem}
          </div>

          <button onClick={() => setMode("register")} style={{
            border: "none", borderRadius: 14, padding: "14px 28px", cursor: "pointer",
            background: C.gold, color: C.forest2, fontFamily: "'Inter', sans-serif",
            fontSize: 16, fontWeight: 700, boxShadow: "0 10px 26px -10px rgba(253,181,21,0.6)",
          }}>{t.ctaStart}</button>
        </div>

        {/* join note */}
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.72)", maxWidth: 440, lineHeight: 1.5 }}>
          {t.joinNote}
        </div>
      </div>

      {/* ============ RIGHT — AUTH ============ */}
      <div className="lg-auth" style={{
        flex: "1 1 40%", background: C.cream,
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "40px clamp(28px,4vw,60px)", position: "relative",
      }}>
        {/* language selector */}
        <div style={{ position: "absolute", top: 24, right: "clamp(28px,4vw,60px)", display: "inline-flex", background: C.offwhite, border: `1px solid ${C.line}`, borderRadius: 999, overflow: "hidden" }}>
          {(["en", "fr"] as const).map((L) => (
            <button key={L} onClick={() => setLang(L)} style={{
              border: "none", cursor: "pointer", padding: "6px 14px", fontSize: 12.5, fontWeight: 700, letterSpacing: ".04em",
              background: lang === L ? C.forest : "transparent",
              color: lang === L ? "#fff" : "#8A7B63",
            }}>{L.toUpperCase()}</button>
          ))}
        </div>

        <div style={{ width: "100%", maxWidth: 400, margin: "0 auto" }}>
          {/* logo (mobile hero shows here too) */}
          <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 22 }}>
            <span style={{ display: "inline-flex", width: 40, height: 40, borderRadius: "50%", background: C.forest, alignItems: "center", justifyContent: "center" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/lifews-logo.png" alt="LIFEWS" width={28} height={28} style={{ objectFit: "contain" }} />
            </span>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700, lineHeight: 1 }}>
              <span style={{ color: C.forest }}>Lingo</span><span style={{ color: C.gold }}>Green</span>
            </div>
          </div>

          <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 30, color: C.ink, margin: "0 0 6px" }}>
            {mode === "login" ? t.welcome : t.register}
          </h2>
          <p style={{ fontSize: 14.5, color: "#7A6E58", margin: "0 0 24px" }}>{t.welcomeSub}</p>

          {/* tabs */}
          <div style={{ display: "flex", background: C.offwhite, border: `1px solid ${C.line}`, borderRadius: 13, padding: 4, marginBottom: 22 }}>
            {(["login", "register"] as const).map((m) => (
              <button key={m} onClick={() => { setMode(m); setMsg(""); }} style={{
                flex: 1, padding: "10px 0", border: "none", cursor: "pointer", borderRadius: 10, fontSize: 14, fontWeight: 700,
                background: mode === m ? C.forest : "transparent",
                color: mode === m ? "#fff" : "#8A7B63", transition: "background .15s",
              }}>{m === "login" ? t.login : t.register}</button>
            ))}
          </div>

          {mode === "register" && <Field label={t.name} value={fullName} onChange={setFullName} />}
          <Field label={t.email} value={email} onChange={setEmail} type="email" />
          <Field label={t.password} value={password} onChange={setPassword} type="password" />

          {mode === "login" && (
            <div style={{ textAlign: "right", marginTop: -4, marginBottom: 14 }}>
              <span style={{ fontSize: 13, color: C.forest, fontWeight: 600, cursor: "pointer" }}>{t.forgot}</span>
            </div>
          )}

          <button onClick={submit} disabled={busy} style={{
            width: "100%", marginTop: 4, padding: 15, cursor: busy ? "default" : "pointer",
            background: busy ? "#3B5E44" : C.forest, color: "#fff", border: "none",
            borderRadius: 13, fontSize: 15.5, fontWeight: 700, transition: "background .15s",
          }}>{busy ? "…" : (mode === "login" ? t.login : t.register)}</button>

          <p onClick={() => { setMode(mode === "login" ? "register" : "login"); setMsg(""); }}
            style={{ marginTop: 18, textAlign: "center", fontSize: 13.5, color: C.forest, cursor: "pointer", fontWeight: 600 }}>
            {mode === "login" ? t.toRegister : t.toLogin}
          </p>

          {msg && (
            <p style={{ marginTop: 12, textAlign: "center", fontSize: 13,
              color: msg.includes("créé") || msg.includes("created") ? C.forest : "#A23B1F" }}>{msg}</p>
          )}
        </div>
      </div>

      {/* responsive: stack on tablet/mobile */}
      <style>{`
        @media (max-width: 900px) {
          .lg-root { flex-direction: column !important; }
          .lg-hero {
            flex: none !important;
            width: 100%;
            min-height: 320px;
            padding: 28px 26px !important;
          }
          .lg-hero h1 { font-size: 30px !important; }
          .lg-hero p { display: none; }
          .lg-auth { flex: none !important; width: 100%; padding-top: 36px !important; padding-bottom: 44px !important; }
        }
        @media (max-width: 600px) {
          .lg-hero { min-height: 260px; padding: 22px 20px !important; }
          .lg-hero h1 { font-size: 26px !important; }
        }
      `}</style>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <label style={{ display: "block", marginBottom: 14 }}>
      <span style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#7A6E58", marginBottom: 6 }}>{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} style={{
        width: "100%", padding: "13px 15px", fontSize: 14.5,
        border: "1px solid #E4DAC4", borderRadius: 12, outline: "none",
        background: "#FFFEFB", color: "#26311F", boxSizing: "border-box",
      }} />
    </label>
  );
}
