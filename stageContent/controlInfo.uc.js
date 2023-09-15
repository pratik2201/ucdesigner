const formDesigner = require('@ucdesigner:/formDesigner.uc.js');
const { designerToolsType } = require('@ucdesigner:/enumAndMore.js');
const { attrRecord } = require('@ucdesigner:/stageContent/controlInfo/attributeTemplate.tpt.enumAndmore.js');
const { ucDesignerATTR, treeRecord } = require('@ucdesigner:/stageContent/ucLayout.uc.enumAndMore.js');
const { fileInfo } = require('@ucbuilder:/build/codeFileInfo.js');
const { buildOptions } = require('@ucbuilder:/build/common.js');
const { commonEvent } = require('@ucbuilder:/global/commonEvent.js');
const { ATTR_OF } = require('@ucbuilder:/global/runtimeOpt.js');
const { ResourcesUC } = require('@ucbuilder:/ResourcesUC.js');
const { tableSplitter } = require('@ucbuilder:/global/tableSplitter');
const { designer } = require('./controlInfo.uc.designer.js');
const attributeTemplate = require('@ucdesigner:/stageContent/controlInfo/attributeTemplate.tpt.js');
class controlInfo extends designer {
    IGNORE_ATTR_LIST = [
        ATTR_OF.UC.PARENT_STAMP,
        ATTR_OF.UC.UNIQUE_STAMP,
        ATTR_OF.UC.UC_STAMP,
        ucDesignerATTR.ITEM_INDEX,
        ucDesignerATTR.SELECTED,
        ucDesignerATTR.UNIQID,
    ]
    controlEvents = {
        extended: {
            onChange: new commonEvent(),
        },
        onChange(callback = () => { }) {
            this.extended.onChange.on(callback);
        }
    }
    currentIndex = -1;
    isAttributeChanging = false;
    constructor() {
        eval(designer.giveMeHug);
        this.listview1.init();
        /** @type {attributeTemplate}  */
        this.tpt_attrib = this.listview1.itemTemplate;
        //this.listview1.template = this.tpt_attrib;
        this.ucExtends.session.autoLoadSession = false;
       
        /** @type {formDesigner}  */
        this.main = ResourcesUC.resources[designerToolsType.mainForm];
        this.tools = this.main.tools;
        this.tools.set(designerToolsType.controlInfo, this);
        this.listview1.source.rows = this.source;
        this.init();
        this.tblSpl = new tableSplitter();
        this.tblSpl.init({
            table :this.listview1.ucExtends.self,
            tr:"ROW",
            td:"CELL"
        })
    }
    /** @type {attrRecord[]}  */
    source = [];
    init() {
        this.comboBox1.binder.Events.selectedIndexChange.on((nindex) => {
             if (this.comboBox1.hasfocused) {
                this.isAttributeChanging = true;
                this.main.tools.activeEditor.selection.doSelect(nindex, {
                    multiSelect: false
                });
                this.main.editorEvent.selectControl.fire(nindex);
                this.isAttributeChanging = false;
            }
        });


        this.main.editorEvent.activateEditor.on(() => {
            this.comboBox1.source = this.main.tools.activeEditor.source;
        });

        // binder.

        this.main.editorEvent.selectControl.on((index) => {
            // if (this.isAttributeChanging) return;
            this.currentIndex = index;
            this.refresh(!this.isAttributeChanging);
        });

        this.tpt_attrib.attrEvents.onAttrChange(() => {
            this.main.tools.activeEditor.refresh();
            this.listview1.listvw1.focus();
            this.refresh();
            //this.listview1.records.currentIndex = this.listview1.records.currentIndex+1;
        });

        this.listview1.Events.currentItemIndexChange.on((ov, nv) => {
            //console.log(ov + ":" + nv);
            this.tpt_attrib.saveRow(this.listview1.Records.allItemHT[ov]);
            if (ov == nv) {
                //this.tpt_attrib.focus(this.listview1.records.allItemsHt[nv+1]);
            }
            this.tpt_attrib.focus(this.listview1.Records.allItemHT[nv]);
        });
    }
    refresh(changeComboboxSelectedIndex = true) {
        if (this.currentIndex == -1 || this.tools.activeEditor == undefined) return;
        /** @type {treeRecord}  */
        let row = this.tools.activeEditor.source[this.currentIndex];
        //console.log(row.element.parentElement);
        if (row.element.nodeType == row.element.TEXT_NODE) {
            //this.lbl_nodeType.innerText = "Text Node";
            this.disableme();
            return;
        }
        if (changeComboboxSelectedIndex)
            this.comboBox1.selectedIndex = row.index;
        let filtered = Array.from(row.element.attributes).filter(s => !this.IGNORE_ATTR_LIST.includes(s.nodeName));
        this.source.length = 0;
        filtered.forEach(attrnode => {
            this.source.push({
                ownerControl: row.element,
                nodeName: attrnode.nodeName,
                value: attrnode.value,
                assigned: true
            });
        });
        this.source.push({
            ownerControl: row.element,
            nodeName: "",
            value: "",
            assigned: false
        });
        this.listview1.Records.fill();
    }
    disableme() {
        this.listview1.source.rows.length = 0;
        this.listview1.Records.fill();
    }
}
module.exports = controlInfo;