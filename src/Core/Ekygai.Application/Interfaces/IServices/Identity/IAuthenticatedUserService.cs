using Application.Wrappers;

namespace Ekygai.Application.Interfaces.IServices.Identity
{
    public interface IAuthenticatedUserService
    {
        bool IsAuthenticated { get; }
        string? UserId { get; }
        string? UserName { get; }
        string? FirstName { get; }
        string? LastName { get; }
        string[] UserRoles { get; }

        Response<bool> CheckAuthorization(params string[] requiredRoles);
    }
}