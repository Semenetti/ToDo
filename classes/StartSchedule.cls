public with sharing class StartSchedule {
  public static void start() {
    DeleteOnSchedule deleteOldToDos = new DeleteOnSchedule();
    // Every day at 1 AM (01:00)
    String sch = '0 0 1 * * ?';
    String jobID = System.schedule('Delete old ToDos', sch, deleteOldToDos);

    CronTrigger ct = [
      SELECT TimesTriggered, NextFireTime, State, TimeZoneSidKey
      FROM CronTrigger
      WHERE Id = :jobID
    ];
  }
}
