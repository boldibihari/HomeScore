using HomeScore.Data.Models.Entities;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HomeScore.Logic.Interfaces
{
    public interface IStadiumLogic
    {
        void AddStadium(Stadium stadium);

        Task UploadStadiumImage(int stadiumId, IFormFile file);

        void DeleteStadium(int stadiumId);

        void DeleteStadiumImage(int stadiumId);

        void UpdateStadium(int stadiumId, Stadium newStadium);

        Stadium GetOneStadium(int stadiumId);

        FileStream GetStadiumImage(int stadiumId);

        IList<Stadium> GetAllStadium();
    }
}
