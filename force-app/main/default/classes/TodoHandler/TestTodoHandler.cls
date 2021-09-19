@isTest
private class TestTodoHandler {
    
    @isTest
    public static void getTodosListWithFindKeyTest(){
        Todo__c todo = new Todo__c();
        todo.Name = 'test';
        insert todo;

        Subtodo__c subTodo = new Subtodo__c();
        subTodo.Name = 'subtest';
        subTodo.Todo__c = todo.Id;
        insert subTodo;

        Test.startTest();
            System.assertEquals(1, TodoHandler.getTodosListWithFindKey('').size());
            System.assertEquals(0, TodoHandler.getTodosListWithFindKey('test1').size());
            System.assertEquals(1, TodoHandler.getSubtodos().size());
        Test.stopTest();
    }
}
