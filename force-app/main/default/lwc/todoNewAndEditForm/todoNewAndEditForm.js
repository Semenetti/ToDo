// todo New
import {LightningElement, wire, api} from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import {createRecord} from 'lightning/uiRecordApi';
import {updateRecord} from 'lightning/uiRecordApi';
import {getPicklistValues} from "lightning/uiObjectInfoApi";
import getSubtodos from '@salesforce/apex/TodoHandler.getSubtodos';
import TODO_OBJECT from '@salesforce/schema/Todo__c';
// fields import
import ID_FIELD from '@salesforce/schema/Todo__c.Id';
import NAME_FIELD from '@salesforce/schema/Todo__c.Name';
import CATEGORY_FIELD from '@salesforce/schema/Todo__c.Category__c';
import COMPLETION_FIELD from '@salesforce/schema/Todo__c.Completion_Date__c';
import DAYS_OF_WEEK_FIELD from '@salesforce/schema/Todo__c.Days_of_Week__c';
import DESCRIPTION_FIELD from '@salesforce/schema/Todo__c.Description__c';
import IS_PERIODIC_FIELD from '@salesforce/schema/Todo__c.Is_Periodic_Task__c';
import IS_PRIORITY_FIELD from '@salesforce/schema/Todo__c.Is_Priority_Task__c';
import TIME_FIELD from '@salesforce/schema/Todo__c.Time__c';
import RECORD_TYPE_ID_FIELD from '@salesforce/schema/Todo__c.RecordTypeId';
import IS_DONE_FIELD from '@salesforce/schema/Todo__c.Is_Done__c';


export default class TodoNewAndEditForm extends LightningElement {

    @api recordTypeId;
    @api recordTypeLabel;
    @api incomingTodo;

    @wire(getPicklistValues, {
        recordTypeId: '$recordTypeId',
        fieldApiName: CATEGORY_FIELD
    })
    picklistValues;

    @wire(getSubtodos)
    wiredSubtodos;


    value = [];
    week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    showDaysOfTheWeek;
    showCheckList;
    todo = {}


    connectedCallback() {

        // populating todo object
        const keys = Object.keys(this.incomingTodo);
        keys.forEach((key) => {
            this.todo[key] = this.incomingTodo[key];
        });

        this.showDaysOfTheWeek = this.todo[IS_PERIODIC_FIELD.fieldApiName];

        if (this.todo[DAYS_OF_WEEK_FIELD.fieldApiName])
            this.week.forEach(day => {
                if (this.todo[DAYS_OF_WEEK_FIELD.fieldApiName].includes(day))
                    this.value.push(day);
            })

    }

// button actions

    saveRecordAddChecklist() {
        this.processRecord(true);
    }

    duplicateRecordAddChecklist() {
        this.todo[ID_FIELD.fieldApiName] = undefined;
        this.processRecord(true);
    }

    cancel() {
        this.dispatchEvent(new CustomEvent('cancel', {detail: ''}));
    }

    duplicateRecord() {
        this.todo[ID_FIELD.fieldApiName] = undefined;
        this.processRecord(false);
    }

    saveRecord() {
        this.processRecord(false);
    }

// helper methods
    processRecord(needChecklist) {
        if (this.todoIsValid) {
            const fields = this.todo;

            if (!this.todo[ID_FIELD.fieldApiName]) {
                const recordInput = {apiName: TODO_OBJECT.objectApiName, fields};
                createRecord(recordInput)
                    .then((todo) => {
                        this.todo[ID_FIELD.fieldApiName] = todo.id;
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'Success',
                                message: 'Todo "' + this.todo[NAME_FIELD.fieldApiName] + '", Id=' + this.todo[ID_FIELD.fieldApiName] + ' created',
                                variant: 'success'
                            })
                        );
                        if (needChecklist) {
                            this.showCheckList = true;
                        } else this.dispatchEvent(new CustomEvent('save', {detail: ''}));
                    })
                    .catch((error) => {
                        console.log(error);
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'Error creating record',
                                message: 'the error is buried in the console',
                                variant: 'error'
                            })
                        );
                        this.dispatchEvent(new CustomEvent('cancel', {detail: ''}));
                    });

            } else {
                const recordInput = {fields};
                updateRecord(recordInput)
                    .then((todo) => {
                        this.todo[ID_FIELD.fieldApiName] = todo.id;
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'Success',
                                message: 'Todo "' + this.todo[NAME_FIELD.fieldApiName] + '", Id=' + this.todo[ID_FIELD.fieldApiName] + ' edited',
                                variant: 'success'
                            })
                        );
                        if (needChecklist) {
                            this.showCheckList = true;
                        } else this.dispatchEvent(new CustomEvent('save', {detail: ''}));
                    })
                    .catch((error) => {
                        console.log(error);
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'Error creating record',
                                message: 'the error is buried in the console',
                                variant: 'error'
                            })
                        );
                        this.dispatchEvent(new CustomEvent('cancel', {detail: ''}));
                    });

            }
        }
    }

    get todoIsValid() {
        if ((!this.todo[NAME_FIELD.fieldApiName]) || (!this.todo[IS_PERIODIC_FIELD.fieldApiName] && !this.todo[COMPLETION_FIELD.fieldApiName]) || (this.todo[IS_PERIODIC_FIELD.fieldApiName] && !this.todo[DAYS_OF_WEEK_FIELD.fieldApiName])) {
            let message = '';
            if (!this.todo[NAME_FIELD.fieldApiName])
                message = 'Todos name can not be empty. ';
            if (!this.todo[IS_PERIODIC_FIELD.fieldApiName] && !this.todo[COMPLETION_FIELD.fieldApiName])
                message = message + 'Please, fill completion date. ';
            if (this.todo[IS_PERIODIC_FIELD.fieldApiName] && !this.todo[DAYS_OF_WEEK_FIELD.fieldApiName])
                message = message + 'Please, select at least one day of the week.';
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error creating todo',
                    message: message,
                    variant: 'error'
                })
            );
            return false;
        } else {
            return true;
        }
    }

// various lists properties
    get checkboxOptionsWeek() {
        const options = [];
        this.week.forEach(day => {
            options.push({label: day, value: day});
        })
        return options;
    }

    get radioOptionsCategories() {
        const rt = this.picklistValues.data.values;
        const keys = Object.keys(rt);
        const options = [];
        keys.forEach((key) => {
            if (!rt[key].master) {
                options.push({label: rt[key].label, value: rt[key].value});
            }
        })
        return options;
    }

// form filling values
    get isPriorityValue() {
        return this.todo[IS_PRIORITY_FIELD.fieldApiName];
    }

    get nameValue() {
        return this.todo[NAME_FIELD.fieldApiName];
    }

    get categoryValue() {
        return this.todo[CATEGORY_FIELD.fieldApiName];
    }

    get timeValue() {
        return this.todo[TIME_FIELD.fieldApiName];
    }

    get completionValue() {
        return this.todo[COMPLETION_FIELD.fieldApiName];
    }

    get descriptionValue() {
        return this.todo[DESCRIPTION_FIELD.fieldApiName];
    }

    get isPeriodicValue() {
        return this.todo[IS_PERIODIC_FIELD.fieldApiName];
    }

// form rendering booleans
    get recordTypeOK() {
        if (this.recordTypeId) return true;
        return false;
    }

    get showTime() {
        if (this.recordTypeLabel === 'Meeting') return true;
        return false;
    }

    get disableChecklist(){
        if (this.wiredSubtodos) return false;
        return true;
    }

    get disableSave(){
        if (this.recordTypeOK) return false;
        return true;
    }

// handlers
    handleChangeName(e) {
        this.todo[NAME_FIELD.fieldApiName] = e.detail.value;
    }

    handleChangeCategory(e) {
        this.todo[CATEGORY_FIELD.fieldApiName] = e.detail.value;
    }

    handleChangeCompletion(e) {
        this.todo[COMPLETION_FIELD.fieldApiName] = e.detail.value;
    }

    handleChangeDaysOfWeek(e) {
        this.value = e.detail.value;
        this.todo[DAYS_OF_WEEK_FIELD.fieldApiName] = this.value.join(', ');
    }

    handleChangeDescription(e) {
        this.todo[DESCRIPTION_FIELD.fieldApiName] = e.detail.value;
    }

    handleChangeIsPeriodic(e) {
        this.todo[IS_PERIODIC_FIELD.fieldApiName] = !this.todo[IS_PERIODIC_FIELD.fieldApiName];
        this.showDaysOfTheWeek = this.todo[IS_PERIODIC_FIELD.fieldApiName];
    }

    handleChangeIsPriority(e) {
        this.todo[IS_PRIORITY_FIELD.fieldApiName] = !this.todo[IS_PRIORITY_FIELD.fieldApiName];
    }

    handleChangeTime(e) {
        this.todo[TIME_FIELD.fieldApiName] = e.detail.value;
    }
}