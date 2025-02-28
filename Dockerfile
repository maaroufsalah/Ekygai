# =======================
# 1) Build Stage
# =======================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files
COPY ["Ekygai.sln", "."]
COPY ["src/API/Ekygai.API/Ekygai.API.csproj", "src/API/Ekygai.API/"]
COPY ["src/Core/Ekygai.Application/Ekygai.Application.csproj", "src/Core/Ekygai.Application/"]
COPY ["src/Core/Ekygai.Domain/Ekygai.Domain.csproj", "src/Core/Ekygai.Domain/"]
COPY ["src/Infrastructure/Ekygai.Infrastructure/Ekygai.Infrastructure.csproj", "src/Infrastructure/Ekygai.Infrastructure/"]

# Restore dependencies
RUN dotnet restore "Ekygai.sln"

# Copy the rest of your .NET source code
COPY . .

# Publish the .NET API
WORKDIR /src/src/API/Ekygai.API
RUN dotnet publish -c Release -o /app

# =======================
# 2) Final Stage
# =======================
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Copy the published output from the build stage
COPY --from=build /app ./

# Expose port 80 inside the container
EXPOSE 80

# Instruct .NET to listen on port 80
ENV ASPNETCORE_URLS=http://+:80

# Run the API
ENTRYPOINT ["dotnet", "Ekygai.API.dll"]
