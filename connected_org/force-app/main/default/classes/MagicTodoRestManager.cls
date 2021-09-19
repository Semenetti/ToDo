@RestResource(UrlMapping='/Todos/Magic/*')
global with sharing class MagicTodoRestManager {
    final static String DELIMETER = '//--//';

    @HttpPatch global static void editTodo() {
        RestRequest request = RestContext.request;
        List<String> jsonList = request.requestBody.toString().split(DELIMETER);
        List<Todo__c> todos = new List<Todo__c>();

        for (String jsn : jsonList){
            Todo__c todo = new Todo__c();
            Map<String, Object> fields = (Map<String, Object>) JSON.deserializeUntyped(jsn);

            for (String fieldName : fields.keySet()) {
                System.debug(fieldName);
                System.debug(fields.get(fieldName));

                if ((fields.get(fieldName) == 'null')) {
                    todo.put(fieldName, null);
                } else if (fieldName == (Todo__c.Completion_Date__c.getDescribe().getSobjectField() + '')) {
                        String trunkatedDate = fields.get(fieldName).toString().substring(0,10);
                        todo.put(fieldName, Date.valueOf(trunkatedDate));
                } else if (fieldName == Todo__c.Time__c.getDescribe().getSobjectField() + '') {
                        String hh = fields.get(fieldName).toString().substring(0, 2);
                        String mm = fields.get(fieldName).toString().substring(3, 5);
                        todo.put(fieldName, Time.newInstance(Integer.valueOf(hh), Integer.valueOf(mm), 0, 0));
                } else {
                        todo.put(fieldName, fields.get(fieldName));
                }

            }
            todos.add(todo);
        }
        update todos;
    }

}