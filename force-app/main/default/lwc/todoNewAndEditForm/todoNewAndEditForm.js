// todo New
import {LightningElement, wire, api} from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import {createRecord} from 'lightning/uiRecordApi';
import {getPicklistValues} from "lightning/uiObjectInfoApi";
import TODO_OBJECT from '@salesforce/schema/Todo__c';
// ------------------------
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


export default class TodoNewAndEditForm extends LightningElement {

    @api recordTypeIdValue;
    @api incomingTodo;
    @api recordTypeLabel;

    @wire(getPicklistValues, {
        recordTypeId: '$recordTypeIdValue',
        fieldApiName: CATEGORY_FIELD
    })
    picklistValues;


    value = [];
    week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    showDaysOfTheWeek;

    todo = {
    }


    connectedCallback() {

        // populating todo object
        const keys = Object.keys(this.incomingTodo);
        keys.forEach((key) => {
            this.todo[key] = this.incomingTodo[key];
        });

        this.showDaysOfTheWeek = this.todo.isPeriodicTaskC;

        this.week.forEach(day => {
            if (this.todo.daysOfWeekC.includes(day))
                this.value.push(day);
        })
    }

// button actions

    saveRecordAddChecklist() {
        this.saveRecord();
    }

    cancel() {
        const event = new CustomEvent('cancel', {detail: ''});
        this.dispatchEvent(event);
    }

    saveRecord() {
        if ((!this.todo.name) || (!this.todo.isPeriodicTaskC && !this.todo.completionDateC) || (this.todo.isPeriodicTaskC && !this.todo.daysOfWeekC)) {
            let message = '';
            if (!this.todo.name) message = 'Todos name can not be empty. ';
            if (!this.todo.isPeriodicTaskC && !this.todo.completionDateC) message = message + 'Please, fill completion date. ';
            if (this.todo.isPeriodicTaskC && !this.todo.daysOfWeekC) message = message + 'Please, select at least one day of the week.';
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error creating record',
                    message: message,
                    variant: 'error'
                })
            );
        } else {
            const fields = {};
            fields[NAME_FIELD.fieldApiName] = this.todo.name;
            fields[CATEGORY_FIELD.fieldApiName] = this.todo.categoryC;
            fields[DESCRIPTION_FIELD.fieldApiName] = this.todo.descriptionC;
            fields[IS_PERIODIC_FIELD.fieldApiName] = this.todo.isPeriodicTaskC;
            fields[IS_PRIORITY_FIELD.fieldApiName] = this.todo.isPriorityTaskC;
            fields[RECORD_TYPE_ID_FIELD.fieldApiName] = this.todo.recordTypeIdC;
            if (!this.todo.isPeriodicTaskC) fields[COMPLETION_FIELD.fieldApiName] = this.todo.completionDateC;
            if (this.todo.isPeriodicTaskC) fields[DAYS_OF_WEEK_FIELD.fieldApiName] = this.todo.daysOfWeekC;
            fields[TIME_FIELD.fieldApiName] = this.todo.timeC;
            fields[IS_DONE_FIELD.fieldApiName] = false; //

            console.log('*** fields ***');
            console.log(fields);
            console.log('*** this.todo ***');
            console.log(this.todo);
            console.log('*** this.incomingTodo ***');
            console.log(this.incomingTodo);

            const recordInput = {apiName: TODO_OBJECT.objectApiName, fields};
            createRecord(recordInput)
                .then((todo) => {
                    this.todoId = todo.id;
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Todo "' + this.todo.name + '" created',
                            variant: 'success'
                        })
                    );
                    const event = new CustomEvent('save', {detail: ''});
                    this.dispatchEvent(event);
                })
                .catch((error) => {
                    console.log(error);
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error creating record',
                            message: '', // reduceErrors(error).join(', ')
                            variant: 'error'
                        })
                    );
                    const event = new CustomEvent('cancel', {detail: ''});
                    this.dispatchEvent(event);
                });
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

// form rendering booleans
    get recordTypeOK() {
        if (this.recordTypeIdValue) return true;
        return false;
    }

    get showTime() {
        if (this.recordTypeLabel === 'Meeting') return true;
        return false;
    }

// handlers
    handleChangeName(e) {
        this.todo.name = e.detail.value;
    }

    handleChangeCategory(e) {
        this.todo.categoryC = e.detail.value;
        console.log('@@@@');
        console.log(e.detail.value);
        console.log(this.radioOptionsCategories);
    }

    handleChangeCompletion(e) {
        this.todo.completionDateC = e.detail.value;
    }

    handleChangeDaysOfWeek(e) {
        this.value = e.detail.value;
        this.todo.daysOfWeekC = this.value.join(', ');
    }

    handleChangeDescription(e) {
        this.todo.descriptionC = e.detail.value;
    }

    handleChangeIsPeriodic(e) {
        this.todo.isPeriodicTaskC = !this.todo.isPeriodicTaskC;
        this.showDaysOfTheWeek = this.todo.isPeriodicTaskC;
    }

    handleChangeIsPriority(e) {
        this.todo.isPriorityTaskC = !this.todo.isPriorityTaskC;
    }

    handleChangeTime(e) {
        this.todo.timeC = e.detail.value;
    }
}