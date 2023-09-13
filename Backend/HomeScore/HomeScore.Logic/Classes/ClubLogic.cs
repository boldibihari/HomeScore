using HomeScore.Data.Models.Entities;
using HomeScore.Logic.Interfaces;
using HomeScore.Repository.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace HomeScore.Logic.Classes
{
    public class ClubLogic : IClubLogic
    {
        private readonly IClubRepository clubRepository;
        protected readonly IWebHostEnvironment webHostEnvironment;
        protected readonly string webRoot;

        public ClubLogic(IClubRepository clubRepository, IWebHostEnvironment webHostEnvironment)
        {
            this.clubRepository = clubRepository;
            this.webHostEnvironment = webHostEnvironment;
            webRoot = webHostEnvironment.WebRootPath + "\\";
        }

        public void AddClub(Club club)
        {
            clubRepository.Add(club);
        }

        public async Task UploadClubImage(int clubId, IFormFile file)
        {
            string path = $"{webRoot}ClubImages/{clubId}.png";

            if (File.Exists(path))
            {
                throw new Exception("This club already has an image.");
            }

            using (FileStream fileStream = new FileStream(path, FileMode.OpenOrCreate, FileAccess.ReadWrite))
            {
                await file.CopyToAsync(fileStream);
            }
        }

        public void DeleteClub(int clubId)
        {
            clubRepository.Delete(clubId);
        }

        public void DeleteClubImage(int clubId)
        {
            string path = $"{webRoot}ClubImages/{clubId}.png";

            if (!File.Exists(path))
            {
                throw new Exception("This club has no image.");
            }

            File.Delete(path);
        }

        public void UpdateClub(int clubId, Club newClub)
        {
            clubRepository.Update(clubId, newClub);
        }

        public Club GetOneClub(int clubId)
        {
            return clubRepository.GetOne(clubId);
        }

        public FileStream GetClubImage(int clubId)
        {
            string path = $"{webRoot}ClubImages/{clubId}.png";

            if (!File.Exists(path))
            {
                throw new Exception("This club has no image.");
            }

            return File.OpenRead(path);
        }

        public IList<Club> GetAllClub()
        {
            return clubRepository.GetAll().OrderBy(club => club.ClubName).ToList();
        }

        public void AddPlayerToClub(int clubId, Player player)
        {
            clubRepository.AddPlayerToClub(clubId, player);
        }

        public void AddManagerToClub(int clubId, Manager manager)
        {
            clubRepository.AddManagerToClub(clubId, manager);
        }

        public void AddStadiumToClub(int clubId, Stadium stadium)
        {
            clubRepository.AddStadiumToClub(clubId, stadium);
        }

        public double ClubAverageAge(int clubId)
        {
            return Math.Round(GetOneClub(clubId).Players.Average(x => DateTime.Now.Year - x.PlayerBirthdate.Year), 1);
        }

        public double AverageClubValue()
        {
            var players = GetAllClub().SelectMany(x => x.Players);

            var q = (from x in players
                     group x by x.Club.ClubId into g
                     select (
                         ClubId: g.Key,
                         Value: g.Sum(x => x.PlayerValue)
                     )).Average(x => x.Value);
          
            return Math.Round(q, 2);
        }

        public double ClubValue(int clubId)
        {
            return Math.Round(GetOneClub(clubId).Players.Sum(x => x.PlayerValue), 2);
        }

        public double ClubAveragePlayerValue(int clubId)
        {
            return Math.Round(GetOneClub(clubId).Players.Average(x => x.PlayerValue), 2);
        }

        public IList<Country> GetCountryOneClub(int clubId)
        {
            Club club = GetOneClub(clubId);

            var q = (from x in club.Players
                     group x by x.PlayerCountry into g
                     select new Country()
                     {
                         PlayerCountry = g.Key,
                         Count = g.Count(),
                     }).OrderByDescending(x => x.Count).ThenBy(x => x.PlayerCountry);

            return q.ToList();
        }

        public IList<Position> GetPositionOneClub(int clubId)
        {
            Club club = GetOneClub(clubId);

            var q = (from x in club.Players
                     group x by x.PlayerPosition into g
                     select new Position()
                     {
                         PlayerPosition = g.Key,
                         Count = g.Count(),
                     }).OrderBy(x => x.PlayerPosition);

            return q.ToList();
        }
    }
}
