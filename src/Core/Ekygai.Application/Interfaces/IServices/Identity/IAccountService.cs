using Application.Wrappers;
using Ekygai.Application.Models.DTOs.Identity;

namespace Ekygai.Application.Interfaces.IServices.Identity
{
    public interface IAccountService
    {
        Task<Response<AuthResponseDto>> LoginAsync(LoginDto loginDto);
        Task<Response<object>> RegisterAsync(RegisterDto registerDto);
        Task<Response<AuthResponseDto>> GetCurrentUserAsync(string userId);
    }
}