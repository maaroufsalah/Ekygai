namespace Ekygai.Application.Models.DTOs.Identity
{
    public class RegisterDto
    {
        // User Information
        public string UserName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public List<string> Roles { get; set; } = new List<string>(); // Assign Roles

        // Athlete Information
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; } = string.Empty;

        // Subscription Information
        public int PlanId { get; set; }
    }
}