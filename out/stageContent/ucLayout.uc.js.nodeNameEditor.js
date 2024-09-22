"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeNameEditor = void 0;
const common_1 = require("ucbuilder/build/common");
const ElementEditor_1 = require("ucbuilder/global/ElementEditor");
class nodeNameEditor {
    constructor() {
        this.editor = new ElementEditor_1.ElementEditor();
        this.row = undefined;
        this.editor.onDemandActualValue = () => {
            var _a, _b, _c, _d, _e;
            switch ((_a = this.row) === null || _a === void 0 ? void 0 : _a.nodeType) {
                case (_b = this.row) === null || _b === void 0 ? void 0 : _b.element.ELEMENT_NODE:
                    return (_c = this.row) === null || _c === void 0 ? void 0 : _c.element.nodeName;
                case (_d = this.row) === null || _d === void 0 ? void 0 : _d.element.TEXT_NODE:
                    return (_e = this.row) === null || _e === void 0 ? void 0 : _e.element.textContent;
                default:
                    return "";
            }
        };
    }
    editRow(row, htEle = undefined, callbackAfterSave = (nval, oval) => { }, callbackAfterReset = (oval) => { }) {
        let _this = this;
        this.row = row;
        this.editor.editRow(htEle, (nval, oval) => {
            if (_this.row == undefined)
                return;
            _this.editor.isInEditMode = false;
            if (_this.row.nodeType == _this.row.element.ELEMENT_NODE) {
                let nName = nval.trim().replace(/\n|\r|<br>/ig, "");
                common_1.controlOpt.renameTag(_this.row.element, nName);
            }
            else {
                if (nval == (htEle === null || htEle === void 0 ? void 0 : htEle.innerText)) {
                    let e = _this.row.element;
                    e.textContent = nval;
                }
                else {
                    _this.row.element.parentElement.innerHTML = nval;
                }
            }
            callbackAfterSave(nval, oval);
            _this.row = undefined;
        }, (oval) => {
            callbackAfterReset(oval);
        }, true);
    }
}
exports.nodeNameEditor = nodeNameEditor;
