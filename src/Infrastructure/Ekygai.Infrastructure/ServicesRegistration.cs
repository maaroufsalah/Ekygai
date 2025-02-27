using Ekygai.Application.Interfaces.IRepositories;
using Ekygai.Application.Interfaces.IServices.Identity;
using Ekygai.Infrastructure.Configurations;
using Ekygai.Infrastructure.Contexts;
using Ekygai.Infrastructure.Data;
using Ekygai.Infrastructure.Entities;
using Ekygai.Infrastructure.Repositories;
using Ekygai.Infrastructure.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Ekygai.Infrastructure
{
    public static class ServicesRegistration
    {
        public static void AddInfrastructureLayer(this IServiceCollection services, IConfiguration configuration)
        {

            // Retrieve LoggerFactory from DI container
            using var serviceProvider = services.BuildServiceProvider();
            var loggerFactory = serviceProvider.GetRequiredService<ILoggerFactory>();
            var logger = loggerFactory.CreateLogger("InfrastructureSetup");

            // Log the connection string for debugging
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            Console.WriteLine($"Connection String: {connectionString}");
            logger.LogInformation($"Connection String: {connectionString}");

            if (string.IsNullOrEmpty(connectionString))
            {
                logger.LogCritical($"The ConnectionString property has not been initialized.");

                throw new InvalidOperationException("The ConnectionString property has not been initialized.");
            }

            // ✅ Configure Serilog Logging
            services.AddSerilogLogging(configuration);

            // ✅ Configure Entity Framework Core
            services.AddDbContext<EkygaiContext>(options =>
                options.UseNpgsql(
                    configuration.GetConnectionString("DefaultConnection"),
                    b => b.MigrationsAssembly(typeof(EkygaiContext).Assembly.FullName)));

            services.AddIdentity<ApplicationUser, IdentityRole>(options =>
                {
                    // Password options
                    options.Password.RequireDigit = false;
                    options.Password.RequireLowercase = false;
                    options.Password.RequireUppercase = false;
                    options.Password.RequireNonAlphanumeric = false;
                    options.Password.RequiredLength = 6;
                })
                .AddEntityFrameworkStores<EkygaiContext>()
                .AddDefaultTokenProviders();

            #region Repositories
            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            services.AddScoped(typeof(IAthleteRepository), typeof(AthleteRepository));
            services.AddScoped(typeof(ISubscriptionRepository), typeof(SubscriptionRepository));
            services.AddScoped(typeof(IPlanRepository), typeof(PlanRepository));
            services.AddScoped<IAccountService, AccountService>();
            services.AddScoped<IAuthenticatedUserService, AuthenticatedUserService>();
            services.AddScoped<TokenService>();
            #endregion
        }



        // Extension method to handle database migration and seeding on application startup.
        public static async Task InitializeDatabaseAsync(this IApplicationBuilder app)
        {
            using var scope = app.ApplicationServices.CreateScope();
            var services = scope.ServiceProvider;
            var context = services.GetRequiredService<EkygaiContext>();
            var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
            var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

            var loggerFactory = services.GetRequiredService<ILoggerFactory>();
            var logger = loggerFactory.CreateLogger("DatabaseInitialization");


            try
            {
                await DbInitializer.InitializeAsync(context, userManager, roleManager);
            }
            catch (Exception ex)
            {
                // Log or handle the error as needed.
                Console.WriteLine($"An error occurred during seeding: {ex.Message}");
                logger.LogError(ex, "An error occurred during database seeding.");
            }
        }
    }
}
