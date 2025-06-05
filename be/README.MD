# Usage

> Run all commands from the `/be` folder.

pnpm install



pnpm --filter cart-service add  http-errors

pnpm --filter cart-service add -D @types/http-errors

# Start all services in development mode (with nodemon)
pnpm dev

# For Prisma (run in /be)
pnpm --filter cart-service prisma migrate reset 
pnpm --filter cart-service prisma migrate dev --name init
pnpm --filter cart-service prisma generate

# To start the cart service directly (without nodemon)
pnpm --filter cart-service start

---

## Auth0 Integration

- Sign up at [Auth0](https://auth0.com/).
- Create a new Application (Regular Web Application).
- Note your **Domain**, **Client ID**, and **Client Secret**.
- Install the Auth0 Express SDK in your cart service:
  ```sh
  pnpm --filter cart-service add express-oauth2-jwt-bearer
  ```
- Follow the [Auth0 Express API Quickstart](https://auth0.com/docs/quickstart/backend/nodejs/01-authorization) to secure your endpoints.

---

## Auth0 Application Type Selection

- **Flutter Web:**  
  - In Auth0, create a new **Single-Page App** (SPA).
- **Flutter Mobile (Android/iOS):**  
  - In Auth0, create a new **Native/Mobile App**.
- **Express API:**  
  - In Auth0, go to the "APIs" section and create a new **API** (not an Application).
  - Use the API Identifier in your backend and when requesting tokens from your Flutter apps.

---

## Fullstack Workflow: Flutter (Web & Mobile) + BE (API) + Auth0

### 1. Auth0 Setup
- Create an Auth0 tenant and applications for your Flutter app (web & mobile) and your API.
- For Flutter, use the [Auth0 Flutter SDK](https://auth0.com/docs/quickstart/native/flutter).
- For your API, use `express-oauth2-jwt-bearer` as described above.

### 2. Flutter App Integration
- Use the Auth0 Flutter SDK to authenticate users and obtain JWT access tokens.
- [Flutter Auth0 Quickstart](https://auth0.com/docs/quickstart/native/flutter)
- After login, your Flutter app will receive an access token.

### 3. API Integration
- In your Flutter app, include the access token in the `Authorization` header for API requests:
  ```
  Authorization: Bearer YOUR_ACCESS_TOKEN
  ```
- Your Express API will validate this token using the Auth0 middleware.

### 4. Testing
- You can test authentication and API integration from both web and mobile builds of your Flutter app.
- Use the same Auth0 tenant for both frontend and backend for seamless integration.

---

## How to Test Auth0-Protected API with Postman

1. **Get a Test Access Token from Auth0:**
   - Go to your Auth0 dashboard.
   - Navigate to your API > "Test" tab.
   - Click "Copy Token" to get a valid JWT access token.

2. **Use Postman to Call Your API:**
   - Open Postman and create a new request to your API endpoint (e.g., `http://localhost:3001/api/cart/`).
   - In the "Authorization" tab, select "Bearer Token" and paste your JWT access token.
   - Send the request.

3. **Your Express API will validate the token using Auth0 middleware.**
   - If the token is valid, you’ll get a response from your API.
   - If the token is missing or invalid, you’ll get a 401 Unauthorized error.

---

**You do NOT need a UI or Flutter app to test your Auth0-protected API.**  
Just use Postman (or curl) with a valid Auth0 access token in the `Authorization` header.

---

## Auth0 User Identity in Cart Service

- After Auth0 JWT validation, the user ID (`sub` claim) is extracted and attached to `req.userId` in all cart service routes.
- Use `req.userId` in your controllers/services to access the authenticated user's cart.
- No need for a separate endpoint to fetch user ID; it's available from the JWT in every request.

---

**References:**
- [Auth0 Flutter SDK Docs](https://pub.dev/packages/auth0_flutter)
- [Auth0 Express API Quickstart](https://auth0.com/docs/quickstart/backend/nodejs/01-authorization)