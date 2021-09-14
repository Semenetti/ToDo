trigger TodoTrigger on Todo__c (before insert, before update, before delete, after insert, after update, after delete, after undelete) {

    if(Trigger.isBefore && Trigger.isInsert){
        TodoTriggerHandler.handleBeforeInsert(Trigger.new);
    }

    if(Trigger.isBefore && Trigger.isUpdate){
        TodoTriggerHandler.handleBeforeUpdate(Trigger.new, Trigger.newMap, Trigger.old, Trigger.oldMap);
    }

    if(Trigger.isBefore && Trigger.isDelete){
        TodoTriggerHandler.handleBeforeDelete(Trigger.old, Trigger.oldMap);
    }

    if(Trigger.isAfter && Trigger.isInsert){
        TodoTriggerHandler.handleAfterInsert(Trigger.new, Trigger.newMap);
    }

    if(Trigger.isAfter && Trigger.isUpdate){
        TodoTriggerHandler.handleAfterUpdate(Trigger.new, Trigger.newMap, Trigger.old, Trigger.oldMap);
    }

    if(Trigger.isAfter && Trigger.isDelete){
        TodoTriggerHandler.handleAfterDelete(Trigger.old, Trigger.oldMap);
    }

    if(Trigger.isAfter && Trigger.isUndelete){
        TodoTriggerHandler.handleAfterUndelete(Trigger.old, Trigger.oldMap);
    }
}