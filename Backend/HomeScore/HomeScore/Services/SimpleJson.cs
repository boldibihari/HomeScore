using HomeScore.Data.Models.Entities;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HomeScore.Services
{
    static class SimpleJson
    {
        public static async Task<List<IPlayer>> GetOneClubAllPlayer(int clubId)
        {
            HttpClient client = new HttpClient();
            HttpRequestMessage request = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                RequestUri = new Uri("https://divanscore.p.rapidapi.com/teams/get-squad?teamId=" + clubId),
                Headers =
                {
                     { "x-rapidapi-host", "divanscore.p.rapidapi.com" },
                     { "x-rapidapi-key", "f8851bba3dmsh986ba52b8331dcdp1747bcjsn652430e5a0f5" }
                }
            };

            var response = await client.SendAsync(request);
            response.EnsureSuccessStatusCode();
            return PlayerConverter(Simplification(response.Content.ReadAsStringAsync().Result));
        }

        private static List<IPlayer> PlayerConverter(string body)
        {
            return JsonConvert.DeserializeObject<List<IPlayer>>(body);
        }

        private static string Between(string data, string first, string last)
        {
            int pos1 = data.IndexOf(first) + first.Length;
            int pos2 = data.IndexOf(last);
            return data.Substring(pos1, pos2 - pos1);
        }

        private static string Simplification(string body)
        {
            string result = Between(body, "[", "]");

            // },{"player":
            string split = "},{" + '"'.ToString() + "player" + '"' + ':';

            string[] q1 = result.Split(new string[] { split }, StringSplitOptions.None);
            string[] q2 = new string[q1.Length];

            for (int i = 0; i < q1.Length; i++)
            {
                q2[i] = q1[i].Insert(q1[i].Length, ",");
            }

            string text1 = string.Concat(q2).Remove(0, 10);
            string text2 = text1.Remove(text1.Length - 2);
            string text3 = text2.Insert(0, "[");
            return text3.Insert(text3.Length, "]");
        }
    }
}
