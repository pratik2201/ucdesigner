
//import { intenseGenerator } from 'ucbuilder/intenseGenerator';
//console.log('~~~:['+ __dirname +']');
console.log('abc');
import * as ct from 'uccontrols';
import ucb from "ucbuilder";
import { intenseGenerator } from 'ucbuilder/intenseGenerator';
import path from 'path';
ucb.registar({
    // srcDir: __dirname,
    outDir: "/out/",
    rootDir: path.dirname(__dirname),
    /*html: __dirname,
    style: __dirname,
    perameters: __dirname,
    designer:__dirname,
    designerSrc:__dirname,
    code: __dirname,
    codeSrc: __dirname,*/
});
export const startDesigner = (sessionFilePath: string = ""): void => {
    let s = ct;
    console.log('dsf');
    
    const frm: import('ucdesigner/formDesigner.uc').formDesigner = intenseGenerator.generateUC('ucdesigner/formDesigner.uc.js', {
        wrapperHT: document.body,
        session: { loadBySession: true }
    }, sessionFilePath) as any;
    frm.winFrame1.showDialog();
};