import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

/** Link preview for WhatsApp, LinkedIn, X etc. Rendered once at build time. */
export const alt = `${site.name}: ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "radial-gradient(circle at 85% 20%, rgba(61,224,255,0.22), transparent 45%), radial-gradient(circle at 10% 90%, rgba(200,255,61,0.18), transparent 45%), #050608",
          color: "#f4f6fb",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="72" height="72" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="9" fill="#c8ff3d" />
            <path d="M8 12V8h4M20 8h4v4M24 20v4h-4M12 24H8v-4" fill="none" stroke="#050608" strokeWidth="2" strokeLinecap="round" />
            <circle cx="16" cy="11.5" r="2.2" fill="#050608" />
            <path d="M12 15.5l4 2 4-2M16 17.5v4l-2.5 3M16 21.5l2.5 3" fill="none" stroke="#050608" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 700 }}>
            FitCoach<span style={{ color: "#c8ff3d", marginLeft: 10 }}>AI</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.02, letterSpacing: -3 }}>A new standard in</div>
          <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.02, letterSpacing: -3, color: "#c8ff3d" }}>
            fitness is coming.
          </div>
          <div style={{ marginTop: 28, fontSize: 32, color: "#9aa3b5" }}>
            AI body measurement from your phone camera.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30 }}>
          <div style={{ display: "flex", background: "#c8ff3d", color: "#050608", padding: "14px 28px", borderRadius: 999, fontWeight: 700 }}>
            Take the {site.surveyMinutes}-min survey
          </div>
          <div style={{ color: "#9aa3b5" }}>Help shape it from day one</div>
        </div>
      </div>
    ),
    size,
  );
}
