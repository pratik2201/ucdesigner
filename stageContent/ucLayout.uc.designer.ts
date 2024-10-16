import { Usercontrol } from 'ucbuilder/Usercontrol';
import { intenseGenerator } from 'ucbuilder/intenseGenerator';
import { UcOptions } from 'ucbuilder/enumAndMore';
import { Movable } from 'uccontrols/controls/Movable.uc';
import { ListView } from 'uccontrols/controls/ListView.uc';

/**
 *  code filename must same and case sensitive with classname 
 */
import { ucLayout } from './ucLayout.uc';


export class Designer extends Usercontrol {    
    static get giveMeHug(): string {
        return Usercontrol.giveMeHug;
    }
    static Create(pera: UcOptions, ...args: any[]): ucLayout { 
        /** ucdesigner/stageContent/ucLayout.uc */
        return intenseGenerator.generateUC('ucdesigner/stageContent/ucLayout.uc',pera,...args) as ucLayout;
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
         
        
       
        this.movable1 = Movable.Create({ 
                            parentUc : this, 
                            mode:args.mode,
                            session:{
                                loadBySession:args.session.loadBySession,
                                uniqueIdentity:"movable1" , 
                                addNodeToParentSession:true,
                            },   
                            decisionForTargerElement:'replace',
                            targetElement : CONTROLS.movable1 
                        });
        this.movable1.ucExtends.show();
        this.cmd_addElement = CONTROLS.cmd_addElement as HTMLUnknownElement;
        this.cmd_addTextNode = CONTROLS.cmd_addTextNode as HTMLUnknownElement;
        this.cmd_removeTextNode = CONTROLS.cmd_removeTextNode as HTMLUnknownElement;
         
        
       
        this.listview1 = ListView.Create({ 
                            parentUc : this, 
                            mode:args.mode,
                            session:{
                                loadBySession:args.session.loadBySession,
                                uniqueIdentity:"listview1" , 
                                addNodeToParentSession:true,
                            },   
                            decisionForTargerElement:'replace',
                            targetElement : CONTROLS.listview1 
                        });
        this.listview1.ucExtends.show();

        ucExt.finalizeInit(args);
        ucExt.session.prepareForAutoLoadIfExist();
        if (args.loadAt) args.loadAt.appendChild(ucExt.wrapperHT);
       
        Usercontrol.assignPropertiesFromDesigner(form);
    }
}