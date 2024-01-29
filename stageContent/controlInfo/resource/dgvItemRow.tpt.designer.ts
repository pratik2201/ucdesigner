import { Template, TemplateNode } from 'ucbuilder/Template.js';
import { TptOptions, templatePathOptions } from 'ucbuilder/enumAndMore';
 

type footer_ELEMENT_MAP = {lbl_total : HTMLSpanElement,}
class footer_TEMPLATE extends TemplateNode{
    constructor(tpt:Template) { super(tpt);   }
   
    getAllControls(elementHT: HTMLElement): footer_ELEMENT_MAP {
        return this.extended.getAllControls(undefined,elementHT) as footer_ELEMENT_MAP;
    }
}
 

type header_ELEMENT_MAP = {}
class header_TEMPLATE extends TemplateNode{
    constructor(tpt:Template) { super(tpt);   }
   
    getAllControls(elementHT: HTMLElement): header_ELEMENT_MAP {
        return this.extended.getAllControls(undefined,elementHT) as header_ELEMENT_MAP;
    }
}
 

type primary_ELEMENT_MAP = {chk_allowed : HTMLInputElement,lbl_name : HTMLUnknownElement,lbl_company : HTMLUnknownElement,lbl_country : HTMLUnknownElement,lbl_email : HTMLUnknownElement,lbl_ipv4 : HTMLUnknownElement,lbl_color : HTMLUnknownElement,lbl_random_text : HTMLUnknownElement,}
class primary_TEMPLATE extends TemplateNode{
    constructor(tpt:Template) { super(tpt);   }
   
    getAllControls(elementHT: HTMLElement): primary_ELEMENT_MAP {
        return this.extended.getAllControls(undefined,elementHT) as primary_ELEMENT_MAP;
    }
}


export class Designer extends Template {
        
    public footer:footer_TEMPLATE; 
       
    public header:header_TEMPLATE; 
       
    public primary:primary_TEMPLATE; 
   

    constructor(args:IArguments){    
        super();    
        let aargs = Template.extractArgs(arguments);
        let fargs = aargs[aargs.length - 1] as TptOptions;
        
        //let fargs = Template.extractArgs(arguments) as TptOptions;
        
        //fargs = fargs[fargs.length-1] as TptOptions;
        let ext = this.extended;
        let tpts = Template.getTemplates.byDirectory(fargs.source.cfInfo.code.fullPath,false);
        
        
        ext._templeteNode = new footer_TEMPLATE(this);
        this.footer = ext._templeteNode as footer_TEMPLATE;
        this.footer.extended.initializecomponent(fargs,tpts['footer'],"footer"); 
       
        
        ext._templeteNode = new header_TEMPLATE(this);
        this.header = ext._templeteNode as header_TEMPLATE;
        this.header.extended.initializecomponent(fargs,tpts['header'],"header"); 
       
        
        ext._templeteNode = new primary_TEMPLATE(this);
        this.primary = ext._templeteNode as primary_TEMPLATE;
        this.primary.extended.initializecomponent(fargs,tpts['primary'],"primary"); 
       

        fargs.elementHT.remove();
    }
}