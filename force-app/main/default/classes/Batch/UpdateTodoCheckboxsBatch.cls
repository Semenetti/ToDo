public with sharing class UpdateTodoCheckboxsBatch implements Database.Batchable<SObject>, Database.Stateful {

    private final static Map<String, Integer> DAY_OF_WEEK_TO_INT = new Map<String, Integer>{
        'Sun' => 1,
        'Mon' => 2,
        'Tue' => 3,
        'Wed' => 4,
        'Thu' => 5,
        'Fri' => 6,
        'Sat' => 7
    }; 

    public Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator(
            'SELECT Id,	Is_Today__c, Is_Tomorrow__c, Is_Periodic_Task__c, Days_of_Week__c, Completion_Date__c FROM Todo__c'
        );
    }

    public void execute(Database.BatchableContext bc, List<Todo__c> todos){

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

        update todoToUpdate;
    }

    public void finish(Database.BatchableContext bc){
    }

}
