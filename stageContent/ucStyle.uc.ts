import { designerToolsType } from 'ucdesigner/enumAndMore.js';
import {formDesigner} from 'ucdesigner/formDesigner.uc.js';
import { Designer } from './ucStyle.uc.designer';
import { rootPathHandler } from 'ucbuilder/global/rootPathHandler';
import { ResourcesUC } from 'ucbuilder/ResourcesUC.js';
//import * as ace from 'ace-builds/ace';
import * as ace from 'ace-builds/src-noconflict/ace';

export class ucStyle extends Designer {
    main: formDesigner | undefined;
    
    get activeEditor(): any { return this.main.tools.activeEditor; }
    get mainNode(): any { return this.activeEditor.mainNode; }

    refreshText = (): void => {
        this.editor.getSession().setValue(this.activeEditor.cssContent);
    }
    editor: ace.Ace.Editor;
    constructor() {
        super();
        this.initializecomponent(arguments, this);

        let _this = this;

        this.main = ResourcesUC.resources[designerToolsType.mainForm];
        this.main.tools.set(designerToolsType.styler, this);
        this.main.editorEvent.activateEditor.on(this.refreshText);
        this.ucExtends.Events.beforeClose.on((evt: any) => {
            this.main.tools.styleEditor = undefined;
            this.main.editorEvent.activateEditor.off(this.refreshText);
        });
        if (this.activeEditor != undefined)
            this.codeeditor1.value = this.activeEditor.cssContent;

        let inf = rootPathHandler.getInfoByAlices('@ucdesigner:');
        ace.config.set('basePath', inf.path + "/ace_files");
        this.editor = ace.edit(this.codeeditor1);

        this.editor.setTheme("ace/theme/dreamweaver");
        this.editor.session.setMode("ace/mode/scss");
        this.editor.session.setTabSize(4);
        this.editor.setOptions({
            enableBasicAutocompletion: true
        });

        this.ucExtends.self.addEventListener("focusin", (e: any) => {
            this.editor.getSession().on('change', this.onchangeText);
        });
        this.ucExtends.self.addEventListener("blur", (e: any) => {
            this.editor.getSession().off('change', this.onchangeText);
        });

        _this.main.editorEvent.activateEditor.on(() => {
            if (this.activeEditor != undefined)
                this.codeeditor1.value = this.activeEditor.cssContent;
        });
    }

    onchangeText = (): void => {
        let contnet = this.editor.getSession().getValue();
        this.main.tools.activeEditor.onCSSChange(contnet);
    }
}