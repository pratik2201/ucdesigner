"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ucLayout = void 0;
const ucLayout_uc_designer_js_1 = require("./ucLayout.uc.designer.js");
const common_1 = require("ucbuilder/build/common");
const DragHelper_js_1 = require("ucbuilder/global/drag/DragHelper.js");
const ucLayout_uc_js_nodeNameEditor_js_1 = require("ucdesigner/stageContent/ucLayout.uc.js.nodeNameEditor.js");
const enumAndMore_js_1 = require("ucdesigner/enumAndMore.js");
const keyboard_js_1 = require("ucbuilder/global/hardware/keyboard.js");
const ResourcesUC_js_1 = require("ucbuilder/ResourcesUC.js");
const timeoutCall_js_1 = require("ucbuilder/global/timeoutCall.js");
class ucLayout extends ucLayout_uc_designer_js_1.Designer {
    constructor() {
        super();
        this.SESSION_DATA = {};
        this.uniqKey = '';
        this.itemDrag = new DragHelper_js_1.DragHelper();
        this.nameEditor = new ucLayout_uc_js_nodeNameEditor_js_1.nodeNameEditor();
        this.refresh = () => {
            if (this.main.tools.activeEditor == undefined)
                return;
            this.clearDrag();
            this.listview1.source.rows = this.activeEditor.source;
            this.listview1.source.update();
            this.listview1.lvUiNodes.fill();
            this.bindDragEvent();
        };
        this.lastCommandIsForCopy = true;
        this.initializecomponent(arguments, this);
        this.tpt_itemnode = this.listview1.itemTemplate.extended.main;
        this.main = ResourcesUC_js_1.ResourcesUC.resources[enumAndMore_js_1.designerToolsType.mainForm];
        this.main.tools.set(enumAndMore_js_1.designerToolsType.layout, this);
        this.allItemsHT = this.listview1.lvUI.allItemHT;
        let stamp_onSelectControl = this.editorEvent.selectControl.on((index, isMultiSelect) => {
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
        this.listview1.Events.newItemGenerate.on((itemHt, index) => {
            let rsw = _this.activeEditor.source[index];
            rsw.layoutitemElement = itemHt;
        });
        this.listview1.ucExtends.self.addEventListener("mouseup", (evt) => {
            let index = this.listview1.lvUI.currentIndex;
            this.activeEditor.selection.doSelect(index, {
                multiSelect: evt.ctrlKey
            });
            this.editorEvent.selectControl.fire([index, evt.ctrlKey]);
        });
        this.listview1.ucExtends.self.addEventListener("keyup", (ev) => {
            switch (ev.keyCode) {
                case keyboard_js_1.keyBoard.keys.up:
                case keyboard_js_1.keyBoard.keys.down:
                    if (this.activeEditor != undefined)
                        this.activeEditor.selection.doSelect(this.listview1.lvUI.currentIndex, {
                            multiSelect: ev.ctrlKey,
                            removeIfExist: false,
                        });
                    this.editorEvent.selectControl.fire([this.listview1.lvUI.currentIndex, ev.ctrlKey]);
                    break;
                case keyboard_js_1.keyBoard.keys.delete:
                    let c = this.listview1.lvUI.currentRecord;
                    if (c.element.nodeType == c.element.ELEMENT_NODE)
                        c.element.delete();
                    else
                        c.element.remove();
                    this.activeEditor.Run();
                    break;
            }
        });
        this.listview1.ucExtends.self.addEventListener("keydown", (ev) => {
            switch (ev.keyCode) {
                case keyboard_js_1.keyBoard.keys.f2:
                    this.doEditProcess();
                    ev.preventDefault();
                    break;
                case keyboard_js_1.keyBoard.keys.c:
                case keyboard_js_1.keyBoard.keys.x:
                    if (ev.ctrlKey) {
                        this.lastCommandIsForCopy = (ev.keyCode != keyboard_js_1.keyBoard.keys.x);
                        this.fillBucket();
                    }
                    break;
                case keyboard_js_1.keyBoard.keys.v:
                    if (ev.shiftKey || ev.ctrlKey) {
                        let cTree = this.listview1.lvUI.currentRecord;
                        let pushAs = ev.shiftKey ? 'before' : 'append';
                        let src = this.activeEditor.source;
                        this.dragBucket.forEach(s => {
                            this.transferElement(src[s], cTree, this.lastCommandIsForCopy, pushAs);
                        });
                        this.main.refreshActiveEditor();
                        ev.stopPropagation();
                    }
                    break;
            }
        });
        this.cmd_removeTextNode.addEventListener("click", (evt) => {
            let lvUI = this.listview1.lvUI;
            let index = lvUI.currentIndex;
            let c = lvUI.currentRecord;
            if (c.element.nodeType == c.element.ELEMENT_NODE)
                c.element.delete();
            else
                c.element.remove();
            this.refill(index, false);
            this.main.refreshActiveEditor();
            lvUI.currentIndex = index;
        });
        this.cmd_addElement.addEventListener("click", (evt) => {
            let lvUI = this.listview1.lvUI;
            let index = lvUI.currentIndex;
            let r = lvUI.currentRecord;
            if (common_1.controlOpt.hasClosingTag(r.element)) {
                let ele = document.createElement(this.getTagNameByParent(r.element.nodeName)).$();
                r.element.prepend(ele);
                index++;
            }
            else {
                let nEle = document.createElement(this.getTagNameBySibling(r.element.nodeName)).$();
                r.element.before(nEle);
            }
            this.refill(index);
        });
        this.cmd_addTextNode.addEventListener("click", (evt) => {
            let lvUI = this.listview1.lvUI;
            let index = lvUI.currentIndex;
            let r = lvUI.currentRecord;
            if (common_1.controlOpt.hasClosingTag(r.element))
                r.element.append(`Text Content`);
            else
                r.element.after(`Text Content`);
            index++;
            this.refill(index);
        });
        this.uniqKey = "tosee" + this.ucExtends.stampRow.uniqStamp;
        DragHelper_js_1.DragHelper.ON_START((ele, ev) => {
            let dta = DragHelper_js_1.DragHelper.draggedData;
            if (dta.unqKey == this.uniqKey) {
                _this.dragDataElement = DragHelper_js_1.DragHelper.draggedData.data;
                this.activeEditor.selection.selectElement(this.activeEditor.source[ev.currentTarget.index()], {
                    removeIfExist: false
                });
                this.itemDrag.start();
                this.fillBucket();
            }
        }, (ele, ev) => {
            this.itemDrag.stop();
        });
        this.itemDrag
            .dragLeave((ele, ev) => {
            let te = ev.currentTarget;
            te.setAttribute("drag-mode", "none");
        }, [])
            .dragOver((ele, ev) => {
            let curTarget = ev.currentTarget;
            let itmlst = this.allItemsHT;
            if (ev.ctrlKey) {
                ev.dataTransfer.dropEffect = 'copy';
                this.dragDataElement.setAttribute("drag-mode", "copy");
                this.dragBucket.forEach(s => itmlst[s].setAttribute("drag-mode", "copy"));
            }
            else {
                ev.dataTransfer.dropEffect = 'move';
                this.dragDataElement.setAttribute("drag-mode", "cut");
                this.dragBucket.forEach(s => itmlst[s].setAttribute("drag-mode", "cut"));
            }
            let tg = ev.target;
            if (tg.nodeName == "SPAN" || tg.nodeName == "IMG") {
                curTarget.setAttribute("drag-mode", "t-append");
            }
            else {
                curTarget.setAttribute("drag-mode", ev.offsetY < (curTarget.offsetHeight / 2) ? "t-before" : "t-after");
            }
        }, [])
            .dragDrop((ele, ev) => {
            let data = _this.dragDataElement;
            this.dragDataElement.removeAttribute("drag-mode");
            if (data == undefined) {
                ev.stopPropagation();
                return;
            }
            let tg = ev.target;
            let curTarget = ev.currentTarget;
            let pushAs = 'append';
            if (tg.nodeName == "SPAN" || tg.nodeName == "IMG") {
                pushAs = 'prepend';
            }
            else {
                pushAs = ev.offsetY > (curTarget.offsetHeight / 2) ? 'after' : 'before';
            }
            let cTree = this.activeEditor.source[curTarget.index()];
            let src = this.activeEditor.source;
            this.dragBucket.forEach(s => {
                this.transferElement(src[s], cTree, ev.ctrlKey, pushAs);
            });
            this.main.refreshActiveEditor();
            ev.stopPropagation();
        }, []);
        this.refresh();
    }
    get tools() { return this.main.tools; }
    get activeEditor() { return this.tools.activeEditor; }
    get mainNode() { return this.activeEditor.mainNode; }
    get dragBucket() { return this.main.tools.dragBucket; }
    get editorEvent() { return this.main.editorEvent; }
    refill(index, editNode = true) {
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
        this.nameEditor.editRow(lvUI.currentRecord, span, (nval, oval) => {
            if (nval != oval) {
                this.main.refreshActiveEditor();
            }
            this.listview1.ucExtends.self.focus();
            lvUI.currentIndex = cIndex;
        }, (oval) => {
            timeoutCall_js_1.timeoutCall.start(() => {
                lvUI.currentIndex = lvUI.currentIndex;
            });
        });
    }
    getTagNameByParent(parentName) {
        switch (parentName) {
            case "TABLE": return "TBODY";
            case "TBODY": return "TR";
            case "TR": return "TD";
            default: return "ELEMENT";
        }
    }
    getTagNameBySibling(parentName) {
        switch (parentName) {
            case "TR": return "TR";
            case "TD": return "TD";
            case "LI": return "LI";
            default: return "ELEMENT";
        }
    }
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
    bindDragEvent() {
        let itmlst = this.allItemsHT;
        DragHelper_js_1.DragHelper
            .DRAG_ME(Array.from(itmlst), (evt) => {
            return {
                type: 'tpt',
                unqKey: this.uniqKey,
                data: evt.currentTarget,
            };
        }, (evt) => {
        });
        this.itemDrag.pushElements(Array.from(itmlst));
    }
    transferElement(fromRec, toRec, viaCopy = false, pushAs = 'append') {
        if (!fromRec.element.contains(toRec.element)) {
            if (fromRec.nodeType == fromRec.element.ELEMENT_NODE &&
                (toRec.element.nodeName == "TEXTAREA" &&
                    (pushAs == 'append' || pushAs == 'prepend')))
                return;
            let eToI = viaCopy ? fromRec.element.cloneNode(true) : fromRec.element;
            switch (pushAs) {
                case 'append':
                    if (!common_1.controlOpt.hasClosingTag(toRec.element))
                        return;
                    toRec.element.append(eToI);
                    break;
                case 'prepend':
                    if (!common_1.controlOpt.hasClosingTag(toRec.element))
                        return;
                    toRec.element.prepend(eToI);
                    break;
                case 'after':
                    toRec.element.after(eToI);
                    break;
                case 'before':
                    toRec.element.before(eToI);
                    break;
            }
        }
    }
}
exports.ucLayout = ucLayout;
