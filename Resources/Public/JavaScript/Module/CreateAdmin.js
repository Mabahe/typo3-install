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
var __extends=this&&this.__extends||function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])};return function(e,n){function r(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}();define(["require","exports","./AbstractInteractableModule","jquery","../Router","./PasswordStrength","TYPO3/CMS/Backend/Modal","TYPO3/CMS/Backend/Notification"],function(t,e,n,r,a,s,o,i){"use strict";return new(function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.selectorAdminCreateButton=".t3js-createAdmin-create",e}return __extends(e,t),e.prototype.initialize=function(t){var e=this;this.currentModal=t,this.getData(),t.on("click",this.selectorAdminCreateButton,function(t){t.preventDefault(),e.create()}),t.on("click",".t3-install-form-password-strength",function(t){s.initialize(".t3-install-form-password-strength")})},e.prototype.getData=function(){var t=this.getModalBody();r.ajax({url:a.getUrl("createAdminGetData"),cache:!1,success:function(e){!0===e.success?(t.empty().append(e.html),o.setButtons(e.buttons)):i.error("Something went wrong")},error:function(e){a.handleAjaxError(e,t)}})},e.prototype.create=function(){var t=this.getModalBody(),e=this.getModuleContent().data("create-admin-token");r.ajax({url:a.getUrl(),method:"POST",data:{install:{action:"createAdmin",token:e,userName:this.findInModal(".t3js-createAdmin-user").val(),userPassword:this.findInModal(".t3js-createAdmin-password").val(),userPasswordCheck:this.findInModal(".t3js-createAdmin-password-check").val(),userSystemMaintainer:this.findInModal(".t3js-createAdmin-system-maintainer").is(":checked")?1:0}},cache:!1,success:function(t){!0===t.success&&Array.isArray(t.status)?t.status.forEach(function(t){2===t.severity?i.error(t.message):i.success(t.title)}):i.error("Something went wrong")},error:function(e){a.handleAjaxError(e,t)}}),this.findInModal(".t3js-createAdmin-user").val(""),this.findInModal(".t3js-createAdmin-password").val(""),this.findInModal(".t3js-createAdmin-password-check").val(""),this.findInModal(".t3js-createAdmin-system-maintainer").prop("checked",!1)},e}(n.AbstractInteractableModule))});