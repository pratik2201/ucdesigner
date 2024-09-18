"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.treeRecord = exports.ucLayoutATTR = exports.ucDesignerATTR = void 0;
const common_1 = require("ucbuilder/build/common");
class treeRecord {
    constructor() {
        this.index = -1;
        this.uniqId = "";
        this._element = undefined;
        this.nodeType = undefined;
        this.outputElement = undefined;
        this.rect = undefined;
        this.layoutitemElement = undefined;
        this.iconFileName = "other-tags.png";
        this.level = 0;
    }
    set element(val) {
        this._element = val;
        this.nodeType = this.element.nodeType;
    }
    get element() {
        return this._element;
    }
    get xName() {
        let ele = this.element;
        if (ele === undefined)
            return "";
        switch (ele.nodeType) {
            case ele.ELEMENT_NODE: return ele.hasAttribute("x-name") ? ele.getAttribute("x-name") : "";
            default: return "";
        }
    }
    get nodeName() {
        let ele = this.element;
        if (ele === undefined)
            return "";
        switch (ele.nodeType) {
            case ele.ELEMENT_NODE: return ele.nodeName;
            case ele.TEXT_NODE: return ele.textContent;
        }
    }
    get leftSpace() {
        return this.level * 10;
    }
    get attributes() {
        let ele = this.element;
        if (ele === undefined)
            return [];
        let rtrn = [];
        switch (ele.nodeType) {
            case ele.ELEMENT_NODE:
                for (let index = 0; index < ele.attributes.length; index++) {
                    rtrn.push(ele.attributes.item(index));
                }
                rtrn.sort((a, b) => {
                    let fa = a.name.toLowerCase(), fb = b.name.toLowerCase();
                    if (fa < fb)
                        return -1;
                    if (fa > fb)
                        return 1;
                    return 0;
                });
                return rtrn;
            default: return [];
        }
    }
}
exports.treeRecord = treeRecord;
const ucLayoutATTR = Object.freeze({
    SELECTED_INDEX: "is-selected",
});
exports.ucLayoutATTR = ucLayoutATTR;
const ucDesignerATTR = Object.freeze({
    JSON_ROW: "x.temp-jsonperameters",
    IGNORE_IN_DESIGNER: "ignore-in-designer",
    ITEM_INDEX: "ii" + common_1.uniqOpt.randomNo(),
    UNIQID: "ui" + common_1.uniqOpt.randomNo(),
    SELECTED: "sel" + common_1.uniqOpt.randomNo(),
    TEXT_NODE_TAG: "TN" + common_1.uniqOpt.randomNo(),
    transAssets: {
        tag: {
            SELECTION: "CTRRECT",
            RESIZER: "RESIZER",
            CORNER: "CORNER",
            DRAG: "DRGRECT",
        },
        getMainTag(htEle) {
            switch (htEle.nodeName) {
                case this.tag.RESIZER:
                case this.tag.CORNER: return htEle.parentElement;
                default: return htEle;
            }
        },
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
exports.ucDesignerATTR = ucDesignerATTR;
