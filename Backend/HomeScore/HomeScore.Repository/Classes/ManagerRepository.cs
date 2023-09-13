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
    public class ManagerRepository : Repository<Manager>, IManagerRepository
    {
        public ManagerRepository(DbContext context) : base(context)
        {
        }

        public override void Update(int managerId, Manager newManager)
        {
            var oldManager = GetOne(managerId);

            oldManager.ManagerName = newManager.ManagerName;
            oldManager.CountryCode = newManager.CountryCode;
            oldManager.ManagerCountry = newManager.ManagerCountry;
            oldManager.ManagerBirthdate = newManager.ManagerBirthdate;
            oldManager.ManagerStartYear = newManager.ManagerStartYear;
            oldManager.PreferredFormation = newManager.PreferredFormation;
            oldManager.WonChampionship = newManager.WonChampionship;
            context.SaveChanges();
        }

        public override Manager GetOne(int managerId)
        {
            return GetAll().SingleOrDefault(x => x.ManagerId == managerId);
        }
    }
}
