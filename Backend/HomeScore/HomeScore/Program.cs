// See https://aka.ms/new-console-template for more information
using HomeScore.Data.Database;
using HomeScore.Services;

DatabaseContext database = new DatabaseContext();

await Factory.FillDatabase(database);
