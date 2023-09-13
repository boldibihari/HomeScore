using HomeScore.Data.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HomeScore.Services
{
    static class Converter
    {
        public static PlayerPosition ToPlayerPosition(string position)
        {
            switch (position)
            {
                case "G":
                    return PlayerPosition.Goalkeeper;
                case "D":
                    return PlayerPosition.Defender;
                case "M":
                    return PlayerPosition.Midfielder;
                default:
                    return PlayerPosition.Forward;
            }
        }

        public static PreferredFoot ToPreferredFoot(string preferredFoot)
        {
            switch (preferredFoot)
            {
                case "Left":
                    return PreferredFoot.Left;
                case "Right":
                    return PreferredFoot.Right;
                default:
                    return PreferredFoot.Both;
            }
        }

        public static DateTime ToDateTime(double unixTimeStamp)
        {
            DateTime dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            return dtDateTime.AddSeconds(unixTimeStamp).ToLocalTime();
        }
    }
}
