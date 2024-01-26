import * as ct from 'uccontrols';
import ucb from "ucbuilder"; 
ucb.registar();
import { intenseGenerator } from 'ucbuilder/intenseGenerator';

interface Session {
    loadBySession: boolean;
}

interface FormDesignerOptions {
    wrapperHT: HTMLElement;
    session: Session;
}

const startDesigner = (): void => {
    /*const frm: import('ucdesigner/formDesigner.uc') = intenseGenerator.generateUC('ucdesigner/formDesigner.uc.js', {
        wrapperHT: document.body,
        session: { loadBySession: true }
    }, "hello world this is perameter");
    frm.winFrame1.showDialog();*/
};
export default {
    startDesigner
}