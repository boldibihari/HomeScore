using HomeScore.Data.Models.Authentication;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HomeScore.Logic.Interfaces
{
    public interface IEmailSender
    {
        Task SendConfirmationEmail(Message message);

        Task SendPasswordResetEmail(Message message);
    }
}
