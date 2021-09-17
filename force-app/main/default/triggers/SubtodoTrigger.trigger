trigger SubtodoTrigger on Subtodo__c (before insert, before update, before delete, after insert, after update, after delete, after undelete) {

    if(Trigger.isBefore && Trigger.isInsert){
        SubtodoTriggerHandler.handleBeforeInsert(Trigger.new);
    }

    if(Trigger.isBefore && Trigger.isUpdate){
        SubtodoTriggerHandler.handleBeforeUpdate(Trigger.new, Trigger.newMap, Trigger.old, Trigger.oldMap);
    }

    if(Trigger.isBefore && Trigger.isDelete){
        SubtodoTriggerHandler.handleBeforeDelete(Trigger.old, Trigger.oldMap);
    }

    if(Trigger.isAfter && Trigger.isInsert){
        SubtodoTriggerHandler.handleAfterInsert(Trigger.new, Trigger.newMap);
    }

    if(Trigger.isAfter && Trigger.isUpdate){
        SubtodoTriggerHandler.handleAfterUpdate(Trigger.new, Trigger.newMap, Trigger.old, Trigger.oldMap);
    }

    if(Trigger.isAfter && Trigger.isDelete){
        SubtodoTriggerHandler.handleAfterDelete(Trigger.old, Trigger.oldMap);
    }

    if(Trigger.isAfter && Trigger.isUndelete){
        SubtodoTriggerHandler.handleAfterUndelete(Trigger.old, Trigger.oldMap);
    }
}