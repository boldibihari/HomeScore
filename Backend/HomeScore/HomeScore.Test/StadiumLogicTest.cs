using HomeScore.Data.Models.Entities;
using HomeScore.Logic.Classes;
using HomeScore.Logic.Interfaces;
using HomeScore.Repository.Interfaces;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Moq;
using NUnit.Framework;
using System.IO;

namespace HomeScore.Test
{
    [TestFixture]
    public class StadiumLogicTests
    {
        private Mock<IStadiumRepository> stadiumRepositoryMock;
        private Mock<IWebHostEnvironment> webHostEnvironmentMock;
        private IStadiumLogic stadiumLogic;
        private string webRoot;

        [SetUp]
        public void Setup()
        {
            stadiumRepositoryMock = new Mock<IStadiumRepository>();
            webHostEnvironmentMock = new Mock<IWebHostEnvironment>();
            webRoot = Path.GetTempPath();
            webHostEnvironmentMock.Setup(env => env.WebRootPath).Returns(webRoot);
            stadiumLogic = new StadiumLogic(stadiumRepositoryMock.Object, webHostEnvironmentMock.Object);
        }

        [Test]
        public void AddStadiumTest()
        {
            // Arrange
            var stadium = new Stadium();

            // Act
            stadiumLogic.AddStadium(stadium);

            // Assert
            stadiumRepositoryMock.Verify(s => s.Add(stadium), Times.Once);
        }

        [Test]
        public void UploadStadiumImageTest()
        {
            // Arrange
            int stadiumId = 1;
            string imagePath = $"{webRoot}StadiumImages/{stadiumId}.png";
            var fileMock = new Mock<IFormFile>();
            Directory.CreateDirectory(Path.GetDirectoryName(imagePath));
            File.Create(imagePath).Close();

            // Act & Assert
            var exception = Assert.ThrowsAsync<Exception>(async () => await stadiumLogic.UploadStadiumImage(stadiumId, fileMock.Object));

            // Assert
            Assert.AreEqual("This stadium already has an image.", exception?.Message);
        }

        [Test]
        public void DeleteStadiumTest()
        {
            // Arrange
            var stadiumId = 1;

            // Act
            stadiumLogic.DeleteStadium(stadiumId);

            // Assert
            stadiumRepositoryMock.Verify(s => s.Delete(stadiumId), Times.Once);
        }

        [Test]
        public void DeleteStadiumImageTest()
        {
            // Arrange
            int stadiumId = 1;
            string imagePath = $"{webRoot}StadiumImages/{stadiumId}.png";

            // Create an existing file
            Directory.CreateDirectory(Path.GetDirectoryName(imagePath));
            File.Create(imagePath).Close();

            // Act
            stadiumLogic.DeleteStadiumImage(stadiumId);

            // Assert
            Assert.IsFalse(File.Exists(imagePath));
        }

        [Test]
        public void UpdateStadiumTest()
        {
            // Arrange
            var stadiumId = 1;
            var newStadium = new Stadium();

            // Act
            stadiumLogic.UpdateStadium(stadiumId, newStadium);

            // Assert
            stadiumRepositoryMock.Verify(s => s.Update(stadiumId, newStadium), Times.Once);
        }

        [Test]
        public void GetOneStadiumTest()
        {
            // Arrange
            var stadiumId = 1;
            var expectedStadium = new Stadium();
            stadiumRepositoryMock.Setup(s => s.GetOne(stadiumId)).Returns(expectedStadium);

            // Act
            var result = stadiumLogic.GetOneStadium(stadiumId);

            // Assert
            Assert.AreEqual(expectedStadium, result);
        }

        [Test]
        public void GetStadiumImageTest()
        {
            // Arrange
            int stadiumId = 1;
            string imagePath = $"{webRoot}StadiumImages/{stadiumId}.png";

            // Create an existing file
            Directory.CreateDirectory(Path.GetDirectoryName(imagePath));
            File.Create(imagePath).Close();

            // Act
            var stream = stadiumLogic.GetStadiumImage(stadiumId);

            // Assert
            Assert.IsNotNull(stream);
            stream.Dispose();
        }

        [Test]
        public void GetAllStadiumTest()
        {
            // Arrange
            var stadiums = new List<Stadium>
            {
                new Stadium { StadiumName = "Stadium C" },
                new Stadium { StadiumName = "Stadium A" },
                new Stadium { StadiumName = "Stadium B" }
            };
            stadiumRepositoryMock.Setup(s => s.GetAll()).Returns(stadiums.AsQueryable());

            // Act
            var result = stadiumLogic.GetAllStadium();

            // Assert
            CollectionAssert.AreEqual(stadiums.OrderBy(s => s.StadiumName).ToList(), result);
        }
    }
}
