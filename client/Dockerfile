FROM node:lts-alpine


# Setup: enable pnpm and add non-root user
RUN addgroup mikiyas && adduser -S mikiyas -G mikiyas
RUN corepack enable && corepack prepare pnpm@latest --activate


# Set working directory
WORKDIR /app

RUN chown -R mikiyas:mikiyas /app


USER mikiyas
RUN pnpm config set registry https://registry.npmmirror.com

# Copy 
COPY --chown=mikiyas:mikiyas package.json pnpm-lock.yaml* ./
RUN pnpm install

# Copy rest of the app
COPY --chown=mikiyas:mikiyas . .

EXPOSE 3000
CMD ["pnpm", "dev"]
