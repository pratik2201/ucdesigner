"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemNode = void 0;
const elementEditor_js_1 = require("ucbuilder/global/elementEditor.js");
const keyboard_js_1 = require("ucbuilder/global/hardware/keyboard.js");
const fs_1 = __importDefault(require("fs"));
const itemNode_tpt_designer_js_1 = require("./itemNode.tpt.designer.js");
class itemNode extends itemNode_tpt_designer_js_1.Designer {
    constructor() {
        super(arguments);
        this.editor = new elementEditor_js_1.elementEditor();
        this.keyup_listner = (e) => {
            switch (e.keyCode) {
                case keyboard_js_1.keyBoard.keys.f2:
                    break;
            }
        };
    }
    get lvRecords() { return this.lvUI.Records; }
    init(main) {
        this.main = main;
        this.lvUI = this.main.listview1.lvUI;
        this.main.listview1.ucExtends.self.addEventListener("keydown", (ev) => {
            switch (ev.keyCode) {
                case keyboard_js_1.keyBoard.keys.f2:
                    this.doEditProcess();
                    break;
            }
        });
    }
    get isInEditMode() { return this.editor.isInEditMode; }
    get pathRow() { return this.lvUI.currentRecord; }
    doEditProcess() {
        let crow = this.pathRow;
        let span = crow.relevantElement.querySelector('span[x-name="txt_name"]');
        this.editor.editRow(span, (nval, oval) => {
            if (crow.nodeName != nval) {
                let path = crow.parent.path + "/" + nval;
                if (!fs_1.default.existsSync(path)) {
                    fs_1.default.renameSync(crow.path, path);
                    this.main.manager.openNode(crow.parent);
                    let src = this.main.manager.source.rows;
                    let findex = src.findIndex(s => s.path == path);
                    if (findex != -1) {
                        this.lvUI.currentIndex = findex;
                        this.main.listview1.ll_view.focus();
                    }
                }
            }
        }, oval => {
            console.log('oval');
        }, false);
    }
    editRow() {
    }
    deleteFolderRecursive(path) {
        let _this = this;
        var files = [];
        if (fs_1.default.existsSync(path)) {
            files = fs_1.default.readdirSync(path);
            files.forEach(function (file, index) {
                var curPath = path + "/" + file;
                if (fs_1.default.lstatSync(curPath).isDirectory()) {
                    _this.deleteFolderRecursive(curPath);
                }
                else {
                    fs_1.default.unlinkSync(curPath);
                }
            });
            fs_1.default.rmdirSync(path);
        }
    }
    delete() {
        let _this = this;
        let row = this.lvUI.currentRecord;
        if (fs_1.default.existsSync(row.path)) {
            let finf = fs_1.default.lstatSync(row.path);
            if (finf.isDirectory())
                _this.deleteFolderRecursive(row.path);
            else
                fs_1.default.unlinkSync(row.path);
        }
    }
    addFolder() {
        let row = this.lvUI.currentRecord;
        let parent = (row.type == 'file') ? row.parent : row;
        if (parent != undefined) {
            let fpath = this.getNextFolderName(parent.path);
            fs_1.default.mkdirSync(fpath);
            this.main.manager.openNode(parent);
            let src = this.main.manager.source.rows;
            let findex = src.findIndex(s => s.path == fpath);
            if (findex != -1) {
                this.main.listview1.lvUI.currentIndex = findex;
                this.doEditProcess();
            }
        }
    }
    addFile() {
        let row = this.lvUI.currentRecord;
        let parent = (row.type == 'file') ? row.parent : row;
        if (parent != undefined) {
            let fpath = this.getNextFileName(parent.path);
            fs_1.default.writeFileSync(fpath, "");
            this.main.manager.openNode(parent);
            let src = this.main.manager.source.rows;
            let findex = src.findIndex(s => s.path == fpath);
            if (findex != -1) {
                this.main.listview1.lvUI.currentIndex = findex;
                this.doEditProcess();
            }
        }
    }
    getNextFileName(path) {
        let dirPath = path;
        let count = 1;
        let fpath = `${dirPath}/untitled-file.txt`;
        while (fs_1.default.existsSync(fpath)) {
            fpath = `${dirPath}/untitled-file (${count}).txt`;
            count++;
        }
        return fpath;
    }
    getNextFolderName(path) {
        let dirPath = path;
        let count = 1;
        let fpath = `${dirPath}/New folder`;
        while (fs_1.default.existsSync(fpath)) {
            fpath = `${dirPath}/New folder (${count})`;
            count++;
        }
        return fpath;
    }
}
exports.itemNode = itemNode;
