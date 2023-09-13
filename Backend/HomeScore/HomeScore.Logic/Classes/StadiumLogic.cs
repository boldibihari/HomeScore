using HomeScore.Data.Models.Entities;
using HomeScore.Logic.Interfaces;
using HomeScore.Repository.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace HomeScore.Logic.Classes
{
    public class StadiumLogic : IStadiumLogic
    {
        private readonly IStadiumRepository stadiumRepository;
        protected readonly IWebHostEnvironment webHostEnvironment;
        protected readonly string webRoot;

        public StadiumLogic(IStadiumRepository stadiumRepository, IWebHostEnvironment webHostEnvironment)
        {
            this.stadiumRepository = stadiumRepository;
            this.webHostEnvironment = webHostEnvironment;
            webRoot = webHostEnvironment.WebRootPath + "\\";
        }

        public void AddStadium(Stadium stadium)
        {
            stadiumRepository.Add(stadium);
        }

        public async Task UploadStadiumImage(int stadiumId, IFormFile file)
        {
            string path = $"{webRoot}StadiumImages/{stadiumId}.png";

            if (File.Exists(path))
            {
                throw new Exception("This stadium already has an image.");
            }

            using (FileStream fileStream = new FileStream(path, FileMode.OpenOrCreate, FileAccess.ReadWrite))
            {
                await file.CopyToAsync(fileStream);
            }
        }

        public void DeleteStadium(int stadiumId)
        {
            stadiumRepository.Delete(stadiumId);
        }

        public void DeleteStadiumImage(int stadiumId)
        {
            string path = $"{webRoot}StadiumImages/{stadiumId}.png";

            if (!File.Exists(path))
            {
                throw new Exception("This stadium has no image.");
            }

            File.Delete(path);
        }

        public void UpdateStadium(int stadiumId, Stadium newStadium)
        {
            stadiumRepository.Update(stadiumId, newStadium);
        }

        public Stadium GetOneStadium(int stadiumId)
        {
            return stadiumRepository.GetOne(stadiumId);
        }

        public FileStream GetStadiumImage(int stadiumId)
        {
            string path = $"{webRoot}StadiumImages/{stadiumId}.png";

            if (!File.Exists(path))
            {
                throw new Exception("This stadium has no image.");
            }

            return File.OpenRead(path);
        }

        public IList<Stadium> GetAllStadium()
        {
            return stadiumRepository.GetAll().OrderBy(stadium => stadium.StadiumName).ToList();
        }
    }
}
