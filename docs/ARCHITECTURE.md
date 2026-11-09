# Frontend architecture

The application uses route-level feature modules composed by a shared host shell. It is a modular frontend with microfrontend-style ownership boundaries and one deployment, not a claim of independently deployed or runtime-federated applications.

## Ownership

`src/app` contains thin route components, metadata, shared layout and error/loading states.

`src/features` owns the artist, music, playground, gallery, booking, contact, events and press experiences. Each feature exposes `index.js`; components, hooks, domain helpers and feature styles stay within that feature. Cross-feature imports use the public entry points. ESLint enforces this boundary.

`src/shared` contains the shell, audio controller/provider, theme, accessible UI primitives, delivery integration and public-content adapters. Configuration and real content live in `src/config`.

## Runtime boundaries

The shared shell persists across client navigation, so audio and theme do not reset on every route. Native browser APIs are used only inside client components, effects or explicit event handlers. Static page composition remains in Server Components wherever possible.

The audio controller is independent of React. The hook adapts its state into the provider. One controller owns media playback, synthesis, analyser state, shuffle, mute, pause, close and pending-operation cancellation. It invokes playback directly within the user gesture. Touchscreen devices use native MP3 media output without requiring Web Audio; desktop can connect an analyser. Synthesized instruments use an explicitly resumed audio context. Controls use native button click activation for touch, mouse, keyboard and assistive technology, with no custom gesture suppression.

Booking validation and CSV/calendar serialization are plain domain modules tested independently of rendering. Google Apps Script modules live outside the static frontend; calendar access and email authority stay in the artist’s Google account. Client configuration contains only public endpoint URLs.

Dialogs use the native dialog element for focus containment, Escape support and focus restoration. UI controls have explicit labels, keyboard behavior and reduced-motion alternatives. No authentication or fake administrative dashboard is invented for the public site.

## Feature extraction

If separate deployments become necessary, these public feature boundaries can be moved into workspace packages or Next.js zones with explicit shared contracts. That requires a host/runtime/deployment decision and is not currently implemented. Do not call the current single deployment Module Federation.

## Verification

- Prettier covers supported project files.
- ESLint runs with zero warnings and feature import boundaries.
- Node tests cover booking dates/contact validation, approval lifecycle with mocked Google services, invitation timing, token replay, calendar conflicts, CSV parsing, calendar downloads and audio control synchronization.
- The production static export is built separately from the development cache.
- Google integration must be authorized and tested live before claiming booking availability, invitations or reminders work in production.
