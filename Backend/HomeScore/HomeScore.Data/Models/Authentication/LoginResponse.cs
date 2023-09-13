using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HomeScore.Data.Models.Authentication
{
    public class LoginResponse
    {
        public bool IsSuccessfulLogin { get; set; }

        public string? UserId { get; set; }

        public string? UserName { get; set; }

        public string? Token { get; set; }

        public DateTime? Expiration { get; set; }

        public string? Error { get; set; }
    }
}
