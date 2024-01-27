"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sourceAdeptor = void 0;
const ucLayout_uc_enumAndMore_js_1 = require("ucdesigner/stageContent/ucLayout.uc.enumAndMore.js");
const common_js_1 = require("ucbuilder/build/common.js");
class sourceAdeptor {
    constructor() {
    }
    init(main) {
        this.main = main;
    }
    refill() {
        this.main.mainNode.querySelectorAll(ucLayout_uc_enumAndMore_js_1.ucDesignerATTR.TEXT_NODE_TAG).forEach((s) => {
            common_js_1.controlOpt.unwrap(s);
        });
        let src = this.main.source;
        let backIds = this.main.tools.selectedElementList.map((s) => src[s].uniqId);
        this.main.tools.selectedElementList.length = 0;
        src.length = 0;
        this.fillNode(this.main.mainNode);
        let indexes = this.main.source.filter((s) => backIds.includes(s.uniqId)).map((s) => s.index);
        this.main.tools.selectedElementList.push(...indexes);
    }
    fillNode(parent, level = 0, indexer = { index: 0 }) {
        let row = new ucLayout_uc_enumAndMore_js_1.treeRecord();
        let doWrap = true;
        let cEle = parent;
        row.element = cEle;
        row.level = level;
        let element;
        switch (cEle.nodeType) {
            case cEle.ELEMENT_NODE:
                element = cEle;
                if (common_js_1.controlOpt.hasClosingTag(row.element))
                    row.iconFileName = "ELEMENT_NODE_10.png";
                else
                    row.iconFileName = "ELEMENT_NODE-NONECLOSABLE.png";
                break;
            case cEle.TEXT_NODE:
                let cntnt = cEle.textContent.trim();
                if (cntnt.length == 0)
                    return;
                switch (cEle.parentElement.nodeName) {
                    case "TEXTAREA": return;
                    default:
                        element = doWrap ? common_js_1.controlOpt.wrap(cEle, ucLayout_uc_enumAndMore_js_1.ucDesignerATTR.TEXT_NODE_TAG) : parent;
                        element.style.display = "inline";
                        element.style.position = "relative";
                        break;
                }
                row.iconFileName = "TEXT_NODE_10.png";
                break;
            default: return;
        }
        row.index = indexer.index;
        element.setAttribute(ucLayout_uc_enumAndMore_js_1.ucDesignerATTR.ITEM_INDEX, '' + row.index);
        row.uniqId = element.getAttribute(ucLayout_uc_enumAndMore_js_1.ucDesignerATTR.UNIQID);
        if (row.uniqId == null) {
            row.uniqId = common_js_1.uniqOpt.guidAs_;
            element.setAttribute(ucLayout_uc_enumAndMore_js_1.ucDesignerATTR.UNIQID, row.uniqId);
        }
        indexer.index++;
        this.main.source.push(row);
        cEle.childNodes.forEach((element) => {
            this.fillNode(element, level + 1, indexer);
        });
    }
}
exports.sourceAdeptor = sourceAdeptor;
