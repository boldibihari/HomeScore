using HomeScore.Data.Models.Entities;
using HomeScore.Logic.Classes;
using HomeScore.Logic.Interfaces;
using HomeScore.Repository.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Moq;
using NUnit.Framework;

namespace HomeScore.Test
{
    [TestFixture]
    public class ManagerLogicTests
    {
        private Mock<IManagerRepository> managerRepositoryMock;
        private Mock<IWebHostEnvironment> webHostEnvironmentMock;
        private IManagerLogic managerLogic;
        private string webRoot;

        [SetUp]
        public void Setup()
        {
            managerRepositoryMock = new Mock<IManagerRepository>();
            webHostEnvironmentMock = new Mock<IWebHostEnvironment>();
            webRoot = Path.GetTempPath();
            webHostEnvironmentMock.Setup(env => env.WebRootPath).Returns(webRoot);
            managerLogic = new ManagerLogic(managerRepositoryMock.Object, webHostEnvironmentMock.Object);
        }

        [Test]
        public void AddManagerTest()
        {
            // Arrange
            var manager = new Manager();

            // Act
            managerLogic.AddManager(manager);

            // Assert
            managerRepositoryMock.Verify(m => m.Add(manager), Times.Once);
        }

        [Test]
        public void UploadManagerImageTest()
        {
            // Arrange
            int managerId = 1;
            string imagePath = $"{webRoot}ManagerImages/{managerId}.png";
            var fileMock = new Mock<IFormFile>();
            Directory.CreateDirectory(Path.GetDirectoryName(imagePath));
            File.Create(imagePath).Close();

            // Act & Assert
            var exception = Assert.ThrowsAsync<Exception>(async () => await managerLogic.UploadManagerImage(managerId, fileMock.Object));

            // Assert
            Assert.AreEqual("This manager already has an image.", exception?.Message);
        }

        [Test]
        public void DeleteManagerTest()
        {
            // Arrange
            var managerId = 1;

            // Act
            managerLogic.DeleteManager(managerId);

            // Assert
            managerRepositoryMock.Verify(m => m.Delete(managerId), Times.Once);
        }

        [Test]
        public void DeleteManagerImageTest()
        {
            // Arrange
            int managerId = 1;
            string imagePath = $"{webRoot}ManagerImages/{managerId}.png";

            // Create an existing file
            Directory.CreateDirectory(Path.GetDirectoryName(imagePath));
            File.Create(imagePath).Close();

            // Act
            managerLogic.DeleteManagerImage(managerId);

            // Assert
            Assert.IsFalse(File.Exists(imagePath));
        }

        [Test]
        public void UpdateManagerTest()
        {
            // Arrange
            var managerId = 1;
            var newManager = new Manager();

            // Act
            managerLogic.UpdateManager(managerId, newManager);

            // Assert
            managerRepositoryMock.Verify(m => m.Update(managerId, newManager), Times.Once);
        }

        [Test]
        public void GetOneManagerTest()
        {
            // Arrange
            var managerId = 1;
            var expectedManager = new Manager();
            managerRepositoryMock.Setup(m => m.GetOne(managerId)).Returns(expectedManager);

            // Act
            var result = managerLogic.GetOneManager(managerId);

            // Assert
            managerRepositoryMock.Verify(m => m.GetOne(managerId), Times.Once);
            Assert.AreEqual(expectedManager, result);
        }

        [Test]
        public void GetManagerImageTest()
        {
            // Arrange
            int managerId = 1;
            string imagePath = $"{webRoot}ManagerImages/{managerId}.png";

            // Create an existing file
            Directory.CreateDirectory(Path.GetDirectoryName(imagePath));
            File.Create(imagePath).Close();

            // Act
            var stream = managerLogic.GetManagerImage(managerId);

            // Assert
            Assert.IsNotNull(stream);
            stream.Dispose();
        }

        [Test]
        public void GetAllManagerTest()
        {
            // Arrange
            var managers = new List<Manager>
            {
                new Manager { ManagerName = "Manager C" },
                new Manager { ManagerName = "Manager A" },
                new Manager { ManagerName = "Manager B" }
            };
            managerRepositoryMock.Setup(m => m.GetAll()).Returns(managers.AsQueryable());

            // Act
            var result = managerLogic.GetAllManager();

            // Assert
            managerRepositoryMock.Verify(m => m.GetAll(), Times.Once);
            CollectionAssert.AreEqual(managers.OrderBy(manager => manager.ManagerName).ToList(), result);
        }
    }
}
