import { Usercontrol } from 'ucbuilder/Usercontrol';
import { intenseGenerator } from 'ucbuilder/intenseGenerator';
import { UcOptions } from 'ucbuilder/enumAndMore';
import { winFrame } from 'uccontrols/controls/winFrame.uc';
import { fileExplorer } from 'ucdesigner/Designer/util/fileExplorer.uc';

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
         
   
    public fileExplorer1: import('ucdesigner/Designer/util/fileExplorer.uc').fileExplorer;
    public op_target: HTMLUnknownElement;

    
    constructor(){ super(); }
    initializecomponent(argsLst: IArguments, form: assetsExplore) {
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
        this.winframe1.ucExtends.show();
        this.container = CONTROLS.container as HTMLUnknownElement;
         
        
       
        this.fileExplorer1 = intenseGenerator.generateUC('ucdesigner/Designer/util/fileExplorer.uc.ts',{ 
                            parentUc : this, 
                            mode:args.mode,
                            session:{
                                loadBySession:args.session.loadBySession,
                                uniqueIdentity:"fileExplorer1" , 
                                addNodeToParentSession:true,
                            },   
                            decisionForTargerElement:'replace',
                            targetElement : CONTROLS.fileExplorer1 
                        }) as any;
        this.fileExplorer1.ucExtends.show();
        this.op_target = CONTROLS.op_target as HTMLUnknownElement;

        ucExt.finalizeInit(args);
        ucExt.session.prepareForAutoLoadIfExist();
        if (args.loadAt) args.loadAt.appendChild(ucExt.wrapperHT);
       
        Usercontrol.assignPropertiesFromDesigner(form);
    }
}