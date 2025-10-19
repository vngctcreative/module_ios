var body = $response.body;
var obj = JSON.parse(body);

obj.subscriber.entitlements = {
      "pro":{
              "expires_date":"9999-12-31T05:05:04Z",
              "product_identifier":"com.circular.pixels.pro.yearly",
              "purchase_date":"2003-08-31T05:05:04Z"
      }
  },
  
obj.subscriber.subscriptions ={
      "com.circular.pixels.pro.yearly":{
              "billing_issues_detected_at":null,
              "expires_date":"9999-12-31T05:05:04Z",
              "is_sandbox":false,
              "original_purchase_date":"2003-08-31T05:05:04Z",
              "period_type":"normal",
              "purchase_date":"2003-08-31T05:05:04Z",
              "store":"app_store",
              "unsubscribe_detected_at":null
      }
  }

body = JSON.stringify(obj);
$done({body});
