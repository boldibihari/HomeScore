using HomeScore.Data.Models.Authentication;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HomeScore.Logic.Interfaces
{
    public interface IAuthenticationLogic
    {
        Task<LoginResponse> Login(Login model);

        Task<RegistrationResponse> Registration(Registration model);

        Task<bool> EmailConfirmation(string email, string token);

        Task<bool> ForgotPassword(ForgotPassword forgotPassword);

        Task<bool> ResetPassword(ResetPassword resetPassword);

        Task<bool> DeleteUser(string userId);

        Task<bool> UpdateUser(Registration model);

        Task<UserProfile> GetOneUser(string userId);

        Task<IList<UserProfile>> GetAllUser();
    }
}
