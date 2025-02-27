using Ekygai.Domain.Entities.Athlete;

namespace Ekygai.Application.Interfaces.IRepositories
{
    public interface IAthleteRepository : IGenericRepository<Athlete>
    {
        Task<List<WorkoutSession>> GetWorkoutSessionsByAthleteIdAsync(Guid athleteId);
    }
}