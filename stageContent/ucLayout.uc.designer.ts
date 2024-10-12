import { Usercontrol } from 'ucbuilder/Usercontrol';
import { intenseGenerator } from 'ucbuilder/intenseGenerator';
import { UcOptions } from 'ucbuilder/enumAndMore';
/**
 *  code filename must same and case sensitive with classname 
 */
import { ucLayout } from './ucLayout.uc';


export class Designer extends Usercontrol {    
    static get giveMeHug(): string {
        return Usercontrol.giveMeHug;
    }
    
         
   
    public movable1: import('uccontrols/controls/Movable.uc').Movable;
    public cmd_addElement: HTMLUnknownElement;
    public cmd_addTextNode: HTMLUnknownElement;
    public cmd_removeTextNode: HTMLUnknownElement;
         
   
    public listview1: import('uccontrols/controls/ListView.uc').ListView;

    
    constructor(){ super(); }
    initializecomponent(argsLst: IArguments, form: ucLayout) {
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
          this.cmd_addElement = CONTROLS.cmd_addElement as HTMLUnknownElement;
          this.cmd_addTextNode = CONTROLS.cmd_addTextNode as HTMLUnknownElement;
          this.cmd_removeTextNode = CONTROLS.cmd_removeTextNode as HTMLUnknownElement;
         
        
       
        this.listview1 = intenseGenerator.generateUC('uccontrols/controls/ListView.uc.ts',{ 
                            parentUc : this, 
                            mode:args.mode,
                            session:{
                                loadBySession:args.session.loadBySession,
                                uniqueIdentity:"listview1" , 
                                addNodeToParentSession:true,
                            },                           
                            wrapperHT : CONTROLS.listview1 
                        }) as any;

        ucExt.finalizeInit(args);
        Usercontrol.assignPropertiesFromDesigner(form);
    }
}