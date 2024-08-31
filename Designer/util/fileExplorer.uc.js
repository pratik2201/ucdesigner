"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileExplorer = void 0;
const fileExplorer_uc_collepser_js_1 = require("ucdesigner/Designer/util/fileExplorer.uc.collepser.js");
const rootPathHandler_js_1 = require("ucbuilder/global/rootPathHandler.js");
const fileExplorer_uc_designer_js_1 = require("./fileExplorer.uc.designer.js");
const fs_1 = __importDefault(require("fs"));
const rootPathRow = {
    key: "",
    path: "",
    openedFolderList: []
};
class fileExplorer extends fileExplorer_uc_designer_js_1.Designer {
    constructor() {
        super();
        this.SESSION_DATA = {
            rootPath: [],
            activePath: '',
        };
        this.manager = new fileExplorer_uc_collepser_js_1.collepser();
        this.ignoreDirs = [];
        this.ignoreFiles = [];
        this.initializecomponent(arguments, this);
        this.init();
        this.tpt_itemNode = this.listview1.itemTemplate.extended.main;
        this.tpt_itemNode.init(this);
        this.comboBox1.source = rootPathHandler_js_1.rootPathHandler.source;
        // this.listview1.source
        this.comboBox1.binder.Events.selectedIndexChange.on((nindex) => {
            let selRec = this.comboBox1.binder.selectedRecord;
            console.log(selRec);
            this.fillRows(selRec.originalFinderText);
        });
        this.ucExtends.Events.loadLastSession.on(() => {
            this.loadSession();
        });
        if (!this.ucExtends.session.options.loadBySession) {
            //this.comboBox1.value = '@testnpm::/';
            // this.fillRows(rootPathHandler.source[0].originalFinderText);
        }
        this.fileExplorerEvents.toggleDir = (row) => {
            if (row.isOpened) {
                if (!this.activeRoot.openedFolderList.includes(row.path))
                    this.activeRoot.openedFolderList.push(row.path);
            }
            else {
                let fIndex = this.activeRoot.openedFolderList.findIndex((s) => s === row.path);
                if (fIndex != -1)
                    this.activeRoot.openedFolderList.splice(fIndex, 1);
            }
        };
    }
    get activeRoot() {
        return this.manager.activeRoot;
    }
    init() {
        this.manager.source = this.listview1.source;
        this.manager.init(this);
        this.cmd_addfile.addEventListener("mouseup", (e) => { this.tpt_itemNode.addFile(); });
        this.cmd_addfolder.addEventListener("mouseup", (e) => { this.tpt_itemNode.addFolder(); });
        this.cmd_delete.addEventListener("mouseup", (e) => { this.tpt_itemNode.delete(); });
    }
    loadSession() {
        let res = this.fillRows(this.SESSION_DATA.activePath);
        if (res != undefined) {
            this.comboBox1.binder.fireSelectedIndexChangeEvent = false;
            this.comboBox1.selectedIndex = res.index;
        }
    }
    get listviewEvents() {
        return this.listview1.Events;
    }
    fillRows(key) {
        let info = rootPathHandler_js_1.rootPathHandler.getInfo(key);
        if (info != undefined && info.path != '' && fs_1.default.existsSync(info.path)) {
            let nrow = this.SESSION_DATA.rootPath.find((s) => s.path == info.path);
            if (nrow == undefined) {
                nrow = Object.assign({}, rootPathRow);
                nrow.path = info.path;
                this.SESSION_DATA.rootPath.push(nrow);
            }
            nrow.key = info.alices;
            this.SESSION_DATA.activePath = nrow.path;
            this.manager.ROOT_DIR = nrow;
            return info;
        }
        return undefined;
    }
    get currentRecord() {
        return this.listview1.currentRecord;
    }
    get fileExplorerEvents() {
        return this.manager.fileExplorerEvents;
    }
}
exports.fileExplorer = fileExplorer;
