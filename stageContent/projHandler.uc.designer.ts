import { Usercontrol } from 'ucbuilder/Usercontrol';
import { intenseGenerator } from 'ucbuilder/intenseGenerator';
import { UcOptions } from 'ucbuilder/enumAndMore';
/**
 *  code filename must same and case sensitive with classname 
 */
import { projHandler } from './projHandler.uc';


export class Designer extends Usercontrol {    
    static get giveMeHug(): string {
        return Usercontrol.giveMeHug;
    }
    
         
   
    public movable1: import('uccontrols/controls/movable.uc').movable;
         
   
    public filexplorer1: import('ucdesigner/designer/util/fileexplorer.uc').fileexplorer;

    
    constructor(){ super(); }
    initializecomponent(argsLst: IArguments, form: projHandler) {
         //let fargs = argsLst[0];
        //let args = fargs[fargs.length - 1];
        let args = argsLst[argsLst.length - 1] as UcOptions;
        let ucExt = this.ucExtends;
        ucExt.initializecomponent(args);        
        let CONTROLS = ucExt.designer.getAllControls();
         
        
       
        this.movable1 = intenseGenerator.generateUC('uccontrols/controls/movable.uc.ts',{ 
                            parentUc : this, 
                            mode:args.mode,
                            session:{
                                loadBySession:args.session.loadBySession,
                                uniqueIdentity:"movable1" , 
                                addNodeToParentSession:true,
                            },                           
                            wrapperHT : CONTROLS.movable1 
                        }) as any;
         
        
       
        this.filexplorer1 = intenseGenerator.generateUC('ucdesigner/designer/util/fileexplorer.uc.ts',{ 
                            parentUc : this, 
                            mode:args.mode,
                            session:{
                                loadBySession:args.session.loadBySession,
                                uniqueIdentity:"filexplorer1" , 
                                addNodeToParentSession:true,
                            },                           
                            wrapperHT : CONTROLS.filexplorer1 
                        }) as any;

        ucExt.finalizeInit(args);
    }
}