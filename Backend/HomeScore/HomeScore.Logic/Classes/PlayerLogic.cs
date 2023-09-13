using HomeScore.Data.Models.Entities;
using HomeScore.Logic.Interfaces;
using HomeScore.Repository.Interfaces;

namespace HomeScore.Logic.Classes
{
    public class PlayerLogic : IPlayerLogic
    {
        private readonly IPlayerRepository playerRepository;

        public PlayerLogic(IPlayerRepository playerRepository)
        {
            this.playerRepository = playerRepository;
        }

        public void AddPlayer(Player player)
        {
            playerRepository.Add(player);
        }

        public void DeletePlayer(int playerId)
        {
            playerRepository.Delete(playerId);
        }

        public void UpdatePlayer(int playerId, Player newPlayer)
        {
            playerRepository.Update(playerId, newPlayer);
        }

        public Player GetOnePlayer(int playerId)
        {
            return playerRepository.GetOne(playerId);
        }

        public IList<Player> GetAllPlayer()
        {
            return playerRepository.GetAll().OrderBy(player => player.PlayerName).ToList();
        }

        public IList<Player> GetAllCaptain()
        {
            return playerRepository.GetAll().Where(player => player.Captain).OrderBy(player => player.PlayerName).ToList();
        }

        public IList<int> GetAllPlayerId()
        {
            return playerRepository.GetAll().Select(player => player.PlayerId).ToList();
        }

        public int AllPlayerCount()
        {
            return playerRepository.GetAll().Count();
        }

        public double AllAverageAge()
        {
            return Math.Round(GetAllPlayer().Average(x => DateTime.Now.Year - x.PlayerBirthdate.Year), 1);
        }

        public double AllValue()
        {
            return Math.Round(GetAllPlayer().Sum(x => x.PlayerValue), 2);
        }

        public double AveragePlayerValue()
        {
            return Math.Round(GetAllPlayer().Average(x => x.PlayerValue), 2);
        }

        public IList<Country> GetAllCountry()
        {
            var players = GetAllPlayer();

            var q = (from x in players
                     group x by x.PlayerCountry into g
                     select new Country()
                     {
                         PlayerCountry = g.Key,
                         Count = g.Count(),
                     }).OrderByDescending(x => x.Count).ThenBy(x => x.PlayerCountry);

            return q.ToList();
        }

        public IList<Position> GetAllPosition()
        {
            var players = GetAllPlayer();

            var q = (from x in players
                     group x by x.PlayerPosition into g
                     select new Position()
                     {
                         PlayerPosition = g.Key,
                         Count = g.Count(),
                     }).OrderBy(x => x.PlayerPosition);

            return q.ToList();
        }
    }
}
