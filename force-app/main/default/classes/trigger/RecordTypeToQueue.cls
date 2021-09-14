public with sharing class RecordTypeToQueue {

    private static Map<String,String> RECORD_TYPE_NAME_TO_QUEUE_NAME = new Map<String,String>{
        'General' => 'General',
        'Meetings' => 'Secretariat',
        'Shopping' => 'Household'
    };


    public static Map<Id,Id> getRecordTypeToQueueIdMap(){
        Map<Id,Id> resultMap = new Map<Id,Id>();

        Map<Id, Group> queueMap = new Map<Id, Group>([
            SELECT Id, Name 
            FROM Group 
            WHERE Type = 'Queue' AND Name IN :RECORD_TYPE_NAME_TO_QUEUE_NAME.values()
        ]);

        Map<Id, RecordType> recordTypeMap = new Map<Id, RecordType>([
            SELECT id, Name 
            FROM RecordType 
            WHERE sobjecttype ='Todo__c' AND Name IN :RECORD_TYPE_NAME_TO_QUEUE_NAME.keySet()
        ]);
        

        for(RecordType recordType : recordTypeMap.values()){
            for(Group queue : queueMap.values()){
                if(queue.Name == RECORD_TYPE_NAME_TO_QUEUE_NAME.get(recordType.Name)){
                    resultMap.put(recordType.Id, queue.Id);
                    break;
                }
            }
        }

        return resultMap;
    }

}
