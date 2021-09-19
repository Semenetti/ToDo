public with sharing class TokenHandler {
    
    private final static String TOKEN_ENDPOINT='https://login.salesforce.com/services/oauth2/token';

    private final static String USERNAME = 'ivan@sfproject9.com'; 
    private final static String PASSWORD = 'sfproject1';
    private final static String C_KEY= '3MVG9fe4g9fhX0E63OJBy6k7yN2VTHUjY6gG5_Qbm0Be9_6wQYuFi2tSs4dxFk_6zHRby5JNnWbuFkYbNKkra';
    private final static String C_SECRET = '0DFD4004ECC0028E0FD143683622094A6A4C117ABB0BCEC2360636EE2390C0E8'; 

    private static String accessToken = null;

    public static String getAccessToken(){

        if(accessToken != null) {
            return accessToken;
        }

        Httprequest req = new HttpRequest();
        req.setMethod('GET');    

        req.setBody('grant_type=password' + '&client_id='+C_KEY + 
                    '&client_secret='+C_SECRET + '&username='+USERNAME + '&password='+PASSWORD); 

        req.setEndpoint(TOKEN_ENDPOINT);
        Http http = new Http();
        HttpResponse res;       
        try {
            res = http.send(req);                
            JSONParser parser = JSON.createParser(res.getBody());
            while (parser.nextToken() != null) {
                if ((parser.getCurrentToken() == JSONToken.FIELD_NAME) && (parser.getText() == 'access_token')) {
                    parser.nextToken();
                    accessToken = parser.getText();    
                } 
            }
            return accessToken;            
        }
        catch(system.CalloutException e){            
            System.debug('error:'+ e);
            return null;
        }
    }
}
