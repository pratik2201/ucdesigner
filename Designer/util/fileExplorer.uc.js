const { collepser } = require('@ucdesigner:/Designer/util/fileExplorer.uc.collepser.js');
const { rootPathRow } = require('@ucdesigner:/Designer/util/fileExplorer.uc.enumAndMore.js');
const { pathRecord } = require('@ucdesigner:/Designer/util/fileExplorer.uc.pathRecord.js');
const { rootPathHandler } = require('@ucbuilder:/global/rootPathHandler.js');
const { designer } = require('./fileExplorer.uc.designer.js');
const fs = require('fs');
const { objectOpt } = require('@ucbuilder:/build/common.js');
const { replaceTextRow } = require('@ucbuilder:/global/findAndReplace.js');
/**
 * @typedef {import("@ucdesigner:/designer/util/fileexplorer/itemnode.tpt.js")} itemnode 
 */
class fileExplorer extends designer {

    SESSION_DATA = {
        /** @type {rootPathRow[]}  */
        rootPath: [],
        /** @type {string}  */
        activePath: '',
    }

    get activeRoot() {
        return this.manager.activeRoot;
    }

    constructor() {
        eval(designer.giveMeHug);        
        this.init();
        /** @type {itemnode}  */ 
        this.tpt_itemNode = this.listview1.itemTemplate;
        this.tpt_itemNode.init(this);
        this.comboBox1.source = rootPathHandler.source;
        
        //this.comboBox1.itemTemplate = this.tpt_rootitemNode;
       
        this.comboBox1.binder.Events.selectedIndexChange.on((nindex) => {
            /** @type {replaceTextRow}  */
            let selRec = this.comboBox1.binder.selectedRecord;
            
            this.fillRows(selRec.originalFinderText);
        });
        
       //this.comboBox1.ll_view.
        
        this.listview1.itemTemplate = this.tpt_itemNode;
        this.ucExtends.Events.loadLastSession.on(() => {
            this.loadSession();
        });

        if (!this.ucExtends.session.options.loadBySession) {
            //this.comboBox1.value = '@testnpm::/';
           // this.fillRows(rootPathHandler.source[0].originalFinderText);

        }

        this.fileExplorerEvents.toggleDir = (row) => {
            if (row.isOpened) {  // if opened
                if (!this.activeRoot.openedFolderList.includes(row.path))
                    this.activeRoot.openedFolderList.push(row.path);
            } else { // if closed
                let fIndex = this.activeRoot.openedFolderList.findIndex(s => s === row.path);
                if (fIndex != -1) this.activeRoot.openedFolderList.splice(fIndex, 1);
            }
        };

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
       // debugger;
        if (res != undefined)
            this.comboBox1.selectedIndex = res.index;
    }
    get listviewEvents() {
        return this.listview1.Events;
    };
    /** @type {collepser}  */
    manager = new collepser();


    /** @type {string[]}  */
    ignoreDirs = [];
    /** @type {string[]}  */
    ignoreFiles = [];

    fillRows(key) {
        let info = rootPathHandler.getInfo(key);
        if (info != undefined && info.path != '' && fs.existsSync(info.path)) {
            let nrow = this.SESSION_DATA.rootPath.find(s => s.path == info.path);
            if (nrow == undefined) {
                nrow = objectOpt.clone(rootPathRow);;
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
    /** @type {pathRecord}  */
    get currentRecord() { return this.listview1.lvUI.currentRecord; }

    get fileExplorerEvents() { return this.manager.fileExplorerEvents; }
}
module.exports = fileExplorer;