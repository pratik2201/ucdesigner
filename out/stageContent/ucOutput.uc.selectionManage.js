"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectionManage = void 0;
const ucLayout_uc_enumAndMore_1 = require("ucdesigner/stageContent/ucLayout.uc.enumAndMore");
const ucLayout_uc_js_nodeNameEditor_1 = require("ucdesigner/stageContent/ucLayout.uc.js.nodeNameEditor");
const ucOutput_uc_dragManage_1 = require("ucdesigner/stageContent/ucOutput.uc.dragManage");
const common_1 = require("ucbuilder/build/common");
const shapes_1 = require("ucbuilder/global/drawing/shapes");
const keyboard_1 = require("ucbuilder/global/hardware/keyboard");
class selectionManage {
    constructor() {
        this.opDrag = new ucOutput_uc_dragManage_1.dragManage();
        this.nameEditor = new ucLayout_uc_js_nodeNameEditor_1.nodeNameEditor();
        this.source = [];
    }
    get layout() {
        return this.main.tools.layoutManager;
    }
    get editorEvent() {
        return this.main.main.editorEvent;
    }
    maroElementMoklo(elemento, shabd_moklo = false, prayatno = 4) {
        let parinam = undefined;
        for (let index = 0; index < elemento.length && prayatno > 0; index++, prayatno--) {
            const element = elemento[index];
            if (element.hasAttribute(ucLayout_uc_enumAndMore_1.ucDesignerATTR.UNIQID)) {
                if (element.hasAttribute(ucLayout_uc_enumAndMore_1.ucDesignerATTR.IGNORE_IN_DESIGNER))
                    continue;
                parinam = element;
                if (!shabd_moklo)
                    return parinam;
                else {
                    if (parinam.nodeName == ucLayout_uc_enumAndMore_1.ucDesignerATTR.TEXT_NODE_TAG) {
                        return parinam.parentElement;
                    }
                }
            }
        }
        return parinam;
    }
    init(main) {
        this.main = main;
        this.opDrag.init(this);
        let isResizeMode = false;
        let startPoint = new shapes_1.Point(0, 0);
        this.main.targetOutput.addEventListener("mouseup", (evt) => {
            this.lastFatchedObject = this.fatchFromPoint(evt.target, new shapes_1.Point(evt.pageX, evt.pageY), evt.altKey);
            if (this.lastFatchedObject != undefined) {
                this.doSelect(this.lastFatchedObject.index, {
                    multiSelect: evt.ctrlKey,
                    fireSelectionEvent: false,
                    removeIfExist: false
                });
                if (!evt.ctrlKey)
                    this.editNode();
                this.editorEvent.selectControl.fire(this.lastFatchedObject.index, evt.ctrlKey);
                this.main.updateSelectionGUI();
            }
        });
        this.main.targetOutput.addEventListener("keyup", (evt) => {
            switch (evt.keyCode) {
                case keyboard_1.keyBoard.keys.f2:
                    this.editNode();
                    evt.preventDefault();
                    break;
                case keyboard_1.keyBoard.keys.b:
                    if (evt.altKey) {
                        common_1.controlOpt.setProcessCSS("foreColor", "yellow");
                        evt.preventDefault();
                    }
                    break;
            }
        });
        this.main.targetOutput.addEventListener("dblclick", (evt) => {
            this.editNode();
            evt.preventDefault();
        });
        let isLeft = false;
    }
    editNode() {
        let rec = this.main.source[this.lastFatchedObject.index];
        if (rec.nodeType == rec.element.TEXT_NODE) {
            let id = this.lastFatchedObject.index;
            let ele = this.main.targetOutput.querySelector(`[${ucLayout_uc_enumAndMore_1.ucDesignerATTR.ITEM_INDEX}='${id}']`);
            if (ele != undefined) {
                this.nameEditor.editRow(rec, ele, (nval, oval) => {
                    this.main.mainNode.querySelectorAll(`[${ucLayout_uc_enumAndMore_1.ucDesignerATTR.SELECTED}='1']`).forEach(s => {
                        s.setAttribute(ucLayout_uc_enumAndMore_1.ucDesignerATTR.SELECTED, "0");
                    });
                    this.main.srcAdeptor.refill();
                    this.main.Run();
                }, (oval) => { });
            }
        }
    }
    fatchFromPoint(htEle, pt, allowTextnodeToSelect) {
        htEle = ucLayout_uc_enumAndMore_1.ucDesignerATTR.transAssets.getMainTag(htEle);
        htEle = this.maroElementMoklo(document.elementsFromPoint(pt.x, pt.y), allowTextnodeToSelect, 6);
        if (htEle == undefined)
            return;
        return this.source.find(row => row.outputElement.is(htEle));
    }
    fillOutputScaleSource(selectedIndexes = []) {
        setTimeout(() => {
            let offset = this.main.resourcesOfSelection.getClientRects()[0];
            let ctrs = Array.from(this.main.targetOutput.querySelectorAll(`[${ucLayout_uc_enumAndMore_1.ucDesignerATTR.ITEM_INDEX}]`));
            this.source.length = 0;
            let treeSrc = this.main.source;
            ctrs.forEach(ctr => {
                if (!ctr.isConnected || ctr.hasAttribute(ucLayout_uc_enumAndMore_1.ucDesignerATTR.IGNORE_IN_DESIGNER))
                    return;
                let rectObj = new shapes_1.Rect();
                let index = parseInt(ctr.getAttribute(ucLayout_uc_enumAndMore_1.ucDesignerATTR.ITEM_INDEX));
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
                s.element.setAttribute(ucLayout_uc_enumAndMore_1.ucDesignerATTR.SELECTED, "0");
            else
                s.element.parentElement.setAttribute(ucLayout_uc_enumAndMore_1.ucDesignerATTR.SELECTED, "0");
            if (s.outputElement != undefined)
                s.outputElement.setAttribute(ucLayout_uc_enumAndMore_1.ucDesignerATTR.SELECTED, "0");
            if (s.layoutitemElement != undefined)
                s.layoutitemElement.setAttribute(ucLayout_uc_enumAndMore_1.ucLayoutATTR.SELECTED_INDEX, "0");
        });
        this.main.tools.selectedElementList.length = 0;
    }
    doSelect(index, { multiSelect = false, removeIfExist = true, fireSelectionEvent = true } = {}) {
        let rw = this.main.source[index];
        if (multiSelect) {
            this.selectElement(rw, arguments[1]);
        }
        else {
            this.clearSelection();
            this.selectElement(rw, arguments[1]);
        }
    }
    selectElement(rw, { removeIfExist = true, fireSelectionEvent = true } = {}) {
        if (rw.element.nodeType == rw.element.ELEMENT_NODE) {
            let findex = this.main.tools.selectedElementList.findIndex(s => s == rw.index);
            if (findex == -1) {
                let mesrow = this.source.find(s => s.index == rw.index);
                if (mesrow == undefined)
                    return;
                mesrow.element.setAttribute(ucLayout_uc_enumAndMore_1.ucDesignerATTR.SELECTED, "1");
                if (mesrow.outputElement != undefined)
                    mesrow.outputElement.setAttribute(ucLayout_uc_enumAndMore_1.ucDesignerATTR.SELECTED, "1");
                if (mesrow.layoutitemElement != undefined)
                    mesrow.layoutitemElement.setAttribute(ucLayout_uc_enumAndMore_1.ucLayoutATTR.SELECTED_INDEX, "1");
                this.main.tools.selectedElementList.push(rw.index);
            }
            else {
                if (removeIfExist) {
                    common_1.arrayOpt.removeAt(this.main.tools.selectedElementList, findex);
                    rw.element.setAttribute(ucLayout_uc_enumAndMore_1.ucDesignerATTR.SELECTED, "0");
                    if (rw.outputElement != undefined)
                        rw.outputElement.setAttribute(ucLayout_uc_enumAndMore_1.ucDesignerATTR.SELECTED, "0");
                    if (rw.layoutitemElement != undefined)
                        rw.layoutitemElement.setAttribute(ucLayout_uc_enumAndMore_1.ucLayoutATTR.SELECTED_INDEX, "0");
                }
            }
        }
        else {
            let findex = this.main.tools.selectedElementList.findIndex(s => s == rw.index);
            if (findex == -1) {
                this.main.tools.selectedElementList.push(rw.index);
                if (rw.outputElement != undefined)
                    rw.outputElement.setAttribute(ucLayout_uc_enumAndMore_1.ucDesignerATTR.SELECTED, "1");
                if (rw.layoutitemElement != undefined)
                    rw.layoutitemElement.setAttribute(ucLayout_uc_enumAndMore_1.ucLayoutATTR.SELECTED_INDEX, "1");
                rw.element.parentElement.setAttribute(ucLayout_uc_enumAndMore_1.ucDesignerATTR.SELECTED, "1");
            }
            else {
                if (removeIfExist) {
                    common_1.arrayOpt.removeAt(this.main.tools.selectedElementList, findex);
                    rw.element.parentElement.setAttribute(ucLayout_uc_enumAndMore_1.ucDesignerATTR.SELECTED, "0");
                    if (rw.layoutitemElement != undefined)
                        rw.layoutitemElement.setAttribute(ucLayout_uc_enumAndMore_1.ucLayoutATTR.SELECTED_INDEX, "0");
                    if (rw.outputElement != undefined)
                        rw.outputElement.setAttribute(ucLayout_uc_enumAndMore_1.ucDesignerATTR.SELECTED, "0");
                }
            }
        }
        if (fireSelectionEvent)
            this.main.updateSelectionGUI();
    }
}
exports.selectionManage = selectionManage;
selectionManage.selectOptions = {
    multiSelect: false,
    removeIfExist: true,
    fireSelectionEvent: true
};
