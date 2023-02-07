class CategoriesService {
    parseInfoCategories(categories) {
        let parseString = "";

        categories.forEach((el, index, array) => {
            if(index === array.length - 1) {
                parseString += el.name + " всього: " + el.value + "\n";
                parseString += "Категорію створено: " + el.created_at + "\n";
                parseString += "Категорію оновлено: " + el.updated_at + "\n";
                parseString += "------" + "\n";
            } else {
                parseString += el.name + " всього: " + el.value + "\n";
                parseString += "Категорію створено: " + el.created_at + "\n";
                parseString += "Категорію оновлено: " + el.updated_at + "\n";
                parseString += "------" + "\n";
            }
        });

        return parseString;
    }
    getSumAndNameCategory(command, text) {
        const parseStrToArr = text.replace(command, "").split(" ");

        return { name: parseStrToArr[1], sum: Number(parseStrToArr[2]) }
    }
}

module.exports = { CategoriesService };
