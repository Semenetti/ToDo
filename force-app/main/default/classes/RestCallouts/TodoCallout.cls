public with sharing class TodoCallout {
    
    private final static String TODO_END_POINT = 'https://sfproject3-dev-ed.my.salesforce.com/services/apexrest/Todos';

    public static Map<String, String> createTodo(List<Todo__c> todos){

        String accessToken = TokenHandler.getAccessToken();

        if(accessToken == null){
            return null;
        } 

        if(todos == null)  {
            return null;
        }
        
        String jsonStr = '';
        for(Todo__c todo : todos) {
            jsonStr += JSON.serialize(todo) + '//--//';
        }

        HttpRequest req = new HttpRequest();
        req.setEndpoint(TODO_END_POINT);
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/json;charset=UTF-8');
        req.setHeader('Authorization','Bearer '+ accessToken);  
        req.setBody(jsonStr);
        Http http = new Http();
        HttpResponse res = http.send(req);

        Map<String,String> idMap = new Map<String,String>();

        String [] pairArray = res.getBody().remove('"').remove('{').remove('}').split(',');

        for(String pair : pairArray) {
            String[] ids = pair.split(':');
            idMap.put(ids[0], ids[1]);
        }

        for(Todo__c todo : todos) {
            todo.Connected_Id__c = idMap.get(todo.Id);
        }

        update todos;
        
        return idMap;   
    }

    
    public static HttpResponse deleteTodoById(Id todoId){

        if(todoId == null)  {
            return null;
        }

        String accessToken = TokenHandler.getAccessToken();

        if(accessToken == null) {
            return null;
        }

        HttpRequest req = new HttpRequest();
        req.setEndpoint(TODO_END_POINT + '/' + todoId);
        req.setMethod('DELETE');
        req.setHeader('Content-Type','application/x-www-form-urlencoded');
        req.setHeader('Authorization','Bearer '+ accessToken);  
        Http http = new Http();
        HttpResponse res = http.send(req);
        return res;    
    }

}