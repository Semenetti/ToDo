public with sharing class MagicUpdateCallouts {

    final static String ACCESS_TOKEN = TokenHandler.getAccessToken();
    final static String TODO_ENDPOINT = 'https://sfproject3-dev-ed.my.salesforce.com/services/apexrest/Todos/Magic';
    final static String SUBTODO_ENDPOINT = 'https://sfproject3-dev-ed.my.salesforce.com/services/apexrest/Subtodos/Magic';
    final static String DELIMETER = '//--//';
    final static Map <String, String> connectedTodoIdMap = new Map<String, String>();

    public static HttpResponse updateTodos (List<Todo__c> todos) {

        if (ACCESS_TOKEN == null) {
            System.debug('ACCESS_TOKEN error');
            return null;
        }

        if (todos == null) {
            System.debug('todos list empty');
            return null;
        }

        Http http = new Http();
        HttpRequest request = new HttpRequest();
        setRequestProperties(request);
        request.setEndpoint(TODO_ENDPOINT);
        request.setBody(todosListToString(todos));
        HttpResponse response = http.send(request);
        return response;
    }

    public static HttpResponse updateSubtodos (List<Subtodo__c> subtodos) {

        if (ACCESS_TOKEN == null){
            System.debug('ACCESS_TOKEN error');
            return null;
        }

        if (subtodos == null) {
            System.debug('subtodos list empty');
            return null;
        }

        Http http = new Http();
        HttpRequest request = new HttpRequest();
        setRequestProperties(request);
        request.setEndpoint(SUBTODO_ENDPOINT);
        request.setBody(subtodosListToString(subtodos));
        HttpResponse response = http.send(request);
        System.debug(response);
        return response;
    }

// helper methods
    private static void setRequestProperties(HttpRequest request) {
        request.setHeader('Authorization', 'Bearer ' + ACCESS_TOKEN);
        request.setHeader('Content-Type', 'application/json');
        request.setHeader('accept', 'application/json');
        request.setMethod('PATCH');
    }


    private static String subtodosListToString (List<Subtodo__c> subtodos) {

        String str='';

        for (Subtodo__c s : subtodos) {
            str = str + (str.length()>0?DELIMETER:'') + subtodoToString(s);
        }
        System.debug(str);
        return str;
    }

    private static String todosListToString (List<Todo__c> todos) {

        String str='';

        for (Todo__c t : todos) {
            str = str + (str.length()>0?DELIMETER:'') + todoToString(t);
        }

        return str;
    }

    private static String connectedTodoId (String todoId) {

        Id connectedTodoId = connectedTodoIdMap.get(todoId);

        if (connectedTodoId == null) {
            Todo__c todo = [SELECT Id, Connected_Id__c FROM Todo__c WHERE Id = :todoId LIMIT 1];
            connectedTodoId = todo.Connected_Id__c;
            connectedTodoIdMap.put(todoId, connectedTodoId);
        }

        return connectedTodoId;
    }

    private static String subtodoToString (Subtodo__c s) {

        String str = '{';
        str = str + '"' + Subtodo__c.Name.getDescribe().getSobjectField()             + '" : "' + s.Name                    + '",';
        str = str + '"' + Subtodo__c.Id.getDescribe().getSobjectField()               + '" : "' + s.Connected_Id__c         + '",';
        str = str + '"' + Subtodo__c.Connected_Id__c.getDescribe().getSobjectField()  + '" : "' + s.Id                      + '",';
        str = str + '"' + Subtodo__c.Is_Done__c.getDescribe().getSobjectField()       + '" :  ' + s.Is_Done__c              ;
        str = str + '}';

        return str;
    }

    private static String todoToString (Todo__c t) {

        String str = '{';
        str = str + '"' + Todo__c.Name.getDescribe().getSobjectField()                  + '" : "' + t.Name                  + '",';
        str = str + '"' + Todo__c.Id.getDescribe().getSobjectField()                    + '" : "' + t.Connected_Id__c       + '",';
        str = str + '"' + Todo__c.Connected_Id__c.getDescribe().getSobjectField()       + '" : "' + t.Id                    + '",';
        str = str + '"' + Todo__c.Category__c.getDescribe().getSobjectField()           + '" : "' + t.Category__c           + '",';
        str = str + '"' + Todo__c.Completion_Date__c.getDescribe().getSobjectField()    + '" : "' + t.Completion_Date__c    + '",';
        str = str + '"' + Todo__c.Days_of_Week__c.getDescribe().getSobjectField()       + '" : "' + t.Days_of_Week__c       + '",';
        str = str + '"' + Todo__c.Description__c.getDescribe().getSobjectField()        + '" : "' + t.Description__c        + '",';
        str = str + '"' + Todo__c.Is_Done__c.getDescribe().getSobjectField()            + '" : '  + t.Is_Done__c            + ' ,';
        str = str + '"' + Todo__c.Is_Periodic_Task__c.getDescribe().getSobjectField()   + '" : '  + t.Is_Periodic_Task__c   + ' ,';
        str = str + '"' + Todo__c.Is_Priority_Task__c.getDescribe().getSobjectField()   + '" : '  + t.Is_Priority_Task__c   + ' ,';
        str = str + '"' + Todo__c.Is_Today__c.getDescribe().getSobjectField()           + '" : '  + t.Is_Today__c           + ' ,';
        str = str + '"' + Todo__c.Is_Tomorrow__c.getDescribe().getSobjectField()        + '" : '  + t.Is_Tomorrow__c        + ' ,';
        str = str + '"' + Todo__c.Time__c.getDescribe().getSobjectField()               + '" : "' + t.Time__c               + '"';
        str = str + '}';

        return str;
    }

}