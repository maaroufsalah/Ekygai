using Ekygai.Application;
using Ekygai.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add and configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policyBuilder =>
    {
        policyBuilder
            .WithOrigins(
                "http://localhost:3000",                    // Local development
                "https://ekygai-bv6cw.ondigitalocean.app"   // Your actual production domain
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

// Add Application & Infrastructure Layers
builder.Services.AddApplicationLayer();
builder.Services.AddInfrastructureLayer(builder.Configuration);

// Add Controller Services (Required for Swagger)
builder.Services.AddControllers();

// ✅ Configure Swagger (Add Title & Description)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Ekygai API",
        Version = "v1",
        Description = "API for Ekygai Application",
    });
});

var app = builder.Build();

app.UseCors("AllowFrontend");
// Initialize database
await app.InitializeDatabaseAsync();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Ekygai API V1");
        c.RoutePrefix = string.Empty; // Swagger at root URL: http://localhost:5000/
    });
}

// Middleware Configurations
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers(); // Required for API controllers

app.Run();