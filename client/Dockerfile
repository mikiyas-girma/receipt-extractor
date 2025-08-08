FROM node:lts-alpine


# Setup: enable pnpm and add non-root user
RUN addgroup mike && adduser -S mike -G mike
RUN corepack enable && corepack prepare pnpm@latest --activate


# Set working directory
WORKDIR /app

RUN chown -R mike:mike /app


USER mike
RUN pnpm config set registry https://registry.npmmirror.com

# Copy 
COPY --chown=mike:mike package.json pnpm-lock.yaml* ./
RUN pnpm install

# Copy rest of the app
COPY --chown=mike:mike . .

EXPOSE 3000
CMD ["pnpm", "dev"]
