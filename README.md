# Influencer Analytics - Creator Registration

Next.js creator registration app with PostgreSQL and Meta/Instagram OAuth.

## Routes

- `/` - creator registration UI
- `/api/creators/register` - creator registration API
- `/api/auth/meta` - starts Meta OAuth
- `/api/auth/meta/callback` - handles Meta OAuth callback

## Required environment variables

See `.env.example`.

Do not commit real Meta secrets or database credentials.

## Production callback

`https://insta-track-three.vercel.app/api/auth/meta/callback`

## Database tables

The app expects:

- `influencers`
- `social_accounts`
- `follower_snapshots`
