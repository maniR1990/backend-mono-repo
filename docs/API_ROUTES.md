# API Routes

This document lists all available routes per service, expected parameters, example responses, and cURL examples. Local ports reflect `docker/docker-compose.dev.yml` (user-auth on 4000, product on 4001).

## User Auth Service

- Base URL: `http://localhost:4000`

### Endpoints

| Method | Path         | Auth | Description               |
| ------ | ------------ | ---- | ------------------------- |
| GET    | `/health`    | No   | Service healthcheck       |
| POST   | `/v1/signup` | No   | Create a new user account |
| POST   | `/v1/login`  | No   | Log in and get JWT token  |
| GET    | `/v1/me`     | Yes  | Get current user (JWT)    |

### `POST /v1/signup`

- Body

| Field                       | Type   | Required | Notes                 |
| --------------------------- | ------ | -------- | --------------------- |
| `email`                     | string | Yes      | Must be a valid email |
| `password`                  | string | Yes      | Minimum length 8      |
| `profile.fullName`          | string | No       | 1..100 chars          |
| `profile.bio`               | string | No       | Up to 1000 chars      |
| `profile.preferredLanguage` | string | No       | 2..16 chars           |
| `profile.profilePictureUrl` | string | No       | Optional URL          |

- Success Response (201)

```json
{
  "id": "c7e5a93c-1a2b-4cfe-9c76-19d7c0a0f77b",
  "email": "user@example.com",
  "isActive": true,
  "createdAt": "2024-08-31T12:00:00.000Z",
  "updatedAt": "2024-08-31T12:00:00.000Z",
  "profile": {
    "userId": "c7e5a93c-1a2b-4cfe-9c76-19d7c0a0f77b",
    "fullName": "Jane User",
    "bio": null,
    "preferredLanguage": null,
    "updatedAt": "2024-08-31T12:00:00.000Z"
  }
}
```

- cURL

```bash
curl -X POST http://localhost:4000/v1/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"user@example.com",
    "password":"hunter2hunter2",
    "profile": { "fullName": "Jane User" }
  }'
```

### `POST /v1/login`

- Body

| Field      | Type   | Required | Notes            |
| ---------- | ------ | -------- | ---------------- |
| `email`    | string | Yes      | Valid email      |
| `password` | string | Yes      | Minimum length 8 |

- Success Response (201)

```json
{
  "token": "<JWT>",
  "user": {
    "id": "c7e5a93c-1a2b-4cfe-9c76-19d7c0a0f77b",
    "email": "user@example.com",
    "isActive": true,
    "createdAt": "2024-08-31T12:00:00.000Z",
    "updatedAt": "2024-08-31T12:00:00.000Z",
    "profile": {
      "userId": "c7e5a93c-1a2b-4cfe-9c76-19d7c0a0f77b",
      "fullName": "Jane User",
      "bio": null,
      "preferredLanguage": null,
      "updatedAt": "2024-08-31T12:00:00.000Z"
    }
  }
}
```

- cURL

```bash
curl -X POST http://localhost:4000/v1/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"hunter2hunter2"}'
```

### `GET /v1/me`

- Auth: `Authorization: Bearer <JWT>`

- Success Response (200)

```json
"testing jwt... "
```

- cURL

```bash
curl http://localhost:4000/v1/me \
  -H "Authorization: Bearer <JWT>"
```

### Notes on Errors (User Auth)

- Current global error handler responds with `{ status: "error", message: "Internal Server Error" }` and does not map domain error codes.
- DAO may throw `EMAIL_TAKEN`; service may throw `INVALID_CREDENTIALS` or `NO REGISTERED USER`. These are not yet mapped to HTTP statuses in the handler.
- Controllers catch and `console.log` errors without replying; prefer rethrowing or returning structured errors. See repo notes for recommendations.

---

## Product Service

- Base URL: `http://localhost:4001`

### Endpoints

| Method | Path                     | Auth | Description                   |
| ------ | ------------------------ | ---- | ----------------------------- |
| GET    | `/health`                | No   | Service healthcheck           |
| GET    | `/v1/products`           | No   | List active products (paged)  |
| GET    | `/v1/cart`               | Yes  | Get current user cart         |
| POST   | `/v1/cart/items`         | Yes  | Add item to cart              |
| PATCH  | `/v1/cart/items/:itemId` | Yes  | Set item quantity (0 removes) |
| DELETE | `/v1/cart/items/:itemId` | Yes  | Remove an item from cart      |

### `GET /v1/products`

- Query Params

| Field      | Type   | Required | Notes      |
| ---------- | ------ | -------- | ---------- |
| `page`     | number | No       | Default 1  |
| `pageSize` | number | No       | Default 20 |

- Success Response (200)

```json
{
  "items": [{ "id": "p1", "name": "T-Shirt", "imageUrl": null, "price": 19.99, "stock": 42 }],
  "total": 1,
  "page": 1,
  "pageSize": 20
}
```

- cURL

```bash
curl "http://localhost:4001/v1/products?page=1&pageSize=20"
```

### `GET /v1/cart`

- Auth: `Authorization: Bearer <JWT>`

- Success Response (200)

```json
{
  "cartId": "c1",
  "items": [
    {
      "id": "i1",
      "cartId": "c1",
      "productId": "p1",
      "quantity": 2,
      "unitPrice": 19.99,
      "product": { "id": "p1", "name": "T-Shirt", "imageUrl": null, "price": 19.99, "stock": 40 }
    }
  ],
  "totals": { "total": 39.98, "currency": "USD" }
}
```

- cURL

```bash
curl http://localhost:4001/v1/cart \
  -H "Authorization: Bearer <JWT>"
```

### `POST /v1/cart/items`

- Auth: `Authorization: Bearer <JWT>`

- Body

| Field       | Type   | Required | Notes              |
| ----------- | ------ | -------- | ------------------ |
| `productId` | string | Yes      |                    |
| `quantity`  | number | No       | Integer, minimum 1 |

- Success Response (201)

```json
{
  "item": { "id": "i1", "cartId": "c1", "productId": "p1", "quantity": 2, "unitPrice": 19.99 },
  "cart": {
    "id": "c1",
    "items": [
      {
        "id": "i1",
        "cartId": "c1",
        "productId": "p1",
        "quantity": 2,
        "unitPrice": 19.99,
        "product": { "id": "p1", "name": "T-Shirt", "imageUrl": null, "price": 19.99, "stock": 40 }
      }
    ],
    "totals": { "total": 39.98, "currency": "USD" }
  }
}
```

- cURL

```bash
curl -X POST http://localhost:4001/v1/cart/items \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{"productId":"p1","quantity":2}'
```

### `PATCH /v1/cart/items/:itemId`

- Auth: `Authorization: Bearer <JWT>`

- Path Params

| Field    | Type   | Required |
| -------- | ------ | -------- |
| `itemId` | string | Yes      |

- Body

| Field      | Type   | Required | Notes              |
| ---------- | ------ | -------- | ------------------ |
| `quantity` | number | Yes      | Integer, minimum 0 |

- Success Response (200)

```json
{
  "cart": {
    "id": "c1",
    "items": [
      /* ... */
    ],
    "totals": { "total": 39.98, "currency": "USD" }
  }
}
```

- cURL

```bash
curl -X PATCH http://localhost:4001/v1/cart/items/i1 \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{"quantity":1}'
```

### `DELETE /v1/cart/items/:itemId`

- Auth: `Authorization: Bearer <JWT>`

- Path Params

| Field    | Type   | Required |
| -------- | ------ | -------- |
| `itemId` | string | Yes      |

- Success Response (200)

```json
{ "cart": { "id": "c1", "items": [], "totals": { "total": 0, "currency": "USD" } } }
```

- cURL

```bash
curl -X DELETE http://localhost:4001/v1/cart/items/i1 \
  -H "Authorization: Bearer <JWT>"
```

### Error Mapping (Product)

- The product service maps error messages to HTTP statuses in a global handler:
  - `PRODUCT_NOT_FOUND` → 404
  - `OUT_OF_STOCK` → 400
  - `ITEM_NOT_FOUND` → 404
  - `FORBIDDEN` → 403
