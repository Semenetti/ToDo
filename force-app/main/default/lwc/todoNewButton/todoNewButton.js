import {LightningElement} from 'lwc';

export default class TodoNewButton extends LightningElement {

    openModal = false;

    showModal() {
        this.openModal = true;
    }

    handleCancel() {
        const event = new CustomEvent('cancel', {detail: ''});
        this.dispatchEvent(event);
        this.openModal = false;
    }

    handleSave() {
        const event = new CustomEvent('save', {detail: ''});
        this.dispatchEvent(event);
        this.openModal = false;
    }

}