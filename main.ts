
//import { intenseGenerator } from 'ucbuilder/intenseGenerator';
import * as ct from 'uccontrols';
import ucb from "ucbuilder";
import { intenseGenerator } from 'ucbuilder/intenseGenerator';
ucb.registar();
export const startDesigner = (): void => {

    let s = ct;
    const frm: import('ucdesigner/formDesigner.uc').formDesigner = intenseGenerator.generateUC('ucdesigner/formDesigner.uc.js', {
        wrapperHT: document.body,
        session: { loadBySession: true }
    }, "hello world this is perameter") as any;
    frm.winFrame1.showDialog();
};