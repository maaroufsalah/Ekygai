namespace Domain.Entities.Subscription
{
    public class Plan
    {
        public int Id { get; set; }  // Plan ID (1 = Athlete, 2 = Coach, 3 = Team)
        public string Name { get; set; } = string.Empty;  // Plan Name
        public string Description { get; set; } = string.Empty;  // Plan Description
        public decimal Price { get; set; }  // Monthly or Yearly Price
        public int DurationInMonths { get; set; }  // Subscription Duration
        public bool IsActive { get; set; } = true;  // Active status

        // Audit fields
        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public bool FlagDelete { get; set; }
    }
}
