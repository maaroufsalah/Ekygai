using Application.DTOs.Subscription;
using Application.Wrappers;

namespace Ekygai.Application.Interfaces.IServices
{
    /// <summary>
    /// Interface for managing user subscriptions.
    /// </summary>
    public interface ISubscriptionService
    {
        /// <summary>
        /// Retrieves a subscription by its unique identifier.
        /// </summary>
        /// <param name="id">The unique identifier of the subscription.</param>
        /// <returns>A response containing subscription details if found; otherwise, an error message.</returns>
        Task<Response<SubscriptionForDetailDto>> GetSubscriptionByIdAsync(Guid id);

        /// <summary>
        /// Retrieves all subscriptions.
        /// </summary>
        /// <returns>A response containing a list of all subscriptions.</returns>
        Task<Response<List<SubscriptionForListDto>>> GetSubscriptionsAsync();

        /// <summary>
        /// Creates a new subscription for a user.
        /// </summary>
        /// <param name="subscriptionForInsertDto">The subscription data required for creation.</param>
        /// <returns>A response containing the created subscription details or an error message.</returns>
        Task<Response<SubscriptionForDetailDto>> CreateSubscriptionAsync(SubscriptionForInsertDto subscriptionForInsertDto);

        /// <summary>
        /// Updates an existing subscription.
        /// </summary>
        /// <param name="subscriptionForUpdateDto">The updated subscription details.</param>
        /// <returns>A response containing the updated subscription details or an error message.</returns>
        Task<Response<SubscriptionForDetailDto>> UpdateSubscriptionAsync(SubscriptionForUpdateDto subscriptionForUpdateDto);

        /// <summary>
        /// Deletes a subscription by its unique identifier.
        /// </summary>
        /// <param name="id">The unique identifier of the subscription to be deleted.</param>
        /// <returns>A response indicating whether the deletion was successful.</returns>
        Task<Response<bool>> DeleteSubscriptionByIdAsync(Guid id);
    }
}