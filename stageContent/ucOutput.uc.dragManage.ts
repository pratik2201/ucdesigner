import { ucLayout } from "ucdesigner/stageContent/ucLayout.uc";
import { ucDesignerATTR, treeRecord } from "ucdesigner/stageContent/ucLayout.uc.enumAndMore";
import { ucOutput } from "ucdesigner/stageContent/ucOutput.uc";
import { selectionManage } from "ucdesigner/stageContent/ucOutput.uc.selectionManage";
import { DragHelper } from "ucbuilder/global/drag/dragHelper";
import { Point } from "ucbuilder/global/drawing/shapes";

export class dragManage {
    draging: DragHelper;
    dragRectHT: HTMLElement;
    lastCommandIsForCopy: boolean;
    treeInfo: treeRecord;
    dragBucket: treeRecord[];
    output: ucOutput;
    main: selectionManage;

    constructor() {
        this.draging = new DragHelper();
        this.dragRectHT = document.createElement(ucDesignerATTR.transAssets.tag.DRAG);
        this.lastCommandIsForCopy = false;
        this.treeInfo = undefined;
        this.dragBucket = [];
        this.output = undefined;
        this.main = undefined;
    }

    clearDrag(): void {
        this.dragBucket = [];
    }

    fillBucket(): void {
        this.clearDrag();
        let dragMode: string = (this.lastCommandIsForCopy) ? "copy" : "cut";
        let src: any = this.main.main.source;
        this.dragBucket = this.output.tools.selectedElementList.map(s => src[s]);
    }

    get layout(): ucLayout {
        return this.output.main.tools.layoutManager;
    }

    init(main: selectionManage): void {
        this.main = main;
        this.output = this.main.main;
        DragHelper.ON_START((/*ht,*/ev) => {
            let obj = this.main.fatchFromPoint(ev.target as HTMLElement, new Point(ev.pageX, ev.pageY), ev.altKey);
            if (obj != undefined) {
                ev.dataTransfer.setDragImage(obj.element, 0, 0);
                this.fillBucket();
                this.dragRectHT.setAttribute('style',`left : -50px;
                                                        top : -50px;
                                                        height : 0px;
                                                        width : 0px`);
            }
        })
        this.draging
            .dragOver((/*ht,*/ev) => {
                let row = this.main.fatchFromPoint(ev.target as HTMLElement, new Point(ev.pageX, ev.pageY), ev.altKey);
                if (this.treeInfo == undefined  ||
                    row.index != this.treeInfo.index) {
                    this.treeInfo = row;
                    this.dragRectHT.setAttribute('style',`left : ${row.rect.left}px;
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
            .dragDrop((/*ht,*/ev) => {
                let row = this.main.fatchFromPoint(ev.target as HTMLElement, new Point(ev.pageX, ev.pageY), ev.altKey);
                let index = row.element.getAttribute(ucDesignerATTR.ITEM_INDEX);
                let torec = this.main.source[index];
                this.dragRectHT.setAttribute('style',`left : 0px;
                                                        top : 0px;
                                                        height : 0px;
                                                        width : 0px;`);
                switch (row.rect.getDockSide(ev.offsetX, ev.offsetY)) {
                    case "left":
                    case "top":
                        this.dragBucket.forEach(fromrec => {
                            this.layout.transferElement(fromrec, torec, ev.ctrlKey,'prepend');
                        });
                        this.output.refresh();
                        break;
                    default:
                        this.dragBucket.forEach(fromrec => {
                            this.layout.transferElement(fromrec, torec, ev.ctrlKey,'append');
                        });
                        this.output.refresh();
                        break;
                }

            }, []);


    }

    pushElements(ctrs: HTMLElement[]): void {
        /*DragHelper
            .DRAG_ME(ctrs, (ev) => {  }, (ev) => { })*/
        this.draging.pushElements(ctrs);
    }
}