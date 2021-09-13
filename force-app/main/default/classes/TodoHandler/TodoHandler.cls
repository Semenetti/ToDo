public with sharing class TodoHandler {

    @AuraEnabled(Cacheable = true)
    public static List<Todo__c> getTodosListWithFindKey(String findKey){

        String key = '%' + findKey + '%';

        return [
            SELECT  Id, Name, Category__c, Completion_Date__c, Connected_Id__c, Days_of_Week__c, 
                    Description__c, Image_URL__c, Is_Done__c, Is_Periodic_Task__c, Is_Priority_Task__c, 
                    Is_Today__c, Is_Tomorrow__c, RecordTypeId, Time__c
            FROM Todo__c
            WHERE Name Like :key
        ];
    }

    @AuraEnabled(Cacheable = true)
    public static List<Subtodo__c> getSubtodos(){

        return [
            SELECT Id, Name, Todo__c, Connected_Id__c, Is_Done__c
            FROM Subtodo__c
        ];

    }
}