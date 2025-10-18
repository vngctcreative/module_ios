const mapping = {
  '%E8%BD%A6%E7%A5%A8%E7%A5%A8': ['vip+watch_vip'],
  'Locket': ['Gold']
};

var ua=$request.headers["User-Agent"]||$request.headers["user-agent"],obj=JSON.parse($response.body);obj.Attention="Recode by Creative";var vncreative={is_sandbox:!1,ownership_type:"PURCHASED",billing_issues_detected_at:null,period_type:"normal",expires_date:"9999-12-31T23:59:17Z",grace_period_expires_date:null,unsubscribe_detected_at:null,original_purchase_date:"2003-08-31T01:04:18Z",purchase_date:"2003-08-31T01:04:18Z",store:"app_store"},vncreative={grace_period_expires_date:null,purchase_date:"2003-08-31T01:04:18Z",product_identifier:"com.vncreative.premium.yearly",expires_date:"9999-12-31T23:59:17Z"};const match=Object.keys(mapping).find(e=>ua.includes(e));if(match){let[e,s]=mapping[match];s?(vncreative.product_identifier=s,obj.subscriber.subscriptions[s]=vncreative):obj.subscriber.subscriptions["com.vncreative.premium.yearly"]=vncreative,obj.subscriber.entitlements[e]=vncreative}else obj.subscriber.subscriptions["com.vncreative.premium.yearly"]=vncreative,obj.subscriber.entitlements.pro=vncreative;$done({body:JSON.stringify(obj)});
