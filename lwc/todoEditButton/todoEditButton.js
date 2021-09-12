import {LightningElement, api} from 'lwc';

export default class TodoEditButton extends LightningElement {

    @api recordId;
    openModal = false;

    showModal() {
        this.openModal = true;
        console.log(this.recordId);
    }

    handleCancel () {
        const event = new CustomEvent('cancel',{ detail: ''});
        this.dispatchEvent(event);
        this.openModal = false;
    }

    handleSave () {
        const event = new CustomEvent('save',{ detail: ''});
        this.dispatchEvent(event);
        this.openModal = false;
    }

}