class CommonService {
    getValueFromCommand(command, text) {
        return text.replace(command, "").trim();
    }
}

module.exports = { CommonService };
