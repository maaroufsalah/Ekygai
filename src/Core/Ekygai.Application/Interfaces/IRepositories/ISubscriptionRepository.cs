using Domain.Entities.Subscription;

namespace Ekygai.Application.Interfaces.IRepositories
{
    /// <summary>
    /// Interface for handling Subscription-related database operations.
    /// </summary>
    public interface ISubscriptionRepository : IGenericRepository<UserSubscription>
    {
        /// <summary>
        /// Retrieves the active subscription for a given user.
        /// </summary>
        /// <param name="userId">The unique identifier of the user.</param>
        /// <returns>The active subscription if found; otherwise, null.</returns>
        Task<UserSubscription> GetActiveSubscriptionByUserIdAsync(Guid userId);

        /// <summary>
        /// Checks if a user is currently subscribed to any active plan.
        /// </summary>
        /// <param name="userId">The unique identifier of the user.</param>
        /// <returns>True if the user has an active subscription; otherwise, false.</returns>
        Task<bool> IsUserSubscribedAsync(Guid userId);
    }
}