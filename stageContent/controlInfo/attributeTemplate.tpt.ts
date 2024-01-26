import { attrRecord } from 'ucdesigner/stageContent/controlInfo/attributeTemplate.tpt.enumAndmore.js';
import { controlOpt } from 'ucbuilder/build/common.js';
import { CommonEvent } from 'ucbuilder/global/commonEvent.js';
import {Designer} from './attributeTemplate.tpt.designer.js';
import { attributeNewItem } from 'ucdesigner/stageContent/controlInfo/attributeTemplate.tpt.newItem.js';

export class attributeTemplate extends Designer {
    constructor() {
        super(arguments);

        this.primary.extended.Events.onGenerateNode = (eleHT: HTMLElement, row: attrRecord) => {
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
            eleHT.rowData = row;
            ctrls.cmd_remove.rowData = row;
            ctrls.cmd_remove.addEventListener("mouseup", this.cmd_remove_mouseup);
            ctrls.txt_attrValue.mainHT = eleHT;
        }

        this.attrNewItm = new attributeNewItem();
        this.attrNewItm.init(this);
    }

    getSelectedControls = (): HTMLElement[] => {
        return [];
    }

    cmd_remove_mouseup = (event: MouseEvent) => {
        let row: attrRecord = event.currentTarget.rowData;
        row.ownerControl.removeAttribute(row.nodeName);
        this.attrEvents.extended.onAttrChange.fire();
    }

    currentIndex: number = -1;
    lastFocusedElement: HTMLElement | undefined = undefined;

    focus(itemHT: HTMLElement) {
        if (itemHT == undefined) return;
        this.lastFocusedElement = document.activeElement;
        let ctrls = this.primary.getAllControls(itemHT);
        if (!ctrls.txt_attrName.hasAttribute("disabled")) {
            controlOpt.selectAllText(ctrls.txt_attrName);
        } else {
            controlOpt.selectAllText(ctrls.txt_attrValue);
        }
    }

    saveRow(mainHT: HTMLElement) {
        if (mainHT == undefined) return;
        let ctrs = this.primary.getAllControls(mainHT);
        let row: attrRecord = mainHT.rowData;
        let val = ctrs.txt_attrValue.value;
        let key = ctrs.txt_attrName.value;
        if (key != "" && row.value != val) {
            row.ownerControl.setAttribute(ctrs.txt_attrName.value, val);
            this.attrEvents.extended.onAttrChange.fire();
        }
    }

    attrEvents = {
        extended: {
            onAttrChange: new CommonEvent(),
        },
        onAttrChange(callback: () => void) {
            this.extended.onAttrChange.on(callback);
        }
    }
}