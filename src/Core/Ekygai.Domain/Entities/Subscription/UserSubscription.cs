using System.ComponentModel.DataAnnotations;
using Domain.Enums;

namespace Domain.Entities.Subscription
{
    public class UserSubscription
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();  // Unique Subscription ID

        // Identity column: Auto-incremented (Handled in DB Migration)
        public int Code { get; set; }  

        [Required]
        public Guid UserId { get; set; }  // User ID from IdentityService

        [Required]
        public int PlanId { get; set; }  // Plan ID (Foreign Key)

        [Required]
        public SubscriptionType SubscriptionType { get; set; }  // Monthly or Yearly

        [Required]
        public DateTime StartDate { get; set; } = DateTime.UtcNow;  // Start of Subscription

        // EndDate is calculated based on Plan (Handled in Service Layer)
        public DateTime EndDate { get; set; }  

        public bool IsActive { get; set; } = true;  // Status of Subscription

        // Audit fields
        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public bool FlagDelete { get; set; }

        // Navigation Properties
        public Plan? Plan { get; set; }  // Relationship with Plan Entity
    }
}
