"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attributeNewItem = void 0;
class attributeNewItem {
    constructor() {
        this.row = undefined;
    }
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
exports.attributeNewItem = attributeNewItem;
