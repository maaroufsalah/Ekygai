using Ekygai.Domain.Entities.Athlete;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Ekygai.Infrastructure.Entities;
using Domain.Entities.Subscription;
using Microsoft.Extensions.Configuration;

namespace Ekygai.Infrastructure.Contexts
{
    public class EkygaiContext : IdentityDbContext<ApplicationUser, IdentityRole, string>
    {
        public EkygaiContext(DbContextOptions<EkygaiContext> options) : base(options) { }

        // ✅ Register Domain Entities
        public DbSet<Athlete> Athletes { get; set; }
        public DbSet<WorkoutSession> WorkoutSessions { get; set; }
        public DbSet<Plan> Plans { get; set; }
        public DbSet<UserSubscription> UserSubscriptions { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                var configuration = new ConfigurationBuilder()
                    .SetBasePath(Directory.GetCurrentDirectory())
                    .AddJsonFile("appsettings.json", optional: false)
                    .AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development"}.json", optional: true)
                    .Build();

                optionsBuilder.UseNpgsql(configuration.GetConnectionString("DefaultConnection"));
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Athlete>(entity =>
            {
                entity.HasKey(a => a.Id);

                entity.Property(a => a.UserId)
                    .IsRequired(); // Required UserId

                entity.Property(a => a.FirstName)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(a => a.LastName)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(a => a.Email)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.Property(a => a.PhoneNumber)
                    .IsRequired();

                entity.Property(a => a.DateOfBirth)
                    .IsRequired(); // Ensure DateOfBirth is required

                entity.HasIndex(a => a.Email)
                    .IsUnique();

                entity.Property(a => a.Code)
                    .UseIdentityAlwaysColumn();

                // Configure one-to-many relationship with WorkoutSession
                entity.HasMany(a => a.WorkoutSessions)
                    .WithOne(ws => ws.Athlete)
                    .HasForeignKey(ws => ws.AthleteId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<WorkoutSession>(entity =>
            {
                entity.HasKey(ws => ws.Id);

                entity.Property(ws => ws.Type)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(ws => ws.Duration)
                    .IsRequired();

                entity.Property(ws => ws.Distance)
                    .IsRequired();

                entity.Property(ws => ws.CaloriesBurned)
                    .IsRequired();

                entity.Property(x => x.Code)
                    .UseIdentityAlwaysColumn();

                // Configure the foreign key to Athlete
                entity.HasOne(ws => ws.Athlete)
                    .WithMany(a => a.WorkoutSessions)
                    .HasForeignKey(ws => ws.AthleteId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<UserSubscription>(entity =>
                    {
                        entity.HasKey(e => e.Id); // Primary Key

                        entity.Property(e => e.UserId)
                            .IsRequired(); // Required Field

                        entity.Property(e => e.PlanId)
                            .IsRequired(); // Required Field

                        entity.Property(e => e.StartDate)
                            .IsRequired(); // Required Field

                        entity.Property(e => e.EndDate)
                            .IsRequired(); // Required Field
                    });

            // Configure entity relationships
            modelBuilder.Entity<UserSubscription>()
                .HasOne(us => us.Plan)
                .WithMany()
                .HasForeignKey(us => us.PlanId);

            modelBuilder.Entity<UserSubscription>()
                .Property(x => x.Code)
                .UseIdentityAlwaysColumn();

            modelBuilder.Entity<Plan>()
                .Property(x => x.Id)
                .UseIdentityAlwaysColumn();

            modelBuilder.Entity<Athlete>()
                .Property(x => x.Code)
                .UseIdentityAlwaysColumn();

            // ✅ Apply Configurations from Infrastructure (if you have entity configurations)
            // modelBuilder.ApplyConfigurationsFromAssembly(typeof(EkygaiContext).Assembly);
        }
    }
}
