const fileExplorer = require('@ucdesigner:/Designer/util/fileExplorer.uc.js');
const { pathRecord } = require('@ucdesigner:/Designer/util/fileExplorer.uc.pathRecord');
const {  pathInfo } = require('@ucbuilder:/build/common.js');
const { elementEditor } = require('@ucbuilder:/appBuilder/Window/codeFile/elementEditor.js');
const { keyBoard } = require('@ucbuilder:/global/hardware/keyboard.js');
const fs = require('fs');
const { designer } = require('./itemNode.tpt.designer.js');
class itemNode extends designer {
    editor = new elementEditor();

    /** @type {fileExplorer}  */
    main = undefined;
    /** @param {fileExplorer} main */
    init(main) {
        this.main = main;
        this.records = this.main.listview1.lvUI;
        this.main.listview1.ucExtends.self.addEventListener("keydown", (ev) => {
            switch (ev.keyCode) {
                case keyBoard.keys.f2:
                    this.doEditProcess();
                    break;
            }
        });
    }
    constructor() {
        super(arguments);
    }
    /** @param {KeyboardEvent} e */
    keyup_listner = (e) => {
        switch (e.keyCode) {
            case keyBoard.keys.f2:
                break;
        }
    }
    get isInEditMode() { return this.editor.isInEditMode; }
    /** @type {pathRecord}  */
    get pathRow() { return this.records.currentRecord; }

    doEditProcess() {
        let crow = this.pathRow;
        let span = crow.relevantElement.querySelector('span[x-name="txt_name"]');
        this.editor.editRow(span, (nval, oval) => {
            if (crow.nodeName != nval) {
                let path = crow.parent.path + "/" + nval;
                if (!fs.existsSync(path)) {
                    fs.renameSync(crow.path, path);
                    this.main.manager.openNode(crow.parent);
                    /** @type {pathRecord[]}  */
                    let src = this.main.manager.source.rows;
                    let findex = src.findIndex(s => s.path == path);
                    if (findex != -1) {
                        this.records.currentIndex = findex;
                        this.main.listview1.listvw1.focus();
                    }
                }
            }
        }, oval => {
            console.log('oval');
        }, false);
    }
    editRow() {

    }
    get isInEditMode() { return this.editor.isInEditMode; }

    deleteFolderRecursive(path) {
        let _this = this;
        var files = [];
        if (fs.existsSync(path)) {
            files = fs.readdirSync(path);
            files.forEach(function (file, index) {
                var curPath = path + "/" + file;
                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                    _this.deleteFolderRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    }
    delete() {
        let _this = this;
        /** @type {pathRecord}  */
        let row = this.records.currentRecord;
        if (fs.existsSync(row.path)) {
            let finf = fs.lstatSync(row.path);
            if (finf.isDirectory())
                _this.deleteFolderRecursive(row.path);
            else
                fs.unlinkSync(row.path);
        }
    }
    addFolder() {
        /** @type {pathRecord}  */
        let row = this.records.currentRecord;
        /** @type {pathRecord}  */
        let parent = (row.type == pathInfo.TYPE.file) ? row.parent : row;
        if (parent != undefined) {
            let fpath = this.getNextFolderName(parent.path);
            fs.mkdirSync(fpath);
            this.main.manager.openNode(parent);
            /** @type {pathRecord[]}  */
            let src = this.main.manager.source.rows;
            let findex = src.findIndex(s => s.path == fpath);
            if (findex != -1) {
                this.main.listview1.lvUI.currentIndex = findex;
                this.doEditProcess();
            }
        }
    }
    addFile() {
        /** @type {pathRecord}  */
        let row = this.records.currentRecord;
        /** @type {pathRecord}  */
        let parent = (row.type == pathInfo.TYPE.file) ? row.parent : row;
        if (parent != undefined) {
            let fpath = this.getNextFileName(parent.path);
            fs.writeFileSync(fpath, "");
            this.main.manager.openNode(parent);
            /** @type {pathRecord[]}  */
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
        while (fs.existsSync(fpath)) {
            fpath = `${dirPath}/untitled-file (${count}).txt`;
            count++;
        }
        return fpath;
    }
    getNextFolderName(path) {
        let dirPath = path;
        let count = 1;
        let fpath = `${dirPath}/New folder`;
        while (fs.existsSync(fpath)) {
            fpath = `${dirPath}/New folder (${count})`;
            count++;
        }
        return fpath;
    }
}
module.exports = itemNode;