using Domain.Entities.Subscription;
using Ekygai.Infrastructure.Contexts;
using Ekygai.Infrastructure.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Ekygai.Infrastructure.Data
{
    public static class SeedData
    {
        public static async Task Initialize(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var scopedServices = scope.ServiceProvider;

            // Seed Identity roles and users
            await SeedRolesAndUsers(scopedServices);

            // Seed plans with a transaction and French descriptions
            await SeedPlans(scopedServices);
        }

        private static async Task SeedRolesAndUsers(IServiceProvider services)
        {
            var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();

            // Define the roles you want to add
            string[] roles = { "Athlete", "Team", "Coach", "Admin" };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }

            // Seed default users
            await AddUserAsync(userManager, "salah", "Salah Eddine", "Maarouf", "salah@example.com", "Male", "test123", "Admin", new DateTime(1993, 7, 1));
            await AddUserAsync(userManager, "redoine", "Redoine", "Elbakkouch", "redoine@example.com", "Male", "test123", "Admin", new DateTime(1978, 10, 20));

        }

        private static async Task AddUserAsync(
            UserManager<ApplicationUser> userManager,
            string username,
            string firstName,
            string lastName,
            string email,
            string gender,
            string password,
            string userRole,
            DateTime dateOfBirth)
        {
            var user = await userManager.FindByNameAsync(username);
            if (user == null)
            {
                user = new ApplicationUser
                {
                    UserName = username,
                    FirstName = firstName,
                    LastName = lastName,
                    Email = email,
                    Gender = gender,
                    EmailConfirmed = true,
                    DateOfBirth = DateTime.SpecifyKind(dateOfBirth, DateTimeKind.Utc)
                };

                var result = await userManager.CreateAsync(user, password);
                if (!result.Succeeded)
                {
                    throw new Exception($"Error creating user {username}: {string.Join(", ", result.Errors.Select(e => e.Description))}");
                }

                await userManager.AddToRoleAsync(user, userRole);
            }
        }

        private static async Task SeedPlans(IServiceProvider services)
        {
            var context = services.GetRequiredService<EkygaiContext>();

            // Check if any plans exist before seeding
            if (!await context.Plans.AnyAsync())
            {
                // Start a transaction for plan seeding
                using var transaction = await context.Database.BeginTransactionAsync();
                try
                {
                    // Create three plans with French descriptions
                    var plan1 = new Plan
                    {
                        Name = "Athlete",
                        Price = 50,
                        Description = "Plan Athlete avec les fonctionnalités essentielles"
                    };

                    var plan2 = new Plan
                    {
                        Name = "Coach",
                        Price = 150,
                        Description = "Plan Coach avec des fonctionnalités supplémentaires"
                    };

                    var plan3 = new Plan
                    {
                        Name = "Team",
                        Price = 200,
                        Description = "Plan Team avec toutes les fonctionnalités"
                    };

                    context.Plans.AddRange(plan1, plan2, plan3);
                    await context.SaveChangesAsync();

                    // Commit the transaction
                    await transaction.CommitAsync();
                }
                catch (Exception)
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            }
        }
    }
}
