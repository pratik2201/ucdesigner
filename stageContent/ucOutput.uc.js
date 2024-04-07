"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ucOutput = void 0;
const enumAndMore_js_1 = require("ucdesigner/enumAndMore.js");
const ucLayout_uc_enumAndMore_js_1 = require("ucdesigner/stageContent/ucLayout.uc.enumAndMore.js");
const UcRendarer_js_1 = require("ucbuilder/build/UcRendarer.js");
const ucOutput_uc_selectionManage_js_1 = require("ucdesigner/stageContent/ucOutput.uc.selectionManage.js");
const ucOutput_uc_sourceAdeptor_js_1 = require("ucdesigner/stageContent/ucOutput.uc.sourceAdeptor.js");
const codeFileInfo_js_1 = require("ucbuilder/build/codeFileInfo.js");
const common_js_1 = require("ucbuilder/build/common.js");
const fileDataBank_js_1 = require("ucbuilder/global/fileDataBank.js");
const ucOutput_uc_designer_js_1 = require("./ucOutput.uc.designer.js");
const Template_js_1 = require("ucbuilder/Template.js");
const fs_1 = __importDefault(require("fs"));
const keyboard_js_1 = require("ucbuilder/global/hardware/keyboard.js");
const ucOutput_uc_tptManager_js_1 = require("ucdesigner/stageContent/ucOutput.uc.tptManager.js");
const ucOutput_uc_ucManager_js_1 = require("ucdesigner/stageContent/ucOutput.uc.ucManager.js");
const ResourcesUC_js_1 = require("ucbuilder/ResourcesUC.js");
const timeoutCall_1 = require("ucbuilder/global/timeoutCall");
class ucOutput extends ucOutput_uc_designer_js_1.Designer {
    constructor(fpath) {
        super();
        this.SESSION_DATA = {
            filePath: "",
            extCode: '.uc',
            isActive: false,
        };
        this.source = [];
        this.tptManage = new ucOutput_uc_tptManager_js_1.tptManager();
        this.ucManage = new ucOutput_uc_ucManager_js_1.ucManager();
        this.srcAdeptor = new ucOutput_uc_sourceAdeptor_js_1.sourceAdeptor();
        this.onCSSChange = (cssText) => {
            this.cssContent = cssText;
            this.Run();
        };
        this.onJsonChange = (jsonContent) => {
            if (jsonContent == "") {
                this.mainNode.setAttribute(ucLayout_uc_enumAndMore_js_1.ucDesignerATTR.JSON_ROW, "{}");
                this.Run();
            }
            else {
                try {
                    let content = JSON.parse(jsonContent);
                    this.mainNode.setAttribute(ucLayout_uc_enumAndMore_js_1.ucDesignerATTR.JSON_ROW, jsonContent);
                    this.Run();
                }
                catch (_a) {
                }
            }
        };
        this.uc_rendar = undefined;
        this._mainNode = undefined;
        this.fInfo = new codeFileInfo_js_1.codeFileInfo('none');
        this.uc = undefined;
        this._resourcesOfSelection = undefined;
        this.outputHT = undefined;
        this.template = new Template_js_1.Template();
        this.cssContent = "";
        this.perametersContent = "{}";
        this.selection = new ucOutput_uc_selectionManage_js_1.selectionManage();
        this.initializecomponent(arguments, this);
        this.uc_rendar = new UcRendarer_js_1.UcRendarer();
        this.main = ResourcesUC_js_1.ResourcesUC.resources[enumAndMore_js_1.designerToolsType.mainForm];
        this.srcAdeptor.init(this);
        this.selection.init(this);
        this.tptManage.init(this);
        this.ucManage.init(this);
        this.ucExtends.Events.completeSessionLoad.on(() => {
            if (this.tools.activeEditor == undefined)
                this.tools.set(enumAndMore_js_1.designerToolsType.editor, this);
        });
        this.ucExtends.session.varify = (ssn) => {
            return true;
        };
        this.ucExtends.Events.beforeClose.on(() => {
            this.tools.activeEditor = undefined;
            this.tools.selectedElementList = [];
            this.tools.dragBucket = [];
        });
        this.ucExtends.Events.loadLastSession.on(() => {
            this.init();
        });
        this.ucExtends.self.addEventListener("focusin", (evt) => {
            this.tools.set(enumAndMore_js_1.designerToolsType.editor, this);
        });
        if (!this.ucExtends.session.options.loadBySession) {
            let ext = codeFileInfo_js_1.codeFileInfo.getExtType(fpath);
            if (ext != undefined)
                this.SESSION_DATA.extCode = ext;
            this.SESSION_DATA.filePath = fpath;
            this.init();
            if (this.tools.activeEditor == undefined)
                this.tools.set(enumAndMore_js_1.designerToolsType.editor, this);
        }
        this.ucExtends.self.addEventListener("keyup", (e) => {
            if (e.ctrlKey) {
                switch (e.keyCode) {
                    case keyboard_js_1.keyBoard.keys.s:
                        this.saveData();
                        break;
                }
            }
        });
    }
    get tools() { return this.main.tools; }
    saveData() {
        common_js_1.pathInfo.writeFile(this.fInfo.html.fullPath, this.getcleanData());
        common_js_1.pathInfo.writeFile(this.fInfo.designer.fullPath, this.uc_rendar.output.designerCode);
        common_js_1.pathInfo.writeFile(this.fInfo.style.fullPath, this.cssContent);
        if (!fs_1.default.existsSync(this.fInfo.code.fullPath))
            common_js_1.pathInfo.writeFile(this.fInfo.code.fullPath, this.uc_rendar.output.jsFileCode);
        this.ucExtends.session.onModify();
        console.log('!!saved..');
    }
    init() {
        this.fInfo.extCode = this.SESSION_DATA.extCode;
        this.fInfo.parseUrl(this.SESSION_DATA.filePath);
        this.uc_rendar.init(this.fInfo, this);
        this.cssContent = fileDataBank_js_1.FileDataBank.readFile(this.fInfo.style.rootPath, {
            replaceContentWithKeys: false
        });
        this.ucExtends.caption = this.fInfo.name;
        let htContent = "";
        switch (this.fInfo.extCode) {
            case common_js_1.buildOptions.extType.template:
                htContent = fileDataBank_js_1.FileDataBank.readFile(this.fInfo.html.rootPath, {
                    replaceContentWithKeys: false
                });
                if (this.cssContent == undefined)
                    this.cssContent = fileDataBank_js_1.FileDataBank.readFile('ucbuilder/appBuilder/Window/build/templete/tpt/styles.css', {
                        replaceContentWithKeys: false
                    });
                break;
            case common_js_1.buildOptions.extType.Usercontrol:
                htContent = fileDataBank_js_1.FileDataBank.readFile(this.fInfo.html.rootPath, {
                    replaceContentWithKeys: false
                });
                if (this.cssContent == undefined)
                    this.cssContent = fileDataBank_js_1.FileDataBank.readFile('ucbuilder/appBuilder/Window/build/templete/uc/styles.css', {
                        replaceContentWithKeys: false
                    });
                break;
        }
        if (htContent != undefined) {
            if (htContent.trim() == "")
                htContent = `<wrapper ${common_js_1.propOpt.ATTR.FILE_STAMP}="${common_js_1.uniqOpt.guidAs_}" ></wrapper>`;
            try {
                this.mainNode = htContent.$();
            }
            catch (e) {
                this.mainNode = `<wrapper ${common_js_1.propOpt.ATTR.FILE_STAMP}="${common_js_1.uniqOpt.guidAs_}" ></wrapper>`.$();
            }
        }
        this.srcAdeptor.refill();
        this.Run();
    }
    get mainNode() { return this._mainNode; }
    set mainNode(val) { this._mainNode = val; }
    refresh() {
        this.mainNode.querySelectorAll(`[${ucLayout_uc_enumAndMore_js_1.ucDesignerATTR.SELECTED}='1']`).forEach(s => {
            s.setAttribute(ucLayout_uc_enumAndMore_js_1.ucDesignerATTR.SELECTED, "0");
        });
        this.srcAdeptor.refill();
        this.Run();
    }
    get resourcesOfSelection() { return this.outputBoard; }
    Run() {
        let htmlContents = fileDataBank_js_1.FileDataBank.getReplacedContent(this.mainNode.outerHTML);
        if (this.outputHT != undefined)
            this.outputHT.delete();
        switch (this.SESSION_DATA.extCode) {
            case common_js_1.buildOptions.extType.Usercontrol:
                try {
                    if (htmlContents == "")
                        htmlContents = undefined;
                    let _uc = this.uc_rendar.generateUC(htmlContents, fileDataBank_js_1.FileDataBank.getReplacedContent(this.cssContent));
                    this.outputHT = _uc.ucExtends.self;
                    this.targetOutput.appendChild(this.outputHT);
                    this.outputHT.appendChild(this.outputBoard);
                    timeoutCall_1.timeoutCall.start(() => {
                        this.selection.fillOutputScaleSource(this.tools.selectedElementList);
                        this.main.editorEvent.changeLayout.fire();
                    });
                }
                catch (e) {
                    console.log(e);
                }
                break;
            case common_js_1.buildOptions.extType.template:
                try {
                    if (htmlContents == "")
                        htmlContents = undefined;
                    let _tpt = this.uc_rendar.generateTpt(htmlContents, fileDataBank_js_1.FileDataBank.getReplacedContent(this.cssContent));
                    _tpt.extended.stampRow.passElement(this.outputHT);
                    this.targetOutput.appendChild(this.outputHT);
                    this.outputHT.appendChild(this.outputBoard);
                    timeoutCall_1.timeoutCall.start(() => {
                        this.selection.fillOutputScaleSource(this.tools.selectedElementList);
                        this.main.editorEvent.changeLayout.fire();
                    });
                }
                catch (e) {
                    console.log(e);
                }
                break;
        }
    }
    updateSelectionGUI() {
    }
    adjustRect(rectObj, ctr, offsetx, offsety) {
        if (ctr.nodeType == ctr.ELEMENT_NODE) {
            try {
                rectObj.setBy.domRect(ctr.getClientRects()[0]);
                rectObj.location.move(-(offsetx + 1), -(offsety + 1));
            }
            catch (e) {
            }
        }
        else {
            var textNode = ctr;
            var range = document.createRange();
            range.selectNodeContents(textNode);
            var rects = range.getClientRects();
            if (rects.length > 0) {
                rectObj.setBy.domRect(rects[0]);
                rectObj.location.move(-(offsetx + 1), -(offsety + 1));
            }
        }
    }
    getcleanData() {
        let dtos = this.mainNode.cloneNode(true);
        dtos.querySelectorAll(ucLayout_uc_enumAndMore_js_1.ucDesignerATTR.TEXT_NODE_TAG)
            .forEach(s => common_js_1.controlOpt.unwrap(s));
        dtos.querySelectorAll("*").forEach(s => {
            s.removeAttribute(ucLayout_uc_enumAndMore_js_1.ucDesignerATTR.SELECTED);
            s.removeAttribute(ucLayout_uc_enumAndMore_js_1.ucDesignerATTR.ITEM_INDEX);
            s.removeAttribute(ucLayout_uc_enumAndMore_js_1.ucDesignerATTR.UNIQID);
        });
        dtos.removeAttribute(ucLayout_uc_enumAndMore_js_1.ucDesignerATTR.SELECTED);
        dtos.removeAttribute(ucLayout_uc_enumAndMore_js_1.ucDesignerATTR.ITEM_INDEX);
        dtos.removeAttribute(ucLayout_uc_enumAndMore_js_1.ucDesignerATTR.UNIQID);
        return dtos.outerHTML;
    }
}
exports.ucOutput = ucOutput;
