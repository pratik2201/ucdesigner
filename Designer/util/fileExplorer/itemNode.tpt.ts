import { fileExplorer } from 'ucdesigner/Designer/util/fileExplorer.uc.js';
import { pathRecord } from 'ucdesigner/Designer/util/fileExplorer.uc.pathRecord';
import { pathInfo } from 'ucbuilder/build/common.js';
import { elementEditor } from 'ucbuilder/global/elementEditor.js';
import { keyBoard } from 'ucbuilder/global/hardware/keyboard.js';
import fs from 'fs';
import {Designer} from './itemNode.tpt.designer.js';
import { pagerLV } from 'ucbuilder/global/listUI/pagerLV.js';

export class itemNode extends Designer {
    editor: elementEditor = new elementEditor();

    main: fileExplorer;
    lvUI: pagerLV;
    get lvRecords() { return this.lvUI.Records; }
    init(main: fileExplorer) {
        this.main = main;
        this.lvUI = this.main.listview1.lvUI;
        this.main.listview1.ucExtends.self.addEventListener("keydown", (ev: KeyboardEvent) => {
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

    keyup_listner = (e: KeyboardEvent) => {
        switch (e.keyCode) {
            case keyBoard.keys.f2:
                break;
        }
    }

    get isInEditMode(): boolean { return this.editor.isInEditMode; }

    get pathRow(): pathRecord { return this.lvUI.currentRecord; }

    doEditProcess() {
        let crow = this.pathRow;
        let span = crow.relevantElement.querySelector('span[x-name="txt_name"]');
        this.editor.editRow(span, (nval: string, oval: string) => {
            if (crow.nodeName != nval) {
                let path = crow.parent.path + "/" + nval;
                if (!fs.existsSync(path)) {
                    fs.renameSync(crow.path, path);
                    this.main.manager.openNode(crow.parent);
                    let src: pathRecord[] = this.main.manager.source.rows;
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

    deleteFolderRecursive(path: string) {
        let _this = this;
        var files: string[] = [];
        if (fs.existsSync(path)) {
            files = fs.readdirSync(path);
            files.forEach(function (file, index) {
                var curPath = path + "/" + file;
                if (fs.lstatSync(curPath).isDirectory()) {
                    _this.deleteFolderRecursive(curPath);
                } else {
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    }

    delete() {
        let _this = this;
        let row: pathRecord = this.lvUI.currentRecord as pathRecord;
        if (fs.existsSync(row.path)) {
            let finf = fs.lstatSync(row.path);
            if (finf.isDirectory())
                _this.deleteFolderRecursive(row.path);
            else
                fs.unlinkSync(row.path);
        }
    }

    addFolder() {
        let row: pathRecord = this.lvUI.currentRecord as pathRecord;
        let parent: pathRecord = (row.type == 'file') ? row.parent : row;
        if (parent != undefined) {
            let fpath = this.getNextFolderName(parent.path);
            fs.mkdirSync(fpath);
            this.main.manager.openNode(parent);
            let src: pathRecord[] = this.main.manager.source.rows;
            let findex = src.findIndex(s => s.path == fpath);
            if (findex != -1) {
                this.main.listview1.lvUI.currentIndex = findex;
                this.doEditProcess();
            }
        }
    }

    addFile() {
        let row: pathRecord = this.lvUI.currentRecord  as pathRecord;
        let parent: pathRecord = (row.type == 'file') ? row.parent : row;
        if (parent != undefined) {
            let fpath = this.getNextFileName(parent.path);
            fs.writeFileSync(fpath, "");
            this.main.manager.openNode(parent);
            let src: pathRecord[] = this.main.manager.source.rows;
            let findex = src.findIndex(s => s.path == fpath);
            if (findex != -1) {
                this.main.listview1.lvUI.currentIndex = findex;
                this.doEditProcess();
            }
        }
    }

    getNextFileName(path: string): string {
        let dirPath = path;
        let count = 1;
        let fpath = `${dirPath}/untitled-file.txt`;
        while (fs.existsSync(fpath)) {
            fpath = `${dirPath}/untitled-file (${count}).txt`;
            count++;
        }
        return fpath;
    }

    getNextFolderName(path: string): string {
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