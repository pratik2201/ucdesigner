"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attributeTemplate = void 0;
const common_js_1 = require("ucbuilder/build/common.js");
const commonEvent_js_1 = require("ucbuilder/global/commonEvent.js");
const attributeTemplate_tpt_designer_js_1 = require("./attributeTemplate.tpt.designer.js");
const attributeTemplate_tpt_newItem_js_1 = require("ucdesigner/stageContent/controlInfo/attributeTemplate.tpt.newItem.js");
class attributeTemplate extends attributeTemplate_tpt_designer_js_1.Designer {
    constructor() {
        super(arguments);
        this.getSelectedControls = () => {
            return [];
        };
        this.cmd_remove_mouseup = (event) => {
            let row = event.currentTarget.data('rowData');
            row.ownerControl.removeAttribute(row.nodeName);
            this.attrEvents.extended.onAttrChange.fire();
        };
        this.currentIndex = -1;
        this.lastFocusedElement = undefined;
        this.attrEvents = {
            extended: {
                onAttrChange: new commonEvent_js_1.CommonEvent(),
            },
            onAttrChange(callback) {
                this.extended.onAttrChange.on(callback);
            }
        };
        this.primary.extended.Events.onGenerateNode = (eleHT, row) => {
            let ctrls = this.primary.getAllControls(eleHT);
            switch (row.nodeName) {
                case "x-name":
                case "x-tabindex":
                    eleHT.setAttribute("special-attr", row.nodeName);
                    break;
                default:
                    if (row.value.endsWith('.tpt'))
                        eleHT.setAttribute("special-attr", 'tpt');
                    else if (row.value.endsWith('.uc'))
                        eleHT.setAttribute("special-attr", 'uc');
                    break;
            }
            if (!row.assigned) {
                ctrls.txt_attrName.removeAttribute("disabled");
                eleHT.setAttribute("new-row", "1");
            }
            eleHT.data('rowData', row);
            ctrls.cmd_remove.data('rowData', row);
            ctrls.cmd_remove.addEventListener("mouseup", this.cmd_remove_mouseup);
            ctrls.txt_attrValue.data('mainHT', eleHT);
        };
        this.attrNewItm = new attributeTemplate_tpt_newItem_js_1.attributeNewItem();
        this.attrNewItm.init(this);
    }
    focus(itemHT) {
        if (itemHT == undefined)
            return;
        this.lastFocusedElement = document.activeElement;
        let ctrls = this.primary.getAllControls(itemHT);
        if (!ctrls.txt_attrName.hasAttribute("disabled")) {
            common_js_1.controlOpt.selectAllText(ctrls.txt_attrName);
        }
        else {
            common_js_1.controlOpt.selectAllText(ctrls.txt_attrValue);
        }
    }
    saveRow(mainHT) {
        if (mainHT == undefined)
            return;
        let ctrs = this.primary.getAllControls(mainHT);
        let row = mainHT.data('rowData');
        let val = ctrs.txt_attrValue.value;
        let key = ctrs.txt_attrName.value;
        if (key != "" && row.value != val) {
            row.ownerControl.setAttribute(ctrs.txt_attrName.value, val);
            this.attrEvents.extended.onAttrChange.fire();
        }
    }
}
exports.attributeTemplate = attributeTemplate;
