using HomeScore.Data.Models.Entities;
using HomeScore.Logic.Interfaces;
using HomeScore.Repository.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace HomeScore.Logic.Classes
{
    public class ManagerLogic : IManagerLogic
    {
        private readonly IManagerRepository managerRepository;
        protected readonly IWebHostEnvironment webHostEnvironment;
        protected readonly string webRoot;

        public ManagerLogic(IManagerRepository managerRepository, IWebHostEnvironment webHostEnvironment)
        {
            this.managerRepository = managerRepository;
            this.webHostEnvironment = webHostEnvironment;
            webRoot = webHostEnvironment.WebRootPath + "\\";
        }

        public void AddManager(Manager manager)
        {
            managerRepository.Add(manager);
        }

        public async Task UploadManagerImage(int managerId, IFormFile file)
        {
            string path = $"{webRoot}ManagerImages/{managerId}.png";

            if (File.Exists(path))
            {
                throw new Exception("This manager already has an image.");
            }

            using (FileStream fileStream = new FileStream(path, FileMode.OpenOrCreate, FileAccess.ReadWrite))
            {
                await file.CopyToAsync(fileStream);
            }
        }

        public void DeleteManager(int managerId)
        {
            managerRepository.Delete(managerId);
        }

        public void DeleteManagerImage(int managerId)
        {
            string path = $"{webRoot}ManagerImages/{managerId}.png";

            if (!File.Exists(path))
            {
                throw new Exception("This manager has no image.");
            }

            File.Delete(path);
        }

        public void UpdateManager(int managerId, Manager newManager)
        {
            managerRepository.Update(managerId, newManager);
        }

        public Manager GetOneManager(int managerId)
        {
            return managerRepository.GetOne(managerId);
        }

        public FileStream GetManagerImage(int managerId)
        {
            string path = $"{webRoot}ManagerImages/{managerId}.png";

            if (!File.Exists(path))
            {
                throw new Exception("This manager has no image.");
            }

            return File.OpenRead(path);
        }

        public IList<Manager> GetAllManager()
        {
            return managerRepository.GetAll().OrderBy(manager => manager.ManagerName).ToList();
        }
    }
}
