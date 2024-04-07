import { designerToolsType } from 'ucdesigner/enumAndMore.js';
import { formDesigner } from 'ucdesigner/formDesigner.uc.js';
import { ucDesignerATTR, treeRecord } from 'ucdesigner/stageContent/ucLayout.uc.enumAndMore.js';
import { UcRendarer } from 'ucbuilder/build/UcRendarer.js';
import { selectionManage } from 'ucdesigner/stageContent/ucOutput.uc.selectionManage.js';
import { sourceAdeptor } from 'ucdesigner/stageContent/ucOutput.uc.sourceAdeptor.js';
import { codeFileInfo } from 'ucbuilder/build/codeFileInfo.js';
import { controlOpt, pathInfo, buildOptions, propOpt, uniqOpt, ExtensionType } from 'ucbuilder/build/common.js';
import { FileDataBank } from 'ucbuilder/global/fileDataBank.js';
import { Usercontrol } from 'ucbuilder/Usercontrol.js';
import { Designer } from './ucOutput.uc.designer.js';
import { Rect } from 'ucbuilder/global/drawing/shapes.js';
import { Template } from 'ucbuilder/Template.js';
import fs from 'fs';
import { keyBoard } from 'ucbuilder/global/hardware/keyboard.js';
import { tptManager } from 'ucdesigner/stageContent/ucOutput.uc.tptManager.js';
import { ucManager } from 'ucdesigner/stageContent/ucOutput.uc.ucManager.js';
import { intenseGenerator } from 'ucbuilder/intenseGenerator.js';
import { ResourcesUC } from 'ucbuilder/ResourcesUC.js';
import { timeoutCall } from "ucbuilder/global/timeoutCall";

export class ucOutput extends Designer {
    SESSION_DATA: {
        filePath: string;
        extCode: ExtensionType;
        isActive: boolean;
    } = {
            filePath: "",
            extCode: '.uc',
            isActive: false,
        }
    source: treeRecord[] = [];
    tptManage: tptManager = new tptManager();
    ucManage: ucManager = new ucManager();
    srcAdeptor: sourceAdeptor = new sourceAdeptor();
    main: formDesigner;
    get tools() { return this.main.tools; }
    constructor(fpath: string) {
        super(); this.initializecomponent(arguments, this);
        this.uc_rendar = new UcRendarer();
        this.main = ResourcesUC.resources[designerToolsType.mainForm];

        this.srcAdeptor.init(this);
        this.selection.init(this);
        this.tptManage.init(this);
        this.ucManage.init(this);
        this.ucExtends.Events.completeSessionLoad.on(() => {
            if (this.tools.activeEditor == undefined)
                this.tools.set(designerToolsType.editor, this);

        });


        this.ucExtends.session.varify = (ssn: typeof this.SESSION_DATA) => {
            return true;
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
    onCSSChange = (cssText: string) => {
        this.cssContent = cssText;
        this.Run();
    };
    onJsonChange = (jsonContent: string) => {
        if (jsonContent == "") {
            this.mainNode.setAttribute(ucDesignerATTR.JSON_ROW, "{}");
            this.Run();
        } else {
            try {
                let content = JSON.parse(jsonContent);
                this.mainNode.setAttribute(ucDesignerATTR.JSON_ROW, jsonContent);
                this.Run();
            } catch {
            }
        }
    };

    saveData() {
        pathInfo.writeFile(this.fInfo.html.fullPath, this.getcleanData());
        pathInfo.writeFile(this.fInfo.designer.fullPath, this.uc_rendar.output.designerCode);
        pathInfo.writeFile(this.fInfo.style.fullPath, this.cssContent);
        if (!fs.existsSync(this.fInfo.code.fullPath))
            pathInfo.writeFile(this.fInfo.code.fullPath, this.uc_rendar.output.jsFileCode);
        this.ucExtends.session.onModify();
        console.log('!!saved..');
    }
    uc_rendar: UcRendarer = undefined;
    init() {
        this.fInfo.extCode = this.SESSION_DATA.extCode;

        this.fInfo.parseUrl(this.SESSION_DATA.filePath);

        this.uc_rendar.init(this.fInfo, this);




        this.cssContent = FileDataBank.readFile(this.fInfo.style.rootPath, {
            replaceContentWithKeys: false
        });
        this.ucExtends.caption = this.fInfo.name;

        let htContent = "";

        switch (this.fInfo.extCode) {
            case buildOptions.extType.template:
                htContent = FileDataBank.readFile(this.fInfo.html.rootPath, {
                    replaceContentWithKeys: false
                });
                if (this.cssContent == undefined)
                    this.cssContent = FileDataBank.readFile('ucbuilder/appBuilder/Window/build/templete/tpt/styles.css', {
                        replaceContentWithKeys: false
                    });
                break;
            case buildOptions.extType.Usercontrol:

                htContent = FileDataBank.readFile(this.fInfo.html.rootPath, {
                    replaceContentWithKeys: false
                });
                if (this.cssContent == undefined)
                    this.cssContent = FileDataBank.readFile('ucbuilder/appBuilder/Window/build/templete/uc/styles.css', {
                        replaceContentWithKeys: false
                    });
                break;
        }
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
    _mainNode: HTMLElement = undefined;
    get mainNode(): HTMLElement { return this._mainNode; }
    set mainNode(val: HTMLElement) { this._mainNode = val; }


    fInfo = new codeFileInfo('none');

    uc: Usercontrol = undefined;

    refresh() {
        this.mainNode.querySelectorAll(`[${ucDesignerATTR.SELECTED}='1']`).forEach(s => {
            s.setAttribute(ucDesignerATTR.SELECTED, "0");
        });

        this.srcAdeptor.refill();
        this.Run();
    }
    _resourcesOfSelection: HTMLElement = undefined;
    get resourcesOfSelection() { return this.outputBoard; }
    outputHT: HTMLElement = undefined;
    template: Template = new Template();
    cssContent: string = "";
    perametersContent: string = "{}";

    Run() {
        let htmlContents = FileDataBank.getReplacedContent(this.mainNode.outerHTML);
        if (this.outputHT != undefined) this.outputHT.delete();
        switch (this.SESSION_DATA.extCode) {
            case buildOptions.extType.Usercontrol:
                try {
                    if (htmlContents == "") htmlContents = undefined;
                    let _uc = this.uc_rendar.generateUC(htmlContents, FileDataBank.getReplacedContent(this.cssContent));
                    this.outputHT = _uc.ucExtends.self;
                    this.targetOutput.appendChild(this.outputHT);
                    this.outputHT.appendChild(this.outputBoard);
                    timeoutCall.start(() => {
                        this.selection.fillOutputScaleSource(this.tools.selectedElementList);
                        this.main.editorEvent.changeLayout.fire();
                    });
                } catch (e) {
                    console.log(e);
                }
                break;
            case buildOptions.extType.template:
                try {
                    if (htmlContents == "") htmlContents = undefined;
                    let _tpt = this.uc_rendar.generateTpt(htmlContents, FileDataBank.getReplacedContent(this.cssContent));

                    _tpt.extended.stampRow.passElement(this.outputHT);
                    this.targetOutput.appendChild(this.outputHT);
                    this.outputHT.appendChild(this.outputBoard);

                    timeoutCall.start(() => {
                        this.selection.fillOutputScaleSource(this.tools.selectedElementList);
                        this.main.editorEvent.changeLayout.fire();
                    });
                } catch (e) {
                    console.log(e);
                }
                break;
        }
    }
    updateSelectionGUI() {
    }
    adjustRect(rectObj: Rect, ctr: HTMLElement, offsetx: number, offsety: number) {
        if (ctr.nodeType == ctr.ELEMENT_NODE) {
            try {
                rectObj.setBy.domRect(ctr.getClientRects()[0]);
                rectObj.location.move(-(offsetx + 1), -(offsety + 1));
            } catch (e) {
            }
        } else {
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

    selection: selectionManage = new selectionManage();
    getcleanData() {
        let dtos = this.mainNode.cloneNode(true) as HTMLElement;
        dtos.querySelectorAll(ucDesignerATTR.TEXT_NODE_TAG)
                .forEach(s => controlOpt.unwrap(s as HTMLElement));
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