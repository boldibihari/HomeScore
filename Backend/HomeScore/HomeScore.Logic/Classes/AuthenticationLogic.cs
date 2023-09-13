using HomeScore.Data.Models.Authentication;
using HomeScore.Data.Models.Entities;
using HomeScore.Logic.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace HomeScore.Logic.Classes
{
    public class AuthenticationLogic : IAuthenticationLogic
    {
        private readonly UserManager<User> userManager;
        private readonly IEmailSender emailSender;

        public AuthenticationLogic(UserManager<User> userManager, IEmailSender emailSender)
        {
            this.userManager = userManager;
            this.emailSender = emailSender;
        }

        public async Task<LoginResponse> Login(Login model)
        {
            var user = await userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                throw new Exception("Invalid login; the username or password is incorrect.");
            }

            if (user != null && await userManager.CheckPasswordAsync(user, model.Password) && await userManager.IsEmailConfirmedAsync(user))
            {
                var claims = new List<Claim>
                {
                  new Claim(JwtRegisteredClaimNames.Sub, model.Email),
                  new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                  new Claim(ClaimTypes.NameIdentifier, user.Id)
                };

                var roles = await userManager.GetRolesAsync(user);

                claims.AddRange(roles.Select(role => new Claim(ClaimsIdentity.DefaultRoleClaimType, role)));

                var signinKey = new SymmetricSecurityKey(
                  Encoding.UTF8.GetBytes("Cristiano Ronaldo Lionel Messi Neymar Kylian Mbappé Erling Haaland"));

                var token = new JwtSecurityToken(
                  issuer: "http://www.security.org",
                  audience: "http://www.security.org",
                  claims: claims,
                  expires: DateTime.Now.AddMinutes(60),
                  signingCredentials: new SigningCredentials(signinKey, SecurityAlgorithms.HmacSha256)
                );

                return new LoginResponse
                {
                    IsSuccessfulLogin = true,
                    UserId = user.Id,
                    UserName = user.UserName, 
                    Token = new JwtSecurityTokenHandler().WriteToken(token),
                    Expiration = token.ValidTo
                };
            }
            else if (!await userManager.IsEmailConfirmedAsync(user))
            {
                throw new Exception("Email is not confirmed.");
            }
            else
            {
                await userManager.AccessFailedAsync(user);
                throw new Exception("Invalid login; the username or password is incorrect.");
            }
        }

        public async Task<RegistrationResponse> Registration(Registration model)
        {
            var user = new User
            {
                FirstName = model.FirstName,
                LastName = model.LastName,
                UserName = model.Email.Split('@')[0],
                Email = model.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                LockoutEnabled = true,
                CreatedDate = DateTime.Now
            };

            var result = await userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description).Aggregate((x, y) => x + "&" + y);
                throw new Exception(errors);
            }

            var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
            var param = new Dictionary<string, string>
            {
                {"token", token },
                {"email", user.Email }
            };

            string callback = QueryHelpers.AddQueryString(model.ClientURI, param);
            Message message = new Message(user.Email, $"{user.FirstName} {user.LastName}", "Email confirmation", callback);
            await emailSender.SendConfirmationEmail(message);

            await userManager.AddToRoleAsync(user, "User");

            return new RegistrationResponse { IsSuccessfulRegistration = true };
        }

        public async Task<bool> EmailConfirmation(string email, string token)
        {
            var user = await userManager.FindByEmailAsync(email);
            var confirmResult = await userManager.ConfirmEmailAsync(user, token);

            return user != null && confirmResult.Succeeded;
        }

        public async Task<bool> ForgotPassword(ForgotPassword model)
        {
            var user = await userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                throw new Exception("This user is not found.");
            }

            var token = await userManager.GeneratePasswordResetTokenAsync(user);
            var param = new Dictionary<string, string>
            {
                {"email", model.Email },
                {"token", token }
            };

            var callback = QueryHelpers.AddQueryString(model.ClientURI, param);
            var message = new Message(user.Email, $"{user.FirstName} {user.LastName}", "Password reset", callback);
            await emailSender.SendPasswordResetEmail(message);

            return true;
        }

        public async Task<bool> ResetPassword(ResetPassword model)
        {
            var user = await userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                throw new Exception("This user is not found.");
            }

            var result = await userManager.ResetPasswordAsync(user, model.Token, model.Password);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description).Aggregate((x, y) => x + "&" + y);
                throw new Exception(errors);
            }

            return true;
        }

        public async Task<bool> DeleteUser(string userId)
        {
            var user = await userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new Exception("This user is not found.");
            }

            var result = await userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description).Aggregate((x, y) => x + "&" + y);
                throw new Exception(errors);
            }

            return true;
        }

        public async Task<bool> UpdateUser(Registration model)
        {
            var user = await userManager.FindByEmailAsync(model.Email);
            
            if (user == null)
            {
                throw new Exception("This user is not found.");
            }

            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            if (!(model.Password == null || model.Password.Length == 0))
            {
                await userManager.RemovePasswordAsync(user);
                var result = await userManager.AddPasswordAsync(user, model.Password);

                if (!result.Succeeded)
                {
                    var errors = result.Errors.Select(e => e.Description).Aggregate((x, y) => x + "&" + y);
                    throw new Exception(errors);
                }
            }
            await userManager.UpdateAsync(user);

            return true;
        }

        public async Task<UserProfile> GetOneUser(string userId)
        {
            var user = await userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new Exception("This user is not found.");
            }
   
            return new UserProfile
            {
                UserId = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                UserName = user.UserName,
                Email = user.Email,
                EmailConfirmed = user.EmailConfirmed,
                LockoutEnd = user.LockoutEnd,
                LockoutEnabled = user.LockoutEnabled,
                AccessFailedCount = user.AccessFailedCount,
                CreatedDate = user.CreatedDate,
                Roles = await userManager.GetRolesAsync(user)
            };
        }

        public async Task<IList<UserProfile>> GetAllUser()
        {
            var users = new List<UserProfile>();
            foreach (var user in userManager.Users)
            {
                users.Add(new UserProfile
                { 
                    UserId = user.Id, 
                    FirstName = user.FirstName, 
                    LastName = user.LastName,
                    UserName = user.UserName,
                    Email = user.Email, 
                    EmailConfirmed = user.EmailConfirmed, 
                    LockoutEnd = user.LockoutEnd, 
                    LockoutEnabled = user.LockoutEnabled, 
                    AccessFailedCount = user.AccessFailedCount,
                    CreatedDate = user.CreatedDate,
                    Roles = await userManager.GetRolesAsync(user) 
                });
            }

            return users;
        }
    }
}
