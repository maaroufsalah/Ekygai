using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;

namespace Ekygai.Infrastructure.Contexts
{
    public class EkygaiContextFactory : IDesignTimeDbContextFactory<EkygaiContext>
    {
        public EkygaiContext CreateDbContext(string[] args)
        {
            // ✅ Set correct API project path manually
            var basePath = Path.Combine(Directory.GetCurrentDirectory(), "../../API/Ekygai.API");

            if (!Directory.Exists(basePath))
            {
                throw new Exception($"⚠️ ERROR: API Project path not found: {basePath}");
            }

            var configuration = new ConfigurationBuilder()
                .SetBasePath(basePath)  // ✅ Make sure this points to API folder
                .AddJsonFile("appsettings.json", optional: false)
                .AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development"}.json", optional: true)
                .Build();

            var optionsBuilder = new DbContextOptionsBuilder<EkygaiContext>();
            optionsBuilder.UseNpgsql(configuration.GetConnectionString("DefaultConnection"));

            return new EkygaiContext(optionsBuilder.Options);
        }
    }
}
