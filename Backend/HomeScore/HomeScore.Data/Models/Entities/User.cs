using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HomeScore.Data.Models.Entities
{
    public class User : IdentityUser
    {
        public User() : base() { }

        public User(string userName) : base(userName)
        {
            FavouriteClubs = new HashSet<UserClub>();
        }

        public virtual ICollection<UserClub>? FavouriteClubs { get; set; }

        [StringLength(100)]
        public string? FirstName { get; set; }

        [StringLength(100)]
        public string? LastName { get; set; }

        public DateTime CreatedDate { get; set; }
    }
}
