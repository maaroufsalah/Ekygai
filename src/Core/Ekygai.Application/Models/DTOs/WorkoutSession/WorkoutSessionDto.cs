namespace Application.Models.DTOs.WorkoutSession
{
    public class WorkoutSessionDto
    {
        public int Id { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public double Distance { get; set; }
        public TimeSpan Duration { get; set; }
        public int CaloriesBurned { get; set; }
        public double AverageHeartRate { get; set; }
        public double MaxHeartRate { get; set; }
        public string ActivityType { get; set; }
    }

}
