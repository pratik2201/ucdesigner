import { Usercontrol } from 'ucbuilder/Usercontrol';
import { intenseGenerator } from 'ucbuilder/intenseGenerator';
import { UcOptions } from 'ucbuilder/enumAndMore';
import { winFrame } from 'uccontrols/controls/winFrame.uc';

/**
 *  code filename must same and case sensitive with classname 
 */
import { create_ledger } from './create_ledger.uc';


export class Designer extends Usercontrol {    
    static get giveMeHug(): string {
        return Usercontrol.giveMeHug;
    }
    
         
   
    public winframe1: import('uccontrols/controls/winFrame.uc').winFrame;
    public txt_uid: HTMLInputElement;
    public passRow: HTMLTableRowElement;
    public txt_password: HTMLInputElement;
    protected txt_city: HTMLInputElement;
    public txt_address: HTMLTextAreaElement;
    public cmd_save: HTMLUnknownElement;
    public phoneNo1: HTMLInputElement;
    public phoneNo2: HTMLInputElement;
    public email: HTMLInputElement;
    public mobile_no: HTMLInputElement;

    
    constructor(){ super(); }
    initializecomponent(argsLst: IArguments, form: create_ledger) {
        let fargs = Usercontrol.extractArgs(arguments);
        let args = fargs[fargs.length-1] as UcOptions;
        let ucExt = this.ucExtends;
        
        ucExt.initializecomponent(args);        
        let CONTROLS = ucExt.designer.getAllControls();
         
        
       
        this.winframe1 = intenseGenerator.generateUC('uccontrols/controls/winFrame.uc.ts',{ 
                            parentUc : this, 
                            mode:args.mode,
                            session:{
                                loadBySession:args.session.loadBySession,
                                uniqueIdentity:"winframe1" , 
                                addNodeToParentSession:true,
                            },   
                            decisionForTargerElement:'replace',
                            targetElement : CONTROLS.winframe1 
                        }) as any;
          this.txt_uid = CONTROLS.txt_uid as HTMLInputElement;
          this.passRow = CONTROLS.passRow as HTMLTableRowElement;
          this.txt_password = CONTROLS.txt_password as HTMLInputElement;
          this.txt_city = CONTROLS.txt_city as HTMLInputElement;
          this.txt_address = CONTROLS.txt_address as HTMLTextAreaElement;
          this.cmd_save = CONTROLS.cmd_save as HTMLUnknownElement;
          this.phoneNo1 = CONTROLS.phoneNo1 as HTMLInputElement;
          this.phoneNo2 = CONTROLS.phoneNo2 as HTMLInputElement;
          this.email = CONTROLS.email as HTMLInputElement;
          this.mobile_no = CONTROLS.mobile_no as HTMLInputElement;

        ucExt.finalizeInit(args);
        ucExt.session.prepareForAutoLoadIfExist();
        if (args.loadAt) args.loadAt.appendChild(ucExt.wrapperHT);
       
        Usercontrol.assignPropertiesFromDesigner(form);
    }
}