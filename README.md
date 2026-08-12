# REST API Design

A practice project for learning REST API design — built with Node.js, Prisma, and TypeScript.

## What this is

This repo is where I'm practicing REST API design concepts:
- Resource-based URLs
- Query parameters (filtering, sorting, pagination)
- API versioning
- Basic security (input validation)

## Tech Stack

- Node.js
- TypeScript
- Prisma (database ORM)

## Getting Started

1. Clone the repo
   ```bash
   git clone https://github.com/subashsys/REST-Api-design.git
   cd REST-Api-design
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up the database
   ```bash
   npx prisma migrate dev
   ```

4. (Optional) Seed the database
   ```bash
   npx ts-node seed.ts
   ```

5. Run the project
   ```bash
   npm run dev
   ```

## Query Parameter Examples

Try these in Postman against your endpoints (adjust the base URL/resource name to match yours).

### Pagination

```
GET /products?page=1&limit=10
GET /products?page=2&limit=10
```
Returns 10 products at a time. `page=2` gets the next 10.

### Filtering

```
GET /products?category=electronics
GET /products?in_stock=true
GET /products?category=electronics&in_stock=true
```
Narrows results down using one or more field values.

### Sorting

```
GET /products?sort=price
GET /products?sort=-price
GET /products?sort=-created_at
```
`sort=price` sorts ascending (low to high). A `-` prefix (`-price`) sorts descending (high to low).

### Combined

```
GET /products?category=electronics&in_stock=true&sort=-price&page=1&limit=10
```
All three together: filtered, sorted, and paginated in one request.

## Rate Limiting

To protect the API from abuse (accidental or intentional), requests are limited to **100 requests per IP per hour**.

### Response headers

Every response includes headers so the client knows where it stands:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1723459200
```

- `X-RateLimit-Limit` — total requests allowed in the window (100)
- `X-RateLimit-Remaining` — requests left before you're blocked
- `X-RateLimit-Reset` — Unix timestamp when the count resets

### When the limit is hit

Once you cross 100 requests in the window, the API responds with:

```
HTTP/1.1 429 Too Many Requests

{
  "error": "Too many requests. Please try again later."
}
```

### Try it in Postman

Hit any endpoint (e.g. `GET /products`) repeatedly — either manually or using Postman's **Runner** to fire 100+ requests in a loop — and watch:
1. The `X-RateLimit-Remaining` header count down each time.
2. The response switch to `429 Too Many Requests` once you cross 100.

