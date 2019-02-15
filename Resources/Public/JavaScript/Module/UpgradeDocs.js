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
define(["require","exports","jquery","../Router","TYPO3/CMS/Backend/Notification","bootstrap"],function(e,t,n,o,a){"use strict";return new(function(){function t(){this.selectorModalBody=".t3js-modal-body",this.selectorModuleContent=".t3js-module-content",this.selectorRestFileItem=".upgrade_analysis_item_to_filter",this.selectorFulltextSearch=".t3js-upgradeDocs-fulltext-search",this.selectorChosenField=".t3js-upgradeDocs-chosen-select",this.selectorChangeLogsForVersionContainer=".t3js-version-changes",this.selectorChangeLogsForVersion=".t3js-changelog-list"}return t.trimExplodeAndUnique=function(e,t){for(var o=[],a=t.split(e),r=0;r<a.length;r++){var i=a[r].trim();i.length>0&&-1===n.inArray(i,o)&&o.push(i)}return o},t.prototype.initialize=function(t){var n=this;this.currentModal=t,window.location!==window.parent.location?top.require(["TYPO3/CMS/Install/chosen.jquery.min"],function(){n.getContent()}):e(["TYPO3/CMS/Install/chosen.jquery.min"],function(){n.getContent()}),t.on("click",".t3js-upgradeDocs-markRead",function(e){n.markRead(e.target)}),t.on("click",".t3js-upgradeDocs-unmarkRead",function(e){n.unmarkRead(e.target)}),jQuery.expr[":"].contains=jQuery.expr.createPseudo(function(e){return function(t){return jQuery(t).text().toUpperCase().indexOf(e.toUpperCase())>=0}}),e(["jquery.clearable"],function(){t.find(n.selectorFulltextSearch).clearable().focus()})},t.prototype.getContent=function(){var e=this,t=this.currentModal.find(this.selectorModalBody);n.ajax({url:o.getUrl("upgradeDocsGetContent"),cache:!1,success:function(n){!0===n.success&&"undefined"!==n.html&&n.html.length>0&&(t.empty().append(n.html),e.initializeFullTextSearch(),e.initializeChosenSelector(),e.loadChangelogs())},error:function(e){o.handleAjaxError(e,t)}})},t.prototype.loadChangelogs=function(){var e=this,t=[],r=this.currentModal.find(this.selectorModalBody);this.currentModal.find(this.selectorChangeLogsForVersionContainer).each(function(i,s){var l=n.ajax({url:o.getUrl("upgradeDocsGetChangelogForVersion"),cache:!1,data:{install:{version:s.dataset.version}},success:function(t){if(!0===t.success){var o=n(s),r=o.find(e.selectorChangeLogsForVersion);r.html(t.html),e.renderTags(r),e.moveNotRelevantDocuments(r),o.find(".t3js-panel-loading").remove()}else a.error("Something went wrong")},error:function(e){o.handleAjaxError(e,r)}});t.push(l)}),n.when.apply(n,t).done(function(){e.fulltextSearchField.prop("disabled",!1),e.appendItemsToChosenSelector()})},t.prototype.initializeFullTextSearch=function(){var e=this;this.fulltextSearchField=this.currentModal.find(this.selectorFulltextSearch),this.fulltextSearchField.clearable().focus(),this.initializeChosenSelector(),this.fulltextSearchField.on("keyup",function(){e.combinedFilterSearch()})},t.prototype.initializeChosenSelector=function(){var e=this;this.chosenField=this.currentModal.find(this.selectorModalBody).find(this.selectorChosenField);var t={".chosen-select":{width:"100%",placeholder_text_multiple:"tags"},".chosen-select-deselect":{allow_single_deselect:!0},".chosen-select-no-single":{disable_search_threshold:10},".chosen-select-no-results":{no_results_text:"Oops, nothing found!"},".chosen-select-width":{width:"100%"}};for(var n in t)t.hasOwnProperty(n)&&this.currentModal.find(n).chosen(t[n]);this.chosenField.on("change",function(){e.combinedFilterSearch()})},t.prototype.appendItemsToChosenSelector=function(){var e=this,o="";n(this.currentModal.find(this.selectorRestFileItem)).each(function(e,t){o+=n(t).data("item-tags")+","});var a=t.trimExplodeAndUnique(",",o).sort(function(e,t){return e.toLowerCase().localeCompare(t.toLowerCase())});this.chosenField.prop("disabled",!1),n.each(a,function(t,o){e.chosenField.append(n("<option>").text(o))}),this.chosenField.trigger("chosen:updated")},t.prototype.combinedFilterSearch=function(){var e=this.currentModal.find(this.selectorModalBody),t=e.find("div.item");if(this.chosenField.val().length<1&&this.fulltextSearchField.val().length<1)return n(".panel-version:not(:first) > .panel-collapse").collapse("hide"),t.removeClass("hidden searchhit filterhit"),!1;if(t.addClass("hidden").removeClass("searchhit filterhit"),this.chosenField.val().length>0){t.addClass("hidden").removeClass("filterhit");var o=[],a=[];n.each(this.chosenField.val(),function(e,t){var n='[data-item-tags*="'+t+'"]';t.indexOf(":")>0?o.push(n):a.push(n)});var r=a.join(""),i=[];if(o.length)for(var s=0;s<o.length;s++)i.push(r+o[s]);else i.push(r);var l=i.join(",");e.find(l).removeClass("hidden").addClass("searchhit filterhit")}else t.addClass("filterhit").removeClass("hidden");var d=this.fulltextSearchField.val();return e.find("div.item.filterhit").each(function(e,t){var o=n(t);n(":contains("+d+")",o).length>0||n('input[value*="'+d+'"]',o).length>0?o.removeClass("hidden").addClass("searchhit"):o.removeClass("searchhit").addClass("hidden")}),e.find(".searchhit").closest(".panel-collapse").collapse("show"),e.find(".panel-version").each(function(e,t){var o=n(t);o.find(".searchhit",".filterhit").length<1&&o.find(" > .panel-collapse").collapse("hide")}),!0},t.prototype.renderTags=function(e){n.each(e.find(this.selectorRestFileItem),function(e,t){var o=n(t),a=o.data("item-tags").split(","),r=o.find(".t3js-tags");a.forEach(function(e){r.append(n("<span />",{class:"label"}).text(e))})})},t.prototype.moveNotRelevantDocuments=function(e){e.find('[data-item-state="read"]').appendTo(this.currentModal.find(".panel-body-read")),e.find('[data-item-state="notAffected"]').appendTo(this.currentModal.find(".panel-body-not-affected"))},t.prototype.markRead=function(e){var t=this.currentModal.find(this.selectorModalBody),a=this.currentModal.find(this.selectorModuleContent).data("upgrade-docs-mark-read-token"),r=n(e).closest("a");r.toggleClass("t3js-upgradeDocs-unmarkRead t3js-upgradeDocs-markRead"),r.find("i").toggleClass("fa-check fa-ban"),r.closest(".panel").appendTo(this.currentModal.find(".panel-body-read")),n.ajax({method:"POST",url:o.getUrl(),data:{install:{ignoreFile:r.data("filepath"),token:a,action:"upgradeDocsMarkRead"}},error:function(e){o.handleAjaxError(e,t)}})},t.prototype.unmarkRead=function(e){var t=this.currentModal.find(this.selectorModalBody),a=this.currentModal.find(this.selectorModuleContent).data("upgrade-docs-unmark-read-token"),r=n(e).closest("a"),i=r.closest(".panel").data("item-version");r.toggleClass("t3js-upgradeDocs-markRead t3js-upgradeDocs-unmarkRead"),r.find("i").toggleClass("fa-check fa-ban"),r.closest(".panel").appendTo(this.currentModal.find('*[data-group-version="'+i+'"] .panel-body')),n.ajax({method:"POST",url:o.getUrl(),data:{install:{ignoreFile:r.data("filepath"),token:a,action:"upgradeDocsUnmarkRead"}},error:function(e){o.handleAjaxError(e,t)}})},t}())});