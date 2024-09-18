import { Designer } from './projHandler.uc.designer.js';
import { pathInfo, buildOptions } from 'ucbuilder/build/common';
import { formDesigner } from 'ucdesigner/formDesigner.uc.js';
import { designerToolsType } from 'ucdesigner/enumAndMore.js';
import { pathRecord } from 'ucdesigner/Designer/util/fileExplorer.uc.pathRecord';
import { intenseGenerator } from 'ucbuilder/intenseGenerator.js';
import { ResourcesUC } from 'ucbuilder/ResourcesUC.js';
import { FileDataBank } from 'ucbuilder/global/fileDataBank.js';
import { builder } from 'ucbuilder/build/builder.js';
import { iconFilePath } from 'ucdesigner/Designer/util/fileExplorer.uc.collepser.js';

export let iconDirPath = "ucdesigner/stageContent/projHandler";

(async () => {
    iconDirPath = await iconDirPath.__({});
    
})();
export class projHandler extends Designer {
    SESSION_DATA: any = {
    }
    main: formDesigner;

    
    constructor() {
        super();
        this.initializecomponent(arguments, this);
        this.main = ResourcesUC.resources[designerToolsType.mainForm];
        this.main.tools.set(designerToolsType.projectExplorer, this);
        this.ignoreDirs = builder.ignoreDirs;

        this.initEvent();
        this.filexplorer1.listviewEvents.itemDoubleClick.on((index: number) => {
            let finfo: pathRecord = this.filexplorer1.listview1.source.rows[index];
            switch (finfo.type) {
                case 'file':

                    //case pathInfo.CODEFILE_TYPE.ucHtmlFile:
                    //case pathInfo.CODEFILE_TYPE.ucTemplateFile:
                    let uc = intenseGenerator.generateUC('ucdesigner/stageContent/ucOutput.uc.html', {
                        parentUc: this.main,

                    }, finfo.path);
                    this.main.container1.append(uc.ucExtends.self);
                    this.main.splitter1.pushChildSession(uc);
                    break;
            }
        });
    }

    set ignoreDirs(val: any) { this.filexplorer1.ignoreDirs = val; }
    get ignoreDirs() { return this.filexplorer1.ignoreDirs; }

    set ignoreFiles(val: any) { this.filexplorer1.ignoreFiles = val; }
    get ignoreFiles() { return this.filexplorer1.ignoreFiles; }

    initEvent() {
        let _this = this;
        
        this.filexplorer1.fileExplorerEvents.filterDirs = (row: any) => {
            if (!row.isOpened)
                row.iconFilePath = iconFilePath.folder;
        }
        this.filexplorer1.fileExplorerEvents.filterFiles = (row: any) => {
            row.iconFilePath = iconFilePath.otherFile;
            if (row.path.includes(".uc.")) {
                if (row.path.endsWith(".uc.html")) {
                    row.type = pathInfo.CODEFILE_TYPE.ucHtmlFile;
                    row.iconFilePath = `${iconDirPath}/form.png`;
                    return true;
                } else {
                    return false;
                }
            } else if (row.path.includes(".tpt.")) {
                if (row.path.endsWith(".tpt.html")) {
                    row.type = pathInfo.CODEFILE_TYPE.ucTemplateFile;
                    row.iconFilePath = `${iconDirPath}/template.png`;
                    return true;
                } else {
                    return false;
                }
            }
        }
    }
}