const {  controlOpt } = require("@ucbuilder:/build/common");
const { treeRecord, ucDesignerATTR } = require("@ucdesigner:/stageContent/ucLayout.uc.enumAndMore");
const { elementEditor } = require("@ucbuilder:/global/elementEditor");

class nodeNameEditor {
    constructor() {
        this.editor.onDemandActualValue = () => {
            switch (this.row.nodeType) {
                case this.row.element.ELEMENT_NODE:
                    return this.row.element.nodeName;
                case this.row.element.TEXT_NODE:
                    return this.row.element.textContent;
            }
        }
    }
    editor = new elementEditor();
    /** @type {treeRecord}  */
    row = undefined;
    /**
     * @param {treeRecord} row 
     * @param {HTMLElement} htEle 
     */
    editRow(row, htEle = undefined, callbackAfterSave = (nval, oval) => { }, callbackAfterReset = (oval) => { }) {
        let _this = this;
        this.row = row;

        this.editor.editRow(htEle, (nval, oval) => {
            if (_this.row == undefined) return;
            _this.editor.isInEditMode = false;
            if (_this.row.nodeType == _this.row.element.ELEMENT_NODE) {
                let nName = nval.trim().replace(/\n|\r|<br>/ig, "");
                controlOpt.renameTag(this.row.element, nName);
            } else {
                if (nval == htEle.innerText) {
                    let e = _this.row.element;
                    e.textContent = nval;
                } else {
                    _this.row.element.parentElement.innerHTML = nval;
                }
            }
            callbackAfterSave(nval, oval);
            _this._row = undefined;
        }, (oval) => {
            callbackAfterReset(oval);
        }, true);

    }

}
module.exports = { nodeNameEditor };