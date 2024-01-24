const { designerToolsType } = require('@ucdesigner:/enumAndMore.js');
const formDesigner = require('@ucdesigner:/formDesigner.uc.js');
const { ucDesignerATTR, treeRecord } = require('@ucdesigner:/stageContent/ucLayout.uc.enumAndMore.js');
const { UcRendarer } = require('ucbuilder/build/UcRendarer.js');
const { selectionManage } = require('@ucdesigner:/stageContent/ucOutput.uc.selectionManage.js');
const sourceAdeptor = require('@ucdesigner:/stageContent/ucOutput.uc.sourceAdeptor.js');
const { codeFileInfo } = require('ucbuilder/build/codeFileInfo.js');
const { controlOpt, pathInfo, buildOptions, propOpt, uniqOpt } = require('ucbuilder/build/common.js');
const { fileDataBank } = require('ucbuilder/global/fileDataBank.js');
const { Usercontrol } = require('ucbuilder/Usercontrol.js');
const { designer } = require('./ucOutput.uc.designer.js');
const { Rect } = require('ucbuilder/global/drawing/shapes.js');
const { Template } = require('ucbuilder/Template.js');
const fs = require('fs');
const { keyBoard } = require('ucbuilder/global/hardware/keyboard.js');
const { tptManager } = require('@ucdesigner:/stageContent/ucOutput.uc.tptManager.js');
const { ucManager } = require('@ucdesigner:/stageContent/ucOutput.uc.ucManager.js');
const { intenseGenerator } = require('ucbuilder/intenseGenerator.js');
const { ResourcesUC } = require('ucbuilder/ResourcesUC.js');
const { timeoutCall } = require("ucbuilder/global/timeoutCall");

class ucOutput extends designer {
    SESSION_DATA = {
        filePath: "",
        extCode: buildOptions.extType.Usercontrol,
        //jsonPerameters: "{}",
        isActive: false,
    }

    tptManage = new tptManager();
    ucManage = new ucManager();
    srcAdeptor = new sourceAdeptor();
    /**  @param {string} fpath */
    constructor(fpath) {
        super(); this.initializecomponent(arguments, this);
        this.uc_rendar = new UcRendarer();
        /*this.cmd_addTemplate.addEventListener("mousedown", (e) => {
             
             @typedef {import("@ucdesigner:/stageContent/ucOutput/templateInfo/frm_templateCreate.uc.js")} frm_templateCreate
             @type  {frm_templateCreate} 
            let frm = intenseGenerator.generateUC('@ucdesigner:/stageContent/ucOutput/templateInfo/frm_templateCreate.uc.js', {});
            frm.winframe1.showDialog();
        });*/
        //console.log(this.outputBoard);
        /** @type {formDesigner}  */
        this.main = ResourcesUC.resources[designerToolsType.mainForm];
        this.tools = this.main.tools;

        this.srcAdeptor.init(this);
        this.selection.init(this);
        this.tptManage.init(this);
        this.ucManage.init(this);
        this.ucExtends.Events.completeSessionLoad.on(() => {
            if (this.tools.activeEditor == undefined)
                this.tools.set(designerToolsType.editor, this);

        });


        this.ucExtends.session.varify =
            /**
             * 
             * @param {ucOutput.SESSION_DATA} ssn 
             */
            (ssn) => {

            }
        this.ucExtends.Events.beforeClose.on(() => {
            this.tools.activeEditor = undefined;
            this.tools.selectedElementList = [];
            this.tools.dragBucket = [];
        });
        this.ucExtends.Events.loadLastSession.on(() => {
            this.init();
        })
        this.ucExtends.self.addEventListener("focusin", (evt) => {
            this.tools.set(designerToolsType.editor, this);
        });
        if (!this.ucExtends.session.options.loadBySession) {
            let ext = codeFileInfo.getExtType(fpath);
            // console.log(fpath);
            if (ext != undefined)
                this.SESSION_DATA.extCode = ext;
            this.SESSION_DATA.filePath = fpath;
            this.init();
            if (this.tools.activeEditor == undefined)
                this.tools.set(designerToolsType.editor, this);

        }

        this.ucExtends.self.addEventListener("keyup", (e) => {
            if (e.ctrlKey) {
                switch (e.keyCode) {
                    case keyBoard.keys.s:
                        this.saveData();
                        break;
                }
            }
        });

    }
    onCSSChange = (cssText) => {
        this.cssContent = cssText;
        this.Run();
    };
    /**
     * @param {string} jsonContent 
     */
    onJsonChange = (jsonContent) => {
        if (jsonContent == "") {
            this.mainNode.setAttribute(ucDesignerATTR.JSON_ROW, "{}");
            //this.SESSION_DATA.jsonPerameters = "{}";
            this.Run();
        } else {
            try {
                let content = JSON.parse(jsonContent);
                this.mainNode.setAttribute(ucDesignerATTR.JSON_ROW, jsonContent);
                //this.SESSION_DATA.jsonPerameters = jsonContent;
                this.Run();
            } catch {
            }
        }
    };

    saveData() {
        //console.log(this.fInfo.html.fullPath);
        pathInfo.writeFile(this.fInfo.html.fullPath, this.getcleanData());
        pathInfo.writeFile(this.fInfo.designer.fullPath, this.uc_rendar.output.designerCode);
        pathInfo.writeFile(this.fInfo.style.fullPath, this.cssContent);
        if (!fs.existsSync(this.fInfo.code.fullPath))
            pathInfo.writeFile(this.fInfo.code.fullPath, this.uc_rendar.output.jsFileCode);
        this.ucExtends.session.onModify();
        console.log('!!saved..');
    }
    /** @type {UcRendarer}  */
    uc_rendar = undefined;
    init() {
        //console.log(this.SESSION_DATA.filePath);
       
        this.fInfo.extCode = this.SESSION_DATA.extCode;

        this.fInfo.parseUrl(this.SESSION_DATA.filePath);

        this.uc_rendar.init(this.fInfo, this);




        this.cssContent = fileDataBank.readFile(this.fInfo.style.rootPath, {
            replaceContentWithKeys: false
        });
        this.ucExtends.caption = this.fInfo.name;

        let htContent = "";

        switch (this.fInfo.extCode) {
            case buildOptions.extType.template:
                //this.tpt_render = new TptRendarer(this.fInfo, this);
                htContent = fileDataBank.readFile(this.fInfo.html.rootPath, {
                    replaceContentWithKeys: false
                });
                if (this.cssContent == undefined)
                    this.cssContent = fileDataBank.readFile('ucbuilder/appBuilder/Window/build/templete/tpt/styles.css', {
                        replaceContentWithKeys: false
                    });
                break;
            case buildOptions.extType.Usercontrol:

                htContent = fileDataBank.readFile(this.fInfo.html.rootPath, {
                    replaceContentWithKeys: false
                });
                if (this.cssContent == undefined)
                    this.cssContent = fileDataBank.readFile('ucbuilder/appBuilder/Window/build/templete/uc/styles.css', {
                        replaceContentWithKeys: false
                    });
                break;
        }
        //console.log(this.cssContent);
        if (htContent != undefined) {
            if (htContent.trim() == "")
                htContent = `<wrapper ${propOpt.ATTR.FILE_STAMP}="${uniqOpt.guidAs_}" ></wrapper>`;
            try {
                this.mainNode = htContent.$();
            } catch (e) {
                this.mainNode = `<wrapper ${propOpt.ATTR.FILE_STAMP}="${uniqOpt.guidAs_}" ></wrapper>`.$();
            }
        }
        this.srcAdeptor.refill();
        this.Run();

    }
    /** @type {treeRecord[]}  */
    source = [];

    /** @type {number[]} 
    selectedElementList = []; */

    /** @type {number[]}  
    dragBucket = [];*/


    /** @type {HTMLElement}  */
    _mainNode = undefined;
    /** @type {HTMLElement}  */
    get mainNode() { return this._mainNode; }
    set mainNode(val) { this._mainNode = val; /*console.log('setted');*/ }


    /** @type {codeFileInfo}  */
    fInfo = new codeFileInfo();

    /** @type {Usercontrol}  */
    uc = undefined;

    refresh() {
        this.mainNode.querySelectorAll(`[${ucDesignerATTR.SELECTED}='1']`).forEach(s => {
            s.setAttribute(ucDesignerATTR.SELECTED, "0");
        });

        this.srcAdeptor.refill();
        this.Run();
    }
    /** @type {HTMLElement}  */
    _resourcesOfSelection = undefined;
    get resourcesOfSelection() { return this.outputBoard; }
    /** @type {HTMLElement}  */
    outputHT = undefined;
    template = new Template();
    cssContent = "";
    perametersContent = "{}";

    Run() {
        let htmlContents = fileDataBank.getReplacedContent(this.mainNode.outerHTML);
        //console.log(this.getcleanData());
        if (this.outputHT != undefined) this.outputHT.delete();
        switch (this.SESSION_DATA.extCode) {
            case buildOptions.extType.Usercontrol:
                try {
                    if (htmlContents == "") htmlContents = undefined;
                    let _uc = this.uc_rendar.generateUC(htmlContents, fileDataBank.getReplacedContent(this.cssContent));
                    this.outputHT = _uc.ucExtends.self;
                    this.targetOutput.appendChild(this.outputHT);
                    this.outputHT.appendChild(this.outputBoard);
                    timeoutCall.start(() => {
                        this.selection.fillOutputScaleSource(this.tools.selectedElementList);
                        this.main.editorEvent.changeLayout.fire();
                    }, 0);
                } catch (e) {
                    console.log(e);
                }
                break;
            case buildOptions.extType.template:
                try {
                    if (htmlContents == "") htmlContents = undefined;
                    let _tpt = this.uc_rendar.generateTpt(htmlContents, fileDataBank.getReplacedContent(this.cssContent));

                    
                    //this.outputHT = _tpt.extended.generateNode(JSON.parse(this.mainNode.getAttribute(ucDesignerATTR.JSON_ROW))/*JSON.parse(this.SESSION_DATA.jsonPerameters)*/);



                    _tpt.extended.stampRow.passElement(this.outputHT);
                    this.targetOutput.appendChild(this.outputHT);
                    this.outputHT.appendChild(this.outputBoard);
                    
                    timeoutCall.start(() => {
                        this.selection.fillOutputScaleSource(this.tools.selectedElementList);
                        this.main.editorEvent.changeLayout.fire();
                    }, 0);
                } catch (e) {
                    console.log(e);
                }
                break;
        }
    }
    updateSelectionGUI() {
        // this.selection.opResizer.refreshSelection(this.tools.selectedElementList);
    }
    /**
     * @param {Rect} rectObj 
     * @param {HTMLElement} ctr 
     * @param {number} offsetx 
     * @param {number} offsety 
     */
    adjustRect(rectObj, ctr, offsetx, offsety) {
        if (ctr.nodeType == ctr.ELEMENT_NODE) {
            try {
                //console.log(ctr.getClientRects()[0]);
                rectObj.setBy.domRect(ctr.getClientRects()[0]);
                rectObj.location.move(-(offsetx + 1), -(offsety + 1));
                //rectObj.initByStyles(window.getComputedStyle(ctr));
            } catch (e) {
            }
        } else {
            var textNode = ctr;
            var range = document.createRange();
            range.selectNodeContents(textNode);
            var rects = range.getClientRects();
            if (rects.length > 0) {
                rectObj.setBy.domRect(rects);
                rectObj.location.move(-(offsetx + 1), -(offsety + 1));
            }
        }
    }

    selection = new selectionManage();
    getcleanData() {
        /** @type {HTMLElement}  */
        let dtos = this.mainNode.cloneNode(true);
        dtos.querySelectorAll(ucDesignerATTR.TEXT_NODE_TAG).forEach(s => controlOpt.unwrap(s));
        dtos.querySelectorAll("*").forEach(s => {
            s.removeAttribute(ucDesignerATTR.SELECTED);
            s.removeAttribute(ucDesignerATTR.ITEM_INDEX);
            s.removeAttribute(ucDesignerATTR.UNIQID);

        });
        dtos.removeAttribute(ucDesignerATTR.SELECTED);
        dtos.removeAttribute(ucDesignerATTR.ITEM_INDEX);
        dtos.removeAttribute(ucDesignerATTR.UNIQID);

        return dtos.outerHTML;
    }
}
module.exports = ucOutput;