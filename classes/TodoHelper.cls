public with sharing class TodoHelper {
  public static Integer getDeletionTerm() {
    // Sprint 21 : get terms from custom metadata using getInstance();    
    return integer.valueof(
      Todo_Setting__mdt.getInstance('Delete_old_ToDos').Term_in_days__c
    );
  }
}
