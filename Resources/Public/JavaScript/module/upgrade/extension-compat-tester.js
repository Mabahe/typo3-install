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
import"bootstrap";import{AbstractInteractableModule}from"@typo3/install/module/abstract-interactable-module.js";import Modal from"@typo3/backend/modal.js";import Notification from"@typo3/backend/notification.js";import AjaxRequest from"@typo3/core/ajax/ajax-request.js";import{InfoBox}from"@typo3/install/renderable/info-box.js";import Severity from"@typo3/install/renderable/severity.js";import Router from"@typo3/install/router.js";import RegularEvent from"@typo3/core/event/regular-event.js";class ExtensionCompatTester extends AbstractInteractableModule{constructor(){super(...arguments),this.selectorCheckTrigger=".t3js-extensionCompatTester-check",this.selectorUninstallTrigger=".t3js-extensionCompatTester-uninstall",this.selectorOutputContainer=".t3js-extensionCompatTester-output"}initialize(e){super.initialize(e),this.getLoadedExtensionList(),new RegularEvent("click",(()=>{this.findInModal(this.selectorUninstallTrigger)?.classList?.add("hidden"),this.findInModal(this.selectorOutputContainer).innerHTML="",this.getLoadedExtensionList()})).delegateTo(e,this.selectorCheckTrigger),new RegularEvent("click",((e,t)=>{this.uninstallExtension(t.dataset.extension)})).delegateTo(e,this.selectorUninstallTrigger)}getLoadedExtensionList(){this.setModalButtonsState(!1);const e=this.getModalBody(),t=this.findInModal(this.selectorOutputContainer);t&&this.renderProgressBar(t,{},"append"),new AjaxRequest(Router.getUrl("extensionCompatTesterLoadedExtensionList")).get({cache:"no-cache"}).then((async t=>{const o=await t.resolve();e.innerHTML=o.html,Modal.setButtons(o.buttons);const s=this.findInModal(this.selectorOutputContainer);this.renderProgressBar(s,{},"append"),!0===o.success?this.loadExtLocalconf().then((()=>{s.append(InfoBox.create(Severity.ok,"ext_localconf.php of all loaded extensions successfully loaded")),this.loadExtTables().then((()=>{s.append(InfoBox.create(Severity.ok,"ext_tables.php of all loaded extensions successfully loaded"))}),(async e=>{this.renderFailureMessages("ext_tables.php",(await e.response.json()).brokenExtensions,s)})).finally((()=>{this.unlockModal()}))}),(async e=>{this.renderFailureMessages("ext_localconf.php",(await e.response.json()).brokenExtensions,s),s.append(InfoBox.create(Severity.notice,"Skipped scanning ext_tables.php files due to previous errors")),this.unlockModal()})):Notification.error("Something went wrong","The request was not processed successfully. Please check the browser's console and TYPO3's log.")}),(t=>{Router.handleAjaxError(t,e)}))}unlockModal(){this.findInModal(this.selectorOutputContainer).querySelector("typo3-install-progress-bar").remove();const e=this.findInModal(this.selectorCheckTrigger);e.classList.remove("disabled"),e.disabled=!1}renderFailureMessages(e,t,o){for(const s of t){let t;s.isProtected||(t=document.createElement("button"),t.classList.add("btn","btn-danger","t3js-extensionCompatTester-uninstall"),t.dataset.extension=s.name,t.innerText='Uninstall extension "'+s.name+'"'),o.append(InfoBox.create(Severity.error,"Loading "+e+' of extension "'+s.name+'" failed',s.isProtected?"Extension is mandatory and cannot be uninstalled.":""),t)}this.unlockModal()}loadExtLocalconf(){const e=this.getModuleContent().dataset.extensionCompatTesterLoadExt_localconfToken;return new AjaxRequest(Router.getUrl()).post({install:{action:"extensionCompatTesterLoadExtLocalconf",token:e}})}loadExtTables(){const e=this.getModuleContent().dataset.extensionCompatTesterLoadExt_tablesToken;return new AjaxRequest(Router.getUrl()).post({install:{action:"extensionCompatTesterLoadExtTables",token:e}})}uninstallExtension(e){const t=this.getModuleContent().dataset.extensionCompatTesterUninstallExtensionToken,o=this.getModalBody(),s=this.findInModal(this.selectorOutputContainer);this.renderProgressBar(s,{},"append"),new AjaxRequest(Router.getUrl()).post({install:{action:"extensionCompatTesterUninstallExtension",token:t,extension:e}}).then((async e=>{const t=await e.resolve();t.success?(Array.isArray(t.status)&&t.status.forEach((e=>{o.querySelector(this.selectorOutputContainer).replaceChildren(InfoBox.create(e.severity,e.title,e.message))})),this.findInModal(this.selectorUninstallTrigger).classList.add("hidden"),this.getLoadedExtensionList()):Notification.error("Something went wrong","The request was not processed successfully. Please check the browser's console and TYPO3's log.")}),(e=>{Router.handleAjaxError(e,o)}))}}export default new ExtensionCompatTester;