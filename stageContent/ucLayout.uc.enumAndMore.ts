import { uniqOpt } from "ucbuilder/build/common";
import { Rect } from "ucbuilder/global/drawing/shapes";

class treeRecord {
    index: number = -1;
    uniqId: string = "";
    private _element: HTMLElement | undefined = undefined;
    nodeType: string | undefined = undefined;

    set element(val: HTMLElement) { 
        this._element = val; 
        this.nodeType = this.element.nodeType; 
    }
    get element(): HTMLElement | undefined { 
        return this._element; 
    }

    outputElement: HTMLElement | undefined = undefined;
    rect: Rect | undefined = undefined;
    layoutitemElement: HTMLElement | undefined = undefined;
    iconFileName: string = "other-tags.png";

    get xName(): string {
        let ele = this.element; 
        if (ele === undefined) return "";
        switch (ele.nodeType) {
            case ele.ELEMENT_NODE: return ele.hasAttribute("x-name") ? ele.getAttribute("x-name") : "";
            default: return "";
        }
    }
    
    get nodeName(): string {
        let ele = this.element;
        if (ele === undefined) return "";
        switch (ele.nodeType) {
            case ele.ELEMENT_NODE: return ele.nodeName;
            case ele.TEXT_NODE: return ele.textContent;
        }
    }

    level: number = 0;
    get leftSpace(): number { 
        return this.level * 10; 
    }

    get attributes(): NamedNodeMap[] {
        let ele = this.element;
        if (ele === undefined) return [];
        let rtrn: NamedNodeMap[] = [];
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
        getMainTag(htEle: HTMLElement): HTMLElement {
            switch (htEle.nodeName) {
                case this.tag.RESIZER:
                case this.tag.CORNER: return htEle.parentElement;
                default: return htEle;
            }
        },
        isAssetTag(htEle: HTMLElement): boolean {
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

export {
    ucDesignerATTR,
    ucLayoutATTR,
    treeRecord
};