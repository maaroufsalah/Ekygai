using System.Security.Claims;
using System.Transactions;
using Application.DTOs.Subscription;
using Application.Models.DTOs.Athlete;
using Application.Wrappers;
using Domain.Enums;
using Ekygai.Application.Constants;
using Ekygai.Application.Enums;
using Ekygai.Application.Interfaces.IServices;
using Ekygai.Application.Interfaces.IServices.Identity;
using Ekygai.Application.Models.DTOs.Identity;
using Ekygai.Infrastructure.Entities;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using IdentityConstants = Ekygai.Application.Constants.IdentityConstants;

namespace Ekygai.Infrastructure.Services
{
    public class AccountService : IAccountService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly TokenService _tokenService;
        private readonly ILogger<AccountService> _logger;
        private readonly IAthleteService _athleteService;
        private readonly ISubscriptionService _subscriptionService;

        public AccountService(UserManager<ApplicationUser> userManager,
                            RoleManager<IdentityRole> roleManager,
                            SignInManager<ApplicationUser> signInManager,
                            TokenService tokenService,
                            ILogger<AccountService> logger,
                            IAthleteService athleteService,
                            ISubscriptionService subscriptionService)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
            _logger = logger;
            _athleteService = athleteService;
            _subscriptionService = subscriptionService;
        }

        public async Task<Response<AuthResponseDto>> LoginAsync(LoginDto loginDto)
        {
            var user = await _userManager.FindByNameAsync(loginDto.UserNameOrEmail)
                    ?? await _userManager.FindByEmailAsync(loginDto.UserNameOrEmail);

            if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password!))
                return new Response<AuthResponseDto>(IdentityConstants.INVALID_CREDENTIALS);

            var roles = await _userManager.GetRolesAsync(user);

            await _signInManager.SignInAsync(user, new AuthenticationProperties
            {
                IsPersistent = loginDto.RememberMe
            });

            var response = new AuthResponseDto
            {
                Id = user.Id,
                UserName = user.UserName!,
                Email = user.Email!,
                FullName = $"{user.FirstName} {user.LastName}",
                Roles = roles.ToList(),
                Token = await _tokenService.GenerateToken(user)
            };

            return new Response<AuthResponseDto>(response, IdentityConstants.LOGIN_SUCCESS);
        }

        public async Task<Response<object>> RegisterAsync(RegisterDto registerDto)
        {
            _logger.LogInformation("🔹 Démarrage de l'inscription de l'utilisateur {Email}", registerDto.Email);

            var existingUserByEmail = await _userManager.FindByEmailAsync(registerDto.Email!);
            if (existingUserByEmail != null)
                return new Response<object>(IdentityConstants.EMAIL_EXISTS);

            var existingUserByUsername = await _userManager.FindByNameAsync(registerDto.UserName!);
            if (existingUserByUsername != null)
                return new Response<object>(IdentityConstants.USERNAME_EXISTS);

            ApplicationUser user;
            RolesEnum roleName;
            try
            {
                using (var transaction = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
                {
                    user = new ApplicationUser
                    {
                        UserName = registerDto.UserName,
                        Email = registerDto.Email,
                        EmailConfirmed = true,
                        FirstName = registerDto.FirstName,
                        LastName = registerDto.LastName,
                        PhoneNumber = registerDto.PhoneNumber,
                        DateOfBirth = registerDto.DateOfBirth,
                        Gender = registerDto.Gender
                    };

                    var result = await _userManager.CreateAsync(user, registerDto.Password!);
                    if (!result.Succeeded)
                        throw new Exception(string.Join(", ", result.Errors.Select(e => e.Description)));

                    roleName = registerDto.PlanId switch
                    {
                        (int)UserPlan.Athlete => RolesEnum.Athlete,
                        (int)UserPlan.Coach => RolesEnum.Coach,
                        (int)UserPlan.Team => RolesEnum.Team,
                        _ => RolesEnum.User
                    };

                    if (!await _roleManager.RoleExistsAsync(roleName.ToString()))
                        await _roleManager.CreateAsync(new IdentityRole(roleName.ToString()));

                    await _userManager.AddToRoleAsync(user, roleName.ToString());


                    // Create a new user Athlete
                    var athleteDto = new AthleteForInsertDto
                    {
                        UserId = Guid.Parse(user.Id),
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Email = user.Email,
                        PhoneNumber = user.PhoneNumber,
                        DateOfBirth = user.DateOfBirth,
                        Gender = user.Gender
                    };

                    var athleteResponse = await _athleteService.CreateAthleteAsync(athleteDto);
                    if (!athleteResponse.Succeeded)
                    {
                        _logger.LogError($"Échec de la création de l'athlète {athleteResponse.Message}");
                        throw new Exception($"Échec de la création de l'athlète {athleteResponse.Message}");
                    }

                    // Create a new user Subscription
                    var subscriptionDto = new SubscriptionForInsertDto
                    {
                        UserId = Guid.Parse(user.Id),
                        PlanId = registerDto.PlanId,
                        StartDate = DateTime.UtcNow,
                        SubscriptionType = SubscriptionType.Monthly // Exemple for test
                    };

                    var subscriptionResponse = await _subscriptionService.CreateSubscriptionAsync(subscriptionDto);
                    if (!subscriptionResponse.Succeeded)
                    {
                        _logger.LogError($"Échec de la création de l'abonnement {subscriptionResponse.Message}");
                        throw new Exception($"Échec de la création de l'abonnement {subscriptionResponse.Message}");
                    }

                    transaction.Complete();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("❌ Erreur lors de l'inscription : {Message}", ex.Message);
                return new Response<object>(IdentityConstants.REGISTRATION_FAILED);
            }

            await _signInManager.SignInAsync(user, isPersistent: false);
            var token = await _tokenService.GenerateToken(user);

            var authResponse = new AuthResponseDto
            {
                Id = user.Id,
                UserName = user.UserName!,
                Email = user.Email!,
                FirstName = user.FirstName,
                LastName = user.LastName,
                FullName = $"{user.FirstName} {user.LastName}",
                Roles = new List<string> { roleName.ToString() },
                Token = token
            };

            return new Response<object>(authResponse, IdentityConstants.REGISTRATION_SUCCESS);
        }

        public async Task<Response<AuthResponseDto>> GetCurrentUserAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return new Response<AuthResponseDto>(IdentityConstants.USER_NOT_FOUND);

            var roles = await _userManager.GetRolesAsync(user);

            var userResponse = new AuthResponseDto
            {
                Id = user.Id,
                UserName = user.UserName!,
                Email = user.Email!,
                FirstName = user.FirstName,
                LastName = user.LastName,
                FullName = $"{user.FirstName} {user.LastName}",
                Roles = roles.ToList()
            };

            return new Response<AuthResponseDto>(userResponse);
        }
    }
}
