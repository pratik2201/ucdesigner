const { designerToolsType } = require('@ucdesigner:/enumAndMore.js');
const projHandler = require('@ucdesigner:/stageContent/projHandler.uc.js');
const { commonEvent } = require('@ucbuilder:/global/commonEvent.js');
const { Usercontrol } = require('@ucbuilder:/Usercontrol.js');
const ucOutput = require('@ucdesigner:/stageContent/ucOutput.uc.js');
const ucStyle = require('@ucdesigner:/stageContent/ucStyle.uc.js');
const { designer } = require('./formDesigner.uc.designer.js');
const ucLayout = require('@ucdesigner:/stageContent/ucLayout.uc.js');
const Movable = require('@uccontrols:/controls/Movable.uc.js');
const { objectOpt, arrayOpt, pathInfo } = require('@ucbuilder:/build/common.js');
const { tabChilds } = require('@uccontrols:/controls/Splitter.uc.enumAndMore.js');
const controlInfo = require('@ucdesigner:/stageContent/controlInfo.uc.js');
const { jqFeatures } = require('@ucbuilder:/global/jqFeatures.js');
const ucJsonPerameterEditor = require('@ucdesigner:/stageContent/ucJsonPerameterEditor.uc.js');
const assetsExplore = require('@ucdesigner:/Designer/util/assetsExplore.uc.js');
//const messageBox = require('@uccontrols:/controls/messageBox.uc.js');
const { keyBoard } = require('@ucbuilder:/global/hardware/keyboard.js');
const fs = require('fs');
const { intenseGenerator } = require('@ucbuilder:/intenseGenerator.js');
const { ResourcesUC } = require('@ucbuilder:/ResourcesUC.js');
const { timeoutCall } = require('ucbuilder/global/timeoutCall.js');

class formDesigner extends designer {

    SESSION_DATA = {
        /** @type {tabChilds[]}  */
        children: [],

        /** @type {tabChilds[]}  */
        inActiveChildren: [],
    }

    constructor() {
        eval(designer.giveMeHug);

        
        

        //console.log(_getCallerFile());
        this.cmd_deletesesion.addEventListener("mousedown", () => {
            pathInfo.removeFile(this.ucExtends.session.dataPath);
            console.clear();
            console.log('done.');
        });
        this.cmd_resetsesion.addEventListener("mousedown", () => {
            pathInfo.removeFile(this.ucExtends.session.dataPath);
            fs.copyFileSync(this.ucExtends.session.dataPath + ".src", this.ucExtends.session.dataPath);
            console.clear();
            console.log('done.');
        });
        this.splitter1.ucExtends.Events.onDataExport = (data) => {
            switch (data.type) {
                case 'uc':
                    /** @type {Usercontrol}  */
                    let uc = data.data;
                    uc.ucExtends.windowstate = 'normal';
                    this.container1.appendChild(uc.ucExtends.self);
                    this.pushChildSession(uc);
                    return true;
                    break;
            }
        };


        this.cmd_sample1.addEventListener("mousedown", () => {
            /**  @type {import ('@ucbuilder:/appBuilder/demo/create_ledger.uc.js')} (winFrame) */
            let uc = intenseGenerator.generateUC('@ucbuilder:/appBuilder/demo/create_ledger.uc.js', { parentUc: undefined, wrapperHT: undefined });
            uc.winframe1.showDialog();
        });
        this.cmd_sample2.addEventListener("mousedown", () => {
            /**  @type {import ('@testnpm:/main/newStyle/create_ledger.uc.js')} (winFrame) */
            let uc = intenseGenerator.generateUC('@testnpm:/main/newStyle/create_ledger.uc.js', { parentUc: undefined, wrapperHT: undefined });
            uc.winframe1.showDialog();

            /*messageBox.Show("HELLO?", (res) => {
                console.log(res);
            }, {
                detail: "this is simple messagebox",
                title: "Confirm",
                buttonType: 'AbortRetryIgnore',
                defaultFocus: 'retry'
            });*/

        });


        this.cmd_built.addEventListener("click", () => {
            console.clear();
            let { builder } = require('@ucbuilder:/build/builder');
            let mgen = new builder();
            mgen.buildALL();
            console.log('BUILD SUCCESSFULL...');
        });


        ResourcesUC.resources[designerToolsType.mainForm] = this;
        this.init();


        this.ucExtends.self.addEventListener("keyup", (e) => {
            switch (e.keyCode) {
                case keyBoard.keys.f4:
                    if (this.tools.controlInfo != undefined) {
                        this.tools.controlInfo.ucExtends.self.focus();
                        //this.tools.controlInfo.ucExtends.options.activate();
                    }
                    break;
            }
        });

    }
    refreshActiveEditor() {
        if (this.tools.activeEditor != undefined)
            this.tools.activeEditor.refresh()
    }
    tools = {
        /** @type {number[]}  */
        selectedElementList: [],
        /** @type {number[]}  */
        dragBucket: [],

        /** @type {controlInfo}  */
        controlInfo: undefined,

        /** @type {projHandler}  */
        projectExplorer: undefined,
        /** @type {ucOutput}  */
        activeEditor: undefined,
        /** @type {ucStyle}  */
        styleEditor: undefined,
        /** @type {ucLayout}  */
        layoutManager: undefined,

        /** @type {ucJsonPerameterEditor}  */
        jsonPeramaterEditor: undefined,
        /**
         * @param {designerToolsType} type 
         * @param {Usercontrol} uc 
         * @returns {boolean|undefined}
         */
        set: (type, uc) => {
            let tls = this.tools;
            switch (type) {
                case designerToolsType.controlInfo:
                    if (tls.controlInfo == undefined) { tls.controlInfo = uc; this.bindSplitterDrag(tls.controlInfo.movable1); return true; }
                    break;
                case designerToolsType.projectExplorer:
                    if (tls.projectExplorer == undefined) { tls.projectExplorer = uc; this.bindSplitterDrag(tls.projectExplorer.movable1); return true; }
                    break;
                case designerToolsType.jsonPerameter:
                    if (tls.jsonPeramaterEditor == undefined) { tls.jsonPeramaterEditor = uc; this.bindSplitterDrag(tls.jsonPeramaterEditor.movable1); return true; }
                    break;
                case designerToolsType.styler:
                    if (tls.styleEditor == undefined) { tls.styleEditor = uc; this.bindSplitterDrag(tls.styleEditor.movable1); return true; }
                    break;
                case designerToolsType.layout:
                    if (tls.layoutManager == undefined) { tls.layoutManager = uc; this.bindSplitterDrag(tls.layoutManager.movable1); return true; }
                    break;
                case designerToolsType.editor:
                    if (tls.activeEditor == undefined || !tls.activeEditor.ucExtends.self.is(uc.ucExtends.self)) {
                        tls.activeEditor = uc;
                        this.bindSplitterDrag(tls.activeEditor.movable1);
                        this.editorEvent.activateEditor.fire(uc);
                        return true;
                    }
                    break;
            }
            return false;
        },

    };
    /** @param {Movable} movableUC */
    bindSplitterDrag(movableUC) {
        movableUC.movableEvents.onActivateWindow(() => {
            this.refreshZindexOfWindows();
        });
    }
    refreshZindexOfWindows() {
        this.SESSION_DATA.children.forEach(row => {
            /** @type {HTMLElement}  */
            let ele = jqFeatures.getElementById(row.stamp);
            row.index = ele.index();
        });
        this.ucExtends.session.onModify();
    }
    splitterRolesType = Object.freeze({
        notDefined: "blank",
        leftSide: "leftSide",
        contentEditor: "contentEditor",
        rightSide: "rightSide",
        bottomSide: "bottomSide",
    });
    editorEvent = {

        /**
         * @type {{on:(callback = (
         * ) =>{})} & commonEvent}
         */
        changeLayout: new commonEvent(),

        /**
         * @type {{on:(callback = (
        * ) =>{})} & commonEvent}
        */
        activateEditor: new commonEvent(),
        /**
         * @type {{on:(callback = (
         *  index:number,
         *  isMultiSelect:boolean
         * ) =>{})} & commonEvent}
         */
        selectControl: new commonEvent(),


    }
    loadSession() {
        this.container1.innerHTML = "";
        let backUp = objectOpt.clone(this.SESSION_DATA.children);
        this.SESSION_DATA.children.length = 0;

        backUp.forEach(s => {
            let uc = intenseGenerator.generateUC(s.filePath, {
                parentUc: this,
                session: { loadBySession: true }
            });
            let ucExt = uc.ucExtends;
            this.container1.append(uc.ucExtends.self);

            ucExt.session.setSession(s.session[""]);
            s.stamp = uc.ucExtends.self.stamp();
            this.pushChildSession(uc);
        });
        //console.log(this.ucSession.source);
    }

    init() {




        this.ucExtends.Events.loadLastSession.on(() => {
            this.loadSession();

        });

        if (this.ucExtends.session.readfile() === false) {
            this.splitter1.pushPrimaryContainer();
        }
        this.cmd_layout.on('mousedown', () => {
            if (this.tools.layoutManager == undefined) {
                let uc = intenseGenerator.generateUC('@ucdesigner:/stageContent/ucLayout.uc.html', { parentUc: this });
                this.container1.append(uc.ucExtends.self);
                this.pushChildSession(uc);
                //this.splitter1.dropUc(this.splitterRolesType.contentEditor, '@ucdesigner:/stageContent/ucLayout.uc.html');
            }
        });
        this.cmd_style.on('mousedown', () => {
            if (this.tools.styleEditor == undefined) {
                let uc = intenseGenerator.generateUC('@ucdesigner:/stageContent/ucStyle.uc.html', { parentUc: this });
                this.container1.append(uc.ucExtends.self);
                this.pushChildSession(uc);
                //this.splitter1.dropUc(this.splitterRolesType.contentEditor, '@ucdesigner:/stageContent/ucStyle.uc.html');
            }
        });

        this.cmd_jsonPera.on('mousedown', () => {
            if (this.tools.jsonPeramaterEditor == undefined) {
                let uc = intenseGenerator.generateUC('@ucdesigner:/stageContent/ucJsonPerameterEditor.uc.html', { parentUc: this });
                this.container1.append(uc.ucExtends.self);
                this.pushChildSession(uc);
                //this.splitter1.dropUc(this.splitterRolesType.contentEditor, '@ucdesigner:/stageContent/ucStyle.uc.html');
            }
        });
        this.cmd_fileExplorer.on('mousedown', () => {
            if (this.tools.styleEditor == undefined) {
                let uc = intenseGenerator.generateUC('@ucdesigner:/stageContent/projHandler.uc.html', { parentUc: this });
                this.container1.append(uc.ucExtends.self);
                this.pushChildSession(uc);
            }
        });
        this.cmd_controlInfo.addEventListener("mousedown", () => {
            if (this.tools.controlInfo == undefined) {
                /** @type {controlInfo}  */
                let uc = intenseGenerator.generateUC('@ucdesigner:/stageContent/controlInfo.uc.html', { parentUc: this });
                this.container1.append(uc.ucExtends.self);
                this.pushChildSession(uc);
                //uc.winframe1.showDialog();
            }
        });

        this.cmd_ucbrowser.addEventListener("click", () => {
            /** @type {assetsExplore}  */
            let uc = intenseGenerator.generateUC('@ucdesigner:/Designer/util/assetsExplore.uc.html', { parentUc: this });
            uc.winframe1.showDialog();

        })

        this.cmd_logsession.on('click', () => {
            console.log(this.splitter1.length);
            //console.log(this.ucSession.getSession());
        });
        this.isSaving = false;
        let _this = this;
        this.ucExtends.session.onModify = () => {
            if (_this.isSaving) return;
            _this.isSaving = true;

            timeoutCall.start(() => {

                _this.ucExtends.session.writeFile();
                _this.isSaving = false;
                console.log('saved');
            }, 0);
        }


        //console.log(jqFeatures.data.source);
    }
    /** @param {Usercontrol} uc */
    pushChildSession(uc) {
        let nstamp = uc.ucExtends.self.stamp();
        /** @type {tabChilds}  */
        let row = undefined;
        row = this.SESSION_DATA.children.find(s => s.stamp == nstamp);
        if (row == undefined) {
            row = objectOpt.clone(tabChilds);
            row.stamp = nstamp;
            row.fstamp = uc.ucExtends.fileStamp;
            row.filePath = uc.ucExtends.fileInfo.html.rootPath;

            uc.ucExtends.session.exchangeParentWith(row.session, () => {
                arrayOpt.removeByCallback(this.SESSION_DATA.children,
                    /** @param {tabChilds} s */ s => s.stamp == nstamp);

            });

            this.SESSION_DATA.children.push(row);
            this.ucExtends.session.onModify();
        }
        uc.ucExtends.Events.beforeClose.on(() => {
            let index = this.SESSION_DATA.children.findIndex(s => s.stamp == nstamp);
            //this.SESSION_DATA.inActiveChildren.push(ssn);
            arrayOpt.removeAt(this.SESSION_DATA.children, index);
            this.ucExtends.session.onModify();
        });
    }

}
module.exports = formDesigner;