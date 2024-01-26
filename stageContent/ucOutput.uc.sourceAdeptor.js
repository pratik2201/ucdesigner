const { ucDesignerATTR, treeRecord } = require('ucdesigner/stageContent/ucLayout.uc.enumAndMore.js');
const ucOutput = require('ucdesigner/stageContent/ucOutput.uc.js');
const { controlOpt, uniqOpt } = require('ucbuilder/build/common.js');
class sourceAdeptor {

    constructor() {

    }

    /** @param {ucOutput} main  */
    init(main) {
        this.main = main;
    }
    refill(){
       
        this.main.mainNode.querySelectorAll(ucDesignerATTR.TEXT_NODE_TAG).forEach(s => {
            controlOpt.unwrap(s);
        });
        let src = this.main.source;
        let backIds = this.main.tools.selectedElementList.map(s => src[s].uniqId);
        this.main.tools.selectedElementList.length = 0;
        src.length = 0;    
        this.fillNode(this.main.mainNode);
        let indexes = (this.main.source.filter(s => backIds.includes(s.uniqId)).map(s=>s.index));
        this.main.tools.selectedElementList.push(...indexes);
    }
    /** @private @param {HTMLElement} cEle */
    fillNode(parent, level = 0, indexer = { index: 0 }) {
        let row = new treeRecord();
        let doWrap = true;
        let cEle = parent;

        row.element = cEle;
        row.level = level;
        /** @type {HTMLElement}  */
        let element = undefined;
        //console.log(parent);
        
        switch (cEle.nodeType) {
            case cEle.ELEMENT_NODE:
                element = cEle;
                if (controlOpt.hasClosingTag(row.element)) row.iconFileName = "ELEMENT_NODE_10.png";
                else row.iconFileName = "ELEMENT_NODE-NONECLOSABLE.png";
                break;
            case cEle.TEXT_NODE:
                let cntnt = cEle.textContent.trim();
                if (cntnt.length == 0) return;
                switch (cEle.parentElement.nodeName) {
                    case "TEXTAREA": return;
                    default:
                        element = doWrap ? controlOpt.wrap(cEle, ucDesignerATTR.TEXT_NODE_TAG) : parent;
                        element.style.display = "inline";
                        element.style.position = "relative";
                        break;
                }
                row.iconFileName = "TEXT_NODE_10.png";
                break;
            default: return;
        }
        row.index = indexer.index;
        element.setAttribute(ucDesignerATTR.ITEM_INDEX, row.index);
        row.uniqId = element.getAttribute(ucDesignerATTR.UNIQID);
        if (row.uniqId == null) {
            row.uniqId = uniqOpt.guidAs_;
            element.setAttribute(ucDesignerATTR.UNIQID, row.uniqId);
        }
        indexer.index++;
        this.main.source.push(row);
        cEle.childNodes.forEach(element => {
            this.fillNode(element, level + 1, indexer);
        });
    }
}
module.exports = sourceAdeptor;