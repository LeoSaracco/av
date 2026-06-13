FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /workspace
COPY . .

# Construir sin tests para imagen de producción (tests se ejecutan en CI)
RUN ./mvnw package -DskipTests --no-daemon

FROM eclipse-temurin:21-jre-alpine AS runtime

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY --from=builder /workspace/target/*.jar app.jar

RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD wget -qO- http://localhost:8080/api/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
