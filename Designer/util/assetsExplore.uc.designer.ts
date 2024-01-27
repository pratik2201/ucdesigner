import { Usercontrol } from 'ucbuilder/Usercontrol';
import { intenseGenerator } from 'ucbuilder/intenseGenerator';
import { UcOptions } from 'ucbuilder/enumAndMore';
/**
 *  code filename must same and case sensitive with classname 
 */
import { assetsExplore } from './assetsExplore.uc';


export class Designer extends Usercontrol {    
    static get giveMeHug(): string {
        return Usercontrol.giveMeHug;
    }
    
         
   
    public winframe1: import('uccontrols/controls/winFrame.uc').winFrame;
    public container: HTMLUnknownElement;
         
   
    public fileExplorer1: import('ucdesigner/designer/util/fileexplorer.uc').fileExplorer;
    public op_target: HTMLUnknownElement;

    
    constructor(){ super(); }
    initializecomponent(argsLst: IArguments, form: assetsExplore) {
         //let fargs = argsLst[0];
        //let args = fargs[fargs.length - 1];
        let args = argsLst[argsLst.length - 1] as UcOptions;
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
          this.container = CONTROLS.container as HTMLUnknownElement;
         
        
       
        this.fileExplorer1 = intenseGenerator.generateUC('ucdesigner/designer/util/fileexplorer.uc.ts',{ 
                            parentUc : this, 
                            mode:args.mode,
                            session:{
                                loadBySession:args.session.loadBySession,
                                uniqueIdentity:"fileExplorer1" , 
                                addNodeToParentSession:true,
                            },                           
                            wrapperHT : CONTROLS.fileExplorer1 
                        }) as any;
          this.op_target = CONTROLS.op_target as HTMLUnknownElement;

        ucExt.finalizeInit(args);
    }
}