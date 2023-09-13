using HomeScore.Data.Models.Authentication;
using HomeScore.Logic.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HomeScore.Endpoint.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthenticationLogic authenticationLogic;

        public AuthenticationController(IAuthenticationLogic authenticationLogic)
        {
            this.authenticationLogic = authenticationLogic;
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] Login model)
        {
            try
            {
                return Ok(await authenticationLogic.Login(model));
            }
            catch (Exception e)
            {
                return Unauthorized(new LoginResponse { Error = e.Message });
            }
        }

        [HttpPost("Registration")]
        public async Task<IActionResult> Registration([FromBody] Registration model)
        {
            try
            {
                return Ok(await authenticationLogic.Registration(model));
            }
            catch (Exception e)
            {
                return BadRequest(new RegistrationResponse { Error = e.Message });
            }
        }

        [HttpGet("EmailConfirmation")]
        public async Task<IActionResult> EmailConfirmation([FromQuery] string email, [FromQuery] string token)
        {
            try
            {
                return Ok(await authenticationLogic.EmailConfirmation(email, token));
            }
            catch (Exception e)
            {

                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }

        [HttpPost("ForgotPassword")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPassword forgotPassword)
        {
            try
            {
                return Ok(await authenticationLogic.ForgotPassword(forgotPassword));
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }

        [HttpPost("ResetPassword")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPassword resetPassword)
        {
            try
            {
                return Ok(await authenticationLogic.ResetPassword(resetPassword));
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }

        }

        [Authorize]
        [HttpDelete("{userId}")]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            try
            {
                return Ok(await authenticationLogic.DeleteUser(userId));
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }

        }

        [Authorize]
        [HttpPut()]
        public async Task<IActionResult> UpdateUser([FromBody] Registration model)
        {
            try
            {
                return Ok(await authenticationLogic.UpdateUser(model));
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }

        }

        [Authorize]
        [HttpGet("{userId}")]
        public async Task<IActionResult> GeOnetUserAsync(string userId)
        {
            try
            {
                return Ok(await authenticationLogic.GetOneUser(userId));
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpGet()]
        public async Task<IActionResult> GetAllUser()
        {
            try
            {
                return Ok(await authenticationLogic.GetAllUser());
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }
    }
}
