import { collepser } from 'ucdesigner/Designer/util/fileExplorer.uc.collepser.js';
import { pathRecord } from 'ucdesigner/Designer/util/fileExplorer.uc.pathRecord.js';
import { rootPathHandler } from 'ucbuilder/global/rootPathHandler.js';
import {Designer} from './fileExplorer.uc.designer';
import fs from 'fs';
import { objectOpt } from 'ucbuilder/build/common.js';
import { replaceTextRow,ReplaceTextRow } from 'ucbuilder/global/findAndReplace.js';
import { itemNode } from './fileExplorer/itemNode.tpt';

export type nodeType = 'directory' | 'file';
export interface RootPathRow {
    key: string;
    path: string;
    openedFolderList: string[];
}
const rootPathRow: RootPathRow = {
    key: "",
    path: "",
    openedFolderList : []
};

export class fileExplorer extends Designer {
   
    SESSION_DATA: {
        rootPath: RootPathRow[];
        activePath: string;
    } = {
        rootPath: [],
        activePath: '',
    }

    get activeRoot(): any {
        return this.manager.activeRoot;
    }
    tpt_itemNode: itemNode;
    constructor() {
        super();
        this.initializecomponent(arguments, this);
        this.init();
        this.tpt_itemNode = this.listview1.itemTemplate.extended.main as itemNode;
        this.tpt_itemNode.init(this);
        this.comboBox1.source = rootPathHandler.source;
       // this.listview1.source
        this.comboBox1.binder.Events.selectedIndexChange.on((nindex: number) => {
            let selRec = this.comboBox1.binder.selectedRecord as ReplaceTextRow;
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

        this.fileExplorerEvents.toggleDir = (row: any) => {
            if (row.isOpened) {
                if (!this.activeRoot.openedFolderList.includes(row.path))
                    this.activeRoot.openedFolderList.push(row.path);
            } else {
                let fIndex = this.activeRoot.openedFolderList.findIndex((s: string) => s === row.path);
                if (fIndex != -1) this.activeRoot.openedFolderList.splice(fIndex, 1);
            }
        };
    }

    init(): void {
        this.manager.source = this.listview1.source;
        this.manager.init(this);

        this.cmd_addfile.addEventListener("mouseup", (e: MouseEvent) => { this.tpt_itemNode.addFile(); });
        this.cmd_addfolder.addEventListener("mouseup", (e: MouseEvent) => { this.tpt_itemNode.addFolder(); });
        this.cmd_delete.addEventListener("mouseup", (e: MouseEvent) => { this.tpt_itemNode.delete(); });
    }

    loadSession(): void {
        let res = this.fillRows(this.SESSION_DATA.activePath);
        if (res != undefined) {
            this.comboBox1.binder.fireSelectedIndexChangeEvent = false;
            this.comboBox1.selectedIndex = res.index;
        }
    }

    get listviewEvents(): any {
        return this.listview1.Events;
    }

    manager: collepser = new collepser();

    ignoreDirs: string[] = [];
    ignoreFiles: string[] = [];

    fillRows(key: string): any {
        
        let info = rootPathHandler.getInfo(key);
        if (info != undefined && info.path != '' && fs.existsSync(info.path)) {
            let nrow = this.SESSION_DATA.rootPath.find((s: RootPathRow) => s.path == info.path);
            if (nrow == undefined) {
                nrow = Object.assign({},rootPathRow);
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

    get currentRecord(): pathRecord {
        return this.listview1.currentRecord;
    }

    get fileExplorerEvents(): any {
        return this.manager.fileExplorerEvents;
    }
}