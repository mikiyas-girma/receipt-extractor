FROM node:lts-alpine

RUN addgroup mikiyas && adduser -S mikiyas -G mikiyas

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

RUN chown -R mikiyas:mikiyas /app

USER mikiyas

RUN pnpm config set registry https://registry.npmmirror.com

COPY --chown=mikiyas:mikiyas package.json pnpm-lock.yaml* ./

RUN pnpm install

COPY --chown=mikiyas:mikiyas . .


EXPOSE 3000
CMD ["pnpm", "dev"]
