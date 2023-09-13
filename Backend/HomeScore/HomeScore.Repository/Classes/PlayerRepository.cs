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
    public class PlayerRepository : Repository<Player>, IPlayerRepository
    {
        public PlayerRepository(DbContext context) : base(context)
        {
        }

        public override void Update(int playerId, Player newPlayer)
        {
            var oldPlayer = GetOne(playerId);
            oldPlayer.PlayerName = newPlayer.PlayerName;
            oldPlayer.CountryCode = newPlayer.CountryCode;
            oldPlayer.PlayerCountry = newPlayer.PlayerCountry;
            oldPlayer.PlayerBirthdate = newPlayer.PlayerBirthdate;
            oldPlayer.PlayerPosition = newPlayer.PlayerPosition;
            oldPlayer.ShirtNumber = newPlayer.ShirtNumber;
            oldPlayer.Height = newPlayer.Height;
            oldPlayer.PreferredFoot = newPlayer.PreferredFoot;
            oldPlayer.PlayerValue = newPlayer.PlayerValue;
            oldPlayer.Captain = newPlayer.Captain;
            oldPlayer.ClubId = newPlayer.ClubId;
            context.SaveChanges();
        }

        public override Player GetOne(int playerId)
        {
            return GetAll().SingleOrDefault(x => x.PlayerId == playerId);
        }
    }
}
