import { LightningElement, api } from 'lwc';

export default class TodoItem extends LightningElement {

    @api
    todo;
    //chevrondown
    //utility:chevronright
    @api
    allSubtodos;

    listIsHidden = true;
    listIcon = 'utility:chevronright';


    get listIsEmpty(){
        return this.allSubtodos.filter(x => x.Todo__c === this.todo.Id).length?false:true;
    }

    get subtodos(){
        let result = this.allSubtodos.filter(x => x.Todo__c === this.todo.Id);
        return result;
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

}