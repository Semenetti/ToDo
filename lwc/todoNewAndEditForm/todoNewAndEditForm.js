// todo New
import {LightningElement, wire, api} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord } from 'lightning/uiRecordApi';
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
    @api picklistValues;
    @api incomingTodo;

    value = [];
    showDaysOfTheWeek;

    todo = {
        // fields
        todoId: undefined,
        name: 'some name', //
        categoryC: 'Not selected', //
        completionDateC: '',//
        daysOfWeekC: '',//
        descriptionC: '', //
        isPeriodicTaskC: false,//
        isPriorityTaskC: false, //
        timeC: undefined, //
        recordTypeIdC: 'Not selected',
        isDoneC: false, //
        // variables
        recordTypeLabel: '',
    }

    week = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    connectedCallback() {
        // populating todo object
        const keys = Object.keys(this.incomingTodo);
        keys.forEach ((key) => {
            this.todo[key] = this.incomingTodo[key];
        });

        this.showDaysOfTheWeek=this.todo.isPeriodicTaskC;

        this.week.forEach(day => {
            if (this.todo.daysOfWeekC.includes(day))
                this.value.push(day);
        })
        console.log('connected callback value')
        console.log(this.value);

    }

// button actions

    saveRecordAddChecklist(){
    }

    cancel() {
        const event = new CustomEvent('cancel',{ detail: ''});
        this.dispatchEvent(event);
    }

    saveRecord () {
        const fields = {};
        fields[NAME_FIELD.fieldApiName] = this.todo.name; // ok
        fields[CATEGORY_FIELD.fieldApiName] = this.todo.categoryC; //ok
        fields[DESCRIPTION_FIELD.fieldApiName] = this.todo.descriptionC; //ok
        fields[IS_PERIODIC_FIELD.fieldApiName] = this.todo.isPeriodicTaskC; //ok
        fields[IS_PRIORITY_FIELD.fieldApiName] = this.todo.isPriorityTaskC; //ok
        fields[RECORD_TYPE_ID_FIELD.fieldApiName] = this.recordTypeIdValue; //ok  this.todo.recordTypeIdC;
        fields[COMPLETION_FIELD.fieldApiName] = this.todo.completionDateC; // ok
        fields[DAYS_OF_WEEK_FIELD.fieldApiName] = this.todo.daysOfWeekC; // not implemented
        fields[TIME_FIELD.fieldApiName] = this.todo.timeC; // ok
        fields[IS_DONE_FIELD.fieldApiName] = false; // hardcoded

        const recordInput = { apiName: TODO_OBJECT.objectApiName, fields};
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
                const event = new CustomEvent('save',{ detail: ''});
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
                const event = new CustomEvent('cancel',{ detail: ''});
                this.dispatchEvent(event);
            });

    }

// various lists properties
    get checkboxOptionsWeek() {
        const options = [];
        this.week.forEach(day => {
            options.push({label : day, value : day});
        })
        return options;
    }

    get radioOptionsCategories() {
        const rt = this.picklistValues.data.values;
        const keys = Object.keys(rt);
        const options = [];
        keys.forEach ((key) => {
            if (!rt[key].master){
                options.push({label: rt[key].label, value: rt[key].value});
            }
        })
        return options;
    }

// form rendering booleans
    get recordTypeOK () {
        if (this.recordTypeIdValue) return true;
        return false;
    }
    get showTime() {
        if (this.todo.recordTypeLabel === 'Meeting') return true;
        return false;
    }

// handlers
    handleChangeName(e) {
        this.todo.name = e.detail.value;
    }
    handleChangeCategory(e) {
        this.todo.categoryC = e.detail.value;
    }
    handleChangeCompletion(e) {
        this.todo.completionDateC = e.detail.value;
    }
    handleChangeDaysOfWeek(e) {
        this.value = e.detail.value;
        console.log('value');
        console.log(this.value);
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