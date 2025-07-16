# TestNest

How to:

Husky
pnpm add -D husky lint-staged     
pnpm exec husky init

Git:
git switch -c feature/navbar
git add .
git commit -m "Add responsive navbar"
git push -u origin feature/navbar

git commit --amend --no-edit



Install libs:
pnpm --filter cart-service add @prisma/client
pnpm --filter cart-service add -D prisma
pnpm --filter cart-service add express-validator
pnpm --filter cart-service add -D @types/express-validator
or
/cart
pnpm add express-validator
pnpm add -D @types/express-validator

Start
/cart
pnpm prisma init
npx prisma generate


// database
pnpm --filter cart-service exec prisma generate