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
define(["require","exports","jquery","../AbstractInteractableModule","TYPO3/CMS/Backend/Modal","TYPO3/CMS/Backend/Notification","TYPO3/CMS/Core/Ajax/AjaxRequest","../../Router"],(function(t,e,s,a,r,l,o,c){"use strict";class n extends a.AbstractInteractableModule{constructor(){super(...arguments),this.selectorClearTrigger=".t3js-clearTables-clear",this.selectorStatsTrigger=".t3js-clearTables-stats",this.selectorOutputContainer=".t3js-clearTables-output",this.selectorStatContainer=".t3js-clearTables-stat-container",this.selectorStatTemplate=".t3js-clearTables-stat-template",this.selectorStatDescription=".t3js-clearTables-stat-description",this.selectorStatRows=".t3js-clearTables-stat-rows",this.selectorStatName=".t3js-clearTables-stat-name"}initialize(t){this.currentModal=t,this.getStats(),t.on("click",this.selectorStatsTrigger,t=>{t.preventDefault(),s(this.selectorOutputContainer).empty(),this.getStats()}),t.on("click",this.selectorClearTrigger,t=>{const e=s(t.target).closest(this.selectorClearTrigger).data("table");t.preventDefault(),this.clear(e)})}getStats(){this.setModalButtonsState(!1);const t=this.getModalBody();new o(c.getUrl("clearTablesStats")).get({cache:"no-cache"}).then(async e=>{const s=await e.resolve();!0===s.success?(t.empty().append(s.html),r.setButtons(s.buttons),Array.isArray(s.stats)&&s.stats.length>0&&s.stats.forEach(e=>{if(e.rowCount>0){const s=t.find(this.selectorStatTemplate).clone();s.find(this.selectorStatDescription).text(e.description),s.find(this.selectorStatName).text(e.name),s.find(this.selectorStatRows).text(e.rowCount),s.find(this.selectorClearTrigger).attr("data-table",e.name),t.find(this.selectorStatContainer).append(s.html())}})):l.error("Something went wrong")},e=>{c.handleAjaxError(e,t)})}clear(t){const e=this.getModalBody(),s=this.getModuleContent().data("clear-tables-clear-token");new o(c.getUrl()).post({install:{action:"clearTablesClear",token:s,table:t}}).then(async t=>{const e=await t.resolve();!0===e.success&&Array.isArray(e.status)?e.status.forEach(t=>{l.success(t.message)}):l.error("Something went wrong"),this.getStats()},t=>{c.handleAjaxError(t,e)})}}return new n}));