global class DeleteOnSchedule implements Schedulable {
    global void execute(SchedulableContext ctx) {
        Database.executeBatch(new DeleteOldTodos_Batch());
    }
}
