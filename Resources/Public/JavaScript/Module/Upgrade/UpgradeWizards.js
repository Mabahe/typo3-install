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
var __importDefault=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};define(["require","exports","jquery","../AbstractInteractableModule","TYPO3/CMS/Backend/Notification","TYPO3/CMS/Core/Ajax/AjaxRequest","TYPO3/CMS/Core/SecurityUtility","../../Renderable/FlashMessage","../../Renderable/InfoBox","../../Renderable/ProgressBar","../../Renderable/Severity","../../Router","bootstrap"],(function(e,t,s,r,a,i,n,o,d,l,c,p){"use strict";s=__importDefault(s);class h extends r.AbstractInteractableModule{constructor(){super(),this.selectorOutputWizardsContainer=".t3js-upgradeWizards-wizards-output",this.selectorOutputDoneContainer=".t3js-upgradeWizards-done-output",this.selectorWizardsBlockingAddsTemplate=".t3js-upgradeWizards-blocking-adds-template",this.selectorWizardsBlockingAddsRows=".t3js-upgradeWizards-blocking-adds-rows",this.selectorWizardsBlockingAddsExecute=".t3js-upgradeWizards-blocking-adds-execute",this.selectorWizardsBlockingCharsetTemplate=".t3js-upgradeWizards-blocking-charset-template",this.selectorWizardsBlockingCharsetFix=".t3js-upgradeWizards-blocking-charset-fix",this.selectorWizardsDoneBodyTemplate=".t3js-upgradeWizards-done-body-template",this.selectorWizardsDoneRows=".t3js-upgradeWizards-done-rows",this.selectorWizardsDoneRowTemplate=".t3js-upgradeWizards-done-row-template table tr",this.selectorWizardsDoneRowMarkUndone=".t3js-upgradeWizards-done-markUndone",this.selectorWizardsDoneRowTitle=".t3js-upgradeWizards-done-title",this.selectorWizardsListTemplate=".t3js-upgradeWizards-list-template",this.selectorWizardsListRows=".t3js-upgradeWizards-list-rows",this.selectorWizardsListRowTemplate=".t3js-upgradeWizards-list-row-template",this.selectorWizardsListRowTitle=".t3js-upgradeWizards-list-row-title",this.selectorWizardsListRowExplanation=".t3js-upgradeWizards-list-row-explanation",this.selectorWizardsListRowExecute=".t3js-upgradeWizards-list-row-execute",this.selectorWizardsInputTemplate=".t3js-upgradeWizards-input",this.selectorWizardsInputTitle=".t3js-upgradeWizards-input-title",this.selectorWizardsInputDescription=".t3js-upgradeWizards-input-description",this.selectorWizardsInputHtml=".t3js-upgradeWizards-input-html",this.selectorWizardsInputPerform=".t3js-upgradeWizards-input-perform",this.selectorWizardsInputAbort=".t3js-upgradeWizards-input-abort",this.securityUtility=new n}static removeLoadingMessage(e){e.find(".alert-loading").remove()}static renderProgressBar(e){return l.render(c.loading,e,"")}initialize(e){this.currentModal=e,this.getData().then(()=>{this.doneUpgrades()}),e.on("click",this.selectorWizardsDoneRowMarkUndone,e=>{this.markUndone(e.target.dataset.identifier)}),e.on("click",this.selectorWizardsBlockingCharsetFix,()=>{this.blockingUpgradesDatabaseCharsetFix()}),e.on("click",this.selectorWizardsBlockingAddsExecute,()=>{this.blockingUpgradesDatabaseAddsExecute()}),e.on("click",this.selectorWizardsListRowExecute,e=>{this.wizardInput(e.target.dataset.identifier,e.target.dataset.title)}),e.on("click",this.selectorWizardsInputPerform,e=>{this.wizardExecute(e.target.dataset.identifier,e.target.dataset.title)}),e.on("click",this.selectorWizardsInputAbort,e=>{this.findInModal(this.selectorOutputWizardsContainer).empty(),this.wizardsList()})}getData(){const e=this.getModalBody();return new i(p.getUrl("upgradeWizardsGetData")).get({cache:"no-cache"}).then(async t=>{const s=await t.resolve();!0===s.success?(e.empty().append(s.html),this.blockingUpgradesDatabaseCharsetTest()):a.error("Something went wrong","The request was not processed successfully. Please check the browser's console and TYPO3's log.")},e=>{p.handleAjaxError(e)})}blockingUpgradesDatabaseCharsetTest(){const e=this.getModalBody(),t=this.findInModal(this.selectorOutputWizardsContainer);t.empty().html(h.renderProgressBar("Checking database charset...")),new i(p.getUrl("upgradeWizardsBlockingDatabaseCharsetTest")).get({cache:"no-cache"}).then(async s=>{const r=await s.resolve();h.removeLoadingMessage(t),!0===r.success&&(!0===r.needsUpdate?e.find(this.selectorOutputWizardsContainer).append(e.find(this.selectorWizardsBlockingCharsetTemplate)).clone():this.blockingUpgradesDatabaseAdds())},e=>{p.handleAjaxError(e,t)})}blockingUpgradesDatabaseCharsetFix(){const e=s.default(this.selectorOutputWizardsContainer);e.empty().html(h.renderProgressBar("Setting database charset to UTF-8...")),new i(p.getUrl("upgradeWizardsBlockingDatabaseCharsetFix")).get({cache:"no-cache"}).then(async t=>{const s=await t.resolve();if(h.removeLoadingMessage(e),!0===s.success)Array.isArray(s.status)&&s.status.length>0&&s.status.forEach(t=>{const s=d.render(t.severity,t.title,t.message);e.append(s)});else{const t=o.render(c.error,"Something went wrong","");h.removeLoadingMessage(e),e.append(t)}},t=>{p.handleAjaxError(t,e)})}blockingUpgradesDatabaseAdds(){const e=this.getModalBody(),t=this.findInModal(this.selectorOutputWizardsContainer);t.empty().html(h.renderProgressBar("Check for missing mandatory database tables and fields...")),new i(p.getUrl("upgradeWizardsBlockingDatabaseAdds")).get({cache:"no-cache"}).then(async s=>{const r=await s.resolve();if(h.removeLoadingMessage(t),!0===r.success)if(!0===r.needsUpdate){const t=e.find(this.selectorWizardsBlockingAddsTemplate).clone();"object"==typeof r.adds.tables&&r.adds.tables.forEach(e=>{const s="Table: "+this.securityUtility.encodeHtml(e.table);t.find(this.selectorWizardsBlockingAddsRows).append(s,"<br>")}),"object"==typeof r.adds.columns&&r.adds.columns.forEach(e=>{const s="Table: "+this.securityUtility.encodeHtml(e.table)+", Field: "+this.securityUtility.encodeHtml(e.field);t.find(this.selectorWizardsBlockingAddsRows).append(s,"<br>")}),"object"==typeof r.adds.indexes&&r.adds.indexes.forEach(e=>{const s="Table: "+this.securityUtility.encodeHtml(e.table)+", Index: "+this.securityUtility.encodeHtml(e.index);t.find(this.selectorWizardsBlockingAddsRows).append(s,"<br>")}),e.find(this.selectorOutputWizardsContainer).append(t)}else this.wizardsList();else a.error("Something went wrong","The request was not processed successfully. Please check the browser's console and TYPO3's log.")},e=>{p.handleAjaxError(e)})}blockingUpgradesDatabaseAddsExecute(){const e=this.findInModal(this.selectorOutputWizardsContainer);e.empty().html(h.renderProgressBar("Adding database tables and fields...")),new i(p.getUrl("upgradeWizardsBlockingDatabaseExecute")).get({cache:"no-cache"}).then(async t=>{const r=await t.resolve();if(h.removeLoadingMessage(e),Array.isArray(r.status)&&r.status.length>0&&r.status.forEach(t=>{const s=d.render(t.severity,t.title,t.message);e.append(s)}),!0===r.success)this.wizardsList();else if(Array.isArray(r.status)&&0!==r.status.length){const t=s.default('<div class="btn-toolbar mt-3 mb-4"></div>'),r=s.default('<button class="btn btn-default">Retry database migration</button>'),a=s.default('<button class="btn btn-danger">Proceed despite of errors</button>');r.click(()=>{this.blockingUpgradesDatabaseAddsExecute()}),a.click(()=>{t.remove(),this.wizardsList()}),t.append(r),t.append(a),e.append(t)}else{const t=o.render(c.error,"Something went wrong","");e.append(t)}},t=>{p.handleAjaxError(t,e)})}wizardsList(){const e=this.getModalBody(),t=this.findInModal(this.selectorOutputWizardsContainer);t.append(h.renderProgressBar("Loading upgrade wizards...")),new i(p.getUrl("upgradeWizardsList")).get({cache:"no-cache"}).then(async s=>{const r=await s.resolve();h.removeLoadingMessage(t);const i=e.find(this.selectorWizardsListTemplate).clone();if(i.removeClass("t3js-upgradeWizards-list-template"),!0===r.success){let t=0,s=0;Array.isArray(r.wizards)&&r.wizards.length>0&&(s=r.wizards.length,r.wizards.forEach(s=>{if(!0===s.shouldRenderWizard){const r=e.find(this.selectorWizardsListRowTemplate).clone();t+=1,r.removeClass("t3js-upgradeWizards-list-row-template"),r.find(this.selectorWizardsListRowTitle).empty().text(s.title),r.find(this.selectorWizardsListRowExplanation).empty().text(s.explanation),r.find(this.selectorWizardsListRowExecute).attr("data-identifier",s.identifier).attr("data-title",s.title),i.find(this.selectorWizardsListRows).append(r)}}),i.find(this.selectorWizardsListRows+" hr:last").remove());let a=100;const n=i.find(".progress-bar");t>0?a=Math.round((s-t)/r.wizards.length*100):n.removeClass("progress-bar-info").addClass("progress-bar-success"),n.removeClass("progress-bar-striped").css("width",a+"%").attr("aria-valuenow",a).find("span").text(a+"%"),e.find(this.selectorOutputWizardsContainer).append(i),this.findInModal(this.selectorWizardsDoneRowMarkUndone).prop("disabled",!1)}else a.error("Something went wrong","The request was not processed successfully. Please check the browser's console and TYPO3's log.")},e=>{p.handleAjaxError(e)})}wizardInput(e,t){const s=this.getModuleContent().data("upgrade-wizards-input-token"),r=this.getModalBody(),a=this.findInModal(this.selectorOutputWizardsContainer);a.empty().html(h.renderProgressBar('Loading "'+t+'"...')),r.animate({scrollTop:r.scrollTop()-Math.abs(r.find(".t3js-upgrade-status-section").position().top)},250),new i(p.getUrl("upgradeWizardsInput")).post({install:{action:"upgradeWizardsInput",token:s,identifier:e}}).then(async e=>{const t=await e.resolve();a.empty();const s=r.find(this.selectorWizardsInputTemplate).clone();s.removeClass("t3js-upgradeWizards-input"),!0===t.success&&(Array.isArray(t.status)&&t.status.forEach(e=>{const t=o.render(e.severity,e.title,e.message);a.append(t)}),t.userInput.wizardHtml.length>0&&s.find(this.selectorWizardsInputHtml).html(t.userInput.wizardHtml),s.find(this.selectorWizardsInputTitle).text(t.userInput.title),s.find(this.selectorWizardsInputDescription).html(this.securityUtility.stripHtml(t.userInput.description).replace(/\n/g,"<br>")),s.find(this.selectorWizardsInputPerform).attr("data-identifier",t.userInput.identifier).attr("data-title",t.userInput.title)),r.find(this.selectorOutputWizardsContainer).append(s)},e=>{p.handleAjaxError(e,a)})}wizardExecute(e,t){const r=this.getModuleContent().data("upgrade-wizards-execute-token"),n=this.getModalBody(),o={"install[action]":"upgradeWizardsExecute","install[token]":r,"install[identifier]":e};s.default(this.findInModal(this.selectorOutputWizardsContainer+" form").serializeArray()).each((e,t)=>{o[t.name]=t.value});const l=this.findInModal(this.selectorOutputWizardsContainer);l.empty().html(h.renderProgressBar('Executing "'+t+'"...')),this.findInModal(this.selectorWizardsDoneRowMarkUndone).prop("disabled",!0),new i(p.getUrl()).post(o).then(async e=>{const t=await e.resolve();l.empty(),!0===t.success?(Array.isArray(t.status)&&t.status.forEach(e=>{const t=d.render(e.severity,e.title,e.message);l.append(t)}),this.wizardsList(),n.find(this.selectorOutputDoneContainer).empty(),this.doneUpgrades()):a.error("Something went wrong","The request was not processed successfully. Please check the browser's console and TYPO3's log.")},e=>{p.handleAjaxError(e,l)})}doneUpgrades(){const e=this.getModalBody(),t=e.find(this.selectorOutputDoneContainer);t.empty().html(h.renderProgressBar("Loading executed upgrade wizards...")),new i(p.getUrl("upgradeWizardsDoneUpgrades")).get({cache:"no-cache"}).then(async s=>{const r=await s.resolve();if(h.removeLoadingMessage(t),!0===r.success){Array.isArray(r.status)&&r.status.length>0&&r.status.forEach(e=>{const s=d.render(e.severity,e.title,e.message);t.append(s)});const s=e.find(this.selectorWizardsDoneBodyTemplate).clone(),a=s.find(this.selectorWizardsDoneRows);let i=!1;Array.isArray(r.wizardsDone)&&r.wizardsDone.length>0&&r.wizardsDone.forEach(t=>{i=!0;const s=e.find(this.selectorWizardsDoneRowTemplate).clone();s.find(this.selectorWizardsDoneRowMarkUndone).attr("data-identifier",t.identifier),s.find(this.selectorWizardsDoneRowTitle).text(t.title),a.append(s)}),Array.isArray(r.rowUpdatersDone)&&r.rowUpdatersDone.length>0&&r.rowUpdatersDone.forEach(t=>{i=!0;const s=e.find(this.selectorWizardsDoneRowTemplate).clone();s.find(this.selectorWizardsDoneRowMarkUndone).attr("data-identifier",t.identifier),s.find(this.selectorWizardsDoneRowTitle).text(t.title),a.append(s)}),i&&(e.find(this.selectorOutputDoneContainer).append(s),this.findInModal(this.selectorWizardsDoneRowMarkUndone).prop("disabled",!0))}else a.error("Something went wrong","The request was not processed successfully. Please check the browser's console and TYPO3's log.")},e=>{p.handleAjaxError(e,t)})}markUndone(e){const t=this.getModuleContent().data("upgrade-wizards-mark-undone-token"),s=this.getModalBody(),r=this.findInModal(this.selectorOutputDoneContainer);r.empty().html(h.renderProgressBar("Marking upgrade wizard as undone...")),new i(p.getUrl()).post({install:{action:"upgradeWizardsMarkUndone",token:t,identifier:e}}).then(async e=>{const t=await e.resolve();r.empty(),s.find(this.selectorOutputDoneContainer).empty(),!0===t.success&&Array.isArray(t.status)?t.status.forEach(e=>{a.success(e.title,e.message),this.doneUpgrades(),this.blockingUpgradesDatabaseCharsetTest()}):a.error("Something went wrong","The request was not processed successfully. Please check the browser's console and TYPO3's log.")},e=>{p.handleAjaxError(e,r)})}}return new h}));