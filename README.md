# Express + TypeScript Server for 3WayChess

## Setup

```bash
npm install
```

Run a development server:

```bash
npm run dev
```

Run a production server:

Make sure to configure the .env-docker file.

```bash
docker compose up --build
```
**NOTE:** Current version uses a local MongoDB instance, make sure to replace localhost with mongodb in the .env-docker file.

Stop a production server:

```bash
docker compose down
```
