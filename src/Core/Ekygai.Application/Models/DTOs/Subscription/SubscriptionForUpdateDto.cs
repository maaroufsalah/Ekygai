namespace Application.DTOs.Subscription
{
    public class SubscriptionForUpdateDto
    {
        public Guid Id { get; set; }  // Subscription ID
        public int PlanId { get; set; }  // Updated Plan ID
        public DateTime EndDate { get; set; }  // Update Expiration Date
        public bool IsActive { get; set; }  
    }
}