require('uccontrols');
require('ucbuilder').register.registarMe();
module.exports = {
    startDesigner: () => {
        console.log();
        let { intenseGenerator } = require('@ucbuilder:/intenseGenerator');

        /**  @type {import ('@ucdesigner:/formDesigner.uc.js')} */
        let frm = intenseGenerator.generateUC('@ucdesigner:/formDesigner.uc.js',
            {
                wrapperHT: document.body,
                session: { loadBySession: true }
            }, "hello world this is perameter");
        frm.winFrame1.showDialog();
    }
}