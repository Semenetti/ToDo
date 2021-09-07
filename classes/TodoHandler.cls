public with sharing class TodoHandler {

    @AuraEnabled(Cacheable = true)
    public static List<Todo__c> getTodosListWithFindKey(String findKey){

        String key = '%' + findKey + '%';

        return [
            SELECT Id, Name 
            FROM Todo__c
            WHERE Name Like :key
        ];
    }

    @AuraEnabled(Cacheable = true)
    public static List<Subtodo__c> getSubtodos(){

        return [
            SELECT Id, Name, Todo__c
            FROM Subtodo__c
        ];
    }
}
