import {LightningElement, api} from 'lwc';
import TODO_ID_SUBTODO from '@salesforce/schema/Subtodo__c.Todo__c';
import NAME_SUBTODO from '@salesforce/schema/Subtodo__c.Name';
import ID_SUBTODO from '@salesforce/schema/Subtodo__c.Id';


export default class TodoDetailChecklistItem extends LightningElement {
    @api isEditableChecklist;
    @api incomingSubtodo;

    checked = false;
    newNameValue = '';

    connectedCallback() {
        this.newNameValue = this.incomingSubtodo[NAME_SUBTODO.fieldApiName];
    }

// form rendering booleans
    get showEdit() {
        return this.incomingSubtodo['edit'];
    }

    get allowSelection() {
        return this.incomingSubtodo['allowSelection'];
    }

    get disableSave() {
            return this.newNameValue.length < 4;
    }

// handlers

    handleChangeName(e) {
        this.newNameValue = e.detail.value;
    }

    handleItemClick() {
        let detail = {id : this.incomingSubtodo[ID_SUBTODO.fieldApiName]};
        this.dispatchEvent(new CustomEvent('itemselected', {detail : detail}));
    }

    handleSaveChanges() {
        let detail = {id : this.incomingSubtodo[ID_SUBTODO.fieldApiName], text : this.newNameValue};
        this.dispatchEvent(new CustomEvent('saveitem', {detail : detail}));
    }

    handleDelete() {
        let detail = {id : this.incomingSubtodo[ID_SUBTODO.fieldApiName]};
        this.dispatchEvent(new CustomEvent('deleteitem', {detail : detail}));
    }

}
