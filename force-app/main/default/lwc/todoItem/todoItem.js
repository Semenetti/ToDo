import { LightningElement, api, track } from 'lwc';

import SUBTODO_ID_FIELD from '@salesforce/schema/Subtodo__c.Id'
import SUBTODO_IS_DONE_FIELD from '@salesforce/schema/Subtodo__c.Is_Done__c' 

import TODO_ID_FIELD from '@salesforce/schema/Todo__c.Id'
import TODO_IS_DONE_FIELD from '@salesforce/schema/Todo__c.Is_Done__c'

import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class TodoItem extends LightningElement {

    connectedCallback(){
        this.setCheckTodoStatus(this.todo.Is_Done__c);
    }

    @api
    todo;

    @api
    allSubtodos;
    
    listIsHidden = true;
    listIcon = 'utility:chevronright';

    checkTodoBtnIsDisabled = false;
    subtodosIsDisabled = false;
    checkTodoIcon = 'utility:check';

    get listIsEmpty(){
        return this.subtodos.length?false:true;
    }

    get subtodos(){
        return this.allSubtodos.filter(x => x.Todo__c === this.todo.Id);
    }

    refreshTodos(){
        const selectEvent = new CustomEvent('refreshtodos', {
            bubbles: true
        }); 
        this.dispatchEvent(selectEvent);
    }

    refreshSubtodos(){
        const selectEvent = new CustomEvent('refreshsubtodos', {
            bubbles: true
        }); 
        this.dispatchEvent(selectEvent);
    }

    //send event on parent, also make this for subtodo
    changeTodoStatus(){
        const selectEvent = new CustomEvent('changetodostatus', {
            bubbles: true,
            detail: {
                todoId : this.todo.Id 
            }
        }); 
        this.dispatchEvent(selectEvent);
    }



    viewHideSubtodos(){
        if(!this.listIsHidden) {
            this.listIsHidden = true;
            this.listIcon = 'utility:chevronright';
        } else {
            this.listIsHidden = false;
            this.listIcon = 'utility:chevrondown';
        }
    }

    handleSubtodoCheckbox(event){
        const fields = {};
        fields[SUBTODO_ID_FIELD.fieldApiName] = event.target.dataset.subtodoid;
        fields[SUBTODO_IS_DONE_FIELD.fieldApiName] = event.target.checked;

        const recordInput = {fields};

        updateRecord(recordInput)
        .then(() => {
            this.refreshSubtodos();
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error update subtodo status',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });
    }

    setCheckTodoStatus(isDone){
        if(isDone) {
            this.checkTodoIcon = 'utility:close';
            this.subtodosIsDisabled = true;
        } 
        else {
            this.checkTodoIcon = 'utility:check';
            this.subtodosIsDisabled = false;
        }
    }

    checkTodo(){
        this.checkTodoBtnIsDisabled = true;
        if(this.subtodos.filter(x => x.Is_Done__c === false).length != 0 && this.todo.Is_Done__c === false) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'You cannot complete a todo',
                    message: 'You cannot complete a todo until you have completed all the subtodo',
                    variant: 'error'
                })
            );
            this.checkTodoBtnIsDisabled = false;
        } 
        else {

            const fields = {};
            fields[TODO_ID_FIELD.fieldApiName] = this.todo.Id;
            fields[TODO_IS_DONE_FIELD.fieldApiName] = !this.todo.Is_Done__c;

            const recordInput = {fields};

            updateRecord(recordInput)
            .then(() => {
                this.setCheckTodoStatus(!this.todo.Is_Done__c);
                this.refreshTodos();
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error update todo status',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });

            this.checkTodoBtnIsDisabled = false;
        }
    }
    
}