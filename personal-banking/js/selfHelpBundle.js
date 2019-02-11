/**
 * @license AngularJS v1.5.11
 * (c) 2010-2017 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular) {'use strict';

/**
 * @ngdoc module
 * @name ngCookies
 * @description
 *
 * # ngCookies
 *
 * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
 *
 *
 * <div doc-module-components="ngCookies"></div>
 *
 * See {@link ngCookies.$cookies `$cookies`} for usage.
 */


angular.module('ngCookies', ['ng']).
  /**
   * @ngdoc provider
   * @name $cookiesProvider
   * @description
   * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
   * */
   provider('$cookies', [/** @this */function $CookiesProvider() {
    /**
     * @ngdoc property
     * @name $cookiesProvider#defaults
     * @description
     *
     * Object containing default options to pass when setting cookies.
     *
     * The object may have following properties:
     *
     * - **path** - `{string}` - The cookie will be available only for this path and its
     *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
     * - **domain** - `{string}` - The cookie will be available only for this domain and
     *   its sub-domains. For security reasons the user agent will not accept the cookie
     *   if the current domain is not a sub-domain of this domain or equal to it.
     * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
     *   or a Date object indicating the exact date/time this cookie will expire.
     * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
     *   secured connection.
     *
     * Note: By default, the address that appears in your `<base>` tag will be used as the path.
     * This is important so that cookies will be visible for all routes when html5mode is enabled.
     *
     * @example
     *
     * ```js
     * angular.module('cookiesProviderExample', ['ngCookies'])
     *   .config(['$cookiesProvider', function($cookiesProvider) {
     *     // Setting default options
     *     $cookiesProvider.defaults.domain = 'foo.com';
     *     $cookiesProvider.defaults.secure = true;
     *   }]);
     * ```
     **/
    var defaults = this.defaults = {};

    function calcOptions(options) {
      return options ? angular.extend({}, defaults, options) : defaults;
    }

    /**
     * @ngdoc service
     * @name $cookies
     *
     * @description
     * Provides read/write access to browser's cookies.
     *
     * <div class="alert alert-info">
     * Up until Angular 1.3, `$cookies` exposed properties that represented the
     * current browser cookie values. In version 1.4, this behavior has changed, and
     * `$cookies` now provides a standard api of getters, setters etc.
     * </div>
     *
     * Requires the {@link ngCookies `ngCookies`} module to be installed.
     *
     * @example
     *
     * ```js
     * angular.module('cookiesExample', ['ngCookies'])
     *   .controller('ExampleController', ['$cookies', function($cookies) {
     *     // Retrieving a cookie
     *     var favoriteCookie = $cookies.get('myFavorite');
     *     // Setting a cookie
     *     $cookies.put('myFavorite', 'oatmeal');
     *   }]);
     * ```
     */
    this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
      return {
        /**
         * @ngdoc method
         * @name $cookies#get
         *
         * @description
         * Returns the value of given cookie key
         *
         * @param {string} key Id to use for lookup.
         * @returns {string} Raw cookie value.
         */
        get: function(key) {
          return $$cookieReader()[key];
        },

        /**
         * @ngdoc method
         * @name $cookies#getObject
         *
         * @description
         * Returns the deserialized value of given cookie key
         *
         * @param {string} key Id to use for lookup.
         * @returns {Object} Deserialized cookie value.
         */
        getObject: function(key) {
          var value = this.get(key);
          return value ? angular.fromJson(value) : value;
        },

        /**
         * @ngdoc method
         * @name $cookies#getAll
         *
         * @description
         * Returns a key value object with all the cookies
         *
         * @returns {Object} All cookies
         */
        getAll: function() {
          return $$cookieReader();
        },

        /**
         * @ngdoc method
         * @name $cookies#put
         *
         * @description
         * Sets a value for given cookie key
         *
         * @param {string} key Id for the `value`.
         * @param {string} value Raw value to be stored.
         * @param {Object=} options Options object.
         *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
         */
        put: function(key, value, options) {
          $$cookieWriter(key, value, calcOptions(options));
        },

        /**
         * @ngdoc method
         * @name $cookies#putObject
         *
         * @description
         * Serializes and sets a value for given cookie key
         *
         * @param {string} key Id for the `value`.
         * @param {Object} value Value to be stored.
         * @param {Object=} options Options object.
         *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
         */
        putObject: function(key, value, options) {
          this.put(key, angular.toJson(value), options);
        },

        /**
         * @ngdoc method
         * @name $cookies#remove
         *
         * @description
         * Remove given cookie
         *
         * @param {string} key Id of the key-value pair to delete.
         * @param {Object=} options Options object.
         *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
         */
        remove: function(key, options) {
          $$cookieWriter(key, undefined, calcOptions(options));
        }
      };
    }];
  }]);

angular.module('ngCookies').
/**
 * @ngdoc service
 * @name $cookieStore
 * @deprecated
 * sinceVersion="v1.4.0"
 * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
 *
 * @requires $cookies
 *
 * @description
 * Provides a key-value (string-object) storage, that is backed by session cookies.
 * Objects put or retrieved from this storage are automatically serialized or
 * deserialized by angular's toJson/fromJson.
 *
 * Requires the {@link ngCookies `ngCookies`} module to be installed.
 *
 * @example
 *
 * ```js
 * angular.module('cookieStoreExample', ['ngCookies'])
 *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
 *     // Put cookie
 *     $cookieStore.put('myFavorite','oatmeal');
 *     // Get cookie
 *     var favoriteCookie = $cookieStore.get('myFavorite');
 *     // Removing a cookie
 *     $cookieStore.remove('myFavorite');
 *   }]);
 * ```
 */
 factory('$cookieStore', ['$cookies', function($cookies) {

    return {
      /**
       * @ngdoc method
       * @name $cookieStore#get
       *
       * @description
       * Returns the value of given cookie key
       *
       * @param {string} key Id to use for lookup.
       * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
       */
      get: function(key) {
        return $cookies.getObject(key);
      },

      /**
       * @ngdoc method
       * @name $cookieStore#put
       *
       * @description
       * Sets a value for given cookie key
       *
       * @param {string} key Id for the `value`.
       * @param {Object} value Value to be stored.
       */
      put: function(key, value) {
        $cookies.putObject(key, value);
      },

      /**
       * @ngdoc method
       * @name $cookieStore#remove
       *
       * @description
       * Remove given cookie
       *
       * @param {string} key Id of the key-value pair to delete.
       */
      remove: function(key) {
        $cookies.remove(key);
      }
    };

  }]);

/**
 * @name $$cookieWriter
 * @requires $document
 *
 * @description
 * This is a private service for writing cookies
 *
 * @param {string} name Cookie name
 * @param {string=} value Cookie value (if undefined, cookie will be deleted)
 * @param {Object=} options Object with options that need to be stored for the cookie.
 */
function $$CookieWriter($document, $log, $browser) {
  var cookiePath = $browser.baseHref();
  var rawDocument = $document[0];

  function buildCookieString(name, value, options) {
    var path, expires;
    options = options || {};
    expires = options.expires;
    path = angular.isDefined(options.path) ? options.path : cookiePath;
    if (angular.isUndefined(value)) {
      expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
      value = '';
    }
    if (angular.isString(expires)) {
      expires = new Date(expires);
    }

    var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    str += path ? ';path=' + path : '';
    str += options.domain ? ';domain=' + options.domain : '';
    str += expires ? ';expires=' + expires.toUTCString() : '';
    str += options.secure ? ';secure' : '';

    // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
    // - 300 cookies
    // - 20 cookies per unique domain
    // - 4096 bytes per cookie
    var cookieLength = str.length + 1;
    if (cookieLength > 4096) {
      $log.warn('Cookie \'' + name +
        '\' possibly not set or overflowed because it was too large (' +
        cookieLength + ' > 4096 bytes)!');
    }

    return str;
  }

  return function(name, value, options) {
    rawDocument.cookie = buildCookieString(name, value, options);
  };
}

$$CookieWriter.$inject = ['$document', '$log', '$browser'];

angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
  this.$get = $$CookieWriter;
});


})(window, window.angular);

/*
 * ngDialog - easy modals and popup windows
 * http://github.com/likeastore/ngDialog
 * (c) 2013-2015 MIT License, https://likeastore.com
 */

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        // CommonJS
        if (typeof angular === 'undefined') {
            factory(require('angular'));
        } else {
            factory(angular);
        }
        module.exports = 'ngDialog';
    } else if (typeof define === 'function' && define.amd) {
        // AMD
        define(['angular'], factory);
    } else {
        // Global Variables
        factory(root.angular);
    }
}(this, function (angular) {
    'use strict';

    var m = angular.module('ngDialog', []);

    var $el = angular.element;
    var isDef = angular.isDefined;
    var style = (document.body || document.documentElement).style;
    var animationEndSupport = isDef(style.animation) || isDef(style.WebkitAnimation) || isDef(style.MozAnimation) || isDef(style.MsAnimation) || isDef(style.OAnimation);
    var animationEndEvent = 'animationend webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend';
    var focusableElementSelector = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]';
    var disabledAnimationClass = 'ngdialog-disabled-animation';
    var forceElementsReload = { html: false, body: false };
    var scopes = {};
    var openIdStack = [];
    var activeBodyClasses = [];
    var keydownIsBound = false;
    var openOnePerName = false;
    var closeByNavigationDialogStack = [];

    var UI_ROUTER_VERSION_LEGACY = 'legacy';
    var UI_ROUTER_VERSION_ONE_PLUS = '1.0.0+';

    m.provider('ngDialog', function () {
        var defaults = this.defaults = {
            className: 'ngdialog-theme-default',
            appendClassName: '',
            disableAnimation: false,
            plain: false,
            showClose: true,
            closeByDocument: true,
            closeByEscape: true,
            closeByNavigation: false,
            appendTo: false,
            preCloseCallback: false,
            onOpenCallback: false,
            overlay: true,
            cache: true,
            trapFocus: true,
            preserveFocus: true,
            ariaAuto: true,
            ariaRole: null,
            ariaLabelledById: null,
            ariaLabelledBySelector: null,
            ariaDescribedById: null,
            ariaDescribedBySelector: null,
            bodyClassName: 'ngdialog-open',
            width: null,
            height: null
        };

        this.setForceHtmlReload = function (_useIt) {
            forceElementsReload.html = _useIt || false;
        };

        this.setForceBodyReload = function (_useIt) {
            forceElementsReload.body = _useIt || false;
        };

        this.setDefaults = function (newDefaults) {
            angular.extend(defaults, newDefaults);
        };

        this.setOpenOnePerName = function (isOpenOne) {
            openOnePerName = isOpenOne || false;
        };

        var globalID = 0, dialogsCount = 0, closeByDocumentHandler, defers = {};

        this.$get = ['$document', '$templateCache', '$compile', '$q', '$http', '$rootScope', '$timeout', '$window', '$controller', '$injector',
            function ($document, $templateCache, $compile, $q, $http, $rootScope, $timeout, $window, $controller, $injector) {
                var $elements = [];

                var privateMethods = {
                    onDocumentKeydown: function (event) {
                        if (event.keyCode === 27) {
                            publicMethods.close('$escape');
                        }
                    },

                    activate: function($dialog) {
                        var options = $dialog.data('$ngDialogOptions');

                        if (options.trapFocus) {
                            $dialog.on('keydown', privateMethods.onTrapFocusKeydown);

                            // Catch rogue changes (eg. after unfocusing everything by clicking a non-focusable element)
                            $elements.body.on('keydown', privateMethods.onTrapFocusKeydown);
                        }
                    },

                    deactivate: function ($dialog) {
                        $dialog.off('keydown', privateMethods.onTrapFocusKeydown);
                        $elements.body.off('keydown', privateMethods.onTrapFocusKeydown);
                    },

                    deactivateAll: function (els) {
                        angular.forEach(els,function(el) {
                            var $dialog = angular.element(el);
                            privateMethods.deactivate($dialog);
                        });
                    },

                    setBodyPadding: function (width) {
                        var originalBodyPadding = parseInt(($elements.body.css('padding-right') || 0), 10);
                        $elements.body.css('padding-right', (originalBodyPadding + width) + 'px');
                        $elements.body.data('ng-dialog-original-padding', originalBodyPadding);
                        $rootScope.$broadcast('ngDialog.setPadding', width);
                    },

                    resetBodyPadding: function () {
                        var originalBodyPadding = $elements.body.data('ng-dialog-original-padding');
                        if (originalBodyPadding) {
                            $elements.body.css('padding-right', originalBodyPadding + 'px');
                        } else {
                            $elements.body.css('padding-right', '');
                        }
                        $rootScope.$broadcast('ngDialog.setPadding', 0);
                    },

                    performCloseDialog: function ($dialog, value) {
                        var options = $dialog.data('$ngDialogOptions');
                        var id = $dialog.attr('id');
                        var scope = scopes[id];
                        privateMethods.deactivate($dialog);

                        if (!scope) {
                            // Already closed
                            return;
                        }

                        if (typeof $window.Hammer !== 'undefined') {
                            var hammerTime = scope.hammerTime;
                            hammerTime.off('tap', closeByDocumentHandler);
                            hammerTime.destroy && hammerTime.destroy();
                            delete scope.hammerTime;
                        } else {
                            $dialog.unbind('click');
                        }

                        if (dialogsCount === 1) {
                            $elements.body.unbind('keydown', privateMethods.onDocumentKeydown);
                        }

                        if (!$dialog.hasClass('ngdialog-closing')){
                            dialogsCount -= 1;
                        }

                        var previousFocus = $dialog.data('$ngDialogPreviousFocus');
                        if (previousFocus && previousFocus.focus) {
                            previousFocus.focus();
                        }

                        $rootScope.$broadcast('ngDialog.closing', $dialog, value);
                        dialogsCount = dialogsCount < 0 ? 0 : dialogsCount;
                        if (animationEndSupport && !options.disableAnimation) {
                            scope.$destroy();
                            $dialog.unbind(animationEndEvent).bind(animationEndEvent, function () {
                                privateMethods.closeDialogElement($dialog, value);
                            }).addClass('ngdialog-closing');
                        } else {
                            scope.$destroy();
                            privateMethods.closeDialogElement($dialog, value);
                        }
                        if (defers[id]) {
                            defers[id].resolve({
                                id: id,
                                value: value,
                                $dialog: $dialog,
                                remainingDialogs: dialogsCount
                            });
                            delete defers[id];
                        }
                        if (scopes[id]) {
                            delete scopes[id];
                        }
                        openIdStack.splice(openIdStack.indexOf(id), 1);
                        if (!openIdStack.length) {
                            $elements.body.unbind('keydown', privateMethods.onDocumentKeydown);
                            keydownIsBound = false;
                        }

                        if (dialogsCount == 0)
                        {
                            closeByDocumentHandler = undefined;
                        }
                    },

                    closeDialogElement: function($dialog, value) {
                        var options = $dialog.data('$ngDialogOptions');
                        $dialog.remove();

                        activeBodyClasses.splice(activeBodyClasses.indexOf(options.bodyClassName), 1);
                        if (activeBodyClasses.indexOf(options.bodyClassName) === -1) {
                            $elements.html.removeClass(options.bodyClassName);
                            $elements.body.removeClass(options.bodyClassName);
                        }

                        if (dialogsCount === 0) {
                            privateMethods.resetBodyPadding();
                        }

                        $rootScope.$broadcast('ngDialog.closed', $dialog, value);
                    },

                    closeDialog: function ($dialog, value) {
                        var preCloseCallback = $dialog.data('$ngDialogPreCloseCallback');

                        if (preCloseCallback && angular.isFunction(preCloseCallback)) {

                            var preCloseCallbackResult = preCloseCallback.call($dialog, value);

                            if (angular.isObject(preCloseCallbackResult)) {
                                if (preCloseCallbackResult.closePromise) {
                                    preCloseCallbackResult.closePromise.then(function () {
                                        privateMethods.performCloseDialog($dialog, value);
                                    }, function () {
                                        return false;
                                    });
                                } else {
                                    preCloseCallbackResult.then(function () {
                                        privateMethods.performCloseDialog($dialog, value);
                                    }, function () {
                                        return false;
                                    });
                                }
                            } else if (preCloseCallbackResult !== false) {
                                privateMethods.performCloseDialog($dialog, value);
                            } else {
                                return false;
                            }
                        } else {
                            privateMethods.performCloseDialog($dialog, value);
                        }
                    },

                    onTrapFocusKeydown: function(ev) {
                        var el = angular.element(ev.currentTarget);
                        var $dialog;

                        if (el.hasClass('ngdialog')) {
                            $dialog = el;
                        } else {
                            $dialog = privateMethods.getActiveDialog();

                            if ($dialog === null) {
                                return;
                            }
                        }

                        var isTab = (ev.keyCode === 9);
                        var backward = (ev.shiftKey === true);

                        if (isTab) {
                            privateMethods.handleTab($dialog, ev, backward);
                        }
                    },

                    handleTab: function($dialog, ev, backward) {
                        var focusableElements = privateMethods.getFocusableElements($dialog);

                        if (focusableElements.length === 0) {
                            if (document.activeElement && document.activeElement.blur) {
                                document.activeElement.blur();
                            }
                            return;
                        }

                        var currentFocus = document.activeElement;
                        var focusIndex = Array.prototype.indexOf.call(focusableElements, currentFocus);

                        var isFocusIndexUnknown = (focusIndex === -1);
                        var isFirstElementFocused = (focusIndex === 0);
                        var isLastElementFocused = (focusIndex === focusableElements.length - 1);

                        var cancelEvent = false;

                        if (backward) {
                            if (isFocusIndexUnknown || isFirstElementFocused) {
                                focusableElements[focusableElements.length - 1].focus();
                                cancelEvent = true;
                            }
                        } else {
                            if (isFocusIndexUnknown || isLastElementFocused) {
                                focusableElements[0].focus();
                                cancelEvent = true;
                            }
                        }

                        if (cancelEvent) {
                            ev.preventDefault();
                            ev.stopPropagation();
                        }
                    },

                    autoFocus: function($dialog) {
                        var dialogEl = $dialog[0];

                        // Browser's (Chrome 40, Forefix 37, IE 11) don't appear to honor autofocus on the dialog, but we should
                        var autoFocusEl = dialogEl.querySelector('*[autofocus]');
                        if (autoFocusEl !== null) {
                            autoFocusEl.focus();

                            if (document.activeElement === autoFocusEl) {
                                return;
                            }

                            // Autofocus element might was display: none, so let's continue
                        }

                        var focusableElements = privateMethods.getFocusableElements($dialog);

                        if (focusableElements.length > 0) {
                            focusableElements[0].focus();
                            return;
                        }

                        // We need to focus something for the screen readers to notice the dialog
                        var contentElements = privateMethods.filterVisibleElements(dialogEl.querySelectorAll('h1,h2,h3,h4,h5,h6,p,span'));

                        if (contentElements.length > 0) {
                            var contentElement = contentElements[0];
                            $el(contentElement).attr('tabindex', '-1').css('outline', '0');
                            contentElement.focus();
                        }
                    },

                    getFocusableElements: function ($dialog) {
                        var dialogEl = $dialog[0];

                        var rawElements = dialogEl.querySelectorAll(focusableElementSelector);

                        // Ignore untabbable elements, ie. those with tabindex = -1
                        var tabbableElements = privateMethods.filterTabbableElements(rawElements);

                        return privateMethods.filterVisibleElements(tabbableElements);
                    },

                    filterTabbableElements: function (els) {
                        var tabbableFocusableElements = [];

                        for (var i = 0; i < els.length; i++) {
                            var el = els[i];

                            if ($el(el).attr('tabindex') !== '-1') {
                                tabbableFocusableElements.push(el);
                            }
                        }

                        return tabbableFocusableElements;
                    },

                    filterVisibleElements: function (els) {
                        var visibleFocusableElements = [];

                        for (var i = 0; i < els.length; i++) {
                            var el = els[i];

                            if (el.offsetWidth > 0 || el.offsetHeight > 0) {
                                visibleFocusableElements.push(el);
                            }
                        }

                        return visibleFocusableElements;
                    },

                    getActiveDialog: function () {
                        var dialogs = document.querySelectorAll('.ngdialog');

                        if (dialogs.length === 0) {
                            return null;
                        }

                        // TODO: This might be incorrect if there are a mix of open dialogs with different 'appendTo' values
                        return $el(dialogs[dialogs.length - 1]);
                    },

                    applyAriaAttributes: function ($dialog, options) {
                        if (options.ariaAuto) {
                            if (!options.ariaRole) {
                                var detectedRole = (privateMethods.getFocusableElements($dialog).length > 0) ?
                                    'dialog' :
                                    'alertdialog';

                                options.ariaRole = detectedRole;
                            }

                            if (!options.ariaLabelledBySelector) {
                                options.ariaLabelledBySelector = 'h1,h2,h3,h4,h5,h6';
                            }

                            if (!options.ariaDescribedBySelector) {
                                options.ariaDescribedBySelector = 'article,section,p';
                            }
                        }

                        if (options.ariaRole) {
                            $dialog.attr('role', options.ariaRole);
                        }

                        privateMethods.applyAriaAttribute(
                            $dialog, 'aria-labelledby', options.ariaLabelledById, options.ariaLabelledBySelector);

                        privateMethods.applyAriaAttribute(
                            $dialog, 'aria-describedby', options.ariaDescribedById, options.ariaDescribedBySelector);
                    },

                    applyAriaAttribute: function($dialog, attr, id, selector) {
                        if (id) {
                            $dialog.attr(attr, id);
                            return;
                        }

                        if (selector) {
                            var dialogId = $dialog.attr('id');

                            var firstMatch = $dialog[0].querySelector(selector);

                            if (!firstMatch) {
                                return;
                            }

                            var generatedId = dialogId + '-' + attr;

                            $el(firstMatch).attr('id', generatedId);

                            $dialog.attr(attr, generatedId);

                            return generatedId;
                        }
                    },

                    detectUIRouter: function() {
                        // Detect if ui-router module is installed
                        // Returns ui-router version string if installed
                        // Otherwise false

                        if ($injector.has('$transitions')) {
                            // Only 1.0.0+ ui.router allows us to inject $transitions
                            return UI_ROUTER_VERSION_ONE_PLUS;
                        }
                        else if ($injector.has('$state')) {
                            // The legacy ui.router allows us to inject $state
                            return UI_ROUTER_VERSION_LEGACY;
                        }
                        return false;
                    },

                    getRouterLocationEventName: function() {
                        if (privateMethods.detectUIRouter()) {
                            return '$stateChangeStart';
                        }
                        return '$locationChangeStart';
                    }
                };

                var publicMethods = {
                    __PRIVATE__: privateMethods,

                    /*
                     * @param {Object} options:
                     * - template {String} - id of ng-template, url for partial, plain string (if enabled)
                     * - plain {Boolean} - enable plain string templates, default false
                     * - scope {Object}
                     * - controller {String}
                     * - controllerAs {String}
                     * - className {String} - dialog theme class
                     * - appendClassName {String} - dialog theme class to be appended to defaults
                     * - disableAnimation {Boolean} - set to true to disable animation
                     * - showClose {Boolean} - show close button, default true
                     * - closeByEscape {Boolean} - default true
                     * - closeByDocument {Boolean} - default true
                     * - preCloseCallback {String|Function} - user supplied function name/function called before closing dialog (if set)
                     * - onOpenCallback {String|Function} - user supplied function name/function called after opening dialog (if set)
                     * - bodyClassName {String} - class added to body at open dialog
                     * @return {Object} dialog
                     */
                    open: function (opts) {
                        var dialogID = null;
                        opts = opts || {};
                        if (openOnePerName && opts.name) {
                            dialogID = opts.name.toLowerCase().replace(/\s/g, '-') + '-dialog';
                            if (this.isOpen(dialogID)) {
                                return;
                            }
                        }
                        var options = angular.copy(defaults);
                        var localID = ++globalID;
                        dialogID = dialogID || 'ngdialog' + localID;
                        openIdStack.push(dialogID);

                        // Merge opts.data with predefined via setDefaults
                        if (typeof options.data !== 'undefined') {
                            if (typeof opts.data === 'undefined') {
                                opts.data = {};
                            }
                            opts.data = angular.merge(angular.copy(options.data), opts.data);
                        }

                        angular.extend(options, opts);

                        var defer;
                        defers[dialogID] = defer = $q.defer();

                        var scope;
                        scopes[dialogID] = scope = angular.isObject(options.scope) ? options.scope.$new() : $rootScope.$new();

                        var $dialog, $dialogParent, $dialogContent;

                        var resolve = angular.extend({}, options.resolve);

                        angular.forEach(resolve, function (value, key) {
                            resolve[key] = angular.isString(value) ? $injector.get(value) : $injector.invoke(value, null, null, key);
                        });

                        $q.all({
                            template: loadTemplate(options.template || options.templateUrl),
                            locals: $q.all(resolve)
                        }).then(function (setup) {
                            var template = setup.template,
                                locals = setup.locals;

                            if (options.showClose) {
                                template += '<button aria-label="Dismiss" class="ngdialog-close"></button>';
                            }

                            var hasOverlayClass = options.overlay ? '' : ' ngdialog-no-overlay';
                            $dialog = $el('<div id="' + dialogID + '" class="ngdialog' + hasOverlayClass + '"></div>');
                            $dialog.html((options.overlay ?
                                '<div class="ngdialog-overlay"></div><div class="ngdialog-content" role="document">' + template + '</div>' :
                                '<div class="ngdialog-content" role="document">' + template + '</div>'));

                            $dialog.data('$ngDialogOptions', options);

                            scope.ngDialogId = dialogID;

                            if (options.data && angular.isString(options.data)) {
                                var firstLetter = options.data.replace(/^\s*/, '')[0];
                                scope.ngDialogData = (firstLetter === '{' || firstLetter === '[') ? angular.fromJson(options.data) : new String(options.data);
                                scope.ngDialogData.ngDialogId = dialogID;
                            } else if (options.data && angular.isObject(options.data)) {
                                scope.ngDialogData = options.data;
                                scope.ngDialogData.ngDialogId = dialogID;
                            }

                            if (options.className) {
                                $dialog.addClass(options.className);
                            }

                            if (options.appendClassName) {
                                $dialog.addClass(options.appendClassName);
                            }

                            if (options.width) {
                                $dialogContent = $dialog[0].querySelector('.ngdialog-content');
                                if (angular.isString(options.width)) {
                                    $dialogContent.style.width = options.width;
                                } else {
                                    $dialogContent.style.width = options.width + 'px';
                                }
                            }

                            if (options.height) {
                                $dialogContent = $dialog[0].querySelector('.ngdialog-content');
                                if (angular.isString(options.height)) {
                                    $dialogContent.style.height = options.height;
                                } else {
                                    $dialogContent.style.height = options.height + 'px';
                                }
                            }

                            if (options.disableAnimation) {
                                $dialog.addClass(disabledAnimationClass);
                            }

                            if (options.appendTo && angular.isString(options.appendTo)) {
                                $dialogParent = angular.element(document.querySelector(options.appendTo));
                            } else {
                                $dialogParent = $elements.body;
                            }

                            privateMethods.applyAriaAttributes($dialog, options);

                            [
                                { name: '$ngDialogPreCloseCallback', value: options.preCloseCallback },
                                { name: '$ngDialogOnOpenCallback', value: options.onOpenCallback }
                            ].forEach(function (option) {
                                if (option.value) {
                                    var callback;

                                    if (angular.isFunction(option.value)) {
                                        callback = option.value;
                                    } else if (angular.isString(option.value)) {
                                        if (scope) {
                                            if (angular.isFunction(scope[option.value])) {
                                                callback = scope[option.value];
                                            } else if (scope.$parent && angular.isFunction(scope.$parent[option.value])) {
                                                callback = scope.$parent[option.value];
                                            } else if ($rootScope && angular.isFunction($rootScope[option.value])) {
                                                callback = $rootScope[option.value];
                                            }
                                        }
                                    }

                                    if (callback) {
                                        $dialog.data(option.name, callback);
                                    }
                                }
                            });

                            scope.closeThisDialog = function (value) {
                                privateMethods.closeDialog($dialog, value);
                            };

                            if (options.controller && (angular.isString(options.controller) || angular.isArray(options.controller) || angular.isFunction(options.controller))) {

                                var label;

                                if (options.controllerAs && angular.isString(options.controllerAs)) {
                                    label = options.controllerAs;
                                }

                                var controllerInstance = $controller(options.controller, angular.extend(
                                    locals,
                                    {
                                        $scope: scope,
                                        $element: $dialog
                                    }),
                                    true,
                                    label
                                );

                                if(options.bindToController) {
                                    angular.extend(controllerInstance.instance, {ngDialogId: scope.ngDialogId, ngDialogData: scope.ngDialogData, closeThisDialog: scope.closeThisDialog, confirm: scope.confirm});
                                }

                                if(typeof controllerInstance === 'function'){
                                    $dialog.data('$ngDialogControllerController', controllerInstance());
                                } else {
                                    $dialog.data('$ngDialogControllerController', controllerInstance);
                                }
                            }

                            $timeout(function () {
                                var $activeDialogs = document.querySelectorAll('.ngdialog');
                                privateMethods.deactivateAll($activeDialogs);

                                $compile($dialog)(scope);
                                var widthDiffs = $window.innerWidth - $elements.body.prop('clientWidth');
                                $elements.html.addClass(options.bodyClassName);
                                $elements.body.addClass(options.bodyClassName);
                                activeBodyClasses.push(options.bodyClassName);
                                var scrollBarWidth = widthDiffs - ($window.innerWidth - $elements.body.prop('clientWidth'));
                                if (scrollBarWidth > 0) {
                                    privateMethods.setBodyPadding(scrollBarWidth);
                                }
                                $dialogParent.append($dialog);

                                privateMethods.activate($dialog);

                                if (options.trapFocus) {
                                    privateMethods.autoFocus($dialog);
                                }

                                if (options.name) {
                                    $rootScope.$broadcast('ngDialog.opened', {dialog: $dialog, name: options.name});
                                } else {
                                    $rootScope.$broadcast('ngDialog.opened', $dialog);
                                }
                                var onOpenCallback = $dialog.data('$ngDialogOnOpenCallback');
                                if (onOpenCallback && angular.isFunction(onOpenCallback)) {
                                    onOpenCallback.call($dialog);
                                }

                            });

                            if (!keydownIsBound) {
                                $elements.body.bind('keydown', privateMethods.onDocumentKeydown);
                                keydownIsBound = true;
                            }

                            if (options.closeByNavigation) {
                                closeByNavigationDialogStack.push($dialog);
                            }

                            if (options.preserveFocus) {
                                $dialog.data('$ngDialogPreviousFocus', document.activeElement);
                            }

                            closeByDocumentHandler = function (event) {
                                var isOverlay = options.closeByDocument ? $el(event.target).hasClass('ngdialog-overlay') : false;
                                var isCloseBtn = $el(event.target).hasClass('ngdialog-close');

                                if (isOverlay || isCloseBtn) {
                                    publicMethods.close($dialog.attr('id'), isCloseBtn ? '$closeButton' : '$document');
                                }
                            };

                            if (typeof $window.Hammer !== 'undefined') {
                                var hammerTime = scope.hammerTime = $window.Hammer($dialog[0]);
                                hammerTime.on('tap', closeByDocumentHandler);
                            } else {
                                $dialog.bind('click', closeByDocumentHandler);
                            }

                            dialogsCount += 1;

                            return publicMethods;
                        });

                        return {
                            id: dialogID,
                            closePromise: defer.promise,
                            close: function (value) {
                                privateMethods.closeDialog($dialog, value);
                            }
                        };

                        function loadTemplateUrl (tmpl, config) {
                            var config = config || {};
                            config.headers = config.headers || {};

                            angular.extend(config.headers, {'Accept': 'text/html'});

                            $rootScope.$broadcast('ngDialog.templateLoading', tmpl);
                            return $http.get(tmpl, config).then(function(res) {
                                $rootScope.$broadcast('ngDialog.templateLoaded', tmpl);
                                return res.data || '';
                            });
                        }

                        function loadTemplate (tmpl) {
                            if (!tmpl) {
                                return 'Empty template';
                            }

                            if (angular.isString(tmpl) && options.plain) {
                                return tmpl;
                            }

                            if (typeof options.cache === 'boolean' && !options.cache) {
                                return loadTemplateUrl(tmpl, {cache: false});
                            }

                            return loadTemplateUrl(tmpl, {cache: $templateCache});
                        }
                    },

                    /*
                     * @param {Object} options:
                     * - template {String} - id of ng-template, url for partial, plain string (if enabled)
                     * - plain {Boolean} - enable plain string templates, default false
                     * - name {String}
                     * - scope {Object}
                     * - controller {String}
                     * - controllerAs {String}
                     * - className {String} - dialog theme class
                     * - appendClassName {String} - dialog theme class to be appended to defaults
                     * - showClose {Boolean} - show close button, default true
                     * - closeByEscape {Boolean} - default false
                     * - closeByDocument {Boolean} - default false
                     * - preCloseCallback {String|Function} - user supplied function name/function called before closing dialog (if set); not called on confirm
                     * - bodyClassName {String} - class added to body at open dialog
                     *
                     * @return {Object} dialog
                     */
                    openConfirm: function (opts) {
                        var defer = $q.defer();
                        var options = angular.copy(defaults);

                        opts = opts || {};

                        // Merge opts.data with predefined via setDefaults
                        if (typeof options.data !== 'undefined') {
                            if (typeof opts.data === 'undefined') {
                                opts.data = {};
                            }
                            opts.data = angular.merge(angular.copy(options.data), opts.data);
                        }

                        angular.extend(options, opts);

                        options.scope = angular.isObject(options.scope) ? options.scope.$new() : $rootScope.$new();
                        options.scope.confirm = function (value) {
                            defer.resolve(value);
                            var $dialog = $el(document.getElementById(openResult.id));
                            privateMethods.performCloseDialog($dialog, value);
                        };

                        var openResult = publicMethods.open(options);
                        if (openResult) {
                            openResult.closePromise.then(function (data) {
                                if (data) {
                                    return defer.reject(data.value);
                                }
                                return defer.reject();
                            });
                            return defer.promise;
                        }
                    },

                    isOpen: function(id) {
                        var $dialog = $el(document.getElementById(id));
                        return $dialog.length > 0;
                    },

                    /*
                     * @param {String} id
                     * @return {Object} dialog
                     */
                    close: function (id, value) {
                        var $dialog = $el(document.getElementById(id));

                        if ($dialog.length) {
                            privateMethods.closeDialog($dialog, value);
                        } else {
                            if (id === '$escape') {
                                var topDialogId = openIdStack[openIdStack.length - 1];
                                $dialog = $el(document.getElementById(topDialogId));
                                if ($dialog.data('$ngDialogOptions').closeByEscape) {
                                    privateMethods.closeDialog($dialog, '$escape');
                                }
                            } else {
                                publicMethods.closeAll(value);
                            }
                        }

                        return publicMethods;
                    },

                    closeAll: function (value) {
                        var $all = document.querySelectorAll('.ngdialog');

                        // Reverse order to ensure focus restoration works as expected
                        for (var i = $all.length - 1; i >= 0; i--) {
                            var dialog = $all[i];
                            privateMethods.closeDialog($el(dialog), value);
                        }
                    },

                    getOpenDialogs: function() {
                        return openIdStack;
                    },

                    getDefaults: function () {
                        return defaults;
                    }
                };

                angular.forEach(
                    ['html', 'body'],
                    function(elementName) {
                        $elements[elementName] = $document.find(elementName);
                        if (forceElementsReload[elementName]) {
                            var eventName = privateMethods.getRouterLocationEventName();
                            $rootScope.$on(eventName, function () {
                                $elements[elementName] = $document.find(elementName);
                            });
                        }
                    }
                );

                // Listen to navigation events to close dialog
                var uiRouterVersion = privateMethods.detectUIRouter();
                if (uiRouterVersion === UI_ROUTER_VERSION_ONE_PLUS) {
                    var $transitions = $injector.get('$transitions');
                    $transitions.onStart({}, function (trans) {
                        while (closeByNavigationDialogStack.length > 0) {
                            var toCloseDialog = closeByNavigationDialogStack.pop();
                            if (privateMethods.closeDialog(toCloseDialog) === false) {
                                return false;
                            }
                        }
                    });
                }
                else {
                    var eventName = uiRouterVersion === UI_ROUTER_VERSION_LEGACY ? '$stateChangeStart' : '$locationChangeStart';
                    $rootScope.$on(eventName, function ($event) {
                        while (closeByNavigationDialogStack.length > 0) {
                            var toCloseDialog = closeByNavigationDialogStack.pop();
                            if (privateMethods.closeDialog(toCloseDialog) === false) {
                                $event.preventDefault();
                            }
                        }
                    });
                }

                return publicMethods;
            }];
    });

    m.directive('ngDialog', ['ngDialog', function (ngDialog) {
        return {
            restrict: 'A',
            scope: {
                ngDialogScope: '='
            },
            link: function (scope, elem, attrs) {
                elem.on('click', function (e) {
                    e.preventDefault();

                    var ngDialogScope = angular.isDefined(scope.ngDialogScope) ? scope.ngDialogScope : 'noScope';
                    angular.isDefined(attrs.ngDialogClosePrevious) && ngDialog.close(attrs.ngDialogClosePrevious);

                    var defaults = ngDialog.getDefaults();

                    ngDialog.open({
                        template: attrs.ngDialog,
                        className: attrs.ngDialogClass || defaults.className,
                        appendClassName: attrs.ngDialogAppendClass,
                        controller: attrs.ngDialogController,
                        controllerAs: attrs.ngDialogControllerAs,
                        bindToController: attrs.ngDialogBindToController,
                        disableAnimation: attrs.ngDialogDisableAnimation,
                        scope: ngDialogScope,
                        data: attrs.ngDialogData,
                        showClose: attrs.ngDialogShowClose === 'false' ? false : (attrs.ngDialogShowClose === 'true' ? true : defaults.showClose),
                        closeByDocument: attrs.ngDialogCloseByDocument === 'false' ? false : (attrs.ngDialogCloseByDocument === 'true' ? true : defaults.closeByDocument),
                        closeByEscape: attrs.ngDialogCloseByEscape === 'false' ? false : (attrs.ngDialogCloseByEscape === 'true' ? true : defaults.closeByEscape),
                        overlay: attrs.ngDialogOverlay === 'false' ? false : (attrs.ngDialogOverlay === 'true' ? true : defaults.overlay),
                        preCloseCallback: attrs.ngDialogPreCloseCallback || defaults.preCloseCallback,
                        onOpenCallback: attrs.ngDialogOnOpenCallback || defaults.onOpenCallback,
                        bodyClassName: attrs.ngDialogBodyClass || defaults.bodyClassName
                    });
                });
            }
        };
    }]);

    return m;
}));

angular.module('SelfHelp', ['ngRoute', 'ngDialog', 'ngCookies', 'SelfHelp.config']);

angular.module('tdctRedesign').requires.push('SelfHelp');


angular.module("SelfHelp.config", [])
.constant("Config", {"searchPath":"/ca/en/personal-banking/search/","endpoints":{"suggestions":"/ca/en/personal-banking/kb/predictionsOnTerms/","answer":"/ca/en/personal-banking/kb/responseAnswer/","topQuestions":"/ca/en/personal-banking/kb/topAskedQuestions/?interfaceID=:interfaceId&sessionID=:sessionId&sourceID=4","singleAnswer":"/ca/en/personal-banking/kb/description/","gsaSearch":"/ca/en/personal-banking/gsa/search/?q=:query&lang=en","gsaSuggestion":"/ca/en/personal-banking/gsa/suggest?token=:query&lang=:language","contact":"/ca/en/personal-banking/system/assets/contactus.json","helpCentre":"/ca/en/personal-banking/system/assets/helpcentre.json","chatSettings":"/ca/en/personal-banking/system/assets/askaquestion.json","getSession":"/ca/en/personal-banking/kb/getSession/?interfaceID=:interfaceId","gsaSuggestions":"/ca/en/personal-banking/gsa/suggest/?token=:query&lang=:language","emailList":"/ca/en/personal-banking/system/assets/emailforms.json","topSearchTerms":"/ca/en/personal-banking/system/assets/topsearchterms.json","rateResponse":"/ca/en/personal-banking/kb/rateResponse/"},"language":"en"});

function questionCtrl($routeParams, Backend) {
    var self = this;

    this.query = $routeParams.query;

    this.search = function(query, source) {
        this.showPopularTopics = false;
        this.answer = null;
        Backend.getSearchResult(query, source).then(function(answer) {
            if (!answer.title && !answer.multiAnswer) {
                self.showPopularTopics = true;
            }
            if (answer.title == self.query) {
                answer.exactTitleMatch = true;
            }
            self.answer = answer;
        });
    }

    if ($routeParams.query) {
        this.search($routeParams.query);
    }

    if (this.query) this.search(this.query);
}

angular.module('SelfHelp').component('question', {
    templateUrl: '/ca/en/personal-banking/selfHelpComponents/question.html',
    controller: questionCtrl
});

'use strict';

function searchCtrl($rootScope, $routeParams, $window, $scope, $timeout, $q, Backend, Config, QueryParams) {
    var self = this;
    var sourceId;
    var questionId;
    var params = QueryParams.getParams();

    this.buildSearchUrl = QueryParams.buildSearchUrl;

    this.search = function(query) {
        $q.all({answer: Backend.getSearchResult(query, sourceId, questionId), search: Backend.getGsaSearchResults(query)}).then(function(data) {
            var answer = data.answer;
            self.loaded = true;
            if (data.search.synonyms) {
                self.synonyms = data.search.synonyms;
            }
            self.result = answer;
            if (answer.related) {
                answer.related = answer.related.splice(0, 3);
            }
            if (data.search.results) {
                self.results = data.search.results;
            }
        }).catch(function() {
            self.serverError = true;
        });
    }

    this.query = params.query || params.question;

    if (params.source) {
        sourceId = params.source;
    }

    if (params.id) {
        questionId = params.id;
    }

    if (this.query) {
        this.search(this.query);
    }
    else {
        this.loaded = true;
    }
}

angular.module('SelfHelp').component('search', {
    templateUrl: '/ca/en/personal-banking/selfHelpComponents/search.html',
    controller: searchCtrl
});

function helpCentreCtrl(Backend, Config, LibraryHelper, QueryParams, $window) {
    var self = this;
    var itemsPerPage = 2;
    this.visibleItemCount = itemsPerPage;

    Backend.getHelpCentreTopics().then(function(data) {
        self.helpTopics = data;
    });

    this.readMoreClick = function() {
        this.visibleItemCount += itemsPerPage;
    };

    this.search = function(sourceId) {
		window.OmniSearchTrigger(this.query);
        $window.location.href = QueryParams.buildSearchUrl(this.query, sourceId);
    }

    LibraryHelper.loadBannerModule();
}

angular.module('SelfHelp').component('helpCentre', {
    templateUrl: '/ca/en/personal-banking/selfHelpComponents/helpCentre.html',
    controller: helpCentreCtrl
});

function contactCtrl(Backend, LibraryHelper, ngDialog, $scope, $timeout) {
    var self = this;

    function focusOnDismissButton() {
        $timeout(function() {
            //$('.ngdialog-close').focus();
        });
    }

    Backend.getContactOptions().then(function(data) {
        self.contactOptions = data;
        self.selectedContact = '';
    });

    this.showLoginModal = function() {
        Backend.getEmailList().then(function(data) {
            self.linksColumn1 = data.slice(0, data.length/2);
            self.linksColumn2 = data.slice(data.length/2, data.length);
       });

        ngDialog.open({
            template: '/ca/en/personal-banking/selfHelpComponents/loginModal.html',
            width: '800px',
            scope: $scope,
            preCloseCallback: function() {
                self.noLogin = false;
            },
            onOpenCallback: focusOnDismissButton
        });
    };

    this.showTextUsModal = function() {
        ngDialog.open({
            template: '/ca/en/personal-banking/selfHelpComponents/textUsModal.html',
            width: '800px',
            onOpenCallback: focusOnDismissButton
        });
    };

    this.openLink = function(link) {
        if (link.target === '_blank') {
            window.open(link.url, 'targetWindow', 'width=420,height=475');
        }
        else {
            window.location.href = link.url;
        }
    }

    LibraryHelper.loadBannerModule();
}

angular.module('SelfHelp').component('contact', {
    templateUrl: '/ca/en/personal-banking/selfHelpComponents/contact.html',
    controller: contactCtrl
});

function headerCtrl() {
    var height = document.querySelector('.td-header-nav').clientHeight;
    document.querySelector('.header-push').style.height = height + 'px';
}

angular.module('SelfHelp').component('globalHeader', {
    templateUrl: '/ca/en/personal-banking/selfHelpComponents/globalHeader.html',
    controller: headerCtrl
})
.directive('scrollTo', function ($location, $anchorScroll) {
  return function(scope, element, attrs) {
    element.bind('click', function(event) {
        event.stopPropagation();
        var off = scope.$on('$locationChangeStart', function(ev) {
            off();
            ev.preventDefault();
        });
        var location = attrs.scrollTo;
        $location.hash(location);
        $anchorScroll();
    });

  };
});

function questionInputCtrl(Backend, Config) {
    var self = this;
    var chatChannel;

    this.search = function(source) {
        self.clickSearch({ query: self.query, source: source });
    };

    this.openChat = function() {
        window.trackCustomLink('tdct:p:c2c','Button','onClick');
        window.openeGainAutoLoginHelp('td_ct', chatChannel, Config.language, Config.language === 'fr' ? 'CA' : 'US');
    }

    Backend.getChatSettings().then(function(chatSettings) {
        self.chatEnabled = chatSettings.enabled;
        chatChannel = chatSettings.channel;
    });
}

angular.module('SelfHelp').component('questionInput', {
    templateUrl: '/ca/en/personal-banking/selfHelpComponents/questionInput.html',
    controller: questionInputCtrl,
    bindings: {
        clickSearch: '&',
        onClickPopularTopics: '&',
        query: '=',
        showPopularTopics: '='
    }
});

angular.module('SelfHelp').component('globalFooter', {
    templateUrl: '/ca/en/personal-banking/selfHelpComponents/globalFooter.html'
});

function popularTopicsCtrl(Backend) {
    var self = this;
    var itemsPerPage = 5;

    this.visibleItemCount = itemsPerPage;

    this.readMoreClick = function() {
        this.nextFocusIndex = this.visibleItemCount;
        this.visibleItemCount += itemsPerPage;
    }

    this.loadAnswer = function(index, id, question) {
        if (this.topics[index].body) return;

        Backend.getAnswer(id, question, 4).then(function(answer) {
            self.topics[index].body = answer;
        });
    };

    Backend.getPopularTopics().then(function(topics) {
        self.topics = topics;
        if (self.topics != undefined && self.topics.length > 0) {
            var firstTopic = topics[0];
            self.loadAnswer(0, firstTopic.id, firstTopic.title);
        }
    });
}

angular.module('SelfHelp').component('popularTopics', {
    templateUrl: '/ca/en/personal-banking/selfHelpComponents/popularTopics.html',
    controller: popularTopicsCtrl,
    bindings: {
        onClose: '&'
    }
});

angular.module('SelfHelp').component('answer', {
    templateUrl: '/ca/en/personal-banking/selfHelpComponents/answer.html',
    bindings: {
        value: '='
    }
});

function relatedQuestionsCtrl(Backend) {
    var self = this;
    var itemsPerPage = 5;

    this.visibleItemCount = itemsPerPage;

    this.readMoreClick = function() {
        this.visibleItemCount += itemsPerPage;
        this.nextFocusIndex = this.visibleItemCount - itemsPerPage;
    }

    this.loadAnswer = function(index, id, question, source) {
        if (this.forceLogging && this.questions[index].body && !this.questions[index].logged) {
            this.questions[index].logged = true;
            Backend.getAnswer(id, question, source);
        }

        if (this.questions[index].body) return;

        Backend.getAnswer(id, question, source).then(function(answer) {
            self.questions[index].body = answer;
        });
    };
}

angular.module('SelfHelp').component('relatedQuestions', {
    templateUrl: '/ca/en/personal-banking/selfHelpComponents/relatedQuestions.html',
    controller: relatedQuestionsCtrl,
    bindings: {
        questions: '<',
        forceLogging: '<'
    }
});

function feedbackCtrl(Backend) {

    this.updateState = function() {
        this.sent = true;

        if (this.select === 'yes') {
            Backend.sendRating(100, this.submitTarget);
            $('#select-yes').attr('aria-checked', 'true');
            $('#select-no').attr('aria-checked', 'false');
        }
        else {
            $('#select-yes').attr('aria-checked', 'false');
            $('#select-no').attr('aria-checked', 'true');
        }
    };

    this.submit = function() {
        Backend.sendRating(0, this.submitTarget, this.comment);
        this.submitted = true;
    };
}

angular.module('SelfHelp').component('feedback', {
    templateUrl: '/ca/en/personal-banking/selfHelpComponents/feedback.html',
    controller: feedbackCtrl,
    bindings: {
        submitTarget: '<'
    }
});

function readMoreCtrl(Backend) {
    var self = this;
    var resultsPerPage = 5;
    this.visibleResultLimit = resultsPerPage;

    this.viewMore = function() {
        this.nextFocusIndex = this.visibleResultLimit;
        this.visibleResultLimit += resultsPerPage;
    }
}

angular.module('SelfHelp').component('readMore', {
    templateUrl: '/ca/en/personal-banking/selfHelpComponents/readMore.html',
    controller: readMoreCtrl,
    bindings: {
        results: '<'
    }
});

'use strict';

function topResultCtrl($timeout, QueryParams) {
    var self = this;
    var preExpand = QueryParams.getParams().preExpand === 'true';

    $timeout(function() {
        if (!preExpand && $('.top-result-container').height() > 255 + 75) {
            $('.top-result-container').addClass('collapsed');
            self.answerCollapsed = true;
        }
    });

    this.readMoreClick = function() {
        this.expanded = true;

        $('.top-result-container').removeClass('collapsed');
    }

    this.showViewMore = function() {
        return (!this.expanded && (this.result.related.length > 0 || this.answerCollapsed));
    }
}

angular.module('SelfHelp').component('topResult', {
    templateUrl: '/ca/en/personal-banking/selfHelpComponents/topResult.html',
    controller: topResultCtrl,
    bindings: {
        result: '<'
    }
});

function topSearchTermCtrl(Backend, Config, QueryParams) {
    var self = this;

    Backend.getTopSearchTerms().then(function(data) {
        self.columns = data;
    });

    this.searchUrl = QueryParams.buildSearchUrl;
}

angular.module('SelfHelp').component('topSearchTerms', {
    templateUrl: '/ca/en/personal-banking/selfHelpComponents/topSearchTerms.html',
    controller: topSearchTermCtrl
});

angular.module('SelfHelp').service('Backend', function($cookies, $http, $q, $sce, $window, Config, QueryParams) {

    var interfaceId = Config.language === 'fr' ? 32 : 17;
    var sessionId;
    var questionToBeRated;

    function buildUrl(url, params) {
        var newUrl = url
        angular.forEach(params, function(value, key) {
            newUrl = newUrl.replace(':' + key, value);
        });
        return newUrl;
    }

    function getSession() {
        var cookieName = 'knowledgeBaseSessionId';
        if ($cookies.get(cookieName)) {
            sessionId = $cookies.get(cookieName);
        }
        if (sessionId) {
            return $q.resolve();
        }
        else {
            return $http.get(buildUrl(Config.endpoints.getSession, {interfaceId: interfaceId})).then(function(response) {
                sessionId = response.data.sessionID;
                $cookies.put(cookieName, sessionId);
            });
        }
    }

    function getPopularTopics() {
        return getSession().then(function() {
            return $http.get(buildUrl(Config.endpoints.topQuestions, {sessionId: sessionId, interfaceId: interfaceId})).then(function(response) {
                return response.data.topQuestions;
            });
        });
    }

    function getRelatedQuestions() {
        return $http.get('mockData/relatedQuestions.json');
    }

    function getTopResult() {
        return $http.get('mockData/topResult.json');
    }

    function getSuggestions(query) {
        return getSession().then(function() {
            var parameters = {
                "interfaceID" : interfaceId,
                "sessionID" : sessionId,
                "term" : query
            }

            return $http.post(Config.endpoints.suggestions, JSON.stringify(parameters)).then(function(response) {
                if (!angular.isArray(response.data.predictedQuestionList)) return [];
                if (!response.data.predictedQuestionList[0].value) return [];
                return {
                    data: response.data.predictedQuestionList.map(function(item) {
                        return item.value;
                    })
                }
            });
        });
    }

    function getPopularSearches(query) {
        return $http.get('mockData/popularSearches.json');
    }

    function getContactOptions() {
        return $http.get(Config.endpoints.contact).then(function(response) {
            response.data.contactus.contacts.map(function(item) {
                if (!angular.isArray(item.contactDetails)) item.contactDetails = [item.contactDetails];
            });
            return response.data.contactus;
        });
    }

    function getHelpCentreTopics() {
        return $http.get(Config.endpoints.helpCentre).then(function(response) {
            var data = response.data.HelpCenter;
            var output = [];

            for (var i = 0; i < data.topic.length; i++) {
                var topic = data.topic[i];
                var sectionIndex = Math.floor(i/3);
                if (!output[sectionIndex]) output[sectionIndex] = [];
                output[sectionIndex].push(topic);
                if (!angular.isArray(topic.subTopic)) topic.subTopic = [topic.subTopic];
                topic.links = topic.subTopic.map(function(item) {
                    var output;

                    output = {
                        name: item.title,
                        target: item.window === "New Window" ? '_blank' : '_self'
                    }

                    if (item.linkType === 'External Link') {
                        output.url = item.link;
                    }
                    else if (item.linkType === 'Search Keyword') {
                        output.url = QueryParams.buildSearchUrl(item.link) + '&preExpand=true&source=100';
                    }

                    return output;
                });
            }

            return output;
        });
    }

    function getSearchResult(query, source, questionId) {
        return getSession().then(function() {
            var parameters = {
                "interfaceID" : interfaceId,
                "sessionID" : sessionId,
                "source" : source || 8,
                "id" : questionId || -1,
                "question" : query
            }

            var relatedPlusPartial = [];

            return $http.post(Config.endpoints.answer, JSON.stringify(parameters)).then(function(response) {
                if (!response.data.exactMatches) return {};

                relatedPlusPartial = relatedPlusPartial.concat(response.data.relatedEntries.map(function(item) {
                    item.source = 2;
                    return item;
                }));
                relatedPlusPartial = relatedPlusPartial.concat(response.data.partialMatches.map(function(item) {
                    item.source = 3;
                    return item;
                }));
                relatedPlusPartial = relatedPlusPartial.slice(0, 10);

                if (response.data.exactMatches.length === 1) {
                    questionToBeRated = {
                        title: response.data.exactMatches[0].title,
                        id: response.data.exactMatches[0].id,
                        uuid: response.data.exactMatches[0].uuid,
                        source: source
                    }

                    return {
                        title: response.data.exactMatches[0].title,
                        body: $sce.trustAsHtml(response.data.exactMatches[0].body),
                        related: relatedPlusPartial
                    }
                }
                else if (response.data.exactMatches.length > 1) {
                    return {
                        multiAnswer: response.data.exactMatches,
                        related: relatedPlusPartial
                    }
                }

                return {};
            });
        });
    }

    function getAnswer(id, query, source) {
        return getSession().then(function() {
            var parameters = {
                "interfaceID" : interfaceId,
                "sessionID" : sessionId,
                "source" : source || 8,
                "id" : id,
                "question" : query
            };

            return $http.post(Config.endpoints.singleAnswer, JSON.stringify(parameters)).then(function(response) {
                return $sce.trustAsHtml(response.data.body);
            });
        });
    }

    function getGsaSearchResults(query) {
        return $http.get(buildUrl(Config.endpoints.gsaSearch, { query: query})).then(function(response) {
            var output = {};

            function convertCharset(str) {
                try {
                    return decodeURIComponent(escape(str));
                }
                catch (e) {
                    return str;
                }
            }

            if (!response.data.GSP) {
                return {};
            }

            if (angular.isArray(response.data.GSP.RES.R)) {
                var results = response.data.GSP.RES.R.splice(0, 100).map(function(item) {
                    return {
                        title: $sce.trustAsHtml(convertCharset(item.T)),
                        body: $sce.trustAsHtml(convertCharset(item.S)),
                        url: item.U
                    }
                });
                output.results = results;
            }

            return output;
        });
    }

    function getChatSettings() {
        return $http.get(Config.endpoints.chatSettings).then(function(response) {
            var enabled = false;
            var channel;

            for (index in response.data.ResultsCustomSchema.results) {
                var item = response.data.ResultsCustomSchema.results[index];
                if ($window.location.href.indexOf(item.url) !== -1) {
                    if (item.interfaceID) interfaceId = item.interfaceID;
                    enabled = item.enableChat === 'true';
                    channel = item.chatChannelID;
                }
            }

            getSession();

            return {
                enabled: enabled,
                channel: channel
            };
        });
    }

    function getGsaSuggestions(query) {
        return $http.get(buildUrl(Config.endpoints.gsaSuggestions, { query: query, language: Config.language }));
    }

    function sendRating(rating, submitTarget, comment) {

        if (submitTarget != 'omniture') {
            return getSession().then(function() {
                if (!questionToBeRated) return;

                var parameters = {
                    interfaceID: interfaceId,
                    sessionID : sessionId,
                    responseID: questionToBeRated.id,
                    rating: rating,
                    source : questionToBeRated.source,
                    question : questionToBeRated.title,
                    uuid: questionToBeRated.uuid,
                    comment: comment
                }

                return $http.post(Config.endpoints.rateResponse, JSON.stringify(parameters));
            });
        }
    }

    function getEmailList() {
        return $http.get(Config.endpoints.emailList).then(function(response) {
            return response.data.HelpCenter.topic[0].subTopic.map(function(item) {
                if (angular.isArray(item.link)) {
                    item.link = item.link[0].value;
                }
                if (angular.isArray(item.title)) {
                    item.title = item.title[0].value;
                }
                return {
                    url: item.link,
                    target: item.window === 'New Window' ? '_blank': '_self',
                    title: item.title
                }
            });
        });
    }

    function getTopSearchTerms() {
        return $http.get(Config.endpoints.topSearchTerms).then(function(response) {
            return response.data.HelpCenter.topic.map(function(topic) {
                var column = {};

                column.title = topic.label;
                column.terms = topic.subTopic.map(function(item) {
                    return item.title;
                });

                return column;
            });
        });
    }

    return {
        getRelatedQuestions: getRelatedQuestions,
        getPopularTopics: getPopularTopics,
        getTopResult: getTopResult,
        getSuggestions: getSuggestions,
        getPopularSearches: getPopularSearches,
        getContactOptions: getContactOptions,
        getHelpCentreTopics: getHelpCentreTopics,
        getSearchResult: getSearchResult,
        getAnswer: getAnswer,
        getGsaSearchResults: getGsaSearchResults,
        getChatSettings: getChatSettings,
        getGsaSuggestions: getGsaSuggestions,
        sendRating: sendRating,
        getEmailList: getEmailList,
        getTopSearchTerms: getTopSearchTerms
    }
});

angular.module('SelfHelp').service('LibraryHelper', function($timeout) {

    function loadBannerModule() {
        $timeout(function () {
            // Load specific jquery modules since html/jquery components reside in angular
            var m_name_arry = ['td_rq_a_banner'];
            for (var x = 0; x <= m_name_arry.length - 1; x++) {
                var specific_modules = window.modules_ext[m_name_arry[x]];
                for (var funcId = 0; funcId < specific_modules.length; funcId += 1) {
                    specific_modules[funcId](window.global_ext);
                }
                if (m_name_arry[x] == 'td_rq_tabs_carousel') {
                    // reinitialize JQuery slick plugin due to templateUrl
                    $el.find('.td-tabs-carousel').slick('reinit');
                }
            }
        }, 0);
    }

    return {
        loadBannerModule: loadBannerModule
    }
});

angular.module('SelfHelp').service('QueryParams', function($window, Config) {

    function getParams() {
        var paramString = $window.location.search.split('?')[1];
        var params = [];
        var output = {};

        if (paramString) {
            params = paramString.split('&');
        }
        for (var i = 0; i < params.length; i++) {
            var pair = params[i].split('=');
            var key = pair[0];
            var value = pair[1];

            output[key] = decodeURIComponent(value);
        }

        return output;
    }

    function buildSearchUrl(query, source, questionId) {
        var url = Config.searchPath + '?query=' + encodeURIComponent(query);

        if (source) {
            url += '&source=' + encodeURIComponent(source);
        }
        if (questionId) {
            url += '&id=' + encodeURIComponent(questionId);
        }

        return url;
    }

    return {
        getParams: getParams,
        buildSearchUrl: buildSearchUrl
    }
});

angular.module('SelfHelp').directive('focusIf', function() {

    return {
        link: function(scope, elem, attrs) {
            if (scope.$eval(attrs.focusIf)) {
                elem[0].focus();
            }
        }
    }
});

angular.module('SelfHelp').directive('questionExpand', function() {

    function toggleAttr(index, attr) {
        if (attr === 'true') {
            return 'false';
        }
        else {
            return 'true';
        }
    }

    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            $(elem).find('.question-header').click(function() {
                $(elem).find('.question-header-button').toggleClass('expanded');
                $(elem).find('.question-body').toggle();
                $(elem).find('.question-header').attr('aria-expanded', toggleAttr);
            });
        }
    }
});

angular.module('SelfHelp').directive('noMouseFocus', function() {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {

            function isKeyboardEvent(event) {
                var isIE11 = /Trident.*rv[ :]*11\./.test(navigator.userAgent);

                if (isIE11) {
                    /*
                        IE11 has different behaviour for mouse events, perhaps to hide click
                        position for security reasons.  We cannot use clientX to distinguish mouse
                        events in IE11.  Testing has determined that in IE11, pointerType == '' for
                        mouse events, and pointerType == 'mouse' for keyboard events
                    */
                    if (event.pointerType === 'mouse') return true;
                }
                else {
                    if (event.clientX === 0) return true;
                }
            }

            $(elem).click(function(event) {
                if (isKeyboardEvent(event)) return;

                setTimeout(function() {
                    $(elem).blur();
                });
            });
        }
    }
});

angular.module('SelfHelp').directive('suggestions',function(Backend) {
    var keyCodeDown = 40;
    var keyCodeUp = 38;
    var keyCodeEnter = 13;

    return {
        link: function(scope, elem, attrs) {

            $(document).mouseup(function(e) {
                if($(elem).has(e.target).length === 0) {
                    scope.$apply(function() {
                        scope.$ctrl.hideSuggestions = true;
                    });
                }
            });

            function removeEscapedHtml(str) {
                return $('<div>').html(str).text();
            }

            function moveSelected(delta) {
                if (scope.$ctrl.selected !== parseInt(scope.$ctrl.selected, 10)) {
                    if (delta === 1) {
                        scope.$ctrl.selected = 0;
                    }
                    else {
                        scope.$ctrl.selected = scope.$ctrl.suggestions.length - 1;
                    }
                }
                else {
                    scope.$ctrl.selected = (scope.$ctrl.selected + delta) % scope.$ctrl.suggestions.length;
                    if (scope.$ctrl.selected < 0) scope.$ctrl.selected = scope.$ctrl.suggestions.length - 1;
                }
            }

            function triggerSearch() {
                var sourceId = 1;
                if (angular.isNumber(scope.$ctrl.selected)) {
                    scope.$ctrl.query = removeEscapedHtml(scope.$ctrl.suggestions[scope.$ctrl.selected]);
                    sourceId = 9;
                }
                scope.$ctrl.hideSuggestions = true;
                if (scope.$ctrl.query) {
                    scope.$ctrl.search(sourceId);
                }
            }

            scope.$ctrl.updateSuggestions = function() {
                Backend.getSuggestions(this.query).then(function(response) {
                    scope.$ctrl.suggestions = response.data;
                })
            };

            scope.$ctrl.hover = function(index) {
                scope.$ctrl.selected = index;
            }

            scope.$ctrl.clickSuggestion = function(index) {
                triggerSearch();
            };

            $(elem).find('input').keyup(function(event) {
                scope.$apply(function() {
                    scope.$ctrl.hideSuggestions = false;

                    if (event.keyCode === keyCodeDown) {
                        moveSelected(1);
                        return false;
                    }
                    else if (event.keyCode === keyCodeUp) {
                        moveSelected(-1);
                        return false;
                    }
                    else if (event.keyCode === keyCodeEnter) {
                        triggerSearch();
                    }
                    else {
                        scope.$ctrl.selected = null;
                    }
                });
            });

            scope.placeholder = attrs.placeholder;
        },
        templateUrl: '/ca/en/personal-banking/selfHelpComponents/suggestions.html'
    }
});

angular.module('SelfHelp').filter('safeHtml', ['$sce', function($sce){
    return function(text) {
        if (typeof text !== 'string') return text;
        return $sce.trustAsHtml(text);
    };
}]);

angular.module('SelfHelp').filter('wrapArray', function(){
    return function(value) {
        return angular.isArray(value) || angular.isObject(value) ? value : [value];
    };
});

angular.module('SelfHelp').directive('headerSearchInput',function(Backend, Config, QueryParams, $window) {
    var keyCodeDown = 40;
    var keyCodeUp = 38;
    var keyCodeEnter = 13;

    return {
        link: function(scope, elem, attrs) {

            scope.$ctrl = {};

            $(document).mouseup(function(e) {
                if($(elem).find('input').is(':visible') && $(elem).has(e.target).length === 0) {
                    scope.$apply(function() {
                        scope.$ctrl.hideSuggestions = true;
                    });
                }
            });

            function removeEscapedHtml(str) {
                return $('<div>').html(str).text();
            }

            function moveSelected(delta) {
                if (scope.$ctrl.selected !== parseInt(scope.$ctrl.selected, 10)) {
                    if (delta === 1) {
                        scope.$ctrl.selected = 0;
                    }
                    else {
                        scope.$ctrl.selected = scope.$ctrl.suggestions.length - 1;
                    }
                }
                else {
                    scope.$ctrl.selected = (scope.$ctrl.selected + delta) % scope.$ctrl.suggestions.length;
                    if (scope.$ctrl.selected < 0) scope.$ctrl.selected = scope.$ctrl.suggestions.length - 1;
                }
            }

            function triggerSearch() {
                var sourceId = 1;
                if (angular.isNumber(scope.$ctrl.selected)) {
                    scope.query = removeEscapedHtml(scope.$ctrl.suggestions[scope.$ctrl.selected]);
                    sourceId = 9;
                }
                scope.$ctrl.hideSuggestions = true;
                if (scope.query) {
                    scope.$ctrl.search(sourceId);
                }
            }

            scope.$ctrl.updateSuggestions = function() {
                Backend.getSuggestions(scope.query).then(function(response) {
                    scope.$ctrl.suggestions = response.data;
                })
            };

            scope.$ctrl.hover = function(index) {
                scope.$ctrl.selected = index;
            }

            scope.$ctrl.clickSuggestion = function(index) {
                triggerSearch();
            };

            $(elem).find('input').keyup(function(event) {

                scope.$apply(function() {
                    scope.$ctrl.hideSuggestions = false;

                    if (event.keyCode === keyCodeDown) {
                        moveSelected(1);
                        return false;
                    }
                    else if (event.keyCode === keyCodeUp) {
                        moveSelected(-1);
                        return false;
                    }
                    else if (event.keyCode === keyCodeEnter) {
                        triggerSearch();
                    }
                    else {
                        scope.$ctrl.selected = null;
                    }
                });
            });

            var params = QueryParams.getParams();
            scope.query = params.query || params.question;

            if (scope.query) {
                $('.td-nav-desktop-search').show();
                $('header-search-input input[type="text"]').val(scope.query);
            }

            scope.$ctrl.search = function(sourceId) {
				window.OmniSearchTrigger(scope.query);
                $window.location.href = QueryParams.buildSearchUrl(scope.query, sourceId);
            }

            scope.placeholder = attrs.placeholder;
        },
        templateUrl: '/ca/en/personal-banking/selfHelpComponents/headerSearchInput.html'
    }
});

angular.module('SelfHelp').filter('addCaret', function($sce){
    return function(value) {

        var words = value.split(' ');
        var lastWord = words.pop();

        var output = words.join(' ') + ' <span class="td-link-lastword">' + lastWord;
        output += '<span class="td-icon td-icon-rightCaret" aria-hidden="true"></span></span>';

        return $sce.trustAsHtml(output);
    };
});

angular.module('SelfHelp').directive('focusHere', function($timeout) {
    return {
        link: function(scope, elem, attrs) {

            $timeout(function() {
                elem[0].setAttribute('tabindex', 1);
                elem[0].focus();
                elem.css('outline', 0);
            });
        }
    }
});
