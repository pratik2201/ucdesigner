const { ucDesignerATTR, treeRecord, ucLayoutATTR } = require("@ucdesigner:/stageContent/ucLayout.uc.enumAndMore");
const { nodeNameEditor } = require("@ucdesigner:/stageContent/ucLayout.uc.js.nodeNameEditor");
const ucOutput = require("@ucdesigner:/stageContent/ucOutput.uc");
const { dragManage } = require("@ucdesigner:/stageContent/ucOutput.uc.dragManage");
//const { resizerManage } = require("@ucdesigner:/stageContent/ucOutput.uc.resizerManage");
const { controlOpt } = require("ucbuilder/build/common");
const { Rect, Point } = require("ucbuilder/global/drawing/shapes");
const { keyBoard } = require("ucbuilder/global/hardware/keyboard");

class selectionManage {
    constructor() {
    }
    get layout() {
        return this.main.tools.layoutManager;
    }
    get editorEvent() {
        return this.main.main.editorEvent;
    }
    /**
     * @param {HTMLElement[]} elemento 
     * @param {number} prayatno
     * @returns {HTMLElement}
     */
    maroElementMoklo(elemento, shabd_moklo = false, prayatno = 4) {
        /** @type {HTMLElement}  */
        let parinam = undefined;
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
    opDrag = new dragManage();
    // opResizer = new resizerManage();
    /** @type {treeRecord}  */
    lastFatchedObject = undefined;
    /** @param {ucOutput} main */
    init(main) {
        this.main = main;
        this.opDrag.init(this);
        //this.opResizer.init(this);

        let isResizeMode = false;
        let startPoint = new Point(0, 0);
        this.main.targetOutput.addEventListener("mouseup", (evt) => {
            //if (this.opResizer.isResizeMode) return;
            this.lastFatchedObject = this.fatchFromPoint(evt.target, new Point(evt.pageX, evt.pageY), evt.altKey);
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

        this.main.targetOutput.addEventListener("keyup", (evt) => {
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
            //this.main.outputTransperancy.style.display = "none";
        });
        this.main.targetOutput.addEventListener("dblclick", (evt) => {
            /*this.main.main.ucLayout1.nameEditor.saveRow();
            this.fatchFromPoint(new Point(evt.offsetX, evt.offsetY), evt);*/
            this.editNode();
            evt.preventDefault();
        });

        //return;
        let isLeft = false;

    }
    nameEditor = new nodeNameEditor();
    editNode() {
        /** @type {treeRecord}  */
        let rec = this.main.source[this.lastFatchedObject.index];//this.layout.listview1.currentRecord;
        if (rec.nodeType == rec.element.TEXT_NODE) {
            let id = this.lastFatchedObject.index;
            let ele = this.main.targetOutput.querySelector(`[${ucDesignerATTR.ITEM_INDEX}='${id}']`);
            if (ele != undefined) {
                this.nameEditor.editRow(rec, ele, (nval, oval) => {
                    this.main.mainNode.querySelectorAll(`[${ucDesignerATTR.SELECTED}='1']`).forEach(s => {
                        s.setAttribute(ucDesignerATTR.SELECTED, "0");
                    });
                    this.main.srcAdeptor.refill();
                    this.main.Run();
                }, (oval) => { });
                /// this.opResizer.clearSelectionGraphics();
            }
        }
    }
    /**
     * @param {HTMLElement} htEle 
     * @param {Point} pt 
     * @param {boolean} allowTextnodeToSelect 
     * @returns {treeRecord}
     */
    fatchFromPoint(htEle, pt, allowTextnodeToSelect) {
        htEle = ucDesignerATTR.transAssets.getMainTag(htEle);
        htEle = this.maroElementMoklo(document.elementsFromPoint(pt.x, pt.y), allowTextnodeToSelect, 6);
        if (htEle == undefined) return;
        return this.source.find(row => row.outputElement.is(htEle));
    }
    /** @type {treeRecord[]}  */
    source = [];
    /** @param {number[]} selectedIndexes */
    fillOutputScaleSource(selectedIndexes = []) {
        setTimeout(() => {
            let offset = this.main.resourcesOfSelection.getClientRects()[0];
            let ctrs = Array.from(this.main.targetOutput.querySelectorAll(`[${ucDesignerATTR.ITEM_INDEX}]`));
            this.source.length = 0;
            let treeSrc = this.main.source;
            ctrs.forEach(ctr => {
                //console.log(ctr.isConnected);
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
            //this.opResizer.refreshSelection(selectedIndexes);
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
            //this.source.find(a => a.uniqId == s.uniqId).element.setAttribute(ucDesignerATTR.SELECTED, "0");
        });
        this.main.tools.selectedElementList.length = 0;
    }
    static selectOptions = {
        multiSelect: false,
        removeIfExist: true,
        fireSelectionEvent: true
    };
    /**
     * 
     * @param {number} index 
     * @param {selectionManage.selectOptions} param1 
     */
    doSelect(index, {
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

    /**
     * @param {treeRecord} rw 
     * @param {selectionManage.selectOptions} param1 
     */
    selectElement(rw, {
        removeIfExist = true,
        fireSelectionEvent = true
    } = {}) {
        //console.log(rw);
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
module.exports = { selectionManage };