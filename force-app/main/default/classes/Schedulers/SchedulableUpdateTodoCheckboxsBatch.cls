public with sharing class SchedulableUpdateTodoCheckboxsBatch  implements Schedulable {

    public void execute(SchedulableContext ctx){
        Database.executeBatch(new UpdateTodoCheckboxsBatch());
    }

}
