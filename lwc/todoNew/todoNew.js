import {LightningElement, wire, api} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { createRecord } from 'lightning/uiRecordApi';
import TODO_OBJECT from '@salesforce/schema/Todo__c';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import NAME_FIELD from '@salesforce/schema/Todo__c.Name';
import CATEGORY_FIELD from '@salesforce/schema/Todo__c.Category__c';
import COMPLETION_FIELD from '@salesforce/schema/Todo__c.Completion_Date__c';
import DAYS_OF_WEEK_FIELD from '@salesforce/schema/Todo__c.Days_of_Week__c';
import DESCRIPTION_FIELD from '@salesforce/schema/Todo__c.Description__c';
import IS_PERIODIC_FIELD from '@salesforce/schema/Todo__c.Is_Periodic_Task__c';
import IS_PRIORITY_FIELD from '@salesforce/schema/Todo__c.Is_Priority_Task__c';
import RECORD_TYPE_ID_FIELD from '@salesforce/schema/Todo__c.RecordTypeId';
import TIME_FIELD from '@salesforce/schema/Todo__c.Time__c';

import IS_DONE_FIELD from '@salesforce/schema/Todo__c.Is_Done__c';


export default class TodoNew extends LightningElement {

    value = ['Sunday']; // УДАЛИТЬ

    openModal = false;
    recordTypeOK = false;
    headerText = 'Select record type';
    recordTypes = [];
    picklistValues = [];
    // fields
    name = ''; // ok
    category = 'Not selected'; // ok
    completion = ''; // ok
    daysOfWeek = ''; // this.daysOfWeek.join(',')
    description = ''; // ok
    isPeriodic = false; // ok
    isPriority = false; // ok
    time = '' // ok
    recordTypeIdValue = 'Not selected'; // ok

    @wire(getObjectInfo, { objectApiName: TODO_OBJECT })
    recordTypes;

    @wire(getPicklistValues, {
        recordTypeId: '$recordTypeIdValue',
        fieldApiName: CATEGORY_FIELD
    })
    picklistValues;

    get optionsWeek() {
        return [
            { label: 'Sunday',    value: 'Sunday'    },
            { label: 'Monday',    value: 'Monday'    },
            { label: 'Tuesday',   value: 'Tuesday'   },
            { label: 'Wednesday', value: 'Wednesday' },
            { label: 'Thursday',  value: 'Thursday'  },
            { label: 'Friday',    value: 'Friday'    },
            { label: 'Saturday',  value: 'Saturday'  },
        ];
    }
    get optionsRadio() {
        const rt = this.recordTypes.data.recordTypeInfos;
        const keys = Object.keys(rt);
        const options = [];
        keys.forEach ((key) => {
            if (!rt[key].master){
                options.push({label: rt[key].name, value: rt[key].recordTypeId});
            }
        })
        return options;
    }
    get optionsPicklist() {
        const rt = this.picklistValues.data.values;
        const keys = Object.keys(rt);
        const options = [];
        keys.forEach ((key) => {
            if (!rt[key].master){
                options.push({label: rt[key].label, value: rt[key].value});
            }
        })
        console.log(options);
        return options;
    }
    get showTime() {
        return true;
    }
    showModal() {
        this.openModal = true;
    }
    closeModal() {
        this.openModal = false;
        this.recordTypeOK = false;
        this.headerText = 'Select record type';
        this.recordTypeIdValue = 'Not selected';
    }
    goToNext() {
        if (this.recordTypeIdValue === 'Not selected') {
            console.log('Record Type Not Selected');
        } else {
            this.headerText = 'Enter TODO';
            this.recordTypeOK = true;
            console.log(this.picklistValues.data.values);
        }
    }
    saveRecord() {
        this.openModal = false;
        this.recordTypeOK = false;
        this.headerText = 'Select record type';
        this.recordTypeIdValue = 'Not selected';

    }
    addChecklist(){

    }

    handleChangeName(e) {
        this.name = e.detail.value;
    }
    handleChangeCategory(e) {
        this.category = e.detail.value;
    }
    handleChangeCompletion(e) {
        this.completion = e.detail.value;
    }
    handleChangeDaysOfWeek(e) {
        this.daysOfWeek = e.detail.value;
    }
    handleChangeDescription(e) {
        this.description = e.detail.value;
    }
    handleChangeIsPeriodic(e) {
        this.isPeriodic = !this.isPeriodic;
    }
    handleChangeIsPriority(e) {
        this.isPriority = !this.isPriority;
    }
    handleChangeTime(e) {
        this.time = e.detail.value;
    }
    handleChangeRecordType(e) {
        this.recordTypeIdValue = e.detail.value;
    }

    // -------------------------------------

    value = ['option1'];

    get options() {
        return [
            { label: 'Ross', value: 'option1' },
            { label: 'Rachel', value: 'option2' },
        ];
    }

    get selectedValues() {
        return this.value.join(',');
    }

    handleChange(e) {
        this.value = e.detail.value;
    }


}