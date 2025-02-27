using Application.Models.DTOs.Athlete;
using Application.Wrappers;

namespace Ekygai.Application.Interfaces.IServices
{
    public interface IAthleteService
    {
        Task<Response<AthleteForDetailDto>> GetAthleteByIdAsync(Guid id);
        Task<Response<List<AthleteForListDto>>> GetAthletesAsync();
        Task<Response<AthleteForDetailDto>> CreateAthleteAsync(AthleteForInsertDto athleteForInsertDto);
        Task<Response<AthleteForDetailDto>> UpdateAthleteAsync(AthleteForUpdateDto athleteForUpdateDto);
        Task<Response<bool>> DeleteAthleteByIdAsync(Guid id);
    }
}