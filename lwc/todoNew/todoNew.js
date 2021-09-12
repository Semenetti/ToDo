// todo New
import {LightningElement, wire, api} from 'lwc';
import {getObjectInfo} from 'lightning/uiObjectInfoApi';
import TODO_OBJECT from '@salesforce/schema/Todo__c';
import {getPicklistValues} from 'lightning/uiObjectInfoApi';
import CATEGORY_FIELD from '@salesforce/schema/Todo__c.Category__c';

export default class TodoNew extends LightningElement {

    recordTypeOK = false;
    recordTypeIdValue = 'Not selected';

    value = []; //
    openModal = false;
    headerText = 'Select record type';

    todo = {
        // fields
        todoId: undefined,
        name: 'predefined name', //
        categoryC: 'Not selected', //
        completionDateC: '',//
        daysOfWeekC: 'Monday, Thursday',//
        descriptionC: '', //
        isPeriodicTaskC: false,//
        isPriorityTaskC: false, //
        timeC: undefined, //
        recordTypeIdC: 'Not selected',
        isDoneC: false, //

        // variables
        recordTypeLabel: '',
    }


    @wire(getObjectInfo, {objectApiName: TODO_OBJECT})
    recordTypes;

    @wire(getPicklistValues, {
        recordTypeId: '$recordTypeIdValue',
        fieldApiName: CATEGORY_FIELD
    })
    picklistValues;

    get radioOptionsRecordTypes() {
        if (this.recordTypes.data) {
            console.log(this.recordTypes);
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
        // this.openModal = false;
        this.recordTypeOK = false;
        this.headerText = 'Select record type';
        this.todo.recordTypeIdC = 'Not selected';
        const event = new CustomEvent('cancel', {detail: ''});
        this.dispatchEvent(event);
    }

    handleSave() {
        // this.openModal = false;
        this.recordTypeOK = false;
        this.headerText = 'Select record type';
        this.todo.recordTypeIdC = 'Not selected';
        const event = new CustomEvent('save', {detail: ''});
        this.dispatchEvent(event);
    }

    showModal() {
        this.openModal = true;
    }

    /*
    closeModal() {
        this.openModal = false;
        this.recordTypeOK = false;
        this.headerText = 'Select record type';
        this.todo.recordTypeIdC = 'Not selected';
    } */
    handleNext() {
        if (this.todo.recordTypeIdC === 'Not selected') {
            console.log('Record Type Not Selected');
        } else {
            this.headerText = 'Enter ' + this.todo.recordTypeLabel + ' TODO';
            this.recordTypeOK = true;
        }
    }

    handleChangeRecordType(e) {
        this.recordTypeIdValue = e.detail.value;
        this.todo.recordTypeIdC = e.detail.value;
        this.radioOptionsRecordTypes.forEach(item => {
                if (item.value === this.todo.recordTypeIdC) {
                    this.todo.recordTypeLabel = item.label;
                }
            }
        )
    }

}