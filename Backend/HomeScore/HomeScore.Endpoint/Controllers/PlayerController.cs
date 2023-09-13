using HomeScore.Data.Models.Authentication;
using HomeScore.Data.Models.Entities;
using HomeScore.Endpoint.Hubs;
using HomeScore.Logic.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace HomeScore.Endpoint.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PlayerController : ControllerBase
    {
        private readonly IPlayerLogic playerLogic;
        private readonly IClubLogic clubLogic;
        private readonly IHubContext<EventHub> hub;

        public PlayerController(IPlayerLogic playerLogic, IClubLogic clubLogic, IHubContext<EventHub> hub)
        {
            this.playerLogic = playerLogic;
            this.clubLogic = clubLogic;
            this.hub = hub;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("{clubId}")]
        public IActionResult AddPlayerToClub(int clubId, [FromBody] Player player)
        {
            try
            {
                clubLogic.AddPlayerToClub(clubId, player);
                hub.Clients.All.SendAsync("PlayerCreated", player);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{playerId}")]
        public IActionResult DeletePlayer(int playerId)
        {
            try
            {
                var player = playerLogic.GetOnePlayer(playerId);
                playerLogic.DeletePlayer(playerId);
                hub.Clients.All.SendAsync("PlayerDeleted", player);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{playerId}")]
        public IActionResult UpdatePlayer(int playerId, [FromBody] Player newPlayer)
        {
            try
            {
                playerLogic.UpdatePlayer(playerId, newPlayer);
                hub.Clients.All.SendAsync("PlayerUpdated", newPlayer);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }

        [HttpGet("{playerId}")]
        public IActionResult GetOnePlayer(int playerId)
        {
            try
            {
                return Ok(playerLogic.GetOnePlayer(playerId));
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }

        [HttpGet]
        public IActionResult GetAllPlayer()
        {
            try
            {
                return Ok(playerLogic.GetAllPlayer());
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }

        [HttpGet("GetAllCaptain")]
        public IActionResult GetAllCaptain()
        {
            try
            {
                return Ok(playerLogic.GetAllCaptain());
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }

        [HttpGet("GetAllPlayerId")]
        public IActionResult GetAllPlayerId()
        {
            try
            {
                return Ok(playerLogic.GetAllPlayerId());
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }

        [HttpGet("Count")]
        public IActionResult AllPlayerCount()
        {
            try
            {
                return Ok(playerLogic.AllPlayerCount());
            }
            catch (Exception e)
            {

                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }

        [HttpGet("AverageAge")]
        public IActionResult AllAverageAge()
        {
            try
            {
                return Ok(playerLogic.AllAverageAge());
            }
            catch (Exception e)
            {

                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }

        [HttpGet("Value")]
        public IActionResult AllValue()
        {
            try
            {
                return Ok(playerLogic.AllValue());
            }
            catch (Exception e)
            {

                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }

        [HttpGet("AverageValue")]
        public IActionResult AveragePlayerValue()
        {
            try
            {
                return Ok(playerLogic.AveragePlayerValue());
            }
            catch (Exception e)
            {

                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }

        [HttpGet("Country")]
        public IActionResult GetAllCountry()
        {
            try
            {
                return Ok(playerLogic.GetAllCountry());
            }
            catch (Exception e)
            {

                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }

        [HttpGet("Position")]
        public IActionResult GetAllPosition()
        {
            try
            {
                return Ok(playerLogic.GetAllPosition());
            }
            catch (Exception e)
            {

                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }
    }
}
