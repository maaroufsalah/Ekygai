namespace Ekygai.Application.Models.DTOs.Identity
{
    public class AuthResponseDto
    {
        public string Id { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; } = string.Empty;
        public List<string> Roles { get; set; } = [];
        public string Token { get; set; } = string.Empty;
    }
}