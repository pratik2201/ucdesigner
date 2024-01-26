import { designerToolsType } from 'ucdesigner/enumAndMore.js';
import {formDesigner} from 'ucdesigner/formDesigner.uc.js';
import { Designer } from './ucStyle.uc.designer.js';
import { rootPathHandler } from 'ucbuilder/global/rootPathHandler';
import { ResourcesUC } from 'ucbuilder/ResourcesUC.js';
import { ucDesignerATTR } from 'ucdesigner/stageContent/ucLayout.uc.enumAndMore.js';
import * as ace from 'ace-builds/ace';
export class ucJsonPerameterEditor extends Designer {
    main: formDesigner | undefined;
    get activeEditor(): any { return this.main.tools.activeEditor; }
    get mainNode(): any { return this.activeEditor.mainNode; }
    get jsonData(): any { return this.activeEditor.mainNode.getAttribute(ucDesignerATTR.JSON_ROW); }
    editor: ace.Ace.Editor;
    refreshText = (): void => {
        this.editor.getSession().setValue(this.jsonData);
    }

    constructor() {
        super();
        this.initializecomponent(arguments, this);

        let _this = this;

        this.main = ResourcesUC.resources[designerToolsType.mainForm];
        this.main.tools.set(designerToolsType.jsonPerameter, this);

        this.main.editorEvent.activateEditor.on(this.refreshText);
        this.ucExtends.Events.beforeClose.on(evt => {
            this.main.tools.styleEditor = undefined;
            this.main.editorEvent.activateEditor.off(this.refreshText);
        });

        if (this.activeEditor != undefined)
            this.codeeditor1.value = this.jsonData;

        let inf = rootPathHandler.getInfoByAlices('@ucdesigner:');
        ace.config.set('basePath', inf.path + "/ace_files");

        this.editor = ace.edit(this.codeeditor1);
        this.editor.setTheme("ace/theme/dreamweaver");
        this.editor.session.setMode("ace/mode/json");
        this.editor.session.setTabSize(4);
        this.editor.setOptions({

        });

        this.ucExtends.self.addEventListener("focusin", (e) => {
            this.editor.getSession().on('change', this.onchangeText);
        });
        this.ucExtends.self.addEventListener("blur", (e) => {
            this.editor.getSession().off('change', this.onchangeText);
        });

        _this.main.editorEvent.activateEditor.on(() => {
            if (this.activeEditor != undefined)
                this.codeeditor1.value = this.jsonData;
        });
    }

    onchangeText = (): void => {
        this.main.tools.activeEditor.onJsonChange(this.editor.getSession().getValue());
    }
}