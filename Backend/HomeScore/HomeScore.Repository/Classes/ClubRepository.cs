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
    public class ClubRepository : Repository<Club>, IClubRepository
    {
        public ClubRepository(DbContext context) : base(context)
        {
        }

        public override void Update(int clubId, Club newClub)
        {
            var oldClub = GetOne(clubId);

            oldClub.ClubName = newClub.ClubName;
            oldClub.ClubColour = newClub.ClubColour;
            oldClub.ClubCity = newClub.ClubCity;
            oldClub.ClubFounded = newClub.ClubFounded;
            oldClub.ClubRating = newClub.ClubRating;
            context.SaveChanges();
        }

        public override Club GetOne(int clubId)
        {
            return GetAll().SingleOrDefault(x => x.ClubId == clubId);
        }

        public void AddPlayerToClub(int clubId, Player player)
        {
            GetOne(clubId).Players.Add(player);
            context.SaveChanges();
        }

        public void AddManagerToClub(int clubId, Manager manager)
        {
            GetOne(clubId).Manager = manager;
            context.SaveChanges();
        }

        public void AddStadiumToClub(int clubId, Stadium stadium)
        {
            GetOne(clubId).Stadium = stadium;
            context.SaveChanges();
        }
    }
}
