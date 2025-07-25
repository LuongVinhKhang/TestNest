# Usage

> Run all commands from the `/be` folder.

## Install
pnpm install

## Add new packages
pnpm --filter cart-service add http-errors
pnpm --filter cart-service add -D @types/http-errors

# Start all services in development mode (with nodemon)
pnpm dev

# For Prisma
pnpm --filter auth-service prisma migrate reset 
pnpm --filter auth-service prisma migrate dev --name init
pnpm --filter auth-service prisma generate

pnpm --filter cart-service prisma migrate reset 
pnpm --filter cart-service prisma migrate dev --name init
pnpm --filter cart-service prisma generate

# To start the cart service directly (without nodemon)
pnpm --filter cart-service start

pnpm --filter shared-middleware

---

Generate secret ket:
openssl rand -base64 32