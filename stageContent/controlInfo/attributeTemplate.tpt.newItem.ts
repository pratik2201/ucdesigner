import { AttrRecord } from 'ucdesigner/stageContent/controlInfo/attributeTemplate.tpt.enumAndmore.js';
import { attributeTemplate } from 'ucdesigner/stagecontent/controlinfo/attributeTemplate.tpt.js';

export class attributeNewItem {
    row: AttrRecord;
    main: attributeTemplate;
    mainnode: any;
    controls: any;

    constructor() {
        this.row = undefined;
    }

    init(main: attributeTemplate) {
        this.main = main;
        this.main.newitem.extended.Events.onGenerateNode = (mainnode: any, row: AttrRecord) => {
            this.mainnode = mainnode;
            this.row = row;
            this.controls = this.main.newitem.getAllControls(this.mainnode);
            this.initsub();
        };
    }

    initsub() {
        this.controls.cmd_addnew.addEventListener("mousedown", (e: MouseEvent) => {
            this.saveAttr();
        });
    }

    saveAttr() {
        let val: string = this.controls.txt_attrValue.value;
        let key: string = this.controls.txt_attrName.value;

        if (key != "" && this.row.value != val) {
            this.row.ownerControl.setAttribute(key, val);
            this.main.attrEvents.extended.onAttrChange.fire();
        }
    }
}