using HomeScore.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HomeScore.Repository.Classes
{
    public abstract class Repository<T> : IRepository<T> where T : class
    {
        protected DbContext context;

        protected Repository(DbContext context)
        {
            this.context = context;
        }

        public void Add(T item)
        {
            context.Set<T>().Add(item);
            context.SaveChanges();
        }

        public void Delete(T item)
        {
            context.Set<T>().Remove(item);
            context.SaveChanges();
        }

        public void Delete(int id)
        {
            context.Set<T>().Remove(GetOne(id));
            context.SaveChanges();
        }

        public abstract void Update(int id, T newItem);

        public abstract T GetOne(int id);

        public IQueryable<T> GetAll()
        {
            return context.Set<T>();
        }
    }
}
