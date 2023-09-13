using HomeScore.Data.Models.Entities;
using HomeScore.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HomeScore.Repository.Classes
{
    public class StadiumRepository : Repository<Stadium>, IStadiumRepository
    {
        public StadiumRepository(DbContext context) : base(context)
        {
        }

        public override void Update(int stadiumId, Stadium newStadium)
        {
            var oldStadium = GetOne(stadiumId);

            oldStadium.StadiumName = newStadium.StadiumName;
            oldStadium.Completed = newStadium.Completed;
            oldStadium.Capacity = newStadium.Capacity;
            oldStadium.Location = newStadium.Location;
            context.SaveChanges();
        }

        public override Stadium GetOne(int stadiumId)
        {
            return GetAll().SingleOrDefault(x => x.StadiumId == stadiumId);
        }
    }
}
