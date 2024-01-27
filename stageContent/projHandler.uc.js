"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projHandler = exports.iconDirPath = void 0;
const projHandler_uc_designer_js_1 = require("./projHandler.uc.designer.js");
const common_1 = require("ucbuilder/build/common");
const enumAndMore_js_1 = require("ucdesigner/enumAndMore.js");
const intenseGenerator_js_1 = require("ucbuilder/intenseGenerator.js");
const ResourcesUC_js_1 = require("ucbuilder/ResourcesUC.js");
const builder_js_1 = require("ucbuilder/build/builder.js");
const fileExplorer_uc_collepser_js_1 = require("ucdesigner/Designer/util/fileExplorer.uc.collepser.js");
exports.iconDirPath = "ucdesigner/stageContent/projHandler";
(() => __awaiter(void 0, void 0, void 0, function* () {
    exports.iconDirPath = yield exports.iconDirPath.__({});
}))();
class projHandler extends projHandler_uc_designer_js_1.Designer {
    constructor() {
        super();
        this.SESSION_DATA = {};
        this.initializecomponent(arguments, this);
        this.main = ResourcesUC_js_1.ResourcesUC.resources[enumAndMore_js_1.designerToolsType.mainForm];
        this.main.tools.set(enumAndMore_js_1.designerToolsType.projectExplorer, this);
        this.ignoreDirs = builder_js_1.builder.ignoreDirs;
        this.initEvent();
        this.filexplorer1.listviewEvents.itemDoubleClick.on((index) => {
            let finfo = this.filexplorer1.listview1.source.rows[index];
            switch (finfo.type) {
                case 'file':
                    //case pathInfo.CODEFILE_TYPE.ucHtmlFile:
                    //case pathInfo.CODEFILE_TYPE.ucTemplateFile:
                    let uc = intenseGenerator_js_1.intenseGenerator.generateUC('ucdesigner/stageContent/ucOutput.uc.html', {
                        parentUc: this.main,
                    }, finfo.path);
                    this.main.container1.append(uc.ucExtends.self);
                    this.main.splitter1.pushChildSession(uc);
                    break;
            }
        });
    }
    set ignoreDirs(val) { this.filexplorer1.ignoreDirs = val; }
    get ignoreDirs() { return this.filexplorer1.ignoreDirs; }
    set ignoreFiles(val) { this.filexplorer1.ignoreFiles = val; }
    get ignoreFiles() { return this.filexplorer1.ignoreFiles; }
    initEvent() {
        let _this = this;
        this.filexplorer1.fileExplorerEvents.filterDirs = (row) => {
            if (!row.isOpened)
                row.iconFilePath = fileExplorer_uc_collepser_js_1.iconFilePath.folder;
        };
        this.filexplorer1.fileExplorerEvents.filterFiles = (row) => {
            row.iconFilePath = fileExplorer_uc_collepser_js_1.iconFilePath.otherFile;
            if (row.path.includes(".uc.")) {
                if (row.path.endsWith(".uc.html")) {
                    row.type = common_1.pathInfo.CODEFILE_TYPE.ucHtmlFile;
                    row.iconFilePath = `${exports.iconDirPath}/form.png`;
                    return true;
                }
                else {
                    return false;
                }
            }
            else if (row.path.includes(".tpt.")) {
                if (row.path.endsWith(".tpt.html")) {
                    row.type = common_1.pathInfo.CODEFILE_TYPE.ucTemplateFile;
                    row.iconFilePath = `${exports.iconDirPath}/template.png`;
                    return true;
                }
                else {
                    return false;
                }
            }
        };
    }
}
exports.projHandler = projHandler;
