import { Designer } from './ucLayout.uc.designer.js';
import { controlOpt, uniqOpt } from 'ucbuilder/build/common';
import { treeRecord, ucDesignerATTR, ucLayoutATTR } from 'ucdesigner/stageContent/ucLayout.uc.enumAndMore.js';
import { DragHelper } from 'ucbuilder/global/drag/DragHelper.js';
import { nodeNameEditor } from 'ucdesigner/stageContent/ucLayout.uc.js.nodeNameEditor.js';
import { FileDataBank } from 'ucbuilder/global/fileDataBank.js';
import {formDesigner} from 'ucdesigner/formDesigner.uc.js';
import { designerToolsType } from 'ucdesigner/enumAndMore.js';
import { keyBoard } from 'ucbuilder/global/hardware/keyboard.js';
import { ResourcesUC } from 'ucbuilder/ResourcesUC.js';
import { timeoutCall } from 'ucbuilder/global/timeoutCall.js';
import { itemNode } from './ucLayout/itemNode.tpt.js';
/*const ElementPushAs = Object.freeze({
    append: 0,
    prepend: 1,
    after: 2,
    before: 3
});*/
type ElementPushAs = 'append' | 'prepend' | 'after' | 'before';
export class ucLayout extends Designer {
    SESSION_DATA: any = {};
    main: formDesigner | undefined;
    get tools() { return this.main.tools; }
    get activeEditor() { return this.tools.activeEditor; }
    get mainNode() { return this.activeEditor.mainNode; }
    get dragBucket() { return this.main.tools.dragBucket; }
    allItemsHT: NodeListOf<HTMLElement>;
    tpt_itemnode: itemNode;
    get editorEvent() { return this.main.editorEvent; }
    uniqKey = '';
    dragDataElement: HTMLElement;
    constructor() {
        super();
        this.initializecomponent(arguments, this);
        this.tpt_itemnode = this.listview1.itemTemplate.extended.main as itemNode;
        this.main = ResourcesUC.resources[designerToolsType.mainForm];
        this.main.tools.set(designerToolsType.layout, this);
        this.allItemsHT = this.listview1.lvUI.allItemHT;
        let stamp_onSelectControl = this.editorEvent.selectControl.on((index: number, isMultiSelect: boolean) => {
            this.listview1.lvUI.currentIndex = index;
        });
        this.ucExtends.Events.loadLastSession.on(() => {
            console.log(this.SESSION_DATA);
        });
        this.ucExtends.Events.beforeClose.on(evt => {
            this.main.tools.layoutManager = undefined;
            this.editorEvent.selectControl.removeByStamp(stamp_onSelectControl);
            this.editorEvent.activateEditor.off(this.refresh);
            this.editorEvent.changeLayout.off(this.refresh);

        });

        this.editorEvent.activateEditor.on(this.refresh);
        this.editorEvent.changeLayout.on(this.refresh);

        let _this = this;
        this.listview1.Events.newItemGenerate.on(
            (itemHt: HTMLElement, index: number) => {
                let rsw = _this.activeEditor.source[index];
                rsw.layoutitemElement = itemHt;
            });

        this.listview1.ucExtends.self.addEventListener("mouseup", (evt: MouseEvent) => {
            let index = this.listview1.lvUI.currentIndex;
            this.activeEditor.selection.doSelect(index, {
                multiSelect: evt.ctrlKey
            });
            this.editorEvent.selectControl.fire([index, evt.ctrlKey]);
        });

        this.listview1.ucExtends.self.addEventListener("keyup", (ev: KeyboardEvent) => {
            switch (ev.keyCode) {
                case keyBoard.keys.up:
                case keyBoard.keys.down:
                    if (this.activeEditor != undefined)
                        this.activeEditor.selection.doSelect(this.listview1.lvUI.currentIndex, {
                            multiSelect: ev.ctrlKey,
                            removeIfExist: false,
                        });
                    this.editorEvent.selectControl.fire([this.listview1.lvUI.currentIndex, ev.ctrlKey]);
                    break;
                case keyBoard.keys.delete:
                    let c = this.listview1.lvUI.currentRecord;
                    if (c.element.nodeType == c.element.ELEMENT_NODE)
                        c.element.delete();
                    else c.element.remove();
                    this.activeEditor.Run();
                    break;
            }
        });

        this.listview1.ucExtends.self.addEventListener("keydown", (ev: KeyboardEvent) => {
            switch (ev.keyCode) {
                case keyBoard.keys.f2:
                    this.doEditProcess();
                    ev.preventDefault();
                    break;
                case keyBoard.keys.c:
                case keyBoard.keys.x:
                    if (ev.ctrlKey) {
                        this.lastCommandIsForCopy = (ev.keyCode != keyBoard.keys.x);
                        this.fillBucket();
                    }
                    break;
                case keyBoard.keys.v:
                    if (ev.shiftKey || ev.ctrlKey) {
                        let cTree = this.listview1.lvUI.currentRecord;
                        let pushAs:ElementPushAs = ev.shiftKey ? 'before' : 'append';
                        let src = this.activeEditor.source;
                        this.dragBucket.forEach(s => {
                            this.transferElement(src[s],
                                cTree,
                                this.lastCommandIsForCopy,
                                pushAs
                            );
                        });
                        this.main.refreshActiveEditor();
                        ev.stopPropagation();
                    }
                    break;
            }
        });

        this.cmd_removeTextNode.addEventListener("click", (evt: MouseEvent) => {
            let lvUI = this.listview1.lvUI;
            let index = lvUI.currentIndex;
            let c = lvUI.currentRecord;
            if (c.element.nodeType == c.element.ELEMENT_NODE)
                c.element.delete();
            else c.element.remove();
            this.refill(index, false);
            this.main.refreshActiveEditor();
            lvUI.currentIndex = index;
        });

        this.cmd_addElement.addEventListener("click", (evt: MouseEvent) => {
            let lvUI = this.listview1.lvUI;
            let index = lvUI.currentIndex;
            let r = lvUI.currentRecord;
            if (controlOpt.hasClosingTag(r.element)) {
                let ele = document.createElement(this.getTagNameByParent(r.element.nodeName)).$();
                r.element.prepend(ele);
                index++;
            } else {
                let nEle = document.createElement(this.getTagNameBySibling(r.element.nodeName)).$();
                r.element.before(nEle);
            }
            this.refill(index);
        });

        this.cmd_addTextNode.addEventListener("click", (evt: MouseEvent) => {
            let lvUI = this.listview1.lvUI;
            let index = lvUI.currentIndex;
            let r = lvUI.currentRecord;
            if (controlOpt.hasClosingTag(r.element))
                r.element.append(`Text Content`);
            else r.element.after(`Text Content`);
            index++;
            this.refill(index);
        });

        this.uniqKey = "tosee" + this.ucExtends.stampRow.uniqStamp;
        DragHelper.ON_START((/*ele,*/ev) => {
            let dta = DragHelper.draggedData;
            if (dta.unqKey == this.uniqKey) {
                _this.dragDataElement = DragHelper.draggedData.data;
                this.activeEditor.selection.selectElement(this.activeEditor.source[ev.currentTarget.index()], {
                    removeIfExist: false
                });
                this.itemDrag.start();
                this.fillBucket();
            }
        }, (/*ele,*/ev) => {
            this.itemDrag.stop();
        });

        this.itemDrag
            .dragLeave((/*ele,*/ev) => {
                let te = ev.currentTarget as HTMLElement;
                te.setAttribute("drag-mode", "none");
            }, [])
            .dragOver((/*ele,*/ev) => {
                let curTarget = ev.currentTarget as HTMLElement;
                let itmlst = this.allItemsHT;
                if (ev.ctrlKey) {
                    ev.dataTransfer.dropEffect = 'copy';
                    this.dragDataElement.setAttribute("drag-mode", "copy");
                    this.dragBucket.forEach(s => itmlst[s].setAttribute("drag-mode", "copy"));
                } else {
                    ev.dataTransfer.dropEffect = 'move';
                    this.dragDataElement.setAttribute("drag-mode", "cut");
                    this.dragBucket.forEach(s => itmlst[s].setAttribute("drag-mode", "cut"));
                }
                let tg = ev.target as HTMLElement;
                if (tg.nodeName == "SPAN" || tg.nodeName == "IMG") {
                    curTarget.setAttribute("drag-mode", "t-append");
                } else {
                    curTarget.setAttribute("drag-mode", ev.offsetY < (curTarget.offsetHeight / 2) ? "t-before" : "t-after");
                }
            }, [])
            .dragDrop((/*ele,*/ev) => {
                let data = _this.dragDataElement;
                this.dragDataElement.removeAttribute("drag-mode");
                if (data == undefined) { ev.stopPropagation(); return; }
                let tg = ev.target as HTMLElement;
                let curTarget = ev.currentTarget as HTMLElement;
                let pushAs:ElementPushAs = 'append';
                if (tg.nodeName == "SPAN" || tg.nodeName == "IMG") {
                    pushAs = 'prepend';
                } else {
                    pushAs = ev.offsetY > (curTarget.offsetHeight / 2) ? 'after' : 'before';
                }
                let cTree = this.activeEditor.source[curTarget.index()];
                let src = this.activeEditor.source;
                this.dragBucket.forEach(s => {
                    this.transferElement(src[s],
                        cTree,
                        ev.ctrlKey,
                        pushAs
                    );
                });
                this.main.refreshActiveEditor();
                ev.stopPropagation();
            }, []);

        this.refresh();
    }

    refill(index: number, editNode: boolean = true) {
        let lvUI = this.listview1.lvUI;
        if (this.activeEditor != undefined) {
            this.activeEditor.srcAdeptor.refill();
            this.refresh();
            lvUI.currentIndex = index;
            if (editNode) {
                this.listview1.ll_view.focus();
                this.doEditProcess();
            }
        }
    }

    doEditProcess() {
        let lvUI = this.listview1.lvUI;
        let cIndex = lvUI.currentIndex;
        let span = this.allItemsHT[lvUI.currentIndex].querySelector('span');
        this.nameEditor.editRow(lvUI.currentRecord, span, (nval: string, oval: string) => {
            if (nval != oval) {
                this.main.refreshActiveEditor();
            }
            this.listview1.ucExtends.self.focus();
            lvUI.currentIndex = cIndex;
        }, (oval: string) => {
            timeoutCall.start(() => {
                lvUI.currentIndex = lvUI.currentIndex;
            });
        });
    }

    itemDrag = new DragHelper();
    getTagNameByParent(parentName: string) {
        switch (parentName) {
            case "TABLE": return "TBODY";
            case "TBODY": return "TR";
            case "TR": return "TD";
            default: return "ELEMENT";
        }
    }

    getTagNameBySibling(parentName: string) {
        switch (parentName) {
            case "TR": return "TR";
            case "TD": return "TD";
            case "LI": return "LI";
            default: return "ELEMENT";
        }
    }

    nameEditor = new nodeNameEditor();

    clearDrag() {
        let itmlst = this.allItemsHT;
        this.dragBucket.forEach(s => {
            itmlst[s].removeAttribute("drag-mode");
        });
        this.dragBucket.length = 0;
    }

    fillBucket() {
        this.clearDrag();
        let dragMode = (this.lastCommandIsForCopy) ? "copy" : "cut";
        let itmlst = this.allItemsHT;
        this.tools.selectedElementList.forEach(index => {
            itmlst[index].setAttribute("drag-mode", dragMode);
            this.dragBucket.push(index);
        });
    }

    refresh = () => {
        if (this.main.tools.activeEditor == undefined) return;
        this.clearDrag();
        this.listview1.source.rows = this.activeEditor.source;
        this.listview1.source.update();
        this.listview1.lvUiNodes.fill();
        this.bindDragEvent();
    }

    bindDragEvent() {
        let itmlst = this.allItemsHT;
        DragHelper
            .DRAG_ME(Array.from(itmlst), (evt: MouseEvent) => {
                return {
                    type: 'tpt',
                    unqKey: this.uniqKey,
                    data: evt.currentTarget,
                }
            }, (evt: MouseEvent) => {

            });
        this.itemDrag.pushElements(Array.from(itmlst));
    }

    lastCommandIsForCopy = true;

    transferElement(fromRec: treeRecord, toRec: treeRecord, viaCopy: boolean = false, pushAs: ElementPushAs = 'append') {
        if (!fromRec.element.contains(toRec.element)) {
            if (fromRec.nodeType == fromRec.element.ELEMENT_NODE &&
                (toRec.element.nodeName == "TEXTAREA" &&
                    (pushAs == 'append' || pushAs == 'prepend')
                )
            ) return;
            let eToI: HTMLElement = viaCopy ? fromRec.element.cloneNode(true) as HTMLElement : fromRec.element;
            switch (pushAs) {
                case 'append':
                    if (!controlOpt.hasClosingTag(toRec.element)) return;
                    toRec.element.append(eToI);
                    break;
                case 'prepend':
                    if (!controlOpt.hasClosingTag(toRec.element)) return;
                    toRec.element.prepend(eToI);
                    break;
                case 'after': toRec.element.after(eToI); break;
                case 'before': toRec.element.before(eToI); break;
            }
        }
    }
}

