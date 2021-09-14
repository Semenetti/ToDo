public with sharing class TodoTriggerHelper {

    public static void addTodoInQueue(List<Todo__c> newList){


        Map<Id, Id> recordTypeToQueueIdMap = RecordTypeToQueue.getRecordTypeToQueueIdMap();

        for(Todo__c todo : newList) {
            todo.OwnerId = recordTypeToQueueIdMap.get(todo.RecordTypeId);
        }
    }

}
