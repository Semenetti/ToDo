// todo New
import {LightningElement, wire, api} from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import {getObjectInfo} from 'lightning/uiObjectInfoApi';
import TODO_OBJECT from '@salesforce/schema/Todo__c';

export default class TodoNew extends LightningElement {

    recordTypeOK = false;
    recordTypeId = 'Not selected';
    recordTypeLabel;

    openModal = false;
    headerText = 'Select record type';

    todo = {

    }

    @wire(getObjectInfo, {objectApiName: TODO_OBJECT})
    recordTypes;

    get radioOptionsRecordTypes() {
        if (this.recordTypes.data) {
            const rt = this.recordTypes.data.recordTypeInfos;
            const keys = Object.keys(rt);
            const options = [];
            keys.forEach((key) => {
                if (!rt[key].master) {
                    options.push({label: rt[key].name, value: rt[key].recordTypeId});
                }
            })
            return options;
        }
        return false
    }

    handleCancel() {
        const event = new CustomEvent('cancel', {detail: ''});
        this.dispatchEvent(event);
    }

    handleSave() {
        const event = new CustomEvent('save', {detail: ''});
        this.dispatchEvent(event);
    }

    showModal() {
        this.openModal = true;
    }

    handleNext() {
        if (this.recordTypeId === 'Not selected') {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Please, select something',
                    // message: "",
                    variant: 'error'
                })
            );
        } else {
            this.headerText = 'New ' + this.recordTypeLabel + ' todo';
            this.recordTypeOK = true;
        }
    }

    handleChangeRecordType(e) {
        this.recordTypeId = e.detail.value;
        this.radioOptionsRecordTypes.forEach(item => {
                if (item.value === this.recordTypeId) {
                    this.recordTypeLabel = item.label;
                }
            }
        )
    }

}