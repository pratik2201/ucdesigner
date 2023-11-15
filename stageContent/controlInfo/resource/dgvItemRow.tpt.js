const { designer } = require('./dgvItemRow.tpt.designer.js');
class dgvItemRow extends designer {
    constructor() {
        super(arguments);

        this.primary.extended.Events.onGenerateNode = (ht, row) => {
            let ctrls = this.primary.getAllControls(ht);
            ctrls.chk_allowed.addEventListener("change", (e) => {
                ht.setAttribute('has-checked', ctrls.chk_allowed.checked);
                row.ischecked = (ctrls.chk_allowed.checked) ? "checked" : "";
            });
        }
    }
}
module.exports = dgvItemRow;