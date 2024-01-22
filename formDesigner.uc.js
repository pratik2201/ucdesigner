const { designerToolsType } = require('@ucdesigner:/enumAndMore.js');
const { commonEvent } = require('ucbuilder/global/commonEvent.js');
const { designer } = require('./formDesigner.uc.designer.js');
const {  pathInfo } = require('ucbuilder/build/common.js');
const { keyBoard } = require('ucbuilder/global/hardware/keyboard.js');
const fs = require('fs');
const { intenseGenerator } = require('ucbuilder/intenseGenerator.js');
const { ResourcesUC } = require('ucbuilder/ResourcesUC.js');
const { timeoutCall } = require('ucbuilder/global/timeoutCall.js');
/**
 * @typedef {import('@ucdesigner:/stageContent/projHandler.uc.js')} projHandler
 * @typedef {import('@ucdesigner:/stageContent/ucOutput.uc.js')} ucOutput
 * @typedef {import('@ucdesigner:/stageContent/ucStyle.uc.js')} ucStyle
 * @typedef {import('@ucdesigner:/stageContent/ucLayout.uc.js')} ucLayout
 * @typedef {import('@ucdesigner:/Designer/util/assetsExplore.uc.js')} assetsExplore
 * @typedef {import('@ucdesigner:/stageContent/ucJsonPerameterEditor.uc.js')} ucJsonPerameterEditor
 * @typedef {import('@ucdesigner:/stageContent/controlInfo.uc.js')} controlInfo 
 * @typedef {import('ucbuilder/Usercontrol.js').Usercontrol} Usercontrol
 */
class formDesigner extends designer {

    SESSION_DATA = {

    }
    
    constructor() {
        eval(designer.giveMeHug);
        //this.splitter1.containerList
        this.splitter1.initMain(this.container1);
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
        


        this.cmd_sample1.addEventListener("mousedown", () => {
            /**  @type {import ('ucbuilder/appBuilder/demo/create_ledger.uc.js')} (winFrame) */
            let uc = intenseGenerator.generateUC('ucbuilder/appBuilder/demo/create_ledger.uc.js', { parentUc: undefined, wrapperHT: undefined });
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
            let { builder } = require('ucbuilder/build/builder');
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
                    if (tls.controlInfo == undefined) { tls.controlInfo = uc;  return true; }
                    break;
                case designerToolsType.projectExplorer:
                    if (tls.projectExplorer == undefined) { tls.projectExplorer = uc;  return true; }
                    break;
                case designerToolsType.jsonPerameter:
                    if (tls.jsonPeramaterEditor == undefined) { tls.jsonPeramaterEditor = uc; return true; }
                    break;
                case designerToolsType.styler:
                    if (tls.styleEditor == undefined) { tls.styleEditor = uc;  return true; }
                    break;
                case designerToolsType.layout:
                    if (tls.layoutManager == undefined) { tls.layoutManager = uc;  return true; }
                    break;
                case designerToolsType.editor:
                    if (tls.activeEditor == undefined || !tls.activeEditor.ucExtends.self.is(uc.ucExtends.self)) {
                        tls.activeEditor = uc;
                        
                        this.editorEvent.activateEditor.fire(uc);
                        return true;
                    }
                    break;
            }
            return false;
        },

    };
    
   
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
    

    init() {
        this.ucExtends.session.readfile();
        this.cmd_layout.on('mousedown', () => {
            if (this.tools.layoutManager == undefined) {
                let uc = intenseGenerator.generateUC('@ucdesigner:/stageContent/ucLayout.uc.html', { parentUc: this });
                this.container1.append(uc.ucExtends.self);
                this.splitter1.pushChildSession(uc);
                //this.splitter1.dropUc(this.splitterRolesType.contentEditor, '@ucdesigner:/stageContent/ucLayout.uc.html');
            }
        });
        this.cmd_style.on('mousedown', () => {
            if (this.tools.styleEditor == undefined) {
                let uc = intenseGenerator.generateUC('@ucdesigner:/stageContent/ucStyle.uc.html', { parentUc: this });
                this.container1.append(uc.ucExtends.self);
                this.splitter1.pushChildSession(uc);
                //this.splitter1.dropUc(this.splitterRolesType.contentEditor, '@ucdesigner:/stageContent/ucStyle.uc.html');
            }
        });

        this.cmd_jsonPera.on('mousedown', () => {
            if (this.tools.jsonPeramaterEditor == undefined) {
                let uc = intenseGenerator.generateUC('@ucdesigner:/stageContent/ucJsonPerameterEditor.uc.html', { parentUc: this });
                this.container1.append(uc.ucExtends.self);
                this.splitter1.pushChildSession(uc);
                //this.splitter1.dropUc(this.splitterRolesType.contentEditor, '@ucdesigner:/stageContent/ucStyle.uc.html');
            }
        });
        this.cmd_fileExplorer.on('mousedown', () => {
            if (this.tools.styleEditor == undefined) {
                let uc = intenseGenerator.generateUC('@ucdesigner:/stageContent/projHandler.uc.html', { parentUc: this });
                this.container1.append(uc.ucExtends.self);
                this.splitter1.pushChildSession(uc);
            }
        });
        this.cmd_controlInfo.addEventListener("mousedown", () => {
            if (this.tools.controlInfo == undefined) {
                /** @type {controlInfo}  */
                let uc = intenseGenerator.generateUC('@ucdesigner:/stageContent/controlInfo.uc.html', { parentUc: this });
                this.container1.append(uc.ucExtends.self);
                this.splitter1.pushChildSession(uc);
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
    }
}
module.exports = formDesigner;