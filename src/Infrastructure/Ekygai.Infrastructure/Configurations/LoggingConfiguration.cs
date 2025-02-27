using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Serilog;

namespace Ekygai.Infrastructure.Configurations
{
    public static class LoggingConfiguration
    {
        public static void AddSerilogLogging(this IServiceCollection services, IConfiguration configuration)
        {
            Log.Logger = new LoggerConfiguration()
                .ReadFrom.Configuration(configuration) // Load from appsettings.json
                .Enrich.FromLogContext()
                .WriteTo.Console() // Console output
                .WriteTo.File("logs/ekygai-log-.txt", rollingInterval: RollingInterval.Day) // Log to a file
                .CreateLogger();

            services.AddLogging(loggingBuilder =>
            {
                loggingBuilder.ClearProviders(); // Remove default logging providers
                loggingBuilder.AddSerilog(); // Add Serilog
            });
        }
    }
}