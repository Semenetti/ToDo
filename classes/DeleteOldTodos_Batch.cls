public with sharing class DeleteOldTodos_Batch implements Database.Batchable<sObject>, Database.Stateful {
  public Integer recordsProcessed = 0;

  public Database.QueryLocator start(Database.BatchableContext bc) {
    return Database.getQueryLocator(
      'SELECT Id, Name, Completion_Date__c FROM Todo__c'
    );
  }

  public void execute(Database.BatchableContext bc, List<Todo__c> records) {
    List<Todo__c> listToDelete = new List<Todo__c>();
    integer deleteTerm = TodoHelper.getDeletionTerm();

    for (Todo__c todo : records) {
      if (todo.Completion_Date__c.daysBetween(Date.TODAY()) >= deleteTerm) {
        listToDelete.add(todo);
        recordsProcessed = recordsProcessed + 1;
      }
    }

    delete listToDelete;
  }

  public void finish(Database.BatchableContext bc) {
    System.debug('Processed ' + recordsProcessed + ' records');
    AsyncApexJob job = [
      SELECT
        Id,
        Status,
        NumberOfErrors,
        JobItemsProcessed,
        TotalJobItems,
        CreatedBy.Email
      FROM AsyncApexJob
      WHERE Id = :bc.getJobId()
    ];
    System.debug(job);
  }
}
