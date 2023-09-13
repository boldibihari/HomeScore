using HomeScore.Data.Models.Entities;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HomeScore.Logic.Interfaces
{
    public interface IManagerLogic
    {
        void AddManager(Manager manager);

        Task UploadManagerImage(int managerId, IFormFile file);

        void DeleteManager(int managerId);

        void DeleteManagerImage(int managerId);

        void UpdateManager(int managerId, Manager newManager);

        Manager GetOneManager(int managerId);

        FileStream GetManagerImage(int managerId);

        IList<Manager> GetAllManager();
    }
}
