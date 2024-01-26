import { designerToolsType } from 'ucdesigner/enumAndMore';
import { CommonEvent } from 'ucbuilder/global/commonEvent';
import { Designer } from './formDesigner.uc.designer';
import { pathInfo } from 'ucbuilder/build/common';
import { keyBoard } from 'ucbuilder/global/hardware/keyboard';
import fs from 'fs';
import { intenseGenerator } from 'ucbuilder/intenseGenerator';
import { ResourcesUC } from 'ucbuilder/ResourcesUC';
import { timeoutCall } from 'ucbuilder/global/timeoutCall';
import { controlInfo } from 'ucdesigner/stageContent/controlInfo.uc';
import { projHandler } from 'ucdesigner/stageContent/projHandler.uc';
import { ucOutput } from 'ucdesigner/stageContent/ucOutput.uc';
import { ucStyle } from 'ucdesigner/stageContent/ucStyle.uc';
import { ucLayout } from 'ucdesigner/stageContent/ucLayout.uc';
import { ucJsonPerameterEditor } from 'ucdesigner/stageContent/ucJsonPerameterEditor.uc';
import { Usercontrol } from 'ucbuilder/Usercontrol';
import { assetsExplore } from './Designer/util/assetsExplore.uc';

export class formDesigner extends Designer {

    SESSION_DATA: any = {};

    constructor() {
        super();
        this.initializecomponent(arguments, this);
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
        selectedElementList: [] as number[],
        dragBucket: [] as number[],
        controlInfo: undefined as controlInfo,
        projectExplorer: undefined as projHandler,
        activeEditor: undefined as ucOutput,
        styleEditor: undefined as ucStyle,
        layoutManager: undefined as ucLayout,
        jsonPeramaterEditor: undefined as ucJsonPerameterEditor,

        set: (type: string/*designerToolsType*/, uc: Usercontrol): boolean | undefined => {
            let tls = this.tools;
            switch (type) {
                case designerToolsType.controlInfo:
                    if (tls.controlInfo == undefined) { tls.controlInfo = uc as controlInfo; return true; }
                    break;
                case designerToolsType.projectExplorer:
                    if (tls.projectExplorer == undefined) { tls.projectExplorer = uc as projHandler; return true; }
                    break;
                case designerToolsType.jsonPerameter:
                    if (tls.jsonPeramaterEditor == undefined) { tls.jsonPeramaterEditor = uc as ucJsonPerameterEditor; return true; }
                    break;
                case designerToolsType.styler:
                    if (tls.styleEditor == undefined) { tls.styleEditor = uc as ucStyle; return true; }
                    break;
                case designerToolsType.layout:
                    if (tls.layoutManager == undefined) { tls.layoutManager = uc as ucLayout; return true; }
                    break;
                case designerToolsType.editor:
                    if (tls.activeEditor == undefined || !tls.activeEditor.ucExtends.self.is(uc.ucExtends.self)) {
                        tls.activeEditor = uc as ucOutput;
                        this.editorEvent.activateEditor.fire(/*[uc]*/);
                        return true;
                    }
                    break;
            }
            return false;
        },
    };

    editorEvent = {
        changeLayout: new CommonEvent<() => void>(),
        activateEditor: new CommonEvent<() => void>(),
        selectControl: new CommonEvent<(index: number, isMultiSelect: boolean) => void>(),
    };

    init() {
        this.ucExtends.session.readfile();
        this.cmd_layout.on('mousedown', () => {
            if (this.tools.layoutManager == undefined) {
                let uc = intenseGenerator.generateUC('ucdesigner/stageContent/ucLayout.uc.html', { parentUc: this });
                this.container1.append(uc.ucExtends.self);
                this.splitter1.pushChildSession(uc);
            }
        });
        this.cmd_style.on('mousedown', () => {
            if (this.tools.styleEditor == undefined) {
                let uc = intenseGenerator.generateUC('ucdesigner/stageContent/ucStyle.uc.html', { parentUc: this });
                this.container1.append(uc.ucExtends.self);
                this.splitter1.pushChildSession(uc);
            }
        });

        this.cmd_jsonPera.on('mousedown', () => {
            if (this.tools.jsonPeramaterEditor == undefined) {
                let uc = intenseGenerator.generateUC('ucdesigner/stageContent/ucJsonPerameterEditor.uc.html', { parentUc: this });
                this.container1.append(uc.ucExtends.self);
                this.splitter1.pushChildSession(uc);
            }
        });
        this.cmd_fileExplorer.on('mousedown', () => {
            if (this.tools.styleEditor == undefined) {
                let uc = intenseGenerator.generateUC('ucdesigner/stageContent/projHandler.uc.html', { parentUc: this });
                this.container1.append(uc.ucExtends.self);
                this.splitter1.pushChildSession(uc);
            }
        });
        this.cmd_controlInfo.addEventListener("mousedown", () => {
            if (this.tools.controlInfo == undefined) {
                let uc = intenseGenerator.generateUC('ucdesigner/stageContent/controlInfo.uc.html', { parentUc: this });
                this.container1.append(uc.ucExtends.self);
                this.splitter1.pushChildSession(uc);
            }
        });

        this.cmd_ucbrowser.addEventListener("click", () => {
            let uc = intenseGenerator.generateUC('ucdesigner/Designer/util/assetsExplore.uc.html', { parentUc: this }) as assetsExplore;
            uc.winframe1.showDialog();
        });

        this.cmd_logsession.on('click', () => {
            console.log(this.splitter1.length);
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
            });
        };
    }
    isSaving = false;
}