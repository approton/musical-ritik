# Update the artist website

## Main content

- `src/config/artist.js`: artist bio, performance formats and booking FAQs.
- `src/config/socials.js`: Instagram and booking email. Unconfigured platforms remain hidden.
- `src/config/media.js`: gallery photos, verified reel links, artist recordings and live dates.
- `src/config/soundtrack.js`: licensed background playlist and credits.
- `src/config/integrations.js`: FormSubmit recipient, authorized booking endpoint and optional public shows feed.

Changes to these files require a rebuild and deployment. Keep credentials out of these public modules.

## Add a reel

Copy the real Instagram reel URL. Add a thumbnail image under `public/gallery/`, then add an entry to `reels` with `id`, `title`, `category`, `date`, `url`, and `thumbnail`. Put the five preferred entries first; the gallery displays those five. The thumbnails link to Instagram and do not download/play reel videos on the website.

Current thumbnails were downloaded from the publicly visible profile on 9 November 2026 and retain their exact source links. Their editorial titles describe the visible scenes. Public view counts were not available, so the app does not label them “most viewed”.

Automatic most-viewed ordering needs an artist-authorized Instagram data/API connection that supplies reliable metrics, server-side credential storage, caching and a scheduled refresh. The public profile/login wall is not an authenticated data API. A maintained feed can be added later; scraping search results is not a reliable substitute.

## Add a photo

Put the image in `public/gallery/` and add an item to `galleryPhotos` with its real dimensions, alt text and title. Use `presentation: "cutout"` for transparent portraits; the card will contain the complete image. Keep original photos as separate assets rather than replacing them with generated variants.

## Add an artist recording

Add a licensed audio file under `public/audio/` and an entry to `tracks` with `id`, `title`, `category`, and `src`. Supported categories are Live highlights, Studio covers, and Acoustic sessions. Background instrumentals are credited to their actual performers and are not presented as Ritik recordings.

## Update live shows manually

Add public events to `shows` in `src/config/media.js` with `id`, `title`, `startsAt` (ISO timestamp with an explicit timezone offset), `city`, `venue`, and optionally an HTTPS `ticketUrl`. Upcoming/past grouping and calendar downloads work from these records. Never list a private booking or publish a client’s details without their authorization.

## Update live shows without redeploying

Create a **separate public shows-only Google Sheet**, with columns:

`id,title,startsAt,venue,city,published,ticketUrl`

Use timestamps such as `2026-12-15T19:00:00+05:30`. Use `true` in `published` only for approved public announcements. Publish that sheet to the web as CSV and put its published CSV URL into `showsFeedUrl` in `src/config/integrations.js`. After the initial deployment, the app refreshes this feed every sixty seconds while the live page is open. Changes normally appear on the next refresh, subject to Google publishing/cache delays.

The parser handles quoted CSV cells and ignores unpublished/invalid records. It accepts HTTPS ticket links only. A feed failure leaves the last known list visible with a warning. Keep the booking Sheet private and separate.

## Theme, sound and accessibility

Dark/light selection is stored in the visitor’s browser. The mobile menu exposes all routes with large targets. Sound starts on an explicit user gesture; browsers can block unprompted audio, especially on phones. The navbar and player use the same controller. Closing the player mutes playback and sets the navbar to off.

The playground contains synthesized instruments; the background playlist contains real licensed MP3 recordings. Keep those purposes distinct. Do not add hover noises to every navigation/input action. Form button feedback is a brief note only when the visitor has already enabled sound.

## Quality checks

Run `npm run format`, then `npm run check`. All supported source, config and documentation files must be Prettier formatted, and ESLint must pass with zero warnings. Check desktop and an actual mobile browser after changing navigation or audio. Browser viewport emulation in this session did not change the IAB layout width reliably, so a physical-phone check remains useful.

## India state and city selection

The booking form loads states and dependent cities from the public [CountriesNow API](https://countriesnow.space/swagger-docs/). A bundled list of 36 current states/union territories remains available if the state request fails. Historical Dadra and Nagar Haveli / Daman and Diu API records are merged, and both API areas are queried for city choices. Accented duplicate city spellings are removed. Cities can always be entered manually, including small towns omitted by the community dataset. Only country and selected state are sent to this geography API, never the visitor’s booking details.

## iPhone testing on the local network

Use `npm run build`, then `npm start` for the production preview at `http://192.168.31.21:3001` on the same Wi-Fi network. The static server uses correct JavaScript/MP3 MIME types, no stale preview caching and byte-range responses for iPhone audio. Native audio controls can be expanded in the player. If developing instead, the named LAN host is explicitly allowed by Next.js; do not widen the origin allowlist to arbitrary hosts. A phone opening localhost connects to the phone itself, not this computer.
