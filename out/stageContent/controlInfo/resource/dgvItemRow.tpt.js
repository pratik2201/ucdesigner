"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dgvItemRow_tpt_designer_js_1 = require("./dgvItemRow.tpt.designer.js");
class dgvItemRow extends dgvItemRow_tpt_designer_js_1.Designer {
    constructor() {
        super(arguments);
        this.primary.extended.Events.onGenerateNode = (ht, row) => {
            let ctrls = this.primary.getAllControls(ht);
            ctrls.chk_allowed.addEventListener("change", (e) => {
                ht.setAttribute('has-checked', '' + ctrls.chk_allowed.checked);
                row.ischecked = (ctrls.chk_allowed.checked) ? "checked" : "";
            });
        };
    }
}
exports.default = dgvItemRow;
