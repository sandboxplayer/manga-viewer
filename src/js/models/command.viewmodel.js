export default class Command {
    constructor(hotkey, execute) {
        this.hotkey = hotkey;
        this.execute = execute;
    }
}

export const DefaultCommandHotkeys = {
    BOOKMARK_FOLDER: "CTRL + D",
    NEXT_PAGE: "RIGHT ARROW",
    PREVIOUS_PAGE: "LEFT ARROW"
}