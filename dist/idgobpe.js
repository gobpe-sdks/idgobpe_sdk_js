var IDGobPeConst={ACR_ONE_FACTOR:"one_factor",ACR_CERTIFICATE_DNIE:"certificate_dnie",ACR_CERTIFICATE_TOKEN:"certificate_token",ACR_CERTIFICATE_DNIE_LEGACY:"certificate_dnie_legacy",ACR_CERTIFICATE_TOKEN_LEGACY:"certificate_token_legacy",PROMPT_NONE:"none",PROMPT_LOGIN:"login",PROMPT_CONSENT:"consent",SCOPE_PROFILE:"profile",SCOPE_EMAIL:"email",SCOPE_PHONE:"phone",SCOPE_OFFLINE_ACCESS:"offline_access",RESPONSE_TYPE_CODE:"code",RESPONSE_TYPE_ID_TOKEN:"id_token",RESPONSE_TYPE_TOKEN:"token",EVENT_LOADED:"IDGobPe_loaded",EVENT_CONNECTED:"IDGobPe_connected",EVENT_CANCEL:"IDGobPe_cancel",ERROR_INVALID_ORIGIN_JS:"IDGobPe_invalid_origin_js",EVENT_AUTH_COMPLETE:"IDGobPe_auth_complete",EVENT_RELOAD:"IDGobPe_reload",EVENT_AUTH_RELOAD:"IDGobPe_auth_reload",EVENT_AUTH_CANCEL:"IDGobPe_auth_cancel"},idgobpeUris={service:"https://auth.id.gob.pe",auth:"https://auth.id.gob.pe",token:"https://core.id.gob.pe/token",userInfo:"https://core.id.gob.pe/userinfo",logout:"https://auth.id.gob.pe"},idpUris="https://sgd.id.gob.pe",title="Plataforma de Autenticación ID Gob.pe",availableParams={clientId:null,scopes:[],acr:null,prompts:[],responseTypes:[],maxAge:null,loginHint:null},popup=null,onCancelAction=null,onSuccessAction=null,onLoadAction=null,state=null,nonce=null,isReload=!1,loadedFired=!1,acrBig=[IDGobPeConst.ACR_CERTIFICATE_DNIE,IDGobPeConst.ACR_CERTIFICATE_TOKEN,IDGobPeConst.ACR_CERTIFICATE_DNIE_LEGACY,IDGobPeConst.ACR_CERTIFICATE_TOKEN_LEGACY],defaultWidth=400,defaultBigWidth=700,IDGobPe={init:function(e){initConfig(e)},auth:function(){url=getLoginUrl(!1),width=0<=acrBig.indexOf(availableParams.acr)?defaultBigWidth:defaultWidth,openPopup(url,title,width,700)},logout:function(e){url=idgobpeUris.logout+"?"+encodeQueryData({post_logout_redirect_uri:e}),location.href=url},onLoad:function(e){onLoadAction=e},onCancel:function(e){onCancelAction=e},onSuccess:function(e){onSuccessAction=e}};function initConfig(e){Array.isArray(e.scopes)?e.scopes.push("openid"):e.scopes=["openid"],availableParams.clientId=e.clientId||null,availableParams.acr=e.acr||IDGobPeConst.ACR_CERTIFICATE_DNIE,availableParams.responseTypes=Array.isArray(e.responseTypes)?e.responseTypes:[IDGobPeConst.RESPONSE_TYPE_ID_TOKEN],availableParams.scopes=e.scopes,availableParams.prompts=Array.isArray(e.prompts)?e.prompts:[],availableParams.maxAge=isNaN(e.maxAge)||""===e.maxAge?null:e.maxAge,availableParams.loginHint=e.loginHint||null}function getLoginUrl(e){try{return(state=Date.now()+""+Math.random(),nonce="N"+Math.random()+Date.now(),params={client_id:availableParams.clientId,response_type:availableParams.responseTypes.join(" "),state:state,nonce:nonce,scope:availableParams.scopes.join(" "),popup:!0},0<availableParams.prompts.length&&(params.prompt=availableParams.prompts.join(" ")),null!==availableParams.acr&&(params.acr_values=availableParams.acr),null!==availableParams.maxAge&&(params.max_age=availableParams.maxAge),null!==availableParams.loginHint&&(params.login_hint=availableParams.loginHint),e)?params:(url=idgobpeUris.auth+"?"+encodeQueryData(params),url)}catch(e){console.error(e)}return null}function openPopup(e,o,n,a){dualScreenLeft=void 0!==window.screenLeft?window.screenLeft:window.screenX,dualScreenTop=void 0!==window.screenTop?window.screenTop:window.screenY,width=window.innerWidth||document.documentElement.clientWidth||screen.width,height=window.innerHeight||document.documentElement.clientHeight||screen.height,posLeft=width/2-n/2+dualScreenLeft,posTop=height/2-a/2+dualScreenTop,popup=window.open(e,o,"toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,copyhistory=no,width="+n+",height="+a+",top="+posTop+",left="+posLeft),window.focus&&popup.focus()}function parseJwt(e){return base64Url=e.split(".")[1],base64=base64Url.replace("-","+").replace("_","/"),JSON.parse(window.atob(base64))}function encodeQueryData(e){for(d in ret=[],e)ret.push(encodeURIComponent(d)+"="+encodeURIComponent(e[d]));return ret.join("&")}function procUserInfo(e,o){http=new XMLHttpRequest,params="access_token="+e,http.open("POST",idgobpeUris.userInfo,!0),http.setRequestHeader("Content-type","application/x-www-form-urlencoded"),http.onreadystatechange=function(){4===http.readyState&&(200===http.status?(result=JSON.parse(http.responseText),o(result)):(console.error("Error fetching userinfo."),o(null)))},http.send(params)}function procFinalResponse(e){"function"==typeof onSuccessAction&&onSuccessAction(e)}function resetInitial(){isReload=loadedFired=!1}(idpUris=idpUris.split(",")).push(idgobpeUris.auth),window.addEventListener("message",function(e){if(-1!==idpUris.indexOf(e.origin))switch(e.data.event){case IDGobPeConst.EVENT_LOADED:loadedFired||(console.info("Event fired: "+IDGobPeConst.EVENT_LOADED),popup.postMessage({event:IDGobPeConst.EVENT_CONNECTED,code:e.data.code},"*"),"function"!=typeof onLoadAction||loadedFired||onLoadAction(),loadedFired=!0);break;case IDGobPeConst.EVENT_AUTH_COMPLETE:if(resetInitial(),console.info("Event fired: "+IDGobPeConst.EVENT_AUTH_COMPLETE),state===e.data.data.state){if(e.data.data.error){console.info(e.data.data.error),console.info(e.data.data.error_description),"function"==typeof onCancelAction&&onCancelAction();break}var o,n=parseJwt(e.data.data.id_token);nonce===n.nonce?(o={idToken:e.data.data.id_token,idTokenParser:n},e.data.data.access_token?procUserInfo(e.data.data.access_token,function(e){o.userInfo=e,procFinalResponse(o)}):procFinalResponse(o)):console.error("Wrong nonce")}else console.error("Wrong state");break;case IDGobPeConst.EVENT_CANCEL:isReload||(resetInitial(),console.info("Event fired: "+IDGobPeConst.EVENT_CANCEL),"function"==typeof onCancelAction&&onCancelAction()),isReload=!1;break;case IDGobPeConst.ERROR_INVALID_ORIGIN_JS:console.info("Event fired: "+IDGobPeConst.ERROR_INVALID_ORIGIN_JS),console.info(e.data),resetInitial(),"function"==typeof onCancelAction&&onCancelAction()}});