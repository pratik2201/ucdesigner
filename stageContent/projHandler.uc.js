const { designer } = require('./projHandler.uc.designer.js');
const { pathInfo, buildOptions } = require('@ucbuilder:/build/common');
const formDesigner = require('@ucdesigner:/formDesigner.uc.js');
const { designerToolsType } = require('@ucdesigner:/enumAndMore.js');
const { pathRecord } = require('@ucdesigner:/Designer/util/fileExplorer.uc.pathRecord');
const { intenseGenerator } = require('@ucbuilder:/intenseGenerator.js');
const { ResourcesUC } = require('@ucbuilder:/ResourcesUC.js');

class projHandler extends designer {
    SESSION_DATA = {
    }
    constructor() {
        eval(designer.giveMeHug);
        /** @type {formDesigner}  */
        this.main = ResourcesUC.resources[designerToolsType.mainForm];
        this.main.tools.set(designerToolsType.projectExplorer, this);
        this.ignoreDirs = require('@ucbuilder:/build/builder').builder.ignoreDirs;
      
        this.initEvent();
        this.filexplorer1.listviewEvents.itemDoubleClick.on((index) => {
            /** @type {pathRecord}  */
            let finfo = this.filexplorer1.listview1.source.rows[index];
            switch (finfo.type) {
                case pathInfo.CODEFILE_TYPE.ucHtmlFile:
                case pathInfo.CODEFILE_TYPE.ucTemplateFile:
                    let uc = intenseGenerator.generateUC('@ucdesigner:/stageContent/ucOutput.uc.html', {
                        parentUc: this.main,

                    }, finfo.path);
                    this.main.container1.append(uc.ucExtends.self);
                    this.main.pushChildSession(uc);
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
                row.iconFilePath = this.filexplorer1.manager.iconFilePath.folder;
        }
        this.filexplorer1.fileExplorerEvents.filterFiles = (row) => {
            row.iconFilePath = this.filexplorer1.manager.iconFilePath.otherFile;
            if (row.path.includes(".uc.")) {
                if (row.path.endsWith(".uc.html")) {
                    row.type = pathInfo.CODEFILE_TYPE.ucHtmlFile;
                    row.iconFilePath = "stageContent/resource/form.png";
                    return true;
                } else {
                    return false;
                }
            } else if (row.path.includes(".tpt.")) {
                if (row.path.endsWith(".tpt.html")) {
                    row.type = pathInfo.CODEFILE_TYPE.ucTemplateFile;
                    row.iconFilePath = "stageContent/resource/template.png";
                    return true;
                } else {
                    return false;
                }
            }
        }

    }
}
module.exports = projHandler;