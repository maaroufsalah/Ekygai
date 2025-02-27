using Application.Wrappers;
using Ekygai.Application.Constants;
using Ekygai.Application.Interfaces.IServices.Identity;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace Ekygai.Infrastructure.Services
{
    public class AuthenticatedUserService : IAuthenticatedUserService
    {
        public bool IsAuthenticated { get; }
        public string? UserId { get; }
        public string? UserName { get; }
        public string? FirstName { get; }
        public string? LastName { get; }
        public string[] UserRoles { get; }

        public AuthenticatedUserService(IHttpContextAccessor httpContextAccessor)
        {
            var user = httpContextAccessor.HttpContext?.User;

            if (user?.Identity is not null && user.Identity.IsAuthenticated)
            {
                IsAuthenticated = true;
                UserId = user.FindFirstValue(ClaimTypes.NameIdentifier);
                UserName = user.FindFirstValue(ClaimTypes.Name);
                FirstName = user.FindFirstValue(ClaimTypes.GivenName);
                LastName = user.FindFirstValue(ClaimTypes.Surname);
                UserRoles = user.Claims
                                .Where(c => c.Type == ClaimTypes.Role)
                                .Select(c => c.Value)
                                .ToArray();
            }
            else
            {
                IsAuthenticated = false;
                UserRoles = [];
            }
        }

        public Response<bool> CheckAuthorization(params string[] requiredRoles)
        {
            if (!IsAuthenticated)
                return new Response<bool>(false, IdentityConstants.AUTHENTICATION_REQUIRED);

            if (requiredRoles.Any() && !UserRoles.Intersect(requiredRoles).Any())
                return new Response<bool>(false, IdentityConstants.AUTHORIZATION_REQUIRED);

            return new Response<bool>(true, "Access granted.");
        }
    }
}
