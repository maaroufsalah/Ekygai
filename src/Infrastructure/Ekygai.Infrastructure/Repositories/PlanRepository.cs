using Domain.Entities.Subscription;
using Ekygai.Application.Interfaces.IRepositories;
using Ekygai.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Ekygai.Infrastructure.Repositories
{
/// <summary>
    /// Repository for handling Plan-related database operations.
    /// </summary>
    public class PlanRepository : GenericRepository<Plan>, IPlanRepository
    {
        private readonly EkygaiContext _context;

        public PlanRepository(EkygaiContext context) : base(context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves all active plans.
        /// </summary>
        /// <returns>A list of active plans.</returns>
        public async Task<List<Plan>> GetActivePlansAsync()
        {
            return await _context.Plans
                .Where(p => p.IsActive)
                .ToListAsync();
        }

        /// <summary>
        /// Checks if a plan with the given ID exists.
        /// </summary>
        /// <param name="planId">The ID of the plan to check.</param>
        /// <returns>True if the plan exists, otherwise false.</returns>
        public async Task<bool> PlanExistsAsync(int planId)
        {
            return await _context.Plans.AnyAsync(p => p.Id == planId);
        }
    }
}