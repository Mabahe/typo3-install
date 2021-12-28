/*
 * This file is part of the TYPO3 CMS project.
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 2
 * of the License, or any later version.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * The TYPO3 project - inspiring people to share!
 */
var __createBinding=this&&this.__createBinding||(Object.create?function(e,t,a,n){void 0===n&&(n=a),Object.defineProperty(e,n,{enumerable:!0,get:function(){return t[a]}})}:function(e,t,a,n){void 0===n&&(n=a),e[n]=t[a]}),__setModuleDefault=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),__importStar=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var a in e)"default"!==a&&Object.prototype.hasOwnProperty.call(e,a)&&__createBinding(t,e,a);return __setModuleDefault(t,e),t},__importDefault=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};define(["require","exports","jquery","TYPO3/CMS/Core/Ajax/AjaxRequest","TYPO3/CMS/Backend/Icons","TYPO3/CMS/Backend/Modal","./Renderable/InfoBox","./Renderable/ProgressBar","./Renderable/Severity"],(function(e,t,a,n,o,l,i,s,r){"use strict";a=__importDefault(a);return new class{constructor(){this.selectorBody=".t3js-body",this.selectorMainContent=".t3js-module-body"}initialize(){this.registerInstallToolRoutes(),(0,a.default)(document).on("click",".t3js-login-lockInstallTool",e=>{e.preventDefault(),this.logout()}),(0,a.default)(document).on("click",".t3js-login-login",e=>{e.preventDefault(),this.login()}),(0,a.default)(document).on("keydown","#t3-install-form-password",e=>{"Enter"===e.key&&(e.preventDefault(),(0,a.default)(".t3js-login-login").trigger("click"))}),(0,a.default)(document).on("click",".card .btn",t=>{t.preventDefault();const n=(0,a.default)(t.currentTarget),i=n.data("require"),s=n.data("inline");if(void 0!==s&&1===parseInt(s,10))new Promise((t,a)=>{e([i],t,a)}).then(__importStar).then(({default:e})=>{e.initialize(n)});else{const t=n.closest(".card").find(".card-title").html(),s=n.data("modalSize")||l.sizes.large,r=l.advanced({type:l.types.default,title:t,size:s,content:(0,a.default)('<div class="modal-loading">'),additionalCssClasses:["install-tool-modal"],callback:t=>{new Promise((t,a)=>{e([i],t,a)}).then(__importStar).then(({default:e})=>{e.initialize(t)})}});o.getIcon("spinner-circle",o.sizes.default,null,null,o.markupIdentifiers.inline).then(e=>{r.find(".modal-loading").append(e)})}});"backend"===(0,a.default)(this.selectorBody).data("context")?this.executeSilentConfigurationUpdate():this.preAccessCheck()}registerInstallToolRoutes(){void 0===TYPO3.settings&&(TYPO3.settings={ajaxUrls:{icons:window.location.origin+window.location.pathname+"?install[controller]=icon&install[action]=getIcon",icons_cache:window.location.origin+window.location.pathname+"?install[controller]=icon&install[action]=getCacheIdentifier"}})}getUrl(e,t,n){const o=(0,a.default)(this.selectorBody).data("context");let l=location.href;return l=l.replace(location.search,""),void 0===t&&(t=(0,a.default)(this.selectorBody).data("controller")),l=l+"?install[controller]="+t,void 0!==o&&""!==o&&(l=l+"&install[context]="+o),void 0!==e&&(l=l+"&install[action]="+e),void 0!==n&&(l=l+"&"+n),l}executeSilentConfigurationUpdate(){this.updateLoadingInfo("Checking session and executing silent configuration update"),new n(this.getUrl("executeSilentConfigurationUpdate","layout")).get({cache:"no-cache"}).then(async e=>{!0===(await e.resolve()).success?this.executeSilentTemplateFileUpdate():this.executeSilentConfigurationUpdate()},e=>{this.handleAjaxError(e)})}executeSilentTemplateFileUpdate(){this.updateLoadingInfo("Checking session and executing silent template file update"),new n(this.getUrl("executeSilentTemplateFileUpdate","layout")).get({cache:"no-cache"}).then(async e=>{!0===(await e.resolve()).success?this.executeSilentExtensionConfigurationSynchronization():this.executeSilentTemplateFileUpdate()},e=>{this.handleAjaxError(e)})}executeSilentExtensionConfigurationSynchronization(){const e=(0,a.default)(this.selectorBody);this.updateLoadingInfo("Executing silent extension configuration synchronization"),new n(this.getUrl("executeSilentExtensionConfigurationSynchronization","layout")).get({cache:"no-cache"}).then(async t=>{if(!0===(await t.resolve()).success)this.loadMainLayout();else{const t=i.render(r.error,"Something went wrong","");e.empty().append(t)}},e=>{this.handleAjaxError(e)})}loadMainLayout(){const e=(0,a.default)(this.selectorBody),t=e.data("controller");this.updateLoadingInfo("Loading main layout"),new n(this.getUrl("mainLayout","layout","install[module]="+t)).get({cache:"no-cache"}).then(async n=>{const o=await n.resolve();if(!0===o.success&&"undefined"!==o.html&&o.html.length>0)e.empty().append(o.html),"backend"!==(0,a.default)(this.selectorBody).data("context")&&e.find('.t3js-modulemenu-action[data-controller="'+t+'"]').addClass("modulemenu-action-active"),this.loadCards();else{const t=i.render(r.error,"Something went wrong","");e.empty().append(t)}},e=>{this.handleAjaxError(e)})}async handleAjaxError(e,t){let n;if(403===e.response.status){"backend"===(0,a.default)(this.selectorBody).data("context")?(n=i.render(r.error,"The install tool session expired. Please reload the backend and try again."),(0,a.default)(this.selectorBody).empty().append(n)):this.checkEnableInstallToolFile()}else{const o=this.getUrl(void 0,"upgrade");n=(0,a.default)('<div class="t3js-infobox callout callout-sm callout-danger"><div class="callout-body"><p>Something went wrong. Please use <b><a href="'+o+'">Check for broken extensions</a></b> to see if a loaded extension breaks this part of the install tool and unload it.</p><p>The box below may additionally reveal further details on what went wrong depending on your debug settings. It may help to temporarily switch to debug mode using <b>Settings > Configuration Presets > Debug settings.</b></p><p>If this error happens at an early state and no full exception back trace is shown, it may also help to manually increase debugging output in <code>typo3conf/LocalConfiguration.php</code>:<code>[\'BE\'][\'debug\'] => true</code>, <code>[\'SYS\'][\'devIPmask\'] => \'*\'</code>, <code>[\'SYS\'][\'displayErrors\'] => 1</code>,<code>[\'SYS\'][\'exceptionalErrors\'] => 12290</code></p></div></div><div class="panel-group" role="tablist" aria-multiselectable="true"><div class="panel panel-default panel-flat searchhit"><div class="panel-heading" role="tab" id="heading-error"><h3 class="panel-title"><a role="button" data-bs-toggle="collapse" data-bs-parent="#accordion" href="#collapse-error" aria-expanded="true" aria-controls="collapse-error" class="collapsed"><span class="caret"></span><strong>Ajax error</strong></a></h3></div><div id="collapse-error" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading-error"><div class="panel-body">'+await e.response.text()+"</div></div></div></div>"),void 0!==t?(0,a.default)(t).empty().html(n):(0,a.default)(this.selectorBody).empty().html(n)}}checkEnableInstallToolFile(){new n(this.getUrl("checkEnableInstallToolFile")).get({cache:"no-cache"}).then(async e=>{!0===(await e.resolve()).success?this.checkLogin():this.showEnableInstallTool()},e=>{this.handleAjaxError(e)})}showEnableInstallTool(){new n(this.getUrl("showEnableInstallToolFile")).get({cache:"no-cache"}).then(async e=>{const t=await e.resolve();!0===t.success&&(0,a.default)(this.selectorBody).empty().append(t.html)},e=>{this.handleAjaxError(e)})}checkLogin(){new n(this.getUrl("checkLogin")).get({cache:"no-cache"}).then(async e=>{!0===(await e.resolve()).success?this.loadMainLayout():this.showLogin()},e=>{this.handleAjaxError(e)})}showLogin(){new n(this.getUrl("showLogin")).get({cache:"no-cache"}).then(async e=>{const t=await e.resolve();!0===t.success&&(0,a.default)(this.selectorBody).empty().append(t.html)},e=>{this.handleAjaxError(e)})}login(){const e=(0,a.default)(".t3js-login-output"),t=s.render(r.loading,"Loading...","");e.empty().html(t),new n(this.getUrl()).post({install:{action:"login",token:(0,a.default)("[data-login-token]").data("login-token"),password:(0,a.default)(".t3-install-form-input-text").val()}}).then(async t=>{const a=await t.resolve();!0===a.success?this.executeSilentConfigurationUpdate():a.status.forEach(t=>{const a=i.render(t.severity,t.title,t.message);e.empty().html(a)})},e=>{this.handleAjaxError(e)})}logout(){new n(this.getUrl("logout")).get({cache:"no-cache"}).then(async e=>{!0===(await e.resolve()).success&&this.showEnableInstallTool()},e=>{this.handleAjaxError(e)})}loadCards(){const e=(0,a.default)(this.selectorMainContent);new n(this.getUrl("cards")).get({cache:"no-cache"}).then(async t=>{const a=await t.resolve();if(!0===a.success&&"undefined"!==a.html&&a.html.length>0)e.empty().append(a.html);else{const t=i.render(r.error,"Something went wrong","");e.empty().append(t)}},e=>{this.handleAjaxError(e)})}updateLoadingInfo(e){(0,a.default)(this.selectorBody).find("#t3js-ui-block-detail").text(e)}preAccessCheck(){this.updateLoadingInfo("Execute pre access check"),new n(this.getUrl("preAccessCheck","layout")).get({cache:"no-cache"}).then(async e=>{const t=await e.resolve();t.installToolLocked?this.checkEnableInstallToolFile():t.isAuthorized?this.executeSilentConfigurationUpdate():this.showLogin()},e=>{this.handleAjaxError(e)})}}}));