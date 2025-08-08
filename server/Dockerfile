FROM node:lts-alpine

# Enable corepack and prepare pnpm early to cache it
RUN corepack enable && corepack prepare pnpm@latest --activate

# Create non-root user and group
RUN addgroup mikiyas && adduser -S mikiyas -G mikiyas

# Set working directory
WORKDIR /app

# Create and set permissions for dist directory
RUN mkdir -p /app/dist && \
chown -R mikiyas:mikiyas /app

# Switch to non-root user
USER mikiyas

RUN pnpm config set registry https://registry.npmmirror.com

# Copy package files and install dependencies
COPY --chown=mikiyas:mikiyas package.json pnpm-lock.yaml* ./
RUN pnpm install

# Copy the rest of the application
COPY --chown=mikiyas:mikiyas . .

# Expose the port
EXPOSE 5000

# Start the dev server
CMD ["pnpm", "dev"]
