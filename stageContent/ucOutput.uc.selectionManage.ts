import { ucDesignerATTR, ucLayoutATTR } from "ucdesigner/stageContent/ucLayout.uc.enumAndMore";
import { nodeNameEditor } from "ucdesigner/stageContent/ucLayout.uc.js.nodeNameEditor";
import {ucOutput} from "ucdesigner/stageContent/ucOutput.uc";
import { dragManage } from "ucdesigner/stageContent/ucOutput.uc.dragManage";
//import { resizerManage } from "ucdesigner/stageContent/ucOutput.uc.resizerManage";
import { controlOpt } from "ucbuilder/build/common";
import { Rect, Point } from "ucbuilder/global/drawing/shapes";
import { keyBoard } from "ucbuilder/global/hardware/keyboard";

export class selectionManage {
    main: ucOutput;
    opDrag: dragManage;
    lastFatchedObject: treeRecord | undefined;
    source: treeRecord[];

    constructor() {
        this.source = [];
    }

    get layout(): any {
        return this.main.tools.layoutManager;
    }

    get editorEvent(): any {
        return this.main.main.editorEvent;
    }

    maroElementMoklo(elemento: HTMLElement[], shabd_moklo: boolean = false, prayatno: number = 4): HTMLElement | undefined {
        let parinam: HTMLElement | undefined = undefined;
        for (let index = 0; index < elemento.length && prayatno > 0; index++, prayatno--) {
            const element = elemento[index];
            if (element.hasAttribute(ucDesignerATTR.UNIQID)) {
                if (element.hasAttribute(ucDesignerATTR.IGNORE_IN_DESIGNER)) continue;
                parinam = element;
                if (!shabd_moklo) return parinam;
                else {
                    if (parinam.nodeName == ucDesignerATTR.TEXT_NODE_TAG) {
                        return parinam.parentElement;
                    }
                }
            }
        }
        return parinam;
    }

    init(main: ucOutput) {
        this.main = main;
        this.opDrag.init(this);

        let isResizeMode = false;
        let startPoint = new Point(0, 0);
        this.main.targetOutput.addEventListener("mouseup", (evt: MouseEvent) => {
            this.lastFatchedObject = this.fatchFromPoint(evt.target as HTMLElement, new Point(evt.pageX, evt.pageY), evt.altKey);
            if (this.lastFatchedObject != undefined) {
                this.doSelect(this.lastFatchedObject.index, {
                    multiSelect: evt.ctrlKey,
                    fireSelectionEvent: false,
                    removeIfExist: false
                });

                if (!evt.ctrlKey) this.editNode();
                this.editorEvent.selectControl.fire(this.lastFatchedObject.index, evt.ctrlKey);
                this.main.updateSelectionGUI();
            }
        });

        this.main.targetOutput.addEventListener("keyup", (evt: KeyboardEvent) => {
            switch (evt.keyCode) {
                case keyBoard.keys.f2:
                    this.editNode();
                    evt.preventDefault();
                    break;

                case keyBoard.keys.b:
                    if (evt.altKey) {
                        controlOpt.setProcessCSS("foreColor", "yellow");
                        evt.preventDefault();
                    }
                    break;
            }
        });
        this.main.targetOutput.addEventListener("dblclick", (evt: MouseEvent) => {
            this.editNode();
            evt.preventDefault();
        });

        let isLeft = false;
    }

    nameEditor = new nodeNameEditor();

    editNode() {
        let rec = this.main.source[this.lastFatchedObject.index];
        if (rec.nodeType == rec.element.TEXT_NODE) {
            let id = this.lastFatchedObject.index;
            let ele = this.main.targetOutput.querySelector(`[${ucDesignerATTR.ITEM_INDEX}='${id}']`) as HTMLElement;
            if (ele != undefined) {
                this.nameEditor.editRow(rec, ele, (nval: any, oval: any) => {
                    this.main.mainNode.querySelectorAll(`[${ucDesignerATTR.SELECTED}='1']`).forEach(s => {
                        s.setAttribute(ucDesignerATTR.SELECTED, "0");
                    });
                    this.main.srcAdeptor.refill();
                    this.main.Run();
                }, (oval: any) => { });
            }
        }
    }

    fatchFromPoint(htEle: HTMLElement, pt: Point, allowTextnodeToSelect: boolean): treeRecord | undefined {
        htEle = ucDesignerATTR.transAssets.getMainTag(htEle);
        htEle = this.maroElementMoklo(Array.from(document.elementsFromPoint(pt.x, pt.y)), allowTextnodeToSelect, 6) as HTMLElement;
        if (htEle == undefined) return;
        return this.source.find(row => row.outputElement.is(htEle));
    }

    fillOutputScaleSource(selectedIndexes: number[] = []) {
        setTimeout(() => {
            let offset = this.main.resourcesOfSelection.getClientRects()[0];
            let ctrs = Array.from(this.main.targetOutput.querySelectorAll(`[${ucDesignerATTR.ITEM_INDEX}]`)) as HTMLElement[];
            this.source.length = 0;
            let treeSrc = this.main.source;
            ctrs.forEach(ctr => {
                if (!ctr.isConnected || ctr.hasAttribute(ucDesignerATTR.IGNORE_IN_DESIGNER)) return;
                let rectObj = new Rect();
                let index = parseInt(ctr.getAttribute(ucDesignerATTR.ITEM_INDEX));
                let row = treeSrc[index];
                this.main.adjustRect(rectObj, ctr, offset.x, offset.y);
                row.outputElement = ctr;
                row.rect = rectObj;
                this.source.push(row);
            });
            this.opDrag.pushElements(ctrs);
        }, 1);
    }

    clearSelection() {
        let src = this.main.source;

        this.main.tools.selectedElementList.forEach(index => {
            let s = src[index];
            if (s.element.nodeType == s.element.ELEMENT_NODE)
                s.element.setAttribute(ucDesignerATTR.SELECTED, "0");
            else s.element.parentElement.setAttribute(ucDesignerATTR.SELECTED, "0");
            if (s.outputElement != undefined) s.outputElement.setAttribute(ucDesignerATTR.SELECTED, "0");
            if (s.layoutitemElement != undefined) s.layoutitemElement.setAttribute(ucLayoutATTR.SELECTED_INDEX, "0");
        });
        this.main.tools.selectedElementList.length = 0;
    }

    static selectOptions = {
        multiSelect: false,
        removeIfExist: true,
        fireSelectionEvent: true
    };

    doSelect(index: number, {
        multiSelect = false,
        removeIfExist = true,
        fireSelectionEvent = true
    } = {}) {
        let rw = this.main.source[index];
        if (multiSelect) {
            this.selectElement(rw, arguments[1]);
        } else {
            this.clearSelection();
            this.selectElement(rw, arguments[1]);
        }
    }

    selectElement(rw: treeRecord, {
        removeIfExist = true,
        fireSelectionEvent = true
    } = {}) {
        if (rw.element.nodeType == rw.element.ELEMENT_NODE) {
            let findex = this.main.tools.selectedElementList.findIndex(s => s == rw.index);
            if (findex == -1) {
                let mesrow = this.source.find(s => s.index == rw.index);
                if (mesrow == undefined) return;
                mesrow.element.setAttribute(ucDesignerATTR.SELECTED, "1");
                if (mesrow.outputElement != undefined)
                    mesrow.outputElement.setAttribute(ucDesignerATTR.SELECTED, "1");
                if (mesrow.layoutitemElement != undefined)
                    mesrow.layoutitemElement.setAttribute(ucLayoutATTR.SELECTED_INDEX, "1");
                this.main.tools.selectedElementList.push(rw.index);

            } else {
                if (removeIfExist) {
                    arrayOpt.removeAt(this.main.tools.selectedElementList, findex);
                    rw.element.setAttribute(ucDesignerATTR.SELECTED, "0");
                    if (rw.outputElement != undefined)
                        rw.outputElement.setAttribute(ucDesignerATTR.SELECTED, "0");
                    if (rw.layoutitemElement != undefined)
                        rw.layoutitemElement.setAttribute(ucLayoutATTR.SELECTED_INDEX, "0");

                }
            }
        } else {
            let findex = this.main.tools.selectedElementList.findIndex(s => s == rw.index);
            if (findex == -1) {
                this.main.tools.selectedElementList.push(rw.index);
                if (rw.outputElement != undefined)
                    rw.outputElement.setAttribute(ucDesignerATTR.SELECTED, "1");
                if (rw.layoutitemElement != undefined)
                    rw.layoutitemElement.setAttribute(ucLayoutATTR.SELECTED_INDEX, "1");
                rw.element.parentElement.setAttribute(ucDesignerATTR.SELECTED, "1");

            } else {
                if (removeIfExist) {
                    arrayOpt.removeAt(this.main.tools.selectedElementList, findex);
                    rw.element.parentElement.setAttribute(ucDesignerATTR.SELECTED, "0");
                    if (rw.layoutitemElement != undefined) rw.layoutitemElement.setAttribute(ucLayoutATTR.SELECTED_INDEX, "0");
                    if (rw.outputElement != undefined) rw.outputElement.setAttribute(ucDesignerATTR.SELECTED, "0");

                }
            }
        }
        if (fireSelectionEvent)
            this.main.updateSelectionGUI();
    }
}