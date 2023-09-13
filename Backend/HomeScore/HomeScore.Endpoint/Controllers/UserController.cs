using HomeScore.Data.Models.Authentication;
using HomeScore.Data.Models.Entities;
using HomeScore.Logic.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HomeScore.Endpoint.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserLogic userLogic;

        public UserController(IUserLogic userLogic)
        {
            this.userLogic = userLogic;
        }

        [Authorize]
        [HttpPost("{userId}")]
        public IActionResult AddFavouriteClub(string userId,[FromBody] Club club)
        {
            try
            {
                userLogic.AddFavouriteClub(userId, club);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }

        [Authorize]
        [HttpDelete("{userId}/{clubId}")]
        public IActionResult DeleteFavouriteClub(string userId, int clubId)
        {
            try
            {
                userLogic.DeleteFavouriteClub(userId, clubId);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }

        [Authorize]
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetAllFavouriteClubAsync(string userId)
        {
            try
            {
                return Ok(await userLogic.GetAllFavouriteClub(userId));
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }

        [Authorize]
        [HttpGet("{userId}/{clubId}")]
        public IActionResult IsFavourite(string userId, int clubId)
        {
            try
            {
                return Ok(userLogic.IsFavourite(userId, clubId));
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }

        [HttpGet("Search/{text}")]
        public IActionResult Search(string text)
        {
            try
            {
                return Ok(userLogic.Search(text));
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }
    }
}
