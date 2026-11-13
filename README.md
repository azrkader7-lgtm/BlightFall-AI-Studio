# BlightFall AI Studio — Starter 0.1.0

Arabic-first starter dashboard for a cloud AI game-development studio.

## What works in this starter

- Responsive dashboard UI for mobile and desktop.
- Prompt box connected to a Cloudflare Pages Function.
- Gemini API key stays on the server (`GEMINI_API_KEY`), not in browser code.
- Gemini returns planning/help text only.

## What is NOT connected yet

This starter does **not** yet launch Godot, run MCP, generate 3D models, provide a live game viewport, or export APK/EXE. Those require separate persistent compute/GPU services and secure job orchestration. Cloudflare Pages/Workers alone cannot host TRELLIS.2 GPU inference or a full Godot editor session.

## Deploy with GitHub + Cloudflare Pages

1. Create a GitHub repository named `BlightFall-AI-Studio`.
2. Upload the contents of this folder to the repository root.
3. In Cloudflare Dashboard, open **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
4. Select the repository.
5. Set:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Build output directory: `dist`
6. Deploy.
7. In the Pages project, open **Settings** → **Variables and Secrets** and add:
   - `GEMINI_API_KEY` = your Google AI Studio API key (mark it as a secret if the dashboard offers that option)
   - `GEMINI_MODEL` = `gemini-2.5-flash` (optional; use a model enabled for your API key)
8. Redeploy after adding variables if needed.

Official docs:
- Cloudflare React/Pages: https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/
- Pages Function bindings: https://developers.cloudflare.com/pages/functions/bindings/
- Gemini generateContent API: https://ai.google.dev/api/generate-content

## Local development

Requires Node.js 20+.

```bash
npm install
cp .dev.vars.example .dev.vars
# Put your key in .dev.vars; never commit this file.
npm run dev
```

For production-grade use, add authentication, per-user rate limits, usage monitoring, request quotas, and durable project/job storage before exposing the API endpoint publicly.
