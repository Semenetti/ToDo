public with sharing class SubtodoTriggerHelper {

    public static void createSubtodoFutureCallout(List<Subtodo__c> subtodos){
        createSubtodoCallout(JSON.serialize(subtodos));    
    }

    @future(callout=true)
    private static void createSubtodoCallout(String jsonStr){
        List<Subtodo__c> subtodos = (List<Subtodo__c>) JSON.deserialize(jsonStr, List<Subtodo__c>.class);
        SubtodoCallout.createSubtodo(subtodos);     
    }

    public static void deleteSubtodoFutureCallout(List<Subtodo__c> subtodos){
        List<Id> idList = new List<Id>();
        for(Subtodo__c subtodo : subtodos) {
            idList.add(subtodo.Id);
        }
        deleteSubtodoCallout(idList);
    }

    @future(callout=true)
    private static void deleteSubtodoCallout(List<Id> idList){
        for(Id id : idList){
            SubtodoCallout.deleteSubtodoById(id);
        }
    }
// ------------

    // ----
    public static void updateSubtodoFutureCallout(List<Subtodo__c> subtodos) {
        if(canCallFuture()) {
            System.debug('%%%');
            updateSubtodoCallout(JSON.serialize(subtodos));
        }
    }

    @future(callout=true)
    private static void updateSubtodoCallout(String jsn){
        List<Subtodo__c> subtodos = (List<Subtodo__c>) JSON.deserialize(jsn, List<Subtodo__c>.class);
        MagicUpdateCallouts.updateSubtodos(subtodos);
    }


// helper method
    public static boolean canCallFuture(){
        return (!System.isBatch() && !System.isFuture() && !System.isQueueable() && !System.isScheduled() &&
                !Test.isRunningTest() && Limits.getLimitFutureCalls()>Limits.getFutureCalls());
    }



}