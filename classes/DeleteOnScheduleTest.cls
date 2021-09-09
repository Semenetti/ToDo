@isTest
private class DeleteOnScheduleTest {
  public static String CRON_EXP = '0 0 0 15 3 ? 2022';

  static testMethod void testScheduledJob() {
    Test.startTest();
    List<Todo__c> todos = new List<Todo__c>();
    for (Integer i = 0; i < 10; i++) {
      todos.add(
        new Todo__c(
          name = 'Todo_ScheduleTest ' + i,
          Completion_Date__c = System.today() - 10
        )
      );
    }
    insert todos;

    DeleteOnSchedule testSchedule = new DeleteOnSchedule();
    String jobId = System.schedule('Todo_ScheduleTest', CRON_EXP, testSchedule);
    testSchedule.execute(null);

    System.assertEquals(
      10,
      [SELECT COUNT() FROM Todo__c WHERE name LIKE 'Todo_ScheduleTest%'],
      'Todos dont exist before job has run'
    );

    // Stopping the test will run the job synchronously
    Test.stopTest();

    System.assertEquals(
      0,
      [SELECT COUNT() FROM Todo__c WHERE name LIKE 'Todo_ScheduleTest%'],
      'Todos were not deleted'
    );
  }
}
