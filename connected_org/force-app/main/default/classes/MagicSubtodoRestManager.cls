@RestResource(UrlMapping='/Subtodos/Magic/*')
global with sharing class MagicSubtodoRestManager {
    final static String DELIMETER = '//--//';

    @HttpPatch global static void editSubodo() {
        RestRequest request = RestContext.request;
        List<String> jsonList = request.requestBody.toString().split(DELIMETER);
        List<Subtodo__c> subtodos = new List<Subtodo__c>();

        for (String jsn : jsonList){
            Subtodo__c subtodo = new Subtodo__c();
            Map<String, Object> fields = (Map<String, Object>) JSON.deserializeUntyped(jsn);

            for (String fieldName : fields.keySet()) {
                    subtodo.put(fieldName, fields.get(fieldName));
            }
            System.debug(subtodo);
            subtodos.add(subtodo);
        }
        update subtodos;
    }

}