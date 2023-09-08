const { uniqOpt } = require("@ucbuilder:/build/common");
const { Rect } = require("@ucbuilder:/global/drawing/shapes");
class treeRecord {
    constructor() { }

    /** @type {number}  */
    index = -1;
    uniqId = "";

    _element = undefined;
    nodeType = undefined;
    /** @type {HTMLElement}  */
    set element(val) { this._element = val; this.nodeType = this.element.nodeType; }
    /** @type {HTMLElement}  */
    get element() { return this._element; }

    /** @type {HTMLElement}  */
    outputElement = undefined;

    /** @type {Rect}  */
    rect = undefined;


    /** @type {HTMLElement}  */
    layoutitemElement = undefined;

    iconFileName = "other-tags.png";
    get xName() {
        let ele = this.element; 
        if (ele === undefined) return "";
        switch (ele.nodeType) {
            case ele.ELEMENT_NODE: return ele.hasAttribute("x-name") ? ele.getAttribute("x-name") : "";
            default: return "";
        }
    }
    
    get nodeName() {
        let ele = this.element;
        if (ele === undefined) return "";
        switch (ele.nodeType) {
            case ele.ELEMENT_NODE: return ele.nodeName;
            case ele.TEXT_NODE: return ele.textContent;
        }
    }
    level = 0;
    get leftSpace() { return this.level * 10; }

    /** @type {NamedNodeMap[]}  */
    get attributes() {
        let ele = this.element;
        if (ele === undefined) return [];
        /** @type {NamedNodeMap[]}  */
        let rtrn = [];
        switch (ele.nodeType) {
            case ele.ELEMENT_NODE:
                Array.from(ele.attributes).forEach(s => {
                    rtrn.push(s);
                });
                rtrn.sort((a, b) => {
                    let fa = a.name.toLowerCase(),
                        fb = b.name.toLowerCase();
                    if (fa < fb) return -1;
                    if (fa > fb) return 1;
                    return 0;
                });
                return rtrn;
            default: return [];
        }
    }
}
const ucLayoutATTR = Object.freeze({
    SELECTED_INDEX: "is-selected",
});
const ucDesignerATTR = Object.freeze({
    JSON_ROW: "x.temp-jsonperameters",
    IGNORE_IN_DESIGNER: "ignore-in-designer",

    ITEM_INDEX: "ii" + uniqOpt.randomNo(),
    UNIQID: "ui" + uniqOpt.randomNo(),
    SELECTED: "sel" + uniqOpt.randomNo(),
    TEXT_NODE_TAG: "TN" + uniqOpt.randomNo(),
    transAssets: {
        tag: {
            SELECTION: "CTRRECT",
            RESIZER: "RESIZER",
            CORNER: "CORNER",
            DRAG: "DRGRECT",
        },
        /** 
         * @param {HTMLElement} htEle
         * @returns {HTMLElement}
         */
        getMainTag(htEle) {
            switch (htEle.nodeName) {
                case this.tag.RESIZER:
                case this.tag.CORNER: return htEle.parentElement;
                default: return htEle;
            }
        },
        /** @type {HTMLElement}  */
        isAssetTag(htEle) {
            switch (htEle.nodeName) {
                case this.tag.SELECTION:
                case this.tag.RESIZER:
                case this.tag.CORNER:
                case this.tag.DRAG: return true;
                default: return false;
            }
        }
    }
});
module.exports = {
    ucDesignerATTR,
    ucLayoutATTR,
    treeRecord
};