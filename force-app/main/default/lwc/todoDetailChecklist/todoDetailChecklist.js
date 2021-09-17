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
import NAME_SUBTODO from '@salesforce/schema/Subtodo__c.Name';
import ID_SUBTODO from '@salesforce/schema/Subtodo__c.Id';


export default class TodoDetailChecklist extends LightningElement {
    @api incomingSubtodos
    @api incomingTodo;
    @api isEditableChecklist;

    todo = {};
    subtodos;
    subtodosToDelete = [];
    newSubtodoName = '';

    index = 0;

    RANDOM_KEY_CEILING = 2000000000;
    NEW_ITEM_PREFIX = 'NEW__';

    booleanToRefresh = true;
    somethingChanged = false;
    disableNewItem = false;


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
            let subtodo = [];
            itemKeys.forEach((key) => {
                subtodo[key] = item[key];
            })
            subtodo['edit'] = false;
            subtodo['allowSelection'] = true;
            subtodo['randomKey'] = this.getRandomKey();
            if (subtodo[TODO_ID_SUBTODO.fieldApiName] === this.todo[ID_FIELD.fieldApiName])
                this.subtodos.push(subtodo);
        })
    }

    getRandomKey() {
        const min = Math.ceil(0);
        const max = Math.floor(this.RANDOM_KEY_CEILING);
        return Math.floor(Math.random() * (max - min)) + min;
    }


// button actions
    cancel() {
        this.dispatchEvent(new CustomEvent('cancel', {detail: ''}));
    }

    saveChecklist() {
        this.dispatchEvent(new CustomEvent('savechecklist', {detail: ''}));
    }

// handlers

    handleChangeName(e) {
        this.newSubtodoName = e.detail.value;
    }

    handleDismiss() {
        this.newSubtodoName = '';
        this.template.querySelector('lightning-input[data-name="subtodoNameInput"]').value = '';
    }

    handleAddItem() {
        let subtodo = {};
        subtodo[TODO_ID_SUBTODO.fieldApiName] = this.todo[ID_FIELD.fieldApiName];
        subtodo[NAME_SUBTODO.fieldApiName] = this.newSubtodoName;
        subtodo[ID_SUBTODO.fieldApiName] = this.NEW_ITEM_PREFIX + this.index;
        this.index++;
        subtodo['edit'] = false;
        subtodo['allowSelection'] = true;
        subtodo['randomKey'] = this.getRandomKey();
        this.subtodos.push(subtodo);
        this.newSubtodoName = '';
        this.template.querySelector('lightning-input[data-name="subtodoNameInput"]').value = '';
        this.somethingChanged = true;
    }

    handleSaveItem(e) {
        this.subtodos.forEach((s) => {
            if (s[ID_SUBTODO.fieldApiName] === e.detail.id) {
                s[NAME_SUBTODO.fieldApiName] = e.detail.text;
            }
            s['randomKey'] = this.getRandomKey();
            s['edit'] = false;
            s['allowSelection'] = true;
        })
        this.booleanToRefresh = false;
        this.booleanToRefresh = true;
        this.somethingChanged = true;
        this.disableNewItem = false;
    }

    handleDeleteItem(e) {
        let index = this.subtodos.findIndex((s) => {
            return s[ID_SUBTODO.fieldApiName] === e.detail.id
        });
        if (!this.subtodos[index][ID_SUBTODO.fieldApiName].includes(this.NEW_ITEM_PREFIX)) {
            this.subtodosToDelete.push(this.subtodos[index]);
        }
        this.subtodos.splice(index, 1);
        console.log(this.subtodos);
        console.log(this.subtodosToDelete);
        this.subtodos.forEach((s) => {
            s['edit'] = false;
            s['allowSelection'] = true;
            s['randomKey'] = this.getRandomKey();
        })
        this.booleanToRefresh = false;
        this.booleanToRefresh = true;
        this.somethingChanged = true;
        this.disableNewItem = false;
    }

    handleSelectItem(e) {
        this.subtodos.forEach((s) => {
            if (s[ID_SUBTODO.fieldApiName] === e.detail.id) {
                s['edit'] = true;
            } else {
                s['edit'] = false;
                s['allowSelection'] = false;
            }
            s['randomKey'] = this.getRandomKey();
        })
        this.disableNewItem = true;
        this.booleanToRefresh = false;
        this.booleanToRefresh = true;
    }

// form rendering booleans
    get disableSave() {
        return !this.somethingChanged;
    }

    get disableSaveItem() {
        return (this.newSubtodoName.length < 4) || this.disableNewItem;
    }

// text to display
    get dateText() {
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
        return this.todo[IS_PRIORITY_FIELD.fieldApiName] ? ('Priority task!') : '';
    }

// field values

    get nameValue() {
        return this.todo[NAME_FIELD.fieldApiName];
    }

    get categoryValue() {
        return this.todo[CATEGORY_FIELD.fieldApiName];
    }

    get descriptionValue() {
        return this.todo[DESCRIPTION_FIELD.fieldApiName];
    }

}
