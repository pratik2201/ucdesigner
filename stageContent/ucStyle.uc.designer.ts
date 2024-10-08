import { Usercontrol } from 'ucbuilder/Usercontrol';
import { intenseGenerator } from 'ucbuilder/intenseGenerator';
import { UcOptions } from 'ucbuilder/enumAndMore';
/**
 *  code filename must same and case sensitive with classname 
 */
import { ucStyle } from './ucStyle.uc';


export class Designer extends Usercontrol {    
    static get giveMeHug(): string {
        return Usercontrol.giveMeHug;
    }
    
         
   
    public movable1: import('uccontrols/controls/Movable.uc').Movable;
    public codeeditor1: HTMLTextAreaElement;

    
    constructor(){ super(); }
    initializecomponent(argsLst: IArguments, form: ucStyle) {
         //let fargs = argsLst[0];
        //let args = fargs[fargs.length - 1];
        //let args = argsLst[argsLst.length - 1] as UcOptions;
        let fargs = Usercontrol.extractArgs(arguments);
        let args = fargs[fargs.length-1] as UcOptions;
        let ucExt = this.ucExtends;
        
        ucExt.initializecomponent(args);        
        let CONTROLS = ucExt.designer.getAllControls();
         
        
       
        this.movable1 = intenseGenerator.generateUC('uccontrols/controls/Movable.uc.ts',{ 
                            parentUc : this, 
                            mode:args.mode,
                            session:{
                                loadBySession:args.session.loadBySession,
                                uniqueIdentity:"movable1" , 
                                addNodeToParentSession:true,
                            },                           
                            wrapperHT : CONTROLS.movable1 
                        }) as any;
          this.codeeditor1 = CONTROLS.codeeditor1 as HTMLTextAreaElement;

        ucExt.finalizeInit(args);
        Usercontrol.assignPropertiesFromDesigner(form);
    }
}