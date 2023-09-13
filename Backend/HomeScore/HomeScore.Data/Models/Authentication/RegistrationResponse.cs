using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HomeScore.Data.Models.Authentication
{
    public class RegistrationResponse
    {
        public bool IsSuccessfulRegistration { get; set; }

        public string? Error { get; set; }
    }
}
