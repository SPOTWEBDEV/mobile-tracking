# WatchPoint — consensual location sharing (MVP)

A Life360-style circle app: everyone in a circle sees everyone else, and
every member controls their own visibility.

## How consent is enforced (read this before extending the app)

This isn't a policy sitting on top of the code — it's structural:

1. **Invites don't share anything.** `CircleMember.status` starts as
   `"invited"`. No location is visible to anyone until the invitee calls
   `acceptInvite()` themselves.
2. **Pings are always self-reported.** `recordMyPing()` (`lib/actions/location.ts`)
   takes the user ID from the server session, never from client input — there
   is no way to submit a location on someone else's behalf.
3. **A master switch, checked at read time.** `User.sharingEnabled` is
   rechecked on every call to `getVisibleCircleMemberLocations()`. Turning it
   off makes a member invisible everywhere, instantly — nothing is cached.
4. **Leaving is always self-serve.** `leaveCircle()` throws unless the
   membership row belongs to the caller. There's no admin/owner override that
   removes someone else's visibility *for* them, and no owner override that
   keeps a member in a circle after they've left.

If you extend this app, keep those four properties intact.

## Navigation & tracking model

The dashboard has a bottom tab bar with four tabs:

- **Dashboard** (`/dashboard`) — overview: pending invites, your circles,
  and tracking links you've created.
- **Track** (`/dashboard/track`) — the live map for Circle Tracking (below).
- **History** (`/dashboard/history`) — breadcrumb log per circle member.
- **Settings** (`/dashboard/settings`) — account (change password), the
  master sharing switch, your circle memberships, and who's tracking you via
  a link.

There are two tracking models, and they have different guarantees on purpose:

### A. Circle Tracking (mutual)

Every active member of a circle can see every other active member. Nobody
is added without accepting an invite, and anyone can leave on their own —
see the consent section above. Good for meetups, events, or a friendly
competition where the whole group agreed to share position with each other.

### B. Link Tracking (one-directional, still consent-gated)

A user creates a link (`createTrackingLink`, shown on the Dashboard) and
shares it. Whoever opens it goes through `app/t/[linkId]` and
`components/TrackingLinkFlow.tsx`, which enforces, in this order:

1. **Disclosure before anything is requested.** The page states plainly,
   before any location prompt appears, who is asking and exactly what will
   happen if they continue — including that this is one-directional.
2. **A real account, not a covert install.** If the visitor's email isn't
   already registered, they set a name and password right there — the same
   `createUserAccount()` used by normal registration. There's no
   passwordless or accountless path.
3. **Browser-level consent.** `acceptTrackingLink()` only ever runs after
   the browser's own geolocation prompt has been granted — the same
   mechanism circle sharing uses, not a background permission.
4. **Visibility of being watched.** `getGrantsWhereIAmTarget()` powers a
   "People tracking you" list on the target's own Settings page, by name.
   This is not optional or hidden.
5. **Self-serve revocation, both directions.** `revokeTrackingGrant()` lets
   either the watcher stop watching or the target stop being watched, on
   their own row only. The target can also flip their master sharing switch
   off, which (per the consent section above) removes them from every
   circle *and* every tracking-link grant at once.

The asymmetry is real and intentional: the watcher can see the target, and
the target never sees the watcher back. That's what makes it different from
Circle Tracking, and it's why every step above exists — the missing
reciprocity has to be offset by disclosure, a real account, and revocation
the target actually controls, or this degrades into the covert tracking
pattern this app is deliberately built to avoid.

## Data layer: Prisma + MySQL

The app talks to MySQL exclusively through Prisma (Mongoose has been
removed, and the schema was later switched from MongoDB to MySQL). The
schema lives in `prisma/schema.prisma`; the singleton client is
`lib/prisma.ts`, imported as `import { prisma } from "@/lib/prisma"` anywhere
a query is needed. IDs are `String @default(cuid())` rather than Mongo
ObjectIds, but the app code already treated every ID as an opaque string, so
nothing outside the schema had to change.

```bash
npm install               # also runs `prisma generate` via postinstall
cp .env.example .env.local  # fill in DATABASE_URL, NextAuth secret, Maps key
npm run db:push            # sync the Prisma schema to your MySQL database
npm run dev
```

Other useful commands:
- `npm run db:studio` — opens Prisma Studio, a GUI for browsing the data.
- After editing `prisma/schema.prisma`, run `npx prisma generate` to
  regenerate the client, and `npm run db:push` to sync the schema. For a
  real production deployment, prefer versioned migrations over `db push`:
  `npx prisma migrate dev --name init` the first time, then
  `npx prisma migrate deploy` in CI/CD.

One thing Mongoose's TTL index was doing that MySQL needs handled
differently: `LocationPing` no longer auto-expires old rows after 30 days.
Recreate that with either a periodic job (a cron hitting a small cleanup
route that runs `prisma.locationPing.deleteMany({ where: { timestamp: { lt: cutoff } } })`)
or, if your MySQL host supports it, a native
`CREATE EVENT` on a schedule that deletes rows older than 30 days.

You said you already have `next.config.js` set up, so it isn't included here.
Everything else (package.json, Tailwind/PostCSS config, Prisma schema, app
routes, components) is in this project as-is.

### Database connection check

- `GET /api/health` returns `{ status: "ok" | "degraded", database, timestamp }`
  and a `503` if MySQL isn't reachable — point uptime monitoring at it.
- The dashboard layout checks the connection on every load and renders a
  plain "can't reach the database" screen instead of crashing if it's down.
- Login and registration do the same check before touching the `User`
  table, so a DB outage shows a readable message instead of a stack trace.

### Environment variables

- `DATABASE_URL` — a MySQL connection string, e.g.
  `mysql://user:password@host:3306/watchpoint`.
- `NEXTAUTH_SECRET` — any long random string (`openssl rand -base64 32`).
- `NEXTAUTH_URL` — your app's base URL.
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` — a Google Maps JavaScript API key with
  the Maps JavaScript API enabled.

## What's in the MVP

- Email/password auth (NextAuth Credentials provider, bcrypt hashing).
- Circles: create, invite by email, accept/decline, leave.
- Live map with member markers, breadcrumb trail, and geofence circles
  (`Place` model — wire up a UI for creating places next).
- A per-user master sharing switch, plus a per-membership leave action.
- Link Tracking: create/revoke links, an onboarding + disclosure + consent
  flow for whoever opens one (`app/t/[linkId]`), a watcher-side location
  view, and a target-side "people tracking you" list with per-grant revoke.
- Account settings: change password, plus everything above.
- Browser geolocation reporting (`components/LocationReporter.tsx`) that
  posts to `/api/location/ping` on an interval.

## Not in the MVP (by design, per your brief)

No billing, plans, or payment gateways — this is pure functionality.

## Suggested next steps

- A UI for creating/editing `Place` geofences and arrival/departure push
  notifications.
- Rate-limiting `/api/location/ping` per user.
- Email delivery for invites (currently invites just create a DB row —
  wire up Resend/SendGrid and a `/invites/[id]` accept link for
  not-yet-registered invitees).
- Recreate the periodic ping-cleanup job described above before relying on
  this in production — MySQL has no equivalent of Mongo's TTL index.
