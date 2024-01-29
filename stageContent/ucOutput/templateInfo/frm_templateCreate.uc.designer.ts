import { Usercontrol } from 'ucbuilder/Usercontrol';
import { intenseGenerator } from 'ucbuilder/intenseGenerator';
import { UcOptions } from 'ucbuilder/enumAndMore';
/**
 *  code filename must same and case sensitive with classname 
 */
import { frm_templateCreate } from './frm_templateCreate.uc';


export class Designer extends Usercontrol {    
    static get giveMeHug(): string {
        return Usercontrol.giveMeHug;
    }
    
         
   
    public winframe1: import('uccontrols/controls/winFrame.uc').winFrame;
    public txt_templateName: HTMLInputElement;
    public txt_templateDescription: HTMLTextAreaElement;
    public txt_jsonData: HTMLTextAreaElement;

    
    constructor(){ super(); }
    initializecomponent(argsLst: IArguments, form: frm_templateCreate) {
         //let fargs = argsLst[0];
        //let args = fargs[fargs.length - 1];
        //let args = argsLst[argsLst.length - 1] as UcOptions;
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
                            wrapperHT : CONTROLS.winframe1 
                        }) as any;
          this.txt_templateName = CONTROLS.txt_templateName as HTMLInputElement;
          this.txt_templateDescription = CONTROLS.txt_templateDescription as HTMLTextAreaElement;
          this.txt_jsonData = CONTROLS.txt_jsonData as HTMLTextAreaElement;

        ucExt.finalizeInit(args);
        Usercontrol.assignPropertiesFromDesigner(form);
    }
}