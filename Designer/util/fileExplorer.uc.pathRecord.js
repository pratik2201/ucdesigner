const { pathInfo } = require("@ucbuilder:/build/common");
const { existsSync } = require("original-fs");

class pathRecord {
    iconFilePath = "";
    nodeName = "";
    path = "";
    level = 0;
    get leftSpace() { return this.level * 10; }
    sort = 0;
    /** @type {pathInfo.TYPE} */
    type = pathInfo.TYPE.directory;

    isFolder = true;

    /** @type {boolean} */
    isOpened = false;
    /** @type {pathRecord[]} */
    children = [];
    /** @type {pathRecord} */
    parent = undefined;


    /** @type {HTMLElement} */
    relevantElement = undefined;

    get exists() {
        return existsSync(this.path);
    }
}
module.exports = {    

    pathRecord
};