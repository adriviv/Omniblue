var content=(function(){"use strict";function Nt(s){return s}class fe{constructor(e,t,o){this.urlParser=e,this.detectors=t,this.reporter=o}execute(e){const t=this.urlParser.parse(e);for(const o of this.detectors){const n=o.detect(t);n&&this.reporter.report(n)}}resetDetectors(){for(const e of this.detectors)e.reset()}}function G(s,e,t,o=!1,n=null,a=null){return{url:s,objectKind:e,objectId:t,isNewRecord:o,orgId:n,userId:a}}function pe(s,e,t,o,n,a){return{type:"snag_modal",title:"We hit a snag.",context:s,message:e,panelContentMessage:t,duplicateRecordIds:o,fieldsWithErrors:n,fieldErrorDetails:a,timestamp:new Date}}function be(s,e,t){return{type:"toast",title:e,message:t,context:s,timestamp:new Date}}function ge(s,e,t){return{type:"warning_modal",title:e,message:t,context:s,timestamp:new Date}}class me{execute(){return[{content:"Hello, je suis omniblue, ton Agent IA dédié à SalesForce.",role:"welcome"},{content:"Comment je peux t'aider ?",role:"welcome"}]}}class he{lastDetected=!1;detect(e){const t=this.isModalVisible();return t&&!this.lastDetected?(this.lastDetected=!0,pe(e,this.getErrorMessage(),this.getPanelContentMessage(),this.getDuplicateRecordIds(),this.getFieldsWithErrors(),this.getFieldErrorDetails())):(t||(this.lastDetected=!1),null)}reset(){this.lastDetected=!1}isModalVisible(){return document.querySelector("h2.slds-truncate")?.textContent?.trim()==="We hit a snag."?!0:document.querySelector('[aria-label="We hit a snag."]')!==null}getErrorMessage(){return document.querySelector(".fieldLevelErrors .genericNotification strong")?.textContent?.trim()??null}getFieldsWithErrors(){const e=document.querySelectorAll(".fieldLevelErrors .errorsList li a");return Array.from(e).map(t=>t.textContent?.trim()).filter(t=>!!t)}getFieldErrorDetails(){const e=[],t=new Set;return document.querySelectorAll(".slds-form-element__help[data-help-message][data-name]").forEach(r=>{const i=r.getAttribute("data-name");if(!i||t.has(i))return;const l=this.extractMessageFromHelpElement(r);l&&(e.push({field:i,message:l}),t.add(i))}),document.querySelectorAll(".slds-form-element__help[data-help-message]:not([data-name])").forEach(r=>{const i=r.querySelector(".slds-assistive-text")?.textContent?.trim();if(!i||t.has(i))return;const l=this.extractMessageFromHelpElement(r);l&&(e.push({field:i,message:l}),t.add(i))}),document.querySelectorAll(".slds-has-error").forEach(r=>{const i=r.querySelector(".slds-form-element__help");if(!i)return;let l=i.getAttribute("data-name");if(l||(l=r.querySelector("label")?.textContent?.trim()?.replace(/^\*/,"").trim()??null),l||(l=i.querySelector(".slds-assistive-text")?.textContent?.trim()??null),!l||t.has(l))return;const d=this.extractMessageFromHelpElement(i);d&&(e.push({field:l,message:d}),t.add(l))}),e}extractMessageFromHelpElement(e){const t=e.querySelector(".slds-assistive-text")?.textContent??"";let o=e.textContent?.trim()??"";return t&&o.startsWith(t)&&(o=o.slice(t.length).trim()),o||null}getPanelContentMessage(){const e=document.querySelector('[aria-label="We hit a snag."]')??document.querySelector(".forceFormPageError");if(!e)return null;const t=e.querySelector(".panel-content");return t&&(t.textContent?.trim()??"").replace(/View Duplicates\s*$/,"").trim()||null}getDuplicateRecordIds(){const e=[],t=document.querySelector('[aria-label="We hit a snag."]')??document.querySelector(".forceFormPageError");if(!t)return e;const o=t.querySelector("force-dedupe-content");return o&&o.querySelectorAll('a[href*="/"]').forEach(i=>{const d=(i.getAttribute("href")??"").match(/\/([a-zA-Z0-9]{15,18})(?:\/|$)/g);d&&d.forEach(u=>{const m=u.replace(/\//g,"");m&&!e.includes(m)&&e.push(m)})}),t.querySelectorAll("[data-record-id]").forEach(r=>{const i=r.getAttribute("data-record-id");i&&!e.includes(i)&&e.push(i)}),t.querySelectorAll("a").forEach(r=>{const i=r.getAttribute("onclick")??"",l=r.getAttribute("href")??"",d=i+l,u=/['"\/]([a-zA-Z0-9]{15}|[a-zA-Z0-9]{18})['"\/]/g;let m;for(;(m=u.exec(d))!==null;){const h=m[1];this.isValidSalesforceId(h)&&!e.includes(h)&&e.push(h)}}),e}isValidSalesforceId(e){if(!e||e.length!==15&&e.length!==18)return!1;const t=["001","003","005","006","00Q","500","00T","00U","00D","00G","00e","0012"],o=e.substring(0,3);return t.some(n=>o.startsWith(n.substring(0,3)))||/^[a-zA-Z0-9]{3}/.test(o)}}class ke{detectedToastIds=new Set;detect(e){const t=document.querySelectorAll('.forceToastMessage[data-key="error"]');for(const o of t){const n=this.getToastId(o);if(n&&!this.detectedToastIds.has(n))return this.detectedToastIds.add(n),be(e,this.getToastTitle(o),this.getToastMessage(o))}return t.length===0&&this.detectedToastIds.clear(),null}reset(){this.detectedToastIds.clear()}getToastId(e){const t=e.getAttribute("data-aura-rendered-by");return t||(e.textContent?.slice(0,100)??null)}getToastTitle(e){return e.querySelector(".toastTitle")?.textContent?.trim()??null}getToastMessage(e){return e.querySelector(".toastMessage")?.textContent?.trim()??null}}class ve{lastDetectedTitle=null;detect(e){const t=this.findWarningModal();if(t){const o=this.getModalTitle(t);if(o&&o!==this.lastDetectedTitle)return this.lastDetectedTitle=o,ge(e,o,this.getModalMessage(t))}else this.lastDetectedTitle=null;return null}reset(){this.lastDetectedTitle=null}findWarningModal(){const e=document.querySelector('.slds-popover_warning[aria-hidden="false"]');return e||document.querySelector(".slds-popover_warning.open")}getModalTitle(e){const t=e.getAttribute("aria-label");if(t)return t;const o=e.querySelector("h2.slds-truncate");if(o?.textContent)return o.textContent.trim();const n=e.querySelector("h2");return n?.textContent?n.textContent.trim():null}getModalMessage(e){const t=e.querySelector(".panel-content");if(t){const n=t.textContent?.trim();if(n)return n.replace(/\s+/g," ").trim()}const o=e.querySelector(".slds-p-around_small");return o?.textContent?o.textContent.replace(/\s+/g," ").trim():null}}class y{static SALESFORCE_ID_PATTERN=/^[a-zA-Z0-9]{15,18}$/;parse(e){const t=e.match(/\/lightning\/([^/]+)\/(\w+)(?:\/([^/?]+))?/);if(t){const[,,o,n]=t,a=n==="new",r=n&&!["new","list","home","view","edit"].includes(n)&&y.SALESFORCE_ID_PATTERN.test(n);return G(e,o,r?n:null,a,this.getOrgId(),this.getUserId())}return G(e,null,null,!1,this.getOrgId(),this.getUserId())}getOrgId(){try{if(window.$A?.get){const t=window.$A.get("$Organization.Id");if(t)return t}const e=document.querySelectorAll("script");for(const t of e){const n=(t.textContent||"").match(/setIsolation\s*\(\s*["']([^"']+)/);if(n){const a=n[1];if(a.startsWith("00D")&&a.length>=15)return a.substring(0,15)}}return null}catch{return null}}getUserId(){try{if(window.$A?.get){const t=window.$A.get("$SObjectType.CurrentUser.Id");if(t)return t}const e=document.querySelectorAll("script");for(const t of e){const o=t.textContent||"",n=o.match(/"CurrentUser"[^}]*"Id"\s*:\s*"([0-9a-zA-Z]{15,18})"/);if(n)return n[1];const a=o.match(/setIsolation\s*\(\s*["']([^"']+)/);if(a){const r=a[1],i=r.indexOf("005",15);if(i!==-1){const l=r.substring(i);if(l.length>=15)return l.substring(0,15)}}}return null}catch{return null}}}class E{static buttonSelector='[data-sfd-request-response-button="true"]';buttonLabel;constructor(e="demander une réponse"){this.buttonLabel=e}attachToError(e,t){const o=this.findModal(e.type);if(!o||o.querySelector(E.buttonSelector))return!1;const n=this.resolveContainer(o,e.type),a=this.createButton(t);return n.appendChild(a),window.dispatchEvent(new CustomEvent("sfd-omniblue-action-available")),!0}createButton(e){const t=document.createElement("button");return t.type="button",t.className="slds-button slds-button_neutral slds-m-left_x-small",t.textContent=this.buttonLabel,t.setAttribute("data-sfd-request-response-button","true"),t.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),!t.disabled&&(t.disabled=!0,t.setAttribute("aria-busy","true"),e())}),t}findModal(e){if(e==="snag_modal"){const t=document.querySelector('[aria-label="We hit a snag."]')??document.querySelector(".forceFormPageError");if(t)return t;const n=Array.from(document.querySelectorAll("h2.slds-truncate")).find(a=>a.textContent?.trim()==="We hit a snag.");return n?n.closest(".slds-modal")??n.closest('[role="dialog"]')??n.closest(".forceFormPageError")??n.parentElement:null}return e==="warning_modal"?document.querySelector('.slds-popover_warning[aria-hidden="false"]')??document.querySelector(".slds-popover_warning.open"):e==="toast"?Array.from(document.querySelectorAll('.forceToastMessage[data-key="error"]')).find(o=>!o.querySelector(E.buttonSelector))??null:null}resolveContainer(e,t){return t==="snag_modal"?e.querySelector(".slds-modal__footer")??e.querySelector(".modal-footer")??e.querySelector("footer")??e:t==="warning_modal"?e.querySelector(".slds-popover__footer")??e.querySelector(".slds-popover__body")??e:t==="toast"?e.querySelector(".toastActions")??e.querySelector(".slds-notify__content")??e.querySelector(".toastContent")??e:e}}class xe{observer=null;subscribers=new Set;debounceTimeoutId=null;debounceMs;isStarted=!1;constructor(e={}){this.debounceMs=e.debounceMs??100}subscribe(e){return this.subscribers.add(e),this.subscribers.size===1&&!this.isStarted&&this.start(),()=>{this.subscribers.delete(e),this.subscribers.size===0&&this.isStarted&&this.stop()}}start(){if(this.isStarted||typeof document>"u")return;const e=()=>{this.debounceTimeoutId&&clearTimeout(this.debounceTimeoutId),this.debounceTimeoutId=setTimeout(()=>{this.notifySubscribers(),this.debounceTimeoutId=null},this.debounceMs)};this.observer=new MutationObserver(e),this.observer.observe(document.body,{childList:!0,subtree:!0,attributes:!1}),this.isStarted=!0}stop(){this.debounceTimeoutId&&(clearTimeout(this.debounceTimeoutId),this.debounceTimeoutId=null),this.observer&&(this.observer.disconnect(),this.observer=null),this.isStarted=!1}notifySubscribers(){for(const e of this.subscribers)try{e()}catch(t){console.error("[SharedDomObserver] Subscriber error:",t)}}isRunning(){return this.isStarted}getSubscriberCount(){return this.subscribers.size}}const F=new xe,_e={HTTP_REQUEST:"HTTP_REQUEST"},D=globalThis.browser?.runtime?.id?globalThis.browser:globalThis.chrome;class j extends Error{constructor(e,t,o,n){super(e),this.status=t,this.statusText=o,this.response=n,this.name="ApiClientError"}}class ye{baseUrl;timeout;headers;constructor(e){this.baseUrl=e.baseUrl.replace(/\/$/,""),this.timeout=e.timeout??1e4,this.headers=e.headers??{}}async post(e,t){return this.request("POST",e,t)}async get(e){return this.request("GET",e)}async put(e,t){return this.request("PUT",e,t)}async patch(e,t){return this.request("PATCH",e,t)}async delete(e){return this.request("DELETE",e)}async request(e,t,o){const n=`${this.baseUrl}${t}`,a=new Promise((l,d)=>{setTimeout(()=>{d(new j("Request timeout - backend may be unavailable",0,"Timeout"))},this.timeout+1e3)}),r=D.runtime.sendMessage({type:_e.HTTP_REQUEST,request:{url:n,method:e,headers:this.headers,body:o,timeout:this.timeout}}),i=await Promise.race([r,a]);if(!i)throw new j("No response from background script",0,"No Response");if(!i.success)throw new j(i.error,i.status,i.statusText);return{data:i.data,status:i.status,statusText:i.statusText}}}function Y(s){return new ye(s)}class we{constructor(e,t){this.client=e,this.basePath=`/api/v1/organizations/${t}/diagnostic_results`}basePath;async create(e){await this.client.post(this.basePath,e)}async show(e){return(await this.client.get(`${this.basePath}/${e}`)).data}async validate(e,t){return(await this.client.patch(`${this.basePath}/${e}`,t)).data}}class Se{constructor(e,t){this.client=e,this.basePath=`/api/v1/organizations/${t}/salesforce_errors`}basePath;async create(e){return(await this.client.post(this.basePath,e)).data}}class Ce{constructor(e,t,o){this.client=e,this.basePath=`/api/v1/organizations/${t}/users/${o}/conversations`}basePath;async create(e){return(await this.client.post(this.basePath,e)).data}async list(e={}){const t=[];e.sort&&t.push(`sort=${encodeURIComponent(e.sort)}`),e.page!==void 0&&t.push(`page=${e.page}`),e.per!==void 0&&t.push(`per=${e.per}`);const o=t.length>0?`?${t.join("&")}`:"";return(await this.client.get(`${this.basePath}${o}`)).data}messages(e){return new Ee(this.client,this.basePath,e)}}class Ee{constructor(e,t,o){this.client=e,this.basePath=`${t}/${o}/messages`}basePath;async list(e={}){const t=[];e.page!==void 0&&t.push(`page=${e.page}`),e.per!==void 0&&t.push(`per=${e.per}`);const o=t.length>0?`?${t.join("&")}`:"";return(await this.client.get(`${this.basePath}${o}`)).data}async create(e){return(await this.client.post(this.basePath,e)).data}}class Ie{constructor(e,t,o){this.client=e,this.salesforceErrors=new Se(e,t,o),this.conversations=new Ce(e,t,o)}salesforceErrors;conversations}class Ae{constructor(e,t){this.client=e,this.orgId=t,this.diagnosticResults=new we(e,t)}diagnosticResults;user(e){return new Ie(this.client,this.orgId,e)}}class Te{constructor(e){this.client=e}organization(e){return new Ae(this.client,e)}}const Re=5e3;class Le{constructor(e,t={}){this.api=e,this.enableConsoleLog=t.enableConsoleLog??!0,this.deduplicationTtl=t.deduplicationTtl??Re}enableConsoleLog;deduplicationTtl;reportedErrors=new Map;report(e){const t=this.getErrorFingerprint(e);if(this.wasRecentlyReported(t)){this.enableConsoleLog&&console.log("[Salesforce Error Detector] Skipping duplicate error report:",t);return}this.markAsReported(t);const o=this.transformError(e);this.enableConsoleLog&&console.log("[Salesforce Error Detector] Sending error to API:",o);const n=e.context.orgId??"unknown";this.api.organization(n).salesforceErrors.create(o).catch(a=>{console.error("[Salesforce Error Detector] Failed to send error to API:",a)})}getErrorFingerprint(e){const t=[e.type,e.context.orgId??"",e.context.userId??"",e.context.objectKind??"",e.context.objectId??""];return(e.type==="snag_modal"||e.type==="toast"||e.type==="warning_modal")&&t.push(e.title??"",e.message??""),t.join("|")}wasRecentlyReported(e){const t=this.reportedErrors.get(e);return t?Date.now()-t<this.deduplicationTtl:!1}markAsReported(e){const t=Date.now();this.reportedErrors.set(e,t),this.cleanupOldEntries(t)}cleanupOldEntries(e){for(const[t,o]of this.reportedErrors.entries())e-o>this.deduplicationTtl&&this.reportedErrors.delete(t)}transformError(e){const t={error_type:e.type,timestamp:e.timestamp.toISOString(),url:e.context.url,object_kind:e.context.objectKind,object_id:e.context.objectId,is_new_record:e.context.isNewRecord,salesforce_user_id:e.context.userId};return e.type==="snag_modal"?{...t,error:e.title,error_message:e.message,panel_content_message:e.panelContentMessage,duplicate_record_ids:e.duplicateRecordIds,fields_with_errors:e.fieldsWithErrors,field_error_details:e.fieldErrorDetails}:e.type==="toast"?{...t,error_title:e.title,error_message:e.message}:e.type==="warning_modal"?{...t,warning_title:e.title,warning_message:e.message}:t}}class qe{constructor(e,t){this.reporter=e,this.modalButtonService=t}report(e){this.modalButtonService.attachToError(e,()=>{window.dispatchEvent(new CustomEvent("sfd-omniblue-start-conversation",{detail:{message:"J'ai cette erreur qui s'est déclenché. Qu'est ce que je dois faire ?"}})),this.reporter.report(e)})}}const Me='[data-sfd-omniblue-style="true"]',$e=`
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
`;function Be(){if(document.querySelector(Me))return;const s=document.createElement("style");s.setAttribute("data-sfd-omniblue-style","true"),s.textContent=$e,document.head.appendChild(s)}const ze={close:"M32.6 10.4L26 17l-6.6-6.6a2 2 0 10-2.8 2.8L23.2 19.8l-6.6 6.6a2 2 0 102.8 2.8L26 22.6l6.6 6.6a2 2 0 102.8-2.8l-6.6-6.6 6.6-6.6a2 2 0 10-2.8-2.8z",compose:"M36.6 10.8l4.6 4.6a2 2 0 010 2.8L21 38.4l-9.4 2.6 2.6-9.4L33.8 10.8a2 2 0 012.8 0zM18.3 35.2l2.5-.7 16.3-16.3-1.8-1.8L19 32.7l-.7 2.5z"};function He(s){const e=globalThis.browser?.runtime??globalThis.chrome?.runtime;return e?.getURL?e.getURL(s):s}function Ne(s){const e=document.createElementNS("http://www.w3.org/2000/svg","svg");e.setAttribute("viewBox","0 0 52 52"),e.setAttribute("aria-hidden","true"),e.setAttribute("focusable","false"),e.classList.add("sfd-omniblue-icon");const t=document.createElementNS("http://www.w3.org/2000/svg","path");return t.setAttribute("d",ze[s]),e.appendChild(t),e}function X(s,e){const t=document.createElement("img");return t.src=He(s),t.alt=e,t.className="sfd-omniblue-icon-image",t}function I(s){switch(s){case"default":return X("omniblue_icon.png","Omniblue");case"active":return X("omniblue_icon_active.png","Omniblue active");case"close":case"compose":return Ne(s)}}function A(s,e){const t=s.querySelector("svg, img"),o=I(e);t?t.replaceWith(o):s.appendChild(o)}function Pe(){const s=document.createElement("div");s.className="sfd-omniblue-thread";let e=null;const t=new Intl.DateTimeFormat(void 0,{hour:"2-digit",minute:"2-digit"});return{appendMessage(o,n,a=new Date){const r=document.createElement("div");r.className="sfd-omniblue-message-item";const i=document.createElement("div");i.className="sfd-omniblue-message",n==="agent"||n==="welcome"?(i.classList.add("sfd-omniblue-message-agent"),r.classList.add("sfd-omniblue-message-item-agent")):n==="error"&&(i.classList.add("sfd-omniblue-message-error"),r.classList.add("sfd-omniblue-message-item-error"));const l=document.createElement("div");l.className="sfd-omniblue-message-content",l.textContent=o,i.appendChild(l);const d=document.createElement("div");d.className="sfd-omniblue-message-time",d.textContent=t.format(a),r.appendChild(i),r.appendChild(d),s.appendChild(r),s.scrollTop=s.scrollHeight,e=n},showTypingIndicator(){const o=s.querySelector(".sfd-omniblue-typing");o&&o.remove();const n=document.createElement("div");n.className="sfd-omniblue-typing";for(let a=0;a<3;a+=1){const r=document.createElement("span");r.className="sfd-omniblue-typing-dot",n.appendChild(r)}s.appendChild(n),s.scrollTop=s.scrollHeight},removeTypingIndicator(){const o=s.querySelector(".sfd-omniblue-typing");o&&o.remove()},clear(){s.innerHTML="",e=null},getElement(){return s},getLastMessageRole(){return e},isTypingIndicatorVisible(){return s.querySelector(".sfd-omniblue-typing")!==null}}}function Fe(){const s=document.createElement("div");s.className="sfd-omniblue-typing";for(let e=0;e<3;e+=1){const t=document.createElement("span");t.className="sfd-omniblue-typing-dot",s.appendChild(t)}return s}function De(){const s=document.createElement("div");s.className="sfd-omniblue-conversation-list";let e=new Map,t=null;const o=n=>{const r=n.target.closest(".sfd-omniblue-conversation-item");if(!r||!t)return;const i=r.getAttribute("data-conversation-id");if(i){const l=e.get(i);l&&t(l)}};return s.addEventListener("click",o),{renderList(n,a){s.innerHTML="",e.clear(),t=a;for(const r of n){e.set(String(r.id),r);const i=je(r);s.appendChild(i)}},renderLoading(){s.innerHTML="",e.clear(),t=null;const n=document.createElement("div");n.className="sfd-omniblue-loading",n.appendChild(Fe()),s.appendChild(n)},renderEmpty(n){s.innerHTML="",e.clear(),t=null;const a=document.createElement("div");a.className="sfd-omniblue-empty-state",a.textContent=n,s.appendChild(a)},getElement(){return s},cleanup(){s.removeEventListener("click",o),e.clear(),t=null}}}function je(s){const e=document.createElement("div");e.className="sfd-omniblue-conversation-item",e.setAttribute("data-conversation-id",String(s.id));const t=document.createElement("div");t.className="sfd-omniblue-conversation-title",t.textContent=s.title??"Sans titre";const o=document.createElement("div");return o.className="sfd-omniblue-conversation-meta",o.textContent=Ue(s.updatedAt??s.createdAt),e.appendChild(t),e.appendChild(o),e}function Ue(s){const t=new Date().getTime()-s.getTime(),o=Math.floor(t/6e4),n=Math.floor(t/36e5),a=Math.floor(t/864e5);return o<1?"À l'instant":o<60?`Il y a ${o} min`:n<24?`Il y a ${n}h`:a<7?`Il y a ${a}j`:s.toLocaleDateString("fr-FR",{day:"numeric",month:"short"})}function Oe(s){const{container:e,cleanup:t}=Ve(),o=e.querySelector('[data-sfd-omniblue-trigger="true"]'),n=De(),a=Pe(),{menu:r,mainView:i,composeView:l,messageInput:d,sendButton:u,composeFooter:m,cleanup:h}=Ke({conversationListElement:n.getElement(),messageThreadElement:a.getElement(),onComposeClick:s.onComposeClick,onBackClick:s.onBackClick,onSendClick:s.onSendClick});return document.body.appendChild(r),{container:e,triggerButton:o,menu:r,mainView:i,composeView:l,conversationList:n,messageThread:a,messageInput:d,sendButton:u,composeFooter:m,cleanup:()=>{t(),h(),n.cleanup(),r.remove()}}}function Ve(s){const e=document.createElement("li");e.className="slds-global-actions__item slds-dropdown-trigger slds-dropdown-trigger_click",e.setAttribute("data-sfd-omniblue-container","true");const t=document.createElement("button");t.type="button",t.className="slds-button slds-button_icon slds-button_icon-container slds-button_icon-small slds-global-actions__item-action",t.setAttribute("aria-haspopup","true"),t.setAttribute("aria-expanded","false"),t.setAttribute("data-sfd-omniblue-trigger","true"),t.appendChild(I("default"));const o=a=>{a.preventDefault(),a.stopPropagation()};return t.addEventListener("click",o),e.appendChild(t),{container:e,cleanup:()=>{t.removeEventListener("click",o)}}}function Ke(s){const e=document.createElement("div");e.className="sfd-omniblue-menu",e.setAttribute("data-sfd-omniblue-menu","true"),e.setAttribute("role","menu"),e.hidden=!0;const{mainView:t,cleanup:o}=We(s.conversationListElement,s.onComposeClick),{composeView:n,messageInput:a,sendButton:r,composeFooter:i,cleanup:l}=Qe(s.messageThreadElement,s.onBackClick,s.onSendClick);return e.appendChild(t),e.appendChild(n),{menu:e,mainView:t,composeView:n,messageInput:a,sendButton:r,composeFooter:i,cleanup:()=>{o(),l()}}}function We(s,e){const t=document.createElement("div");t.className="sfd-omniblue-view sfd-omniblue-view-main";const o=document.createElement("div");o.className="sfd-omniblue-header",o.textContent="Agent Omniblue";const n=document.createElement("div");n.className="sfd-omniblue-footer";const a=document.createElement("button");return a.type="button",a.className="sfd-omniblue-compose",a.setAttribute("aria-label","New message"),a.appendChild(I("compose")),a.addEventListener("click",e),n.appendChild(a),t.appendChild(o),t.appendChild(s),t.appendChild(n),{mainView:t,cleanup:()=>{a.removeEventListener("click",e)}}}function Qe(s,e,t){const o=document.createElement("div");o.className="sfd-omniblue-view sfd-omniblue-view-compose",o.hidden=!0;const n=document.createElement("div");n.className="sfd-omniblue-compose-header";const a=document.createElement("button");a.type="button",a.className="sfd-omniblue-back",a.setAttribute("aria-label","Fermer"),a.appendChild(I("close")),a.addEventListener("click",e);const r=document.createElement("div");r.className="sfd-omniblue-compose-title",r.textContent="Agent Omniblue",n.appendChild(r),n.appendChild(a);const i=document.createElement("textarea");i.className="sfd-omniblue-input",i.rows=3,i.placeholder="Votre message...";const l=document.createElement("div");l.className="sfd-omniblue-compose-footer";const d=document.createElement("button");d.type="button",d.className="sfd-omniblue-send",d.textContent="Envoyer";const u=()=>{const h=i.value.trim();h&&t(h)};return d.addEventListener("click",u),l.appendChild(d),o.appendChild(n),o.appendChild(s),o.appendChild(i),o.appendChild(l),{composeView:o,messageInput:i,sendButton:d,composeFooter:l,cleanup:()=>{a.removeEventListener("click",e),d.removeEventListener("click",u)}}}function Ge(s,e){const t=()=>{const o=s.triggerButton.getBoundingClientRect(),n=o.bottom+8,a=Math.max(12,o.right-s.menu.offsetWidth);s.menu.style.top=`${n}px`,s.menu.style.left=`${a}px`,s.menu.style.right="auto"};return{isOpen(){return!s.menu.hidden},open(){s.menu.hidden=!1,s.triggerButton.setAttribute("aria-expanded","true"),A(s.triggerButton,"active"),s.container.classList.add("sfd-omniblue-open"),t()},close(){s.menu.hidden=!0,s.triggerButton.setAttribute("aria-expanded","false"),A(s.triggerButton,"default"),s.container.classList.remove("sfd-omniblue-open")},toggle(){s.menu.hidden?this.open():this.close()}}}function Ye(s,e){const t=()=>{const{messageInput:o,sendButton:n,composeFooter:a,composeView:r}=s;o.isConnected||(o.value="",r.insertBefore(o,a)),n.isConnected||a.appendChild(n)};return{showMainView(){s.composeView.hidden=!0,s.mainView.hidden=!1},showComposeView(){s.mainView.hidden=!0,s.composeView.hidden=!1},resetComposeView(o){s.messageThread.clear(),t(),o?.skipWelcomeMessages||e?.()}}}function Xe(s,e,t){let o=null;return{getCurrentConversationId(){return o},resetConversation(){o=null},invalidateConversationListCache(){},async sendMessage(n){e.removeTypingIndicator(),e.appendMessage("Le service de conversation n'est pas disponible pour le moment.","error",new Date)},async loadConversationList(n){t.renderEmpty("Aucune conversation")},async loadConversationMessages(n){return o=n,e.removeTypingIndicator(),e.appendMessage("Le chargement des messages n'est pas disponible pour le moment.","error",new Date),{lastMessageRole:"error"}}}}function Ze(s,e){let t;const o=n=>new Promise(a=>setTimeout(a,n));return{animateIconPulse(n,a){a.getAttribute("aria-expanded")!=="true"&&(n.classList.remove("sfd-omniblue-flip"),n.offsetHeight,n.classList.add("sfd-omniblue-flip"),A(a,"active"),t&&window.clearTimeout(t),t=window.setTimeout(()=>{A(a,"default")},2e3))},async displayWelcomeMessages(){const n=s.execute(),a=800,r=400;for(const i of n)e.showTypingIndicator(),await o(a),e.removeTypingIndicator(),await o(r),e.appendMessage(i.content,i.role,new Date)},cleanup(){t&&(window.clearTimeout(t),t=void 0)}}}const U='[data-sfd-omniblue-container="true"]';function Je(){return{isInjected(){return document.querySelector(U)!==null},inject(s){if(this.isInjected())return!1;const e=document.querySelector("header#oneHeader");if(!e)return!1;const t=e.querySelector("ul.slds-global-actions");if(!t)return!1;const n=t.querySelector("span.userProfileCardTriggerRoot, button.branding-userProfile-button")?.closest("li");return n?(t.insertBefore(s,n),!0):!1}}}class et{constructor(e){this.deps=e,this.headerInjector=Je()}unsubscribeFromDomObserver;elements;menuState;viewNavigation;conversation;animation;headerInjector;start(){Be(),this.ensureButton(),this.unsubscribeFromDomObserver=F.subscribe(()=>this.ensureButton()),document.addEventListener("click",this.handleDocumentClick,!0),window.addEventListener("sfd-omniblue-action-available",this.handleActionAvailable),window.addEventListener("sfd-omniblue-start-conversation",this.handleStartConversation)}stop(){this.unsubscribeFromDomObserver?.(),document.removeEventListener("click",this.handleDocumentClick,!0),window.removeEventListener("sfd-omniblue-action-available",this.handleActionAvailable),window.removeEventListener("sfd-omniblue-start-conversation",this.handleStartConversation),this.animation?.cleanup(),this.elements?.cleanup()}ensureButton(){this.headerInjector.isInjected()||(this.elements=Oe({onComposeClick:()=>this.handleComposeClick(),onBackClick:()=>this.viewNavigation?.showMainView(),onSendClick:e=>this.handleSendMessage(e)}),this.headerInjector.inject(this.elements.container)&&this.initializeHandlers())}initializeHandlers(){this.elements&&(this.animation=Ze(this.deps.getWelcomeMessages,this.elements.messageThread),this.conversation=Xe({getContext:this.deps.getContext},this.elements.messageThread,this.elements.conversationList),this.viewNavigation=Ye(this.elements,()=>{this.conversation?.resetConversation(),this.animation?.displayWelcomeMessages().then(()=>{this.updateSendButtonState()})}),this.menuState=Ge(this.elements))}handleDocumentClick=e=>{const t=document.querySelector(U);!t||!this.elements||!t.contains(e.target)&&!this.elements.menu.contains(e.target)&&this.menuState?.close()};handleActionAvailable=()=>{const e=document.querySelector(U);!e||!this.elements||(e.classList.remove("sfd-omniblue-pulse"),e.offsetHeight,e.classList.add("sfd-omniblue-pulse"),this.animation?.animateIconPulse(e,this.elements.triggerButton))};handleStartConversation=e=>{};handleComposeClick(){this.viewNavigation?.showComposeView(),this.viewNavigation?.resetComposeView(),this.elements?.messageInput.focus()}async handleSendMessage(e){if(!this.elements||!this.conversation)return;const{messageThread:t,messageInput:o,sendButton:n}=this.elements;t.appendMessage(e,"user",new Date),o.value="",n.disabled=!0,this.updateSendButtonState(),await this.conversation.sendMessage(e),this.updateSendButtonState()}updateSendButtonState(){if(!this.elements)return;const{messageThread:e,sendButton:t}=this.elements,o=e.getLastMessageRole(),n=e.isTypingIndicatorVisible(),a=o==="user"||n;t.disabled=a,o==="user"&&!n?e.showTypingIndicator():o!=="user"&&n&&e.removeTypingIndicator()}async openConversation(e){if(!this.elements||!this.conversation||!this.viewNavigation)return;this.viewNavigation.showComposeView(),this.elements.messageThread.clear();const{messageInput:t,sendButton:o,composeFooter:n,composeView:a}=this.elements;t.isConnected||(t.value="",a.insertBefore(t,n)),o.isConnected||n.appendChild(o),o.disabled=!0,await this.conversation.loadConversationMessages(e.id),this.updateSendButtonState()}}const tt=`
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

  /* Validation Wizard Styles */
  .sfd-kb-validation-wizard {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .sfd-kb-validation-progress {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
    padding: 16px 0;
  }

  .sfd-kb-validation-progress__step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    position: relative;
  }

  .sfd-kb-validation-progress__number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    font-size: 14px;
    font-weight: 600;
    color: #9ca3af;
    background: #f3f4f6;
    border: 2px solid #e5e7eb;
    border-radius: 50%;
    transition: all 0.3s ease;
  }

  .sfd-kb-validation-progress__label {
    font-size: 12px;
    font-weight: 500;
    color: #9ca3af;
    transition: color 0.3s ease;
  }

  .sfd-kb-validation-progress__step--active .sfd-kb-validation-progress__number {
    color: #ffffff;
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    border-color: #6366f1;
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);
  }

  .sfd-kb-validation-progress__step--active .sfd-kb-validation-progress__label {
    color: #4f46e5;
    font-weight: 600;
  }

  .sfd-kb-validation-progress__step--completed .sfd-kb-validation-progress__number {
    color: #ffffff;
    background: #10b981;
    border-color: #10b981;
  }

  .sfd-kb-validation-progress__step--completed .sfd-kb-validation-progress__label {
    color: #10b981;
  }

  .sfd-kb-validation-progress__line {
    width: 60px;
    height: 3px;
    background: #e5e7eb;
    margin: 0 8px;
    margin-bottom: 22px;
    border-radius: 2px;
    transition: background 0.3s ease;
  }

  .sfd-kb-validation-progress__line--completed {
    background: #10b981;
  }

  .sfd-kb-validation-step {
    display: flex;
    flex-direction: column;
    gap: 16px;
    animation: sfd-kb-fade-in 0.3s ease;
  }

  @keyframes sfd-kb-fade-in {
    from {
      opacity: 0;
      transform: translateX(10px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .sfd-kb-validation-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-top: 8px;
  }

  .sfd-kb-validation-nav-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .sfd-kb-validation-nav-btn--back {
    color: #6b7280;
    background: #f3f4f6;
    border: 1px solid #e5e7eb;
  }

  .sfd-kb-validation-nav-btn--back:hover {
    background: #e5e7eb;
    color: #374151;
  }

  .sfd-kb-validation-nav-btn--next {
    color: #ffffff;
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    border: none;
  }

  .sfd-kb-validation-nav-btn--next:hover {
    background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
  }

  .sfd-kb-validation-nav-btn--next:disabled,
  .sfd-kb-validation-nav-btn--next:disabled:hover {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
  }

  /* Feedback Form Styles */
  .sfd-kb-feedback-section-title {
    margin: 0 0 16px 0;
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
  }

  .sfd-kb-feedback-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .sfd-kb-feedback-field__label {
    font-size: 14px;
    font-weight: 500;
    color: #374151;
  }

  .sfd-kb-feedback-field__required {
    color: #ef4444;
  }

  /* Radio buttons */
  .sfd-kb-feedback-radio-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .sfd-kb-feedback-radio {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .sfd-kb-feedback-radio:hover {
    border-color: #6366f1;
    background: #f5f3ff;
  }

  .sfd-kb-feedback-radio input[type="radio"] {
    display: none;
  }

  .sfd-kb-feedback-radio__checkmark {
    width: 20px;
    height: 20px;
    border: 2px solid #d1d5db;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .sfd-kb-feedback-radio__checkmark::after {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: transparent;
    transition: all 0.2s ease;
  }

  .sfd-kb-feedback-radio input[type="radio"]:checked + .sfd-kb-feedback-radio__checkmark {
    border-color: #6366f1;
  }

  .sfd-kb-feedback-radio input[type="radio"]:checked + .sfd-kb-feedback-radio__checkmark::after {
    background: #6366f1;
  }

  .sfd-kb-feedback-radio__label {
    font-size: 14px;
    color: #374151;
  }

  /* Checkboxes */
  .sfd-kb-feedback-checkbox {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .sfd-kb-feedback-checkbox:hover {
    border-color: #6366f1;
    background: #f5f3ff;
  }

  .sfd-kb-feedback-checkbox input[type="checkbox"] {
    display: none;
  }

  .sfd-kb-feedback-checkbox__checkmark {
    width: 20px;
    height: 20px;
    border: 2px solid #d1d5db;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .sfd-kb-feedback-checkbox__checkmark::after {
    content: '';
    width: 10px;
    height: 10px;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E") no-repeat center center;
    background-size: contain;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .sfd-kb-feedback-checkbox input[type="checkbox"]:checked + .sfd-kb-feedback-checkbox__checkmark {
    background: #6366f1;
    border-color: #6366f1;
  }

  .sfd-kb-feedback-checkbox input[type="checkbox"]:checked + .sfd-kb-feedback-checkbox__checkmark::after {
    opacity: 1;
  }

  .sfd-kb-feedback-checkbox__label {
    font-size: 14px;
    color: #374151;
  }

  /* Input fields */
  .sfd-kb-feedback-input {
    width: 100%;
    padding: 10px 14px;
    font-size: 14px;
    font-family: inherit;
    color: #1f2937;
    background: #ffffff;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    box-sizing: border-box;
  }

  .sfd-kb-feedback-input:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  .sfd-kb-feedback-input::placeholder {
    color: #9ca3af;
  }

  /* Select dropdowns */
  .sfd-kb-feedback-select {
    width: 100%;
    padding: 10px 14px;
    font-size: 14px;
    font-family: inherit;
    color: #1f2937;
    background: #ffffff;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    cursor: pointer;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    box-sizing: border-box;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 16px;
    padding-right: 40px;
  }

  .sfd-kb-feedback-select:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  /* Feedback display sections */
  .sfd-kb-feedback-display-section {
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid #e5e7eb;
  }

  .sfd-kb-feedback-display-section:last-of-type {
    border-bottom: none;
    margin-bottom: 12px;
    padding-bottom: 0;
  }

  .sfd-kb-feedback-display-section__title {
    margin: 0 0 12px 0;
    font-size: 14px;
    font-weight: 600;
    color: #4f46e5;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* Feedback separator */
  .sfd-kb-feedback-separator {
    height: 1px;
    background: linear-gradient(90deg, transparent, #e5e7eb 20%, #e5e7eb 80%, transparent);
    margin: 8px 0;
  }

  /* Toast notification */
  .sfd-kb-toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 20px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
    font-size: 14px;
    font-weight: 500;
    z-index: 10001;
    animation: sfd-kb-toast-slide-in 0.3s ease;
  }

  .sfd-kb-toast--hiding {
    animation: sfd-kb-toast-slide-out 0.3s ease forwards;
  }

  .sfd-kb-toast__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
  }

  .sfd-kb-toast__icon svg {
    width: 14px;
    height: 14px;
  }

  @keyframes sfd-kb-toast-slide-in {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes sfd-kb-toast-slide-out {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100%);
    }
  }
`;let Z=!1;function st(){if(Z)return;const s=document.createElement("style");s.setAttribute("data-sfd-kb-solve-styles","true"),s.textContent=tt,document.head.appendChild(s),Z=!0}const J=`
<svg class="sfd-kb-solve-button__icon" viewBox="0 0 520 520" xmlns="http://www.w3.org/2000/svg">
  <path d="M260 20c-88 0-160 72-160 160 0 52 25 98 64 128v52c0 17 14 31 32 31h128c18 0 32-14 32-31v-52c39-30 64-76 64-128 0-88-72-160-160-160zm64 340H196v-20h128v20zm0-60H196v-20h128v20zm-64 140c-18 0-32-14-32-32h64c0 18-14 32-32 32z"/>
</svg>`,ot=`
<svg class="sfd-kb-view-result-button__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
  <circle cx="12" cy="12" r="3"></circle>
</svg>`;function ee(s){const e=document.createElement("div");e.setAttribute("data-sfd-kb-solve-container","true"),e.style.display="inline-flex",e.style.alignItems="center";const t=document.createElement("button");t.setAttribute("data-sfd-kb-solve-button","true"),t.className="sfd-kb-solve-button",t.type="button",t.innerHTML=`${J}<span>Résoudre avec Omniblue</span>`,t.title="Utiliser Omniblue pour résoudre cette demande interne";const o=i=>{i.preventDefault(),i.stopPropagation(),s.onClick()};t.addEventListener("click",o);const n=document.createElement("button");n.setAttribute("data-sfd-kb-view-result-button","true"),n.className="sfd-kb-view-result-button",n.type="button",n.innerHTML=`${ot}<span>Dernière réponse de Omniblue</span>`,n.title="Voir la dernière réponse de Omniblue",n.disabled=!0;const a=i=>{i.preventDefault(),i.stopPropagation(),s.onViewResult()};return n.addEventListener("click",a),e.appendChild(t),e.appendChild(n),{button:t,viewResultButton:n,container:e,cleanup:()=>{t.removeEventListener("click",o),n.removeEventListener("click",a)}}}function nt(s,e){s.classList.add("sfd-kb-solve-button--loading"),s.disabled=!0,s.innerHTML='<span class="sfd-kb-solve-button__spinner"></span><span>Processing...</span>'}function at(s){s.classList.remove("sfd-kb-solve-button--error"),s.classList.remove("sfd-kb-solve-button--loading"),s.classList.add("sfd-kb-solve-button--success"),s.innerHTML="<span>Done!</span>",s.disabled=!0}function te(s,e){s.classList.remove("sfd-kb-solve-button--success"),s.classList.add("sfd-kb-solve-button--error"),s.innerHTML=`<span>${e||"Error"}</span>`,s.disabled=!1,setTimeout(()=>{s.classList.remove("sfd-kb-solve-button--error"),s.innerHTML=`${J}<span>Résoudre avec Omniblue</span>`},3e3)}function se(s,e){s.disabled=!1}const oe='[data-sfd-kb-header-wrapper="true"]',it="div.slds-global-header__item.slds-global-header__item_search";function rt(){return{isInjected(){return document.querySelector(oe)!==null},removeWrapper(){const s=document.querySelector(oe);s&&s.remove()},inject(s){if(this.isInjected())return!1;const e=document.querySelector(it);if(!e)return console.log("[KbSolveButton] Global header search container not found, cannot inject"),!1;const t=document.createElement("div");return t.setAttribute("data-sfd-kb-header-wrapper","true"),t.className="slds-global-header__item",t.style.cssText=`
        display: flex;
        align-items: center;
        gap: 8px;
        margin-left: 12px;
      `,t.appendChild(s),e.insertAdjacentElement("afterend",t),console.log("[KbSolveButton] Injected into global header after search"),!0}}}const lt=`
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <line x1="18" y1="6" x2="6" y2="18"></line>
  <line x1="6" y1="6" x2="18" y2="18"></line>
</svg>`,ne=`
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="20 6 9 17 4 12"></polyline>
</svg>`,ae=`
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <line x1="18" y1="6" x2="6" y2="18"></line>
  <line x1="6" y1="6" x2="18" y2="18"></line>
</svg>`;function p(s){const e=document.createElement("div");return e.textContent=s,e.innerHTML}function dt(s){switch(s?.toLowerCase()){case"high":return{label:"Haute",color:"#2e844a"};case"medium":return{label:"Moyenne",color:"#ff9f1a"};case"low":return{label:"Basse",color:"#ba0517"};default:return{label:s||"N/A",color:"#706e6b"}}}function ct(s){if(!s||Object.keys(s).length===0)return'<p class="sfd-kb-result-empty">Non spécifié</p>';const e=s.user_name||s.userName||s.name,t=s.reason||"",o=s.user_can_solve||s.userCanSolve||s.user_can_fix||s.userCanFix,n=s.team,a='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';if(e)return`
      <div class="sfd-kb-result-who-can-help">
        <div class="sfd-kb-result-who-can-help__item">
          <div class="sfd-kb-result-who-can-help__icon">${a}</div>
          <div class="sfd-kb-result-who-can-help__content">
            <div class="sfd-kb-result-who-can-help__name">${p(String(e))}</div>
            ${t?`<div class="sfd-kb-result-who-can-help__reason">${p(String(t))}</div>`:""}
            ${o?'<div class="sfd-kb-result-who-can-help__badge">✓ Peut résoudre</div>':""}
          </div>
        </div>
      </div>
    `;if(n)return`
      <div class="sfd-kb-result-who-can-help">
        <div class="sfd-kb-result-who-can-help__item">
          <div class="sfd-kb-result-who-can-help__icon">${a}</div>
          <div class="sfd-kb-result-who-can-help__content">
            <div class="sfd-kb-result-who-can-help__name">Équipe: ${p(String(n))}</div>
            ${t?`<div class="sfd-kb-result-who-can-help__reason">${p(String(t))}</div>`:""}
          </div>
        </div>
      </div>
    `;const r=[];for(const[i,l]of Object.entries(s))(typeof l=="string"||typeof l=="boolean")&&r.push(`${p(i)}: ${p(String(l))}`);return`<p class="sfd-kb-result-section__text">${r.join("<br>")}</p>`}const ut='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';function ie(){const s=document.createElement("div");s.className="sfd-kb-result-overlay",s.setAttribute("data-sfd-kb-result-overlay","true");const e=document.createElement("div");e.className="sfd-kb-result-modal";const t=document.createElement("div");t.className="sfd-kb-result-modal__header",t.innerHTML=`
    <h2 class="sfd-kb-result-modal__title">Résultat Omniblue</h2>
  `;const o=document.createElement("button");o.className="sfd-kb-result-modal__close",o.type="button",o.title="Fermer",o.innerHTML=lt,t.appendChild(o);const n=document.createElement("div");n.className="sfd-kb-result-modal__body";const a=document.createElement("div");a.className="sfd-kb-result-modal__content",a.innerHTML='<div class="sfd-kb-result-modal__loading">Chargement...</div>';const r=document.createElement("div");r.className="sfd-kb-result-modal__sidebar",r.innerHTML=`
    <div class="sfd-kb-result-modal__sidebar-content">
      <div class="sfd-kb-result-modal__sidebar-header">
        <div class="sfd-kb-result-modal__sidebar-icon">${ut}</div>
        <h3 class="sfd-kb-result-modal__sidebar-title">Votre feedback</h3>
      </div>
      <div class="sfd-kb-result-modal__sidebar-body"></div>
    </div>
  `;const i=document.createElement("div");i.className="sfd-kb-result-modal__footer",n.appendChild(a),n.appendChild(r),e.appendChild(t),e.appendChild(n),e.appendChild(i),s.appendChild(e);const l=g=>{g.target===s&&s.classList.remove("sfd-kb-result-overlay--visible")},d=()=>{s.classList.remove("sfd-kb-result-overlay--visible")},u=g=>{g.key==="Escape"&&s.classList.contains("sfd-kb-result-overlay--visible")&&s.classList.remove("sfd-kb-result-overlay--visible")};s.addEventListener("click",l),o.addEventListener("click",d),document.addEventListener("keydown",u);const m=()=>{s.removeEventListener("click",l),o.removeEventListener("click",d),document.removeEventListener("keydown",u)};let h=null,b=null;const w=g=>{h=g},C=g=>{b=g};return s._getFeedbackHandler=()=>h,s._getValidationHandler=()=>b,{overlay:s,modal:e,closeButton:o,content:a,sidebar:r,footer:i,cleanup:m,setFeedbackHandler:w,setValidationHandler:C}}function ft(s){s.classList.add("sfd-kb-result-overlay--visible")}function pt(s){s.innerHTML=`
    <div class="sfd-kb-result-modal__loading">
      <div class="sfd-kb-result-modal__spinner"></div>
      <p>Analyse en cours...</p>
    </div>
  `}function bt(s){const e=document.querySelector(".sfd-kb-toast");e&&e.remove();const t=document.createElement("div");t.className="sfd-kb-toast",t.innerHTML=`
    <span class="sfd-kb-toast__icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </span>
    <span>${p(s)}</span>
  `,document.body.appendChild(t),setTimeout(()=>{t.classList.add("sfd-kb-toast--hiding"),setTimeout(()=>{t.remove()},300)},3e3)}function gt(s){const e=[{key:"confidence",label:"Confiance",icon:"📊"},{key:"hypothesis",label:"Hypothèse",icon:"💡"},{key:"next_action",label:"Prochaine action",icon:"➡️"},{key:"what_i_know",label:"Ce que je sais",icon:"📝"},{key:"evidence_for",label:"Preuves pour",icon:"✅"},{key:"why_this_action",label:"Pourquoi cette action",icon:"🎯"},{key:"evidence_against",label:"Preuves contre",icon:"❌"}];let t='<div class="sfd-kb-args-think">';for(const o of e){const n=s[o.key];if(n!=null&&n!==""){const a=o.key==="confidence"?` sfd-kb-args-field--${String(n).toLowerCase()}`:"";t+=`
        <div class="sfd-kb-args-field${a}">
          <div class="sfd-kb-args-field__header">
            <span class="sfd-kb-args-field__icon">${o.icon}</span>
            <span class="sfd-kb-args-field__label">${o.label}</span>
            ${o.key==="confidence"?`<span class="sfd-kb-args-confidence-badge">${p(String(n))}</span>`:""}
          </div>
          ${o.key!=="confidence"?`<div class="sfd-kb-args-field__value">${p(String(n))}</div>`:""}
        </div>
      `}}return t+="</div>",t}function mt(s){const e=Object.entries(s);if(e.length===0)return'<p class="sfd-kb-result-empty">Aucun argument</p>';let t='<div class="sfd-kb-args-generic">';for(const[o,n]of e){const a=o.replace(/_/g," ").replace(/\b\w/g,l=>l.toUpperCase());let r;typeof n=="object"&&n!==null?r=JSON.stringify(n,null,2):r=String(n);let i="📋";(o.includes("type")||o.includes("object"))&&(i="🔷"),(o.includes("query")||o.includes("soql"))&&(i="🔍"),o.includes("field")&&(i="📝"),o.includes("id")&&(i="🔑"),o.includes("name")&&(i="🏷️"),o.includes("filter")&&(i="🔎"),t+=`
      <div class="sfd-kb-args-item">
        <div class="sfd-kb-args-item__key">
          <span class="sfd-kb-args-item__icon">${i}</span>
          ${p(a)}
        </div>
        <div class="sfd-kb-args-item__value">${p(r)}</div>
      </div>
    `}return t+="</div>",t}function ht(s){const e=s.success?"✓":"✗",t=s.success?"success":"error";let o;return s.tool==="think"&&s.arguments?o=gt(s.arguments):s.arguments&&Object.keys(s.arguments).length>0?o=mt(s.arguments):o='<p class="sfd-kb-result-empty">Aucun argument</p>',`
    <div class="sfd-kb-result-query-item sfd-kb-result-query-item--${t}">
      <div class="sfd-kb-result-query-header">
        <span class="sfd-kb-result-query-status">${e}</span>
        <span class="sfd-kb-result-query-tool">${p(s.tool)}</span>
        <span class="sfd-kb-result-query-duration">${s.duration_ms}ms</span>
      </div>
      <div class="sfd-kb-result-query-args">${o}</div>
    </div>
  `}function O(s,e,t){const o=dt(e.confidence),n=e.solved?ne:ae,a=e.solved?"sfd-kb-result-badge--success":"sfd-kb-result-badge--error",r=e.solved?"Résolu":"Non résolu",i=e.resolutionSteps?.length?`<ol class="sfd-kb-result-steps">${e.resolutionSteps.map(g=>`<li>${p(g)}</li>`).join("")}</ol>`:'<p class="sfd-kb-result-empty">Aucune étape disponible</p>',l=e.toolsUsed?.length?`<div class="sfd-kb-result-tags">${e.toolsUsed.map(g=>`<span class="sfd-kb-result-tag">${p(g)}</span>`).join("")}</div>`:'<p class="sfd-kb-result-empty">Aucun outil utilisé</p>',d=e.soqlQueries?.length?`<div class="sfd-kb-result-queries">${e.soqlQueries.map(g=>ht(g)).join("")}</div>`:'<p class="sfd-kb-result-empty">Aucune action technique</p>',u=e.iterationsCount!=null?`<span class="sfd-kb-result-iterations">${e.iterationsCount}</span>`:"N/A",m='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>',h='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',b='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>',w='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>';if(de(e,'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>'),s.innerHTML=`
    <div class="sfd-kb-result-section sfd-kb-result-section--status">
      <div class="sfd-kb-result-status-row">
        <div class="sfd-kb-result-badge ${a}">
          <span class="sfd-kb-result-badge__icon">${n}</span>
          <span>${r}</span>
        </div>
        <div class="sfd-kb-result-confidence" style="--confidence-color: ${o.color}">
          <span class="sfd-kb-result-confidence__label">Confiance:</span>
          <span class="sfd-kb-result-confidence__value">${o.label}</span>
        </div>
        <div class="sfd-kb-result-iterations-container">
          <span class="sfd-kb-result-iterations__label">Itérations:</span>
          ${u}
        </div>
      </div>
    </div>

    <div class="sfd-kb-result-section sfd-kb-result-section--highlight">
      <h3 class="sfd-kb-result-section__title">
        <span class="sfd-kb-result-section__title-icon">${m}</span>
        Résumé du problème
      </h3>
      <p class="sfd-kb-result-section__text">${p(e.problemSummary||"Non disponible")}</p>
    </div>

    <div class="sfd-kb-result-section sfd-kb-result-section--warning">
      <h3 class="sfd-kb-result-section__title">
        <span class="sfd-kb-result-section__title-icon" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);">${h}</span>
        Cause principale
      </h3>
      <p class="sfd-kb-result-section__text">${p(e.rootCause||"Non disponible")}</p>
    </div>

    <div class="sfd-kb-result-section">
      <h3 class="sfd-kb-result-section__title">
        <span class="sfd-kb-result-section__title-icon" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">${b}</span>
        Étapes de résolution
      </h3>
      ${i}
    </div>

    <div class="sfd-kb-result-section">
      <h3 class="sfd-kb-result-section__title">
        <span class="sfd-kb-result-section__title-icon" style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);">${w}</span>
        Qui peut aider
      </h3>
      ${ct(e.whoCanHelp)}
    </div>

    <div class="sfd-kb-result-section sfd-kb-result-section--technical">
      <h3 class="sfd-kb-result-section__title">Outils utilisés</h3>
      ${l}
    </div>

    <div class="sfd-kb-result-section sfd-kb-result-section--technical">
      <h3 class="sfd-kb-result-section__title">Détails techniques (${e.soqlQueries?.length||0} actions)</h3>
      ${d}
    </div>
  `,t){const g=t.querySelector(".sfd-kb-result-modal__sidebar-body");g&&(g.innerHTML=re(e),V(t))}}function re(s){return s.diagnosticFeedback!==null&&s.diagnosticFeedback?le(s.diagnosticFeedback):`
    <div class="sfd-kb-validation-wizard" data-sfd-feedback-form="true">
      <!-- Progress bar -->
      <div class="sfd-kb-validation-progress">
        <div class="sfd-kb-validation-progress__step sfd-kb-validation-progress__step--active" data-step="1">
          <span class="sfd-kb-validation-progress__number">1</span>
          <span class="sfd-kb-validation-progress__label">Cause</span>
        </div>
        <div class="sfd-kb-validation-progress__line"></div>
        <div class="sfd-kb-validation-progress__step" data-step="2">
          <span class="sfd-kb-validation-progress__number">2</span>
          <span class="sfd-kb-validation-progress__label">Résolution</span>
        </div>
        <div class="sfd-kb-validation-progress__line"></div>
        <div class="sfd-kb-validation-progress__step" data-step="3">
          <span class="sfd-kb-validation-progress__number">3</span>
          <span class="sfd-kb-validation-progress__label">Suivi</span>
        </div>
      </div>

      <!-- Step 1: Root Cause Feedback -->
      <div class="sfd-kb-validation-step" data-sfd-feedback-step="1">
        <h4 class="sfd-kb-feedback-section-title">Feedback sur la cause principale</h4>

        <!-- Root cause accuracy (required) -->
        <div class="sfd-kb-feedback-field">
          <label class="sfd-kb-feedback-field__label">
            La cause identifiée était-elle correcte ? <span class="sfd-kb-feedback-field__required">*</span>
          </label>
          <div class="sfd-kb-feedback-radio-group" data-sfd-field="rootCauseAccuracy">
            <label class="sfd-kb-feedback-radio">
              <input type="radio" name="rootCauseAccuracy" value="accurate">
              <span class="sfd-kb-feedback-radio__checkmark"></span>
              <span class="sfd-kb-feedback-radio__label">Correcte</span>
            </label>
            <label class="sfd-kb-feedback-radio">
              <input type="radio" name="rootCauseAccuracy" value="partially_accurate">
              <span class="sfd-kb-feedback-radio__checkmark"></span>
              <span class="sfd-kb-feedback-radio__label">Partiellement correcte</span>
            </label>
            <label class="sfd-kb-feedback-radio">
              <input type="radio" name="rootCauseAccuracy" value="inaccurate">
              <span class="sfd-kb-feedback-radio__checkmark"></span>
              <span class="sfd-kb-feedback-radio__label">Incorrecte</span>
            </label>
          </div>
        </div>

        <!-- Separator -->
        <div class="sfd-kb-feedback-separator"></div>

        <!-- Was known issue -->
        <div class="sfd-kb-feedback-field">
          <label class="sfd-kb-feedback-checkbox">
            <input type="checkbox" data-sfd-field="wasKnownIssue">
            <span class="sfd-kb-feedback-checkbox__checkmark"></span>
            <span class="sfd-kb-feedback-checkbox__label">C'était un problème connu</span>
          </label>
        </div>

        <!-- Domain expertise required -->
        <div class="sfd-kb-feedback-field">
          <label class="sfd-kb-feedback-field__label" for="sfd-feedback-domain-expertise">
            Domaine d'expertise requis
          </label>
          <input
            type="text"
            id="sfd-feedback-domain-expertise"
            class="sfd-kb-feedback-input"
            placeholder="Ex: facturation, provisioning, permissions..."
            data-sfd-field="domainExpertiseRequired"
          >
        </div>

        <!-- Missing investigation -->
        <div class="sfd-kb-feedback-field">
          <label class="sfd-kb-feedback-field__label" for="sfd-feedback-missing-investigation">
            Qu'est-ce que l'agent aurait pu investiguer ?
          </label>
          <textarea
            id="sfd-feedback-missing-investigation"
            class="sfd-kb-validation-feedback__textarea"
            placeholder="Quelles pistes auraient dû être explorées ?"
            rows="3"
            data-sfd-field="missingInvestigation"
          ></textarea>
        </div>

        <div class="sfd-kb-validation-nav">
          <div></div>
          <button type="button" class="sfd-kb-validation-nav-btn sfd-kb-validation-nav-btn--next" data-sfd-feedback-next="true" disabled>
            Suivant →
          </button>
        </div>
      </div>

      <!-- Step 2: Resolution Steps Feedback -->
      <div class="sfd-kb-validation-step" data-sfd-feedback-step="2" style="display: none;">
        <h4 class="sfd-kb-feedback-section-title">Feedback sur les étapes de résolution</h4>

        <!-- Resolution steps accuracy (required) -->
        <div class="sfd-kb-feedback-field">
          <label class="sfd-kb-feedback-field__label">
            Les étapes de résolution étaient-elles correctes ? <span class="sfd-kb-feedback-field__required">*</span>
          </label>
          <div class="sfd-kb-feedback-radio-group" data-sfd-field="resolutionStepsAccuracy">
            <label class="sfd-kb-feedback-radio">
              <input type="radio" name="resolutionStepsAccuracy" value="correct">
              <span class="sfd-kb-feedback-radio__checkmark"></span>
              <span class="sfd-kb-feedback-radio__label">Correctes</span>
            </label>
            <label class="sfd-kb-feedback-radio">
              <input type="radio" name="resolutionStepsAccuracy" value="partially_correct">
              <span class="sfd-kb-feedback-radio__checkmark"></span>
              <span class="sfd-kb-feedback-radio__label">Partiellement correctes</span>
            </label>
            <label class="sfd-kb-feedback-radio">
              <input type="radio" name="resolutionStepsAccuracy" value="wrong">
              <span class="sfd-kb-feedback-radio__checkmark"></span>
              <span class="sfd-kb-feedback-radio__label">Incorrectes</span>
            </label>
            <label class="sfd-kb-feedback-radio">
              <input type="radio" name="resolutionStepsAccuracy" value="not_applicable">
              <span class="sfd-kb-feedback-radio__checkmark"></span>
              <span class="sfd-kb-feedback-radio__label">Non applicable</span>
            </label>
          </div>
        </div>

        <!-- Resolution steps issue (conditional - shown when not correct) -->
        <div class="sfd-kb-feedback-field sfd-kb-feedback-field--conditional" data-sfd-show-when="resolutionStepsAccuracy:not_correct" style="display: none;">
          <label class="sfd-kb-feedback-field__label" for="sfd-feedback-resolution-issue">
            Quel était le problème ?
          </label>
          <select id="sfd-feedback-resolution-issue" class="sfd-kb-feedback-select" data-sfd-field="resolutionStepsIssue">
            <option value="">Sélectionner...</option>
            <option value="missing_steps">Étapes manquantes</option>
            <option value="wrong_order">Mauvais ordre</option>
            <option value="wrong_target">Mauvaise cible</option>
            <option value="requires_different_access">Nécessite un accès différent</option>
            <option value="not_possible">Impossible à réaliser</option>
            <option value="would_cause_side_effects">Causerait des effets secondaires</option>
          </select>
        </div>

        <!-- Corrected steps (conditional - shown when not correct) -->
        <div class="sfd-kb-feedback-field sfd-kb-feedback-field--conditional" data-sfd-show-when="resolutionStepsAccuracy:not_correct" style="display: none;">
          <label class="sfd-kb-feedback-field__label" for="sfd-feedback-corrected-steps">
            Étapes corrigées
          </label>
          <textarea
            id="sfd-feedback-corrected-steps"
            class="sfd-kb-validation-feedback__textarea"
            placeholder="Décrivez les étapes qui auraient dû être proposées..."
            rows="4"
            data-sfd-field="resolutionStepsCorrected"
          ></textarea>
        </div>

        <div class="sfd-kb-validation-nav">
          <button type="button" class="sfd-kb-validation-nav-btn sfd-kb-validation-nav-btn--back" data-sfd-feedback-prev="true">
            ← Retour
          </button>
          <button type="button" class="sfd-kb-validation-nav-btn sfd-kb-validation-nav-btn--next" data-sfd-feedback-next="true" disabled>
            Suivant →
          </button>
        </div>
      </div>

      <!-- Step 3: Follow-up Information -->
      <div class="sfd-kb-validation-step" data-sfd-feedback-step="3" style="display: none;">
        <h4 class="sfd-kb-feedback-section-title">Informations de suivi</h4>

        <!-- Can user solve himself -->
        <div class="sfd-kb-feedback-field">
          <label class="sfd-kb-feedback-checkbox">
            <input type="checkbox" data-sfd-field="canUserSolveHimself">
            <span class="sfd-kb-feedback-checkbox__checkmark"></span>
            <span class="sfd-kb-feedback-checkbox__label">L'utilisateur peut résoudre lui-même</span>
          </label>
        </div>

        <!-- Who could help -->
        <div class="sfd-kb-feedback-field">
          <label class="sfd-kb-feedback-field__label" for="sfd-feedback-who-could-help">
            Qui pourrait aider ?
          </label>
          <select id="sfd-feedback-who-could-help" class="sfd-kb-feedback-select" data-sfd-field="resolutionStepsWhoCouldHelp">
            <option value="">Sélectionner...</option>
            <option value="manager">Manager</option>
            <option value="requester">Demandeur</option>
            <option value="ops_team">Équipe Ops</option>
            <option value="salesforce_admin">Admin Salesforce</option>
            <option value="developer">Développeur</option>
            <option value="external_vendor">Fournisseur externe</option>
            <option value="other">Autre</option>
          </select>
        </div>

        <!-- Who could help other (conditional) -->
        <div class="sfd-kb-feedback-field sfd-kb-feedback-field--conditional" data-sfd-show-when="resolutionStepsWhoCouldHelp:other" style="display: none;">
          <label class="sfd-kb-feedback-field__label" for="sfd-feedback-who-could-help-other">
            Précisez qui pourrait aider
          </label>
          <input
            type="text"
            id="sfd-feedback-who-could-help-other"
            class="sfd-kb-feedback-input"
            placeholder="Précisez..."
            data-sfd-field="resolutionStepsWhoCouldHelpOther"
          >
        </div>

        <!-- Resolution type -->
        <div class="sfd-kb-feedback-field">
          <label class="sfd-kb-feedback-field__label" for="sfd-feedback-resolution-type">
            Type de résolution
          </label>
          <select id="sfd-feedback-resolution-type" class="sfd-kb-feedback-select" data-sfd-field="resolutionStepsType">
            <option value="">Sélectionner...</option>
            <option value="standard_salesforce">Standard Salesforce</option>
            <option value="company_procedure">Procédure entreprise</option>
            <option value="hybrid">Hybride</option>
            <option value="escalation">Escalade</option>
          </select>
        </div>

        <!-- Documentation URL -->
        <div class="sfd-kb-feedback-field">
          <label class="sfd-kb-feedback-field__label" for="sfd-feedback-doc-url">
            Lien vers la documentation
          </label>
          <input
            type="url"
            id="sfd-feedback-doc-url"
            class="sfd-kb-feedback-input"
            placeholder="https://..."
            data-sfd-field="resolutionStepsDocumentationUrl"
          >
        </div>

        <div class="sfd-kb-validation-nav">
          <button type="button" class="sfd-kb-validation-nav-btn sfd-kb-validation-nav-btn--back" data-sfd-feedback-prev="true">
            ← Retour
          </button>
          <button type="button" class="sfd-kb-validation-submit-btn" data-sfd-feedback-submit="true">
            Envoyer mon feedback
          </button>
        </div>
      </div>
    </div>
  `}function kt(s){return{accurate:"Correcte",partially_accurate:"Partiellement correcte",inaccurate:"Incorrecte"}[s]||s}function vt(s){return{correct:"Correctes",partially_correct:"Partiellement correctes",wrong:"Incorrectes",not_applicable:"Non applicable"}[s]||s}function xt(s){return{manager:"Manager",requester:"Demandeur",ops_team:"Équipe Ops",salesforce_admin:"Admin Salesforce",developer:"Développeur",external_vendor:"Fournisseur externe",other:"Autre"}[s]||s}function _t(s){return{standard_salesforce:"Standard Salesforce",company_procedure:"Procédure entreprise",hybrid:"Hybride",escalation:"Escalade"}[s]||s}function yt(s){return{missing_steps:"Étapes manquantes",wrong_order:"Mauvais ordre",wrong_target:"Mauvaise cible",requires_different_access:"Nécessite un accès différent",not_possible:"Impossible à réaliser",would_cause_side_effects:"Causerait des effets secondaires"}[s]||s}function le(s){const e=s.validatedAt?new Date(s.validatedAt).toLocaleString("fr-FR"):"",t=s.rootCauseAccuracy==="accurate"&&s.resolutionStepsAccuracy==="correct";return`
    <div class="sfd-kb-validation-status ${t?"sfd-kb-validation-status--valid":"sfd-kb-validation-status--invalid"}">
      <span class="sfd-kb-validation-status__icon">${t?ne:ae}</span>
      <span class="sfd-kb-validation-status__text">${t?"Feedback positif":"Feedback avec corrections"}</span>
      ${e?`<span class="sfd-kb-validation-status__date">${e}</span>`:""}
    </div>

    <div class="sfd-kb-feedback-display-section">
      <h4 class="sfd-kb-feedback-display-section__title">Cause principale</h4>
      <div class="sfd-kb-validation-feedback-display">
        <p class="sfd-kb-validation-feedback-display__label">Précision:</p>
        <p class="sfd-kb-validation-feedback-display__text">${kt(s.rootCauseAccuracy)}</p>
      </div>
      ${s.wasKnownIssue?`
        <div class="sfd-kb-validation-feedback-display">
          <p class="sfd-kb-validation-feedback-display__text">✓ Problème connu</p>
        </div>
      `:""}
      ${s.domainExpertiseRequired?`
        <div class="sfd-kb-validation-feedback-display">
          <p class="sfd-kb-validation-feedback-display__label">Domaine d'expertise:</p>
          <p class="sfd-kb-validation-feedback-display__text">${p(s.domainExpertiseRequired)}</p>
        </div>
      `:""}
      ${s.missingInvestigation?`
        <div class="sfd-kb-validation-feedback-display">
          <p class="sfd-kb-validation-feedback-display__label">Investigation manquante:</p>
          <p class="sfd-kb-validation-feedback-display__text">${p(s.missingInvestigation)}</p>
        </div>
      `:""}
    </div>

    <div class="sfd-kb-feedback-display-section">
      <h4 class="sfd-kb-feedback-display-section__title">Étapes de résolution</h4>
      <div class="sfd-kb-validation-feedback-display">
        <p class="sfd-kb-validation-feedback-display__label">Précision:</p>
        <p class="sfd-kb-validation-feedback-display__text">${vt(s.resolutionStepsAccuracy)}</p>
      </div>
      ${s.resolutionStepsIssue?`
        <div class="sfd-kb-validation-feedback-display">
          <p class="sfd-kb-validation-feedback-display__label">Problème:</p>
          <p class="sfd-kb-validation-feedback-display__text">${yt(s.resolutionStepsIssue)}</p>
        </div>
      `:""}
      ${s.resolutionStepsCorrected?`
        <div class="sfd-kb-validation-feedback-display">
          <p class="sfd-kb-validation-feedback-display__label">Étapes corrigées:</p>
          <p class="sfd-kb-validation-feedback-display__text">${p(s.resolutionStepsCorrected)}</p>
        </div>
      `:""}
      ${s.resolutionStepsWhoCouldHelp?`
        <div class="sfd-kb-validation-feedback-display">
          <p class="sfd-kb-validation-feedback-display__label">Qui pourrait aider:</p>
          <p class="sfd-kb-validation-feedback-display__text">${xt(s.resolutionStepsWhoCouldHelp)}${s.resolutionStepsWhoCouldHelpOther?` (${p(s.resolutionStepsWhoCouldHelpOther)})`:""}</p>
        </div>
      `:""}
      ${s.resolutionStepsType?`
        <div class="sfd-kb-validation-feedback-display">
          <p class="sfd-kb-validation-feedback-display__label">Type de résolution:</p>
          <p class="sfd-kb-validation-feedback-display__text">${_t(s.resolutionStepsType)}</p>
        </div>
      `:""}
      ${s.canUserSolveHimself!==null?`
        <div class="sfd-kb-validation-feedback-display">
          <p class="sfd-kb-validation-feedback-display__text">${s.canUserSolveHimself?"✓":"✗"} L'utilisateur peut résoudre lui-même</p>
        </div>
      `:""}
      ${s.resolutionStepsDocumentationUrl?`
        <div class="sfd-kb-validation-feedback-display">
          <p class="sfd-kb-validation-feedback-display__label">Documentation:</p>
          <p class="sfd-kb-validation-feedback-display__text"><a href="${p(s.resolutionStepsDocumentationUrl)}" target="_blank" rel="noopener noreferrer">${p(s.resolutionStepsDocumentationUrl)}</a></p>
        </div>
      `:""}
    </div>

    <button type="button" class="sfd-kb-validation-edit-btn" data-sfd-feedback-edit="true" data-sfd-existing-feedback='${JSON.stringify(s).replace(/'/g,"&#39;")}'>
      Modifier mon feedback
    </button>
  `}function de(s,e){return s.diagnosticFeedback!==null&&s.diagnosticFeedback?`
      <div class="sfd-kb-result-section sfd-kb-result-section--validation">
        <h3 class="sfd-kb-result-section__title">
          <span class="sfd-kb-result-section__title-icon" style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);">${e}</span>
          Votre feedback
        </h3>
        ${le(s.diagnosticFeedback)}
      </div>
    `:`
    <div class="sfd-kb-result-section sfd-kb-result-section--validation">
      <h3 class="sfd-kb-result-section__title">
        <span class="sfd-kb-result-section__title-icon" style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);">${e}</span>
        Votre feedback
      </h3>
      <div class="sfd-kb-validation-wizard" data-sfd-feedback-form="true">
        <!-- Progress bar -->
        <div class="sfd-kb-validation-progress">
          <div class="sfd-kb-validation-progress__step sfd-kb-validation-progress__step--active" data-step="1">
            <span class="sfd-kb-validation-progress__number">1</span>
            <span class="sfd-kb-validation-progress__label">Cause</span>
          </div>
          <div class="sfd-kb-validation-progress__line"></div>
          <div class="sfd-kb-validation-progress__step" data-step="2">
            <span class="sfd-kb-validation-progress__number">2</span>
            <span class="sfd-kb-validation-progress__label">Résolution</span>
          </div>
          <div class="sfd-kb-validation-progress__line"></div>
          <div class="sfd-kb-validation-progress__step" data-step="3">
            <span class="sfd-kb-validation-progress__number">3</span>
            <span class="sfd-kb-validation-progress__label">Suivi</span>
          </div>
        </div>

        <!-- Step 1: Root Cause Feedback -->
        <div class="sfd-kb-validation-step" data-sfd-feedback-step="1">
          <h4 class="sfd-kb-feedback-section-title">Feedback sur la cause principale</h4>

          <!-- Root cause accuracy (required) -->
          <div class="sfd-kb-feedback-field">
            <label class="sfd-kb-feedback-field__label">
              La cause identifiée était-elle correcte ? <span class="sfd-kb-feedback-field__required">*</span>
            </label>
            <div class="sfd-kb-feedback-radio-group" data-sfd-field="rootCauseAccuracy">
              <label class="sfd-kb-feedback-radio">
                <input type="radio" name="rootCauseAccuracy" value="accurate">
                <span class="sfd-kb-feedback-radio__checkmark"></span>
                <span class="sfd-kb-feedback-radio__label">Correcte</span>
              </label>
              <label class="sfd-kb-feedback-radio">
                <input type="radio" name="rootCauseAccuracy" value="partially_accurate">
                <span class="sfd-kb-feedback-radio__checkmark"></span>
                <span class="sfd-kb-feedback-radio__label">Partiellement correcte</span>
              </label>
              <label class="sfd-kb-feedback-radio">
                <input type="radio" name="rootCauseAccuracy" value="inaccurate">
                <span class="sfd-kb-feedback-radio__checkmark"></span>
                <span class="sfd-kb-feedback-radio__label">Incorrecte</span>
              </label>
            </div>
          </div>

          <!-- Separator -->
          <div class="sfd-kb-feedback-separator"></div>

          <!-- Was known issue -->
          <div class="sfd-kb-feedback-field">
            <label class="sfd-kb-feedback-checkbox">
              <input type="checkbox" data-sfd-field="wasKnownIssue">
              <span class="sfd-kb-feedback-checkbox__checkmark"></span>
              <span class="sfd-kb-feedback-checkbox__label">C'était un problème connu</span>
            </label>
          </div>

          <!-- Domain expertise required -->
          <div class="sfd-kb-feedback-field">
            <label class="sfd-kb-feedback-field__label" for="sfd-feedback-domain-expertise">
              Domaine d'expertise requis
            </label>
            <input
              type="text"
              id="sfd-feedback-domain-expertise"
              class="sfd-kb-feedback-input"
              placeholder="Ex: facturation, provisioning, permissions..."
              data-sfd-field="domainExpertiseRequired"
            >
          </div>

          <!-- Missing investigation -->
          <div class="sfd-kb-feedback-field">
            <label class="sfd-kb-feedback-field__label" for="sfd-feedback-missing-investigation">
              Qu'est-ce que l'agent aurait pu investiguer ?
            </label>
            <textarea
              id="sfd-feedback-missing-investigation"
              class="sfd-kb-validation-feedback__textarea"
              placeholder="Quelles pistes auraient dû être explorées ?"
              rows="3"
              data-sfd-field="missingInvestigation"
            ></textarea>
          </div>

          <div class="sfd-kb-validation-nav">
            <div></div>
            <button type="button" class="sfd-kb-validation-nav-btn sfd-kb-validation-nav-btn--next" data-sfd-feedback-next="true" disabled>
              Suivant →
            </button>
          </div>
        </div>

        <!-- Step 2: Resolution Steps Feedback -->
        <div class="sfd-kb-validation-step" data-sfd-feedback-step="2" style="display: none;">
          <h4 class="sfd-kb-feedback-section-title">Feedback sur les étapes de résolution</h4>

          <!-- Resolution steps accuracy (required) -->
          <div class="sfd-kb-feedback-field">
            <label class="sfd-kb-feedback-field__label">
              Les étapes de résolution étaient-elles correctes ? <span class="sfd-kb-feedback-field__required">*</span>
            </label>
            <div class="sfd-kb-feedback-radio-group" data-sfd-field="resolutionStepsAccuracy">
              <label class="sfd-kb-feedback-radio">
                <input type="radio" name="resolutionStepsAccuracy" value="correct">
                <span class="sfd-kb-feedback-radio__checkmark"></span>
                <span class="sfd-kb-feedback-radio__label">Correctes</span>
              </label>
              <label class="sfd-kb-feedback-radio">
                <input type="radio" name="resolutionStepsAccuracy" value="partially_correct">
                <span class="sfd-kb-feedback-radio__checkmark"></span>
                <span class="sfd-kb-feedback-radio__label">Partiellement correctes</span>
              </label>
              <label class="sfd-kb-feedback-radio">
                <input type="radio" name="resolutionStepsAccuracy" value="wrong">
                <span class="sfd-kb-feedback-radio__checkmark"></span>
                <span class="sfd-kb-feedback-radio__label">Incorrectes</span>
              </label>
              <label class="sfd-kb-feedback-radio">
                <input type="radio" name="resolutionStepsAccuracy" value="not_applicable">
                <span class="sfd-kb-feedback-radio__checkmark"></span>
                <span class="sfd-kb-feedback-radio__label">Non applicable</span>
              </label>
            </div>
          </div>

          <!-- Resolution steps issue (conditional - shown when not correct) -->
          <div class="sfd-kb-feedback-field sfd-kb-feedback-field--conditional" data-sfd-show-when="resolutionStepsAccuracy:not_correct" style="display: none;">
            <label class="sfd-kb-feedback-field__label" for="sfd-feedback-resolution-issue">
              Quel était le problème ?
            </label>
            <select id="sfd-feedback-resolution-issue" class="sfd-kb-feedback-select" data-sfd-field="resolutionStepsIssue">
              <option value="">Sélectionner...</option>
              <option value="missing_steps">Étapes manquantes</option>
              <option value="wrong_order">Mauvais ordre</option>
              <option value="wrong_target">Mauvaise cible</option>
              <option value="requires_different_access">Nécessite un accès différent</option>
              <option value="not_possible">Impossible à réaliser</option>
              <option value="would_cause_side_effects">Causerait des effets secondaires</option>
            </select>
          </div>

          <!-- Corrected steps (conditional - shown when not correct) -->
          <div class="sfd-kb-feedback-field sfd-kb-feedback-field--conditional" data-sfd-show-when="resolutionStepsAccuracy:not_correct" style="display: none;">
            <label class="sfd-kb-feedback-field__label" for="sfd-feedback-corrected-steps">
              Étapes corrigées
            </label>
            <textarea
              id="sfd-feedback-corrected-steps"
              class="sfd-kb-validation-feedback__textarea"
              placeholder="Décrivez les étapes qui auraient dû être proposées..."
              rows="4"
              data-sfd-field="resolutionStepsCorrected"
            ></textarea>
          </div>

          <div class="sfd-kb-validation-nav">
            <button type="button" class="sfd-kb-validation-nav-btn sfd-kb-validation-nav-btn--back" data-sfd-feedback-prev="true">
              ← Retour
            </button>
            <button type="button" class="sfd-kb-validation-nav-btn sfd-kb-validation-nav-btn--next" data-sfd-feedback-next="true" disabled>
              Suivant →
            </button>
          </div>
        </div>

        <!-- Step 3: Follow-up Information -->
        <div class="sfd-kb-validation-step" data-sfd-feedback-step="3" style="display: none;">
          <h4 class="sfd-kb-feedback-section-title">Informations de suivi</h4>

          <!-- Can user solve himself -->
          <div class="sfd-kb-feedback-field">
            <label class="sfd-kb-feedback-checkbox">
              <input type="checkbox" data-sfd-field="canUserSolveHimself">
              <span class="sfd-kb-feedback-checkbox__checkmark"></span>
              <span class="sfd-kb-feedback-checkbox__label">L'utilisateur peut résoudre lui-même</span>
            </label>
          </div>

          <!-- Who could help -->
          <div class="sfd-kb-feedback-field">
            <label class="sfd-kb-feedback-field__label" for="sfd-feedback-who-could-help">
              Qui pourrait aider ?
            </label>
            <select id="sfd-feedback-who-could-help" class="sfd-kb-feedback-select" data-sfd-field="resolutionStepsWhoCouldHelp">
              <option value="">Sélectionner...</option>
              <option value="manager">Manager</option>
              <option value="requester">Demandeur</option>
              <option value="ops_team">Équipe Ops</option>
              <option value="salesforce_admin">Admin Salesforce</option>
              <option value="developer">Développeur</option>
              <option value="external_vendor">Fournisseur externe</option>
              <option value="other">Autre</option>
            </select>
          </div>

          <!-- Who could help other (conditional) -->
          <div class="sfd-kb-feedback-field sfd-kb-feedback-field--conditional" data-sfd-show-when="resolutionStepsWhoCouldHelp:other" style="display: none;">
            <label class="sfd-kb-feedback-field__label" for="sfd-feedback-who-could-help-other">
              Précisez qui pourrait aider
            </label>
            <input
              type="text"
              id="sfd-feedback-who-could-help-other"
              class="sfd-kb-feedback-input"
              placeholder="Précisez..."
              data-sfd-field="resolutionStepsWhoCouldHelpOther"
            >
          </div>

          <!-- Resolution type -->
          <div class="sfd-kb-feedback-field">
            <label class="sfd-kb-feedback-field__label" for="sfd-feedback-resolution-type">
              Type de résolution
            </label>
            <select id="sfd-feedback-resolution-type" class="sfd-kb-feedback-select" data-sfd-field="resolutionStepsType">
              <option value="">Sélectionner...</option>
              <option value="standard_salesforce">Standard Salesforce</option>
              <option value="company_procedure">Procédure entreprise</option>
              <option value="hybrid">Hybride</option>
              <option value="escalation">Escalade</option>
            </select>
          </div>

          <!-- Documentation URL -->
          <div class="sfd-kb-feedback-field">
            <label class="sfd-kb-feedback-field__label" for="sfd-feedback-doc-url">
              Lien vers la documentation
            </label>
            <input
              type="url"
              id="sfd-feedback-doc-url"
              class="sfd-kb-feedback-input"
              placeholder="https://..."
              data-sfd-field="resolutionStepsDocumentationUrl"
            >
          </div>

          <div class="sfd-kb-validation-nav">
            <button type="button" class="sfd-kb-validation-nav-btn sfd-kb-validation-nav-btn--back" data-sfd-feedback-prev="true">
              ← Retour
            </button>
            <button type="button" class="sfd-kb-validation-submit-btn" data-sfd-feedback-submit="true">
              Envoyer mon feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  `}function wt(s,e){const t=(a,r)=>{if(!r)return;const i=s.querySelector(`input[name="${a}"][value="${r}"]`);i&&(i.checked=!0)},o=(a,r)=>{const i=s.querySelector(`input[type="checkbox"][data-sfd-field="${a}"]`);i&&(i.checked=r===!0)},n=(a,r)=>{if(!r)return;const i=s.querySelector(`[data-sfd-field="${a}"]`);i&&!i.matches('input[type="radio"]')&&!i.matches('input[type="checkbox"]')&&!i.matches("[data-sfd-field].sfd-kb-feedback-radio-group")&&(i.value=r)};t("rootCauseAccuracy",e.rootCauseAccuracy),o("wasKnownIssue",e.wasKnownIssue),n("domainExpertiseRequired",e.domainExpertiseRequired),n("missingInvestigation",e.missingInvestigation),t("resolutionStepsAccuracy",e.resolutionStepsAccuracy),n("resolutionStepsIssue",e.resolutionStepsIssue),n("resolutionStepsCorrected",e.resolutionStepsCorrected),o("canUserSolveHimself",e.canUserSolveHimself),n("resolutionStepsWhoCouldHelp",e.resolutionStepsWhoCouldHelp),n("resolutionStepsWhoCouldHelpOther",e.resolutionStepsWhoCouldHelpOther),n("resolutionStepsType",e.resolutionStepsType),n("resolutionStepsDocumentationUrl",e.resolutionStepsDocumentationUrl)}function V(s,e){const t=s.querySelector('[data-sfd-feedback-edit="true"]'),o=t?.getAttribute("data-sfd-existing-feedback"),n=o?JSON.parse(o):null;t?.addEventListener("click",()=>{const c=s.querySelector(".sfd-kb-result-modal__sidebar-body");if(c)c.innerHTML=re({diagnosticFeedback:null}),V(s,n);else{const k=t.closest(".sfd-kb-result-section--validation");if(k){const f='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';k.outerHTML=de({diagnosticFeedback:null},f),V(s,n)}}});const a=s.querySelector('[data-sfd-feedback-form="true"]');if(!a)return;const r=a.querySelectorAll("[data-sfd-feedback-step]"),i=a.querySelectorAll(".sfd-kb-validation-progress__step"),l=a.querySelectorAll(".sfd-kb-validation-progress__line"),d=a.querySelector('[data-sfd-feedback-step="1"] [data-sfd-feedback-next="true"]'),u=a.querySelector('[data-sfd-feedback-step="2"] [data-sfd-feedback-next="true"]'),m=a.querySelector('[data-sfd-feedback-submit="true"]');let h=1;const b=c=>{const k=a.querySelector(`input[type="checkbox"][data-sfd-field="${c}"]`);if(k)return k.checked;const f=a.querySelector(`.sfd-kb-feedback-radio-group[data-sfd-field="${c}"]`);return f?f.querySelector('input[type="radio"]:checked')?.value||null:a.querySelector(`select[data-sfd-field="${c}"], input[data-sfd-field="${c}"], textarea[data-sfd-field="${c}"]`)?.value||null},w=()=>{const c=b("rootCauseAccuracy");return c!==null&&c!==""},C=()=>{const c=b("resolutionStepsAccuracy");return c!==null&&c!==""},g=()=>{d&&(d.disabled=!w()),u&&(u.disabled=!C())},ue=c=>{h=c,r.forEach(k=>{const f=parseInt(k.getAttribute("data-sfd-feedback-step")||"0",10);k.style.display=f===c?"block":"none"}),i.forEach((k,f)=>{const S=f+1;k.classList.toggle("sfd-kb-validation-progress__step--active",S===c),k.classList.toggle("sfd-kb-validation-progress__step--completed",S<c)}),l.forEach((k,f)=>{k.classList.toggle("sfd-kb-validation-progress__line--completed",f<c-1)}),g()},Q=()=>{a.querySelectorAll("[data-sfd-show-when]").forEach(k=>{const f=k.getAttribute("data-sfd-show-when")||"",[S,x]=f.split(":"),v=b(S);let _=!1;x==="not_correct"?_=v!==null&&v!==""&&v!=="correct":x==="other"?_=v==="other":_=v===x,k.style.display=_?"block":"none"})};a.querySelectorAll('input[type="radio"]').forEach(c=>{c.addEventListener("change",()=>{g(),Q()})}),a.querySelectorAll("select").forEach(c=>{c.addEventListener("change",()=>{Q()})}),a.querySelectorAll('[data-sfd-feedback-next="true"]').forEach(c=>{c.addEventListener("click",()=>{h<3&&ue(h+1)})}),a.querySelectorAll('[data-sfd-feedback-prev="true"]').forEach(c=>{c.addEventListener("click",()=>{h>1&&ue(h-1)})}),m?.addEventListener("click",async()=>{if(!w()||!C())return;const k=s.closest(".sfd-kb-result-overlay")?._getFeedbackHandler?.();if(k){m.disabled=!0,m.textContent="Envoi en cours...";try{const f={validatedBy:"",rootCauseAccuracy:b("rootCauseAccuracy"),resolutionStepsAccuracy:b("resolutionStepsAccuracy")};b("wasKnownIssue")===!0&&(f.wasKnownIssue=!0);const x=b("domainExpertiseRequired");x&&typeof x=="string"&&x.trim()&&(f.domainExpertiseRequired=x.trim());const v=b("missingInvestigation");v&&typeof v=="string"&&v.trim()&&(f.missingInvestigation=v.trim());const _=b("resolutionStepsIssue");_&&typeof _=="string"&&_.trim()&&(f.resolutionStepsIssue=_);const B=b("resolutionStepsCorrected");B&&typeof B=="string"&&B.trim()&&(f.resolutionStepsCorrected=B.trim());const z=b("resolutionStepsWhoCouldHelp");z&&typeof z=="string"&&z.trim()&&(f.resolutionStepsWhoCouldHelp=z);const H=b("resolutionStepsWhoCouldHelpOther");H&&typeof H=="string"&&H.trim()&&(f.resolutionStepsWhoCouldHelpOther=H.trim());const N=b("resolutionStepsType");N&&typeof N=="string"&&N.trim()&&(f.resolutionStepsType=N),b("canUserSolveHimself")===!0&&(f.canUserSolveHimself=!0);const P=b("resolutionStepsDocumentationUrl");P&&typeof P=="string"&&P.trim()&&(f.resolutionStepsDocumentationUrl=P.trim()),await k(f)}catch(f){console.error("[KbResultModal] Feedback submission failed:",f),m.disabled=!1,m.textContent="Envoyer mon feedback"}}}),e&&wt(a,e),g(),Q()}function T(s,e=null){const t=s.data.attributes;return{id:parseInt(s.data.id,10),organizationId:t.organizationId,salesforceId:t.salesforceId,salesforceUrl:t.salesforceUrl,status:t.status,solved:t.solved,confidence:t.confidence,problemSummary:t.problemSummary,rootCause:t.rootCause,resolutionSteps:t.resolutionSteps,whoCanHelp:t.whoCanHelp,relevantSfLinks:t.relevantSfLinks,followUpQuestions:t.followUpQuestions,domain:t.domain,irName:t.irName,irSubject:t.irSubject,irCategory:t.irCategory,irOwnerName:t.irOwnerName,irOwnerId:t.irOwnerId,iterationsCount:t.iterationsCount,toolsUsed:t.toolsUsed,soqlQueries:t.soqlQueries||[],totalDurationMs:t.totalDurationMs,startedAt:t.startedAt,createdAt:t.createdAt,updatedAt:t.updatedAt,diagnosticFeedback:e}}function R(s){const e=s.data.attributes;return{id:parseInt(s.data.id,10),diagnosticResultId:e.diagnosticResultId,validatedBy:e.validatedBy,validatedAt:e.validatedAt,rootCauseAccuracy:e.rootCauseAccuracy,wasKnownIssue:e.wasKnownIssue,domainExpertiseRequired:e.domainExpertiseRequired,missingInvestigation:e.missingInvestigation,resolutionStepsAccuracy:e.resolutionStepsAccuracy,resolutionStepsCorrected:e.resolutionStepsCorrected,resolutionStepsWhoCouldHelp:e.resolutionStepsWhoCouldHelp,resolutionStepsWhoCouldHelpOther:e.resolutionStepsWhoCouldHelpOther,resolutionStepsType:e.resolutionStepsType,resolutionStepsIssue:e.resolutionStepsIssue,resolutionStepsDocumentationUrl:e.resolutionStepsDocumentationUrl,canUserSolveHimself:e.canUserSolveHimself,createdAt:e.createdAt,updatedAt:e.updatedAt}}function L(s){return s.data.relationships?.diagnosticFeedback?.data!==null&&s.data.relationships?.diagnosticFeedback?.data!==void 0}const St=5e3,Ct=120;class Et{constructor(e){this.deps=e,this.injector=rt()}unsubscribeFromDomObserver;elements;modalElements;injector;pollingIntervalId;currentResult;currentRecordId;lastCheckedUrl;urlCheckIntervalId;boundHandlePopState;isRetryingInjection=!1;start(){console.log("[KbSolveButton] Controller started"),st(),this.ensureButton(),this.unsubscribeFromDomObserver=F.subscribe(()=>this.ensureButton()),this.boundHandlePopState=()=>this.handleUrlChange(),window.addEventListener("popstate",this.boundHandlePopState),this.lastCheckedUrl=this.deps.getUrl(),this.urlCheckIntervalId=setInterval(()=>{const e=this.deps.getUrl();e!==this.lastCheckedUrl&&(console.log("[KbSolveButton] URL changed from",this.lastCheckedUrl,"to",e),this.lastCheckedUrl=e,this.handleUrlChange())},500)}stop(){this.unsubscribeFromDomObserver?.(),this.boundHandlePopState&&window.removeEventListener("popstate",this.boundHandlePopState),this.urlCheckIntervalId&&clearInterval(this.urlCheckIntervalId),this.cleanupCurrentElements(),this.modalElements?.cleanup(),this.modalElements?.overlay.remove(),this.modalElements=void 0}handleUrlChange(){console.log("[KbSolveButton] handleUrlChange called"),this.cleanupCurrentElements(),this.isRetryingInjection=!0,this.retryInjection(0)}retryInjection(e){if(e>=15){console.log("[KbSolveButton] Max injection attempts reached"),this.isRetryingInjection=!1;return}setTimeout(()=>{if(!this.isInternalRequestPage()){this.isRetryingInjection=!1;return}const n=this.extractRecordId();console.log(`[KbSolveButton] Retry attempt ${e+1} for record:`,n),this.elements&&(this.elements.cleanup(),this.elements.container.remove(),this.elements=void 0),this.currentRecordId=n,this.elements=ee({onClick:()=>this.handleClick(),onViewResult:()=>this.handleViewResult()}),(!this.modalElements||!this.modalElements.overlay.isConnected)&&(this.modalElements?.cleanup(),this.modalElements=ie(),document.body.appendChild(this.modalElements.overlay));const a=this.injector.inject(this.elements.container);console.log(`[KbSolveButton] Injection attempt ${e+1} result:`,a),a?setTimeout(()=>{this.elements?.container.isConnected?(console.log("[KbSolveButton] Button confirmed in DOM, checking for existing result"),this.isRetryingInjection=!1,this.checkForExistingResult()):(console.log("[KbSolveButton] Button was removed by Salesforce, retrying..."),this.elements?.cleanup(),this.elements=void 0,this.retryInjection(e+1))},200):(console.log("[KbSolveButton] Injection failed, page header not ready yet"),this.elements?.cleanup(),this.elements=void 0,this.retryInjection(e+1))},400)}ensureButton(){if(this.isRetryingInjection)return;const e=this.isInternalRequestPage(),t=this.extractRecordId();if(!e){this.currentRecordId&&(console.log("[KbSolveButton] Navigated away from Internal Request page, cleaning up"),this.cleanupCurrentElements());return}if(this.currentRecordId&&this.currentRecordId!==t&&(console.log("[KbSolveButton] Record changed from",this.currentRecordId,"to",t),this.cleanupCurrentElements()),this.injector.isInjected()&&this.elements?.container.isConnected)return;console.log("[KbSolveButton] ensureButton: Attempting to inject button for record:",t),this.elements&&!this.elements.container.isConnected&&this.cleanupCurrentElements(),this.currentRecordId=t,this.elements=ee({onClick:()=>this.handleClick(),onViewResult:()=>this.handleViewResult()}),(!this.modalElements||!this.modalElements.overlay.isConnected)&&(this.modalElements?.cleanup(),this.modalElements=ie(),document.body.appendChild(this.modalElements.overlay));const o=this.injector.inject(this.elements.container);console.log("[KbSolveButton] ensureButton: Injection result:",o),o&&this.checkForExistingResult()}cleanupCurrentElements(){this.stopPolling(),this.elements?.cleanup(),this.elements?.container.remove(),this.injector.removeWrapper(),this.elements=void 0,this.currentResult=void 0,this.currentRecordId=void 0}async checkForExistingResult(){const e=this.extractRecordId();if(e){console.log("[KbSolveButton] Checking for existing diagnostic result...");try{const t=`/api/v1/organizations/${this.deps.organizationId}/diagnostic_results/${e}`,o=await this.deps.apiClient.get(t);if(o.data?.data){let n=null;if(L(o.data))try{const r=`/api/v1/organizations/${this.deps.organizationId}/diagnostic_results/${e}/feedback`,i=await this.deps.apiClient.get(r);i.data?.data&&(n=R(i.data))}catch{}const a=T(o.data,n);console.log("[KbSolveButton] Found existing diagnostic result:",a),this.currentResult=a,this.elements&&se(this.elements.viewResultButton,!0)}}catch(t){t instanceof Error&&t.message.includes("404")?console.log("[KbSolveButton] No existing diagnostic result found"):console.error("[KbSolveButton] Error checking for existing result:",t)}}}isInternalRequestPage(){const e=this.deps.getUrl();return/\/lightning\/r\/Internal_Request__c\/[a-zA-Z0-9]{15,18}\/view/.test(e)}extractRecordId(){const t=this.deps.getUrl().match(/\/lightning\/r\/Internal_Request__c\/([a-zA-Z0-9]{15,18})\/view/);return t?t[1]:null}async handleClick(){if(console.log("[KbSolveButton] handleClick called"),!this.elements){console.log("[KbSolveButton] No elements, returning");return}const e=this.extractRecordId();if(console.log("[KbSolveButton] Record ID:",e),!e){te(this.elements.button,"Invalid record");return}nt(this.elements.button);try{const t=`/api/v1/organizations/${this.deps.organizationId}/diagnostic_results`;console.log("[KbSolveButton] Calling POST endpoint:",t),await this.deps.apiClient.post(t,{salesforce_id:e}),console.log("[KbSolveButton] POST successful"),at(this.elements.button),this.startPolling(e)}catch(t){console.error("[KbSolveButton] API call failed:",t),te(this.elements.button,"Failed")}}async handleViewResult(){if(console.log("[KbSolveButton] handleViewResult called"),!this.modalElements){console.log("[KbSolveButton] No modal elements, returning");return}const e=this.extractRecordId();if(console.log("[KbSolveButton] Record ID:",e),!e){console.log("[KbSolveButton] No record ID, returning");return}this.modalElements.setFeedbackHandler(async t=>{await this.handleFeedbackSubmit(e,t)}),pt(this.modalElements.content),ft(this.modalElements.overlay),console.log("[KbSolveButton] Fetching diagnostic result...");try{const t=`/api/v1/organizations/${this.deps.organizationId}/diagnostic_results/${e}`;console.log("[KbSolveButton] GET diagnostic result:",t);const o=await this.deps.apiClient.get(t);if(console.log("[KbSolveButton] Diagnostic result response:",o),!o.data?.data){console.log("[KbSolveButton] No data in response");return}let n=null;if(L(o.data))try{const r=`/api/v1/organizations/${this.deps.organizationId}/diagnostic_results/${e}/feedback`;console.log("[KbSolveButton] GET feedback:",r);const i=await this.deps.apiClient.get(r);console.log("[KbSolveButton] Feedback response:",i),i.data?.data&&(n=R(i.data),console.log("[KbSolveButton] Mapped feedback:",n))}catch(r){r instanceof Error&&r.message.includes("404")?console.log("[KbSolveButton] No feedback found (404)"):console.error("[KbSolveButton] Error fetching feedback:",r)}const a=T(o.data,n);console.log("[KbSolveButton] Setting modal result with:",a),this.currentResult=a,O(this.modalElements.content,a,this.modalElements.sidebar)}catch(t){console.error("[KbSolveButton] Error fetching diagnostic result:",t),this.modalElements&&(this.modalElements.content.innerHTML=`
          <div class="sfd-kb-result-error">
            <p>Failed to load diagnostic result.</p>
          </div>
        `)}}async handleFeedbackSubmit(e,t){console.log("[KbSolveButton] handleFeedbackSubmit called:",t);try{const o=`/api/v1/organizations/${this.deps.organizationId}/diagnostic_results/${e}/feedback`,n={diagnostic_feedback:{validated_by:t.validatedBy||this.deps.getUserId()||"unknown",root_cause_accuracy:t.rootCauseAccuracy,was_known_issue:t.wasKnownIssue,domain_expertise_required:t.domainExpertiseRequired,missing_investigation:t.missingInvestigation,resolution_steps_accuracy:t.resolutionStepsAccuracy,resolution_steps_corrected:t.resolutionStepsCorrected,resolution_steps_who_could_help:t.resolutionStepsWhoCouldHelp,resolution_steps_who_could_help_other:t.resolutionStepsWhoCouldHelpOther,resolution_steps_type:t.resolutionStepsType,resolution_steps_issue:t.resolutionStepsIssue,resolution_steps_documentation_url:t.resolutionStepsDocumentationUrl,can_user_solve_himself:t.canUserSolveHimself}},a=this.currentResult?.diagnosticFeedback!==null,r=a;a?(console.log("[KbSolveButton] PATCH endpoint (update):",o,"payload:",n),await this.deps.apiClient.patch(o,n)):(console.log("[KbSolveButton] POST endpoint (create):",o,"payload:",n),await this.deps.apiClient.post(o,n));const i=`/api/v1/organizations/${this.deps.organizationId}/diagnostic_results/${e}`,l=await this.deps.apiClient.get(i);let d=null;if(l.data?.data&&L(l.data))try{const u=await this.deps.apiClient.get(o);u.data?.data&&(d=R(u.data))}catch(u){console.error("[KbSolveButton] Error refetching feedback:",u)}if(l.data?.data&&this.modalElements){const u=T(l.data,d);console.log("[KbSolveButton] Updating modal with feedback result:",u),this.currentResult=u,O(this.modalElements.content,u,this.modalElements.sidebar),bt(r?"Feedback mis à jour":"Feedback enregistré")}}catch(o){throw console.error("[KbSolveButton] Error submitting feedback:",o),o}}startPolling(e){this.stopPolling();let t=0;console.log("[KbSolveButton] Starting polling for diagnostic result...");const o=async()=>{if(t++,t>Ct){console.log("[KbSolveButton] Max polling attempts reached, stopping"),this.stopPolling();return}try{const n=`/api/v1/organizations/${this.deps.organizationId}/diagnostic_results/${e}`,a=await this.deps.apiClient.get(n);if(a.data?.data){let r=null;if(L(a.data))try{const l=`/api/v1/organizations/${this.deps.organizationId}/diagnostic_results/${e}/feedback`,d=await this.deps.apiClient.get(l);d.data?.data&&(r=R(d.data))}catch{}const i=T(a.data,r);console.log("[KbSolveButton] Diagnostic result received:",i),this.currentResult=i,this.elements&&se(this.elements.viewResultButton,!0),this.modalElements&&this.modalElements.overlay.classList.contains("sfd-kb-result-overlay--visible")&&O(this.modalElements.content,i,this.modalElements.sidebar),(i.status==="completed"||i.status==="failed")&&(console.log("[KbSolveButton] Diagnostic completed, stopping polling"),this.stopPolling())}}catch(n){n instanceof Error&&n.message.includes("404")?console.log(`[KbSolveButton] Polling attempt ${t}: result not ready yet`):console.error("[KbSolveButton] Polling error:",n)}};o(),this.pollingIntervalId=setInterval(o,St)}stopPolling(){this.pollingIntervalId&&(clearInterval(this.pollingIntervalId),this.pollingIntervalId=void 0)}}const ce={local:"http://localhost:3000",preprod:"https://salesforce-back-api-preprod-c9a92f031a95.herokuapp.com",production:"https://salesforce-back-api-f704ca957913.herokuapp.com"}["production"];function It(){return ce}function At(s={}){const e=new y,t=Y({baseUrl:s.apiBaseUrl??It(),timeout:s.apiTimeout??1e4,headers:s.apiHeaders}),o=new Te(t),n=new Le(o,{enableConsoleLog:s.enableConsoleLog??!0}),a=new E,r=new qe(n,a),i=[new he,new ke,new ve];return new fe(e,i,r)}function Tt(s={},e=()=>window.location.href){const t=At(s);let o=null;return{start(n){o=F.subscribe(()=>{t.execute(e()),n?.()})},stop(){o?.(),o=null}}}function Rt(s={},e=()=>window.location.href){const t=new y,o=new me,n=()=>t.parse(e());return new et({getWelcomeMessages:o,getContext:n})}const Lt=ce;function qt(s={},e=()=>window.location.href){const t=Y({baseUrl:s.apiBaseUrl??Lt,timeout:s.apiTimeout??3e4}),o=new y;return new Et({apiClient:t,organizationId:s.organizationId??"00Db0000000ZTFF",getUrl:e,getUserId:()=>o.parse(e()).userId})}function Mt(){return window.location.href.includes("force.com")||window.location.href.includes("salesforce.com")}const $t={matches:["<all_urls>"],main(){if(!Mt())return;console.log("Salesforce Error Detector loaded on:",window.location.href);const s=()=>{console.log("[Salesforce] Attempting to extract org/user IDs...");const a=new y().parse(window.location.href);console.log("[Salesforce] organization_id:",a.orgId,"user_id:",a.userId)};document.readyState==="complete"?(console.log("[Salesforce] Page already complete, waiting 1s for Aura..."),setTimeout(s,1e3)):(console.log("[Salesforce] Waiting for page load..."),window.addEventListener("load",()=>{console.log("[Salesforce] Page loaded, waiting 1s for Aura..."),setTimeout(s,1e3)})),Tt().start(),Rt().start(),qt().start()}};function q(s,...e){}const Bt={debug:(...s)=>q(console.debug,...s),log:(...s)=>q(console.log,...s),warn:(...s)=>q(console.warn,...s),error:(...s)=>q(console.error,...s)};class K extends Event{constructor(e,t){super(K.EVENT_NAME,{}),this.newUrl=e,this.oldUrl=t}static EVENT_NAME=W("wxt:locationchange")}function W(s){return`${D?.runtime?.id}:content:${s}`}function zt(s){let e,t;return{run(){e==null&&(t=new URL(location.href),e=s.setInterval(()=>{let o=new URL(location.href);o.href!==t.href&&(window.dispatchEvent(new K(o,t)),t=o)},1e3))}}}class M{constructor(e,t){this.contentScriptName=e,this.options=t,this.abortController=new AbortController,this.isTopFrame?(this.listenForNewerScripts({ignoreFirstEvent:!0}),this.stopOldScripts()):this.listenForNewerScripts()}static SCRIPT_STARTED_MESSAGE_TYPE=W("wxt:content-script-started");isTopFrame=window.self===window.top;abortController;locationWatcher=zt(this);receivedMessageIds=new Set;get signal(){return this.abortController.signal}abort(e){return this.abortController.abort(e)}get isInvalid(){return D.runtime.id==null&&this.notifyInvalidated(),this.signal.aborted}get isValid(){return!this.isInvalid}onInvalidated(e){return this.signal.addEventListener("abort",e),()=>this.signal.removeEventListener("abort",e)}block(){return new Promise(()=>{})}setInterval(e,t){const o=setInterval(()=>{this.isValid&&e()},t);return this.onInvalidated(()=>clearInterval(o)),o}setTimeout(e,t){const o=setTimeout(()=>{this.isValid&&e()},t);return this.onInvalidated(()=>clearTimeout(o)),o}requestAnimationFrame(e){const t=requestAnimationFrame((...o)=>{this.isValid&&e(...o)});return this.onInvalidated(()=>cancelAnimationFrame(t)),t}requestIdleCallback(e,t){const o=requestIdleCallback((...n)=>{this.signal.aborted||e(...n)},t);return this.onInvalidated(()=>cancelIdleCallback(o)),o}addEventListener(e,t,o,n){t==="wxt:locationchange"&&this.isValid&&this.locationWatcher.run(),e.addEventListener?.(t.startsWith("wxt:")?W(t):t,o,{...n,signal:this.signal})}notifyInvalidated(){this.abort("Content script context invalidated"),Bt.debug(`Content script "${this.contentScriptName}" context invalidated`)}stopOldScripts(){window.postMessage({type:M.SCRIPT_STARTED_MESSAGE_TYPE,contentScriptName:this.contentScriptName,messageId:Math.random().toString(36).slice(2)},"*")}verifyScriptStartedEvent(e){const t=e.data?.type===M.SCRIPT_STARTED_MESSAGE_TYPE,o=e.data?.contentScriptName===this.contentScriptName,n=!this.receivedMessageIds.has(e.data?.messageId);return t&&o&&n}listenForNewerScripts(e){let t=!0;const o=n=>{if(this.verifyScriptStartedEvent(n)){this.receivedMessageIds.add(n.data.messageId);const a=t;if(t=!1,a&&e?.ignoreFirstEvent)return;this.notifyInvalidated()}};addEventListener("message",o),this.onInvalidated(()=>removeEventListener("message",o))}}function jt(){}function $(s,...e){}const Ht={debug:(...s)=>$(console.debug,...s),log:(...s)=>$(console.log,...s),warn:(...s)=>$(console.warn,...s),error:(...s)=>$(console.error,...s)};return(async()=>{try{const{main:s,...e}=$t,t=new M("content",e);return await s(t)}catch(s){throw Ht.error('The content script "content" crashed on startup!',s),s}})()})();
content;