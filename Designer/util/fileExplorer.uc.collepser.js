"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.collepser = exports.iconDirPath = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const common_1 = require("ucbuilder/build/common");
const keyboard_1 = require("ucbuilder/global/hardware/keyboard");
const fileExplorer_uc_pathRecord_1 = require("./fileExplorer.uc.pathRecord");
exports.iconDirPath = "ucdesigner/Designer/util/fileExplorer/type-icons/style4/";
(() => __awaiter(void 0, void 0, void 0, function* () {
    exports.iconDirPath = yield exports.iconDirPath.__({});
    exports.iconFilePath = {
        folder: exports.iconDirPath + "folder.png",
        folderOpened: exports.iconDirPath + "folder-opened.png",
        otherFile: exports.iconDirPath + "other-file.png",
        usercontrolFile: exports.iconDirPath + "usercontrol.png",
    };
}))();
class collepser {
    constructor() {
        this.activeRoot = undefined;
        this.watcher = undefined;
        this.watch_Listner = (evt, _path) => {
            if (this.main.tpt_itemNode.isInEditMode)
                return;
            let fullpath = common_1.pathInfo.cleanPath(this.ROOT_DIR.path + "/" + _path);
            if (this.main.ignoreDirs.findIndex((s) => fullpath.startsWith(s)) != -1)
                return;
            switch (evt) {
                case "change":
                    let rws = this.source.rows;
                    let fIndex = rws.findIndex((s) => s.path == fullpath && s.isOpened);
                    if (fIndex != -1)
                        this.openNode(rws[fIndex]);
                    break;
                case "rename":
                    break;
            }
        };
        this.source = {
            rows: [],
            update: () => { },
        };
        this.treeSource = new fileExplorer_uc_pathRecord_1.pathRecord();
        this.main = undefined;
        this.reFillRows = () => {
            this.main.listview1.lvUiNodes.clear();
            this.source.rows.length = 0;
            this.treeSource.type = 'directory';
            this.treeSource.iconFilePath = exports.iconFilePath.folder;
            this.treeSource.path = this.ROOT_DIR.path;
            this.treeSource.sort = 0;
            this.treeSource.level = 0;
            this.treeSource.nodeName = path_1.default.basename(this.treeSource.path);
            this.recursive(this.treeSource);
            this.source.rows.push(this.treeSource);
            this.fillRows(this.treeSource, this.source.rows);
            this.source.update();
        };
        this.fileExplorerEvents = {
            extended: {
                onItemDoubleClick: {
                    addListener: (callback) => { },
                },
            },
            main: () => { },
            filterFiles: (row) => {
                return true;
            },
            filterDirs: (row) => {
                return true;
            },
            toggleDir: (row) => { },
        };
    }
    get ROOT_DIR() {
        return this.activeRoot;
    }
    set ROOT_DIR(val) {
        this.activeRoot = val;
        if (this.watcher != undefined) {
            this.watcher.close();
        }
        this.reFillRows();
        this.main.listview1.lvUiNodes.fill();
        this.watcher = fs_1.default.watch(this.activeRoot.path, { recursive: true }, this.watch_Listner);
    }
    init(main) {
        this.main = main;
        this.initEvent();
    }
    initEvent() {
        this.main.listview1.Events.newItemGenerate.on((ele, index) => {
            let rw = this.source.rows[index];
            rw.relevantElement = ele;
        });
        this.main.listview1.ll_view.addEventListener("mouseup", (evt) => {
            this.toggleChildrens(this.main.listview1.lvUI.currentIndex);
        });
        this.main.listview1.ucExtends.self.addEventListener("keydown", (event) => {
            let row = undefined;
            switch (event.keyCode) {
                case keyboard_1.keyBoard.keys.right:
                    if (!this.main.tpt_itemNode.isInEditMode) {
                        row = this.main.listview1.lvUI.currentRecord;
                        if (row.type == 'directory') {
                            if (!row.isOpened) {
                                this.toggleChildrens(this.main.listview1.lvUI.currentIndex);
                                event.preventDefault();
                            }
                            else {
                                if (row.children.length > 0)
                                    this.main.listview1.lvUI.currentIndex++;
                            }
                        }
                    }
                    break;
                case keyboard_1.keyBoard.keys.left:
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
                        if (row.parent != undefined)
                            this.main.listview1.lvUI.currentIndex = relINdex;
                    }
                    break;
                case keyboard_1.keyBoard.keys.space:
                    if (!this.main.tpt_itemNode.isInEditMode) {
                        this.toggleChildrens(this.main.listview1.lvUI.currentIndex);
                        event.preventDefault();
                    }
                    break;
            }
        });
    }
    recursive(parentDir) {
        let _this = this;
        this.closeNode(parentDir);
        parentDir.children = [];
        if (parentDir.path.endsWith(".asar"))
            return;
        let pth = parentDir.path;
        if (this.main.ignoreDirs.findIndex((s) => pth.startsWith(s)) != -1)
            return false;
        if (this.ROOT_DIR.openedFolderList.findIndex((s) => s === parentDir.path) != -1)
            parentDir.isOpened = true;
        if (this.fileExplorerEvents.filterDirs(parentDir) === false)
            return false;
        if (!parentDir.isOpened)
            return;
        let rtrnSource = [];
        fs_1.default.readdirSync(parentDir.path + "/").forEach((file) => {
            let _path = common_1.pathInfo.cleanPath(parentDir.path + "\\" + file);
            if (this.main.ignoreFiles.findIndex((s) => _path.startsWith(s)) != -1)
                return false;
            let _row = new fileExplorer_uc_pathRecord_1.pathRecord();
            _row.path = _path;
            _row.parent = parentDir;
            _row.level = parentDir.level + 1;
            _row.nodeName = path_1.default.basename(_row.path);
            if (fs_1.default.statSync(_path).isDirectory()) {
                _row.type = 'directory';
                _row.iconFilePath = parentDir.isOpened ? exports.iconFilePath.folderOpened : exports.iconFilePath.folder;
                _row.sort = 0;
                if (this.recursive(_row) !== false)
                    parentDir.children.push(_row);
            }
            else {
                _row.type = 'file';
                _row.sort = 1;
                if (this.fileExplorerEvents.filterFiles(_row) !== false)
                    parentDir.children.push(_row);
            }
        });
        let mx = 0;
        parentDir.children.sort((a, b) => {
            return a.sort - b.sort;
        });
    }
    fillcloseNode(row, nodeToRemove) {
        row.children.forEach((child) => {
            this.fillcloseNode(child, nodeToRemove);
            nodeToRemove.push(child);
        });
    }
    closeNode(precord) {
        let nodeToRemove = [];
        this.fillcloseNode(precord, nodeToRemove);
        common_1.arrayOpt.removeByCallback(this.source.rows, (row) => nodeToRemove.includes(row));
    }
    updateDirectChildren(precord) {
        let nodeToRemove = [];
    }
    openNode(precord) {
        let nodeArray = [];
        precord.isOpened = true;
        this.recursive(precord);
        this.fillRows(precord, nodeArray);
        this.source.update();
        let findex = this.main.listview1.indexOf(precord.relevantElement) + 1;
        this.source.rows.splice(findex, 0, ...nodeArray);
        this.main.listview1.lvUI.currentIndex = this.main.listview1.lvUI.currentIndex;
        this.main.listview1.lvUI.nodes.fill();
    }
    toggleChildrens(index) {
        let precord = this.source.rows[index];
        if (precord.type == 'directory') {
            if (precord.isOpened) {
                this.closeNode(precord);
                precord.isOpened = false;
            }
            else {
                this.openNode(precord);
            }
            this.source.update();
            precord.iconFilePath = precord.isOpened ? exports.iconFilePath.folderOpened : exports.iconFilePath.folder;
            this.main.listview1.lvUiNodes.callToFill();
            this.fileExplorerEvents.toggleDir(precord);
        }
        return false;
    }
    fillRows(parentDir, result) {
        if (parentDir.isOpened) {
            parentDir.children.forEach((row) => {
                if (row.type == 'directory') {
                    result.push(row);
                    this.fillRows(row, result);
                }
                else {
                    result.push(row);
                }
            });
        }
    }
}
exports.collepser = collepser;
