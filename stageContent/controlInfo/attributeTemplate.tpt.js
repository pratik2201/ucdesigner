const { attrRecord } = require('@ucdesigner:/stageContent/controlInfo/attributeTemplate.tpt.enumAndmore.js');
const { controlOpt } = require('@ucbuilder:/build/common.js');
const { commonEvent } = require('@ucbuilder:/global/commonEvent.js');
const { designer } = require('./attributeTemplate.tpt.designer.js');
class attributeTemplate extends designer {
    constructor() {
        super(arguments);            
        this.primary.Events.onGenerateNode =
            /**
             * @param {HTMLElement} eleHT 
             * @param {attrRecord} row 
             */
            (eleHT, row) => {
                let ctrls = this.primary.getAllControls(eleHT);
                switch (row.nodeName) {
                    case "x-name":
                    case "x-tabindex":
                    case "x-from":
                        eleHT.setAttribute("special-attr", row.nodeName);
                        break;
                }
                if (!row.assigned) {
                    ctrls.txt_attrName.removeAttribute("disabled");
                    eleHT.setAttribute("new-row", "1");
                }
                eleHT.rowData = row;
                ctrls.cmd_remove.rowData = row;
                ctrls.cmd_remove.addEventListener("mouseup", this.cmd_remove_mouseup);
                ctrls.txt_attrValue.mainHT = eleHT;
            }
    }
    /** @param {MouseEvent} event */
    cmd_remove_mouseup = (event) => {
        /** @type {attrRecord}  */
        let row = event.currentTarget.rowData;
        row.ownerControl.removeAttribute(row.nodeName);
        this.attrEvents.extended.onAttrChange.fire();
    }
    currentIndex = -1;
    /** @type {HTMLElement}  */
    lastFocusedElement = undefined;
    /** @param {HTMLElement} itemHT */
    focus(itemHT) {
        this.lastFocusedElement = document.activeElement;
        let ctrls = this.getAllControls(itemHT);
       // debugger;
        if (!ctrls.txt_attrName.hasAttribute("disabled")) {
            controlOpt.selectAllText(ctrls.txt_attrName);
        } else {
            controlOpt.selectAllText(ctrls.txt_attrValue);
        }

    }
    saveRow(mainHT) {
        
        let ctrs = this.getAllControls(mainHT);
        /** @type {attrRecord}  */
        let row = mainHT.rowData;
        let val = ctrs.txt_attrValue.value;
        let key = ctrs.txt_attrName.value;
        if (key != "" && row.value != val) {
            row.ownerControl.setAttribute(ctrs.txt_attrName.value, val);
            this.attrEvents.extended.onAttrChange.fire();
        }
    }
   
    attrEvents = {
        extended: {
            onAttrChange: new commonEvent(),
        },
        onAttrChange(callback = () => { }) {
            this.extended.onAttrChange.on(callback);
        }
    }
}
module.exports = attributeTemplate;