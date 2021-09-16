import {LightningElement, wire, api} from 'lwc';
import ID_FIELD from '@salesforce/schema/Todo__c.Id';
import NAME_FIELD from '@salesforce/schema/Todo__c.Name';
import CATEGORY_FIELD from '@salesforce/schema/Todo__c.Category__c';
import COMPLETION_FIELD from '@salesforce/schema/Todo__c.Completion_Date__c';
import DAYS_OF_WEEK_FIELD from '@salesforce/schema/Todo__c.Days_of_Week__c';
import DESCRIPTION_FIELD from '@salesforce/schema/Todo__c.Description__c';
import IS_PERIODIC_FIELD from '@salesforce/schema/Todo__c.Is_Periodic_Task__c';
import IS_PRIORITY_FIELD from '@salesforce/schema/Todo__c.Is_Priority_Task__c';
import TIME_FIELD from '@salesforce/schema/Todo__c.Time__c';
import TODO_ID_SUBTODO from '@salesforce/schema/Subtodo__c.Todo__c';

export default class TodoDetailChecklist extends LightningElement {
    @api incomingSubtodos
    @api incomingTodo;

    todo = {};
    subtodos;

    connectedCallback() {
        // populating todo object
        const keys = Object.keys(this.incomingTodo);
        keys.forEach((key) => {
            this.todo[key] = this.incomingTodo[key];
        });

        this.subtodos = [];

        // populating subtodos array with filted by todo id subtodos
        this.incomingSubtodos.data.forEach((item) => {
            let itemKeys = Object.keys(item);
            let subtodo =[];
            itemKeys.forEach((key) => {
                subtodo[key] = item[key];
            })
                if (subtodo[TODO_ID_SUBTODO.fieldApiName] === this.todo[ID_FIELD.fieldApiName])
                    this.subtodos.push(subtodo);
        })
        console.log(this.subtodos);
    }

// button actions

    cancel() {
        this.dispatchEvent(new CustomEvent('cancel', {detail: ''}));
    }

// form rendering booleans
    get disableSave() {
        return true;
    }
// text to display
    get dateText () {
        let str;
        if (this.todo[IS_PERIODIC_FIELD.fieldApiName]) {
            str = 'Scheduled for ' + this.todo[DAYS_OF_WEEK_FIELD.fieldApiName];
        } else {
            str = 'Target date: ' + this.todo[COMPLETION_FIELD.fieldApiName];
        }
        return str;
    }
    get timeText() {
        return this.todo[TIME_FIELD.fieldApiName];
    }
    get priorityText() {
        return this.todo[IS_PRIORITY_FIELD.fieldApiName]?('Priority task!'):'';
    }

// field values
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
    get daysOfWeek() {
        return this.todo[DAYS_OF_WEEK_FIELD.fieldApiName];
    }

}
