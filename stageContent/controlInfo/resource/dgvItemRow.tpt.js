const { designer } = require('./dgvItemRow.tpt.designer.js');
class dgvItemRow extends designer {
    constructor() {
        super(arguments);
        /*
        this.detail.extended.Events.onGenerateNode = (ht, row) => {
           let ctrls = this.detail.getAllControls(ht);
           ctrls.chk_allowed.addEventListener("change", (e) => {
               row.ischecked = (ctrls.chk_allowed.checked) ? "checked" : "";
           });
       }
       */
    }
}
module.exports = dgvItemRow;