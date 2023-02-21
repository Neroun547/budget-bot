const Moment = require("moment");

class CategoriesServiceDb {
    constructor(connect) {
        this.connect = connect;
    }
    async addCategory(category, userId) {
        const sameCategory = await this.getCategoryByNameAndUserId(category.name, userId);

        if(sameCategory) {
            throw new Error(JSON.stringify({ message: "Така категорія вже існує !" }));
        }
        await this.connect.execute(
            "INSERT INTO categories (name, value, created_at, updated_at, user_id) VALUES (?, ?, ?, ?, ?)",
            [category.name, category.value, new Moment().format("YYYY-MM-DD"), new Moment().format("YYYY-MM-DD"), userId]
        );
    }
    async removeCategoryByNameAndUserId(name, userId) {
        const category = await this.getCategoryByNameAndUserId(name, userId);

        if(!category) {
            throw new Error(JSON.stringify({ message: "Категорія не знайдена" }));
        }
        await this.connect.execute("DELETE FROM categories WHERE name = ? AND user_id = ? ", [name, userId]);
    }
    async clearCategoryByNameAndUserId(name, userId) {
        const category = await this.getCategoryByNameAndUserId(name, userId);

        if(!category) {
            throw new Error(JSON.stringify({ message: "Категорія не знайдена" }));
        }
        await this.connect.execute("UPDATE categories SET value = ?, updated_at = ? WHERE name = ? AND user_id = ?", [0, new Moment().format("YYYY-MM-DD"), name, userId])
    }
    async addSumToCategoryByNameAndUserIdAndReturn(sum, name, userId) {
        const category = await this.getCategoryByNameAndUserId(name, userId);

        if(!category) {
            throw new Error(JSON.stringify({ message: "Категорія не знайдена" }));
        }
        category.value += sum;

        await this.connect.execute("UPDATE categories SET value = ?, updated_at = ? WHERE name = ? AND user_id = ?", [Number(category.value), new Moment().format("YYYY-MM-DD"), name, userId]);

        return category;
    }
    async deleteSumFromCategoryByNameAndUserIdAndReturn(sum, name, userId) {
        const category = await this.getCategoryByNameAndUserId(name, userId);

        if(!category) {
            throw new Error(JSON.stringify({ message: "Категорія не знайдена" }));
        }
        category.value -= sum;

        await this.connect.execute("UPDATE categories SET value = ?, updated_at = ? WHERE name = ? AND user_id = ?", [category.value, new Moment().format("YYYY-MM-DD"), name, userId]);

        return category;
    }
    async getCategoryByNameAndUserId(name, userId) {
        return (await this.connect.execute("SELECT * FROM categories WHERE name = ? AND user_id = ?", [name, userId]))[0][0];
    }
    async getAllCategoriesByUserId(userId) {
        return (await this.connect.execute("SELECT * FROM categories WHERE user_id = ?", [userId]))[0];
    }
    async deleteAllCategories(userId) {
        await this.connect.execute("DELETE FROM categories WHERE user_id = ?", [userId]);
    }
}

module.exports = { CategoriesServiceDb };
