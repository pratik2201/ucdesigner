const fileExplorer = require("@ucdesigner:/Designer/util/fileExplorer.uc.js");
const { pathRecord } = require("@ucdesigner:/Designer/util/fileExplorer.uc.pathRecord");
const { rootPathRow } = require("@ucdesigner:/Designer/util/fileExplorer.uc.enumAndMore");
const { pathInfo, arrayOpt } = require("ucbuilder/build/common");
const { commonEvent } = require("ucbuilder/global/commonEvent");
const fs = require('fs');
const path = require("path");
const { keyBoard } = require("ucbuilder/global/hardware/keyboard");
/** @typedef {import("@ucbuilder:/global/listUI/scrollerLV").scrollerLV} scrollerLV */
class collepser {
    constructor() { }
    /** @type {string}  */
    static iconDirPath = "@ucdesigner:/Designer/util/fileExplorer/type-icons/style4/".__();
    iconFilePath = {
        folder: collepser.iconDirPath + "folder.png",
        folderOpened: collepser.iconDirPath + "folder-opened.png",
        otherFile: collepser.iconDirPath + "other-file.png",
        usercontrolFile: collepser.iconDirPath + "usercontrol.png",
    };


    /** @type {rootPathRow}  */
    activeRoot = undefined;
    get ROOT_DIR() { return this.activeRoot; }
    set ROOT_DIR(val) {
        this.activeRoot = val;
        if (this.watcher != undefined) {
            //this.watcher.removeAllListeners()
            this.watcher.close();
        }
        this.reFillRows();
        //console.log(val);
        
        this.main.listview1.lvUiNodes.fill();
        this.watcher = fs.watch(this.activeRoot.path, { recursive: true, }, this.watch_Listner);

    }
    /** @type {fs.FSWatcher}  */
    watcher = undefined;
    /**
     * @param {fs.WatchEventType} evt 
     * @param {*} _path 
     * @returns 
     */
    watch_Listner = (evt, _path) => {
        if (this.main.tpt_itemNode.isInEditMode) return;

        /** @type {string}  */
        let fullpath = pathInfo.cleanPath(this.ROOT_DIR.path + "/" + _path);
        if (this.main.ignoreDirs.findIndex(s => fullpath.startsWith(s)) != -1) return;
        switch (evt) {
            case "change":
                /** @type {pathRecord[]}  */
                let rws = this.source.rows;
                let fIndex = rws.findIndex(s => s.path == fullpath && s.isOpened);
                if (fIndex != -1) this.openNode(rws[fIndex]);
                break;
            case "rename":
                //console.log("2 " + fullpath);
                break;
        }
    };


    source = {
        /** @type {pathRecord[]}  */ 
        rows: [],
        update: () => { }
    };

    treeSource = new pathRecord();
    /** @type {fileExplorer}  */
    main = undefined;
    /** @param {fileExplorer} main */
    init(main) {
        this.main = main;
        this.initEvent();
    }


    reFillRows = () => {
        this.main.listview1.lvUiNodes.clear();
        this.source.rows.length = 0;

        this.treeSource.type = pathInfo.TYPE.directory;
        this.treeSource.iconFilePath = this.iconFilePath.folder;
        this.treeSource.path = this.ROOT_DIR.path;
        this.treeSource.sort = 0;
        this.treeSource.level = 0;
        this.treeSource.nodeName = path.basename(this.treeSource.path);
        this.recursive(this.treeSource);

        //  this.main.listview1.source = [];
        this.source.rows.push(this.treeSource);
        this.fillRows(this.treeSource, this.source.rows);
        this.source.update();

    }

    initEvent() {
        this.main.listview1.Events.newItemGenerate.on((ele, index) => {
            /** @type {pathRecord}  */
            let rw = this.source.rows[index];
            rw.relevantElement = ele;
        });

        this.main.listview1.ll_view.addEventListener("mouseup", (evt) => {
            this.toggleChildrens(this.main.listview1.lvUI.currentIndex);
        });
        this.main.listview1.ucExtends.self.addEventListener('keydown', (event) => {
            /** @type {pathRecord}  */
            let row = undefined;
            switch (event.keyCode) {
                case keyBoard.keys.right:
                    if (!this.main.tpt_itemNode.isInEditMode) {
                        row = this.main.listview1.lvUI.currentRecord;
                        if (row.type == pathInfo.TYPE.directory) {
                            if (!row.isOpened) {
                                this.toggleChildrens(this.main.listview1.lvUI.currentIndex);
                                event.preventDefault();
                            } else {
                                if (row.children.length > 0)
                                    this.main.listview1.lvUI.currentIndex++;
                            }
                        }
                    }
                    break;
                case keyBoard.keys.left:
                    if (!this.main.tpt_itemNode.isInEditMode) {
                        row = this.main.listview1.lvUI.currentRecord;
                        let relINdex = this.main.listview1.lvUI.currentIndex;
                        if (row.type == pathInfo.TYPE.directory) {
                            if (row.isOpened) {
                                this.toggleChildrens(this.main.listview1.lvUI.currentIndex);
                                event.preventDefault();
                                return;
                            }
                        }
                        if (row.parent != undefined)
                            this.main.listview1.lvUI.currentIndex = relINdex;/*row.relevantElement.index();*/ //row.parent.sourceindex;                        
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

    /** @param {pathRecord} parentDir */
    recursive(parentDir) {
        let _this = this;
        this.closeNode(parentDir);
        parentDir.children = [];
        if (parentDir.path.endsWith(".asar")) return;
        let pth = parentDir.path;
        if (this.main.ignoreDirs.findIndex(s => pth.startsWith(s)) != -1) return false;


        if ((this.ROOT_DIR.openedFolderList.findIndex(s => s === parentDir.path) != -1))
            parentDir.isOpened = true;

        if (this.fileExplorerEvents.filterDirs(parentDir) === false) return false;
        if (!parentDir.isOpened) return;
        /** @type {pathRecord[]} */
        let rtrnSource = [];
        fs.readdirSync(parentDir.path + '/').forEach(file => {
            /** @type {string}  */
            let _path = pathInfo.cleanPath(parentDir.path + '\\' + file);
            if (this.main.ignoreFiles.findIndex(s => _path.startsWith(s)) != -1) return false;
            let _row = new pathRecord();
            _row.path = _path;
            _row.parent = parentDir;
            _row.level = parentDir.level + 1;
            _row.nodeName = path.basename(_row.path);
            if (fs.statSync(_path).isDirectory()) {
                // let _row = new pathRecord();
                _row.type = pathInfo.TYPE.directory;
                _row.iconFilePath = parentDir.isOpened ? this.iconFilePath.folderOpened : this.iconFilePath.folder;
                _row.sort = 0;
                if (this.recursive(_row) !== false)
                    parentDir.children.push(_row);
            } else {
                _row.type = pathInfo.TYPE.file;
                _row.sort = 1;

                if (this.fileExplorerEvents.filterFiles(_row) !== false)
                    parentDir.children.push(_row);
            }
        });
        let mx = 0;
        parentDir.children.sort(
            /**
             * @param {pathRecord} a 
             * @param {pathRecord} b 
             */
            (a, b) => {
                return a.sort - b.sort;
            });
    }


    fileExplorerEvents = {
        extended: {
            onItemDoubleClick: new commonEvent(),
        },
        main: () => this,
        /**
         * @param {pathRecord} row 
         * @returns {boolean}
         */
        filterFiles: (row) => {
            return true;
        },
        /**
        * @param {pathRecord} row 
        * @returns {boolean}
        */
        filterDirs: (row) => {
            return true;
        },
        /**
       * @param {pathRecord} row       
       */
        toggleDir: (row) => {

        },
    }

    /**
     * 
     * @param {pathRecord} row 
     * @param {pathRecord[]} nodeToRemove 
     */
    fillcloseNode(row, nodeToRemove) {
        row.children.forEach(child => {
            this.fillcloseNode(child, nodeToRemove);
            nodeToRemove.push(child);
        });
    }
    /**
     * @param {pathRecord} precord
     */
    closeNode(precord) {
        let nodeToRemove = [];
        this.fillcloseNode(precord, nodeToRemove);
        arrayOpt.removeByCallback(this.source.rows,row => nodeToRemove.includes(row));
       
        /*arrayOpt.removeByCallback(this.source.rows,(row) => {
            let found = nodeToRemove.includes(row);
            if (found) row.relevantElement.delete();
            return found;
        });*/
    }

    /**
     * @param {pathRecord} precord
     */
    updateDirectChildren(precord) {
        let nodeToRemove = [];

    }

    /** @param {pathRecord} precord  */
    openNode(precord) {
        let nodeArray = [];
        precord.isOpened = true;
        this.recursive(precord);

        this.fillRows(precord, nodeArray);
        this.source.update();
        let findex = this.main.listview1.indexOf(precord.relevantElement) + 1;
        this.source.rows.splice(findex, 0, ...nodeArray);
        /*for (let index = findex; index < findex + nodeArray.length; index++) {
            this.main.listview1.lvUI.nodes.append(index);
        }*/
        this.main.listview1.lvUI.currentIndex = this.main.listview1.lvUI.currentIndex;
        this.main.listview1.lvUI.nodes.fill();
    }

    toggleChildrens(index) {
        /** @type {pathRecord} */
        let precord = this.source.rows[index];
        if (precord.type == pathInfo.TYPE.directory) {
            if (precord.isOpened) {
                this.closeNode(precord);
                precord.isOpened = false;
            } else {
                this.openNode(precord);
            }
            this.source.update();
            precord.iconFilePath = precord.isOpened ? this.iconFilePath.folderOpened : this.iconFilePath.folder;
            this.main.listview1.lvUiNodes.callToFill();
            //this.main.listview1.lvUiNodes.update(index);
            this.isFocused = true;
            this.fileExplorerEvents.toggleDir(precord);
        }
        return false;
    };
    /**
    * @param {pathRecord} parentDir
    * @param {pathRecord[]} result
    * @return {pathRecord[]}
    */
    fillRows(parentDir, result) {
        if (parentDir.isOpened) {
            parentDir.children.forEach(row => {
                if (row.type == pathInfo.TYPE.directory) {
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

module.exports = { collepser };