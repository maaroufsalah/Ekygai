using Application.Models.DTOs.Athlete;
using Application.Models.DTOs.WorkoutSession;
using Application.Wrappers;
using AutoMapper;
using Ekygai.Application.Constants;
using Ekygai.Application.Interfaces.IRepositories;
using Ekygai.Application.Interfaces.IServices;
using Ekygai.Domain.Entities.Athlete;

namespace Ekygai.Application.Services
{
public class AthleteService : IAthleteService
    {
        private readonly IMapper _mapper;
        private readonly IAthleteRepository _athleteRepository;

        public AthleteService(
            IMapper mapper,
            IAthleteRepository athleteRepository)
        {
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _athleteRepository = athleteRepository ?? throw new ArgumentNullException(nameof(athleteRepository));
        }

        public async Task<Response<AthleteForDetailDto>> GetAthleteByIdAsync(Guid id)
        {
            if (id == Guid.Empty)
                return new Response<AthleteForDetailDto>(AthleteConstants.ATHLETE_NOT_FOUND);

            var athlete = await _athleteRepository.GetByIdAsync(id);
            if (athlete == null)
                return new Response<AthleteForDetailDto>(AthleteConstants.ATHLETE_NOT_FOUND);

            var mappedResponse = _mapper.Map<AthleteForDetailDto>(athlete);
            return new Response<AthleteForDetailDto>(mappedResponse);
        }

        public async Task<Response<List<AthleteForListDto>>> GetAthletesAsync()
        {
            var athletes = await _athleteRepository.GetAllAsync();
            var mappedResponse = _mapper.Map<List<AthleteForListDto>>(athletes);
            return new Response<List<AthleteForListDto>>(mappedResponse);
        }

        public async Task<Response<AthleteForDetailDto>> CreateAthleteAsync(AthleteForInsertDto athleteForInsertDto)
        {
            if (athleteForInsertDto == null)
                return new Response<AthleteForDetailDto>(AthleteConstants.DATA_EMPTY);

            // Check if the email already exists
            var existingAthlete = await _athleteRepository.FirstOrDefaultAsync(a => a.Email == athleteForInsertDto.Email);
            if (existingAthlete != null)
            {
                return new Response<AthleteForDetailDto>(AthleteConstants.EMAIL_EXIST);
            }

            var athlete = _mapper.Map<Athlete>(athleteForInsertDto);
            athlete.CreatedAt = DateTime.UtcNow;
            athlete.CreatedBy = "System"; // Replace with actual user context if available.

            await _athleteRepository.AddAsync(athlete);
            var result = await _athleteRepository.SaveChangesAsync();

            if (result > 0)
            {
                var mappedResponse = _mapper.Map<AthleteForDetailDto>(athlete);
                return new Response<AthleteForDetailDto>(mappedResponse, AthleteConstants.CREATE_OK);
            }

            return new Response<AthleteForDetailDto>(AthleteConstants.CREATE_KO);
        }

        public async Task<Response<AthleteForDetailDto>> UpdateAthleteAsync(AthleteForUpdateDto athleteForUpdateDto)
        {
            if (athleteForUpdateDto == null)
                throw new ArgumentNullException(nameof(athleteForUpdateDto));

            var athlete = await _athleteRepository.GetByIdAsync(athleteForUpdateDto.Id);
            if (athlete == null)
                return new Response<AthleteForDetailDto>(AthleteConstants.ATHLETE_NOT_FOUND);

            _mapper.Map(athleteForUpdateDto, athlete);
            athlete.UpdatedAt = DateTime.UtcNow;
            athlete.UpdatedBy = "System"; // Replace with actual user context if available.

            _athleteRepository.UpdateAsync(athlete);
            var result = await _athleteRepository.SaveChangesAsync();

            if (result > 0)
            {
                var mappedResponse = _mapper.Map<AthleteForDetailDto>(athlete);
                return new Response<AthleteForDetailDto>(mappedResponse, AthleteConstants.UPDATE_OK);
            }

            return new Response<AthleteForDetailDto>(AthleteConstants.UPDATE_KO);
        }

        public async Task<Response<bool>> DeleteAthleteByIdAsync(Guid id)
        {
            if (id == Guid.Empty)
                return new Response<bool>(false, AthleteConstants.ATHLETE_NOT_FOUND);

            var athlete = await _athleteRepository.GetByIdAsync(id);
            if (athlete == null)
                return new Response<bool>(false, AthleteConstants.ATHLETE_NOT_FOUND);

            athlete.DeletedAt = DateTime.UtcNow;
            athlete.FlagDelete = true;

            _athleteRepository.UpdateAsync(athlete);
            var result = await _athleteRepository.SaveChangesAsync();

            return result > 0
                ? new Response<bool>(true, AthleteConstants.DELETE_OK)
                : new Response<bool>(false, AthleteConstants.DELETE_KO);
        }

        public async Task<Response<List<WorkoutSessionDto>>> GetWorkoutsByAthleteIdAsync(Guid athleteId)
        {
            var athlete = await _athleteRepository.GetByIdAsync(athleteId);
            if (athlete == null)
                return new Response<List<WorkoutSessionDto>>(AthleteConstants.ATHLETE_NOT_FOUND);

            var workouts = athlete.WorkoutSessions;
            var mappedWorkouts = _mapper.Map<List<WorkoutSessionDto>>(workouts);

            return new Response<List<WorkoutSessionDto>>(mappedWorkouts);
        }


        public async Task<Response<WorkoutSessionDto>> AddWorkoutSessionAsync(Guid athleteId, WorkoutSessionForInsertDto workoutDto)
        {
            var athlete = await _athleteRepository.GetByIdAsync(athleteId);
            if (athlete == null)
                return new Response<WorkoutSessionDto>(AthleteConstants.ATHLETE_NOT_FOUND);

            var workoutSession = _mapper.Map<WorkoutSession>(workoutDto);
            workoutSession.CreatedAt = DateTime.UtcNow;
            workoutSession.AthleteId = athleteId;

            athlete.WorkoutSessions.Add(workoutSession);
            await _athleteRepository.SaveChangesAsync();

            var mappedWorkout = _mapper.Map<WorkoutSessionDto>(workoutSession);
            return new Response<WorkoutSessionDto>(mappedWorkout, WorkoutSessionConstants.CREATE_OK);
        }

        public async Task<Response<bool>> DeleteWorkoutSessionAsync(Guid athleteId, Guid workoutId)
        {
            var athlete = await _athleteRepository.GetByIdAsync(athleteId);
            if (athlete == null)
                return new Response<bool>(false, AthleteConstants.ATHLETE_NOT_FOUND);

            var workoutSession = athlete.WorkoutSessions.FirstOrDefault(w => w.Id == workoutId);
            if (workoutSession == null)
                return new Response<bool>(false, WorkoutSessionConstants.WORKOUT_NOT_FOUND);

            athlete.WorkoutSessions.Remove(workoutSession);
            await _athleteRepository.SaveChangesAsync();

            return new Response<bool>(true, WorkoutSessionConstants.DELETE_OK);
        }

    }
}