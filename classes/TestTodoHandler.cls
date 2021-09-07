@isTest
private class TestTodoHandler {
    
    @isTest
    public static void getTodosListWithFindKeyTest(){
        Todo__c todo = new Todo__c();
        todo.Name = 'test';
        insert todo;

        Subtodo__c subtodo = new Subtodo__c();
        subtodo.Name = 'subtest';
        subtodo.Todo__c = todo.Id;
        insert subtodo;

        Test.startTest();
            System.assertEquals(1, TodoHandler.getTodosListWithFindKey('').size());
            System.assertEquals(0, TodoHandler.getTodosListWithFindKey('test1').size());
            System.assertEquals(1, TodoHandler.getSubtodos().size());
        Test.stopTest();
    }
}
