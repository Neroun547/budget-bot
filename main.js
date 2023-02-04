require('dotenv').config()

const { Telegraf } = require("telegraf");
const { CommonService } = require("./common.service");

const { connection } = require("./db/connect");
const { CategoriesServiceDb } = require("./db/categories/categories.service");

const categoriesServiceDb = new CategoriesServiceDb(connection);
const commonService = new CommonService();
const bot = new Telegraf(process.env.token);

bot.command("start", (ctx) => {
   ctx.reply("Привіт, це телеграм бот для планування свого бюджету. Введіть команду /help для отримання додаткової інформації");
});

bot.command("help", (ctx) => {
   ctx.reply(`Список команд:
    /add_category назва категорії - додати категорію
    /remove_category назва категорії - видалити категорію  
    /clear_category назва категорії - очищення категорії
    /delete_sum_category назва категорії сума - видалення суми з категорії
    /add_sum_category назва категорії сума - додати суму до категорії (писати через один пробіл)
    /get_category назва категорії - інформація про категорію
    /get_categories - отримати всі категорії
    /remove_all_categories - видалення всіх категорій
   `);
});

bot.command("clear_category", async (ctx) => {
   const userId = ctx.update.message.from.id;
   const categoryName = commonService.getValueFromCommand("/clear_category", ctx.message.text);

   try {
      await categoriesServiceDb.clearCategoryByNameAndUserId(categoryName, userId);

      ctx.reply(`Категорія ${categoryName} успішно очищена`);
   } catch(error) {
      ctx.reply(JSON.parse(error.message).message);
   }
});

bot.command("get_category", async (ctx) => {
   const userId = ctx.update.message.from.id;
   const categoryName = commonService.getValueFromCommand("/get_category", ctx.message.text);

   if(!categoryName) {
      ctx.reply("Категорію не знайдено");

      return;
   }
   const category = await categoriesServiceDb.getCategoryByNameAndUserId(categoryName, userId);

   if(!category) {
      ctx.reply("Категорію не знайдено");

      return;
   }
   ctx.reply(commonService.parseInfoCategories([category]));
});

bot.command("add_sum_category", async (ctx) => {
   const userId = ctx.update.message.from.id;
   const { name, sum } = commonService.getSumAndNameCategory("/add_sum_category", ctx.message.text);

   if(!name) {
      ctx.reply("Категорію не знайдено");

      return;
   }
   if(typeof sum !== "number" || isNaN(sum)) {
      ctx.reply("Сума не вказана або вказана не вірно");

      return;
   }
   try {
      const category = await categoriesServiceDb.addSumToCategoryByNameAndUserIdAndReturn(sum, name, userId);

      ctx.reply(`Сума успішно додана до категорії ${category.name}. Всього витрат в цій категорії: ${category.value}`);
   } catch(error) {
      ctx.reply(JSON.parse(error.message).message);
   }
});

bot.command("delete_sum_category", async (ctx) => {
   const userId = ctx.update.message.from.id;
   const { name, sum } = commonService.getSumAndNameCategory("/delete_sum_category", ctx.message.text);

   if(!name) {
      ctx.reply("Категорію не знайдено");

      return;
   }
   if(typeof sum !== "number" || isNaN(sum)) {
      ctx.reply("Сума не вказана або вказана не вірно");

      return;
   }
   try {
      const category = await categoriesServiceDb.deleteSumFromCategoryByNameAndUserIdAndReturn(sum, name, userId);

      ctx.reply(`Сума успішно видалени з категорії ${category.name}. Всього витрат в цій категорії: ${category.value}`);
   } catch(error) {
      ctx.reply(JSON.parse(error.message).message);
   }
});

bot.command("remove_category", async (ctx) => {
   const userId = ctx.update.message.from.id;
   const categoryName = commonService.getValueFromCommand("/remove_category", ctx.message.text);

   if(!categoryName) {
      ctx.reply("Категорію не знайдено");

      return;
   }
   try {
      await categoriesServiceDb.removeCategoryByNameAndUserId(categoryName, userId);

      ctx.reply(`Категорія ${categoryName} успішно виделана`);
   } catch(error) {
      ctx.reply(JSON.parse(error.message).message);
   }
});

bot.command("add_category", async (ctx) => {
   const nameCategory = commonService.getValueFromCommand("/add_category", ctx.message.text);

   if(!nameCategory.length) {
      ctx.reply("Введіть назву категорії");

      return;
   }
   const userId = ctx.update.message.from.id;
   const category = {
      name: nameCategory,
      value: 0
   }
   try {
      await categoriesServiceDb.addCategory(category, userId);

      ctx.reply(`Нова категорія ${nameCategory} успішно створена`);
   } catch(error) {
      ctx.reply(JSON.parse(error.message).message);
   }
});

bot.command("get_categories", async (ctx) => {
   const userId = ctx.update.message.from.id;
   const categories = await categoriesServiceDb.getAllCategoriesByUserId(userId);

   if(!categories.length) {
      ctx.reply("У вас немає категорій");

      return;
   }
   ctx.reply(commonService.parseInfoCategories(categories));
});

bot.command("get_categories", async (ctx) => {
   const userId = ctx.update.message.from.id;
   const categories = await categoriesServiceDb.getCategoryByNameAndUserId(userId);

   if(!categories.length) {
      ctx.reply("У вас немає категорій");

      return;
   }
   ctx.reply(commonService.parseInfoCategories(categories));
});

bot.command("remove_all_categories", async (ctx) => {
   const userId = ctx.update.message.from.id;
   await categoriesServiceDb.deleteAllCategories(userId);

   ctx.reply("Всі категорії видалено");
});

bot.launch();

