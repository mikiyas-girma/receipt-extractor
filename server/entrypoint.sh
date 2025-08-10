#!/bin/sh
set -e

pnpm prisma migrate deploy

exec node dist/index.js
