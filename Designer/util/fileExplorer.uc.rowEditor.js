"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rowEditor = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const keyboard_1 = require("ucbuilder/global/hardware/keyboard");
class rowEditor {
    constructor() {
        this.lastEditedIndex = -1;
    }
    init(main) {
        this.main = main;
        this.main.listview1.ucExtends.self.on('keydown', (event) => {
            switch (event.keyCode) {
                case keyboard_1.keyBoard.keys.f2:
                    this.editRow();
                    event.preventDefault();
                    break;
                case keyboard_1.keyBoard.keys.escape:
                    this.excape();
                    event.preventDefault();
                    break;
            }
        });
        this.main.listview1.ucExtends.self.on('keyup', (event) => {
            if (event.keyCode == keyboard_1.keyBoard.keys.enter) {
                if (this.lastEditedIndex != -1) {
                    this.saveRow(this.lastEditedIndex);
                    event.preventDefault();
                }
            }
        });
        this.main.listview1.Events.currentItemIndexChange.on((oldindex, newIndx) => {
            if (this.lastEditedIndex == -1)
                return;
            if (this.lastEditedIndex != newIndx) {
                this.saveRow(this.lastEditedIndex);
            }
        });
    }
    saveRow(index) {
        if (index == -1)
            return;
        let row = this.main.listview1.source.rows[index];
        let nval = this.main.ucExtends.designer.getAllControls(["txt_name"]).txt_name;
        let newFileName = nval.innerText;
        if (newFileName != row.nodeName) {
            let newFilePath = path_1.default.dirname(row.path) + "/" + newFileName;
            fs_1.default.renameSync(row.path, newFilePath);
            console.log('renamed..');
        }
        this.main.manager.openNode(row.parent);
        this.lastEditedIndex = -1;
        this.main.listview1.lvUI.currentIndex = this.main.listview1.lvUI.currentIndex;
        this.main.listview1.ucExtends.self.focus();
    }
    editRow() {
        if (this.lastEditedIndex != -1) {
            this.excape();
        }
        let index = this.main.listview1.lvUI.currentIndex;
        let row = this.main.listview1.source.rows[index];
        this.lastEditedIndex = index;
        let txt_name = this.main.ucExtends.designer.getAllControls(["txt_name"]).txt_name;
        txt_name.setAttribute("contenteditable", "true");
        txt_name.focus();
        this.selectText(txt_name);
    }
    getNextFileName(path) {
        let dirPath = path;
        let count = 1;
        let fpath = `${dirPath}/untitled-file`;
        while (fs_1.default.existsSync(fpath)) {
            fpath = `${dirPath}/untitled-file (${count})`;
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
    addFolder() {
        let row = this.main.listview1.lvUI.currentRecord;
        let parent = (row.type == 'file') ? row.parent : row;
        if (parent != undefined) {
            let fpath = this.getNextFolderName(parent.path);
            fs_1.default.mkdirSync(fpath);
            this.main.manager.openNode(parent);
            let findex = parent.children.findIndex(s => s.path == fpath);
            if (findex != -1) {
                let pRec = parent.children[findex];
                //this.main.listview1.lvUI.currentIndex = pRec.sourceindex;
                this.editRow();
            }
        }
    }
    addFile() {
        let row = this.main.listview1.lvUI.currentRecord;
        let parent = (row.type == 'file') ? row.parent : row;
        if (parent != undefined) {
            let fpath = this.getNextFileName(parent.path);
            fs_1.default.writeFileSync(fpath, "");
            this.main.manager.openNode(parent);
            let findex = parent.children.findIndex(s => s.path == fpath);
            if (findex != -1) {
                let pRec = parent.children[findex];
                //this.main.listview1.lvUI.currentIndex = pRec.sourceindex;
                this.editRow();
            }
        }
    }
    excape() {
        if (this.lastEditedIndex != -1) {
            this.main.listview1.source.rows[this.lastEditedIndex].viewType = 'viewNode';
            this.main.listview1.lvUI.nodes.update(this.lastEditedIndex);
            this.main.listview1.ucExtends.wrapperHT.focus();
            this.lastEditedIndex = -1;
        }
    }
    selectText(ele) {
        const node = ele;
        if (window.getSelection) {
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(node);
            selection.removeAllRanges();
            selection.addRange(range);
        } /*else if (document.body.createTextRange) {
            const range = document.body.createTextRange();
            range.moveToElementText(node);
            range.select();
        } */
        else {
            console.warn("Could not select text in node: Unsupported browser.");
        }
    }
}
exports.rowEditor = rowEditor;
