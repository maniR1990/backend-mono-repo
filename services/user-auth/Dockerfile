FROM node:20-slim

# Set working directory to root of the monorepo
WORKDIR /app

# Copy the entire monorepo into the container
COPY . .

# Now switch into the user-auth service folder
WORKDIR /app/services/user-auth

# Enable and activate pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install all dependencies in the monorepo
RUN pnpm install --recursive

EXPOSE 4001

CMD ["pnpm", "run", "dev"]
