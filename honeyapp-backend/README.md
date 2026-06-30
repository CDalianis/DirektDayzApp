# DirectDayzapp Backend

Spring Boot REST API for the DirectDayzapp honey marketplace.

## Stack

- Java 21, Spring Boot 3.3, Maven  
- PostgreSQL + Flyway  
- JWT auth, role/capability security  
- OpenAPI / Swagger UI  

## Run locally

```bash
# From repo root — start Postgres first
docker compose up -d

cd honeyapp-backend
mvn spring-boot:run
```

- API: http://localhost:8080  
- Swagger: http://localhost:8080/swagger-ui/index.html  

Default database: `jdbc:postgresql://localhost:5432/directdayzapp` (user/pass `directdayzapp`).

## Docker (Render)

```bash
docker build -t directdayzapp-api .
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host:5432/directdayzapp \
  -e SPRING_DATASOURCE_USERNAME=directdayzapp \
  -e SPRING_DATASOURCE_PASSWORD=directdayzapp \
  -e APP_SECURITY_SECRET_KEY=your-base64-secret \
  directdayzapp-api
```

Render uses the same `Dockerfile` via `render.yaml`.

## Migrations

| File | Description |
|------|-------------|
| `V1__schema.sql` | Core schema |
| `V2__seed_data.sql` | Roles, capabilities, initial regions |
| `V3__add_greek_regions.sql` | 13 Greek peripheries |

## Key env vars

| Variable | Default (local) |
|----------|-----------------|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5432/directdayzapp` |
| `ALLOWED_ORIGINS` | `http://localhost:5173,...` |
| `APP_SECURITY_SECRET_KEY` | Dev placeholder in `application.yml` |
| `PORT` | `8080` |

See root [DEPLOY.md](../DEPLOY.md) for production values.
