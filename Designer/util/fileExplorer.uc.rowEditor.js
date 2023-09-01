const { pathRecord } = require("@ucdesigner:/Designer/util/fileExplorer.uc.collepser");
const {  pathInfo } = require("@ucbuilder:/build/common");
const fileExplorer = require("@ucdesigner:/Designer/util/FILEEXPLORER.uc");
const fs = require('fs');
const path = require("path");
const { keyBoard } = require("@ucbuilder:/global/hardware/keyboard");

class rowEditor {
    constructor() {

    }
    /** @type {fileExplorer}  */
    main = undefined;
    lastEditedIndex = -1;
    /** @param {fileExplorer} main */
    init(main) {
        this.main = main;
        this.main.listview1.ucExtends.self.on('keydown', (event) => {
            switch (event.keyCode) {
                case keyBoard.keys.f2:
                    this.editRow();
                    event.preventDefault();
                    break;
                case keyBoard.keys.escape:
                    this.excape();
                    event.preventDefault();
                    break;
            }
        });
        this.main.listview1.ucExtends.self.on('keyup', (event) => {
            if (event.keyCode == keyBoard.keys.enter) {
                if (this.lastEditedIndex != -1) {
                    this.saveRow(this.lastEditedIndex);
                    event.preventDefault();
                }
            }
        });
        this.main.listview1.Events.currentItemIndexChange.on = (oldindex, newIndx) => {
            if (this.lastEditedIndex == -1) return;
            if (this.lastEditedIndex != newIndx) {
                this.saveRow(this.lastEditedIndex);
            }
        };

    }
    saveRow(index) {
        if (index == -1) return;
        /** @type {pathRecord}  */
        let row = this.main.listview1.source.rows[index];
        /** @type {HTMLElement}  */
        let nval = this.main.ucExtends.designer.getAllControls(["txt_name"]).txt_name;
        let newFileName = nval.innerText;
        if (newFileName != row.nodeName) {
            let newFilePath = path.dirname(row.path) + "/" + newFileName;
            fs.renameSync(row.path, newFilePath);
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
        //this.main.listview1.freeze(true);
        let index = this.main.listview1.lvUI.currentIndex;
        /** @type {pathRecord}  */
        let row = this.main.listview1.source.rows[index];        
        this.lastEditedIndex = index;
        /** @type {HTMLElement}  */
        let txt_name = this.main.ucExtends.designer.getAllControls(["txt_name"]).txt_name;
        txt_name.setAttribute("contenteditable", "true");
        txt_name.focus();
        this.selectText(txt_name);


    }
    getNextFileName(path) {
        let dirPath = path;
        let count = 1;
        let fpath = `${dirPath}/untitled-file`;
        while (fs.existsSync(fpath)) {
            fpath = `${dirPath}/untitled-file (${count})`;
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
    addFolder() {
        /** @type {pathRecord}  */
        let row = this.main.listview1.lvUI.currentRecord;
        /** @type {pathRecord}  */
        let parent = (row.type == pathInfo.TYPE.file)?row.parent:row;
        if (parent != undefined) {
            let fpath = this.getNextFolderName(parent.path);
            fs.mkdirSync(fpath);
            this.main.manager.openNode(parent);
            let findex = parent.children.findIndex(s => s.path == fpath);
            if(findex!=-1){
                let pRec = parent.children[findex];
                this.main.listview1.lvUI.currentIndex = pRec.sourceindex;
                this.editRow(pRec);
            }
        }
    }


    addFile() {
        /** @type {pathRecord}  */
        let row = this.main.listview1.lvUI.currentRecord;
        /** @type {pathRecord}  */
        let parent = (row.type == pathInfo.TYPE.file)?row.parent:row;
        if (parent != undefined) {
            let fpath = this.getNextFileName(parent.path);
            fs.writeFileSync(fpath,"");
            this.main.manager.openNode(parent);
            let findex = parent.children.findIndex(s => s.path == fpath);
            if(findex!=-1){
                let pRec = parent.children[findex];
                this.main.listview1.lvUI.currentIndex = pRec.sourceindex;
                this.editRow(pRec);
            }
        }
    }

    excape() {
        if (this.lastEditedIndex != -1) {
            this.main.listview1.source.rows[this.lastEditedIndex].viewType = templeteType.view;
            this.main.listview1.Records.update(this.lastEditedIndex);
            this.main.listview1.ucExtends.wrapperHT.focus();
            this.lastEditedIndex = -1;
        }
    }
    /** @param {HTMLElement} ele */
    selectText(ele) {
        const node = ele;
        if (document.body.createTextRange) {
            const range = document.body.createTextRange();
            range.moveToElementText(node);
            range.select();
        } else if (window.getSelection) {
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(node);
            selection.removeAllRanges();
            selection.addRange(range);
        } else {
            console.warn("Could not select text in node: Unsupported browser.");
        }
    }

}
module.exports = { rowEditor }