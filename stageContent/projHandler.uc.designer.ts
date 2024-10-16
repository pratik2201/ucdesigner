import { Usercontrol } from 'ucbuilder/Usercontrol';
import { intenseGenerator } from 'ucbuilder/intenseGenerator';
import { UcOptions } from 'ucbuilder/enumAndMore';
import { Movable } from 'uccontrols/controls/Movable.uc';
import { fileExplorer } from 'ucdesigner/Designer/util/fileExplorer.uc';

/**
 *  code filename must same and case sensitive with classname 
 */
import { projHandler } from './projHandler.uc';


export class Designer extends Usercontrol {    
    static get giveMeHug(): string {
        return Usercontrol.giveMeHug;
    }
    static Create(pera: UcOptions, ...args: any[]): projHandler { 
        /** ucdesigner/stageContent/projHandler.uc */
        return intenseGenerator.generateUC('ucdesigner/stageContent/projHandler.uc',pera,...args) as projHandler;
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
         
        
       
        this.filexplorer1 = fileExplorer.Create({ 
                            parentUc : this, 
                            mode:args.mode,
                            session:{
                                loadBySession:args.session.loadBySession,
                                uniqueIdentity:"filexplorer1" , 
                                addNodeToParentSession:true,
                            },   
                            decisionForTargerElement:'replace',
                            targetElement : CONTROLS.filexplorer1 
                        });
        this.filexplorer1.ucExtends.show();

        ucExt.finalizeInit(args);
        ucExt.session.prepareForAutoLoadIfExist();
        if (args.loadAt) args.loadAt.appendChild(ucExt.wrapperHT);
       
        Usercontrol.assignPropertiesFromDesigner(form);
    }
}