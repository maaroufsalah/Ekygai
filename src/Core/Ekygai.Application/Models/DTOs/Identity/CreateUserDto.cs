namespace Ekygai.Application.Models.DTOs.Identity
{
    public class CreateUserDto
    {
        public int PlanId { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; }
        // public UserType UserType { get; set; }
    }
}