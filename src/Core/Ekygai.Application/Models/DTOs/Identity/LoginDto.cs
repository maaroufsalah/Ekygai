using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ekygai.Application.Models.DTOs.Identity
{
    public class LoginDto
    {
        public string UserNameOrEmail { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public bool RememberMe { get; set; } = false;
    }
}