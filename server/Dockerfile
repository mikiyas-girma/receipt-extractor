FROM node:lts-alpine

# Enable corepack and prepare pnpm early to cache it
RUN corepack enable && corepack prepare pnpm@latest --activate

# Create non-root user and group
RUN addgroup mike && adduser -S mike -G mike

# Set working directory
WORKDIR /app

# Create and set permissions for dist directory
RUN mkdir -p /app/dist && \
chown -R mike:mike /app

# Switch to non-root user
USER mike

RUN pnpm config set registry https://registry.npmmirror.com

# Copy package files and install dependencies
COPY --chown=mike:mike package.json pnpm-lock.yaml* ./
RUN pnpm install

# Copy the rest of the application
COPY --chown=mike:mike . .

# Expose the port
EXPOSE 5000

# Start the dev server
CMD ["pnpm", "dev"]
