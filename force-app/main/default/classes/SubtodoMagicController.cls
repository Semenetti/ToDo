public with sharing class SubtodoMagicController {
    @AuraEnabled
    public static void upsertAndDelete(List<Subtodo__c> toUpsert, List<Subtodo__c> toDelete) {
        if (toUpsert.size()>0) upsert toUpsert;
        if (toDelete.size()>0) delete toDelete;
    }
}