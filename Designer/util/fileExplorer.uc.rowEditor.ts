import { pathRecord } from "ucdesigner/Designer/util/fileExplorer.uc.pathRecord";
import { pathInfo } from "ucbuilder/build/common";
import { fileExplorer } from "ucdesigner/Designer/util/fileExplorer.uc";
import fs from 'fs';
import path from "path";
import { keyBoard } from "ucbuilder/global/hardware/keyboard";

export class rowEditor {
    main: fileExplorer;
    lastEditedIndex: number = -1;

    init(main: fileExplorer) {
        this.main = main;
        this.main.listview1.ucExtends.self.on('keydown', (event: KeyboardEvent) => {
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
        this.main.listview1.ucExtends.self.on('keyup', (event: KeyboardEvent) => {
            if (event.keyCode == keyBoard.keys.enter) {
                if (this.lastEditedIndex != -1) {
                    this.saveRow(this.lastEditedIndex);
                    event.preventDefault();
                }
            }
        });
        this.main.listview1.Events.currentItemIndexChange.on((oldindex: number, newIndx: number) => {
            if (this.lastEditedIndex == -1) return;
            if (this.lastEditedIndex != newIndx) {
                this.saveRow(this.lastEditedIndex);
            }
        });
    }

    saveRow(index: number) {
        if (index == -1) return;
        let row: pathRecord = this.main.listview1.source.rows[index];
        let nval: HTMLElement = this.main.ucExtends.designer.getAllControls(["txt_name"]).txt_name;
        let newFileName: string = nval.innerText;
        if (newFileName != row.nodeName) {
            let newFilePath: string = path.dirname(row.path) + "/" + newFileName;
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
        let index: number = this.main.listview1.lvUI.currentIndex;
        let row: pathRecord = this.main.listview1.source.rows[index];
        this.lastEditedIndex = index;
        let txt_name: HTMLElement = this.main.ucExtends.designer.getAllControls(["txt_name"]).txt_name;
        txt_name.setAttribute("contenteditable", "true");
        txt_name.focus();
        this.selectText(txt_name);
    }

    getNextFileName(path: string): string {
        let dirPath: string = path;
        let count: number = 1;
        let fpath: string = `${dirPath}/untitled-file`;
        while (fs.existsSync(fpath)) {
            fpath = `${dirPath}/untitled-file (${count})`;
            count++;
        }
        return fpath;
    }

    getNextFolderName(path: string): string {
        let dirPath: string = path;
        let count: number = 1;
        let fpath: string = `${dirPath}/New folder`;
        while (fs.existsSync(fpath)) {
            fpath = `${dirPath}/New folder (${count})`;
            count++;
        }
        return fpath;
    }

    addFolder() {
        let row: pathRecord = this.main.listview1.lvUI.currentRecord;
        let parent: pathRecord = (row.type == 'file') ? row.parent : row;
        if (parent != undefined) {
            let fpath: string = this.getNextFolderName(parent.path);
            fs.mkdirSync(fpath);
            this.main.manager.openNode(parent);
            let findex: number = parent.children.findIndex(s => s.path == fpath);
            if (findex != -1) {
                let pRec: pathRecord = parent.children[findex];
                //this.main.listview1.lvUI.currentIndex = pRec.sourceindex;
                this.editRow();
            }
        }
    }

    addFile() {
        let row: pathRecord = this.main.listview1.lvUI.currentRecord;
        let parent: pathRecord = (row.type == 'file') ? row.parent : row;
        if (parent != undefined) {
            let fpath: string = this.getNextFileName(parent.path);
            fs.writeFileSync(fpath, "");
            this.main.manager.openNode(parent);
            let findex: number = parent.children.findIndex(s => s.path == fpath);
            if (findex != -1) {
                let pRec: pathRecord = parent.children[findex];
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

    selectText(ele: HTMLElement) {
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
        } */else {
            console.warn("Could not select text in node: Unsupported browser.");
        }
    }
}