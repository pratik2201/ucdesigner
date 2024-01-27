"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ucStyle = void 0;
const enumAndMore_js_1 = require("ucdesigner/enumAndMore.js");
const ucStyle_uc_designer_1 = require("./ucStyle.uc.designer");
const rootPathHandler_1 = require("ucbuilder/global/rootPathHandler");
const ResourcesUC_js_1 = require("ucbuilder/ResourcesUC.js");
const ace = __importStar(require("ace-builds/ace"));
class ucStyle extends ucStyle_uc_designer_1.Designer {
    constructor() {
        super();
        this.refreshText = () => {
            this.editor.getSession().setValue(this.activeEditor.cssContent);
        };
        this.onchangeText = () => {
            let contnet = this.editor.getSession().getValue();
            this.main.tools.activeEditor.onCSSChange(contnet);
        };
        this.initializecomponent(arguments, this);
        let _this = this;
        this.main = ResourcesUC_js_1.ResourcesUC.resources[enumAndMore_js_1.designerToolsType.mainForm];
        this.main.tools.set(enumAndMore_js_1.designerToolsType.styler, this);
        this.main.editorEvent.activateEditor.on(this.refreshText);
        this.ucExtends.Events.beforeClose.on((evt) => {
            this.main.tools.styleEditor = undefined;
            this.main.editorEvent.activateEditor.off(this.refreshText);
        });
        if (this.activeEditor != undefined)
            this.codeeditor1.value = this.activeEditor.cssContent;
        let inf = rootPathHandler_1.rootPathHandler.getInfoByAlices('@ucdesigner:');
        ace.config.set('basePath', inf.path + "/ace_files");
        this.editor = ace.edit(this.codeeditor1);
        this.editor.setTheme("ace/theme/dreamweaver");
        this.editor.session.setMode("ace/mode/scss");
        this.editor.session.setTabSize(4);
        this.editor.setOptions({
            enableBasicAutocompletion: true
        });
        this.ucExtends.self.addEventListener("focusin", (e) => {
            this.editor.getSession().on('change', this.onchangeText);
        });
        this.ucExtends.self.addEventListener("blur", (e) => {
            this.editor.getSession().off('change', this.onchangeText);
        });
        _this.main.editorEvent.activateEditor.on(() => {
            if (this.activeEditor != undefined)
                this.codeeditor1.value = this.activeEditor.cssContent;
        });
    }
    get activeEditor() { return this.main.tools.activeEditor; }
    get mainNode() { return this.activeEditor.mainNode; }
}
exports.ucStyle = ucStyle;
