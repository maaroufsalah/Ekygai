using Domain.Entities.Subscription;

namespace Ekygai.Application.Interfaces.IRepositories
{
/// <summary>
    /// Interface for handling Plan-related database operations.
    /// </summary>
    public interface IPlanRepository : IGenericRepository<Plan>
    {
        /// <summary>
        /// Retrieves all active plans.
        /// </summary>
        /// <returns>A list of active plans.</returns>
        Task<List<Plan>> GetActivePlansAsync();

        /// <summary>
        /// Checks if a plan with the given ID exists.
        /// </summary>
        /// <param name="planId">The ID of the plan to check.</param>
        /// <returns>True if the plan exists, otherwise false.</returns>
        Task<bool> PlanExistsAsync(int planId);
    }
}