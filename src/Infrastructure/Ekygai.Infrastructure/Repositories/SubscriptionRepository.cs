using Domain.Entities.Subscription;
using Ekygai.Application.Interfaces.IRepositories;
using Ekygai.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Ekygai.Infrastructure.Repositories
{
/// <summary>
    /// Repository for handling Subscription-related database operations.
    /// </summary>
    public class SubscriptionRepository : GenericRepository<UserSubscription>, ISubscriptionRepository
    {
        private readonly EkygaiContext _context;

        public SubscriptionRepository(EkygaiContext context) : base(context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves the active subscription for a given user.
        /// </summary>
        /// <param name="userId">The unique identifier of the user.</param>
        /// <returns>The active subscription if found; otherwise, null.</returns>
        public async Task<UserSubscription> GetActiveSubscriptionByUserIdAsync(Guid userId)
        {
            return await _context.UserSubscriptions
                .Include(s => s.Plan) // Include plan details if needed
                .Where(s => s.UserId == userId && s.IsActive)
                .FirstOrDefaultAsync();
        }

        /// <summary>
        /// Checks if a user is currently subscribed to any active plan.
        /// </summary>
        /// <param name="userId">The unique identifier of the user.</param>
        /// <returns>True if the user has an active subscription; otherwise, false.</returns>
        public async Task<bool> IsUserSubscribedAsync(Guid userId)
        {
            return await _context.UserSubscriptions
                .AnyAsync(s => s.UserId == userId && s.IsActive);
        }
    }
}