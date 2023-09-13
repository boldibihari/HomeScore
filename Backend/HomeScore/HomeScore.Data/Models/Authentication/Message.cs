using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HomeScore.Data.Models.Authentication
{
    public class Message
    {
        public string To { get; set; }

        public string Name { get; set; }

        public string Subject { get; set; }

        public string Content { get; set; }

        public Message(string to, string name, string subject, string content)
        {
            To = to;
            Name = name;
            Subject = subject;
            Content = content;
        }
    }
}
