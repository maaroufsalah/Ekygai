using System.ComponentModel.DataAnnotations;

namespace Ekygai.Domain.Entities.Athlete
{
    public class Athlete
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();  // Unique Subscription ID

        // Identity column: Auto-incremented (Handled in DB Migration)
        public int Code { get; set; }
        [Required]
        public Guid UserId { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string PhoneNumber { get; set; }
        [Required]
        public DateTime DateOfBirth { get; set; }
        [Required]
        public string Gender { get; set; }

        // Audit fields
        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public bool FlagDelete { get; set; }

        // Navigation property
        public ICollection<WorkoutSession> WorkoutSessions { get; set; }
    }
}
