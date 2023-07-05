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
import{AbstractInteractableModule}from"@typo3/install/module/abstract-interactable-module.js";import Modal from"@typo3/backend/modal.js";import AjaxRequest from"@typo3/core/ajax/ajax-request.js";import FlashMessage from"@typo3/install/renderable/flash-message.js";import InfoBox from"@typo3/install/renderable/info-box.js";import ProgressBar from"@typo3/install/renderable/progress-bar.js";import Severity from"@typo3/install/renderable/severity.js";import Router from"@typo3/install/router.js";import RegularEvent from"@typo3/core/event/regular-event.js";class TcaMigrationsCheck extends AbstractInteractableModule{constructor(){super(...arguments),this.selectorCheckTrigger=".t3js-tcaMigrationsCheck-check",this.selectorOutputContainer=".t3js-tcaMigrationsCheck-output"}initialize(e){this.currentModal=e,this.check(),new RegularEvent("click",(e=>{e.preventDefault(),this.check()})).delegateTo(e.get(0),this.selectorCheckTrigger)}check(){this.setModalButtonsState(!1);const e=document.querySelector(this.selectorOutputContainer);null!==e&&e.append(ProgressBar.render(Severity.loading,"Loading...","").get(0));const t=this.getModalBody().get(0);new AjaxRequest(Router.getUrl("tcaMigrationsCheck")).get({cache:"no-cache"}).then((async e=>{const r=await e.resolve();t.innerHTML=r.html,Modal.setButtons(r.buttons),!0===r.success&&Array.isArray(r.status)?r.status.length>0?(t.querySelector(this.selectorOutputContainer).append(InfoBox.render(Severity.warning,"TCA migrations need to be applied","Check the following list and apply needed changes.").get(0)),r.status.forEach((e=>{t.querySelector(this.selectorOutputContainer).append(InfoBox.render(e.severity,e.title,e.message).get(0))}))):t.querySelector(this.selectorOutputContainer).append(InfoBox.render(Severity.ok,"No TCA migrations need to be applied","Your TCA looks good.").get(0)):t.querySelector(this.selectorOutputContainer).append(FlashMessage.render(Severity.error,"Something went wrong",'Use "Check for broken extensions"').get(0)),this.setModalButtonsState(!0)}),(e=>{Router.handleAjaxError(e,t)}))}}export default new TcaMigrationsCheck;