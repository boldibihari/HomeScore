using HomeScore.Data.Models.Entities;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HomeScore.Logic.Interfaces
{
    public interface IClubLogic
    {
        void AddClub(Club club);

        Task UploadClubImage(int clubId, IFormFile file);

        void DeleteClub(int clubId);

        void DeleteClubImage(int clubId);

        void UpdateClub(int clubId, Club newClub);

        Club GetOneClub(int clubId);

        FileStream GetClubImage(int clubId);

        IList<Club> GetAllClub();

        void AddPlayerToClub(int clubId, Player player);

        void AddManagerToClub(int clubId, Manager manager);

        void AddStadiumToClub(int clubId, Stadium stadium);

        double ClubAverageAge(int clubId);

        double AverageClubValue();

        double ClubValue(int clubId);

        double ClubAveragePlayerValue(int clubId);

        IList<Country> GetCountryOneClub(int clubId);

        IList<Position> GetPositionOneClub(int clubId);
    }
}
