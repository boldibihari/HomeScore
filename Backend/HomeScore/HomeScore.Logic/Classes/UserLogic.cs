using HomeScore.Data.Models.Entities;
using HomeScore.Logic.Interfaces;
using HomeScore.Repository.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace HomeScore.Logic.Classes
{
    public class UserLogic : IUserLogic
    {
        private readonly UserManager<User> userManager;
        private readonly IClubRepository clubRepository;
        private readonly IManagerRepository managerRepository;
        private readonly IPlayerRepository playerRepository;
        private readonly IStadiumRepository stadiumRepository;
        private readonly IUserClubRepository userClubRepository;

        public UserLogic(UserManager<User> userManager, IClubRepository clubRepository, IManagerRepository managerRepository, IPlayerRepository playerRepository, IStadiumRepository stadiumRepository, IUserClubRepository userClubRepository)
        {
            this.userManager = userManager;
            this.clubRepository = clubRepository;
            this.managerRepository = managerRepository;
            this.playerRepository = playerRepository;
            this.stadiumRepository = stadiumRepository;
            this.userClubRepository = userClubRepository;
        }

        public void AddFavouriteClub(string userId, Club club)
        {
            userClubRepository.Add(new UserClub { UserId = userId, ClubId = club.ClubId });
        }

        public void DeleteFavouriteClub(string userId, int clubId)
        {
            var userClub = userClubRepository.GetAll().SingleOrDefault(x => x.ClubId == clubId && x.UserId == userId);

            if (userClub == null)
            {
                throw new Exception("This user has no such favourite club.");
            }

            userClubRepository.Delete(userClub.UserClubId);
        }

        public async Task<IList<Club>> GetAllFavouriteClub(string userId)
        {
            var user = await userManager.FindByIdAsync(userId);

            if (user == null)
            {
                throw new Exception("This user is not found.");
            }

            var favouriteClubs = user.FavouriteClubs;

            var clubs = new List<Club>();

            foreach (var favouriteClub in favouriteClubs)
            {
                clubs.Add(favouriteClub.Club);
            }

            return clubs;
        }

        public bool IsFavourite(string userId, int clubId)
        {
            var result = clubRepository.GetOne(clubId).Users.SingleOrDefault(x => x.UserId == userId);

            return result != null;
        }

        public IList<object> Search(string text)
        {
            if (text.Length >= 3)
            {
                return new List<object>
                {
                    clubRepository.GetAll().Where(club => club.ClubName.ToLower().Contains(text.ToLower())).ToList(),
                    playerRepository.GetAll().Where(player => player.PlayerName.ToLower().Contains(text.ToLower())).ToList(),
                    managerRepository.GetAll().Where(manager => manager.ManagerName.ToLower().Contains(text.ToLower())).ToList(),
                    stadiumRepository.GetAll().Where(stadium => stadium.StadiumName.ToLower().Contains(text.ToLower())).ToList()
                };
            }
            else
            {
                throw new Exception("The text is not long enough.");
            }
        }
    }
}
