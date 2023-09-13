using HomeScore.Data.Models.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HomeScore.Data.Database
{
    public class DatabaseContext : IdentityDbContext<User>
    {
        public DbSet<Club> Clubs { get; set; }

        public DbSet<Manager> Managers { get; set; }

        public DbSet<Player> Players { get; set; }

        public DbSet<Stadium> Stadiums { get; set; }

        public DbSet<UserClub> UserClub { get; set; }

        public DatabaseContext()
        {
            Database.EnsureCreated();
        }

        public DatabaseContext(DbContextOptions<DatabaseContext> opt)
            : base(opt)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.
                    UseLazyLoadingProxies().
                     UseSqlServer(@"Data Source=(localdb)\MSSQLLocalDB;Initial Catalog=HomeScore;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False;MultipleActiveResultSets=true");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            IdentityRole admin = new()
            {
                Id = "341743f0-asd2–42de-afbf-59kmkkmk72cf6",
                Name = "Admin",
                NormalizedName = "ADMIN"
            };
            IdentityRole user = new()
            {
                Id = "3341743f0-dee2–42de-bbbb-59kmkkmk72cf6",
                Name = "User",
                NormalizedName = "USER"
            };

            modelBuilder.Entity<IdentityRole>().HasData(admin, user);

            User homeScoreAdmin = new()
            {
                Id = "e2174cf0-9999-4cfe-afbf-59f706d72cf6",
                Email = "homescore.hu@gmail.com",
                NormalizedEmail = "HOMESCORE.HU@GMAIL.COM",
                EmailConfirmed = true,
                UserName = "homescore",
                NormalizedUserName = "HOMESCORE",
                SecurityStamp = string.Empty,
                FirstName = "Boldi",
                LastName = "Bihari",
                FavouriteClubs = null,
                CreatedDate = new DateTime(2023, 02, 25)
            };
            User andris = new()
            {
                Id = "e2174cf0-9412-4cfe-afbf-59f706d72cf7",
                Email = "kovacs.andras@nik.uni-obuda.hu",
                NormalizedEmail = "KOVACS.ANDRAS@NIK.UNI-OBUDA.HU",
                EmailConfirmed = true,
                UserName = "kovacs.andras",
                NormalizedUserName = "KOVACS.ANDRAS",
                SecurityStamp = string.Empty,
                FirstName = "András",
                LastName = "Kovács",
                FavouriteClubs = null,
                CreatedDate = new DateTime(2023, 03, 28)
            };

            homeScoreAdmin.PasswordHash = new PasswordHasher<User>().HashPassword(null, "admin");
            andris.PasswordHash = new PasswordHasher<User>().HashPassword(null, "andris");

            modelBuilder.Entity<User>().HasData(homeScoreAdmin);
            modelBuilder.Entity<User>().HasData(andris);

            // Admin
            modelBuilder.Entity<IdentityUserRole<string>>().HasData(new IdentityUserRole<string>
            {
                RoleId = admin.Id,
                UserId = homeScoreAdmin.Id
            });

            // User
            modelBuilder.Entity<IdentityUserRole<string>>().HasData(new IdentityUserRole<string>
            {
                RoleId = user.Id,
                UserId = homeScoreAdmin.Id
            });
            modelBuilder.Entity<IdentityUserRole<string>>().HasData(new IdentityUserRole<string>
            {
                RoleId = user.Id,
                UserId = andris.Id
            });

            modelBuilder.Entity<Player>(entity =>
            {
                entity
                .HasOne(player => player.Club)
                .WithMany(club => club.Players)
                .HasForeignKey(player => player.ClubId);
            });

            modelBuilder.Entity<Manager>(entity =>
            {
                entity
                .HasOne(manager => manager.Club)
                .WithOne(club => club.Manager)
                .HasForeignKey<Manager>(manager => manager.ClubId);
            });

            modelBuilder.Entity<Stadium>(entity =>
            {
                entity
                .HasOne(stadium => stadium.Club)
                .WithOne(club => club.Stadium)
                .HasForeignKey<Stadium>(stadium => stadium.ClubId);
            });

            modelBuilder.Entity<UserClub>(entity =>
            {
                entity
                .HasKey(userClub => new { userClub.UserId, userClub.ClubId });
            });

            modelBuilder.Entity<UserClub>(entity =>
            {
                entity
                .HasOne(userClub => userClub.User)
                .WithMany(user => user.FavouriteClubs)
                .HasForeignKey(userClub => userClub.UserId);
            });

            modelBuilder.Entity<UserClub>(entity =>
            {
                entity
                .HasOne(userClub => userClub.Club)
                .WithMany(club => club.Users)
                .HasForeignKey(userClub => userClub.ClubId);
            });

            #region FillDatabase

            UserClub uc1 = new()
            {
                UserClubId = 1,
                UserId = "e2174cf0-9999-4cfe-afbf-59f706d72cf6",
                ClubId = 1925
            };
            UserClub uc2 = new()
            {
                UserClubId = 2,
                UserId = "e2174cf0-9999-4cfe-afbf-59f706d72cf6",
                ClubId = 1926
            };
            UserClub uc3 = new()
            {
                UserClubId = 3,
                UserId = "e2174cf0-9412-4cfe-afbf-59f706d72cf7",
                ClubId = 25596
            };
            UserClub uc4 = new()
            {
                UserClubId = 4,
                UserId = "e2174cf0-9412-4cfe-afbf-59f706d72cf7",
                ClubId = 25608
            };

            Club c1 = new()
            {
                ClubId = 1925,
                ClubName = "Ferencvárosi TC",
                ClubCity = "Budapest",
                ClubColour = "green-white",
                ClubFounded = 1899,
                ClubRating = 5
            };
            Club c2 = new()
            {
                ClubId = 1926,
                ClubName = "MOL Fehérvár FC",
                ClubCity = "Székesfehérvár",
                ClubColour = "red-blue",
                ClubFounded = 1914,
                ClubRating = 4
            };
            Club c3 = new()
            {
                ClubId = 25596,
                ClubName = "Puskás Akadémia FC",
                ClubCity = "Felcsút",
                ClubColour = "blue-yellow",
                ClubFounded = 2012,
                ClubRating = 4
            };
            Club c4 = new()
            {
                ClubId = 25608,
                ClubName = "Mezőkövesd Zsóry FC",
                ClubCity = "Mezőkövesd",
                ClubColour = "blue-yellow",
                ClubFounded = 1975,
                ClubRating = 3
            };
            Club c5 = new()
            {
                ClubId = 1916,
                ClubName = "Budapest Honvéd FC",
                ClubCity = "Budapest",
                ClubColour = "red-black",
                ClubFounded = 1909,
                ClubRating = 3
            };
            Club c6 = new()
            {
                ClubId = 1924,
                ClubName = "Újpest FC",
                ClubCity = "Budapest",
                ClubColour = "purple-white",
                ClubFounded = 1885,
                ClubRating = 3
            };
            Club c7 = new()
            {
                ClubId = 1921,
                ClubName = "Debreceni VSC",
                ClubCity = "Debrecen",
                ClubColour = "red-white",
                ClubFounded = 1902,
                ClubRating = 4
            };
            Club c8 = new()
            {
                ClubId = 6059,
                ClubName = "Paksi FC",
                ClubCity = "Paks",
                ClubColour = "green-white",
                ClubFounded = 1952,
                ClubRating = 4
            };
            Club c9 = new()
            {
                ClubId = 25397,
                ClubName = "Kisvárda FC",
                ClubCity = "Kisvárda",
                ClubColour = "red-white",
                ClubFounded = 1911,
                ClubRating = 3
            };
            Club c10 = new()
            {
                ClubId = 1922,
                ClubName = "Zalaegerszegi TE FC",
                ClubCity = "Zalaegerszeg",
                ClubColour = "blue-white",
                ClubFounded = 1920,
                ClubRating = 3
            };
            Club c11 = new()
            {
                ClubId = 1919,
                ClubName = "Vasas FC",
                ClubCity = "Budapest",
                ClubColour = "red-blue",
                ClubFounded = 1911,
                ClubRating = 2
            };
            Club c12 = new()
            {
                ClubId = 23956,
                ClubName = "Kecskeméti TE",
                ClubCity = "Kecskemét",
                ClubColour = "purple-white",
                ClubFounded = 1911,
                ClubRating = 3
            };

            Manager m1 = new()
            {
                ManagerId = 53308,
                ManagerName = "Stanislav Cherchesov",
                CountryCode = "ru",
                ManagerCountry = "Russia",
                ManagerBirthdate = new DateTime(1963, 09, 02),
                ManagerStartYear = 2021,
                PreferredFormation = "4-2-3-1",
                WonChampionship = false,
                ClubId = c1.ClubId
            };
            Manager m2 = new()
            {
                ManagerId = 796020,
                ManagerName = "Szabolcs Huszti",
                CountryCode = "hu",
                ManagerCountry = "Hungary",
                ManagerBirthdate = new DateTime(1983, 04, 18),
                ManagerStartYear = 2022,
                PreferredFormation = "4-2-3-1",
                WonChampionship = false,
                ClubId = c2.ClubId,
            };
            Manager m3 = new()
            {
                ManagerId = 23741,
                ManagerName = "Zsolt Hornyák",
                CountryCode = "sk",
                ManagerCountry = "Slovakia",
                ManagerBirthdate = new DateTime(1973, 05, 01),
                ManagerStartYear = 2019,
                PreferredFormation = "4-2-3-1",
                WonChampionship = false,
                ClubId = c3.ClubId
            };
            Manager m4 = new()
            {
                ManagerId = 784840,
                ManagerName = "Attila Kuttor",
                CountryCode = "hu",
                ManagerCountry = "Hungary",
                ManagerBirthdate = new DateTime(1970, 05, 29),
                ManagerStartYear = 2022,
                PreferredFormation = "4-2-3-1",
                WonChampionship = false,
                ClubId = c4.ClubId
            };
            Manager m5 = new()
            {
                ManagerId = 790035,
                ManagerName = "Dean Klafuric",
                CountryCode = "hr",
                ManagerCountry = "Croatia",
                ManagerBirthdate = new DateTime(1972, 07, 26),
                ManagerStartYear = 2022,
                PreferredFormation = "4-2-3-1",
                WonChampionship = false,
                ClubId = c5.ClubId
            };
            Manager m6 = new()
            {
                ManagerId = 788807,
                ManagerName = "Milos Kruscic",
                CountryCode = "rs",
                ManagerCountry = "Serbia",
                ManagerBirthdate = new DateTime(1976, 10, 03),
                ManagerStartYear = 2021,
                PreferredFormation = "4-2-3-1",
                WonChampionship = false,
                ClubId = c6.ClubId
            };
            Manager m7 = new()
            {
                ManagerId = 785542,
                ManagerName = "Srdan Blagojevic",
                CountryCode = "rs",
                ManagerCountry = "Serbia",
                ManagerBirthdate = new DateTime(1973, 06, 06),
                ManagerStartYear = 2022,
                PreferredFormation = "4-3-3",
                WonChampionship = false,
                ClubId = c7.ClubId
            };
            Manager m8 = new()
            {
                ManagerId = 790483,
                ManagerName = "Róbert Waltner",
                CountryCode = "hu",
                ManagerCountry = "Hungary",
                ManagerBirthdate = new DateTime(1977, 09, 20),
                ManagerStartYear = 2021,
                PreferredFormation = "4-2-3-1",
                WonChampionship = false,
                ClubId = c8.ClubId
            };
            Manager m9 = new()
            {
                ManagerId = 798717,
                ManagerName = "László Török",
                CountryCode = "hu",
                ManagerCountry = "Hungary",
                ManagerBirthdate = new DateTime(1969, 12, 25),
                ManagerStartYear = 2022,
                PreferredFormation = "4-2-3-1",
                WonChampionship = false,
                ClubId = c9.ClubId
            };
            Manager m10 = new()
            {
                ManagerId = 784967,
                ManagerName = "Ricardo Moniz",
                CountryCode = "nl",
                ManagerCountry = "Netherlands",
                ManagerBirthdate = new DateTime(1964, 06, 17),
                ManagerStartYear = 2022,
                PreferredFormation = "4-3-3",
                WonChampionship = false,
                ClubId = c10.ClubId
            };
            Manager m11 = new()
            {
                ManagerId = 74781,
                ManagerName = "Elemér Kondás",
                CountryCode = "hu",
                ManagerCountry = "Hungary",
                ManagerBirthdate = new DateTime(1963, 09, 11),
                ManagerStartYear = 2022,
                PreferredFormation = "3-5-2",
                WonChampionship = false,
                ClubId = c11.ClubId
            };
            Manager m12 = new()
            {
                ManagerId = 792597,
                ManagerName = "István Szabó",
                CountryCode = "hu",
                ManagerCountry = "Hungary",
                ManagerBirthdate = new DateTime(1967, 01, 17),
                ManagerStartYear = 2021,
                PreferredFormation = "5-3-2",
                WonChampionship = false,
                ClubId = c12.ClubId
            };

            Stadium s1 = new()
            {
                StadiumId = 1,
                StadiumName = "Groupama Aréna",
                Completed = 2014,
                Capacity = 22000,
                Location = "Budapest, Üllői út 129, 1091",
                ClubId = c1.ClubId
            };
            Stadium s2 = new()
            {
                StadiumId = 2,
                StadiumName = "MOL Aréna Sóstó",
                Completed = 2018,
                Capacity = 14201,
                Location = "Székesfehérvár, Csikvári út 10, 8000",
                ClubId = c2.ClubId
            };
            Stadium s3 = new()
            {
                StadiumId = 3,
                StadiumName = "Pancho Aréna",
                Completed = 2014,
                Capacity = 3500,
                Location = "Felcsút, Fő út 176, 8086",
                ClubId = c3.ClubId
            };
            Stadium s4 = new()
            {
                StadiumId = 4,
                StadiumName = "Mezőkövesdi Stadion",
                Completed = 2016,
                Capacity = 5020,
                Location = "Mezőkövesd, Széchenyi István út 56, 3400",
                ClubId = c4.ClubId
            };
            Stadium s5 = new()
            {
                StadiumId = 5,
                StadiumName = "Bozsik Aréna",
                Completed = 2021,
                Capacity = 8200,
                Location = "Budapest, Puskás Ferenc út 1-3, 1194",
                ClubId = c5.ClubId
            };
            Stadium s6 = new()
            {
                StadiumId = 6,
                StadiumName = "Szusza Ferenc Stadion",
                Completed = 1922,
                Capacity = 13501,
                Location = "Budapest, Megyeri út 13, 1044",
                ClubId = c6.ClubId
            };
            Stadium s7 = new()
            {
                StadiumId = 7,
                StadiumName = "Nagyerdei Stadion",
                Completed = 2014,
                Capacity = 20340,
                Location = "Debrecen, Nagyerdei körút 12, 4032",
                ClubId = c7.ClubId
            };
            Stadium s8 = new()
            {
                StadiumId = 8,
                StadiumName = "Fehérvári úti Stadon",
                Completed = 1966,
                Capacity = 4500,
                Location = " Paks, Fehérvári út 29, 7030",
                ClubId = c8.ClubId
            };
            Stadium s9 = new()
            {
                StadiumId = 9,
                StadiumName = "Várkerti Stadion",
                Completed = 2018,
                Capacity = 3000,
                Location = "Kisvárda, Városmajor út, 4600",
                ClubId = c9.ClubId
            };
            Stadium s10 = new()
            {
                StadiumId = 10,
                StadiumName = "ZTE-Aréna",
                Completed = 2002,
                Capacity = 11200,
                Location = "Zalaegerszeg, Október 6. tér 16, 8900",
                ClubId = c10.ClubId
            };
            Stadium s11 = new()
            {
                StadiumId = 11,
                StadiumName = "Új Illovszky Rudolf Stadion",
                Completed = 1961,
                Capacity = 5054,
                Location = "Budapest, Fáy utca 58, 1139",
                ClubId = c11.ClubId
            };
            Stadium s12 = new()
            {
                StadiumId = 12,
                StadiumName = "Széktói Stadion",
                Completed = 1962,
                Capacity = 6300,
                Location = "Kecskemét, 6000",
                ClubId = c12.ClubId
            };

            modelBuilder.Entity<Club>().HasData(c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12);
            modelBuilder.Entity<Manager>().HasData(m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12);
            modelBuilder.Entity<Stadium>().HasData(s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12);
            modelBuilder.Entity<UserClub>().HasData(uc1, uc2, uc3, uc4);
            #endregion
        }
    }
}
