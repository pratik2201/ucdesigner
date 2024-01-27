"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controlInfo = void 0;
const enumAndMore_1 = require("ucdesigner/enumAndMore");
const attributeTemplate_tpt_enumAndmore_1 = require("ucdesigner/stageContent/controlInfo/attributeTemplate.tpt.enumAndmore");
const ucLayout_uc_enumAndMore_1 = require("ucdesigner/stageContent/ucLayout.uc.enumAndMore");
const commonEvent_1 = require("ucbuilder/global/commonEvent");
const runtimeOpt_1 = require("ucbuilder/global/runtimeOpt");
const ResourcesUC_1 = require("ucbuilder/ResourcesUC");
const tableSplitter_1 = require("ucbuilder/global/tableSplitter");
const controlInfo_uc_designer_1 = require("./controlInfo.uc.designer");
class controlInfo extends controlInfo_uc_designer_1.Designer {
    constructor() {
        super();
        this.IGNORE_ATTR_LIST = [
            runtimeOpt_1.ATTR_OF.UC.PARENT_STAMP,
            runtimeOpt_1.ATTR_OF.UC.UNIQUE_STAMP,
            runtimeOpt_1.ATTR_OF.UC.UC_STAMP,
            ucLayout_uc_enumAndMore_1.ucDesignerATTR.ITEM_INDEX,
            ucLayout_uc_enumAndMore_1.ucDesignerATTR.SELECTED,
            ucLayout_uc_enumAndMore_1.ucDesignerATTR.UNIQID,
        ];
        this.controlEvents = {
            extended: {
                onChange: new commonEvent_1.CommonEvent(),
            },
            onChange(callback) {
                this.extended.onChange.on(callback);
            }
        };
        this.currentIndex = -1;
        this.isAttributeChanging = false;
        this.source = [];
        this.initializecomponent(arguments, this);
        //new dgvManage(this);
        this.listview1.init();
        this.tpt_attrib = this.listview1.itemTemplate.extended.main;
        //this.listview1.template = this.tpt_attrib;
        this.ucExtends.session.autoLoadSession = false;
        this.main = ResourcesUC_1.ResourcesUC.resources[enumAndMore_1.designerToolsType.mainForm];
        this.tools.set(enumAndMore_1.designerToolsType.controlInfo, this);
        this.listview1.detail.source.rows = this.source;
        this.init();
        this.tblSpl = new tableSplitter_1.tableSplitter();
        this.tblSpl.init({
            table: this.listview1.ucExtends.self,
            tr: "ROW",
            td: "CELL"
        });
    }
    get tools() { return this.main.tools; }
    init() {
        this.comboBox1.binder.Events.selectedIndexChange.on((nindex) => {
            if (this.comboBox1.hasfocused) {
                this.isAttributeChanging = true;
                this.main.tools.activeEditor.selection.doSelect(nindex, {
                    multiSelect: false
                });
                this.main.editorEvent.selectControl.fire([nindex, false]);
                this.isAttributeChanging = false;
            }
        });
        this.tpt_attrib.getSelectedControls = () => {
            return [this.tools.activeEditor.source[this.currentIndex].element];
        };
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
            this.listview1.detail.Records.scrollerElement.focus();
            this.refresh();
            //this.listview1.records.currentIndex = this.listview1.records.currentIndex+1;
        });
        this.listview1.detail.Events.currentItemIndexChange.on((ov, nv) => {
            //console.log(ov + ":" + nv);
            this.tpt_attrib.saveRow(this.listview1.detail.allItemHT[ov]);
            if (ov == nv) {
                //this.tpt_attrib.focus(this.listview1.records.allItemsHt[nv+1]);
            }
            this.tpt_attrib.focus(this.listview1.detail.allItemHT[nv]);
        });
    }
    refresh(changeComboboxSelectedIndex = true) {
        if (this.currentIndex == -1 || this.tools.activeEditor == undefined)
            return;
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
        /* this.source.push({
             ownerControl: row.element,
             nodeName: "",
             value: "",
             assigned: false
         });*/
        this.listview1.fill({
            addHeader: true,
            addFooter: false,
            headerRow: Object.assign({ ownerControl: row.element, }, attributeTemplate_tpt_enumAndmore_1.attrRecord),
        });
    }
    disableme() {
        this.listview1.detail.source.rows.length = 0;
        this.listview1.detail.source.update();
        this.listview1.fill({
            addHeader: true,
            addFooter: false,
            headerRow: Object.assign({}, attributeTemplate_tpt_enumAndmore_1.attrRecord),
        });
    }
}
exports.controlInfo = controlInfo;
