import {LightningElement, wire, api} from 'lwc';
import {getObjectInfo} from 'lightning/uiObjectInfoApi';
import { getRecord } from 'lightning/uiRecordApi';
import TODO_OBJECT from '@salesforce/schema/Todo__c';
// ------------------------
import ID_FIELD from '@salesforce/schema/Todo__c.Id';
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


export default class TodoEdit extends LightningElement {
    @api recordId;
    recordTypeLabel;
    headerText = 'Edit todo';
    todo = {};

    @wire(getRecord, { recordId: '$recordId', fields: [
            ID_FIELD,
            NAME_FIELD,
            CATEGORY_FIELD,
            COMPLETION_FIELD,
            DAYS_OF_WEEK_FIELD,
            DESCRIPTION_FIELD,
            IS_PERIODIC_FIELD,
            IS_PRIORITY_FIELD,
            RECORD_TYPE_ID_FIELD,
            TIME_FIELD,
            IS_DONE_FIELD,
        ] })
    todoRecord;

    @wire(getObjectInfo, {objectApiName: TODO_OBJECT})
    recordTypes;

    get recordTypeLabelIsReady () {
        if (this.todoRecord.data && this.recordTypes.data) {
            const rt = this.recordTypes.data.recordTypeInfos;
            const keys = Object.keys(rt);
            keys.forEach((key) => {
                if (key === this.todoRecord.data.fields[RECORD_TYPE_ID_FIELD.fieldApiName].value) {
                    this.recordTypeLabel = rt[key].name;
                }
            })
        }
        if (this.recordTypeLabel) return true;
        return false;
    }

    get todoIsReady () {
        // console.log('%%% this.todoRecord.data.fields');
        // console.log(this.todoRecord.data.fields);

        if (this.todoRecord.data) {
            let i = 0;
            const fields = this.todoRecord.data.fields;
            console.log('fields');
            console.log(fields);
            const keys = Object.keys(fields);
            console.log('keys');
            console.log(keys);
            keys.forEach((key) => {
                i++;
                console.log(i);
                console.log(key);
                console.log(fields[key].value);
                if (fields[key].value) this.todo[key] = fields[key].value;
                });
        }
        if (this.todo[NAME_FIELD.fieldApiName]) return true;
        return false;
    }


    get recordTypeIdValue() {
        if (this.todoRecord.data) return this.todoRecord.data.fields[RECORD_TYPE_ID_FIELD.fieldApiName].value;
    }


    handleCancel() {
        const event = new CustomEvent('cancel', {detail: ''});
        this.dispatchEvent(event);
    }

    handleSave() {
        const event = new CustomEvent('save', {detail: ''});
        this.dispatchEvent(event);
    }

}