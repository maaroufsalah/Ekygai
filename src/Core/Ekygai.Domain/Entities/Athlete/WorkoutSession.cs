using System.ComponentModel.DataAnnotations;

namespace Ekygai.Domain.Entities.Athlete
{
    public class WorkoutSession
    {
        [Key]
        public Guid Id { get; set; }
        // Identity column: Auto-incremented (Handled in DB Migration)
        public int Code { get; set; }
        public string Type { get; set; } // Type of workout (e.g., Running, Cycling)
        public TimeSpan Duration { get; set; } // Duration of the workout
        public double Distance { get; set; } // Distance covered
        public int CaloriesBurned { get; set; } // Calories burned

        // Audit fields
        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime? DeletedAt { get; set; }
        public string DeletedBy { get; set; }
        public bool FlagDelete { get; set; }

        // Foreign key
        public Guid AthleteId { get; set; }
        public Athlete Athlete { get; set; } // Navigation property
    }

}
