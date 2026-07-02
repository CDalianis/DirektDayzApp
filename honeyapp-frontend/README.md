# DirectDayzapp Frontend

React + Vite web app and Capacitor Android shell for DirectDayzapp.

## Stack

- React 19, TypeScript, Vite  
- TanStack Query, React Router, React Hook Form  
- i18next (English / Greek)  
- Capacitor 7 (Android)  

## Run locally

```bash
cp .env.example .env
npm install
npm run dev
```

App: http://localhost:5173 (expects API at `VITE_API_URL`, default `http://localhost:8080/api/v1`).

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Vite dev server |
| `npm run build` | Production web build → `dist/` |
| `npm run build:mobile` | Build + `cap sync android` |
| `npm run build:apk` | Build + Gradle `assembleDebug` (Windows) |
| `npm run cap:open` | Open project in Android Studio |

## Production / APK

```bash
cp .env.production.example .env.production
# Edit VITE_API_URL to your live API
npm run build:apk
```

APK output: `android/app/build/outputs/apk/debug/app-debug.apk`

Requires `android/local.properties` — see `android/local.properties.example`.

## Notable paths

| Path | Purpose |
|------|---------|
| `src/components/GreeceMap.tsx` | Interactive Greece map |
| `src/data/greeceRegions.ts` | 13 periphery definitions |
| `src/data/greeceMapPaths.json` | SVG paths (Simplemaps) |
| `src/i18n/locales/` | `en.json`, `el.json` |
| `capacitor.config.ts` | App id `com.directdayzapp.mobile` |

See root [DEPLOY.md](../DEPLOY.md) for Render and USB install instructions.
