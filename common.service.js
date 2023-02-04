class CommonService {
    getValueFromCommand(command, text) {
        return text.replace(command, "").trim();
    }
    parseInfoCategories(categories) {
        let parseString = "";

        categories.forEach((el, index, array) => {
            if(index === array.length - 1) {
                parseString += el.name + " всього: " + el.value;
            } else {
                parseString += el.name + " всього: " + el.value + "\n";
            }
        });

        return parseString;
    }
    getSumAndNameCategory(command, text) {
        const parseStrToArr = text.replace(command, "").split(" ");

        return { name: parseStrToArr[1], sum: Number(parseStrToArr[2]) }
    }
}

module.exports = { CommonService };
