FROM node:lts-alpine


RUN corepack enable && corepack prepare pnpm@latest --activate

RUN addgroup mikiyas && adduser -S mikiyas -G mikiyas

WORKDIR /app

RUN mkdir -p /app/dist && \
chown -R mikiyas:mikiyas /app

USER mikiyas

RUN pnpm config set registry https://registry.npmmirror.com

COPY --chown=mikiyas:mikiyas package.json pnpm-lock.yaml* ./
RUN pnpm install

COPY --chown=mikiyas:mikiyas . .

EXPOSE 5000


CMD ["pnpm", "dev"]
