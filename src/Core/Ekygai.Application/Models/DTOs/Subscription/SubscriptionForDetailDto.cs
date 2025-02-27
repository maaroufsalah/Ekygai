namespace Application.DTOs.Subscription
{
    public class SubscriptionForDetailDto
    {
        public Guid Id { get; set; }  
        public Guid UserId { get; set; }  
        public int PlanId { get; set; }  
        public string PlanName { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public DateTime StartDate { get; set; }  
        public DateTime EndDate { get; set; }  
        public bool IsActive { get; set; }  
    }
}