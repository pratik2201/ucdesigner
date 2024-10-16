import { Usercontrol } from 'ucbuilder/Usercontrol';
import { intenseGenerator } from 'ucbuilder/intenseGenerator';
import { UcOptions } from 'ucbuilder/enumAndMore';
import { comboBox } from 'uccontrols/controls/comboBox.uc';
import { ListView } from 'uccontrols/controls/ListView.uc';

/**
 *  code filename must same and case sensitive with classname 
 */
import { fileExplorer } from './fileExplorer.uc';


export class Designer extends Usercontrol {    
    static get giveMeHug(): string {
        return Usercontrol.giveMeHug;
    }
    static Create(pera: UcOptions, ...args: any[]): fileExplorer { 
        /** ucdesigner/Designer/util/fileExplorer.uc */
        return intenseGenerator.generateUC('ucdesigner/Designer/util/fileExplorer.uc',pera,...args) as fileExplorer;
    }
    
    protected cmd_addfile: HTMLElement;
    protected cmd_addfolder: HTMLElement;
    protected cmd_delete: HTMLElement;
         
   
    public comboBox1: import('uccontrols/controls/comboBox.uc').comboBox;
         
   
    public listview1: import('uccontrols/controls/ListView.uc').ListView;

    
    constructor(){ super(); }
    initializecomponent(argsLst: IArguments, form: fileExplorer) {
        let fargs = Usercontrol.extractArgs(arguments);
        let args = fargs[fargs.length-1] as UcOptions;
        let ucExt = this.ucExtends;
        
        ucExt.initializecomponent(args);        
        let CONTROLS = ucExt.designer.getAllControls();
        this.cmd_addfile = CONTROLS.cmd_addfile as HTMLElement;
        this.cmd_addfolder = CONTROLS.cmd_addfolder as HTMLElement;
        this.cmd_delete = CONTROLS.cmd_delete as HTMLElement;
         
        
       
        this.comboBox1 = comboBox.Create({ 
                            parentUc : this, 
                            mode:args.mode,
                            session:{
                                loadBySession:args.session.loadBySession,
                                uniqueIdentity:"comboBox1" , 
                                addNodeToParentSession:true,
                            },   
                            decisionForTargerElement:'replace',
                            targetElement : CONTROLS.comboBox1 
                        });
        this.comboBox1.ucExtends.show();
         
        
       
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