@isTest
private class StartScheduleTest {
  static testMethod void testScheduledJob() {
    Test.startTest();
    StartSchedule.start();
    Test.stopTest();
  }
}
