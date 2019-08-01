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
var __extends=this&&this.__extends||function(){var e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var a in t)t.hasOwnProperty(a)&&(e[a]=t[a])};return function(t,a){function n(){this.constructor=t}e(t,a),t.prototype=null===a?Object.create(a):(n.prototype=a.prototype,new n)}}();define(["require","exports","../AbstractInteractableModule","jquery","../../Router","../../Renderable/ProgressBar","../../Renderable/InfoBox","../../Renderable/Severity","TYPO3/CMS/Backend/Modal","TYPO3/CMS/Backend/Notification"],function(e,t,a,n,s,r,o,i,c,l){"use strict";return new(function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.selectorAnalyzeTrigger=".t3js-databaseAnalyzer-analyze",t.selectorExecuteTrigger=".t3js-databaseAnalyzer-execute",t.selectorOutputContainer=".t3js-databaseAnalyzer-output",t.selectorSuggestionBlock=".t3js-databaseAnalyzer-suggestion-block",t.selectorSuggestionList=".t3js-databaseAnalyzer-suggestion-list",t.selectorSuggestionLineTemplate=".t3js-databaseAnalyzer-suggestion-line-template",t}return __extends(t,e),t.prototype.initialize=function(e){var t=this;this.currentModal=e,this.getData(),e.on("click",".t3js-databaseAnalyzer-suggestion-block-checkbox",function(e){var t=n(e.currentTarget);t.closest("fieldset").find(":checkbox").prop("checked",t.get(0).checked)}),e.on("click",this.selectorAnalyzeTrigger,function(e){e.preventDefault(),t.analyze()}),e.on("click",this.selectorExecuteTrigger,function(e){e.preventDefault(),t.execute()})},t.prototype.getData=function(){var e=this,t=this.getModalBody();n.ajax({url:s.getUrl("databaseAnalyzer"),cache:!1,success:function(a){!0===a.success?(t.empty().append(a.html),c.setButtons(a.buttons),e.analyze()):l.error("Something went wrong")},error:function(e){s.handleAjaxError(e,t)}})},t.prototype.analyze=function(){var e=this,t=this.getModalBody(),a=this.getModalFooter(),c=t.find(this.selectorOutputContainer),d=a.find(this.selectorExecuteTrigger),u=a.find(this.selectorAnalyzeTrigger);c.empty().append(r.render(i.loading,"Analyzing current database schema...","")),u.prop("disabled",!0),d.prop("disabled",!0),c.on("change",'input[type="checkbox"]',function(){var e=c.find(":checked").length>0;d.prop("disabled",!e)}),n.ajax({url:s.getUrl("databaseAnalyzerAnalyze"),cache:!1,success:function(a){if(!0===a.success){if(Array.isArray(a.status)&&(c.find(".alert-loading").remove(),a.status.forEach(function(e){var t=o.render(e.severity,e.title,e.message);c.append(t)})),Array.isArray(a.suggestions)){a.suggestions.forEach(function(a){var n=t.find(e.selectorSuggestionBlock).clone();n.removeClass(e.selectorSuggestionBlock.substr(1));var s=a.key;n.find(".t3js-databaseAnalyzer-suggestion-block-legend").text(a.label),n.find(".t3js-databaseAnalyzer-suggestion-block-checkbox").attr("id","t3-install-"+s+"-checkbox"),a.enabled&&n.find(".t3js-databaseAnalyzer-suggestion-block-checkbox").attr("checked","checked"),n.find(".t3js-databaseAnalyzer-suggestion-block-label").attr("for","t3-install-"+s+"-checkbox"),a.children.forEach(function(s){var r=t.find(e.selectorSuggestionLineTemplate).children().clone(),o=s.hash,i=r.find(".t3js-databaseAnalyzer-suggestion-line-checkbox");i.attr("id","t3-install-db-"+o).attr("data-hash",o),a.enabled&&i.attr("checked","checked"),r.find(".t3js-databaseAnalyzer-suggestion-line-label").attr("for","t3-install-db-"+o),r.find(".t3js-databaseAnalyzer-suggestion-line-statement").text(s.statement),void 0!==s.current&&(r.find(".t3js-databaseAnalyzer-suggestion-line-current-value").text(s.current),r.find(".t3js-databaseAnalyzer-suggestion-line-current").show()),void 0!==s.rowCount&&(r.find(".t3js-databaseAnalyzer-suggestion-line-count-value").text(s.rowCount),r.find(".t3js-databaseAnalyzer-suggestion-line-count").show()),n.find(e.selectorSuggestionList).append(r)}),c.append(n.html())});var n=0===c.find(":checked").length;u.prop("disabled",!1),d.prop("disabled",n)}0===a.suggestions.length&&0===a.status.length&&c.append(o.render(i.ok,"Database schema is up to date. Good job!",""))}else l.error("Something went wrong")},error:function(e){s.handleAjaxError(e,t)}})},t.prototype.execute=function(){var e=this,t=this.getModalBody(),a=this.getModuleContent().data("database-analyzer-execute-token"),o=t.find(this.selectorOutputContainer),c=[];o.find(".t3js-databaseAnalyzer-suggestion-line input:checked").each(function(e,t){c.push(n(t).data("hash"))}),o.empty().append(r.render(i.loading,"Executing database updates...","")),t.find(this.selectorExecuteTrigger).prop("disabled",!0),t.find(this.selectorAnalyzeTrigger).prop("disabled",!0),n.ajax({url:s.getUrl(),method:"POST",data:{install:{action:"databaseAnalyzerExecute",token:a,hashes:c}},cache:!1,success:function(t){!0===t.success&&Array.isArray(t.status)&&t.status.forEach(function(e){l.showMessage(e.title,e.message,e.severity)}),e.analyze()},error:function(e){s.handleAjaxError(e,t)}})},t}(a.AbstractInteractableModule))});