using HomeScore.Data.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HomeScore.Logic.Interfaces
{
    public interface IUserLogic
    {
        void AddFavouriteClub(string userId, Club club);

        void DeleteFavouriteClub(string userId, int clubId);

        Task<IList<Club>> GetAllFavouriteClub(string userId);

        bool IsFavourite(string userId, int clubId);

        IList<object> Search(string text);
    }
}
