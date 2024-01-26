import { Designer } from './projHandler.uc.designer.js';
import { pathInfo, buildOptions } from 'ucbuilder/build/common';
import {formDesigner} from 'ucdesigner/formDesigner.uc.js';
import { designerToolsType } from 'ucdesigner/enumAndMore.js';
import { pathRecord } from 'ucdesigner/Designer/util/fileExplorer.uc.pathRecord';
import { intenseGenerator } from 'ucbuilder/intenseGenerator.js';
import { ResourcesUC } from 'ucbuilder/ResourcesUC.js';
import { FileDataBank } from 'ucdesigner/../ucbuilder/global/fileDataBank.js';

export class projHandler extends Designer {
    SESSION_DATA: any = {
    }
    main: formDesigner;
    ignoreDirs: any;
    ignoreFiles: any;
    static iconDirPath: string = "ucdesigner/stageContent/projHandler".__();

    constructor() {
        super();
        this.initializecomponent(arguments, this);
        this.main = ResourcesUC.resources[designerToolsType.mainForm];
        this.main.tools.set(designerToolsType.projectExplorer, this);
        this.ignoreDirs = require('ucbuilder/build/builder').builder.ignoreDirs;

        this.initEvent();
        this.filexplorer1.listviewEvents.itemDoubleClick.on((index: number) => {
            let finfo: pathRecord = this.filexplorer1.listview1.source.rows[index];
            switch (finfo.type) {
                case pathInfo.CODEFILE_TYPE.ucHtmlFile:
                case pathInfo.CODEFILE_TYPE.ucTemplateFile:
                    let uc = intenseGenerator.generateUC('ucdesigner/stageContent/ucOutput.uc.html', {
                        parentUc: this.main,

                    }, finfo.path);
                    this.main.container1.append(uc.ucExtends.self);
                    this.main.pushChildSession(uc);
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
                row.iconFilePath = this.filexplorer1.manager.iconFilePath.folder;
        }
        this.filexplorer1.fileExplorerEvents.filterFiles = (row: any) => {
            row.iconFilePath = this.filexplorer1.manager.iconFilePath.otherFile;
            if (row.path.includes(".uc.")) {
                if (row.path.endsWith(".uc.html")) {
                    row.type = pathInfo.CODEFILE_TYPE.ucHtmlFile;
                    row.iconFilePath = `${projHandler.iconDirPath}/form.png`;
                    return true;
                } else {
                    return false;
                }
            } else if (row.path.includes(".tpt.")) {
                if (row.path.endsWith(".tpt.html")) {
                    row.type = pathInfo.CODEFILE_TYPE.ucTemplateFile;
                    row.iconFilePath = `${projHandler.iconDirPath}/template.png`;
                    return true;
                } else {
                    return false;
                }
            }
        }
    }
}