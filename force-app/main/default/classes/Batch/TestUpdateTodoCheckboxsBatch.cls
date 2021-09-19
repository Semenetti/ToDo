@isTest
private class TestUpdateTodoCheckboxsBatch {
    
    @isTest static void batchTest(){

        List<Todo__c> todos = new List<Todo__C>();

        Datetime dt = Datetime.now();
        //2 today 2 tommorow
        todos.add(new Todo__c(Name = 'test', Is_Periodic_Task__c = true, Days_of_Week__c = dt.format('E') + ',' + dt.addDays(1).format('E')));
        todos.add(new Todo__c(Name = 'test', Is_Periodic_Task__c = false, Completion_Date__c = dt.date()));
        todos.add(new Todo__c(Name = 'test', Is_Periodic_Task__c = true, Days_of_Week__c = dt.addDays(2).format('E')));
        todos.add(new Todo__c(Name = 'test', Is_Periodic_Task__c = false, Completion_Date__c = dt.addDays(1).date()));
        todos.add(new Todo__c(Name = 'test', Is_Periodic_Task__c = false, Completion_Date__c = dt.addDays(2).date()));

        insert todos;

        Test.startTest();
        Database.executeBatch(new UpdateTodoCheckboxsBatch());
        Test.stopTest();

        List<Todo__c> actTodayTodos = [
            SELECT id
            FROM Todo__c
            WHERE Is_Today__c = true 
        ];

        List<Todo__c> actTomorrowTodos = [
            SELECT id
            FROM Todo__c
            WHERE Is_Tomorrow__c = true 
        ];

        System.assertEquals(2, actTodayTodos.size());
        System.assertEquals(2, actTomorrowTodos.size());

    }


}
