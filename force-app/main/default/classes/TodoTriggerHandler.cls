public with sharing class TodoTriggerHandler {
    
    public static void handleAfterInsert(List<Todo__c> newList, Map<Id,Todo__c> newMap){
        TodoTriggerHelper.createTodoFutureCallout(newList);  
    }

    public static void handleAfterUpdate(List<Todo__c> newList, Map<Id,Todo__c> newMap, List<Todo__c> oldList, Map<Id,Todo__c> oldMap){
        TodoTriggerHelper.updateTodoFutureCallout(newList);
    }

    public static void handleAfterDelete(List<Todo__c> oldList, Map<Id,Todo__c> oldMap){     
    }

    public static void handleAfterUndelete(List<Todo__c> oldList, Map<Id,Todo__c> oldMap){       
    }

    public static void handleBeforeInsert(List<Todo__c> newList){
        TodoTriggerHelper.addTodoInQueue(newList);      
        TodoTriggerHelper.setTodayTomorrowCheckboxs(newList);
    }

    public static void handleBeforeUpdate(List<Todo__c> newList, Map<Id,Todo__c> newMap, List<Todo__c> oldList, Map<Id,Todo__c> oldMap){   
        TodoTriggerHelper.setTodayTomorrowCheckboxs(newList);
    }

    public static void handleBeforeDelete(List<Todo__c> oldList, Map<Id,Todo__c> oldMap){
        TodoTriggerHelper.deleteTodoFutureCallout(oldList);
    }


}