# Front-End Demo (React + Vite)

[]!/firstCatchLight.svg

React + Vite single-page app for exploring FirstCatch services. Includes routing, a centralized API layer, and a built-in ServiceTest page to exercise endpoints.

## Tech stack

- React, React Router
- Vite (dev server, build)
- Vitest + Testing Library (unit tests)
- ESLint (linting)

## Getting started

Prerequisites: Node.js LTS and npm

1. Install

```bash
npm install
```

2. Configure environment
   Create a `.env` in the project root. You can either use direct API URLs or use the Vite dev proxy (recommended for local dev).

Direct API URLs example:

```bash
VITE_CATCH_ENDPOINT=http://localhost:8080/api/catch
VITE_FISHER_ENDPOINT=http://localhost:8080/api/fisher
VITE_SPECIES_ENDPOINT=http://localhost:8080/api/species
VITE_LANDING_ENDPOINT=http://localhost:8080/api/landing
VITE_ORDER_ENDPOINT=http://localhost:8080/api/order
VITE_ORDER_ITEM_ENDPOINT=http://localhost:8080/api/order-item
VITE_PERSON_ENDPOINT=http://localhost:8080/api/person
VITE_USER_ROLE_ENDPOINT=http://localhost:8080/api/role

# Optional flags
VITE_FORCE_PROXY=true     # default in dev; route via Vite proxy
VITE_API_DEBUG=false      # set true for verbose API logs in console
```

Dev proxy (default): If you run the Vite dev server, requests to these paths can be routed by the proxy configured in `vite.config.js` to `http://54.196.108.105:8080`. To force direct calls instead of the proxy, set `VITE_FORCE_PROXY=false` and ensure your backend allows CORS for `http://localhost:5173`.

3. Run

```bash
npm run dev
```

Open the URL shown in the terminal (typically http://localhost:5173).

## Scripts

- `npm run dev` – start Vite dev server
- `npm run build` – production build to `dist/`
- `npm run preview` – preview the built app locally
- `npm run test` – run unit tests (Vitest + jsdom)
- `npm run lint` – run ESLint
- `npm run validate` – lint + test + build

## Configuration details

- API endpoints are read from `import.meta.env.*` and used by the service files under `src/services/` via a shared helper `ApiRequest.js`.
- `ApiRequest.js` minimizes preflight requests, provides helpful errors, and supports a dev proxy.
- Set `VITE_API_DEBUG=true` to log request/response details to the console.

## Local development (proxy vs direct)

- Proxy on (default): When `npm run dev` is used and `VITE_FORCE_PROXY` is not `false`, absolute API URLs are rewritten to their path so they hit the Vite proxy (no backend CORS config needed).
- Proxy off: Set `VITE_FORCE_PROXY=false` to call your backend directly. Ensure backend CORS allows `http://localhost:5173`.

Proxy targets are defined in `vite.config.js` for paths like `/api/catch`, `/api/species`, `/api/landing`, `/api/order`, `/api/order-item`, `/api/role`, `/api/person`, `/api/fisher`.

## Project structure

- `src/App.jsx` – routes
  - `/` Home
  - `/service-test` ServiceTest (manual API testing)
  - `/new-catch` NewCatch
  - `/available-catches` and `/available-catches/:filtertype/:filterValue`
- `src/pages/*` – page components
- `src/components/*` – shared UI components (navigation bar, footer, tooltips, dropdown)
- `src/services/*` – API service modules using `ApiRequest.js`
- `src/hooks/*` – reusable hooks
- `src/App.css` – global styles (light/dark aware)

## Using the ServiceTest page

- Start the app and navigate to `/service-test`.
- Each section calls corresponding service endpoints (Catch, Fisher, Species, Landing, Order, Order Item, Person, User Role).
- Results include success payloads or detailed error messages. If env vars are missing, the page lists which `VITE_*_ENDPOINT` values are undefined.

## API services

Each service exposes functions like `getAll*`, `get*ById`, `create*`, `update*`, `delete*`. All calls go through `apiRequest(baseUrl, path, options)` which:

- Auto-joins URLs safely
- Adds JSON headers only when needed
- Parses JSON or text responses
- Throws clear errors for network/CORS issues and HTML (non-JSON) responses

## Build and deploy

Build:

```bash
npm run build
```

Outputs static files to `dist/`.

### Deploy to AWS S3 (static site hosting)

1. Create S3 bucket and enable Static website hosting

- Index document: `index.html`
- For SPA routing, set Error document: `index.html` (so deep links resolve)

2. Upload

- Upload the contents of `dist/` (not the folder itself) to the bucket.

3. Make public

- Add a bucket policy to allow public read of `arn:aws:s3:::<your-bucket>/*` if you’re serving publicly.

4. Access

- Use the Static website endpoint URL provided by S3.

Optional: Put CloudFront in front of S3 and configure default root object and SPA routing.

## Troubleshooting

- "Failed to fetch": server not running, wrong URL, CORS, firewall, or network issue.
- HTML response for API: wrong endpoint or reverse proxy misroute (server returning an HTML error page). Check base URLs and routes.
- Using proxy vs direct: toggle `VITE_FORCE_PROXY`; if direct, configure backend CORS for `http://localhost:5173`.
- Turn on `VITE_API_DEBUG=true` to see request details.
