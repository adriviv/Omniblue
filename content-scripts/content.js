var content=(function(){"use strict";function ft(s){return s}class U{constructor(e,t,n){this.urlParser=e,this.detectors=t,this.reporter=n}execute(e){const t=this.urlParser.parse(e);for(const n of this.detectors){const o=n.detect(t);o&&this.reporter.report(o)}}resetDetectors(){for(const e of this.detectors)e.reset()}}function $(s,e,t,n=!1,o=null,i=null){return{url:s,objectKind:e,objectId:t,isNewRecord:n,orgId:o,userId:i}}function W(s,e,t,n,o,i){return{type:"snag_modal",title:"We hit a snag.",context:s,message:e,panelContentMessage:t,duplicateRecordIds:n,fieldsWithErrors:o,fieldErrorDetails:i,timestamp:new Date}}function G(s,e,t){return{type:"toast",title:e,message:t,context:s,timestamp:new Date}}function Q(s,e,t){return{type:"warning_modal",title:e,message:t,context:s,timestamp:new Date}}class Y{execute(){return[{content:"Hello, je suis omniblue, ton Agent IA dédié à SalesForce.",role:"welcome"},{content:"Comment je peux t'aider ?",role:"welcome"}]}}class Z{lastDetected=!1;detect(e){const t=this.isModalVisible();return t&&!this.lastDetected?(this.lastDetected=!0,W(e,this.getErrorMessage(),this.getPanelContentMessage(),this.getDuplicateRecordIds(),this.getFieldsWithErrors(),this.getFieldErrorDetails())):(t||(this.lastDetected=!1),null)}reset(){this.lastDetected=!1}isModalVisible(){return document.querySelector("h2.slds-truncate")?.textContent?.trim()==="We hit a snag."?!0:document.querySelector('[aria-label="We hit a snag."]')!==null}getErrorMessage(){return document.querySelector(".fieldLevelErrors .genericNotification strong")?.textContent?.trim()??null}getFieldsWithErrors(){const e=document.querySelectorAll(".fieldLevelErrors .errorsList li a");return Array.from(e).map(t=>t.textContent?.trim()).filter(t=>!!t)}getFieldErrorDetails(){const e=[],t=new Set;return document.querySelectorAll(".slds-form-element__help[data-help-message][data-name]").forEach(a=>{const r=a.getAttribute("data-name");if(!r||t.has(r))return;const l=this.extractMessageFromHelpElement(a);l&&(e.push({field:r,message:l}),t.add(r))}),document.querySelectorAll(".slds-form-element__help[data-help-message]:not([data-name])").forEach(a=>{const r=a.querySelector(".slds-assistive-text")?.textContent?.trim();if(!r||t.has(r))return;const l=this.extractMessageFromHelpElement(a);l&&(e.push({field:r,message:l}),t.add(r))}),document.querySelectorAll(".slds-has-error").forEach(a=>{const r=a.querySelector(".slds-form-element__help");if(!r)return;let l=r.getAttribute("data-name");if(l||(l=a.querySelector("label")?.textContent?.trim()?.replace(/^\*/,"").trim()??null),l||(l=r.querySelector(".slds-assistive-text")?.textContent?.trim()??null),!l||t.has(l))return;const d=this.extractMessageFromHelpElement(r);d&&(e.push({field:l,message:d}),t.add(l))}),e}extractMessageFromHelpElement(e){const t=e.querySelector(".slds-assistive-text")?.textContent??"";let n=e.textContent?.trim()??"";return t&&n.startsWith(t)&&(n=n.slice(t.length).trim()),n||null}getPanelContentMessage(){const e=document.querySelector('[aria-label="We hit a snag."]')??document.querySelector(".forceFormPageError");if(!e)return null;const t=e.querySelector(".panel-content");return t&&(t.textContent?.trim()??"").replace(/View Duplicates\s*$/,"").trim()||null}getDuplicateRecordIds(){const e=[],t=document.querySelector('[aria-label="We hit a snag."]')??document.querySelector(".forceFormPageError");if(!t)return e;const n=t.querySelector("force-dedupe-content");return n&&n.querySelectorAll('a[href*="/"]').forEach(r=>{const d=(r.getAttribute("href")??"").match(/\/([a-zA-Z0-9]{15,18})(?:\/|$)/g);d&&d.forEach(u=>{const p=u.replace(/\//g,"");p&&!e.includes(p)&&e.push(p)})}),t.querySelectorAll("[data-record-id]").forEach(a=>{const r=a.getAttribute("data-record-id");r&&!e.includes(r)&&e.push(r)}),t.querySelectorAll("a").forEach(a=>{const r=a.getAttribute("onclick")??"",l=a.getAttribute("href")??"",d=r+l,u=/['"\/]([a-zA-Z0-9]{15}|[a-zA-Z0-9]{18})['"\/]/g;let p;for(;(p=u.exec(d))!==null;){const f=p[1];this.isValidSalesforceId(f)&&!e.includes(f)&&e.push(f)}}),e}isValidSalesforceId(e){if(!e||e.length!==15&&e.length!==18)return!1;const t=["001","003","005","006","00Q","500","00T","00U","00D","00G","00e","0012"],n=e.substring(0,3);return t.some(o=>n.startsWith(o.substring(0,3)))||/^[a-zA-Z0-9]{3}/.test(n)}}class X{detectedToastIds=new Set;detect(e){const t=document.querySelectorAll('.forceToastMessage[data-key="error"]');for(const n of t){const o=this.getToastId(n);if(o&&!this.detectedToastIds.has(o))return this.detectedToastIds.add(o),G(e,this.getToastTitle(n),this.getToastMessage(n))}return t.length===0&&this.detectedToastIds.clear(),null}reset(){this.detectedToastIds.clear()}getToastId(e){const t=e.getAttribute("data-aura-rendered-by");return t||(e.textContent?.slice(0,100)??null)}getToastTitle(e){return e.querySelector(".toastTitle")?.textContent?.trim()??null}getToastMessage(e){return e.querySelector(".toastMessage")?.textContent?.trim()??null}}class J{lastDetectedTitle=null;detect(e){const t=this.findWarningModal();if(t){const n=this.getModalTitle(t);if(n&&n!==this.lastDetectedTitle)return this.lastDetectedTitle=n,Q(e,n,this.getModalMessage(t))}else this.lastDetectedTitle=null;return null}reset(){this.lastDetectedTitle=null}findWarningModal(){const e=document.querySelector('.slds-popover_warning[aria-hidden="false"]');return e||document.querySelector(".slds-popover_warning.open")}getModalTitle(e){const t=e.getAttribute("aria-label");if(t)return t;const n=e.querySelector("h2.slds-truncate");if(n?.textContent)return n.textContent.trim();const o=e.querySelector("h2");return o?.textContent?o.textContent.trim():null}getModalMessage(e){const t=e.querySelector(".panel-content");if(t){const o=t.textContent?.trim();if(o)return o.replace(/\s+/g," ").trim()}const n=e.querySelector(".slds-p-around_small");return n?.textContent?n.textContent.replace(/\s+/g," ").trim():null}}class h{static SALESFORCE_ID_PATTERN=/^[a-zA-Z0-9]{15,18}$/;parse(e){const t=e.match(/\/lightning\/([^/]+)\/(\w+)(?:\/([^/?]+))?/);if(t){const[,,n,o]=t,i=o==="new",a=o&&!["new","list","home","view","edit"].includes(o)&&h.SALESFORCE_ID_PATTERN.test(o);return $(e,n,a?o:null,i,this.getOrgId(),this.getUserId())}return $(e,null,null,!1,this.getOrgId(),this.getUserId())}getOrgId(){try{if(window.$A?.get){const t=window.$A.get("$Organization.Id");if(t)return t}const e=document.querySelectorAll("script");for(const t of e){const o=(t.textContent||"").match(/setIsolation\s*\(\s*["']([^"']+)/);if(o){const i=o[1];if(i.startsWith("00D")&&i.length>=15)return i.substring(0,15)}}return null}catch{return null}}getUserId(){try{if(window.$A?.get){const t=window.$A.get("$SObjectType.CurrentUser.Id");if(t)return t}const e=document.querySelectorAll("script");for(const t of e){const n=t.textContent||"",o=n.match(/"CurrentUser"[^}]*"Id"\s*:\s*"([0-9a-zA-Z]{15,18})"/);if(o)return o[1];const i=n.match(/setIsolation\s*\(\s*["']([^"']+)/);if(i){const a=i[1],r=a.indexOf("005",15);if(r!==-1){const l=a.substring(r);if(l.length>=15)return l.substring(0,15)}}}return null}catch{return null}}}class k{static buttonSelector='[data-sfd-request-response-button="true"]';buttonLabel;constructor(e="demander une réponse"){this.buttonLabel=e}attachToError(e,t){const n=this.findModal(e.type);if(!n||n.querySelector(k.buttonSelector))return!1;const o=this.resolveContainer(n,e.type),i=this.createButton(t);return o.appendChild(i),window.dispatchEvent(new CustomEvent("sfd-omniblue-action-available")),!0}createButton(e){const t=document.createElement("button");return t.type="button",t.className="slds-button slds-button_neutral slds-m-left_x-small",t.textContent=this.buttonLabel,t.setAttribute("data-sfd-request-response-button","true"),t.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),!t.disabled&&(t.disabled=!0,t.setAttribute("aria-busy","true"),e())}),t}findModal(e){if(e==="snag_modal"){const t=document.querySelector('[aria-label="We hit a snag."]')??document.querySelector(".forceFormPageError");if(t)return t;const o=Array.from(document.querySelectorAll("h2.slds-truncate")).find(i=>i.textContent?.trim()==="We hit a snag.");return o?o.closest(".slds-modal")??o.closest('[role="dialog"]')??o.closest(".forceFormPageError")??o.parentElement:null}return e==="warning_modal"?document.querySelector('.slds-popover_warning[aria-hidden="false"]')??document.querySelector(".slds-popover_warning.open"):e==="toast"?Array.from(document.querySelectorAll('.forceToastMessage[data-key="error"]')).find(n=>!n.querySelector(k.buttonSelector))??null:null}resolveContainer(e,t){return t==="snag_modal"?e.querySelector(".slds-modal__footer")??e.querySelector(".modal-footer")??e.querySelector("footer")??e:t==="warning_modal"?e.querySelector(".slds-popover__footer")??e.querySelector(".slds-popover__body")??e:t==="toast"?e.querySelector(".toastActions")??e.querySelector(".slds-notify__content")??e.querySelector(".toastContent")??e:e}}class ee{observer=null;subscribers=new Set;debounceTimeoutId=null;debounceMs;isStarted=!1;constructor(e={}){this.debounceMs=e.debounceMs??100}subscribe(e){return this.subscribers.add(e),this.subscribers.size===1&&!this.isStarted&&this.start(),()=>{this.subscribers.delete(e),this.subscribers.size===0&&this.isStarted&&this.stop()}}start(){if(this.isStarted||typeof document>"u")return;const e=()=>{this.debounceTimeoutId&&clearTimeout(this.debounceTimeoutId),this.debounceTimeoutId=setTimeout(()=>{this.notifySubscribers(),this.debounceTimeoutId=null},this.debounceMs)};this.observer=new MutationObserver(e),this.observer.observe(document.body,{childList:!0,subtree:!0,attributes:!1}),this.isStarted=!0}stop(){this.debounceTimeoutId&&(clearTimeout(this.debounceTimeoutId),this.debounceTimeoutId=null),this.observer&&(this.observer.disconnect(),this.observer=null),this.isStarted=!1}notifySubscribers(){for(const e of this.subscribers)try{e()}catch(t){console.error("[SharedDomObserver] Subscriber error:",t)}}isRunning(){return this.isStarted}getSubscriberCount(){return this.subscribers.size}}const E=new ee,te={HTTP_REQUEST:"HTTP_REQUEST"},I=globalThis.browser?.runtime?.id?globalThis.browser:globalThis.chrome;class T extends Error{constructor(e,t,n,o){super(e),this.status=t,this.statusText=n,this.response=o,this.name="ApiClientError"}}class se{baseUrl;timeout;headers;constructor(e){this.baseUrl=e.baseUrl.replace(/\/$/,""),this.timeout=e.timeout??1e4,this.headers=e.headers??{}}async post(e,t){return this.request("POST",e,t)}async get(e){return this.request("GET",e)}async put(e,t){return this.request("PUT",e,t)}async patch(e,t){return this.request("PATCH",e,t)}async delete(e){return this.request("DELETE",e)}async request(e,t,n){const o=`${this.baseUrl}${t}`,i=new Promise((l,d)=>{setTimeout(()=>{d(new T("Request timeout - backend may be unavailable",0,"Timeout"))},this.timeout+1e3)}),a=I.runtime.sendMessage({type:te.HTTP_REQUEST,request:{url:o,method:e,headers:this.headers,body:n,timeout:this.timeout}}),r=await Promise.race([a,i]);if(!r)throw new T("No response from background script",0,"No Response");if(!r.success)throw new T(r.error,r.status,r.statusText);return{data:r.data,status:r.status,statusText:r.statusText}}}function q(s){return new se(s)}class ne{constructor(e,t){this.client=e,this.basePath=`/api/v1/organizations/${t}/diagnostic_results`}basePath;async create(e){await this.client.post(this.basePath,e)}async show(e){return(await this.client.get(`${this.basePath}/${e}`)).data}async validate(e,t){return(await this.client.patch(`${this.basePath}/${e}`,t)).data}}class oe{constructor(e,t){this.client=e,this.basePath=`/api/v1/organizations/${t}/salesforce_errors`}basePath;async create(e){return(await this.client.post(this.basePath,e)).data}}class ie{constructor(e,t,n){this.client=e,this.basePath=`/api/v1/organizations/${t}/users/${n}/conversations`}basePath;async create(e){return(await this.client.post(this.basePath,e)).data}async list(e={}){const t=[];e.sort&&t.push(`sort=${encodeURIComponent(e.sort)}`),e.page!==void 0&&t.push(`page=${e.page}`),e.per!==void 0&&t.push(`per=${e.per}`);const n=t.length>0?`?${t.join("&")}`:"";return(await this.client.get(`${this.basePath}${n}`)).data}messages(e){return new ae(this.client,this.basePath,e)}}class ae{constructor(e,t,n){this.client=e,this.basePath=`${t}/${n}/messages`}basePath;async list(e={}){const t=[];e.page!==void 0&&t.push(`page=${e.page}`),e.per!==void 0&&t.push(`per=${e.per}`);const n=t.length>0?`?${t.join("&")}`:"";return(await this.client.get(`${this.basePath}${n}`)).data}async create(e){return(await this.client.post(this.basePath,e)).data}}class re{constructor(e,t,n){this.client=e,this.salesforceErrors=new oe(e,t,n),this.conversations=new ie(e,t,n)}salesforceErrors;conversations}class le{constructor(e,t){this.client=e,this.orgId=t,this.diagnosticResults=new ne(e,t)}diagnosticResults;user(e){return new re(this.client,this.orgId,e)}}class de{constructor(e){this.client=e}organization(e){return new le(this.client,e)}}const ce=5e3;class ue{constructor(e,t={}){this.api=e,this.enableConsoleLog=t.enableConsoleLog??!0,this.deduplicationTtl=t.deduplicationTtl??ce}enableConsoleLog;deduplicationTtl;reportedErrors=new Map;report(e){const t=this.getErrorFingerprint(e);if(this.wasRecentlyReported(t)){this.enableConsoleLog&&console.log("[Salesforce Error Detector] Skipping duplicate error report:",t);return}this.markAsReported(t);const n=this.transformError(e);this.enableConsoleLog&&console.log("[Salesforce Error Detector] Sending error to API:",n);const o=e.context.orgId??"unknown";this.api.organization(o).salesforceErrors.create(n).catch(i=>{console.error("[Salesforce Error Detector] Failed to send error to API:",i)})}getErrorFingerprint(e){const t=[e.type,e.context.orgId??"",e.context.userId??"",e.context.objectKind??"",e.context.objectId??""];return(e.type==="snag_modal"||e.type==="toast"||e.type==="warning_modal")&&t.push(e.title??"",e.message??""),t.join("|")}wasRecentlyReported(e){const t=this.reportedErrors.get(e);return t?Date.now()-t<this.deduplicationTtl:!1}markAsReported(e){const t=Date.now();this.reportedErrors.set(e,t),this.cleanupOldEntries(t)}cleanupOldEntries(e){for(const[t,n]of this.reportedErrors.entries())e-n>this.deduplicationTtl&&this.reportedErrors.delete(t)}transformError(e){const t={error_type:e.type,timestamp:e.timestamp.toISOString(),url:e.context.url,object_kind:e.context.objectKind,object_id:e.context.objectId,is_new_record:e.context.isNewRecord,salesforce_user_id:e.context.userId};return e.type==="snag_modal"?{...t,error:e.title,error_message:e.message,panel_content_message:e.panelContentMessage,duplicate_record_ids:e.duplicateRecordIds,fields_with_errors:e.fieldsWithErrors,field_error_details:e.fieldErrorDetails}:e.type==="toast"?{...t,error_title:e.title,error_message:e.message}:e.type==="warning_modal"?{...t,warning_title:e.title,warning_message:e.message}:t}}class fe{constructor(e,t){this.reporter=e,this.modalButtonService=t}report(e){this.modalButtonService.attachToError(e,()=>{window.dispatchEvent(new CustomEvent("sfd-omniblue-start-conversation",{detail:{message:"J'ai cette erreur qui s'est déclenché. Qu'est ce que je dois faire ?"}})),this.reporter.report(e)})}}const pe='[data-sfd-omniblue-style="true"]',be=`
  [data-sfd-omniblue-container="true"] { position: relative; z-index: 2147483647; }
  .sfd-omniblue-menu, .sfd-omniblue-menu * { box-sizing: border-box; }
  .sfd-omniblue-icon { width: 16px; height: 16px; fill: #fff; }
  .sfd-omniblue-icon-image { width: 18px; height: 18px; display: block; }
  .sfd-omniblue-pulse { animation: sfd-omniblue-pulse 1.4s ease-out 2; }
  .sfd-omniblue-flip { animation: sfd-omniblue-flip 0.6s ease-in-out; }
  @keyframes sfd-omniblue-pulse {
    0% { transform: scale(1); }
    35% { transform: scale(1.12); }
    70% { transform: scale(1); }
    100% { transform: scale(1); }
  }
  @keyframes sfd-omniblue-flip {
    0% { transform: rotateY(0deg); }
    50% { transform: rotateY(90deg); }
    100% { transform: rotateY(180deg); }
  }
  .sfd-omniblue-menu {
    position: fixed;
    top: 0;
    right: 0;
    min-width: 360px;
    width: 360px;
    background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    box-shadow: 0 24px 48px rgba(15, 23, 42, 0.18);
    padding: 18px 20px 20px;
    font-family: "Manrope", "Segoe UI", "Helvetica Neue", sans-serif;
    z-index: 2147483647;
  }
  .sfd-omniblue-header {
    font-size: 16px;
    font-weight: 600;
    color: #0f172a;
    margin-bottom: 18px;
    letter-spacing: 0.01em;
  }
  .sfd-omniblue-footer { display: flex; justify-content: flex-end; }
  .sfd-omniblue-compose {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    background: #ffffff;
    box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .sfd-omniblue-compose svg { fill: #0f172a; width: 18px; height: 18px; }
  .sfd-omniblue-compose:hover { background: #f1f5f9; }
  .sfd-omniblue-compose-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
  }
  .sfd-omniblue-back {
    border: none;
    background: #f1f5f9;
    color: #0f172a;
    width: 30px;
    height: 30px;
    border-radius: 8px;
    cursor: pointer;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .sfd-omniblue-back .sfd-omniblue-icon { width: 14px; height: 14px; fill: #0f172a; }
  .sfd-omniblue-back:hover { background: #e2e8f0; }
  .sfd-omniblue-compose-title { font-size: 14px; font-weight: 600; color: #0f172a; }
  .sfd-omniblue-input {
    width: 100%;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 10px 12px;
    font-size: 13px;
    background: #ffffff;
    color: #0f172a;
    resize: vertical;
    min-height: 96px;
  }
  .sfd-omniblue-input:focus {
    outline: none;
    border-color: #94a3b8;
    box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.2);
  }
  .sfd-omniblue-thread {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 220px;
    overflow-y: auto;
    margin-bottom: 12px;
    padding: 6px 4px;
  }
  .sfd-omniblue-message-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    max-width: 85%;
    align-self: flex-end;
  }
  .sfd-omniblue-message-item-agent,
  .sfd-omniblue-message-item-error {
    align-self: flex-start;
  }
  .sfd-omniblue-message {
    font-size: 13px;
    padding: 10px 12px;
    border-radius: 12px;
    background: #e2e8f0;
    color: #0f172a;
    align-self: flex-start;
    max-width: 100%;
  }
  .sfd-omniblue-message-agent {
    align-self: flex-start;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: #ffffff;
    border: none;
  }
  .sfd-omniblue-message-error {
    background: #fef2f2;
    color: #b91c1c;
  }
  .sfd-omniblue-message-time {
    font-size: 11px;
    color: #94a3b8;
    text-align: right;
  }
  .sfd-omniblue-message-item-agent .sfd-omniblue-message-time,
  .sfd-omniblue-message-item-error .sfd-omniblue-message-time {
    text-align: left;
  }
  .sfd-omniblue-typing {
    align-self: flex-start;
    background: #ffffff;
    border-radius: 12px;
    padding: 10px 12px;
    border: 1px solid #e2e8f0;
    display: inline-flex;
    gap: 4px;
  }
  .sfd-omniblue-typing-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #64748b;
    animation: sfd-omniblue-dot 1s infinite ease-in-out;
  }
  .sfd-omniblue-typing-dot:nth-child(2) { animation-delay: 0.15s; }
  .sfd-omniblue-typing-dot:nth-child(3) { animation-delay: 0.3s; }
  .sfd-omniblue-compose-footer { display: flex; justify-content: flex-end; margin-top: 14px; }
  .sfd-omniblue-send {
    border: none;
    border-radius: 10px;
    background: #0f172a;
    color: #fff;
    font-size: 13px;
    padding: 8px 16px;
    cursor: pointer;
    box-shadow: 0 10px 18px rgba(15, 23, 42, 0.2);
    transition: background 0.15s ease, opacity 0.15s ease;
  }
  .sfd-omniblue-send:hover:not(:disabled) { background: #111827; }
  .sfd-omniblue-send:disabled {
    background: #94a3b8;
    cursor: not-allowed;
    opacity: 0.6;
    box-shadow: none;
  }
  @keyframes sfd-omniblue-dot {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
    40% { transform: scale(1); opacity: 1; }
  }
  .sfd-omniblue-conversation-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
    max-height: 280px;
    overflow-y: auto;
    margin-bottom: 14px;
    padding: 2px 0;
  }
  .sfd-omniblue-conversation-item {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 10px 12px;
    border-radius: 10px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    cursor: pointer;
    transition: background 0.15s ease, border-color 0.15s ease;
  }
  .sfd-omniblue-conversation-item:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }
  .sfd-omniblue-conversation-title {
    font-size: 13px;
    font-weight: 500;
    color: #0f172a;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .sfd-omniblue-conversation-meta {
    font-size: 11px;
    color: #64748b;
  }
  .sfd-omniblue-empty-state {
    text-align: center;
    padding: 24px 12px;
    color: #64748b;
    font-size: 13px;
  }
  .sfd-omniblue-loading {
    display: flex;
    justify-content: center;
    padding: 20px;
  }
`;function ge(){if(document.querySelector(pe))return;const s=document.createElement("style");s.setAttribute("data-sfd-omniblue-style","true"),s.textContent=be,document.head.appendChild(s)}const me={close:"M32.6 10.4L26 17l-6.6-6.6a2 2 0 10-2.8 2.8L23.2 19.8l-6.6 6.6a2 2 0 102.8 2.8L26 22.6l6.6 6.6a2 2 0 102.8-2.8l-6.6-6.6 6.6-6.6a2 2 0 10-2.8-2.8z",compose:"M36.6 10.8l4.6 4.6a2 2 0 010 2.8L21 38.4l-9.4 2.6 2.6-9.4L33.8 10.8a2 2 0 012.8 0zM18.3 35.2l2.5-.7 16.3-16.3-1.8-1.8L19 32.7l-.7 2.5z"};function he(s){const e=globalThis.browser?.runtime??globalThis.chrome?.runtime;return e?.getURL?e.getURL(s):s}function ve(s){const e=document.createElementNS("http://www.w3.org/2000/svg","svg");e.setAttribute("viewBox","0 0 52 52"),e.setAttribute("aria-hidden","true"),e.setAttribute("focusable","false"),e.classList.add("sfd-omniblue-icon");const t=document.createElementNS("http://www.w3.org/2000/svg","path");return t.setAttribute("d",me[s]),e.appendChild(t),e}function N(s,e){const t=document.createElement("img");return t.src=he(s),t.alt=e,t.className="sfd-omniblue-icon-image",t}function y(s){switch(s){case"default":return N("omniblue_icon.png","Omniblue");case"active":return N("omniblue_icon_active.png","Omniblue active");case"close":case"compose":return ve(s)}}function _(s,e){const t=s.querySelector("svg, img"),n=y(e);t?t.replaceWith(n):s.appendChild(n)}function xe(){const s=document.createElement("div");s.className="sfd-omniblue-thread";let e=null;const t=new Intl.DateTimeFormat(void 0,{hour:"2-digit",minute:"2-digit"});return{appendMessage(n,o,i=new Date){const a=document.createElement("div");a.className="sfd-omniblue-message-item";const r=document.createElement("div");r.className="sfd-omniblue-message",o==="agent"||o==="welcome"?(r.classList.add("sfd-omniblue-message-agent"),a.classList.add("sfd-omniblue-message-item-agent")):o==="error"&&(r.classList.add("sfd-omniblue-message-error"),a.classList.add("sfd-omniblue-message-item-error"));const l=document.createElement("div");l.className="sfd-omniblue-message-content",l.textContent=n,r.appendChild(l);const d=document.createElement("div");d.className="sfd-omniblue-message-time",d.textContent=t.format(i),a.appendChild(r),a.appendChild(d),s.appendChild(a),s.scrollTop=s.scrollHeight,e=o},showTypingIndicator(){const n=s.querySelector(".sfd-omniblue-typing");n&&n.remove();const o=document.createElement("div");o.className="sfd-omniblue-typing";for(let i=0;i<3;i+=1){const a=document.createElement("span");a.className="sfd-omniblue-typing-dot",o.appendChild(a)}s.appendChild(o),s.scrollTop=s.scrollHeight},removeTypingIndicator(){const n=s.querySelector(".sfd-omniblue-typing");n&&n.remove()},clear(){s.innerHTML="",e=null},getElement(){return s},getLastMessageRole(){return e},isTypingIndicatorVisible(){return s.querySelector(".sfd-omniblue-typing")!==null}}}function ke(){const s=document.createElement("div");s.className="sfd-omniblue-typing";for(let e=0;e<3;e+=1){const t=document.createElement("span");t.className="sfd-omniblue-typing-dot",s.appendChild(t)}return s}function ye(){const s=document.createElement("div");s.className="sfd-omniblue-conversation-list";let e=new Map,t=null;const n=o=>{const a=o.target.closest(".sfd-omniblue-conversation-item");if(!a||!t)return;const r=a.getAttribute("data-conversation-id");if(r){const l=e.get(r);l&&t(l)}};return s.addEventListener("click",n),{renderList(o,i){s.innerHTML="",e.clear(),t=i;for(const a of o){e.set(String(a.id),a);const r=_e(a);s.appendChild(r)}},renderLoading(){s.innerHTML="",e.clear(),t=null;const o=document.createElement("div");o.className="sfd-omniblue-loading",o.appendChild(ke()),s.appendChild(o)},renderEmpty(o){s.innerHTML="",e.clear(),t=null;const i=document.createElement("div");i.className="sfd-omniblue-empty-state",i.textContent=o,s.appendChild(i)},getElement(){return s},cleanup(){s.removeEventListener("click",n),e.clear(),t=null}}}function _e(s){const e=document.createElement("div");e.className="sfd-omniblue-conversation-item",e.setAttribute("data-conversation-id",String(s.id));const t=document.createElement("div");t.className="sfd-omniblue-conversation-title",t.textContent=s.title??"Sans titre";const n=document.createElement("div");return n.className="sfd-omniblue-conversation-meta",n.textContent=we(s.updatedAt??s.createdAt),e.appendChild(t),e.appendChild(n),e}function we(s){const t=new Date().getTime()-s.getTime(),n=Math.floor(t/6e4),o=Math.floor(t/36e5),i=Math.floor(t/864e5);return n<1?"À l'instant":n<60?`Il y a ${n} min`:o<24?`Il y a ${o}h`:i<7?`Il y a ${i}j`:s.toLocaleDateString("fr-FR",{day:"numeric",month:"short"})}function Se(s){const{container:e,cleanup:t}=Ce(),n=e.querySelector('[data-sfd-omniblue-trigger="true"]'),o=ye(),i=xe(),{menu:a,mainView:r,composeView:l,messageInput:d,sendButton:u,composeFooter:p,cleanup:f}=Ee({conversationListElement:o.getElement(),messageThreadElement:i.getElement(),onComposeClick:s.onComposeClick,onBackClick:s.onBackClick,onSendClick:s.onSendClick});return document.body.appendChild(a),{container:e,triggerButton:n,menu:a,mainView:r,composeView:l,conversationList:o,messageThread:i,messageInput:d,sendButton:u,composeFooter:p,cleanup:()=>{t(),f(),o.cleanup(),a.remove()}}}function Ce(s){const e=document.createElement("li");e.className="slds-global-actions__item slds-dropdown-trigger slds-dropdown-trigger_click",e.setAttribute("data-sfd-omniblue-container","true");const t=document.createElement("button");t.type="button",t.className="slds-button slds-button_icon slds-button_icon-container slds-button_icon-small slds-global-actions__item-action",t.setAttribute("aria-haspopup","true"),t.setAttribute("aria-expanded","false"),t.setAttribute("data-sfd-omniblue-trigger","true"),t.appendChild(y("default"));const n=i=>{i.preventDefault(),i.stopPropagation()};return t.addEventListener("click",n),e.appendChild(t),{container:e,cleanup:()=>{t.removeEventListener("click",n)}}}function Ee(s){const e=document.createElement("div");e.className="sfd-omniblue-menu",e.setAttribute("data-sfd-omniblue-menu","true"),e.setAttribute("role","menu"),e.hidden=!0;const{mainView:t,cleanup:n}=Ie(s.conversationListElement,s.onComposeClick),{composeView:o,messageInput:i,sendButton:a,composeFooter:r,cleanup:l}=Te(s.messageThreadElement,s.onBackClick,s.onSendClick);return e.appendChild(t),e.appendChild(o),{menu:e,mainView:t,composeView:o,messageInput:i,sendButton:a,composeFooter:r,cleanup:()=>{n(),l()}}}function Ie(s,e){const t=document.createElement("div");t.className="sfd-omniblue-view sfd-omniblue-view-main";const n=document.createElement("div");n.className="sfd-omniblue-header",n.textContent="Agent Omniblue";const o=document.createElement("div");o.className="sfd-omniblue-footer";const i=document.createElement("button");return i.type="button",i.className="sfd-omniblue-compose",i.setAttribute("aria-label","New message"),i.appendChild(y("compose")),i.addEventListener("click",e),o.appendChild(i),t.appendChild(n),t.appendChild(s),t.appendChild(o),{mainView:t,cleanup:()=>{i.removeEventListener("click",e)}}}function Te(s,e,t){const n=document.createElement("div");n.className="sfd-omniblue-view sfd-omniblue-view-compose",n.hidden=!0;const o=document.createElement("div");o.className="sfd-omniblue-compose-header";const i=document.createElement("button");i.type="button",i.className="sfd-omniblue-back",i.setAttribute("aria-label","Fermer"),i.appendChild(y("close")),i.addEventListener("click",e);const a=document.createElement("div");a.className="sfd-omniblue-compose-title",a.textContent="Agent Omniblue",o.appendChild(a),o.appendChild(i);const r=document.createElement("textarea");r.className="sfd-omniblue-input",r.rows=3,r.placeholder="Votre message...";const l=document.createElement("div");l.className="sfd-omniblue-compose-footer";const d=document.createElement("button");d.type="button",d.className="sfd-omniblue-send",d.textContent="Envoyer";const u=()=>{const f=r.value.trim();f&&t(f)};return d.addEventListener("click",u),l.appendChild(d),n.appendChild(o),n.appendChild(s),n.appendChild(r),n.appendChild(l),{composeView:n,messageInput:r,sendButton:d,composeFooter:l,cleanup:()=>{i.removeEventListener("click",e),d.removeEventListener("click",u)}}}function Me(s,e){const t=()=>{const n=s.triggerButton.getBoundingClientRect(),o=n.bottom+8,i=Math.max(12,n.right-s.menu.offsetWidth);s.menu.style.top=`${o}px`,s.menu.style.left=`${i}px`,s.menu.style.right="auto"};return{isOpen(){return!s.menu.hidden},open(){s.menu.hidden=!1,s.triggerButton.setAttribute("aria-expanded","true"),_(s.triggerButton,"active"),s.container.classList.add("sfd-omniblue-open"),t()},close(){s.menu.hidden=!0,s.triggerButton.setAttribute("aria-expanded","false"),_(s.triggerButton,"default"),s.container.classList.remove("sfd-omniblue-open")},toggle(){s.menu.hidden?this.open():this.close()}}}function Ae(s,e){const t=()=>{const{messageInput:n,sendButton:o,composeFooter:i,composeView:a}=s;n.isConnected||(n.value="",a.insertBefore(n,i)),o.isConnected||i.appendChild(o)};return{showMainView(){s.composeView.hidden=!0,s.mainView.hidden=!1},showComposeView(){s.mainView.hidden=!0,s.composeView.hidden=!1},resetComposeView(n){s.messageThread.clear(),t(),n?.skipWelcomeMessages||e?.()}}}function Le(s,e,t){let n=null;return{getCurrentConversationId(){return n},resetConversation(){n=null},invalidateConversationListCache(){},async sendMessage(o){e.removeTypingIndicator(),e.appendMessage("Le service de conversation n'est pas disponible pour le moment.","error",new Date)},async loadConversationList(o){t.renderEmpty("Aucune conversation")},async loadConversationMessages(o){return n=o,e.removeTypingIndicator(),e.appendMessage("Le chargement des messages n'est pas disponible pour le moment.","error",new Date),{lastMessageRole:"error"}}}}function Re(s,e){let t;const n=o=>new Promise(i=>setTimeout(i,o));return{animateIconPulse(o,i){i.getAttribute("aria-expanded")!=="true"&&(o.classList.remove("sfd-omniblue-flip"),o.offsetHeight,o.classList.add("sfd-omniblue-flip"),_(i,"active"),t&&window.clearTimeout(t),t=window.setTimeout(()=>{_(i,"default")},2e3))},async displayWelcomeMessages(){const o=s.execute(),i=800,a=400;for(const r of o)e.showTypingIndicator(),await n(i),e.removeTypingIndicator(),await n(a),e.appendMessage(r.content,r.role,new Date)},cleanup(){t&&(window.clearTimeout(t),t=void 0)}}}const M='[data-sfd-omniblue-container="true"]';function Be(){return{isInjected(){return document.querySelector(M)!==null},inject(s){if(this.isInjected())return!1;const e=document.querySelector("header#oneHeader");if(!e)return!1;const t=e.querySelector("ul.slds-global-actions");if(!t)return!1;const o=t.querySelector("span.userProfileCardTriggerRoot, button.branding-userProfile-button")?.closest("li");return o?(t.insertBefore(s,o),!0):!1}}}class $e{constructor(e){this.deps=e,this.headerInjector=Be()}unsubscribeFromDomObserver;elements;menuState;viewNavigation;conversation;animation;headerInjector;start(){ge(),this.ensureButton(),this.unsubscribeFromDomObserver=E.subscribe(()=>this.ensureButton()),document.addEventListener("click",this.handleDocumentClick,!0),window.addEventListener("sfd-omniblue-action-available",this.handleActionAvailable),window.addEventListener("sfd-omniblue-start-conversation",this.handleStartConversation)}stop(){this.unsubscribeFromDomObserver?.(),document.removeEventListener("click",this.handleDocumentClick,!0),window.removeEventListener("sfd-omniblue-action-available",this.handleActionAvailable),window.removeEventListener("sfd-omniblue-start-conversation",this.handleStartConversation),this.animation?.cleanup(),this.elements?.cleanup()}ensureButton(){this.headerInjector.isInjected()||(this.elements=Se({onComposeClick:()=>this.handleComposeClick(),onBackClick:()=>this.viewNavigation?.showMainView(),onSendClick:e=>this.handleSendMessage(e)}),this.headerInjector.inject(this.elements.container)&&this.initializeHandlers())}initializeHandlers(){this.elements&&(this.animation=Re(this.deps.getWelcomeMessages,this.elements.messageThread),this.conversation=Le({getContext:this.deps.getContext},this.elements.messageThread,this.elements.conversationList),this.viewNavigation=Ae(this.elements,()=>{this.conversation?.resetConversation(),this.animation?.displayWelcomeMessages().then(()=>{this.updateSendButtonState()})}),this.menuState=Me(this.elements))}handleDocumentClick=e=>{const t=document.querySelector(M);!t||!this.elements||!t.contains(e.target)&&!this.elements.menu.contains(e.target)&&this.menuState?.close()};handleActionAvailable=()=>{const e=document.querySelector(M);!e||!this.elements||(e.classList.remove("sfd-omniblue-pulse"),e.offsetHeight,e.classList.add("sfd-omniblue-pulse"),this.animation?.animateIconPulse(e,this.elements.triggerButton))};handleStartConversation=e=>{};handleComposeClick(){this.viewNavigation?.showComposeView(),this.viewNavigation?.resetComposeView(),this.elements?.messageInput.focus()}async handleSendMessage(e){if(!this.elements||!this.conversation)return;const{messageThread:t,messageInput:n,sendButton:o}=this.elements;t.appendMessage(e,"user",new Date),n.value="",o.disabled=!0,this.updateSendButtonState(),await this.conversation.sendMessage(e),this.updateSendButtonState()}updateSendButtonState(){if(!this.elements)return;const{messageThread:e,sendButton:t}=this.elements,n=e.getLastMessageRole(),o=e.isTypingIndicatorVisible(),i=n==="user"||o;t.disabled=i,n==="user"&&!o?e.showTypingIndicator():n!=="user"&&o&&e.removeTypingIndicator()}async openConversation(e){if(!this.elements||!this.conversation||!this.viewNavigation)return;this.viewNavigation.showComposeView(),this.elements.messageThread.clear();const{messageInput:t,sendButton:n,composeFooter:o,composeView:i}=this.elements;t.isConnected||(t.value="",i.insertBefore(t,o)),n.isConnected||o.appendChild(n),n.disabled=!0,await this.conversation.loadConversationMessages(e.id),this.updateSendButtonState()}}const qe=`
  .sfd-kb-solve-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px 16px;
    margin-left: 12px;
    font-size: 14px;
    font-weight: 600;
    color: #ffffff;
    background: linear-gradient(135deg, #0176d3 0%, #014486 100%);
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(1, 118, 211, 0.3);
    white-space: nowrap;
  }

  .sfd-kb-solve-button:hover:not(:disabled) {
    background: linear-gradient(135deg, #0b5cab 0%, #013a6b 100%);
    box-shadow: 0 4px 8px rgba(1, 118, 211, 0.4);
    transform: translateY(-1px);
  }

  .sfd-kb-solve-button:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(1, 118, 211, 0.3);
  }

  .sfd-kb-solve-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .sfd-kb-solve-button--loading {
    pointer-events: none;
  }

  .sfd-kb-solve-button__spinner {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: sfd-kb-solve-spin 0.8s linear infinite;
  }

  @keyframes sfd-kb-solve-spin {
    to {
      transform: rotate(360deg);
    }
  }

  .sfd-kb-solve-button__icon {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }

  .sfd-kb-solve-button--success {
    background: linear-gradient(135deg, #2e844a 0%, #1c5c2e 100%);
    box-shadow: 0 2px 4px rgba(46, 132, 74, 0.3);
  }

  .sfd-kb-solve-button--error {
    background: linear-gradient(135deg, #ba0517 0%, #8c0410 100%);
    box-shadow: 0 2px 4px rgba(186, 5, 23, 0.3);
  }

  /* View Result Button - Secondary style */
  .sfd-kb-view-result-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px 16px;
    margin-left: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #0176d3;
    background: #ffffff;
    border: 2px solid #0176d3;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  .sfd-kb-view-result-button:hover:not(:disabled) {
    background: #f3f3f3;
    border-color: #014486;
    color: #014486;
  }

  .sfd-kb-view-result-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .sfd-kb-view-result-button__icon {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }

  /* Result Modal Overlay */
  .sfd-kb-result-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
  }

  .sfd-kb-result-overlay--visible {
    opacity: 1;
    visibility: visible;
  }

  /* Result Modal */
  .sfd-kb-result-modal {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    width: 95%;
    max-width: 1100px;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    transform: translateY(20px);
    transition: transform 0.3s ease;
  }

  .sfd-kb-result-overlay--visible .sfd-kb-result-modal {
    transform: translateY(0);
  }

  /* Modal Header */
  .sfd-kb-result-modal__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid #e5e5e5;
    background: linear-gradient(135deg, #0176d3 0%, #014486 100%);
    border-radius: 12px 12px 0 0;
  }

  .sfd-kb-result-modal__title {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: #ffffff;
  }

  .sfd-kb-result-modal__close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 6px;
    cursor: pointer;
    color: #ffffff;
    transition: background 0.2s ease;
  }

  .sfd-kb-result-modal__close:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .sfd-kb-result-modal__close svg {
    width: 18px;
    height: 18px;
  }

  /* Modal Body - Two column layout */
  .sfd-kb-result-modal__body {
    display: flex;
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  /* Modal Content - Left column */
  .sfd-kb-result-modal__content {
    padding: 24px;
    overflow-y: auto;
    flex: 1;
    min-height: 0;
  }

  /* Modal Sidebar - Right column for feedback */
  .sfd-kb-result-modal__sidebar {
    width: 340px;
    flex-shrink: 0;
    border-left: 1px solid #e5e5e5;
    background: linear-gradient(180deg, #f5f3ff 0%, #ede9fe 100%);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }

  .sfd-kb-result-modal__sidebar-content {
    padding: 24px;
    flex: 1;
  }

  .sfd-kb-result-modal__sidebar-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #c4b5fd;
  }

  .sfd-kb-result-modal__sidebar-title {
    margin: 0;
    font-size: 14px;
    font-weight: 700;
    color: #4c1d95;
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  .sfd-kb-result-modal__sidebar-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    border-radius: 8px;
    color: #ffffff;
  }

  .sfd-kb-result-modal__sidebar-icon svg {
    width: 18px;
    height: 18px;
  }

  /* Modal Footer - Fixed at bottom (kept for backwards compatibility but not used for feedback) */
  .sfd-kb-result-modal__footer {
    flex-shrink: 0;
    border-top: 1px solid #e5e5e5;
    background: #ffffff;
    border-radius: 0 0 12px 12px;
  }

  .sfd-kb-result-modal__footer:empty {
    display: none;
  }

  .sfd-kb-result-modal__footer .sfd-kb-result-section--validation {
    margin-bottom: 0;
    border-radius: 0 0 12px 12px;
    border: none;
    border-top: none;
  }

  /* Loading State */
  .sfd-kb-result-modal__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    color: #706e6b;
  }

  .sfd-kb-result-modal__spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #e5e5e5;
    border-top-color: #0176d3;
    border-radius: 50%;
    animation: sfd-kb-solve-spin 0.8s linear infinite;
    margin-bottom: 16px;
  }

  /* Error State */
  .sfd-kb-result-modal__error {
    padding: 40px 20px;
    text-align: center;
    color: #ba0517;
  }

  /* Result Sections */
  .sfd-kb-result-section {
    margin-bottom: 20px;
    padding: 20px;
    background: #f8fafc;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
  }

  .sfd-kb-result-section:last-child {
    margin-bottom: 0;
  }

  .sfd-kb-result-section--status {
    background: transparent;
    border: none;
    padding: 0 0 16px 0;
    margin-bottom: 16px;
    border-bottom: 1px solid #e5e5e5;
    border-radius: 0;
  }

  .sfd-kb-result-section--highlight {
    background: linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%);
    border-color: #bfdbfe;
  }

  .sfd-kb-result-section--warning {
    background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
    border-color: #fcd34d;
  }

  .sfd-kb-result-section__title {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0 0 14px 0;
    font-size: 13px;
    font-weight: 700;
    color: #0f172a;
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  .sfd-kb-result-section__title-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: #0176d3;
    border-radius: 8px;
    color: #ffffff;
  }

  .sfd-kb-result-section__title-icon svg {
    width: 16px;
    height: 16px;
  }

  .sfd-kb-result-section__text {
    margin: 0;
    font-size: 15px;
    line-height: 1.7;
    color: #334155;
  }

  /* Status Row */
  .sfd-kb-result-status-row {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  /* Badges */
  .sfd-kb-result-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    border-radius: 25px;
    font-size: 15px;
    font-weight: 700;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .sfd-kb-result-badge--success {
    background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
    color: #166534;
    border: 1px solid #86efac;
  }

  .sfd-kb-result-badge--error {
    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
    color: #991b1b;
    border: 1px solid #fca5a5;
  }

  .sfd-kb-result-badge__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
  }

  .sfd-kb-result-badge--success .sfd-kb-result-badge__icon {
    background: #22c55e;
    color: #ffffff;
  }

  .sfd-kb-result-badge--error .sfd-kb-result-badge__icon {
    background: #ef4444;
    color: #ffffff;
  }

  .sfd-kb-result-badge__icon svg {
    width: 14px;
    height: 14px;
  }

  /* Confidence */
  .sfd-kb-result-confidence {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: #f8fafc;
    border-radius: 20px;
    font-size: 14px;
  }

  .sfd-kb-result-confidence__label {
    color: #64748b;
  }

  .sfd-kb-result-confidence__value {
    font-weight: 700;
    color: var(--confidence-color, #64748b);
  }

  /* Resolution Steps */
  .sfd-kb-result-steps {
    margin: 0;
    padding: 0;
    list-style: none;
    counter-reset: step-counter;
  }

  .sfd-kb-result-steps li {
    position: relative;
    margin-bottom: 16px;
    padding: 16px 16px 16px 56px;
    background: #ffffff;
    border-radius: 10px;
    font-size: 14px;
    line-height: 1.6;
    color: #334155;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    border: 1px solid #e2e8f0;
    counter-increment: step-counter;
  }

  .sfd-kb-result-steps li::before {
    content: counter(step-counter);
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: linear-gradient(135deg, #0176d3 0%, #014486 100%);
    border-radius: 50%;
    font-size: 13px;
    font-weight: 700;
    color: #ffffff;
  }

  .sfd-kb-result-steps li:last-child {
    margin-bottom: 0;
  }

  /* Tags */
  .sfd-kb-result-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .sfd-kb-result-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
    color: #475569;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  .sfd-kb-result-tag::before {
    content: '⚡';
    font-size: 12px;
  }

  /* Who Can Help */
  .sfd-kb-result-who-can-help {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .sfd-kb-result-who-can-help__item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px 16px;
    background: #ffffff;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
  }

  .sfd-kb-result-who-can-help__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    border-radius: 50%;
    color: #ffffff;
    flex-shrink: 0;
  }

  .sfd-kb-result-who-can-help__icon svg {
    width: 18px;
    height: 18px;
  }

  .sfd-kb-result-who-can-help__content {
    flex: 1;
  }

  .sfd-kb-result-who-can-help__name {
    font-size: 15px;
    font-weight: 600;
    color: #0f172a;
    margin-bottom: 4px;
  }

  .sfd-kb-result-who-can-help__reason {
    font-size: 13px;
    color: #64748b;
    line-height: 1.5;
  }

  .sfd-kb-result-who-can-help__badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    background: #dcfce7;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    color: #166534;
    margin-top: 8px;
  }

  /* Iterations Count */
  .sfd-kb-result-iterations-container {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: #f8fafc;
    border-radius: 20px;
    font-size: 14px;
  }

  .sfd-kb-result-iterations__label {
    color: #64748b;
  }

  .sfd-kb-result-iterations {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 26px;
    height: 26px;
    padding: 0 8px;
    background: linear-gradient(135deg, #0176d3 0%, #014486 100%);
    border-radius: 13px;
    font-weight: 700;
    font-size: 13px;
    color: #ffffff;
  }

  /* Technical Details - Collapsible */
  .sfd-kb-result-section--technical {
    background: #f1f5f9;
    border-color: #cbd5e1;
  }

  .sfd-kb-result-details-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0;
    margin: 0 0 12px 0;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 13px;
    font-weight: 700;
    color: #0f172a;
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  .sfd-kb-result-details-toggle:hover {
    color: #0176d3;
  }

  .sfd-kb-result-details-toggle__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background: #e2e8f0;
    border-radius: 6px;
    transition: transform 0.2s ease;
  }

  .sfd-kb-result-details-toggle__icon svg {
    width: 14px;
    height: 14px;
  }

  .sfd-kb-result-details-toggle[aria-expanded="true"] .sfd-kb-result-details-toggle__icon {
    transform: rotate(180deg);
  }

  .sfd-kb-result-details-content {
    display: none;
  }

  .sfd-kb-result-details-content--visible {
    display: block;
  }

  /* SOQL Queries - Simplified */
  .sfd-kb-result-queries {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .sfd-kb-result-query-item {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    overflow: hidden;
  }

  .sfd-kb-result-query-item--success {
    border-left: 4px solid #10b981;
  }

  .sfd-kb-result-query-item--error {
    border-left: 4px solid #ef4444;
  }

  .sfd-kb-result-query-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    border-bottom: 1px solid #e2e8f0;
  }

  .sfd-kb-result-query-status {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    font-size: 12px;
  }

  .sfd-kb-result-query-item--success .sfd-kb-result-query-status {
    background: #dcfce7;
    color: #166534;
  }

  .sfd-kb-result-query-item--error .sfd-kb-result-query-status {
    background: #fee2e2;
    color: #991b1b;
  }

  .sfd-kb-result-query-tool {
    font-weight: 600;
    font-size: 14px;
    color: #1e293b;
  }

  .sfd-kb-result-query-duration {
    margin-left: auto;
    padding: 4px 10px;
    background: #f1f5f9;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    color: #64748b;
  }

  .sfd-kb-result-query-args {
    margin: 0;
    padding: 12px 14px;
    background: #f8fafc;
    font-size: 13px;
    line-height: 1.5;
    color: #475569;
    max-height: 400px;
    overflow-y: auto;
  }

  /* Think Tool Arguments */
  .sfd-kb-args-think {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .sfd-kb-args-field {
    background: #ffffff;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    overflow: hidden;
  }

  .sfd-kb-args-field__header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-bottom: 1px solid #e2e8f0;
  }

  .sfd-kb-args-field__icon {
    font-size: 14px;
  }

  .sfd-kb-args-field__label {
    font-weight: 600;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #475569;
  }

  .sfd-kb-args-field__value {
    padding: 12px 14px;
    font-size: 13px;
    line-height: 1.6;
    color: #334155;
  }

  /* Confidence Badge Styling */
  .sfd-kb-args-confidence-badge {
    margin-left: auto;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .sfd-kb-args-field--high .sfd-kb-args-confidence-badge {
    background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
    color: #166534;
  }

  .sfd-kb-args-field--medium .sfd-kb-args-confidence-badge {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    color: #92400e;
  }

  .sfd-kb-args-field--low .sfd-kb-args-confidence-badge {
    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
    color: #991b1b;
  }

  /* Generic Arguments Styling */
  .sfd-kb-args-generic {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .sfd-kb-args-item {
    display: flex;
    flex-direction: column;
    background: #ffffff;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    overflow: hidden;
  }

  .sfd-kb-args-item__key {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-bottom: 1px solid #e2e8f0;
    font-weight: 600;
    font-size: 12px;
    color: #475569;
    text-transform: capitalize;
  }

  .sfd-kb-args-item__icon {
    font-size: 12px;
  }

  .sfd-kb-args-item__value {
    padding: 10px 12px;
    font-size: 13px;
    line-height: 1.5;
    color: #334155;
    word-break: break-word;
    white-space: pre-wrap;
  }

  .sfd-kb-result-query {
    margin: 0;
    padding: 12px 16px;
    background: #f8f8f8;
    border: 1px solid #e5e5e5;
    border-radius: 6px;
    font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
    font-size: 13px;
    line-height: 1.5;
    color: #3e3e3c;
    white-space: pre-wrap;
    word-break: break-all;
    overflow-x: auto;
  }

  /* Empty State */
  .sfd-kb-result-empty {
    margin: 0;
    padding: 16px;
    background: #ffffff;
    border: 1px dashed #cbd5e1;
    border-radius: 8px;
    font-size: 14px;
    color: #64748b;
    font-style: italic;
    text-align: center;
  }

  /* Error State in modal */
  .sfd-kb-result-error {
    padding: 40px 20px;
    text-align: center;
  }

  .sfd-kb-result-error p {
    margin: 0;
    font-size: 15px;
    color: #ef4444;
  }

  /* Validation Section */
  .sfd-kb-result-section--validation {
    background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
    border-color: #c4b5fd;
  }

  /* Validation Section in Sidebar - override styles */
  .sfd-kb-result-modal__sidebar .sfd-kb-result-section--validation {
    background: transparent;
    border: none;
    padding: 0;
    margin: 0;
  }

  .sfd-kb-validation-description {
    margin: 0 0 16px 0;
    font-size: 14px;
    color: #6b7280;
  }

  .sfd-kb-validation-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .sfd-kb-validation-buttons {
    display: flex;
    gap: 12px;
  }

  .sfd-kb-validation-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    flex: 1;
  }

  .sfd-kb-validation-btn--valid {
    background: #ffffff;
    border: 2px solid #10b981;
    color: #10b981;
  }

  .sfd-kb-validation-btn--valid:hover {
    background: #ecfdf5;
  }

  .sfd-kb-validation-btn--valid.sfd-kb-validation-btn--selected {
    background: #10b981;
    color: #ffffff;
  }

  .sfd-kb-validation-btn--invalid {
    background: #ffffff;
    border: 2px solid #ef4444;
    color: #ef4444;
  }

  .sfd-kb-validation-btn--invalid:hover {
    background: #fef2f2;
  }

  .sfd-kb-validation-btn--invalid.sfd-kb-validation-btn--selected {
    background: #ef4444;
    color: #ffffff;
  }

  .sfd-kb-validation-btn__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
  }

  .sfd-kb-validation-btn__icon svg {
    width: 18px;
    height: 18px;
  }

  .sfd-kb-validation-feedback {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .sfd-kb-validation-feedback__label {
    font-size: 14px;
    font-weight: 600;
    color: #374151;
  }

  .sfd-kb-validation-feedback__textarea {
    width: 100%;
    padding: 12px 14px;
    font-size: 14px;
    font-family: inherit;
    line-height: 1.5;
    color: #1f2937;
    background: #ffffff;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    resize: vertical;
    min-height: 80px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .sfd-kb-validation-feedback__textarea:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  .sfd-kb-validation-feedback__textarea::placeholder {
    color: #9ca3af;
  }

  .sfd-kb-validation-submit-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 600;
    color: #ffffff;
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    align-self: flex-start;
  }

  .sfd-kb-validation-submit-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
  }

  .sfd-kb-validation-submit-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Validation Status Display (already validated) */
  .sfd-kb-validation-status {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 18px;
    border-radius: 10px;
    margin-bottom: 12px;
  }

  .sfd-kb-validation-status--valid {
    background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
    border: 1px solid #86efac;
  }

  .sfd-kb-validation-status--invalid {
    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
    border: 1px solid #fca5a5;
  }

  .sfd-kb-validation-status__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
  }

  .sfd-kb-validation-status--valid .sfd-kb-validation-status__icon {
    background: #22c55e;
    color: #ffffff;
  }

  .sfd-kb-validation-status--invalid .sfd-kb-validation-status__icon {
    background: #ef4444;
    color: #ffffff;
  }

  .sfd-kb-validation-status__icon svg {
    width: 14px;
    height: 14px;
  }

  .sfd-kb-validation-status__text {
    font-size: 15px;
    font-weight: 600;
  }

  .sfd-kb-validation-status--valid .sfd-kb-validation-status__text {
    color: #166534;
  }

  .sfd-kb-validation-status--invalid .sfd-kb-validation-status__text {
    color: #991b1b;
  }

  .sfd-kb-validation-status__date {
    margin-left: auto;
    font-size: 13px;
    color: #6b7280;
  }

  .sfd-kb-validation-feedback-display {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 14px 16px;
    margin-bottom: 12px;
  }

  .sfd-kb-validation-feedback-display__label {
    margin: 0 0 6px 0;
    font-size: 12px;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .sfd-kb-validation-feedback-display__text {
    margin: 0;
    font-size: 14px;
    line-height: 1.6;
    color: #374151;
  }

  .sfd-kb-validation-edit-btn {
    display: inline-flex;
    align-items: center;
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 500;
    color: #6366f1;
    background: transparent;
    border: 1px solid #6366f1;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .sfd-kb-validation-edit-btn:hover {
    background: #f5f3ff;
  }
`;let P=!1;function Ne(){if(P)return;const s=document.createElement("style");s.setAttribute("data-sfd-kb-solve-styles","true"),s.textContent=qe,document.head.appendChild(s),P=!0}const z=`
<svg class="sfd-kb-solve-button__icon" viewBox="0 0 520 520" xmlns="http://www.w3.org/2000/svg">
  <path d="M260 20c-88 0-160 72-160 160 0 52 25 98 64 128v52c0 17 14 31 32 31h128c18 0 32-14 32-31v-52c39-30 64-76 64-128 0-88-72-160-160-160zm64 340H196v-20h128v20zm0-60H196v-20h128v20zm-64 140c-18 0-32-14-32-32h64c0 18-14 32-32 32z"/>
</svg>`,Pe=`
<svg class="sfd-kb-view-result-button__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
  <circle cx="12" cy="12" r="3"></circle>
</svg>`;function V(s){const e=document.createElement("div");e.setAttribute("data-sfd-kb-solve-container","true"),e.style.display="inline-flex",e.style.alignItems="center";const t=document.createElement("button");t.setAttribute("data-sfd-kb-solve-button","true"),t.className="sfd-kb-solve-button",t.type="button",t.innerHTML=`${z}<span>Résoudre avec Omniblue</span>`,t.title="Utiliser Omniblue pour résoudre cette demande interne";const n=r=>{r.preventDefault(),r.stopPropagation(),s.onClick()};t.addEventListener("click",n);const o=document.createElement("button");o.setAttribute("data-sfd-kb-view-result-button","true"),o.className="sfd-kb-view-result-button",o.type="button",o.innerHTML=`${Pe}<span>Dernière réponse de Omniblue</span>`,o.title="Voir la dernière réponse de Omniblue",o.disabled=!0;const i=r=>{r.preventDefault(),r.stopPropagation(),s.onViewResult()};return o.addEventListener("click",i),e.appendChild(t),e.appendChild(o),{button:t,viewResultButton:o,container:e,cleanup:()=>{t.removeEventListener("click",n),o.removeEventListener("click",i)}}}function ze(s,e){s.classList.add("sfd-kb-solve-button--loading"),s.disabled=!0,s.innerHTML='<span class="sfd-kb-solve-button__spinner"></span><span>Processing...</span>'}function Ve(s){s.classList.remove("sfd-kb-solve-button--error"),s.classList.remove("sfd-kb-solve-button--loading"),s.classList.add("sfd-kb-solve-button--success"),s.innerHTML="<span>Done!</span>",s.disabled=!0}function j(s,e){s.classList.remove("sfd-kb-solve-button--success"),s.classList.add("sfd-kb-solve-button--error"),s.innerHTML=`<span>${e||"Error"}</span>`,s.disabled=!1,setTimeout(()=>{s.classList.remove("sfd-kb-solve-button--error"),s.innerHTML=`${z}<span>Résoudre avec Omniblue</span>`},3e3)}function D(s,e){s.disabled=!1}const F='[data-sfd-kb-header-wrapper="true"]',je="div.slds-global-header__item.slds-global-header__item_search";function De(){return{isInjected(){return document.querySelector(F)!==null},removeWrapper(){const s=document.querySelector(F);s&&s.remove()},inject(s){if(this.isInjected())return!1;const e=document.querySelector(je);if(!e)return console.log("[KbSolveButton] Global header search container not found, cannot inject"),!1;const t=document.createElement("div");return t.setAttribute("data-sfd-kb-header-wrapper","true"),t.className="slds-global-header__item",t.style.cssText=`
        display: flex;
        align-items: center;
        gap: 8px;
        margin-left: 12px;
      `,t.appendChild(s),e.insertAdjacentElement("afterend",t),console.log("[KbSolveButton] Injected into global header after search"),!0}}}const Fe=`
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <line x1="18" y1="6" x2="6" y2="18"></line>
  <line x1="6" y1="6" x2="18" y2="18"></line>
</svg>`,v=`
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="20 6 9 17 4 12"></polyline>
</svg>`,x=`
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <line x1="18" y1="6" x2="6" y2="18"></line>
  <line x1="6" y1="6" x2="18" y2="18"></line>
</svg>`;function c(s){const e=document.createElement("div");return e.textContent=s,e.innerHTML}function Oe(s){switch(s?.toLowerCase()){case"high":return{label:"Haute",color:"#2e844a"};case"medium":return{label:"Moyenne",color:"#ff9f1a"};case"low":return{label:"Basse",color:"#ba0517"};default:return{label:s||"N/A",color:"#706e6b"}}}function He(s){if(!s||Object.keys(s).length===0)return'<p class="sfd-kb-result-empty">Non spécifié</p>';const e=s.user_name||s.userName||s.name,t=s.reason||"",n=s.user_can_solve||s.userCanSolve||s.user_can_fix||s.userCanFix,o=s.team,i='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';if(e)return`
      <div class="sfd-kb-result-who-can-help">
        <div class="sfd-kb-result-who-can-help__item">
          <div class="sfd-kb-result-who-can-help__icon">${i}</div>
          <div class="sfd-kb-result-who-can-help__content">
            <div class="sfd-kb-result-who-can-help__name">${c(String(e))}</div>
            ${t?`<div class="sfd-kb-result-who-can-help__reason">${c(String(t))}</div>`:""}
            ${n?'<div class="sfd-kb-result-who-can-help__badge">✓ Peut résoudre</div>':""}
          </div>
        </div>
      </div>
    `;if(o)return`
      <div class="sfd-kb-result-who-can-help">
        <div class="sfd-kb-result-who-can-help__item">
          <div class="sfd-kb-result-who-can-help__icon">${i}</div>
          <div class="sfd-kb-result-who-can-help__content">
            <div class="sfd-kb-result-who-can-help__name">Équipe: ${c(String(o))}</div>
            ${t?`<div class="sfd-kb-result-who-can-help__reason">${c(String(t))}</div>`:""}
          </div>
        </div>
      </div>
    `;const a=[];for(const[r,l]of Object.entries(s))(typeof l=="string"||typeof l=="boolean")&&a.push(`${c(r)}: ${c(String(l))}`);return`<p class="sfd-kb-result-section__text">${a.join("<br>")}</p>`}const Ke='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';function O(){const s=document.createElement("div");s.className="sfd-kb-result-overlay",s.setAttribute("data-sfd-kb-result-overlay","true");const e=document.createElement("div");e.className="sfd-kb-result-modal";const t=document.createElement("div");t.className="sfd-kb-result-modal__header",t.innerHTML=`
    <h2 class="sfd-kb-result-modal__title">Résultat Omniblue</h2>
  `;const n=document.createElement("button");n.className="sfd-kb-result-modal__close",n.type="button",n.title="Fermer",n.innerHTML=Fe,t.appendChild(n);const o=document.createElement("div");o.className="sfd-kb-result-modal__body";const i=document.createElement("div");i.className="sfd-kb-result-modal__content",i.innerHTML='<div class="sfd-kb-result-modal__loading">Chargement...</div>';const a=document.createElement("div");a.className="sfd-kb-result-modal__sidebar",a.innerHTML=`
    <div class="sfd-kb-result-modal__sidebar-content">
      <div class="sfd-kb-result-modal__sidebar-header">
        <div class="sfd-kb-result-modal__sidebar-icon">${Ke}</div>
        <h3 class="sfd-kb-result-modal__sidebar-title">Votre feedback</h3>
      </div>
      <div class="sfd-kb-result-modal__sidebar-body"></div>
    </div>
  `;const r=document.createElement("div");r.className="sfd-kb-result-modal__footer",o.appendChild(i),o.appendChild(a),e.appendChild(t),e.appendChild(o),e.appendChild(r),s.appendChild(e);const l=b=>{b.target===s&&s.classList.remove("sfd-kb-result-overlay--visible")},d=()=>{s.classList.remove("sfd-kb-result-overlay--visible")},u=b=>{b.key==="Escape"&&s.classList.contains("sfd-kb-result-overlay--visible")&&s.classList.remove("sfd-kb-result-overlay--visible")};s.addEventListener("click",l),n.addEventListener("click",d),document.addEventListener("keydown",u);const p=()=>{s.removeEventListener("click",l),n.removeEventListener("click",d),document.removeEventListener("keydown",u)};let f=null;const g=b=>{f=b};return s._getValidationHandler=()=>f,{overlay:s,modal:e,closeButton:n,content:i,sidebar:a,footer:r,cleanup:p,setValidationHandler:g}}function Ue(s){s.classList.add("sfd-kb-result-overlay--visible")}function We(s){s.innerHTML=`
    <div class="sfd-kb-result-modal__loading">
      <div class="sfd-kb-result-modal__spinner"></div>
      <p>Analyse en cours...</p>
    </div>
  `}function Ge(s){const e=[{key:"confidence",label:"Confiance",icon:"📊"},{key:"hypothesis",label:"Hypothèse",icon:"💡"},{key:"next_action",label:"Prochaine action",icon:"➡️"},{key:"what_i_know",label:"Ce que je sais",icon:"📝"},{key:"evidence_for",label:"Preuves pour",icon:"✅"},{key:"why_this_action",label:"Pourquoi cette action",icon:"🎯"},{key:"evidence_against",label:"Preuves contre",icon:"❌"}];let t='<div class="sfd-kb-args-think">';for(const n of e){const o=s[n.key];if(o!=null&&o!==""){const i=n.key==="confidence"?` sfd-kb-args-field--${String(o).toLowerCase()}`:"";t+=`
        <div class="sfd-kb-args-field${i}">
          <div class="sfd-kb-args-field__header">
            <span class="sfd-kb-args-field__icon">${n.icon}</span>
            <span class="sfd-kb-args-field__label">${n.label}</span>
            ${n.key==="confidence"?`<span class="sfd-kb-args-confidence-badge">${c(String(o))}</span>`:""}
          </div>
          ${n.key!=="confidence"?`<div class="sfd-kb-args-field__value">${c(String(o))}</div>`:""}
        </div>
      `}}return t+="</div>",t}function Qe(s){const e=Object.entries(s);if(e.length===0)return'<p class="sfd-kb-result-empty">Aucun argument</p>';let t='<div class="sfd-kb-args-generic">';for(const[n,o]of e){const i=n.replace(/_/g," ").replace(/\b\w/g,l=>l.toUpperCase());let a;typeof o=="object"&&o!==null?a=JSON.stringify(o,null,2):a=String(o);let r="📋";(n.includes("type")||n.includes("object"))&&(r="🔷"),(n.includes("query")||n.includes("soql"))&&(r="🔍"),n.includes("field")&&(r="📝"),n.includes("id")&&(r="🔑"),n.includes("name")&&(r="🏷️"),n.includes("filter")&&(r="🔎"),t+=`
      <div class="sfd-kb-args-item">
        <div class="sfd-kb-args-item__key">
          <span class="sfd-kb-args-item__icon">${r}</span>
          ${c(i)}
        </div>
        <div class="sfd-kb-args-item__value">${c(a)}</div>
      </div>
    `}return t+="</div>",t}function Ye(s){const e=s.success?"✓":"✗",t=s.success?"success":"error";let n;return s.tool==="think"&&s.arguments?n=Ge(s.arguments):s.arguments&&Object.keys(s.arguments).length>0?n=Qe(s.arguments):n='<p class="sfd-kb-result-empty">Aucun argument</p>',`
    <div class="sfd-kb-result-query-item sfd-kb-result-query-item--${t}">
      <div class="sfd-kb-result-query-header">
        <span class="sfd-kb-result-query-status">${e}</span>
        <span class="sfd-kb-result-query-tool">${c(s.tool)}</span>
        <span class="sfd-kb-result-query-duration">${s.duration_ms}ms</span>
      </div>
      <div class="sfd-kb-result-query-args">${n}</div>
    </div>
  `}function A(s,e,t){const n=Oe(e.confidence),o=e.solved?v:x,i=e.solved?"sfd-kb-result-badge--success":"sfd-kb-result-badge--error",a=e.solved?"Résolu":"Non résolu",r=e.resolutionSteps?.length?`<ol class="sfd-kb-result-steps">${e.resolutionSteps.map(m=>`<li>${c(m)}</li>`).join("")}</ol>`:'<p class="sfd-kb-result-empty">Aucune étape disponible</p>',l=e.toolsUsed?.length?`<div class="sfd-kb-result-tags">${e.toolsUsed.map(m=>`<span class="sfd-kb-result-tag">${c(m)}</span>`).join("")}</div>`:'<p class="sfd-kb-result-empty">Aucun outil utilisé</p>',d=e.soqlQueries?.length?`<div class="sfd-kb-result-queries">${e.soqlQueries.map(m=>Ye(m)).join("")}</div>`:'<p class="sfd-kb-result-empty">Aucune action technique</p>',u=e.iterationsCount!=null?`<span class="sfd-kb-result-iterations">${e.iterationsCount}</span>`:"N/A",p='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>',f='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',g='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>',b='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>';if(K(e,'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>'),s.innerHTML=`
    <div class="sfd-kb-result-section sfd-kb-result-section--status">
      <div class="sfd-kb-result-status-row">
        <div class="sfd-kb-result-badge ${i}">
          <span class="sfd-kb-result-badge__icon">${o}</span>
          <span>${a}</span>
        </div>
        <div class="sfd-kb-result-confidence" style="--confidence-color: ${n.color}">
          <span class="sfd-kb-result-confidence__label">Confiance:</span>
          <span class="sfd-kb-result-confidence__value">${n.label}</span>
        </div>
        <div class="sfd-kb-result-iterations-container">
          <span class="sfd-kb-result-iterations__label">Itérations:</span>
          ${u}
        </div>
      </div>
    </div>

    <div class="sfd-kb-result-section sfd-kb-result-section--highlight">
      <h3 class="sfd-kb-result-section__title">
        <span class="sfd-kb-result-section__title-icon">${p}</span>
        Résumé du problème
      </h3>
      <p class="sfd-kb-result-section__text">${c(e.problemSummary||"Non disponible")}</p>
    </div>

    <div class="sfd-kb-result-section sfd-kb-result-section--warning">
      <h3 class="sfd-kb-result-section__title">
        <span class="sfd-kb-result-section__title-icon" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);">${f}</span>
        Cause principale
      </h3>
      <p class="sfd-kb-result-section__text">${c(e.rootCause||"Non disponible")}</p>
    </div>

    <div class="sfd-kb-result-section">
      <h3 class="sfd-kb-result-section__title">
        <span class="sfd-kb-result-section__title-icon" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">${g}</span>
        Étapes de résolution
      </h3>
      ${r}
    </div>

    <div class="sfd-kb-result-section">
      <h3 class="sfd-kb-result-section__title">
        <span class="sfd-kb-result-section__title-icon" style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);">${b}</span>
        Qui peut aider
      </h3>
      ${He(e.whoCanHelp)}
    </div>

    <div class="sfd-kb-result-section sfd-kb-result-section--technical">
      <h3 class="sfd-kb-result-section__title">Outils utilisés</h3>
      ${l}
    </div>

    <div class="sfd-kb-result-section sfd-kb-result-section--technical">
      <h3 class="sfd-kb-result-section__title">Détails techniques (${e.soqlQueries?.length||0} actions)</h3>
      ${d}
    </div>
  `,t){const m=t.querySelector(".sfd-kb-result-modal__sidebar-body");m&&(m.innerHTML=H(e),L(t))}}function H(s){if(s.userValidated!==null&&s.userValidated!==void 0){const t=s.userValidated?"sfd-kb-validation-status--valid":"sfd-kb-validation-status--invalid",n=s.userValidated?"Diagnostic validé":"Diagnostic invalidé",o=s.userValidated?v:x,i=s.validatedAt?new Date(s.validatedAt).toLocaleString("fr-FR"):"";return`
      <div class="sfd-kb-validation-status ${t}">
        <span class="sfd-kb-validation-status__icon">${o}</span>
        <span class="sfd-kb-validation-status__text">${n}</span>
        ${i?`<span class="sfd-kb-validation-status__date">${i}</span>`:""}
      </div>
      ${s.userFeedbackOnRootCause?`
        <div class="sfd-kb-validation-feedback-display">
          <p class="sfd-kb-validation-feedback-display__label">Feedback sur la cause principale:</p>
          <p class="sfd-kb-validation-feedback-display__text">${c(s.userFeedbackOnRootCause)}</p>
        </div>
      `:""}
      ${s.userFeedbackOnResolutionSteps?`
        <div class="sfd-kb-validation-feedback-display">
          <p class="sfd-kb-validation-feedback-display__label">Feedback sur les étapes de résolution:</p>
          <p class="sfd-kb-validation-feedback-display__text">${c(s.userFeedbackOnResolutionSteps)}</p>
        </div>
      `:""}
      <button type="button" class="sfd-kb-validation-edit-btn" data-sfd-validation-edit="true">
        Modifier mon feedback
      </button>
    `}return`
    <p class="sfd-kb-validation-description">Ce diagnostic était-il correct ? Aidez-nous à améliorer nos analyses.</p>
    <div class="sfd-kb-validation-form" data-sfd-validation-form="true">
      <div class="sfd-kb-validation-buttons">
        <button type="button" class="sfd-kb-validation-btn sfd-kb-validation-btn--valid" data-sfd-validation-choice="true">
          <span class="sfd-kb-validation-btn__icon">${v}</span>
          <span>Valider</span>
        </button>
        <button type="button" class="sfd-kb-validation-btn sfd-kb-validation-btn--invalid" data-sfd-validation-choice="false">
          <span class="sfd-kb-validation-btn__icon">${x}</span>
          <span>Invalider</span>
        </button>
      </div>
      <div class="sfd-kb-validation-feedback" data-sfd-validation-feedback="true" style="display: none;">
        <label class="sfd-kb-validation-feedback__label" for="sfd-validation-textarea-root-cause">
          Feedback sur la cause principale (optionnel)
        </label>
        <textarea
          id="sfd-validation-textarea-root-cause"
          class="sfd-kb-validation-feedback__textarea"
          placeholder="Quelle était la vraie cause du problème ?"
          rows="2"
          data-sfd-validation-textarea-root-cause="true"
        ></textarea>
        <label class="sfd-kb-validation-feedback__label" for="sfd-validation-textarea-resolution" style="margin-top: 12px;">
          Feedback sur les étapes de résolution (optionnel)
        </label>
        <textarea
          id="sfd-validation-textarea-resolution"
          class="sfd-kb-validation-feedback__textarea"
          placeholder="Quelles étapes auraient dû être proposées ?"
          rows="2"
          data-sfd-validation-textarea-resolution="true"
        ></textarea>
        <button type="button" class="sfd-kb-validation-submit-btn" data-sfd-validation-submit="true" disabled>
          Envoyer mon feedback
        </button>
      </div>
    </div>
  `}function K(s,e){if(s.userValidated!==null&&s.userValidated!==void 0){const n=s.userValidated?"sfd-kb-validation-status--valid":"sfd-kb-validation-status--invalid",o=s.userValidated?"Diagnostic validé":"Diagnostic invalidé",i=s.userValidated?v:x,a=s.validatedAt?new Date(s.validatedAt).toLocaleString("fr-FR"):"";return`
      <div class="sfd-kb-result-section sfd-kb-result-section--validation">
        <h3 class="sfd-kb-result-section__title">
          <span class="sfd-kb-result-section__title-icon" style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);">${e}</span>
          Votre feedback
        </h3>
        <div class="sfd-kb-validation-status ${n}">
          <span class="sfd-kb-validation-status__icon">${i}</span>
          <span class="sfd-kb-validation-status__text">${o}</span>
          ${a?`<span class="sfd-kb-validation-status__date">${a}</span>`:""}
        </div>
        ${s.userFeedbackOnRootCause?`
          <div class="sfd-kb-validation-feedback-display">
            <p class="sfd-kb-validation-feedback-display__label">Feedback sur la cause principale:</p>
            <p class="sfd-kb-validation-feedback-display__text">${c(s.userFeedbackOnRootCause)}</p>
          </div>
        `:""}
        ${s.userFeedbackOnResolutionSteps?`
          <div class="sfd-kb-validation-feedback-display">
            <p class="sfd-kb-validation-feedback-display__label">Feedback sur les étapes de résolution:</p>
            <p class="sfd-kb-validation-feedback-display__text">${c(s.userFeedbackOnResolutionSteps)}</p>
          </div>
        `:""}
        <button type="button" class="sfd-kb-validation-edit-btn" data-sfd-validation-edit="true">
          Modifier mon feedback
        </button>
      </div>
    `}return`
    <div class="sfd-kb-result-section sfd-kb-result-section--validation">
      <h3 class="sfd-kb-result-section__title">
        <span class="sfd-kb-result-section__title-icon" style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);">${e}</span>
        Votre feedback
      </h3>
      <p class="sfd-kb-validation-description">Ce diagnostic était-il correct ? Aidez-nous à améliorer nos analyses.</p>
      <div class="sfd-kb-validation-form" data-sfd-validation-form="true">
        <div class="sfd-kb-validation-buttons">
          <button type="button" class="sfd-kb-validation-btn sfd-kb-validation-btn--valid" data-sfd-validation-choice="true">
            <span class="sfd-kb-validation-btn__icon">${v}</span>
            <span>Valider</span>
          </button>
          <button type="button" class="sfd-kb-validation-btn sfd-kb-validation-btn--invalid" data-sfd-validation-choice="false">
            <span class="sfd-kb-validation-btn__icon">${x}</span>
            <span>Invalider</span>
          </button>
        </div>
        <div class="sfd-kb-validation-feedback" data-sfd-validation-feedback="true" style="display: none;">
          <label class="sfd-kb-validation-feedback__label" for="sfd-validation-textarea-root-cause">
            Feedback sur la cause principale (optionnel)
          </label>
          <textarea
            id="sfd-validation-textarea-root-cause"
            class="sfd-kb-validation-feedback__textarea"
            placeholder="Quelle était la vraie cause du problème ?"
            rows="2"
            data-sfd-validation-textarea-root-cause="true"
          ></textarea>
          <label class="sfd-kb-validation-feedback__label" for="sfd-validation-textarea-resolution" style="margin-top: 12px;">
            Feedback sur les étapes de résolution (optionnel)
          </label>
          <textarea
            id="sfd-validation-textarea-resolution"
            class="sfd-kb-validation-feedback__textarea"
            placeholder="Quelles étapes auraient dû être proposées ?"
            rows="2"
            data-sfd-validation-textarea-resolution="true"
          ></textarea>
          <button type="button" class="sfd-kb-validation-submit-btn" data-sfd-validation-submit="true" disabled>
            Envoyer mon feedback
          </button>
        </div>
      </div>
    </div>
  `}function L(s){const e=s.querySelector('[data-sfd-validation-edit="true"]');e?.addEventListener("click",()=>{const f=s.querySelector(".sfd-kb-result-modal__sidebar-body");if(f)f.innerHTML=H({userValidated:null,userFeedbackOnRootCause:null,userFeedbackOnResolutionSteps:null,validatedAt:null}),L(s);else{const g=e.closest(".sfd-kb-result-section--validation");if(g){const b='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';g.outerHTML=K({userValidated:null,userFeedbackOnRootCause:null,userFeedbackOnResolutionSteps:null,validatedAt:null},b),L(s)}}});const t=s.querySelector('[data-sfd-validation-form="true"]');if(!t)return;const n=t.querySelector('[data-sfd-validation-choice="true"]'),o=t.querySelector('[data-sfd-validation-choice="false"]'),i=t.querySelector('[data-sfd-validation-feedback="true"]'),a=t.querySelector('[data-sfd-validation-textarea-root-cause="true"]'),r=t.querySelector('[data-sfd-validation-textarea-resolution="true"]'),l=t.querySelector('[data-sfd-validation-submit="true"]');let d=null;const u=()=>{n&&n.classList.toggle("sfd-kb-validation-btn--selected",d===!0),o&&o.classList.toggle("sfd-kb-validation-btn--selected",d===!1),l&&(l.disabled=d===null)},p=()=>{i&&(i.style.display="block")};n?.addEventListener("click",()=>{d=!0,u(),p()}),o?.addEventListener("click",()=>{d=!1,u(),p()}),l?.addEventListener("click",async()=>{if(d===null)return;const g=s.closest(".sfd-kb-result-overlay")?._getValidationHandler?.();if(g){l.disabled=!0,l.textContent="Envoi en cours...";try{await g({userValidated:d,userFeedbackOnRootCause:a?.value||"",userFeedbackOnResolutionSteps:r?.value||""})}catch(b){console.error("[KbResultModal] Validation submission failed:",b),l.disabled=!1,l.textContent="Envoyer mon feedback"}}})}const Ze=5e3,Xe=120;class Je{constructor(e){this.deps=e,this.injector=De()}unsubscribeFromDomObserver;elements;modalElements;injector;pollingIntervalId;currentResult;currentRecordId;lastCheckedUrl;urlCheckIntervalId;boundHandlePopState;isRetryingInjection=!1;start(){console.log("[KbSolveButton] Controller started"),Ne(),this.ensureButton(),this.unsubscribeFromDomObserver=E.subscribe(()=>this.ensureButton()),this.boundHandlePopState=()=>this.handleUrlChange(),window.addEventListener("popstate",this.boundHandlePopState),this.lastCheckedUrl=this.deps.getUrl(),this.urlCheckIntervalId=setInterval(()=>{const e=this.deps.getUrl();e!==this.lastCheckedUrl&&(console.log("[KbSolveButton] URL changed from",this.lastCheckedUrl,"to",e),this.lastCheckedUrl=e,this.handleUrlChange())},500)}stop(){this.unsubscribeFromDomObserver?.(),this.boundHandlePopState&&window.removeEventListener("popstate",this.boundHandlePopState),this.urlCheckIntervalId&&clearInterval(this.urlCheckIntervalId),this.cleanupCurrentElements(),this.modalElements?.cleanup(),this.modalElements?.overlay.remove(),this.modalElements=void 0}handleUrlChange(){console.log("[KbSolveButton] handleUrlChange called"),this.cleanupCurrentElements(),this.isRetryingInjection=!0,this.retryInjection(0)}retryInjection(e){if(e>=15){console.log("[KbSolveButton] Max injection attempts reached"),this.isRetryingInjection=!1;return}setTimeout(()=>{if(!this.isInternalRequestPage()){this.isRetryingInjection=!1;return}const o=this.extractRecordId();console.log(`[KbSolveButton] Retry attempt ${e+1} for record:`,o),this.elements&&(this.elements.cleanup(),this.elements.container.remove(),this.elements=void 0),this.currentRecordId=o,this.elements=V({onClick:()=>this.handleClick(),onViewResult:()=>this.handleViewResult()}),(!this.modalElements||!this.modalElements.overlay.isConnected)&&(this.modalElements?.cleanup(),this.modalElements=O(),document.body.appendChild(this.modalElements.overlay));const i=this.injector.inject(this.elements.container);console.log(`[KbSolveButton] Injection attempt ${e+1} result:`,i),i?setTimeout(()=>{this.elements?.container.isConnected?(console.log("[KbSolveButton] Button confirmed in DOM, checking for existing result"),this.isRetryingInjection=!1,this.checkForExistingResult()):(console.log("[KbSolveButton] Button was removed by Salesforce, retrying..."),this.elements?.cleanup(),this.elements=void 0,this.retryInjection(e+1))},200):(console.log("[KbSolveButton] Injection failed, page header not ready yet"),this.elements?.cleanup(),this.elements=void 0,this.retryInjection(e+1))},400)}ensureButton(){if(this.isRetryingInjection)return;const e=this.isInternalRequestPage(),t=this.extractRecordId();if(!e){this.currentRecordId&&(console.log("[KbSolveButton] Navigated away from Internal Request page, cleaning up"),this.cleanupCurrentElements());return}if(this.currentRecordId&&this.currentRecordId!==t&&(console.log("[KbSolveButton] Record changed from",this.currentRecordId,"to",t),this.cleanupCurrentElements()),this.injector.isInjected()&&this.elements?.container.isConnected)return;console.log("[KbSolveButton] ensureButton: Attempting to inject button for record:",t),this.elements&&!this.elements.container.isConnected&&this.cleanupCurrentElements(),this.currentRecordId=t,this.elements=V({onClick:()=>this.handleClick(),onViewResult:()=>this.handleViewResult()}),(!this.modalElements||!this.modalElements.overlay.isConnected)&&(this.modalElements?.cleanup(),this.modalElements=O(),document.body.appendChild(this.modalElements.overlay));const n=this.injector.inject(this.elements.container);console.log("[KbSolveButton] ensureButton: Injection result:",n),n&&this.checkForExistingResult()}cleanupCurrentElements(){this.stopPolling(),this.elements?.cleanup(),this.elements?.container.remove(),this.injector.removeWrapper(),this.elements=void 0,this.currentResult=void 0,this.currentRecordId=void 0}async checkForExistingResult(){const e=this.extractRecordId();if(e){console.log("[KbSolveButton] Checking for existing diagnostic result...");try{const t=`/api/v1/organizations/${this.deps.organizationId}/diagnostic_results/${e}`,o=(await this.deps.apiClient.get(t)).data?.data?.attributes;o&&(console.log("[KbSolveButton] Found existing diagnostic result:",o),this.currentResult=o,this.elements&&D(this.elements.viewResultButton,!0))}catch(t){t instanceof Error&&t.message.includes("404")?console.log("[KbSolveButton] No existing diagnostic result found"):console.error("[KbSolveButton] Error checking for existing result:",t)}}}isInternalRequestPage(){const e=this.deps.getUrl();return/\/lightning\/r\/Internal_Request__c\/[a-zA-Z0-9]{15,18}\/view/.test(e)}extractRecordId(){const t=this.deps.getUrl().match(/\/lightning\/r\/Internal_Request__c\/([a-zA-Z0-9]{15,18})\/view/);return t?t[1]:null}async handleClick(){if(console.log("[KbSolveButton] handleClick called"),!this.elements){console.log("[KbSolveButton] No elements, returning");return}const e=this.extractRecordId();if(console.log("[KbSolveButton] Record ID:",e),!e){j(this.elements.button,"Invalid record");return}ze(this.elements.button);try{const t=`/api/v1/organizations/${this.deps.organizationId}/diagnostic_results`;console.log("[KbSolveButton] Calling POST endpoint:",t),await this.deps.apiClient.post(t,{salesforce_id:e}),console.log("[KbSolveButton] POST successful"),Ve(this.elements.button),this.startPolling(e)}catch(t){console.error("[KbSolveButton] API call failed:",t),j(this.elements.button,"Failed")}}async handleViewResult(){if(console.log("[KbSolveButton] handleViewResult called"),!this.modalElements){console.log("[KbSolveButton] No modal elements, returning");return}const e=this.extractRecordId();if(console.log("[KbSolveButton] Record ID:",e),!e){console.log("[KbSolveButton] No record ID, returning");return}this.modalElements.setValidationHandler(async t=>{await this.handleValidationSubmit(e,t)}),We(this.modalElements.content),Ue(this.modalElements.overlay),console.log("[KbSolveButton] Fetching diagnostic result...");try{const t=`/api/v1/organizations/${this.deps.organizationId}/diagnostic_results/${e}`;console.log("[KbSolveButton] GET endpoint:",t);const n=await this.deps.apiClient.get(t);console.log("[KbSolveButton] GET response:",n);const o=n.data?.data?.attributes;o?(console.log("[KbSolveButton] Setting modal result with:",o),this.currentResult=o,A(this.modalElements.content,o,this.modalElements.sidebar)):console.log("[KbSolveButton] No data in response")}catch(t){console.error("[KbSolveButton] Error fetching diagnostic result:",t),this.modalElements&&(this.modalElements.content.innerHTML=`
          <div class="sfd-kb-result-error">
            <p>Failed to load diagnostic result.</p>
          </div>
        `)}}async handleValidationSubmit(e,t){console.log("[KbSolveButton] handleValidationSubmit called:",t);try{const n=`/api/v1/organizations/${this.deps.organizationId}/diagnostic_results/${e}`,o={user_validated:t.userValidated,user_feedback_on_root_cause:t.userFeedbackOnRootCause||void 0,user_feedback_on_resolution_steps:t.userFeedbackOnResolutionSteps||void 0};console.log("[KbSolveButton] PATCH endpoint:",n,"payload:",o);const i=await this.deps.apiClient.patch(n,o);console.log("[KbSolveButton] PATCH response:",i);const a=i.data?.data?.attributes;a&&this.modalElements&&(console.log("[KbSolveButton] Updating modal with validated result:",a),this.currentResult=a,A(this.modalElements.content,a,this.modalElements.sidebar))}catch(n){throw console.error("[KbSolveButton] Error submitting validation:",n),n}}startPolling(e){this.stopPolling();let t=0;console.log("[KbSolveButton] Starting polling for diagnostic result...");const n=async()=>{if(t++,t>Xe){console.log("[KbSolveButton] Max polling attempts reached, stopping"),this.stopPolling();return}try{const o=`/api/v1/organizations/${this.deps.organizationId}/diagnostic_results/${e}`,a=(await this.deps.apiClient.get(o)).data?.data?.attributes;a&&(console.log("[KbSolveButton] Diagnostic result received:",a),this.currentResult=a,this.elements&&D(this.elements.viewResultButton,!0),this.modalElements&&this.modalElements.overlay.classList.contains("sfd-kb-result-overlay--visible")&&A(this.modalElements.content,a,this.modalElements.sidebar),(a.status==="completed"||a.status==="failed")&&(console.log("[KbSolveButton] Diagnostic completed, stopping polling"),this.stopPolling()))}catch(o){o instanceof Error&&o.message.includes("404")?console.log(`[KbSolveButton] Polling attempt ${t}: result not ready yet`):console.error("[KbSolveButton] Polling error:",o)}};n(),this.pollingIntervalId=setInterval(n,Ze)}stopPolling(){this.pollingIntervalId&&(clearInterval(this.pollingIntervalId),this.pollingIntervalId=void 0)}}const et="https://salesforce-back-api-f704ca957913.herokuapp.com";function tt(){return et}function st(s={}){const e=new h,t=q({baseUrl:s.apiBaseUrl??tt(),timeout:s.apiTimeout??1e4,headers:s.apiHeaders}),n=new de(t),o=new ue(n,{enableConsoleLog:s.enableConsoleLog??!0}),i=new k,a=new fe(o,i),r=[new Z,new X,new J];return new U(e,r,a)}function nt(s={},e=()=>window.location.href){const t=st(s);let n=null;return{start(o){n=E.subscribe(()=>{t.execute(e()),o?.()})},stop(){n?.(),n=null}}}function ot(s={},e=()=>window.location.href){const t=new h,n=new Y,o=()=>t.parse(e());return new $e({getWelcomeMessages:n,getContext:o})}const it="https://salesforce-back-api-f704ca957913.herokuapp.com";function at(s={},e=()=>window.location.href){const t=q({baseUrl:s.apiBaseUrl??it,timeout:s.apiTimeout??3e4});return new Je({apiClient:t,organizationId:s.organizationId??"00Db0000000ZTFF",getUrl:e})}function rt(){return window.location.href.includes("force.com")||window.location.href.includes("salesforce.com")}const lt={matches:["<all_urls>"],main(){if(!rt())return;console.log("Salesforce Error Detector loaded on:",window.location.href);const s=()=>{console.log("[Salesforce] Attempting to extract org/user IDs...");const i=new h().parse(window.location.href);console.log("[Salesforce] organization_id:",i.orgId,"user_id:",i.userId)};document.readyState==="complete"?(console.log("[Salesforce] Page already complete, waiting 1s for Aura..."),setTimeout(s,1e3)):(console.log("[Salesforce] Waiting for page load..."),window.addEventListener("load",()=>{console.log("[Salesforce] Page loaded, waiting 1s for Aura..."),setTimeout(s,1e3)})),nt().start(),ot().start(),at().start()}};function w(s,...e){}const dt={debug:(...s)=>w(console.debug,...s),log:(...s)=>w(console.log,...s),warn:(...s)=>w(console.warn,...s),error:(...s)=>w(console.error,...s)};class R extends Event{constructor(e,t){super(R.EVENT_NAME,{}),this.newUrl=e,this.oldUrl=t}static EVENT_NAME=B("wxt:locationchange")}function B(s){return`${I?.runtime?.id}:content:${s}`}function ct(s){let e,t;return{run(){e==null&&(t=new URL(location.href),e=s.setInterval(()=>{let n=new URL(location.href);n.href!==t.href&&(window.dispatchEvent(new R(n,t)),t=n)},1e3))}}}class S{constructor(e,t){this.contentScriptName=e,this.options=t,this.abortController=new AbortController,this.isTopFrame?(this.listenForNewerScripts({ignoreFirstEvent:!0}),this.stopOldScripts()):this.listenForNewerScripts()}static SCRIPT_STARTED_MESSAGE_TYPE=B("wxt:content-script-started");isTopFrame=window.self===window.top;abortController;locationWatcher=ct(this);receivedMessageIds=new Set;get signal(){return this.abortController.signal}abort(e){return this.abortController.abort(e)}get isInvalid(){return I.runtime.id==null&&this.notifyInvalidated(),this.signal.aborted}get isValid(){return!this.isInvalid}onInvalidated(e){return this.signal.addEventListener("abort",e),()=>this.signal.removeEventListener("abort",e)}block(){return new Promise(()=>{})}setInterval(e,t){const n=setInterval(()=>{this.isValid&&e()},t);return this.onInvalidated(()=>clearInterval(n)),n}setTimeout(e,t){const n=setTimeout(()=>{this.isValid&&e()},t);return this.onInvalidated(()=>clearTimeout(n)),n}requestAnimationFrame(e){const t=requestAnimationFrame((...n)=>{this.isValid&&e(...n)});return this.onInvalidated(()=>cancelAnimationFrame(t)),t}requestIdleCallback(e,t){const n=requestIdleCallback((...o)=>{this.signal.aborted||e(...o)},t);return this.onInvalidated(()=>cancelIdleCallback(n)),n}addEventListener(e,t,n,o){t==="wxt:locationchange"&&this.isValid&&this.locationWatcher.run(),e.addEventListener?.(t.startsWith("wxt:")?B(t):t,n,{...o,signal:this.signal})}notifyInvalidated(){this.abort("Content script context invalidated"),dt.debug(`Content script "${this.contentScriptName}" context invalidated`)}stopOldScripts(){window.postMessage({type:S.SCRIPT_STARTED_MESSAGE_TYPE,contentScriptName:this.contentScriptName,messageId:Math.random().toString(36).slice(2)},"*")}verifyScriptStartedEvent(e){const t=e.data?.type===S.SCRIPT_STARTED_MESSAGE_TYPE,n=e.data?.contentScriptName===this.contentScriptName,o=!this.receivedMessageIds.has(e.data?.messageId);return t&&n&&o}listenForNewerScripts(e){let t=!0;const n=o=>{if(this.verifyScriptStartedEvent(o)){this.receivedMessageIds.add(o.data.messageId);const i=t;if(t=!1,i&&e?.ignoreFirstEvent)return;this.notifyInvalidated()}};addEventListener("message",n),this.onInvalidated(()=>removeEventListener("message",n))}}function bt(){}function C(s,...e){}const ut={debug:(...s)=>C(console.debug,...s),log:(...s)=>C(console.log,...s),warn:(...s)=>C(console.warn,...s),error:(...s)=>C(console.error,...s)};return(async()=>{try{const{main:s,...e}=lt,t=new S("content",e);return await s(t)}catch(s){throw ut.error('The content script "content" crashed on startup!',s),s}})()})();
content;