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
    public class StadiumController : ControllerBase
    {
        private readonly IStadiumLogic stadiumLogic;
        private readonly IClubLogic clubLogic;
        private readonly IHubContext<EventHub> hub;

        public StadiumController(IStadiumLogic stadiumLogic, IClubLogic clubLogic, IHubContext<EventHub> hub)
        {
            this.stadiumLogic = stadiumLogic;
            this.clubLogic = clubLogic;
            this.hub = hub;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("{clubId}")]
        public IActionResult AddStadiumToClub(int clubId, [FromBody] Stadium stadium)
        {
            try
            {
                clubLogic.AddStadiumToClub(clubId, stadium);
                hub.Clients.All.SendAsync("StadiumCreated", stadium);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("Image/{stadiumId}")]
        public IActionResult UploadStadiumImage(int stadiumId, IFormFile file)
        {
            try
            {
                Task uploadImageTask = Task.Run(() => stadiumLogic.UploadStadiumImage(stadiumId, file));
                uploadImageTask.Wait();
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{stadiumId}")]
        public IActionResult DeleteStadium(int stadiumId)
        {
            try
            {
                var stadium = stadiumLogic.GetOneStadium(stadiumId);
                stadiumLogic.DeleteStadium(stadiumId);
                hub.Clients.All.SendAsync("StadiumDeleted", stadium);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("Image/{stadiumId}")]
        public IActionResult DeleteStadiumImage(int stadiumId)
        {
            try
            {
                stadiumLogic.DeleteStadiumImage(stadiumId);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{stadiumId}")]
        public IActionResult UpdateStadium(int stadiumId, [FromBody] Stadium newStadium)
        {
            try
            {
                stadiumLogic.UpdateStadium(stadiumId, newStadium);
                hub.Clients.All.SendAsync("StadiumUpdated", newStadium);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }

        [HttpGet("{stadiumId}")]
        public IActionResult GetOneStadium(int stadiumId)
        {
            try
            {
                return Ok(stadiumLogic.GetOneStadium(stadiumId));
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }

        [HttpGet("Image/{stadiumId}")]
        public IActionResult GetStadiumImage(int stadiumId)
        {
            try
            {
                return File(stadiumLogic.GetStadiumImage(stadiumId), "image/png");
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }

        [HttpGet]
        public IActionResult GetAllStadium()
        {
            try
            {
                return Ok(stadiumLogic.GetAllStadium());
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }
    }
}
