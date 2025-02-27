using System.ComponentModel.DataAnnotations;
using Domain.Enums;
using Ekygai.Application.Constants;

namespace Application.DTOs.Subscription
{
    public class SubscriptionForInsertDto
    {
        [Required(ErrorMessage = SubscriptionConstants.DATA_EMPTY)]
        public Guid UserId { get; set; }  // User ID from Identity Service

        [Required(ErrorMessage = SubscriptionConstants.PLAN_NOT_FOUND)]
        public int PlanId { get; set; }  // Selected Plan

        [Required(ErrorMessage = SubscriptionConstants.DATA_EMPTY)]
        public SubscriptionType SubscriptionType { get; set; }

        [Required(ErrorMessage = SubscriptionConstants.DATA_EMPTY)]
        public DateTime StartDate { get; set; } = DateTime.UtcNow;  // Start Date

        // EndDate will be automatically calculated in the service layer
        public DateTime EndDate { get; set; }

        public bool AutoRenew { get; set; } = false; // If true, auto-renew when expires

        [Required(ErrorMessage = SubscriptionConstants.DATA_EMPTY)]
        public string PaymentMethod { get; set; } = "Manual";  // 'Manual', 'CreditCard', 'PayPal', etc.

        public string Status { get; set; } = "Pending"; // Initial status: Pending, Active, Canceled, Expired
    }
}
