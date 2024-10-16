import { Usercontrol } from 'ucbuilder/Usercontrol';
import { intenseGenerator } from 'ucbuilder/intenseGenerator';
import { UcOptions } from 'ucbuilder/enumAndMore';
import { Movable } from 'uccontrols/controls/Movable.uc';

/**
 *  code filename must same and case sensitive with classname 
 */
import { ucStyle } from './ucStyle.uc';


export class Designer extends Usercontrol {    
    static get giveMeHug(): string {
        return Usercontrol.giveMeHug;
    }
    static Create(pera: UcOptions, ...args: any[]): ucStyle { 
        /** ucdesigner/stageContent/ucStyle.uc */
        return intenseGenerator.generateUC('ucdesigner/stageContent/ucStyle.uc',pera,...args) as ucStyle;
    }
    
         
   
    public movable1: import('uccontrols/controls/Movable.uc').Movable;
    public codeeditor1: HTMLTextAreaElement;

    
    constructor(){ super(); }
    initializecomponent(argsLst: IArguments, form: ucStyle) {
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
        this.codeeditor1 = CONTROLS.codeeditor1 as HTMLTextAreaElement;

        ucExt.finalizeInit(args);
        ucExt.session.prepareForAutoLoadIfExist();
        if (args.loadAt) args.loadAt.appendChild(ucExt.wrapperHT);
       
        Usercontrol.assignPropertiesFromDesigner(form);
    }
}