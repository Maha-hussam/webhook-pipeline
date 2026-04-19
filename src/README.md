 مباشرة:

---

# Webhook-Driven Task Processing Pipeline

## Overview

This project is a backend service that processes incoming webhooks asynchronously through a job queue and delivers results to registered subscribers.

It is inspired by tools like Zapier, where an event is received via webhook, processed through a pipeline, and the result is sent to external systems.

---

## Architecture

```
Webhook → Queue → Worker → Processing Actions → Result → Delivery → Retry → Tracking → API
```

### Core Components

**API Server (Fastify)**
Handles pipeline management, webhook ingestion, and job queries.

**PostgreSQL with Prisma ORM**
Stores pipelines, jobs, subscribers, and delivery attempts.

**Queue System using Redis and BullMQ**
Handles asynchronous job processing.

**Worker Service**
Processes jobs independently from the API.

---

## Tech Stack

- Node.js + TypeScript
- Fastify
- PostgreSQL + Prisma
- Redis + BullMQ
- Docker + Docker Compose
- ESLint + Prettier

---

## Features

### Pipeline Management

- Create, update, and delete pipelines
- Each pipeline defines its own processing actions and subscribers

### Webhook Ingestion

- Each pipeline gets a unique endpoint:
  ```
  POST /webhook/:pipelineId
  ```
- Incoming webhooks are queued, not processed immediately

### Asynchronous Job Processing

- Jobs are stored and processed by background workers
- The API remains non-blocking at all times

### Processing Actions

Pipelines support three modular actions:

1. **JSON Transform** — remove or remap fields from the payload
2. **Delay** — introduce a wait before continuing
3. **HTTP Enrichment** — fetch external data and merge it into the payload

---

### Delivery System

Results are sent to all registered subscribers via HTTP POST using this format:

```json
{
  "jobId": "...",
  "pipelineId": "...",
  "result": {},
  "timestamp": "..."
}
```

---

### Retry Logic

Retries happen on network errors or 5xx responses. 4xx errors are not retried.

Retry schedule:
- 1st attempt: immediate
- 2nd attempt: after 1 second
- 3rd attempt: after 5 seconds
- 4th attempt: after 30 seconds

---

### Delivery Tracking

Every delivery attempt is recorded with its status, response body, error message if any, and attempt number.

---

### Observability API

Get a job by ID:
```
GET /jobs/:id
```

Response:
```json
{
  "id": "...",
  "status": "COMPLETED",
  "result": {},
  "delivery_attempts": 2
}
```

Get all jobs for a pipeline:
```
GET /jobs?pipeline_id=...
```

---

## Database Models

- Pipeline
- Job
- Subscriber
- DeliveryAttempt

---

## Running the Project

### 1. Clone the repository

```
git clone <repo-url>
cd webhook-pipeline
```

### 2. Set up environment variables

Create a `.env` file in the root directory:

```
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@db:5432/webhook_db
REDIS_HOST=redis
REDIS_PORT=6379
```

### 3. Start with Docker

```
docker compose up --build
```

### 4. Run database migrations

```
npx prisma migrate dev
```

### 5. Access the service

- API base URL: http://localhost:3000
- Health check: http://localhost:3000/health

---

## Example Usage

### Create a pipeline

```
POST /pipelines
```

```json
{
  "name": "Test Pipeline",
  "actions": [
    {
      "type": "transform",
      "config": {
        "remove": ["age"]
      }
    }
  ]
}
```

### Send a webhook

```
POST /webhook/:pipelineId
```

```json
{
  "name": "Ali",
  "age": 20
}
```

### Check job status

```
GET /jobs/:id
```

---

## Design Decisions

**Why asynchronous processing?**
To keep the API responsive under high load and avoid blocking on slow operations.

**Why a separate worker?**
It improves scalability and isolates failures so they don't affect the API layer.

**Why retry logic?**
External systems fail. The retry mechanism ensures delivery even when subscribers are temporarily unavailable.

**Why store delivery attempts?**
It makes the system observable and easier to debug when something goes wrong.

---

## Future Improvements

- JWT-based authentication
- Rate limiting per pipeline
- Webhook signature verification
- Admin dashboard
- Metrics and monitoring integration
- Pipeline chaining support

---

## Conclusion

This project demonstrates a practical implementation of event-driven architecture with background job processing, reliable delivery with exponential backoff retries, and a clean, scalable backend design.