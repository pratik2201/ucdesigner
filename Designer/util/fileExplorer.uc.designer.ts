import { Usercontrol } from 'ucbuilder/Usercontrol';
import { intenseGenerator } from 'ucbuilder/intenseGenerator';
import { UcOptions } from 'ucbuilder/enumAndMore';
/**
 *  code filename must same and case sensitive with classname 
 */
import { fileExplorer } from './fileExplorer.uc';


export class Designer extends Usercontrol {    
    static get giveMeHug(): string {
        return Usercontrol.giveMeHug;
    }
    
    protected cmd_addfile: HTMLElement;
    protected cmd_addfolder: HTMLElement;
    protected cmd_delete: HTMLElement;
         
   
    public comboBox1: import('uccontrols/controls/comboBox.uc').comboBox;
         
   
    public listview1: import('uccontrols/controls/ListView.uc').ListView;

    
    constructor(){ super(); }
    initializecomponent(argsLst: IArguments, form: fileExplorer) {
         //let fargs = argsLst[0];
        //let args = fargs[fargs.length - 1];
        //let args = argsLst[argsLst.length - 1] as UcOptions;
        let fargs = Usercontrol.extractArgs(arguments);
        let args = fargs[fargs.length-1] as UcOptions;
        let ucExt = this.ucExtends;
        
        ucExt.initializecomponent(args);        
        let CONTROLS = ucExt.designer.getAllControls();
          this.cmd_addfile = CONTROLS.cmd_addfile as HTMLElement;
          this.cmd_addfolder = CONTROLS.cmd_addfolder as HTMLElement;
          this.cmd_delete = CONTROLS.cmd_delete as HTMLElement;
         
        
       
        this.comboBox1 = intenseGenerator.generateUC('uccontrols/controls/comboBox.uc.ts',{ 
                            parentUc : this, 
                            mode:args.mode,
                            session:{
                                loadBySession:args.session.loadBySession,
                                uniqueIdentity:"comboBox1" , 
                                addNodeToParentSession:true,
                            },                           
                            wrapperHT : CONTROLS.comboBox1 
                        }) as any;
         
        
       
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