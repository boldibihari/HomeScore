using HomeScore.Data.Models.Entities;
using HomeScore.Logic.Classes;
using HomeScore.Logic.Interfaces;
using HomeScore.Repository.Interfaces;
using Moq;
using NUnit.Framework;

namespace HomeScore.Test
{
    [TestFixture]
    public class PlayerLogicTests
    {
        private Mock<IPlayerRepository> playerRepositoryMock;
        private IPlayerLogic playerLogic;

        [SetUp]
        public void Setup()
        {
            playerRepositoryMock = new Mock<IPlayerRepository>();
            playerLogic = new PlayerLogic(playerRepositoryMock.Object);
        }

        [Test]
        public void AddPlayerTest()
        {
            // Arrange
            var player = new Player();

            // Act
            playerLogic.AddPlayer(player);

            // Assert
            playerRepositoryMock.Verify(p => p.Add(player), Times.Once);
        }

        [Test]
        public void DeletePlayerTest()
        {
            // Arrange
            var playerId = 1;

            // Act
            playerLogic.DeletePlayer(playerId);

            // Assert
            playerRepositoryMock.Verify(p => p.Delete(playerId), Times.Once);
        }

        [Test]
        public void UpdatePlayerTest()
        {
            // Arrange
            var playerId = 1;
            var newPlayer = new Player();

            // Act
            playerLogic.UpdatePlayer(playerId, newPlayer);

            // Assert
            playerRepositoryMock.Verify(p => p.Update(playerId, newPlayer), Times.Once);
        }

        [Test]
        public void GetOnePlayerTest()
        {
            // Arrange
            var playerId = 1;
            var expectedPlayer = new Player();
            playerRepositoryMock.Setup(p => p.GetOne(playerId)).Returns(expectedPlayer);

            // Act
            var result = playerLogic.GetOnePlayer(playerId);

            // Assert
            playerRepositoryMock.Verify(p => p.GetOne(playerId), Times.Once);
            Assert.AreEqual(expectedPlayer, result);
        }

        [Test]
        public void GetAllPlayerTest()
        {
            // Arrange
            var players = new List<Player>
            {
                new Player { PlayerName = "Player C" },
                new Player { PlayerName = "Player A" },
                new Player { PlayerName = "Player B" }
            };
            playerRepositoryMock.Setup(p => p.GetAll()).Returns(players.AsQueryable());

            // Act
            var result = playerLogic.GetAllPlayer();

            // Assert
            playerRepositoryMock.Verify(p => p.GetAll(), Times.Once);
            CollectionAssert.AreEqual(players.OrderBy(x => x.PlayerName).ToList(), result);
        }

        [Test]
        public void GetAllPlayerIdTest()
        {
            // Arrange
            var players = new List<Player>
            {
                new Player { PlayerId = 1 },
                new Player { PlayerId = 2 },
                new Player { PlayerId = 3 }
            };
            playerRepositoryMock.Setup(p => p.GetAll()).Returns(players.AsQueryable());

            // Act
            var result = playerLogic.GetAllPlayerId();

            // Assert
            var expectedResult = new List<int> { 1, 2, 3 };
            playerRepositoryMock.Verify(p => p.GetAll(), Times.Once);
            CollectionAssert.AreEqual(expectedResult, result);
        }

        [Test]
        public void AllPlayerCountTest()
        {
            // Arrange
            var players = new List<Player>
            {
                new Player(),
                new Player(),
                new Player()
            };
            playerRepositoryMock.Setup(p => p.GetAll()).Returns(players.AsQueryable());

            // Act
            var result = playerLogic.AllPlayerCount();

            // Assert
            var expectedResult = players.Count;
            playerRepositoryMock.Verify(p => p.GetAll(), Times.Once);
            Assert.AreEqual(expectedResult, result);
        }

        [Test]
        public void AllAverageAgeTest()
        {
            // Arrange
            var players = new List<Player>
            {
                new Player { PlayerBirthdate = new DateTime(1990, 1, 1) },
                new Player { PlayerBirthdate = new DateTime(1995, 6, 15) },
                new Player { PlayerBirthdate = new DateTime(1992, 3, 10) }
            };
            playerRepositoryMock.Setup(p => p.GetAll()).Returns(players.AsQueryable());

            // Act
            var result = playerLogic.AllAverageAge();

            // Assert
            var expectedResult = 30.7;
            playerRepositoryMock.Verify(p => p.GetAll(), Times.Once);
            Assert.AreEqual(expectedResult, result);
        }

        [Test]
        public void AllValueTest()
        {
            // Arrange
            var players = new List<Player>
            {
                new Player { PlayerValue = 1.5 },
                new Player { PlayerValue = 4.8 },
                new Player { PlayerValue = 3.3 }
            };
            playerRepositoryMock.Setup(p => p.GetAll()).Returns(players.AsQueryable());

            // Act
            var result = playerLogic.AllValue();

            // Assert
            var expectedResult = 9.6;
            playerRepositoryMock.Verify(p => p.GetAll(), Times.Once);
            Assert.AreEqual(expectedResult, result);
        }

        [Test]
        public void AveragePlayerValueTest()
        {
            // Arrange
            var players = new List<Player>
            {
                new Player { PlayerValue = 1.5 },
                new Player { PlayerValue = 4.8 },
                new Player { PlayerValue = 3.3 }
            };
            playerRepositoryMock.Setup(p => p.GetAll()).Returns(players.AsQueryable());

            // Act
            var result = playerLogic.AveragePlayerValue();

            // Assert
            var expectedResult = 3.2;
            playerRepositoryMock.Verify(p => p.GetAll(), Times.Once);
            Assert.AreEqual(expectedResult, result);
        }

        [Test]
        public void GetAllCountryTest()
        {
            // Arrange
            var players = new List<Player>
            {
                new Player { PlayerCountry = "Hungary" },
                new Player { PlayerCountry = "Germany" },
                new Player { PlayerCountry = "Hungary" },
                new Player { PlayerCountry = "France" }
            };
            playerRepositoryMock.Setup(p => p.GetAll()).Returns(players.AsQueryable());

            // Act
            var result = playerLogic.GetAllCountry();

            // Assert
            var expectedResult = new List<Country>
            {
                new Country { PlayerCountry = "Hungary", Count = 2 },
                new Country { PlayerCountry = "France", Count = 1 },
                new Country { PlayerCountry = "Germany", Count = 1 }
            };
            playerRepositoryMock.Verify(p => p.GetAll(), Times.Once);
            CollectionAssert.AreEqual(expectedResult, result);
        }

        [Test]
        public void GetAllPositionTest()
        {
            // Arrange
            var players = new List<Player>
            {
                new Player { PlayerPosition = PlayerPosition.Forward },
                new Player { PlayerPosition = PlayerPosition.Midfielder },
                new Player { PlayerPosition = PlayerPosition.Goalkeeper },
                new Player { PlayerPosition = PlayerPosition.Midfielder },
                new Player { PlayerPosition = PlayerPosition.Defender }
            };
            playerRepositoryMock.Setup(p => p.GetAll()).Returns(players.AsQueryable());

            // Act
            var result = playerLogic.GetAllPosition();

            // Assert
            var expectedResult = new List<Position>
            {
                new Position { PlayerPosition = PlayerPosition.Goalkeeper, Count = 1 },
                new Position { PlayerPosition = PlayerPosition.Defender, Count = 1 },
                new Position { PlayerPosition = PlayerPosition.Midfielder, Count = 2 },
                new Position { PlayerPosition = PlayerPosition.Forward, Count = 1 }
            };
            playerRepositoryMock.Verify(p => p.GetAll(), Times.Once);
            CollectionAssert.AreEqual(expectedResult, result);
        }
    }
}
