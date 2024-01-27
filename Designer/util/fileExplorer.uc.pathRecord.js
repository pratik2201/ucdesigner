"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathRecord = void 0;
const fs_1 = require("fs");
class pathRecord {
    constructor() {
        this.iconFilePath = "";
        this.nodeName = "";
        this.path = "";
        this.level = 0;
        this.sort = 0;
        this.type = 'directory';
        this.isFolder = true;
        this.isOpened = false;
        this.children = [];
        this.parent = undefined;
        this.viewType = 'viewNode';
        this.relevantElement = undefined;
    }
    get leftSpace() { return this.level * 10; }
    get exists() {
        return (0, fs_1.existsSync)(this.path);
    }
}
exports.pathRecord = pathRecord;
