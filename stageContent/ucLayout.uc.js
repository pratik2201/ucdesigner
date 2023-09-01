const { designer } = require('./ucLayout.uc.designer.js');
const { controlOpt, uniqOpt } = require('@ucbuilder:/build/common');
const { treeRecord, ucDesignerATTR, ucLayoutATTR } = require('@ucdesigner:/stageContent/ucLayout.uc.enumAndMore.js');
const { dragHelper } = require('@ucbuilder:/global/drag/dragHelper.js');
const { nodeNameEditor } = require('@ucdesigner:/stageContent/ucLayout.uc.js.nodeNameEditor.js');
const { fileDataBank } = require('@ucbuilder:/global/fileDataBank.js');
const formDesigner = require('@ucdesigner:/formDesigner.uc.js');
const { designerToolsType } = require('@ucdesigner:/enumAndMore.js');
const { keyBoard } = require('@ucbuilder:/global/hardware/keyboard.js');
const { ResourcesUC } = require('@ucbuilder:/ResourcesUC.js');
class ucLayout extends designer {
    //templeteText = fileDataBank.readFile("stageContent/ucLayout.uc.templates.html");

    SESSION_DATA = {
    }
    /** @type {formDesigner} */
    main = undefined;

    get tools() { return this.main.tools; }
    get activeEditor() { return this.tools.activeEditor; }
    get mainNode() { return this.activeEditor.mainNode; }

    get dragBucket() { return this.main.tools.dragBucket; }
    

    /** @type {treeRecord[]}  
    dragBucket = [];*/

    /** @type {HTMLElement[]}  */
    allItemsHT = undefined;
    


    constructor() {
        eval(designer.giveMeHug);

        this.listview1.template = this.tpt_itemnode.primary;
        /** @type {formDesigner}  */
        this.main = ResourcesUC.resources[designerToolsType.mainForm];
        this.main.tools.set(designerToolsType.layout, this);
        this.allItemsHT = this.listview1.Records.allItemHT;
        this.editorEvent = this.main.editorEvent;
        let stamp_onSelectControl = this.editorEvent.selectControl.on((index, isMultiSelect) => {
            //let ids = parseInt(row.id);
            this.listview1.lvUI.currentIndex = parseInt(index);
        });

        /*this.Events.onLoadLastSession(()=>{
            console.log(this.SESSION_DATA);
        });*/

        //let memoryTestVAR = [];
        this.ucExtends.Events.beforeClose.on(evt => {
            this.main.tools.layoutManager = undefined;
            this.editorEvent.selectControl.removeByStamp(stamp_onSelectControl);
            this.editorEvent.activateEditor.off(this.refresh);
            this.editorEvent.changeLayout.off(this.refresh);

        });

        this.editorEvent.activateEditor.on(this.refresh);
        this.editorEvent.changeLayout.on(this.refresh);
        //this.editorEvent.selectionChange.on(this.selectionChange_EVENT);

        //this.listview1.pageMng.usercontrol = this;
        /*this.listview1.getTempleteText =
            **
              @param {number} index 
              @param {treeRecord} row 
             *
            (index, row) => {
                return this.templeteText;
            };*/
        let _this = this;
        this.listview1.Events.newItemGenerate.on(
            (itemNode, index) => {
                let rsw = _this.activeEditor.source[index];
                rsw.layoutitemElement = itemNode;
                //itemNode.setAttribute(ucDesignerATTR.ITEM_INDEX, rsw.index);
                //itemNode.setAttribute(ucDesignerATTR.UNIQID, rsw.uniqId);
            });

            this.listview1.listvw1.addEventListener("mouseup",(evt)=>{
                let index = this.listview1.lvUI.currentIndex;
                this.activeEditor.selection.doSelect(index, {
                    multiSelect: evt.ctrlKey
                });
                this.editorEvent.selectControl.fire(index, evt);
            });
        
        /*this.listview1.listviewEvents.onItemMouseUp((param) => {
            @type {MouseEvent}  
            let evt = param.event;
            this.activeEditor.selection.doSelect(param.index, {
                multiSelect: evt.ctrlKey
            });
            this.editorEvent.extended.onSelectControl.fire(this.listview1.lvUI.currentIndex, evt);
        });*/



        this.listview1.ucExtends.self.addEventListener("keyup", (ev) => {
            switch (ev.keyCode) {
                case keyBoard.keys.up:
                case keyBoard.keys.down:
                    if (this.activeEditor != undefined)
                        this.activeEditor.selection.doSelect(this.listview1.lvUI.currentIndex, {
                            multiSelect: ev.ctrlKey,
                            removeIfExist: false,
                        });
                    this.editorEvent.selectControl.fire(this.listview1.lvUI.currentIndex, ev.ctrlKey);
                    break;
                case keyBoard.keys.delete:
                    /** @type {treeRecord}  */
                    let c = this.listview1.lvUI.currentRecord;
                    if (c.element.nodeType == c.element.ELEMENT_NODE)
                        c.element.delete();
                    else c.element.remove();
                    this.activeEditor.Run();
                    break;
            }
        });
        this.listview1.ucExtends.self.addEventListener("keydown", (ev) => {
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
                        /** @type {treeRecord}  */
                        let cTree = this.listview1.lvUI.currentRecord;
                        let pushAs = ev.shiftKey ? ElementPushAs.before : ElementPushAs.append;
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
        this.cmd_removeTextNode.addEventListener("click", (evt) => {
            let lvUI = this.listview1.lvUI;
            let index = lvUI.currentIndex;
            /** @type {treeRecord}  */
            let c = lvUI.currentRecord;
            if (c.element.nodeType == c.element.ELEMENT_NODE)
                c.element.delete();
            else c.element.remove();
            this.refill(index, false);
            this.main.refreshActiveEditor();
            lvUI.currentIndex = index;
        });
        this.cmd_addElement.addEventListener("click", (evt) => {
            let lvUI = this.listview1.lvUI;
            let index = lvUI.currentIndex;
            /** @type {treeRecord}  */
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
        this.cmd_addTextNode.addEventListener("click", (evt) => {
            let lvUI = this.listview1.lvUI;
            let index = lvUI.currentIndex;
            /** @type {treeRecord}  */
            let r = lvUI.currentRecord;
            if (controlOpt.hasClosingTag(r.element))
                r.element.append(`Text Content`);
            else r.element.after(`Text Content`);
            index++;
            this.refill(index);
        });
        this.uniqKey = "tosee" + this.ucExtends.stampRow.uniqStamp;
        dragHelper.ON_START((ev) => {
            let dta = dragHelper.draggedData;
            if (dta.unqKey == this.uniqKey) {
                _this.dragDataElement = dragHelper.draggedData.data;
                this.activeEditor.selection.selectElement(this.activeEditor.source[ev.currentTarget.index()], {
                    removeIfExist: false
                });
                this.itemDrag.start();
                this.fillBucket();
            }
        }, (ev) => {
            this.itemDrag.stop();
        });
        this.itemDrag
           
            .dragLeave((ev) => {
                /** @type {HTMLElement}  */
                let te = ev.currentTarget;
                te.setAttribute("drag-mode", "none");
            }, [])
            .dragOver((ev) => {
                /** @type {HTMLElement}  */
                let curTarget = ev.currentTarget;

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
                /** @type {HTMLElement}  */
                let tg = ev.target;
                if (tg.nodeName == "SPAN" || tg.nodeName == "IMG") {
                    curTarget.setAttribute("drag-mode", "t-append");
                } else {
                    curTarget.setAttribute("drag-mode", ev.offsetY < (curTarget.offsetHeight / 2) ? "t-before" : "t-after");
                }

            }, [])
            .dragDrop((ev) => {
                let data = _this.dragDataElement;
                this.dragDataElement.removeAttribute("drag-mode");
                if (data == undefined) { ev.stopPropagation(); return; }
                /** @type {HTMLElement}  */
                let tg = ev.target;
                /** @type {HTMLElement}  */
                let curTarget = ev.currentTarget;
                let pushAs = ElementPushAs.append;
                if (tg.nodeName == "SPAN" || tg.nodeName == "IMG") {
                    pushAs = ElementPushAs.prepend;
                } else {
                    pushAs = ev.offsetY > (curTarget.offsetHeight / 2) ? ElementPushAs.after : ElementPushAs.before;
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

        /*this.memoryTestVAR = {};
        for (let i = 0; i < 100; i++) {
            let arCols = {};
            this.memoryTestVAR[i] = arCols;
            for (let j = 0; j < 10000; j++) {
                arCols[j] = "AP---- "+uniqOpt.guidAs_;
            }
        }*/
    }
    refill(index, editNode = true) {
        let lvUI = this.listview1.lvUI;
        if (this.activeEditor != undefined) {
            this.activeEditor.srcAdeptor.refill();
            this.refresh();
            //
            lvUI.currentIndex = index;
            if (editNode){
                this.listview1.listvw1.focus();
                this.doEditProcess();
            }
        }
    }
    doEditProcess() {
        let lvUI = this.listview1.lvUI;
        let cIndex = lvUI.currentIndex;
        let span = this.allItemsHT[lvUI.currentIndex].querySelector('span');

        this.nameEditor.editRow(lvUI.currentRecord, span, (nval, oval) => {
            //console.log(oval+"\n"+nval);     
            if (nval != oval) {
                this.main.refreshActiveEditor();
            }
            this.listview1.ucExtends.self.focus();
            lvUI.currentIndex = cIndex;

        }, (oval) => {
            setTimeout(() => {
                lvUI.currentIndex = lvUI.currentIndex;
            }, 0);

        });
    }
    itemDrag = new dragHelper();
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


    nameEditor = new nodeNameEditor();

    clearDrag() {
        let itmlst = this.allItemsHT;
        this.dragBucket.forEach(s => {
            itmlst[s].removeAttribute("drag-mode");
        });
        this.dragBucket.length = 0;
    }




    /** @type {HTMLElement}  */
    dragDataElement = undefined;

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
        this.listview1.Records.fillAll();
        this.bindDragEvent();
       
    }
    bindDragEvent() {
        let itmlst = this.allItemsHT;
        
        dragHelper
            .DRAG_ME(itmlst, (evt) => {
                return {
                    type: 'tpt',
                    unqKey: this.uniqKey,
                    data: evt.currentTarget,
                }
            }, (evt) => {

            });
        this.itemDrag.pushElements(itmlst);

        //console.clear();    
        //console.log(this.itemDrag.node);
    }
    lastCommandIsForCopy = true;
    /**
     * @param {treeRecord} fromRec 
     * @param {treeRecord} toRec 
     * @param {boolean} viaCopy 
     * @param {ElementPushAs} pushAs 
     */
    transferElement(fromRec, toRec, viaCopy = false, pushAs = ElementPushAs.append) {
        if (!fromRec.element.contains(toRec.element)) {
            if (fromRec.nodeType == fromRec.element.ELEMENT_NODE &&
                (toRec.element.nodeName == "TEXTAREA" &&

                    (pushAs == ElementPushAs.append || pushAs == ElementPushAs.prepend)

                    //(|| toRec.element.parentElement.nodeName == "TEXTAREA")
                )
            ) return;
            /** @type {HTMLElement}  */
            let eToI = undefined;
            eToI = viaCopy ? fromRec.element.cloneNode(true) : fromRec.element;
            switch (pushAs) {
                case ElementPushAs.append:
                    if (!controlOpt.hasClosingTag(toRec.element)) return;
                    toRec.element.append(eToI);
                    break;
                case ElementPushAs.prepend:
                    if (!controlOpt.hasClosingTag(toRec.element)) return;
                    toRec.element.prepend(eToI);
                    break;
                case ElementPushAs.after: toRec.element.after(eToI); break;
                case ElementPushAs.before: toRec.element.before(eToI); break;
            }
        }
    }
}
const ElementPushAs = Object.freeze({
    append: 0,
    prepend: 1,
    after: 2,
    before: 3
});
module.exports = ucLayout;