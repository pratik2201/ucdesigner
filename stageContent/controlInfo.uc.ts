import { formDesigner } from 'ucdesigner/formDesigner.uc';
import { designerToolsType } from 'ucdesigner/enumAndMore';
import { attrRecord,AttrRecord } from 'ucdesigner/stageContent/controlInfo/attributeTemplate.tpt.enumAndmore';
import { ucDesignerATTR, treeRecord } from 'ucdesigner/stageContent/ucLayout.uc.enumAndMore';
import { FileInfo } from 'ucbuilder/build/codeFileInfo';
import { buildOptions } from 'ucbuilder/build/common';
import { CommonEvent } from 'ucbuilder/global/commonEvent';
import { ATTR_OF } from 'ucbuilder/global/runtimeOpt';
import { ResourcesUC } from 'ucbuilder/ResourcesUC';
import { tableSplitter } from 'ucbuilder/global/tableSplitter';
import { Designer } from './controlInfo.uc.designer';
import {attributeTemplate} from 'ucdesigner/stageContent/controlInfo/attributeTemplate.tpt';
import { dgvManage } from 'ucdesigner/stageContent/controlInfo.uc.dgvManage';
import { newObjectOpt } from 'ucbuilder/global/objectOpt';

export class controlInfo extends Designer {
    IGNORE_ATTR_LIST: string[] = [
        ATTR_OF.UC.PARENT_STAMP,
        ATTR_OF.UC.UNIQUE_STAMP,
        ATTR_OF.UC.UC_STAMP,
        ucDesignerATTR.ITEM_INDEX,
        ucDesignerATTR.SELECTED,
        ucDesignerATTR.UNIQID,
    ]
    controlEvents = {
        extended: {
            onChange: new CommonEvent(),
        },
        onChange(callback: () => void) {
            this.extended.onChange.on(callback);
        }
    }
    tpt_attrib: attributeTemplate;
    main: formDesigner;
    currentIndex: number = -1;
    isAttributeChanging: boolean = false;
    tblSpl: tableSplitter;
    get tools() { return this.main.tools; }
    constructor() {
        super();
        this.initializecomponent(arguments, this);
        //new dgvManage(this);
        this.listview1.init();
        
        this.tpt_attrib = this.listview1.itemTemplate.extended.main as attributeTemplate;
        //this.listview1.template = this.tpt_attrib;
        this.ucExtends.session.autoLoadSession = false;

        
        this.main = ResourcesUC.resources[designerToolsType.mainForm];
        this.tools.set(designerToolsType.controlInfo, this);
        this.listview1.detail.source.rows = this.source;
        this.init();
        this.tblSpl = new tableSplitter();
        this.tblSpl.init({
            table: this.listview1.ucExtends.self,
            tr: "ROW",
            td: "CELL"
        });

    }
    
    source: AttrRecord[] = [];
    init() {
        this.comboBox1.binder.Events.selectedIndexChange.on((nindex: number) => {
            if (this.comboBox1.hasfocused) {
                this.isAttributeChanging = true;
                this.main.tools.activeEditor.selection.doSelect(nindex, {
                    multiSelect: false
                });
                this.main.editorEvent.selectControl.fire(nindex);
                this.isAttributeChanging = false;
            }
        });
        this.tpt_attrib.getSelectedControls = () => {
            return [this.tools.activeEditor.source[this.currentIndex].element];
        }

        this.main.editorEvent.activateEditor.on(() => {
            this.comboBox1.source = this.main.tools.activeEditor.source;
        });

        // binder.

        this.main.editorEvent.selectControl.on((index: number) => {
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

        this.listview1.detail.Events.currentItemIndexChange.on((ov: number, nv: number) => {
            //console.log(ov + ":" + nv);
            this.tpt_attrib.saveRow(this.listview1.detail.allItemHT[ov]);
            if (ov == nv) {
                //this.tpt_attrib.focus(this.listview1.records.allItemsHt[nv+1]);
            }
            this.tpt_attrib.focus(this.listview1.detail.allItemHT[nv]);
        });
    }
    refresh(changeComboboxSelectedIndex: boolean = true) {
        if (this.currentIndex == -1 || this.tools.activeEditor == undefined) return;

        
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
            headerRow: newObjectOpt.copyProps({ ownerControl: row.element, }, attrRecord),
        });
    }
    disableme() {
        this.listview1.detail.source.rows.length = 0;
        this.listview1.detail.source.update();

        this.listview1.fill({
            addHeader: true,
            addFooter: false,
            headerRow: newObjectOpt.copyProps({}, attrRecord),
        });
    }
}