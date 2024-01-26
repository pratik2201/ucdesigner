const ucLayout = require("ucdesigner/stageContent/ucLayout.uc");
const { ucDesignerATTR, treeRecord } = require("ucdesigner/stageContent/ucLayout.uc.enumAndMore");
const ucOutput = require("ucdesigner/stageContent/ucOutput.uc");
const { selectionManage } = require("ucdesigner/stageContent/ucOutput.uc.selectionManage");
const { dragHelper } = require("ucbuilder/global/drag/dragHelper");
const { Point } = require("ucbuilder/global/drawing/shapes");

class dragManage {
    constructor() {

    }
    draging = new dragHelper();

    /** @type {HTMLElement}  */
    dragRectHT = `<${ucDesignerATTR.transAssets.tag.DRAG} ></${ucDesignerATTR.transAssets.tag.DRAG}>`.$();

    lastCommandIsForCopy = false;

    /** @type {treeRecord}  */
    treeInfo = undefined;

    clearDrag() {
        /*this.dragBucket.forEach(s => {
            s.itemElement.removeAttribute("drag-mode");
        });*/
        this.dragBucket = [];
    }
    /** @type {treeRecord[]}  */
    dragBucket = [];
    fillBucket() {
        this.clearDrag();
        let dragMode = (this.lastCommandIsForCopy) ? "copy" : "cut";
        let src = this.main.main.source;
        this.dragBucket = this.output.tools.selectedElementList.map(s => src[s]);
    }
    /** @type {ucOutput}  */
    output = undefined;
    /** @type {ucLayout}  */
    get layout() { return this.output.main.tools.layoutManager; };

    /** @type {selectionManage}  */
    main = undefined;
    /** @param {selectionManage} main */
    init(main) {
        this.main = main;
        this.output = this.main.main;
        dragHelper.ON_START((ev) => {
            let obj = this.main.fatchFromPoint(ev.target, new Point(ev.pageX, ev.pageY), ev.altKey);
            if (obj != undefined) {
                ev.dataTransfer.setDragImage(obj.element, 0, 0);
                this.fillBucket();
                this.dragRectHT.style = `left : -50px;
                                            top : -50px;
                                            height : 0px;
                                            width : 0px`;
            }
        })
        this.draging
            .dragOver((ev) => {
                let row = this.main.fatchFromPoint(ev.target, new Point(ev.pageX, ev.pageY), ev.altKey);
                if (this.treeInfo == undefined ||
                    row.id != this.treeInfo.id) {
                    this.treeInfo = row;
                    this.dragRectHT.style = `left : ${row.rect.left}px;
                                            top : ${row.rect.top}px;
                                            height : ${row.rect.height}px;
                                            width : ${row.rect.width}px`;
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
            .dragDrop((ev) => {
                let row = this.main.fatchFromPoint(ev.target, new Point(ev.pageX, ev.pageY), ev.altKey);
                let index = row.element.getAttribute(ucDesignerATTR.ITEM_INDEX);
                let torec = this.main.source[index];
                this.dragRectHT.style = `left : 0px;
                                                top : 0px;
                                                height : 0px;
                                                width : 0px;`;
                switch (row.rect.getDockSide(ev.offsetX, ev.offsetY)) {
                    case "left":
                    case "top":
                        this.dragBucket.forEach(fromrec => {
                            this.layout.transferElement(fromrec, torec, ev.ctrlKey, 1);
                        });
                        this.output.refresh();
                        break;
                    default:
                        this.dragBucket.forEach(fromrec => {
                            this.layout.transferElement(fromrec, torec, ev.ctrlKey, 0);
                        });
                        this.output.refresh();
                        break;
                }

            }, []);


    }

    /** @param {HTMLElement} ctrs */
    pushElements(ctrs) {
        dragHelper
            .DRAG_ME(ctrs, (evt) => { }, (evt) => { })
        this.draging.pushElements(ctrs);
    }
}
module.exports = { dragManage };