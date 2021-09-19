@isTest
private class DeleteOldTodos_BatchTest {
  @testSetup
  static void setup() {
    List<Todo__c> todos = new List<Todo__c>();

    for (Integer i = 0; i < 10; i++) {
      todos.add(
        new Todo__c(
          name = 'Todo_test ' + i,
          Completion_Date__c = System.today() - 10
        )
      );
    }
    insert todos;
  }
  @isTest
  static void test() {
    Test.startTest();
    DeleteOldTodos_Batch uca = new DeleteOldTodos_Batch();
    Id batchId = Database.executeBatch(uca);
    Test.stopTest();

    System.assertEquals(
      0,
      [SELECT COUNT() FROM Todo__c WHERE name LIKE 'Todo_test%']
    );
  }
}
