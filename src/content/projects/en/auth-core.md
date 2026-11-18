---
name: "Auth Core"
year: "2026"
type: "personal"
kind: "backend"
role: "Author"
summary: "Shared authentication core for my own suite of SaaS products: multi-tenant users, organizations, permissions and subscriptions. In development."
skills: ["Go", "PostgreSQL", "Redis / Valkey", "gRPC", "Chi", "Docker"]
featured: true
order: 1
---
**Problem.** Every SaaS product needs the same things: sign-up, login, organizations, roles and subscriptions. Building them again in each product is slow and risky; Auth Core builds them once and every product shares them.

**Approach.** A modular monolith in Go with two binaries, REST for browsers and apps and gRPC for internal services, and dependencies in one direction: infrastructure → application → domain. PostgreSQL with sqlc and SQL migrations; Valkey for sessions, rate limiting and a shared permission cache that only Auth Core writes, with a short TTL as the worst-case bound. 10-minute JWTs with a rotating refresh token and reuse detection, and Argon2id password hashing limited by a semaphore to bound memory and CPU. Every decision is recorded as an ADR.

**Status.** Registration, activation and code resend already work over REST, with integration tests against real containers (testcontainers). The design target is 1,000 requests per second on a 2 vCPU, 4 GB VPS, with p95 under 200 ms for REST and under 50 ms for gRPC. Private repository.
