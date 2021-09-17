public with sharing class TodoTriggerHelper {

    public static void addTodoInQueue(List<Todo__c> newList){

        Map<Id, Id> recordTypeToQueueIdMap = RecordTypeToQueue.getRecordTypeToQueueIdMap();

        for(Todo__c todo : newList) {
            todo.OwnerId = recordTypeToQueueIdMap.get(todo.RecordTypeId);
        }
    }

    public static void createTodoFutureCallout(List<Todo__c> todos){
        createTodoCallout(JSON.serialize(todos));    
    }

    @future(callout=true)
    private static void createTodoCallout(String jsonStr){
        List<Todo__c> todos = (List<Todo__c>) JSON.deserialize(jsonStr, List<Todo__c>.class);
        TodoCallout.createTodo(todos);     
    }

    public static void deleteTodoFutureCallout(List<Todo__c> todos){
        List<Id> idList = new List<Id>();
        for(Todo__c todo : todos) {
            idList.add(todo.Id);
        }
        deleteTodoCallout(idList);
    }

    @future(callout=true)
    private static void deleteTodoCallout(List<Id> idList){
        for(Id id : idList){
            TodoCallout.deleteTodoById(id);
        }
    }

}
