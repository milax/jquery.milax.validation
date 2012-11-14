/*

jQuery Milax Validation v1.3
jQuery Plugin
Latest Update: 14.11.2012

Author: Eugene Kuzmin
Copyright: 2011-12, Eugene Kuzmin

-----------------------------------------------------------------------*/
;(function($) {
    'use strict';

    $.fn.mxValidation = function(settings) {

        // vars
        var options = { },
            $fieldsets = this;

        // ==========================================================================
        // Init
        // ==========================================================================
        var init = function() {

            hideAllErrorMsgs();

            // hide all error messages function
            function hideAllErrorMsgs() {
                // go through all fields' sets
                $fieldsets.each(function() {
                    var $currFieldset = $(this);
                    // hide all error messages
                    $currFieldset.find(options.errMsgClass).hide();
                });
            }
        };

        var fieldBlurHandler = function(e) {
            var $input = $(e.target),
                errorClass = options.fieldHasErrorClass;
            errorClass = errorClass.substr(1);
            if($input.hasClass(errorClass)) {
                doFieldsValidation($input);
            }
        };

        // ==========================================================================
        // Handle key up in a field
        // ==========================================================================
        var fieldKeyUpHandler = function(event) {
            var $fieldset = $(event.delegateTarget),
                ENTER_KEY_CODE = 13;

            // if ENTER key has been pressed
            if (event.keyCode === ENTER_KEY_CODE) {
                // fire a submit button click
                $fieldset.find(options.btnSubmitSelector).click();
            }
        };

        // ==========================================================================
        // Handle click on a submit button
        // ==========================================================================
        var submitBtnHandler = function(event) {
            var $btnSubmit = $(this),
                $fieldset = $(event.delegateTarget),
                $fields2Validate = $fieldset.find(options.fields2ValidateSelector),
                valRes = doFieldsValidation($fields2Validate);

            // if validation passed Ok then run callback function @options.isValidFunc
            if (valRes && typeof(options.isValidFunc) === 'function') {
                options.isValidFunc($btnSubmit, $fieldset);
            }

            return options.isAnyActionsIfValid ? valRes : false;
        };

        // ==========================================================================
        // Validation function
        // ==========================================================================
        var doFieldsValidation = function($fieldsToValidate) {
            var isValid = true,
                validationClasses = new Array(
                    'mxRequired',
                    'mxEmail',
                    'mxNumber',
                    'mxMax',
                    'mxMin',
                    'mxAtLeastOne',
                    'mxPostalCode'
                );

            // go through all fields to be validated
            $fieldsToValidate.each(function() {
                validateThisField($(this));
            });

            return isValid;

            // validate @input
            function validateThisField($input) {
                var i, currClass;

                // hide all related validation messages beforehand
                $input.closest(options.fieldHolderSelector).find(options.errMsgClass).hide();
                // remove an error classname from the current field
                $input.removeClass(options.fieldHasErrorClass.substr(1));

                for (i in validationClasses) {
                    currClass = validationClasses[i];
                    if ($input.hasClass(currClass) && !isFieldValid(currClass, $input)) {
                        isValid = false;
                        return true; // go to the next field to validate
                    }
                }
            }
        };

        // ==========================================================================
        // Validate @input field by @way
        // ==========================================================================
        var isFieldValid = function(way, $what2Validate) {
            var val = $.trim($what2Validate.val()),
                opts = $what2Validate.data('mxvalidateOptions'),
                $errMsg = $what2Validate.closest(options.fieldHolderSelector).find(options.errMsgClass + '.' + way),
                isValid = true, pattern;

            pattern = getPattern();

            switch (way) {
                // required field
                case 'mxRequired':
                    isValid = !!val;
                    break;

                // email field
                // number field
                case 'mxEmail':
                case 'mxNumber':
                    isValid = val.match(pattern) !== null;
                    break;

                // field with a defined max value
                case 'mxMax':
                    var maxLength = opts.max;
                    isValid = val.length <= maxLength;
                    break;

                // field with a defined min value
                case 'mxMin':
                    var minLength = opts.min;
                    isValid = val.length >= minLength;
                    break;

                // at least one checkbox must be checked from the collection
                case 'mxAtLeastOne':
                    var $checkedCheckboxes = $what2Validate.find('input[type="checkbox"]:checked');
                    isValid = $checkedCheckboxes.length !== 0;
                    break;

                // field with postal code
                case 'mxPostalCode':
                    var postalCode;
                    postalCode = val.replace(/\s/g, '');
                    postalCode = postalCode.replace(/\-/g, '');
                    isValid = postalCode.match(pattern) !== null;
                    break;

                default:
                    isValid = false;
            }

            if (!isValid) {
                showErrorMsg($errMsg, $what2Validate);
            }

            return isValid;

            // return proper pattern value @p in depending on @way
            function getPattern() {
                var p; // pattern
                switch (way) {
                    // email field
                    case 'mxEmail':
                        p = /^[ÆØÅæøåa-zA-Z0-9_-]+(?:\.[ÆØÅæøåa-zA-Z0-9_-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
                        break;

                    // number field
                    case 'mxNumber':
                        p = /^\d*$/;
                        break;

                    // field with postal code
                    case 'mxPostalCode':
                        var postalCodeRegexps = {
                                'dk': /^\d{4}$/,
                                'da': /^\d{4}$/,
                                'no': /^\d{4}$/,
                                'se': /^\d{5}$/,
                                'sv': /^\d{5}$/,
                                'pl': /^\d{5}$/,
                                'fi': /^\d{5}$/,
                                'en-GB': /(GIR 0AA)|(((A[BL]|B[ABDHLNRSTX]?|C[ABFHMORTVW]|D[ADEGHLNTY]|E[HNX]?|F[KY]|G[LUY]?|H[ADGPRSUX]|I[GMPV]|JE|K[ATWY]|L[ADELNSU]?|M[EKL]?|N[EGNPRW]?|O[LX]|P[AEHLOR]|R[GHM]|S[AEGKLMNOPRSTY]?|T[ADFNQRSW]|UB|W[ADFNRSV]|YO|ZE)[1-9]?[0-9]|((E|N|NW|SE|SW|W)1|EC[1-4]|WC[12])[A-HJKMNPR-Y]|(SW|W)([2-9]|[1-9][0-9])|EC[1-9][0-9]) [0-9][ABD-HJLNP-UW-Z]{2})/,
                                'en': /(GIR 0AA)|(((A[BL]|B[ABDHLNRSTX]?|C[ABFHMORTVW]|D[ADEGHLNTY]|E[HNX]?|F[KY]|G[LUY]?|H[ADGPRSUX]|I[GMPV]|JE|K[ATWY]|L[ADELNSU]?|M[EKL]?|N[EGNPRW]?|O[LX]|P[AEHLOR]|R[GHM]|S[AEGKLMNOPRSTY]?|T[ADFNQRSW]|UB|W[ADFNRSV]|YO|ZE)[1-9]?[0-9]|((E|N|NW|SE|SW|W)1|EC[1-4]|WC[12])[A-HJKMNPR-Y]|(SW|W)([2-9]|[1-9][0-9])|EC[1-9][0-9]) [0-9][ABD-HJLNP-UW-Z]{2})/,
                                'uk': /(GIR 0AA)|(((A[BL]|B[ABDHLNRSTX]?|C[ABFHMORTVW]|D[ADEGHLNTY]|E[HNX]?|F[KY]|G[LUY]?|H[ADGPRSUX]|I[GMPV]|JE|K[ATWY]|L[ADELNSU]?|M[EKL]?|N[EGNPRW]?|O[LX]|P[AEHLOR]|R[GHM]|S[AEGKLMNOPRSTY]?|T[ADFNQRSW]|UB|W[ADFNRSV]|YO|ZE)[1-9]?[0-9]|((E|N|NW|SE|SW|W)1|EC[1-4]|WC[12])[A-HJKMNPR-Y]|(SW|W)([2-9]|[1-9][0-9])|EC[1-9][0-9]) [0-9][ABD-HJLNP-UW-Z]{2})/,
                                'com': /(GIR 0AA)|(((A[BL]|B[ABDHLNRSTX]?|C[ABFHMORTVW]|D[ADEGHLNTY]|E[HNX]?|F[KY]|G[LUY]?|H[ADGPRSUX]|I[GMPV]|JE|K[ATWY]|L[ADELNSU]?|M[EKL]?|N[EGNPRW]?|O[LX]|P[AEHLOR]|R[GHM]|S[AEGKLMNOPRSTY]?|T[ADFNQRSW]|UB|W[ADFNRSV]|YO|ZE)[1-9]?[0-9]|((E|N|NW|SE|SW|W)1|EC[1-4]|WC[12])[A-HJKMNPR-Y]|(SW|W)([2-9]|[1-9][0-9])|EC[1-9][0-9]) [0-9][ABD-HJLNP-UW-Z]{2})/
                            };
                        p = postalCodeRegexps[options.locale] || postalCodeRegexps['dk'];
                        break;

                    default:
                        p = '';
                }

                return p;
            }
        };

        // ==========================================================================
        // Show @errorMsg for @what2Validate
        // ==========================================================================
        var showErrorMsg = function($errorMsg, $what2Validate) {
            // show an error message
            $errorMsg.css({
                display: 'block' // force 'block', could be changed to .show() method which sets display property in depending on element and its default value
            });

            // add an error classname to @what2Validate
            $what2Validate.addClass(options.fieldHasErrorClass.substr(1)); // substr(1) is needed to remove dot at the begin of a classname, e.g. ".mxNotValidated" => "mxNotValidated"
        };

        // ==========================================================================
        // Get current locale by hostname
        // ==========================================================================
        var getLocale = function() {
            var hostname = window.location.hostname,
                lang = hostname.match(/\.([a-z,A-Z]{2,6})$/);

            lang = lang && lang[1] ? lang[1] : 'en'; // locale 'en' is default

            return lang;
        };

        // ==========================================================================
        // Bindings
        // ==========================================================================
        var bindings = function() {
            // form fields key up handler
            $fieldsets.on('keyup', options.fieldsToValidateSelector, fieldKeyUpHandler);
            // form fields blur (focusout is more suitable) event handler
            $fieldsets.on('focusout', options.fieldsToValidateSelector, fieldBlurHandler);
            // submit button click handler
            $fieldsets.on('click', options.btnSubmitSelector, submitBtnHandler);
        };

        // ==========================================================================
        // Entry point (self run)
        // ==========================================================================
        (function(){

            options = $.extend({
                errMsgClass: '.mxError',
                fieldHasErrorClass: '.mxNotValidated',
                fields2ValidateSelector: '.mxValidate',
                btnSubmitSelector: '.btnSubmit',
                fieldHolderSelector: 'dd',
                locale: getLocale(),
                isValidFunc: false,
                isAnyActionsIfValid: true
            }, settings),

            init();
            bindings();

        })();

    };
})(jQuery);