# ===========================
# Stage 1: Build
# ===========================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy the solution file
COPY ["Ekygai.sln", "./"]

# Copy each .csproj to restore dependencies
COPY ["src/API/Ekygai.API/Ekygai.API.csproj", "src/API/Ekygai.API/"]
COPY ["src/Core/Ekygai.Application/Ekygai.Application.csproj", "src/Core/Ekygai.Application/"]
COPY ["src/Core/Ekygai.Domain/Ekygai.Domain.csproj", "src/Core/Ekygai.Domain/"]
COPY ["src/Infrastructure/Ekygai.Infrastructure/Ekygai.Infrastructure.csproj", "src/Infrastructure/Ekygai.Infrastructure/"]

# Restore packages
RUN dotnet restore "Ekygai.sln"

# Copy the rest of your source code
COPY . .

# Publish the API project
WORKDIR /app/src/API/Ekygai.API
RUN dotnet publish -c Release -o /app/publish

# ===========================
# Stage 2: Runtime
# ===========================
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Copy the published output from the build stage
COPY --from=build /app/publish .

# Expose ports (optional)
EXPOSE 80
EXPOSE 443

# Start the API
ENTRYPOINT ["dotnet", "Ekygai.API.dll"]
