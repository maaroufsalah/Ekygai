using Ekygai.Application.Interfaces.IRepositories;
using Ekygai.Domain.Entities.Athlete;
using Ekygai.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Ekygai.Infrastructure.Repositories
{
    public class AthleteRepository : GenericRepository<Athlete>, IAthleteRepository
    {
        private readonly EkygaiContext _context;
        public AthleteRepository(EkygaiContext dbContext) : base(dbContext)
        {
            _context = dbContext;
        }

        public async Task<List<WorkoutSession>> GetWorkoutSessionsByAthleteIdAsync(Guid athleteId)
        {
            return await _context.WorkoutSessions
                .Where(w => w.AthleteId == athleteId)
                .ToListAsync();
        }
    }
}