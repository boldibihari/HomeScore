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
    public class ManagerController : ControllerBase
    {
        private readonly IManagerLogic managerLogic;
        private readonly IClubLogic clubLogic;
        private readonly IHubContext<EventHub> hub;

        public ManagerController(IManagerLogic managerLogic, IClubLogic clubLogic, IHubContext<EventHub> hub)
        {
            this.managerLogic = managerLogic;
            this.clubLogic = clubLogic;
            this.hub = hub;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("{clubId}")]
        public IActionResult AddManagerToClub(int clubId, [FromBody] Manager manager)
        {
            try
            {
                clubLogic.AddManagerToClub(clubId, manager);
                hub.Clients.All.SendAsync("ManagerCreated", manager);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("Image/{managerId}")]
        public IActionResult UploadManagerImage(int managerId, IFormFile file)
        {
            try
            {
                Task uploadImageTask = Task.Run(() => managerLogic.UploadManagerImage(managerId, file));
                uploadImageTask.Wait();
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{managerId}")]
        public IActionResult DeleteManager(int managerId)
        {
            try
            {
                var manager = managerLogic.GetOneManager(managerId);
                managerLogic.DeleteManager(managerId);
                hub.Clients.All.SendAsync("ManagerDeleted", manager);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("Image/{managerId}")]
        public IActionResult DeleteManagerImage(int managerId)
        {
            try
            {
                managerLogic.DeleteManagerImage(managerId);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{managerId}")]
        public IActionResult UpdateManager(int managerId, [FromBody] Manager newManager)
        {
            try
            {
                managerLogic.UpdateManager(managerId, newManager);
                hub.Clients.All.SendAsync("ManagerUpdated", newManager);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }

        [HttpGet("{managerId}")]
        public IActionResult GetOneManager(int managerId)
        {
            try
            {
                return Ok(managerLogic.GetOneManager(managerId));
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }

        [HttpGet("Image/{managerId}")]
        public IActionResult GetManagerImage(int managerId)
        {
            try
            {
                return File(managerLogic.GetManagerImage(managerId), "image/png");
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }

        [HttpGet]
        public IActionResult GetAllManager()
        {
            try
            {
                return Ok(managerLogic.GetAllManager());
            }
            catch (Exception e)
            {
                return BadRequest(new Error { Message = e.Message, Date = DateTime.Now });
            }
        }
    }
}
