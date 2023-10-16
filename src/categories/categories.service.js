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
        const reverseString = text.replace(command, "").trim().split("").reverse().join("").trim();
        let numStr = "";

        for(let i = 0; i < reverseString.length; i++) {
            if(reverseString[i] !== " ") {
                numStr += reverseString[i];
            } else {
                break;
            }
        }
        let num = Number(numStr.split("").reverse().join(""));

        return { sum: num, name: reverseString.split("").reverse().join("").trim().replace(numStr.split("").reverse().join(""), "").trim() }
    }
}

module.exports = { CategoriesService };
