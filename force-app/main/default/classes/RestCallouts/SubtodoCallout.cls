public with sharing class SubtodoCallout {

    private final static String SUBTODO_END_POINT = 'https://sfproject3-dev-ed.my.salesforce.com/services/apexrest/Subtodos';

    public static Map<String, String> createSubtodo(List<Subtodo__c> subtodos){

        List<Id> todosId = new List<Id>();

        for (Subtodo__c subtodo : subtodos) {
            todosId.add(subtodo.Todo__c);
        }

        Map<Id, Todo__c> todoMap = new Map<Id, Todo__c>([SELECT Id, Connected_Id__c FROM Todo__c WHERE Id = :todosId]);

        String accessToken = TokenHandler.getAccessToken();

        if(accessToken == null){
            return null;
        } 

        if(subtodos == null)  {
            return null;
        }

        String jsonStr = '';

        for(Subtodo__c subtodo : subtodos) {
            jsonStr += JSON.serialize(subtodo) + '//--//';
            jsonStr = jsonStr.replace(subtodo.Todo__c, todoMap.get(subtodo.Todo__c).Connected_Id__c);
        }

        HttpRequest req = new HttpRequest();
        req.setEndpoint(SUBTODO_END_POINT);
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

        for(Subtodo__c subtodo : subtodos) {
            subtodo.Connected_Id__c = idMap.get(subtodo.Id);
        }
        
        update subtodos;
        
        return idMap;   
    }

    
    public static HttpResponse deleteSubtodoById(Id subtodoId){

        if(subtodoId == null)  {
            return null;
        }

        String accessToken = TokenHandler.getAccessToken();

        if(accessToken == null) {
            return null;
        }

        HttpRequest req = new HttpRequest();
        req.setEndpoint(SUBTODO_END_POINT + '/' + subtodoId);
        req.setMethod('DELETE');
        req.setHeader('Content-Type','application/x-www-form-urlencoded');
        req.setHeader('Authorization','Bearer '+ accessToken);  
        Http http = new Http();
        HttpResponse res = http.send(req);
        return res;    
    }
}
