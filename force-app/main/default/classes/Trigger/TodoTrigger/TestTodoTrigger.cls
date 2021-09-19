@isTest
private class TestTodoTrigger {

    @isTest static void testAddTodoInQueue(){

        Map<Id,Id> actIdMap = RecordTypeToQueue.getRecordTypeToQueueIdMap();

        List<Todo__c> todoList = new List<Todo__c>();

        for(Integer i = 0; i < 3; i++){
            Todo__c todo = new Todo__c();
            todo.Name = 'test' + i;
            todo.RecordTypeId = (new List<Id>(actIdMap.keySet())).get(i);
            todoList.add(todo);
        }

        Test.startTest();
        insert todoList;
        Test.stopTest();

        List<Todo__c> expTodos = [
            SELECT Id, Name
            FROM Todo__c
            WHERE OwnerId IN :actIdMap.values()
        ];

        System.assertEquals(expTodos.size(), 3);
    }
}
