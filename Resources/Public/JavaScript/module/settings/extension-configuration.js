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
import"bootstrap";import"@typo3/install/renderable/clearable.js";import"@typo3/install/renderable/wrap-group.js";import"@typo3/install/renderable/offset-group.js";import{AbstractInteractableModule}from"@typo3/install/module/abstract-interactable-module.js";import ModuleMenu from"@typo3/backend/module-menu.js";import Notification from"@typo3/backend/notification.js";import AjaxRequest from"@typo3/core/ajax/ajax-request.js";import Router from"@typo3/install/router.js";import{topLevelModuleImport}from"@typo3/backend/utility/top-level-module-import.js";import RegularEvent from"@typo3/core/event/regular-event.js";import{Collapse}from"bootstrap";import DebounceEvent from"@typo3/core/event/debounce-event.js";class ExtensionConfiguration extends AbstractInteractableModule{constructor(){super(...arguments),this.selectorFormListener=".t3js-extensionConfiguration-form",this.selectorSearchInput=".t3js-extensionConfiguration-search"}initialize(e){super.initialize(e),this.getContent(),new RegularEvent("keydown",(t=>{const o=e.querySelector(this.selectorSearchInput);t.ctrlKey||t.metaKey?"KeyF"===t.code&&(t.preventDefault(),o.focus()):"Escape"===t.code&&(t.preventDefault(),o.value="",o.focus())})).bindTo(e),new DebounceEvent("input",((e,t)=>{const o=t.value;this.search(o)}),100).delegateTo(e,this.selectorSearchInput),new RegularEvent("change",((e,t)=>{const o=t.value;this.search(o)})).delegateTo(e,this.selectorSearchInput),new RegularEvent("submit",((e,t)=>{e.preventDefault(),this.write(t)})).delegateTo(e,this.selectorFormListener)}search(e){this.currentModal.querySelectorAll(".search-item").forEach((t=>{""===e||t.textContent.toLowerCase().trim().includes(e.toLowerCase())?(t.classList.add("searchhit"),t.classList.remove("hidden")):(t.classList.remove("searchhit"),t.classList.add("hidden"))})),this.currentModal.querySelectorAll(".searchhit").forEach((e=>{Collapse.getOrCreateInstance(e).show()}))}getContent(){const e=this.getModalBody();new AjaxRequest(Router.getUrl("extensionConfigurationGetContent")).get({cache:"no-cache"}).then((async t=>{const o=await t.resolve();!0===o.success&&(e.innerHTML=o.html,e.querySelector(this.selectorSearchInput).clearable(),this.initializeWrap(),this.initializeColorPicker())}),(t=>{Router.handleAjaxError(t,e)}))}initializeColorPicker(){window.location!==window.parent.location?topLevelModuleImport("@typo3/backend/color-picker.js").then((({default:e})=>{parent.document.querySelectorAll(".t3js-color-input").forEach((t=>e.initialize(t)))})):import("@typo3/backend/color-picker.js").then((({default:e})=>{document.querySelectorAll(".t3js-color-input").forEach((t=>e.initialize(t)))}))}write(e){const t=this.getModalBody(),o=this.getModuleContent().dataset.extensionConfigurationWriteToken,r={};for(const[t,o]of new FormData(e))r[t]=o.toString();new AjaxRequest(Router.getUrl()).post({install:{token:o,action:"extensionConfigurationWrite",extensionKey:e.dataset.extensionKey,extensionConfiguration:r}}).then((async e=>{const t=await e.resolve();!0===t.success&&Array.isArray(t.status)?(t.status.forEach((e=>{Notification.showMessage(e.title,e.message,e.severity)})),"backend"===document.body.dataset.context&&ModuleMenu.App.refreshMenu()):Notification.error("Something went wrong","The request was not processed successfully. Please check the browser's console and TYPO3's log.")}),(e=>{Router.handleAjaxError(e,t)}))}initializeWrap(){window.location!==window.parent.location&&(topLevelModuleImport("@typo3/install/renderable/wrap-group.js"),topLevelModuleImport("@typo3/install/renderable/offset-group.js")),this.currentModal.querySelectorAll(".t3js-emconf-offset").forEach((e=>{const t=e.parentElement;e.setAttribute("data-offsetfield-x","#"+e.id+"_offset_x"),e.setAttribute("data-offsetfield-y","#"+e.id+"_offset_y"),e.classList.add("hidden");const o=t.ownerDocument.createElement("typo3-install-offset-group");o.offsetId=e.id,o.values=e.value.split(","),t.appendChild(o),t.querySelectorAll(".t3js-emconf-offsetfield").forEach((e=>{new RegularEvent("keyup",(e=>{const o=t.querySelector(e.currentTarget.dataset.target);o.value=t.querySelector(o.dataset.offsetfieldX).value+","+t.querySelector(o.dataset.offsetfieldY).value})).bindTo(e)}))})),this.currentModal.querySelectorAll(".t3js-emconf-wrap").forEach((e=>{const t=e.parentElement;e.setAttribute("data-wrapfield-start","#"+e.id+"_wrap_start"),e.setAttribute("data-wrapfield-end","#"+e.id+"_wrap_end"),e.classList.add("hidden");const o=t.ownerDocument.createElement("typo3-install-wrap-group");o.wrapId=e.id,o.values=e.value.split("|"),t.appendChild(o),t.querySelectorAll(".t3js-emconf-wrapfield").forEach((e=>{new RegularEvent("keyup",(e=>{const o=t.querySelector(e.currentTarget.dataset.target);o.value=t.querySelector(o.dataset.wrapfieldStart).value+"|"+t.querySelector(o.dataset.wrapfieldEnd).value})).bindTo(e)}))}))}}export default new ExtensionConfiguration;