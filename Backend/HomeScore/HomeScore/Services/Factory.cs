using HomeScore.Data.Database;
using HomeScore.Data.Models.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HomeScore.Services
{
    static class Factory
    {
        public static async Task FillDatabase(DatabaseContext database)
        {
            Console.WriteLine("Uploading database...");

            List<int> ids = new List<int>();
            await database.Clubs.ForEachAsync(c => ids.Add(c.ClubId));

            foreach (var id in ids)
            {
                foreach (var player in SimpleJson.GetOneClubAllPlayer(id).Result)
                {
                    database.Players.Add(new Player
                    {
                        PlayerId = player.Id,
                        PlayerName = player.Name,
                        CountryCode = player.Country.Alpha2,
                        PlayerCountry = player.Country.Name,
                        ShirtNumber = player.ShirtNumber,
                        PreferredFoot = Converter.ToPreferredFoot(player.PreferredFoot),
                        Height = player.Height,
                        PlayerPosition = Converter.ToPlayerPosition(player.Position),
                        PlayerBirthdate = Converter.ToDateTime(player.DateOfBirthTimestamp),
                        PlayerValue = player.ProposedMarketValue / 1000000,
                        ClubId = database.Set<Club>().Where(c => c.ClubId == id).Select(club => club.ClubId).First(),
                        Club = database.Set<Club>().Where(c => c.ClubId == id).First()
                    });
                }
            }
            database.SaveChanges();

            Console.Clear();

            Console.WriteLine("Database uploaded!");
        }
    }
}
