import { Designer } from './dgvItemRow.tpt.designer.js';

class dgvItemRow extends Designer {
    constructor() {
        super(arguments);

        this.primary.extended.Events.onGenerateNode = (ht: HTMLElement, row: any) => {
            let ctrls = this.primary.getAllControls(ht);
            ctrls.chk_allowed.addEventListener("change", (e: Event) => {
                ht.setAttribute('has-checked', ''+ctrls.chk_allowed.checked);
                row.ischecked = (ctrls.chk_allowed.checked) ? "checked" : "";
            });
        }
    }
}

export default dgvItemRow;