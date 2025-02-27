using Application.Models.DTOs.Athlete;
using Ekygai.Application.Constants;
using Ekygai.Application.Interfaces.IServices;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AthletesController : ControllerBase
    {
        private readonly ILogger<AthletesController> _logger;
        private readonly IAthleteService _athleteService;

        public AthletesController(ILogger<AthletesController> logger, IAthleteService athleteService)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _athleteService = athleteService ?? throw new ArgumentNullException(nameof(athleteService));
        }

        /// <summary>
        /// Get a list of all athletes
        /// </summary>
        [HttpGet]
        public async Task<ActionResult> GetAthletesAsync()
        {
            var response = await _athleteService.GetAthletesAsync();

            if (response == null)
                return NotFound(AthleteConstants.ATHLETE_NOT_FOUND);

            if (response.Succeeded)
                return Ok(response);

            return BadRequest(response);
        }

        /// <summary>
        /// Get athlete details by ID
        /// </summary>
        [HttpGet("{id}")]
        [ActionName("GetAthleteById")]
        public async Task<ActionResult> GetAthleteById(Guid id)
        {
            var response = await _athleteService.GetAthleteByIdAsync(id);

            if (!response.Succeeded)
                return BadRequest(response);

            return Ok(response);
        }

        /// <summary>
        /// Add a new athlete
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<AthleteForDetailDto>> AddAthleteAsync([FromBody] AthleteForInsertDto athleteForInsertDto)
        {
            var response = await _athleteService.CreateAthleteAsync(athleteForInsertDto);

            if (!response.Succeeded)
                return BadRequest(response);

            // Use the correct action name without "Async"
            return CreatedAtAction(nameof(GetAthleteById), new { id = response.Data.Id }, response.Data);
        }


        /// <summary>
        /// Update an existing athlete
        /// </summary>
        [HttpPatch]
        public async Task<ActionResult> UpdateAthleteAsync([FromBody] AthleteForUpdateDto athleteForUpdateDto)
        {
            if (athleteForUpdateDto == null)
                return BadRequest(new { Message = "Invalid athlete data." });

            var response = await _athleteService.UpdateAthleteAsync(athleteForUpdateDto);

            if (response.Succeeded)
                return Ok(response);

            return BadRequest(response);
        }

        /// <summary>
        /// Delete an athlete by ID
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAthleteAsync(Guid id)
        {
            if (id == Guid.Empty)
                return BadRequest(new { Message = "Invalid athlete ID." });

            var response = await _athleteService.DeleteAthleteByIdAsync(id);

            if (response.Succeeded)
                return Ok(response);

            return BadRequest(response);
        }
    }
}
