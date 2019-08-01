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
var __extends=this&&this.__extends||function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])};return function(e,n){function r(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}();define(["require","exports","../AbstractInteractableModule","jquery","../../Router","TYPO3/CMS/Backend/Modal","TYPO3/CMS/Backend/Notification","bootstrap"],function(t,e,n,r,o,a,s){"use strict";return new(function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.selectorActivateTrigger=".t3js-presets-activate",e.selectorImageExecutable=".t3js-presets-image-executable",e.selectorImageExecutableTrigger=".t3js-presets-image-executable-trigger",e}return __extends(e,t),e.prototype.initialize=function(t){var e=this;this.currentModal=t,this.getContent(),t.on("click",this.selectorImageExecutableTrigger,function(t){t.preventDefault(),e.getCustomImagePathContent()}),t.on("click",this.selectorActivateTrigger,function(t){t.preventDefault(),e.activate()}),t.find(".t3js-custom-preset").on("input",".t3js-custom-preset",function(t){r("#"+r(t.currentTarget).data("radio")).prop("checked",!0)})},e.prototype.getContent=function(){var t=this.getModalBody();r.ajax({url:o.getUrl("presetsGetContent"),cache:!1,success:function(e){!0===e.success&&"undefined"!==e.html&&e.html.length>0?(t.empty().append(e.html),a.setButtons(e.buttons)):s.error("Something went wrong")},error:function(e){o.handleAjaxError(e,t)}})},e.prototype.getCustomImagePathContent=function(){var t=this.getModalBody(),e=this.getModuleContent().data("presets-content-token");r.ajax({url:o.getUrl(),method:"POST",data:{install:{token:e,action:"presetsGetContent",values:{Image:{additionalSearchPath:this.findInModal(this.selectorImageExecutable).val()}}}},cache:!1,success:function(e){!0===e.success&&"undefined"!==e.html&&e.html.length>0?t.empty().append(e.html):s.error("Something went wrong")},error:function(e){o.handleAjaxError(e,t)}})},e.prototype.activate=function(){var t=this.getModalBody(),e=this.getModuleContent().data("presets-activate-token"),n={};r(this.findInModal("form").serializeArray()).each(function(t,e){n[e.name]=e.value}),n["install[action]"]="presetsActivate",n["install[token]"]=e,r.ajax({url:o.getUrl(),method:"POST",data:n,cache:!1,success:function(t){!0===t.success&&Array.isArray(t.status)?t.status.forEach(function(t){s.showMessage(t.title,t.message,t.severity)}):s.error("Something went wrong")},error:function(e){o.handleAjaxError(e,t)}})},e}(n.AbstractInteractableModule))});