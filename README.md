# UseNuxt Starter

- Logging : [Logrocket](https://logrocket.com/) : https://nuxt.com/modules/logrocket
- Analytics : [Plausible](https://plausible.io/) : 
- Translation : [i18n](https://i18n.nuxtjs.org/) : https://nuxt.com/modules/i18n
- Authentication : [Lucia](https://lucia-auth.com/)
- ORM : [Drizzle](https://orm.drizzle.team/)

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install
```

Copy .env and update the values to match your environment (especially the NUXT_DATABASE_URL variable)

```bash
cp .env.example .env
```

If you don't alread have a Postgres database, spin one up quickly with docker.

```bash
docker run -p 5432:5432 --name postgres -e POSTGRES_PASSWORD=postgres -d postgres
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev
```

Changes to the database schema can be pushed directly to dev database
```bash
# npm
npm run db:push

# pnpm
pnpm run db:push

# yarn
yarn run db:push
```

To commit the schema changes for them to be applied automatically in production, generate a migration.
```bash
# npm
npm run db:gen

# pnpm
pnpm run db:gen

# yarn
yarn run db:gen

# bun
bun run run db:gen
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Run production server:

```bash
#node
node .output/server/index.mjs

# pm2
pm2 .output/server/index.mjs
```
