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
    
         
   
    public movable1: import('uccontrols/controls/Movable.uc').Movable;
         
   
    public filexplorer1: import('ucdesigner/Designer/util/fileExplorer.uc').fileExplorer;

    
    constructor(){ super(); }
    initializecomponent(argsLst: IArguments, form: projHandler) {
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
         
        
       
        this.filexplorer1 = intenseGenerator.generateUC('ucdesigner/Designer/util/fileExplorer.uc.ts',{ 
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
        Usercontrol.assignPropertiesFromDesigner(form);
    }
}