public with sharing class DeleteOldTodos_Batch implements Database.Batchable<sObject>, Database.Stateful {
    
    public Integer recordsProcessed = 0;

    public Database.QueryLocator start(Database.BatchableContext bc)  {
        // collect the batches of records or objects to be passed to execute
    }
    public void execute(Database.BatchableContext bc, List<Todo__c> records){
        // process each batch of records
    }
    public void finish(Database.BatchableContext bc){
        // execute any post-processing operations
    }
}
