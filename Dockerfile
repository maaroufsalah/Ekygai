# Stage 1: Build .NET API
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS dotnet-build
WORKDIR /src
COPY ["Ekygai.sln", "."]
COPY ["src/API/Ekygai.API/Ekygai.API.csproj", "src/API/Ekygai.API/"]
COPY ["src/Core/Ekygai.Application/Ekygai.Application.csproj", "src/Core/Ekygai.Application/"]
COPY ["src/Core/Ekygai.Domain/Ekygai.Domain.csproj", "src/Core/Ekygai.Domain/"]
COPY ["src/Infrastructure/Ekygai.Infrastructure/Ekygai.Infrastructure.csproj", "src/Infrastructure/Ekygai.Infrastructure/"]
RUN dotnet restore "Ekygai.sln"
COPY . .
WORKDIR /src/src/API/Ekygai.API
RUN dotnet publish -c Release -o /app/api

# Stage 2: Build Next.js App
FROM node:20-alpine AS node-build
WORKDIR /app
COPY ./frontend/web-app/package*.json ./
RUN npm ci
COPY ./frontend/web-app ./
RUN npm run build

# Stage 3: Final Image – Combine Both
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Install Node.js inside the final container (for Next.js runtime)
RUN apt-get update && apt-get install -y curl gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# Copy the published .NET API
COPY --from=dotnet-build /app/api ./api

# Copy the built Next.js app
COPY --from=node-build /app /app/frontend

# Set correct working directory for Next.js
WORKDIR /app/frontend

# Ensure dependencies are installed in the final image (production-only)
RUN npm install --omit=dev

# Expose API (80) and Next.js (3000)
EXPOSE 80
EXPOSE 3000

# Copy and fix startup script
COPY startup.sh /app/
RUN sed -i 's/\r$//' /app/startup.sh && chmod +x /app/startup.sh

CMD ["sh", "-c", "/app/startup.sh"]
