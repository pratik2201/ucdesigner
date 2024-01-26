const { attrRecord } = require('ucdesigner/stageContent/controlInfo/attributeTemplate.tpt.enumAndmore.js');
/** @typedef {import ('ucdesigner/stagecontent/controlinfo/attributeTemplate.tpt.js')} attributeTemplate */
class attributeNewItem {
    constructor() {

    }
    /** @type {attrRecord}  */
    row = undefined;
    /**
     * @param {attributeTemplate} main 
     */
    init(main) {
        this.main = main;
        this.main.newitem.extended.Events.onGenerateNode = (mainnode, row) => {
            this.mainnode = mainnode;
            this.row = row;
            this.controls = this.main.newitem.getAllControls(this.mainnode);
            this.initsub();
        };
    }
    initsub() {
        this.controls.cmd_addnew.addEventListener("mousedown", (e) => {
            this.saveAttr();
        });
    }
    saveAttr() {
        let val = this.controls.txt_attrValue.value;
        let key = this.controls.txt_attrName.value;
        
        if (key != "" && this.row.value != val) {
            this.row.ownerControl.setAttribute(key, val);
            this.main.attrEvents.extended.onAttrChange.fire();
        }
    }
}
module.exports = { attributeNewItem };