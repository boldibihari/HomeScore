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
    public class ClubController : ControllerBase
    {
        private readonly IClubLogic clubLogic;
        private readonly IHubContext<EventHub> hub;

        public ClubController(IClubLogic clubLogic, IHubContext<EventHub> hub)
        {
            this.clubLogic = clubLogic;
            this.hub = hub;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public IActionResult AddClub([FromBody] Club club)
        {
            try
            {
                clubLogic.AddClub(club);
                hub.Clients.All.SendAsync("ClubAdded", club);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("Image/{clubId}")]
        public IActionResult UploadClubImage(int clubId, IFormFile file)
        {
            try
            {
                Task uploadImageTask = Task.Run(() => clubLogic.UploadClubImage(clubId, file));
                uploadImageTask.Wait();
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{clubId}")]
        public IActionResult DeleteClub(int clubId)
        {
            try
            {
                var club = clubLogic.GetOneClub(clubId);
                clubLogic.DeleteClub(clubId);
                hub.Clients.All.SendAsync("ClubDeleted", club);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("Image/{clubId}")]
        public IActionResult DeleteClubImage(int clubId)
        {
            try
            {
                clubLogic.DeleteClubImage(clubId);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{clubId}")]
        public IActionResult UpdateClub(int clubId, [FromBody] Club newClub)
        {
            try
            {
                clubLogic.UpdateClub(clubId, newClub);
                hub.Clients.All.SendAsync("ClubUpdated", newClub);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }

        [HttpGet("{clubId}")]
        public IActionResult GetOneClub(int clubId)
        {
            try
            {
                return Ok(clubLogic.GetOneClub(clubId));
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }

        [HttpGet("Image/{clubId}")]
        public IActionResult GetClubImage(int clubId)
        {
            try
            {
                return File(clubLogic.GetClubImage(clubId), "image/png");
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }

        [HttpGet]
        public IActionResult GetAllClub()
        {
            try
            {
                return Ok(clubLogic.GetAllClub());
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }

        [HttpGet("AverageAge/{clubId}")]
        public IActionResult ClubAverageAge(int clubId)
        {
            try
            {
                return Ok(clubLogic.ClubAverageAge(clubId));
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }

        [HttpGet("AverageValue")]
        public IActionResult AverageClubValue()
        {
            try
            {
                return Ok(clubLogic.AverageClubValue());
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }

        [HttpGet("Value/{clubId}")]
        public IActionResult ClubValue(int clubId)
        {
            try
            {
                return Ok(clubLogic.ClubValue(clubId));
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }

        [HttpGet("AveragePlayerValue/{clubId}")]
        public IActionResult ClubAveragePlayerValue(int clubId)
        {
            try
            {
                return Ok(clubLogic.ClubAveragePlayerValue(clubId));
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }

        [HttpGet("Country/{clubId}")]
        public IActionResult GetCountryOneClub(int clubId)
        {
            try
            {
                return Ok(clubLogic.GetCountryOneClub(clubId));
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }

        [HttpGet("Position/{clubId}")]
        public IActionResult GetPositionOneClub(int clubId)
        {
            try
            {
                return Ok(clubLogic.GetPositionOneClub(clubId));
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }
    }
}
