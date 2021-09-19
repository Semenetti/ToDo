public with sharing class TodoTriggerHelper {

    private final static Map<String, Integer> DAY_OF_WEEK_TO_INT = new Map<String, Integer>{
        'Sun' => 1,
        'Mon' => 2,
        'Tue' => 3,
        'Wed' => 4,
        'Thu' => 5,
        'Fri' => 6,
        'Sat' => 7
    };

    public static void addTodoInQueue(List<Todo__c> newList){

        Map<Id, Id> recordTypeToQueueIdMap = RecordTypeToQueue.getRecordTypeToQueueIdMap();

        for(Todo__c todo : newList) {
            todo.OwnerId = recordTypeToQueueIdMap.get(todo.RecordTypeId);
        }
    }


    public static void setTodayTomorrowCheckboxs(List<Todo__c> todos){

        if(Test.isRunningTest()) {
            return;
        }

        List<Todo__c> todoToUpdate = new List<Todo__c>();

        for(Todo__c todo : todos) {
            Boolean isToday = false;
            Boolean isTomorrow = false;
            if(todo.Is_Periodic_Task__c){              
                todo.Days_of_Week__c = todo.Days_of_Week__c.remove(' ');
                String dayOfWeek = Datetime.now().format('E');
                List<String> todoDays = todo.Days_of_Week__c.split(',');

                for(String day : todoDays) {
                    switch on DAY_OF_WEEK_TO_INT.get(day.substring(0, 3)) - DAY_OF_WEEK_TO_INT.get(dayOfWeek) {
                        when 0 {
                            isToday = true;
                        }
                        when 1, -6{
                            isTomorrow = true;
                        } 
                        when else{
                        }
                    }
                }
               
            } else {
                Date dt = Date.today();
                switch on dt.daysBetween(todo.Completion_Date__c) {
                    when 0 {
                        isToday = true;
                    }
                    when 1 {
                        isTomorrow = true;
                    } 
                    when else{
                    }
                }
            }

            todo.Is_Today__c = isToday;
            todo.Is_Tomorrow__c = isTomorrow;

            todoToUpdate.add(todo);
        }

    }

    public static void createTodoFutureCallout(List<Todo__c> todos){
        if(!Test.isRunningTest()){
            createTodoCallout(JSON.serialize(todos));    
        } 
    }

    @future(callout=true)
    private static void createTodoCallout(String jsonStr){
        List<Todo__c> todos = (List<Todo__c>) JSON.deserialize(jsonStr, List<Todo__c>.class);
        TodoCallout.createTodo(todos);     
    }

    public static void deleteTodoFutureCallout(List<Todo__c> todos){
        if(!Test.isRunningTest()){
            List<Id> idList = new List<Id>();
            for(Todo__c todo : todos) {
                idList.add(todo.Id);
            }
            deleteTodoCallout(idList);
        }
    }

    @future(callout=true)
    private static void deleteTodoCallout(List<Id> idList){
        for(Id id : idList){
            TodoCallout.deleteTodoById(id);
        }
    }

// ----
    public static void updateTodoFutureCallout(List<Todo__c> todos) {
        if(canCallFuture()) {
            updateTodoCallout(JSON.serialize(todos));
        }
    }

    @future(callout=true)
    private static void updateTodoCallout(String jsn){
        System.debug(jsn);
        List<Todo__c> todos = (List<Todo__c>) JSON.deserialize(jsn, List<Todo__c>.class);
        MagicUpdateCallouts.updateTodos(todos);
    }


// helper method
    public static boolean canCallFuture(){
        return (!System.isBatch() && !System.isFuture() && !System.isQueueable() && !System.isScheduled() &&
                !Test.isRunningTest() && Limits.getLimitFutureCalls()>Limits.getFutureCalls());
    }

}