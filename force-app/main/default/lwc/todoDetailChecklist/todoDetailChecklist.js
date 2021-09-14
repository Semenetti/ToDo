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

export default class TodoDetailChecklist extends LightningElement {

    @api incomingTodo;
    todo = {};

    connectedCallback() {
        // populating todo object
        const keys = Object.keys(this.incomingTodo);
        keys.forEach((key) => {
            this.todo[key] = this.incomingTodo[key];
        });
    }


// values for display
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


}