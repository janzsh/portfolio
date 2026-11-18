---
name: "Auth Core"
year: "2026"
type: "personal"
kind: "backend"
role: "Autor"
summary: "Núcleo de autenticación compartido para una suite de productos SaaS propia: usuarios multitenant, organizaciones, permisos y suscripciones. En desarrollo."
skills: ["Go", "PostgreSQL", "Redis / Valkey", "gRPC", "Chi", "Docker"]
featured: true
order: 1
---
**Problema.** Todo producto SaaS necesita lo mismo: registro, inicio de sesión, organizaciones, roles y suscripciones. Construirlo en cada producto es lento y arriesgado; Auth Core lo construye una vez y lo comparten todos.

**Enfoque.** Monolito modular en Go con dos binarios, REST para navegadores y apps y gRPC para los servicios internos, y dependencias en una sola dirección: infraestructura → aplicación → dominio. PostgreSQL con sqlc y migraciones en SQL; Valkey para sesiones, límites de peticiones y una caché de permisos compartida que solo Auth Core escribe, con un TTL corto como límite en el peor caso. JWT de 10 minutos con refresh token rotativo y detección de reutilización, y contraseñas con Argon2id limitado por un semáforo para acotar memoria y CPU. Cada decisión queda registrada como ADR.

**Estado.** Ya funcionan el registro, la activación y el reenvío de códigos por REST, con pruebas de integración sobre contenedores reales (testcontainers). El objetivo de diseño es sostener 1.000 peticiones por segundo en un VPS de 2 vCPU y 4 GB, con p95 por debajo de 200 ms en REST y de 50 ms en gRPC. Repositorio privado.
