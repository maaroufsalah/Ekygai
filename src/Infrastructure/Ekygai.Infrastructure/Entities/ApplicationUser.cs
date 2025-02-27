using Ekygai.Application.Enums;
using Microsoft.AspNetCore.Identity;

namespace Ekygai.Infrastructure.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public UserType UserType { get; set; }
        public string Gender { get; set; }
    }
}