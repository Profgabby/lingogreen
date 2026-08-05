"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { browserClient } from "@/app/lib/supabase-browser";

// ---- Bilingual copy (English + French) ----
const T = {
  en: {
    tagline: "Grow a language, garden by garden.",
    sub: "Learn French and more through six living gardens.",
    login: "Log in", register: "Create account",
    name: "Full name", email: "Email", password: "Password",
    toRegister: "New here? Create an account",
    toLogin: "Already have an account? Log in",
    created: "Account created — you can now log in.",
    lang: "FR",
  },
  fr: {
    tagline: "Cultive une langue, jardin par jardin.",
    sub: "Apprends le français et plus, à travers six jardins vivants.",
    login: "Se connecter", register: "Créer un compte",
    name: "Nom complet", email: "Email", password: "Mot de passe",
    toRegister: "Pas de compte ? S'inscrire",
    toLogin: "Déjà un compte ? Se connecter",
    created: "Compte créé — tu peux te connecter.",
    lang: "EN",
  },
};

const C = {
  paper: "#F2EBDA", paper2: "#E8DFC8",
  forest: "#0B3D26", forest2: "#072D1C",
  leaf: "#3E6B27", gold: "#C8912E",
  ink: "#20301F", line: "#DAD0B8",
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
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: `radial-gradient(1200px 600px at 50% -10%, ${C.paper2}, ${C.paper})`,
      fontFamily: "'Inter', system-ui, sans-serif", padding: 20,
    }}>
      <div style={{
        width: "100%", maxWidth: 420, background: "#FFFDF8",
        border: `1px solid ${C.line}`, borderRadius: 22,
        boxShadow: "0 18px 50px rgba(11,61,38,0.12)", overflow: "hidden",
      }}>
        {/* Header band */}
        <div style={{ background: C.forest, padding: "26px 30px 22px", position: "relative" }}>
          <button onClick={() => setLang(lang === "en" ? "fr" : "en")}
            style={{
              position: "absolute", top: 18, right: 18, cursor: "pointer",
              background: "rgba(255,255,255,0.12)", color: "#fff",
              border: "1px solid rgba(255,255,255,0.25)", borderRadius: 999,
              padding: "5px 12px", fontSize: 12, fontWeight: 700, letterSpacing: ".05em",
            }}>
            {t.lang}
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div aria-hidden style={{
              width: 30, height: 30, borderRadius: 9, background: C.gold,
              display: "grid", placeItems: "center", color: C.forest2, fontWeight: 800,
              fontFamily: "'Fraunces', serif", fontSize: 18,
            }}>L</div>
            <div style={{
              fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 700, lineHeight: 1,
            }}>
              <span style={{ color: "#F4EAD2" }}>Lingo</span>
              <span style={{ color: C.gold }}>Green</span>
            </div>
          </div>
          <div style={{ color: "#CFE0CE", fontSize: 13.5, marginTop: 12, maxWidth: 320 }}>
            {t.tagline}
          </div>
          <div style={{ color: "rgba(226,238,225,0.7)", fontSize: 12, marginTop: 3 }}>
            {t.sub}
          </div>
        </div>

        {/* Form body */}
        <div style={{ padding: "24px 30px 30px" }}>
          {/* tabs */}
          <div style={{ display: "flex", background: C.paper, borderRadius: 12, padding: 4, marginBottom: 18 }}>
            {(["login", "register"] as const).map((m) => (
              <button key={m} onClick={() => { setMode(m); setMsg(""); }}
                style={{
                  flex: 1, padding: "9px 0", border: "none", cursor: "pointer",
                  borderRadius: 9, fontSize: 13.5, fontWeight: 700,
                  background: mode === m ? "#FFFDF8" : "transparent",
                  color: mode === m ? C.forest : "#6B6350",
                  boxShadow: mode === m ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                }}>
                {m === "login" ? t.login : t.register}
              </button>
            ))}
          </div>

          {mode === "register" && (
            <Field label={t.name} value={fullName} onChange={setFullName} />
          )}
          <Field label={t.email} value={email} onChange={setEmail} type="email" />
          <Field label={t.password} value={password} onChange={setPassword} type="password" />

          <button onClick={submit} disabled={busy}
            style={{
              width: "100%", marginTop: 6, padding: 14, cursor: busy ? "default" : "pointer",
              background: busy ? "#3B5E44" : C.forest, color: "#fff", border: "none",
              borderRadius: 13, fontSize: 15, fontWeight: 700, letterSpacing: ".01em",
              transition: "background .15s",
            }}>
            {busy ? "…" : (mode === "login" ? t.login : t.register)}
          </button>

          <p onClick={() => { setMode(mode === "login" ? "register" : "login"); setMsg(""); }}
            style={{ marginTop: 14, textAlign: "center", fontSize: 13, color: C.leaf, cursor: "pointer", fontWeight: 600 }}>
            {mode === "login" ? t.toRegister : t.toLogin}
          </p>

          {msg && (
            <p style={{
              marginTop: 12, textAlign: "center", fontSize: 13,
              color: msg.includes("créé") || msg.includes("created") ? C.leaf : "#A23B1F",
            }}>{msg}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <label style={{ display: "block", marginBottom: 12 }}>
      <span style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6B6350", marginBottom: 5 }}>
        {label}
      </span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%", padding: "12px 14px", fontSize: 14.5,
          border: `1px solid ${C.line}`, borderRadius: 11, outline: "none",
          background: "#FFFEFB", color: "#20301F", boxSizing: "border-box",
        }} />
    </label>
  );
}
