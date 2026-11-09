# Ritik — The live experience

A component-based, feature-isolated Next.js artist web app for Ritik Pandey.

## Run

- `npm install`
- `npm run dev` — development preview, normally port 3000.
- `npm run check` — Prettier check, ESLint (zero warnings), tests, production export.
- `npm run build` — production static export in `out/`.

The working preview for this chat uses port 3001 with a separate development cache. Development uses `.next-dev`; production uses `.next`. Deploy the `out/` export with route fallback to the corresponding `.html` files. `next start` is not a static-file server.

## Features

- Artist home with transparent performance cutout, stage particles, scroll lift, and moving headline.
- Responsive navigation, accessible dialogs, persisted dark/light theme, reduced-motion support.
- Licensed MP3 background playlist (guitar, piano, violin), shuffle without immediate repeats, synchronized sound controls.
- Keyboard/touch sound pads, sixteen-step sequencer, playable guitar strings.
- Gallery with five curated real Instagram reel thumbnails and exact post links, plus an uncropped cutout photo/lightbox.
- Three-step booking/appointment inquiry, interactive experience cards, date picker, floating inputs, optional tab-only drafts.
- FormSubmit inquiry delivery to the configured recipient; Google Calendar adapter and approval/reminder backend prepared separately.
- Contact, live dates, press kit, downloadable bio/photo, music credits, privacy and error/loading routes.

## Activation status

FormSubmit targets `ritikpandey195@gmail.com`; the owner must activate the verification email before delivery is considered live. No test submission or activation email was sent by the agent.

Google Calendar is **not connected**. The frontend clearly labels its preferred-time fallback as unverified. Add the artist-authorized Google Apps Script URL after following [the setup guide](docs/BOOKING-SETUP.md). Only then does it fetch free/busy slots, recheck submissions, create tentative events, send approval messages and enable reminders. Google account permissions and an end-to-end live test are still required.

Instagram highlights were collected from the public profile on 9 November 2026. Public view totals were unavailable behind Instagram’s login gate. They are curated highlights, not a claimed account-wide popularity ranking. Automatic ranking requires an authorized data source/API and server-held credentials.

See [architecture](docs/ARCHITECTURE.md), [content updates](docs/CONTENT-GUIDE.md), and [asset provenance](docs/ASSET-PROVENANCE.md).

The Site identity in `.openai/hosting.json` is registered but no production deployment is verified. A previous automatic approval review blocked source/photo upload pending explicit approval. Local work remains available.
