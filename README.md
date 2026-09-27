# Personalised Comms API

A small NestJS REST API, plus a Next.js frontend in `frontend/`, that generates personalised, channel-agnostic customer messages (for email, SMS or landing pages) from user data in `data.json`.

## Requirements

- **Node.js 18.18 or later** for both the backend and the frontend (check with `node -v`). Both have been installed, tested and built on Node 18.20.
- **Yarn 1 (classic)**. Both `package.json` files set `"packageManager": "yarn@1.22.22"`, so with [Corepack](https://nodejs.org/api/corepack.html) enabled (`corepack enable`) the right Yarn version is used automatically. Without Corepack, use `npx yarn@1.22.22` in place of `yarn`.
- **No `.env` file needed.** This project runs entirely locally: user data is read from `data.json` and there are no external services, secrets or environment variables to configure.

## Running the server

```bash
yarn install
yarn start
```

The server listens on `http://localhost:3000`.

For watch mode during development:

```bash
yarn start:dev
```

## Endpoint

### `GET /comms/your-next-delivery/:userId`

```bash
curl http://localhost:3000/comms/your-next-delivery/ff535484-6880-4653-b06e-89983ecf4ed5
```

```json
{
  "title": "Your next delivery for Dorian and Ocie",
  "message": "Hey Kayleigh! In two days' time, we'll be charging you for your next order for Dorian and Ocie's fresh food.",
  "totalPrice": 134,
  "freeGift": true
}
```

- Only cats with an active subscription are included in the names and the price.
- Cat names are joined grammatically: `A`, `A and B`, `A, B and C`.
- `totalPrice` is the sum of each active cat's pouch size price (A to F).
- `freeGift` is `true` when `totalPrice` is over £120.
- Errors return `404` with a machine-readable `code`, so clients can tell the cases apart:

| Case | `code` |
| --- | --- |
| Unknown user ID | `USER_NOT_FOUND` |
| User exists but none of their cats have an active subscription | `NO_ACTIVE_SUBSCRIPTIONS` |

```json
{
  "statusCode": 404,
  "error": "Not Found",
  "code": "NO_ACTIVE_SUBSCRIPTIONS",
  "message": "User <id> has no active subscriptions"
}
```

## Tests and checks

```bash
yarn test       # unit tests (service logic, name formatting)
yarn test:e2e   # HTTP tests through the real Nest app, using supertest
yarn lint
yarn build
```

## Frontend

A Next.js app in `frontend/` with one page, `/welcome/:userId`, that shows the next-delivery message, styled to the Figma design and responsive from iPhone SE (320px) up to iPad Pro and desktop.

**Requirements:** Node.js 18.18 or later and Yarn 1. It uses Next.js 15, Tailwind CSS 3.4 and Vitest 3, the latest versions that still support Node 18, which the brief requires.

Start the backend first, then in a second terminal:

```bash
cd frontend
yarn install
yarn dev
```

Open http://localhost:3001/welcome/ff535484-6880-4653-b06e-89983ecf4ed5

```bash
yarn test
yarn lint
yarn build
```

```text
frontend/src/
  app/
    welcome/[userId]/page.tsx                    fetches and renders the message
    welcome/[userId]/error.tsx                   error boundary
    api/comms/your-next-delivery/[userId]/route.ts  proxies to the backend
    components/Welcome/NextDeliveryCard.tsx      delivery card (mobile and desktop layouts)
    components/Shared/Button.tsx                 primary / secondary button
    components/Shared/FreeGiftBadge.tsx          reusable badge, rotation set by an `angle` prop
    components/Shared/PageShell.tsx              page layout wrapper with safe-area padding
    components/Shared/StatusMessage.tsx          loading message wrapper
    components/Shared/ErrorState.tsx             error page (title, message, optional action)
    globals.css                                  Tailwind directives and base styles
  config/backend.config.ts                       backend URL
  lib/swr-helper.ts                              fetcher whose errors carry the HTTP status and error code
  lib/helpers.ts                                 GBP price formatting
  types/                                         copy of the backend src/types
frontend/tailwind.config.ts                      design tokens (colours, font, letter spacing)
frontend/tests/                                  Vitest specs
```

**Why a Next.js API route in front of the backend.** The browser only talks to the Next.js server on the same origin, which forwards to the Nest API. That avoids CORS configuration and keeps the backend URL out of client code.

**SWR for data fetching.** The page uses [SWR](https://swr.vercel.app) to call the API route. It gives loading, error and data states from a single hook, so the component doesn't need its own `useEffect` and `useState` fetch logic. It also caches responses by URL and removes duplicate requests, so revisiting the page or rendering it twice doesn't send extra requests to the backend. It's small, from the same team as Next.js, and the same pattern I use in other Next.js projects. The fetcher in `lib/swr-helper.ts` throws an error carrying the HTTP status and the backend's error `code`, which lets the page show the right error page for each case.

**Styling with Tailwind CSS.** The colours, font and letter spacing from the Figma file are design tokens in `tailwind.config.ts`. That generates utilities like `text-brand`, `bg-gift` and `tracking-design`, so components use the design's names instead of repeated hex values. Inter is loaded through `next/font`, so it's served with the app and the text doesn't jump when the font loads. Repeated patterns are components (`Button`, `FreeGiftBadge`, `PageShell`, `StatusMessage`, `ErrorState`) rather than shared class strings. I used Tailwind 3.4 rather than 4 because Tailwind 4 needs Node 20. Images go through `next/image`, so each device downloads a suitably sized file, and the mobile layout never downloads the large desktop image.

**Responsive layout.** Styles are mobile-first, with one breakpoint at Tailwind's `md` (768px):

- **Below 768px** (iPhone SE at 320px up to Pro Max at 430px): a centred card with a 53px round cat avatar half above it, and the free gift badge over the bottom edge.
- **768px and up** (iPad, iPad Pro, desktop): the side-by-side card at the design's 752×244px, centred on the page, with the badge on the top-right corner.

**One badge component, two placements.** The design tilts the free gift badge differently on mobile (bottom centre, 5.4°) and desktop (top right, -8°). `FreeGiftBadge` takes the angle as a prop. The card renders it once per layout inside a positioned wrapper that shows or hides it at each breakpoint, so the badge's own styles never clash with the layout's.

**Where I changed the design, and why.**

- **Button height on touch screens.** The design's buttons are 31px tall. On touch devices (`pointer: coarse`) they grow to 44px, Apple's minimum tap target, so they're easy to hit with a thumb. Mouse and trackpad users get the design's 31px.
- **Keyboard focus rings.** Buttons show a green outline when focused with the keyboard (`focus-visible`), which the static design doesn't show.
- **Hover states.** The primary button darkens and the secondary button gets a faint green tint on hover.
- **Reduced motion.** Button colour transitions turn off when the user has asked for less motion.
- **Safe areas.** Page padding is at least 16px, and grows to clear the notch and home bar on notched iPhones.
- **Cropped image.** The supplied cat image had a dark rounded border baked into its edges, which showed inside the card. `public/cat.jpg` is a cropped, compressed JPEG of it (265KB instead of 1.5MB).
- **Loading and error pages.** The design only shows the loaded card. I added a loading message and error pages for each case: "Customer not found" for unknown IDs, "No upcoming delivery" when no cats have an active subscription, and a retry screen for unexpected errors. All are announced to screen readers.

**Formatting on the frontend.** The API returns `totalPrice` as a number and the UI formats it as `£134.00`, so every channel can present price its own way.

## Project structure

```text
src/
  comms/
    comms.controller.ts   route handler
    comms.service.ts      builds the message payload
    comms.module.ts
    helpers.ts            pouch prices, price calculation, name formatting, error helper
    comms.service.spec.ts
  users/
    users.service.ts      loads data.json and looks users up by ID
    users.module.ts
  types/
    user.types.ts         User, Cat, PouchSize
    comms.types.ts        NextDeliveryComms, CommsErrorCode, CommsErrorResponse
    index.ts              re-exports all types
test/
  comms.e2e-spec.ts       HTTP tests for the endpoint
  fixtures/users.ts       made-up users shared by unit and HTTP tests
  jest-e2e.json
```

## Why I built it this way

**Separate `users` and `comms` modules.** Reading user data and generating messages are different jobs. `UsersService` is the only thing that knows the data comes from a JSON file, so swapping it for a real database later would not touch the comms code. New message types (like the welcome message) can be added to `comms` and reuse the same lookup.

**Load `data.json` once into a `Map`.** The file is read at startup and indexed by ID, so each request is a constant-time lookup rather than a file read and array search. The brief asks for no database, so this is the simplest thing that behaves like one.

**Strict types for pouch sizes.** `PouchSize` is the union `'A' | 'B' | 'C' | 'D' | 'E' | 'F'`, and the price table is a `Record<PouchSize, number>`. The compiler therefore rejects a missing or misspelled size, and the price lookup can never be `undefined`.

**Types in their own folder.** Types used by both modules live in `src/types` behind a single `index.ts`. The plan is to extract this folder into a git submodule so the frontend can share the same response types instead of redefining them.

**Business rules in pure functions.** Price calculation and name formatting live in `helpers.ts` as plain functions with no framework dependencies, which keeps them easy to read and to test. They sit inside `comms` because nothing else uses them yet. If another module needs them, they can move to a shared folder.

**Tests use fixtures, not `data.json`.** Both the unit tests and the HTTP tests replace `UsersService` with made-up users from `test/fixtures/users.ts`, so changes to the dataset can't break them. The unit tests cover active-only filtering, the free gift threshold, both error codes and every name-formatting branch. The HTTP tests boot the real Nest app and check the status codes and JSON bodies for success and both errors.

**`404` with an error code.** Unknown users and users with no active cats both get Nest's standard `404` shape plus a `code` field. The status stays conventional, and the frontend (or an email or SMS sender) can still tell "no such customer" from "no delivery to announce" without parsing the message text. Before this, a user with no active cats got a broken message, `"Your next delivery for "`.

**Nothing extra.** No auth, database, containerisation or config layer, as the brief asks.

## Known limitations and next steps

- **Buttons are placeholders.** Per the design notes, "See details" would open a modal and "Edit delivery" would link to another page. Neither is built, so the buttons do nothing yet.
- **Duplicated types.** `src/types` is copied into `frontend/src/types` and must be kept in sync by hand until it becomes a shared git submodule.
- **Data validation.** `data.json` is cast to `User[]` without runtime checks. A schema library such as zod would catch bad data at startup.
- **Price format.** JSON can't keep trailing zeros, so the API returns `134` and the frontend displays `£134.00`. For real money I'd store prices in pence as integers.
