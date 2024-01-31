import fs from 'fs';
import path from 'path';
import { arrayOpt, pathInfo } from 'ucbuilder/build/common';
import { keyBoard } from 'ucbuilder/global/hardware/keyboard';
import { fileExplorer, RootPathRow } from './fileexplorer.uc';
import { pathRecord } from './fileExplorer.uc.pathRecord';


interface IconFilePath {
    folder: string,
    folderOpened: string,
    otherFile: string,
    usercontrolFile: string,
}
export const iconDirPath = "ucdesigner/Designer/util/fileExplorer/type-icons/style4/".__({});
export const iconFilePath: IconFilePath = {
    folder: iconDirPath + "folder.png",
    folderOpened: iconDirPath + "folder-opened.png",
    otherFile: iconDirPath + "other-file.png",
    usercontrolFile: iconDirPath + "usercontrol.png",
}
export class collepser {

    activeRoot: RootPathRow = undefined;
    get ROOT_DIR(): RootPathRow {
        return this.activeRoot;
    }
    set ROOT_DIR(val: RootPathRow) {
        this.activeRoot = val;
        if (this.watcher != undefined) {
            this.watcher.close();
        }
        this.reFillRows();
        this.main.listview1.lvUiNodes.fill();
        this.watcher = fs.watch(this.activeRoot.path, { recursive: true }, this.watch_Listner);
    }

    watcher: fs.FSWatcher = undefined;

    watch_Listner = (evt: fs.WatchEventType, _path: string) => {
        if (this.main.tpt_itemNode.isInEditMode) return;

        let fullpath: string = pathInfo.cleanPath(this.ROOT_DIR.path + "/" + _path);
        if (this.main.ignoreDirs.findIndex((s) => fullpath.startsWith(s)) != -1) return;
        switch (evt) {
            case "change":
                let rws: pathRecord[] = this.source.rows;
                let fIndex: number = rws.findIndex((s) => s.path == fullpath && s.isOpened);
                if (fIndex != -1) this.openNode(rws[fIndex]);
                break;
            case "rename":
                break;
        }
    };

    source = {
        rows: [] as pathRecord[],
        update: () => { },
    };

    treeSource: pathRecord = new pathRecord();
    main: fileExplorer = undefined;

    init(main: fileExplorer) {
        this.main = main;
        this.initEvent();
    }

    reFillRows = () => {
        this.main.listview1.lvUiNodes.clear();
        this.source.rows.length = 0;

        this.treeSource.type = 'directory';
        this.treeSource.iconFilePath = iconFilePath.folder;
        this.treeSource.path = this.ROOT_DIR.path;
        this.treeSource.sort = 0;
        this.treeSource.level = 0;
        this.treeSource.nodeName = path.basename(this.treeSource.path);
        this.recursive(this.treeSource);

        this.source.rows.push(this.treeSource);
        this.fillRows(this.treeSource, this.source.rows);
        this.source.update();
    };

    initEvent() {
        this.main.listview1.Events.newItemGenerate.on((ele, index) => {
            let rw: pathRecord = this.source.rows[index];
            rw.relevantElement = ele;
        });

        this.main.listview1.ll_view.addEventListener("mouseup", (evt) => {
            this.toggleChildrens(this.main.listview1.lvUI.currentIndex);
        });
        this.main.listview1.ucExtends.self.addEventListener("keydown", (event) => {
            let row: pathRecord = undefined;
            switch (event.keyCode) {
                case keyBoard.keys.right:
                    if (!this.main.tpt_itemNode.isInEditMode) {
                        row = this.main.listview1.lvUI.currentRecord;
                        if (row.type == 'directory') {
                            if (!row.isOpened) {
                                this.toggleChildrens(this.main.listview1.lvUI.currentIndex);
                                event.preventDefault();
                            } else {
                                if (row.children.length > 0) this.main.listview1.lvUI.currentIndex++;
                            }
                        }
                    }
                    break;
                case keyBoard.keys.left:
                    if (!this.main.tpt_itemNode.isInEditMode) {
                        row = this.main.listview1.lvUI.currentRecord;
                        let relINdex = this.main.listview1.lvUI.currentIndex;
                        if (row.type == 'directory') {
                            if (row.isOpened) {
                                this.toggleChildrens(this.main.listview1.lvUI.currentIndex);
                                event.preventDefault();
                                return;
                            }
                        }
                        if (row.parent != undefined) this.main.listview1.lvUI.currentIndex = relINdex;
                    }
                    break;
                case keyBoard.keys.space:
                    if (!this.main.tpt_itemNode.isInEditMode) {
                        this.toggleChildrens(this.main.listview1.lvUI.currentIndex);
                        event.preventDefault();
                    }
                    break;
            }
        });
    }

    recursive(parentDir: pathRecord) {
        let _this = this;
        this.closeNode(parentDir);
        parentDir.children = [];
        if (parentDir.path.endsWith(".asar")) return;
        let pth = parentDir.path;
        if (this.main.ignoreDirs.findIndex((s) => pth.startsWith(s)) != -1) return false;

        if (this.ROOT_DIR.openedFolderList.findIndex((s) => s === parentDir.path) != -1) parentDir.isOpened = true;

        if (this.fileExplorerEvents.filterDirs(parentDir) === false) return false;
        if (!parentDir.isOpened) return;

        let rtrnSource: pathRecord[] = [];
        fs.readdirSync(parentDir.path + "/").forEach((file) => {
            let _path: string = pathInfo.cleanPath(parentDir.path + "\\" + file);
            if (this.main.ignoreFiles.findIndex((s) => _path.startsWith(s)) != -1) return false;
            let _row: pathRecord = new pathRecord();
            _row.path = _path;
            _row.parent = parentDir;
            _row.level = parentDir.level + 1;
            _row.nodeName = path.basename(_row.path);
            if (fs.statSync(_path).isDirectory()) {
                _row.type = 'directory';
                _row.iconFilePath = parentDir.isOpened ? iconFilePath.folderOpened : iconFilePath.folder;
                _row.sort = 0;
                if (this.recursive(_row) !== false) parentDir.children.push(_row);
            } else {
                _row.type = 'file';
                _row.sort = 1;

                if (this.fileExplorerEvents.filterFiles(_row) !== false) parentDir.children.push(_row);
            }
        });
        let mx = 0;
        parentDir.children.sort((a, b) => {
            return a.sort - b.sort;
        });
    }

    fileExplorerEvents = {
        extended: {
            onItemDoubleClick: {
                addListener: (callback: () => void) => { },
            },
        },
        main: () => { },
        filterFiles: (row: pathRecord) => {
            return true;
        },
        filterDirs: (row: pathRecord) => {
            return true;
        },
        toggleDir: (row: pathRecord) => { },
    };

    fillcloseNode(row: pathRecord, nodeToRemove: pathRecord[]) {
        row.children.forEach((child) => {
            this.fillcloseNode(child, nodeToRemove);
            nodeToRemove.push(child);
        });
    }

    closeNode(precord: pathRecord) {
        let nodeToRemove: pathRecord[] = [];
        this.fillcloseNode(precord, nodeToRemove);
        arrayOpt.removeByCallback(this.source.rows, (row) => nodeToRemove.includes(row));
    }

    updateDirectChildren(precord: pathRecord) {
        let nodeToRemove: pathRecord[] = [];
    }

    openNode(precord: pathRecord) {
        let nodeArray: pathRecord[] = [];
        precord.isOpened = true;
        this.recursive(precord);

        this.fillRows(precord, nodeArray);
        this.source.update();
        let findex: number = this.main.listview1.indexOf(precord.relevantElement) + 1;
        this.source.rows.splice(findex, 0, ...nodeArray);
        this.main.listview1.lvUI.currentIndex = this.main.listview1.lvUI.currentIndex;
        this.main.listview1.lvUI.nodes.fill();
    }

    toggleChildrens(index: number) {
        let precord: pathRecord = this.source.rows[index];
        if (precord.type == 'directory') {
            if (precord.isOpened) {
                this.closeNode(precord);
                precord.isOpened = false;
            } else {
                this.openNode(precord);
            }
            this.source.update();
            precord.iconFilePath = precord.isOpened ? iconFilePath.folderOpened : iconFilePath.folder;
            this.main.listview1.lvUiNodes.callToFill();
            this.fileExplorerEvents.toggleDir(precord);
        }
        return false;
    }

    fillRows(parentDir: pathRecord, result: pathRecord[]) {
        if (parentDir.isOpened) {
            parentDir.children.forEach((row) => {
                if (row.type == 'directory') {
                    result.push(row);
                    this.fillRows(row, result);
                } else {
                    result.push(row);
                }
            });
        }
    }
}