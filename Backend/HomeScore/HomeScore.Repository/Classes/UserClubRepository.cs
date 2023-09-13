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
    public class UserClubRepository : Repository<UserClub>, IUserClubRepository
    {
        public UserClubRepository(DbContext context) : base(context)
        {
        }

        public override UserClub GetOne(int userClubId)
        {
            return GetAll().SingleOrDefault(x => x.UserClubId == userClubId);
        }

        public override void Update(int userClubId, UserClub newItem)
        {
            throw new NotImplementedException();
        }
    }
}
