# remotr-backend

Central Remotr backend server

## Running

Running this software requires [Docker](https://docker.io) to be installed on the host system. For development, [Node.js and NPM](https://nodejs.org) must also be installed.

For production:

```bash
# Configure
cp .env.example .env
nano .env
# (Edit configuration)

# Generate database initialisation script
npm run db:init

# To start:
docker compose -f docker-compose.production.yml up -d
# To stop:
docker compose -f docker-compose.production.yml stop
# To tear down:
docker compose -f docker-compose.production.yml down
```

For development:

```bash
# Install dependencies
npm i
# Configure
cp .env.example .env
nano .env
# (Edit configuration)

# Generate database initialisation script
npm run watch

# (In different terminal since watch occupies the current session)

# To start:
docker compose -f docker-compose.development.yml up -d
# To stop:
docker compose -f docker-compose.development.yml stop
# To tear down:
docker compose -f docker-compose.development.yml down
```
