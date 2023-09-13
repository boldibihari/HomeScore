using HomeScore.Data.Models.Authentication;
using HomeScore.Logic.Interfaces;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace HomeScore.Logic.Classes
{
    public class EmailSender : IEmailSender
    {
        public SendGridClient Client { get; set; }

        public EmailSender()
        {
            Client = new SendGridClient("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");
        }

        public async Task SendConfirmationEmail(Message message)
        {
            var msg = new SendGridMessage()
            {
                From = new EmailAddress("homescore.hu@gmail.com", "HomeScore"),
                Subject = message.Subject,
                HtmlContent = $@"<h3>Hy {message.Name}!</h3>
                            <h4>Welcome to the HomeScore website!</h4>
                            <p>Please click on the link below to confirm your account: <br>
                            <a href=""{message.Content}"">Email confirmation</a></p>"
            };
            msg.AddTo(new EmailAddress(message.To, message.Name));
            await Client.SendEmailAsync(msg);
        }

        public async Task SendPasswordResetEmail(Message message)
        {
            var msg = new SendGridMessage()
            {
                From = new EmailAddress("homescore.hu@gmail.com", "HomeScore"),
                Subject = message.Subject,
                HtmlContent = $@"<h3>Hy {message.Name}!</h3>
                            <p>Please click on the link below to reset your password: <br>
                            <a href=""{message.Content}"">Password reset</a></p>"
            };
            msg.AddTo(new EmailAddress(message.To, message.Name));
            await Client.SendEmailAsync(msg);
        }
    }
}
