"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formDesigner = void 0;
const enumAndMore_1 = require("ucdesigner/enumAndMore");
const commonEvent_1 = require("ucbuilder/global/commonEvent");
const formDesigner_uc_designer_1 = require("./formDesigner.uc.designer");
const common_1 = require("ucbuilder/build/common");
const keyboard_1 = require("ucbuilder/global/hardware/keyboard");
const fs_1 = __importDefault(require("fs"));
const intenseGenerator_1 = require("ucbuilder/intenseGenerator");
const ResourcesUC_1 = require("ucbuilder/ResourcesUC");
const timeoutCall_1 = require("ucbuilder/global/timeoutCall");
class formDesigner extends formDesigner_uc_designer_1.Designer {
    constructor() {
        super();
        this.SESSION_DATA = {};
        this.tools = {
            selectedElementList: [],
            dragBucket: [],
            controlInfo: undefined,
            projectExplorer: undefined,
            activeEditor: undefined,
            styleEditor: undefined,
            layoutManager: undefined,
            jsonPeramaterEditor: undefined,
            set: (type /*designerToolsType*/, uc) => {
                let tls = this.tools;
                switch (type) {
                    case enumAndMore_1.designerToolsType.controlInfo:
                        if (tls.controlInfo == undefined) {
                            tls.controlInfo = uc;
                            return true;
                        }
                        break;
                    case enumAndMore_1.designerToolsType.projectExplorer:
                        if (tls.projectExplorer == undefined) {
                            tls.projectExplorer = uc;
                            return true;
                        }
                        break;
                    case enumAndMore_1.designerToolsType.jsonPerameter:
                        if (tls.jsonPeramaterEditor == undefined) {
                            tls.jsonPeramaterEditor = uc;
                            return true;
                        }
                        break;
                    case enumAndMore_1.designerToolsType.styler:
                        if (tls.styleEditor == undefined) {
                            tls.styleEditor = uc;
                            return true;
                        }
                        break;
                    case enumAndMore_1.designerToolsType.layout:
                        if (tls.layoutManager == undefined) {
                            tls.layoutManager = uc;
                            return true;
                        }
                        break;
                    case enumAndMore_1.designerToolsType.editor:
                        if (tls.activeEditor == undefined || !tls.activeEditor.ucExtends.self.is(uc.ucExtends.self)) {
                            tls.activeEditor = uc;
                            this.editorEvent.activateEditor.fire( /*[uc]*/);
                            return true;
                        }
                        break;
                }
                return false;
            },
        };
        this.editorEvent = {
            changeLayout: new commonEvent_1.CommonEvent(),
            activateEditor: new commonEvent_1.CommonEvent(),
            selectControl: new commonEvent_1.CommonEvent(),
        };
        this.isSaving = false;
        this.initializecomponent(arguments, this);
        this.splitter1.initMain(this.container1);
        this.cmd_deletesesion.addEventListener("mousedown", () => {
            common_1.pathInfo.removeFile(this.ucExtends.session.dataPath);
            console.clear();
            console.log('done.');
        });
        this.cmd_resetsesion.addEventListener("mousedown", () => {
            common_1.pathInfo.removeFile(this.ucExtends.session.dataPath);
            fs_1.default.copyFileSync(this.ucExtends.session.dataPath + ".src", this.ucExtends.session.dataPath);
            console.clear();
            console.log('done.');
        });
        this.cmd_sample1.addEventListener("mousedown", () => {
            // let uc: import('ucbuilder/appBuilder/demo/create_ledger.uc').default = intenseGenerator.generateUC('ucbuilder/appBuilder/demo/create_ledger.uc.js', { parentUc: undefined, wrapperHT: undefined });
            // uc.winframe1.showDialog();
        });
        this.cmd_sample2.addEventListener("mousedown", () => {
            // let uc: import('@testnpm:/main/newStyle/create_ledger.uc.js').default = intenseGenerator.generateUC('@testnpm:/main/newStyle/create_ledger.uc.js', { parentUc: undefined, wrapperHT: undefined });
            // uc.winframe1.showDialog();
        });
        this.cmd_built.addEventListener("click", () => {
            console.clear();
            let builder = require('ucbuilder/build/builder').builder;
            let mgen = new builder();
            mgen.buildALL();
            console.log('BUILD SUCCESSFULL...');
        });
        ResourcesUC_1.ResourcesUC.resources[enumAndMore_1.designerToolsType.mainForm] = this;
        this.init();
        this.ucExtends.self.addEventListener("keyup", (e) => {
            switch (e.keyCode) {
                case keyboard_1.keyBoard.keys.f4:
                    if (this.tools.controlInfo != undefined) {
                        this.tools.controlInfo.ucExtends.self.focus();
                    }
                    break;
            }
        });
    }
    refreshActiveEditor() {
        if (this.tools.activeEditor != undefined)
            this.tools.activeEditor.refresh();
    }
    init() {
        this.ucExtends.session.readfile();
        this.cmd_layout.on('mousedown', () => {
            if (this.tools.layoutManager == undefined) {
                let uc = intenseGenerator_1.intenseGenerator.generateUC('ucdesigner/stageContent/ucLayout.uc.html', { parentUc: this });
                this.container1.append(uc.ucExtends.self);
                this.splitter1.pushChildSession(uc);
            }
        });
        this.cmd_style.on('mousedown', () => {
            if (this.tools.styleEditor == undefined) {
                let uc = intenseGenerator_1.intenseGenerator.generateUC('ucdesigner/stageContent/ucStyle.uc.html', { parentUc: this });
                this.container1.append(uc.ucExtends.self);
                this.splitter1.pushChildSession(uc);
            }
        });
        this.cmd_jsonPera.on('mousedown', () => {
            if (this.tools.jsonPeramaterEditor == undefined) {
                let uc = intenseGenerator_1.intenseGenerator.generateUC('ucdesigner/stageContent/ucJsonPerameterEditor.uc.html', { parentUc: this });
                this.container1.append(uc.ucExtends.self);
                this.splitter1.pushChildSession(uc);
            }
        });
        this.cmd_fileExplorer.on('mousedown', () => {
            if (this.tools.styleEditor == undefined) {
                let uc = intenseGenerator_1.intenseGenerator.generateUC('ucdesigner/stageContent/projHandler.uc.html', { parentUc: this });
                this.container1.append(uc.ucExtends.self);
                this.splitter1.pushChildSession(uc);
            }
        });
        this.cmd_controlInfo.addEventListener("mousedown", () => {
            if (this.tools.controlInfo == undefined) {
                let uc = intenseGenerator_1.intenseGenerator.generateUC('ucdesigner/stageContent/controlInfo.uc.html', { parentUc: this });
                this.container1.append(uc.ucExtends.self);
                this.splitter1.pushChildSession(uc);
            }
        });
        this.cmd_ucbrowser.addEventListener("click", () => {
            let uc = intenseGenerator_1.intenseGenerator.generateUC('ucdesigner/Designer/util/assetsExplore.uc.html', { parentUc: this });
            uc.winframe1.showDialog();
        });
        this.cmd_logsession.on('click', () => {
            console.log(this.splitter1.length);
        });
        this.isSaving = false;
        let _this = this;
        this.ucExtends.session.onModify = () => {
            if (_this.isSaving)
                return;
            _this.isSaving = true;
            timeoutCall_1.timeoutCall.start(() => {
                _this.ucExtends.session.writeFile();
                _this.isSaving = false;
                console.log('saved');
            });
        };
    }
}
exports.formDesigner = formDesigner;
