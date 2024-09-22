"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dragManage = void 0;
const ucLayout_uc_enumAndMore_1 = require("ucdesigner/stageContent/ucLayout.uc.enumAndMore");
const dragHelper_1 = require("ucbuilder/global/drag/dragHelper");
const shapes_1 = require("ucbuilder/global/drawing/shapes");
class dragManage {
    constructor() {
        this.draging = new dragHelper_1.DragHelper();
        this.dragRectHT = document.createElement(ucLayout_uc_enumAndMore_1.ucDesignerATTR.transAssets.tag.DRAG);
        this.lastCommandIsForCopy = false;
        this.treeInfo = undefined;
        this.dragBucket = [];
        this.output = undefined;
        this.main = undefined;
    }
    clearDrag() {
        this.dragBucket = [];
    }
    fillBucket() {
        this.clearDrag();
        let dragMode = (this.lastCommandIsForCopy) ? "copy" : "cut";
        let src = this.main.main.source;
        this.dragBucket = this.output.tools.selectedElementList.map(s => src[s]);
    }
    get layout() {
        return this.output.main.tools.layoutManager;
    }
    init(main) {
        this.main = main;
        this.output = this.main.main;
        dragHelper_1.DragHelper.ON_START((/*ht,*/ ev) => {
            let obj = this.main.fatchFromPoint(ev.target, new shapes_1.Point(ev.pageX, ev.pageY), ev.altKey);
            if (obj != undefined) {
                ev.dataTransfer.setDragImage(obj.element, 0, 0);
                this.fillBucket();
                this.dragRectHT.setAttribute('style', `left : -50px;
                                                        top : -50px;
                                                        height : 0px;
                                                        width : 0px`);
            }
        });
        this.draging
            .dragOver((/*ht,*/ ev) => {
            let row = this.main.fatchFromPoint(ev.target, new shapes_1.Point(ev.pageX, ev.pageY), ev.altKey);
            if (this.treeInfo == undefined ||
                row.index != this.treeInfo.index) {
                this.treeInfo = row;
                this.dragRectHT.setAttribute('style', `left : ${row.rect.left}px;
                                                            top : ${row.rect.top}px;
                                                            height : ${row.rect.height}px;
                                                            width : ${row.rect.width}px`);
            }
            switch (row.rect.getDockSide(ev.offsetX, ev.offsetY)) {
                case "left":
                case "top":
                    this.dragRectHT.setAttribute("droptype", "prepend");
                    break;
                default:
                    this.dragRectHT.setAttribute("droptype", "append");
                    break;
            }
        }, [])
            .dragDrop((/*ht,*/ ev) => {
            let row = this.main.fatchFromPoint(ev.target, new shapes_1.Point(ev.pageX, ev.pageY), ev.altKey);
            let index = row.element.getAttribute(ucLayout_uc_enumAndMore_1.ucDesignerATTR.ITEM_INDEX);
            let torec = this.main.source[index];
            this.dragRectHT.setAttribute('style', `left : 0px;
                                                        top : 0px;
                                                        height : 0px;
                                                        width : 0px;`);
            switch (row.rect.getDockSide(ev.offsetX, ev.offsetY)) {
                case "left":
                case "top":
                    this.dragBucket.forEach(fromrec => {
                        this.layout.transferElement(fromrec, torec, ev.ctrlKey, 'prepend');
                    });
                    this.output.refresh();
                    break;
                default:
                    this.dragBucket.forEach(fromrec => {
                        this.layout.transferElement(fromrec, torec, ev.ctrlKey, 'append');
                    });
                    this.output.refresh();
                    break;
            }
        }, []);
    }
    pushElements(ctrs) {
        /*DragHelper
            .DRAG_ME(ctrs, (ev) => {  }, (ev) => { })*/
        this.draging.pushElements(ctrs);
    }
}
exports.dragManage = dragManage;
