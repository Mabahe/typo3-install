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
import"bootstrap";import{AbstractInteractableModule}from"@typo3/install/module/abstract-interactable-module.js";import Modal from"@typo3/backend/modal.js";import Notification from"@typo3/backend/notification.js";import AjaxRequest from"@typo3/core/ajax/ajax-request.js";import{InfoBox}from"@typo3/install/renderable/info-box.js";import Severity from"@typo3/install/renderable/severity.js";import Router from"@typo3/install/router.js";import RegularEvent from"@typo3/core/event/regular-event.js";var Identifiers;!function(e){e.checkTrigger=".t3js-extensionCompatTester-check",e.uninstallTrigger=".t3js-extensionCompatTester-uninstall",e.outputContainer=".t3js-extensionCompatTester-output"}(Identifiers||(Identifiers={}));class ExtensionCompatTester extends AbstractInteractableModule{initialize(e){super.initialize(e),this.getLoadedExtensionList(),new RegularEvent("click",(()=>{this.findInModal(Identifiers.uninstallTrigger)?.classList?.add("hidden"),this.findInModal(Identifiers.outputContainer).innerHTML="",this.getLoadedExtensionList()})).delegateTo(e,Identifiers.checkTrigger),new RegularEvent("click",((e,t)=>{this.uninstallExtension(t.dataset.extension)})).delegateTo(e,Identifiers.uninstallTrigger)}getLoadedExtensionList(){this.setModalButtonsState(!1);const e=this.getModalBody(),t=this.findInModal(Identifiers.outputContainer);t&&this.renderProgressBar(t,{},"append"),new AjaxRequest(Router.getUrl("extensionCompatTesterLoadedExtensionList")).get({cache:"no-cache"}).then((async t=>{const n=await t.resolve();e.innerHTML=n.html,Modal.setButtons(n.buttons);const o=this.findInModal(Identifiers.outputContainer);this.renderProgressBar(o,{},"append"),!0===n.success?this.loadExtLocalconf().then((()=>{o.append(InfoBox.create(Severity.ok,"ext_localconf.php of all loaded extensions successfully loaded")),this.loadExtTables().then((()=>{o.append(InfoBox.create(Severity.ok,"ext_tables.php of all loaded extensions successfully loaded"))}),(async e=>{this.renderFailureMessages("ext_tables.php",(await e.response.json()).brokenExtensions,o)})).finally((()=>{this.unlockModal()}))}),(async e=>{this.renderFailureMessages("ext_localconf.php",(await e.response.json()).brokenExtensions,o),o.append(InfoBox.create(Severity.notice,"Skipped scanning ext_tables.php files due to previous errors")),this.unlockModal()})):Notification.error("Something went wrong","The request was not processed successfully. Please check the browser's console and TYPO3's log.")}),(t=>{Router.handleAjaxError(t,e)}))}unlockModal(){this.findInModal(Identifiers.outputContainer).querySelector("typo3-install-progress-bar").remove();const e=this.findInModal(Identifiers.checkTrigger);e.classList.remove("disabled"),e.disabled=!1}renderFailureMessages(e,t,n){for(const o of t){let t;o.isProtected||(t=document.createElement("button"),t.classList.add("btn","btn-danger","t3js-extensionCompatTester-uninstall"),t.dataset.extension=o.name,t.innerText='Uninstall extension "'+o.name+'"'),n.append(InfoBox.create(Severity.error,"Loading "+e+' of extension "'+o.name+'" failed',o.isProtected?"Extension is mandatory and cannot be uninstalled.":""),t)}this.unlockModal()}loadExtLocalconf(){const e=this.getModuleContent().dataset.extensionCompatTesterLoadExt_localconfToken;return new AjaxRequest(Router.getUrl()).post({install:{action:"extensionCompatTesterLoadExtLocalconf",token:e}})}loadExtTables(){const e=this.getModuleContent().dataset.extensionCompatTesterLoadExt_tablesToken;return new AjaxRequest(Router.getUrl()).post({install:{action:"extensionCompatTesterLoadExtTables",token:e}})}uninstallExtension(e){const t=this.getModuleContent().dataset.extensionCompatTesterUninstallExtensionToken,n=this.getModalBody(),o=this.findInModal(Identifiers.outputContainer);this.renderProgressBar(o,{},"append"),new AjaxRequest(Router.getUrl()).post({install:{action:"extensionCompatTesterUninstallExtension",token:t,extension:e}}).then((async e=>{const t=await e.resolve();t.success?(Array.isArray(t.status)&&t.status.forEach((e=>{n.querySelector(Identifiers.outputContainer).replaceChildren(InfoBox.create(e.severity,e.title,e.message))})),this.findInModal(Identifiers.uninstallTrigger).classList.add("hidden"),this.getLoadedExtensionList()):Notification.error("Something went wrong","The request was not processed successfully. Please check the browser's console and TYPO3's log.")}),(e=>{Router.handleAjaxError(e,n)}))}}export default new ExtensionCompatTester;