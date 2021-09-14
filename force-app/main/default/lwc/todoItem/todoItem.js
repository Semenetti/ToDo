import { LightningElement, api } from 'lwc';

export default class TodoItem extends LightningElement {

    @api
    todo;

    @api
    allSubtodos;

    get subtodos(){
        return this.allSubtodos.filter(x => x.Todo__c === this.todo.Id);
    }

}