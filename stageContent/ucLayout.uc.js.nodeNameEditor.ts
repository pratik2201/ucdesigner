import { controlOpt } from "ucbuilder/build/common";
import { treeRecord, ucDesignerATTR } from "ucdesigner/stageContent/ucLayout.uc.enumAndMore";
import { elementEditor } from "ucbuilder/global/elementEditor";

export class nodeNameEditor {
    editor: elementEditor = new elementEditor();
    row: treeRecord = undefined;

    constructor() {
        this.editor.onDemandActualValue = () => {
            switch (this.row?.nodeType) {
                case this.row?.element.ELEMENT_NODE:
                    return this.row?.element.nodeName;
                case this.row?.element.TEXT_NODE:
                    return this.row?.element.textContent;
                default:
                    return "";
            }
        }
    }

    editRow(row: treeRecord, htEle: HTMLElement  = undefined, callbackAfterSave: (nval: string, oval: string) => void = (nval, oval) => { }, callbackAfterReset: (oval: string) => void = (oval) => { }) {
        let _this = this;
        this.row = row;

        this.editor.editRow(htEle, (nval, oval) => {
            if (_this.row == undefined) return;
            _this.editor.isInEditMode = false;
            if (_this.row.nodeType == _this.row.element.ELEMENT_NODE) {
                let nName = nval.trim().replace(/\n|\r|<br>/ig, "");
                controlOpt.renameTag(_this.row.element, nName);
            } else {
                if (nval == htEle?.innerText) {
                    let e = _this.row.element;
                    e.textContent = nval;
                } else {
                    _this.row.element.parentElement.innerHTML = nval;
                }
            }
            callbackAfterSave(nval, oval);
            _this.row = undefined;
        }, (oval) => {
            callbackAfterReset(oval);
        }, true);

    }

}