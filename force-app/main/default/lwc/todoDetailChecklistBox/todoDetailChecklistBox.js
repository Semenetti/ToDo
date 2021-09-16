import {api, LightningElement} from 'lwc';

export default class TodoDetailChecklistBox extends LightningElement {
    @api incomingSubtodos
    @api incomingTodo;
    showModal;

    connectedCallback() {
        this.showModal = true;
    }

    cancel() {
        this.dispatchEvent(new CustomEvent('cancel', {detail: ''}));
        this.showModal = false;
    }

    saveChecklist(){
        this.dispatchEvent(new CustomEvent('save', {detail: ''}));
        this.showModal = false;
    };
}