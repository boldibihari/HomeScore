using HomeScore.Data.Models.Entities;
using HomeScore.Logic.Classes;
using HomeScore.Logic.Interfaces;
using HomeScore.Repository.Interfaces;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Moq;
using NUnit.Framework;

namespace HomeScore.Test
{
    [TestFixture]
    public class ClubLogicTest
    {
        private Mock<IClubRepository> clubRepositoryMock;
        private Mock<IWebHostEnvironment> webHostEnvironmentMock;
        private IClubLogic clubLogic;
        private string webRoot;

        [SetUp]
        public void Setup()
        {
            clubRepositoryMock = new Mock<IClubRepository>();
            webHostEnvironmentMock = new Mock<IWebHostEnvironment>();
            webRoot = Path.GetTempPath();
            webHostEnvironmentMock.Setup(env => env.WebRootPath).Returns(webRoot);
            clubLogic = new ClubLogic(clubRepositoryMock.Object, webHostEnvironmentMock.Object);
        }

        [Test]
        public void AddClubTest()
        {
            // Arrange
            var club = new Club();

            // Act
            clubLogic.AddClub(club);

            // Assert
            clubRepositoryMock.Verify(c => c.Add(club), Times.Once);
        }

        [Test]
        public void UploadClubImageTest()
        {
            // Arrange
            int clubId = 1;
            string imagePath = $"{webRoot}ClubImages/{clubId}.png";
            var fileMock = new Mock<IFormFile>();
            Directory.CreateDirectory(Path.GetDirectoryName(imagePath));
            File.Create(imagePath).Close();

            // Act & Assert
            var exception = Assert.ThrowsAsync<Exception>(async () => await clubLogic.UploadClubImage(clubId, fileMock.Object));

            // Assert
            Assert.AreEqual("This club already has an image.", exception?.Message);
        }

        [Test]
        public void DeleteClubTest()
        {
            // Arrange
            var clubId = 1;

            // Act
            clubLogic.DeleteClub(clubId);

            // Assert
            clubRepositoryMock.Verify(c => c.Delete(clubId), Times.Once);
        }

        [Test]
        public void DeleteClubImageTest()
        {
            // Arrange
            int clubId = 1;
            string imagePath = $"{webRoot}ClubImages/{clubId}.png";

            // Create an existing file
            Directory.CreateDirectory(Path.GetDirectoryName(imagePath));
            File.Create(imagePath).Close();

            // Act
            clubLogic.DeleteClubImage(clubId);

            // Assert
            Assert.IsFalse(File.Exists(imagePath));
        }

        [Test]
        public void UpdateClubTest()
        {
            // Arrange
            var clubId = 1;
            var newClub = new Club();

            // Act
            clubLogic.UpdateClub(clubId, newClub);

            // Assert
            clubRepositoryMock.Verify(c => c.Update(clubId, newClub), Times.Once);
        }

        [Test]
        public void GetOneClubTest()
        {
            // Arrange
            var clubId = 1;
            var expectedClub = new Club();
            clubRepositoryMock.Setup(c => c.GetOne(clubId)).Returns(expectedClub);

            // Act
            var result = clubLogic.GetOneClub(clubId);

            // Assert
            clubRepositoryMock.Verify(c => c.GetOne(clubId), Times.Once);
            Assert.AreEqual(expectedClub, result);
        }

        [Test]
        public void GetClubImageTest()
        {
            // Arrange
            int clubId = 1;
            string imagePath = $"{webRoot}ClubImages/{clubId}.png";

            // Create an existing file
            Directory.CreateDirectory(Path.GetDirectoryName(imagePath));
            File.Create(imagePath).Close();

            // Act
            var stream = clubLogic.GetClubImage(clubId);

            // Assert
            Assert.IsNotNull(stream);
            stream.Dispose();
        }

        [Test]
        public void GetAllClubTest()
        {
            // Arrange
            var clubs = new List<Club>
            {
                new Club { ClubName = "Club C" },
                new Club { ClubName = "Club A" },
                new Club { ClubName = "Club B" }
            };
            clubRepositoryMock.Setup(c => c.GetAll()).Returns(clubs.AsQueryable());

            // Act
            var result = clubLogic.GetAllClub();

            // Assert
            clubRepositoryMock.Verify(c => c.GetAll(), Times.Once);
            CollectionAssert.AreEqual(clubs.OrderBy(c => c.ClubName).ToList(), result);
        }

        [Test]
        public void AddPlayerToClubTest()
        {
            // Arrange
            int clubId = 1;
            Player player = new Player();

            // Act
            clubLogic.AddPlayerToClub(clubId, player);

            // Assert
            clubRepositoryMock.Verify(c => c.AddPlayerToClub(clubId, player), Times.Once);
        }

        [Test]
        public void AddManagerToClubTest()
        {
            // Arrange
            int clubId = 1;
            Manager manager = new Manager();

            // Act
            clubLogic.AddManagerToClub(clubId, manager);

            // Assert
            clubRepositoryMock.Verify(c => c.AddManagerToClub(clubId, manager), Times.Once);
        }

        [Test]
        public void AddStadiumToClubTest()
        {
            // Arrange
            int clubId = 1;
            Stadium stadium = new Stadium();

            // Act
            clubLogic.AddStadiumToClub(clubId, stadium);

            // Assert
            clubRepositoryMock.Verify(c => c.AddStadiumToClub(clubId, stadium), Times.Once);
        }

        [Test]
        public void ClubAverageAgeTest()
        {
            // Arrange
            var players = new List<Player>
            {
                new Player { PlayerBirthdate = new DateTime(1990, 1, 1) },
                new Player { PlayerBirthdate = new DateTime(1995, 6, 15) },
                new Player { PlayerBirthdate = new DateTime(1992, 3, 10) }
            };
            var club = new Club { ClubId = 1, Players = players };
            clubRepositoryMock.Setup(c => c.GetOne(club.ClubId)).Returns(club);

            // Act
            var result = clubLogic.ClubAverageAge(club.ClubId);

            // Assert
            var expectedResult = 30.7;
            clubRepositoryMock.Verify(c => c.GetOne(club.ClubId), Times.Once);
            Assert.AreEqual(expectedResult, result);
        }

        [Test]
        public void AverageClubValueTest()
        {
            // Arrange
            var clubs = new List<Club>
            {
                new Club { ClubId = 1 },
                new Club { ClubId = 2 },
                new Club { ClubId = 3 }
            };
            clubs[0].Players = new List<Player>
            {
                new Player { PlayerValue = 1, Club = clubs[0] },
                new Player { PlayerValue = 2, Club = clubs[0] },
                new Player { PlayerValue = 1.3, Club = clubs[0] }
            };
            clubs[1].Players = new List<Player>
            {
                new Player { PlayerValue = 1.5, Club = clubs[1] },
                new Player { PlayerValue = 2.8, Club = clubs[1] },
                new Player { PlayerValue = 3, Club = clubs[1] }
            };
            clubs[2].Players = new List<Player>
            {
                new Player { PlayerValue = 5, Club = clubs[2] },
                new Player { PlayerValue = 2.2, Club = clubs[2] },
                new Player { PlayerValue = 3.5, Club = clubs[2] }
            };
            clubRepositoryMock.Setup(c => c.GetAll()).Returns(clubs.AsQueryable());

            // Act
            var result = clubLogic.AverageClubValue();

            // Assert
            var expectedResult = 7.43;
            clubRepositoryMock.Verify(c => c.GetAll(), Times.Once);
            Assert.AreEqual(expectedResult, result);
        }

        [Test]
        public void ClubValueTest()
        {
            // Arrange
            var players = new List<Player>
            {
                new Player { PlayerValue = 100 },
                new Player { PlayerValue = 150 },
                new Player { PlayerValue = 200 }
            };
            var club = new Club { ClubId = 1, Players = players };
            clubRepositoryMock.Setup(c => c.GetOne(club.ClubId)).Returns(club);

            // Act
            var result = clubLogic.ClubValue(club.ClubId);

            // Assert
            var expectedResult = 450.0;
            clubRepositoryMock.Verify(c => c.GetOne(club.ClubId), Times.Once);
            Assert.AreEqual(expectedResult, result);
        }

        [Test]
        public void ClubAveragePlayerValueTest()
        {
            // Arrange
            var players = new List<Player>
            {
                new Player { PlayerValue = 1.5 },
                new Player { PlayerValue = 4.8 },
                new Player { PlayerValue = 3.3 }
            };
            var club = new Club {ClubId = 1, Players = players };
            clubRepositoryMock.Setup(c => c.GetOne(club.ClubId)).Returns(club);

            // Act
            var result = clubLogic.ClubAveragePlayerValue(club.ClubId);

            // Assert
            var expectedResult = 3.2;
            clubRepositoryMock.Verify(c => c.GetOne(club.ClubId), Times.Once);
            Assert.AreEqual(expectedResult, result);
        }

        [Test]
        public void GetCountryOneClubTest()
        {
            // Arrange
            var players = new List<Player>
            {
                new Player { PlayerCountry = "Hungary" },
                new Player { PlayerCountry = "Germany" },
                new Player { PlayerCountry = "Hungary" },
                new Player { PlayerCountry = "France" }
            };
            var club = new Club { ClubId = 1, Players = players };
            clubRepositoryMock.Setup(c => c.GetOne(club.ClubId)).Returns(club);

            // Act
            var result = clubLogic.GetCountryOneClub(club.ClubId);

            // Assert
            var expectedResult = new List<Country>
            {
                new Country { PlayerCountry = "Hungary", Count = 2 },
                new Country { PlayerCountry = "France", Count = 1 },
                new Country { PlayerCountry = "Germany", Count = 1 }
            };
            clubRepositoryMock.Verify(c => c.GetOne(club.ClubId), Times.Once);
            CollectionAssert.AreEqual(expectedResult, result);
        }

        [Test]
        public void GetPositionOneClubTest()
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
            var club = new Club { ClubId = 1, Players = players };
            clubRepositoryMock.Setup(c => c.GetOne(club.ClubId)).Returns(club);

            // Act
            var result = clubLogic.GetPositionOneClub(club.ClubId);

            // Assert
            var expectedResult = new List<Position>
            {
                new Position { PlayerPosition = PlayerPosition.Goalkeeper, Count = 1 },
                new Position { PlayerPosition = PlayerPosition.Defender, Count = 1 },
                new Position { PlayerPosition = PlayerPosition.Midfielder, Count = 2 },
                new Position { PlayerPosition = PlayerPosition.Forward, Count = 1 }
            };
            clubRepositoryMock.Verify(c => c.GetOne(club.ClubId), Times.Once);
            CollectionAssert.AreEqual(expectedResult, result);
        }
    }
}
