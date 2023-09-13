using HomeScore.Data.Models.Entities;
using HomeScore.Logic.Classes;
using HomeScore.Logic.Interfaces;
using HomeScore.Repository.Interfaces;
using Microsoft.AspNetCore.Identity;
using Moq;
using NUnit.Framework;

namespace HomeScore.Test
{
    [TestFixture]
    public class UserLogicTests
    {
        private Mock<UserManager<User>> userManagerMock;
        private Mock<IClubRepository> clubRepositoryMock;
        private Mock<IManagerRepository> managerRepositoryMock;
        private Mock<IPlayerRepository> playerRepositoryMock;
        private Mock<IStadiumRepository> stadiumRepositoryMock;
        private Mock<IUserClubRepository> userClubRepositoryMock;
        private IUserLogic userLogic;

        [SetUp]
        public void Setup()
        {
            userManagerMock = new Mock<UserManager<User>>(Mock.Of<IUserStore<User>>(), null, null, null, null, null, null, null, null);
            clubRepositoryMock = new Mock<IClubRepository>();
            managerRepositoryMock = new Mock<IManagerRepository>();
            playerRepositoryMock = new Mock<IPlayerRepository>();
            stadiumRepositoryMock = new Mock<IStadiumRepository>();
            userClubRepositoryMock = new Mock<IUserClubRepository>();
            userLogic = new UserLogic(userManagerMock.Object, clubRepositoryMock.Object, managerRepositoryMock.Object, playerRepositoryMock.Object, stadiumRepositoryMock.Object, userClubRepositoryMock.Object);
        }

        [Test]
        public void AddFavouriteClubTest()
        {
            // Arrange
            var userId = "user123";
            var club = new Club { ClubId = 1 };

            // Act
            userLogic.AddFavouriteClub(userId, club);

            // Assert
            userClubRepositoryMock.Verify(uc => uc.Add(It.Is<UserClub>(uc => uc.UserId == userId && uc.ClubId == club.ClubId)), Times.Once);
        }

        [Test]
        public void DeleteFavouriteClubTest()
        {
            // Arrange
            var userId = "user123";
            var clubId = 1;
            var userClub = new UserClub { UserClubId = 10, UserId = userId, ClubId = clubId };
            userClubRepositoryMock.Setup(uc => uc.GetAll()).Returns(new List<UserClub> { userClub }.AsQueryable());

            // Act
            userLogic.DeleteFavouriteClub(userId, clubId);

            // Assert
            userClubRepositoryMock.Verify(uc => uc.Delete(userClub.UserClubId), Times.Once);
        }

        [Test]
        public async Task GetAllFavouriteClubTest()
        {
            // Arrange
            var user = new User { Id = "user123" };
            var expectedClubs = new List<Club>
            {
                new Club { ClubId = 1 },
                new Club { ClubId = 2 }
            };
            user.FavouriteClubs = new List<UserClub> {
                new UserClub { Club = expectedClubs[0], User = user },
                new UserClub { Club = expectedClubs[1], User = user }
            };
            userManagerMock.Setup(um => um.FindByIdAsync(user.Id)).ReturnsAsync(user);

            // Act
            var result = await userLogic.GetAllFavouriteClub(user.Id);

            // Assert
            userManagerMock.Verify(um => um.FindByIdAsync(user.Id), Times.Once);
            Assert.AreEqual(expectedClubs.Count, result.Count);
            CollectionAssert.AreEqual(expectedClubs, result);
        }

        [Test]
        public void IsFavouriteTest()
        {
            // Arrange
            var user = new User { Id = "user123" };
            var club = new Club { ClubId = 1 };
            club.Users = new List<UserClub> {
                new UserClub { ClubId = club.ClubId, UserId = user.Id }
            };
            clubRepositoryMock.Setup(c => c.GetOne(club.ClubId)).Returns(club);

            // Act
            var result = userLogic.IsFavourite(user.Id, club.ClubId);

            // Assert
            clubRepositoryMock.Verify(c => c.GetOne(club.ClubId), Times.Once);
            Assert.IsTrue(result);
        }

        [Test]
        public void SearchTest()
        {
            // Arrange
            var clubs = new List<Club> { new Club { ClubName = "Ferencvárosi TC" }, new Club { ClubName = "Debreceni VSC" } };
            var players = new List<Player> { new Player { PlayerName = "János Ferenczi" }, new Player { PlayerName = "Kristoffer Zachariassen" } };
            var managers = new List<Manager> { new Manager { ManagerName = "Stanislav Cherchesov" }, new Manager { ManagerName = "Ricardo Moniz" } };
            var stadiums = new List<Stadium> { new Stadium { StadiumName = "Pancho Aréna" }, new Stadium { StadiumName = "Szusza Ferenc Stadion" } };

            clubRepositoryMock.Setup(c => c.GetAll()).Returns(clubs.AsQueryable());
            playerRepositoryMock.Setup(p => p.GetAll()).Returns(players.AsQueryable());
            managerRepositoryMock.Setup(m => m.GetAll()).Returns(managers.AsQueryable());
            stadiumRepositoryMock.Setup(s => s.GetAll()).Returns(stadiums.AsQueryable());

            // Act
            var result = userLogic.Search("fer");

            // Assert
            var expectedResult = new List<object> { 
                new List<Club> { clubs[0] },
                new List<Player> { players[0], players[1] },
                new List<Manager> { },
                new List<Stadium> { stadiums[1] }
            };
            Assert.IsNotNull(result);
            Assert.AreEqual(expectedResult.Count, result.Count);
            CollectionAssert.AreEqual(expectedResult, result);
        }

        [Test]
        public void SearchInvalidTextTest()
        {
            // Arrange & Act & Assert
            Assert.Throws<Exception>(() => userLogic.Search("fe"));
        }
    }
}
