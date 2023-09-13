using HomeScore.Data.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HomeScore.Logic.Interfaces
{
    public interface IPlayerLogic
    {
        void AddPlayer(Player player);

        void DeletePlayer(int playerId);

        void UpdatePlayer(int playerId, Player newPlayer);

        Player GetOnePlayer(int playerId);

        IList<Player> GetAllPlayer();

        IList<Player> GetAllCaptain();

        IList<int> GetAllPlayerId();

        int AllPlayerCount();

        double AllAverageAge();

        double AllValue();

        double AveragePlayerValue();

        IList<Country> GetAllCountry();

        IList<Position> GetAllPosition();
    }
}
