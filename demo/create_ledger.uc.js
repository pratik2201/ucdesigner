const { designer } = require('./create_ledger.uc.designer.js');
class create_ledger extends designer{
    constructor() { super(); this.initializecomponent(arguments, this); 
        this.cmd_save.addEventListener("mousedown",(e)=>{
            
        });
        //this.txt_city
    }
}
module.exports = create_ledger;