public with sharing class SubtodoTriggerHandler {
    
    public static void handleAfterInsert(List<Subtodo__c> newList, Map<Id,Subtodo__c> newMap){
        SubtodoTriggerHelper.createSubtodoFutureCallout(newList);
    }

    public static void handleAfterUpdate(List<Subtodo__c> newList, Map<Id,Subtodo__c> newMap, List<Subtodo__c> oldList, Map<Id,Subtodo__c> oldMap){
        SubtodoTriggerHelper.updateSubtodoFutureCallout(newList);
    }

    public static void handleAfterDelete(List<Subtodo__c> oldList, Map<Id,Subtodo__c> oldMap){     
    }

    public static void handleAfterUndelete(List<Subtodo__c> oldList, Map<Id,Subtodo__c> oldMap){       
    }

    public static void handleBeforeInsert(List<Subtodo__c> newList){    
    }

    public static void handleBeforeUpdate(List<Subtodo__c> newList, Map<Id,Subtodo__c> newMap, List<Subtodo__c> oldList, Map<Id,Subtodo__c> oldMap){   
    }

    public static void handleBeforeDelete(List<Subtodo__c> oldList, Map<Id,Subtodo__c> oldMap){
        SubtodoTriggerHelper.deleteSubtodoFutureCallout(oldList);
    }


}