using Domain.Entities.Subscription;
using Ekygai.Application.Enums;
using Ekygai.Infrastructure.Contexts;
using Ekygai.Infrastructure.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Ekygai.Infrastructure.Data
{
    public static class DbInitializer
    {
        public static async Task InitializeAsync(
            EkygaiContext context,
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager)
        {
            // Ensure the database is created and migrations are applied
            await context.Database.MigrateAsync();

            // Seed Roles if they don't exist
            if (!roleManager.Roles.Any())
            {
                string[] roles =
                {
                    RolesEnum.Admin.ToString(), 
                    // RolesEnum.User.ToString(), 
                    RolesEnum.Athlete.ToString(),
                    RolesEnum.Team.ToString(),
                    RolesEnum.Coach.ToString(),
                };

                foreach (var role in roles)
                {
                    if (!await roleManager.RoleExistsAsync(role))
                    {
                        await roleManager.CreateAsync(new IdentityRole(role));
                    }
                }
                await context.SaveChangesAsync();
            }

            // Seed Users if none exist
            await AddUserAsync(userManager, "salah", "Salah Eddine", "Maarouf", "salah@example.com", "Male", "test123", "Admin", new DateTime(1993, 7, 1));
            await AddUserAsync(userManager, "redoine", "Redoine", "Elbakkouch", "redoine@example.com", "Male", "test123", "Admin", new DateTime(1978, 10, 20));

            // Example: Seed Plans if necessary
            if (!await context.Plans.AnyAsync())
            {
                var plan1 = new Plan
                {
                    Name = UserPlan.Athlete.ToString(),
                    Price = 50,
                    Description = "Plan Athlete avec les fonctionnalités essentielles",
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                };

                var plan2 = new Plan
                {
                    Name = UserPlan.Coach.ToString(),
                    Price = 150,
                    Description = "Plan Coach avec des fonctionnalités supplémentaires",
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                };

                var plan3 = new Plan
                {
                    Name = UserPlan.Team.ToString(),
                    Price = 200,
                    Description = "Plan Team avec toutes les fonctionnalités",
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                };

                context.Plans.AddRange(plan1, plan2, plan3);
                await context.SaveChangesAsync();
            }
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
    }
}
