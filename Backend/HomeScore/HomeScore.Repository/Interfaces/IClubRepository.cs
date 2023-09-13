using HomeScore.Data.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HomeScore.Repository.Interfaces
{
    public interface IClubRepository : IRepository<Club>
    {
        void AddPlayerToClub(int clubId, Player player);

        void AddManagerToClub(int clubId, Manager manager);

        void AddStadiumToClub(int clubId, Stadium stadium);
    }
}
