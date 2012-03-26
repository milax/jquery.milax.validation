/*

jQuery Milax Validation v1.1
jQuery Plugin
Latest Update: 27.03.2012

Author: Eugene Kuzmin
Copyright: 2011-12, Eugene Kuzmin

-----------------------------------------------------------------------*/
;(function ($) {

    $.fn.mxValidation = function (settings) {

        // options
        var options = jQuery.extend({
                errMsgClass: '.mxError',
                fieldHasErrorClass: '.mxNotValidated',
                fieldsToValidateSelector: '.mxValidate',
                btnSubmitSelector: '.btnSubmit',
                fieldHolderSelector: 'dd',
                isValidFunc: false
            }, settings),
            $fieldsets = this;

        // // // // // // // // // // // // // // // // // // // // // // // // // // // 
        // INIT
        // // // // // // // // // // // // // // // // // // // // // // // // // // // 
        this.init = function() {
            operateAllFieldsets();

            // handle key ups
            $fieldsets.on('keyup', options.fieldsToValidateSelector, fieldKeyUpHandler);
            // handle click on submit buttons
            $fieldsets.on('click', options.btnSubmitSelector, submitBtnHandler);
        };

        // // // // // // // // // // // // // // // // // // // // // // // // // // // 
        // any stuff to work with fieldsets
        // // // // // // // // // // // // // // // // // // // // // // // // // // // 
        var operateAllFieldsets = function(){
            // go through all fields' sets
            $fieldsets.each(function () {
                var $currFieldset = $(this);

                // hide all error messages
                $currFieldset.find(options.errMsgClass).hide();
            });
        };

        // // // // // // // // // // // // // // // // // // // // // // // // // // // 
        // handle key up in a field
        // // // // // // // // // // // // // // // // // // // // // // // // // // // 
        var fieldKeyUpHandler = function(event) {
            var $focusedField = $(this),
                $fieldset = $(event.delegateTarget);

            // if Enter key has been pressed
            if (event.keyCode == 13) { 
                // fire a submit button click
                $fieldset.find(options.btnSubmitSelector).click(); 
            }
        }

        // // // // // // // // // // // // // // // // // // // // // // // // // // // 
        // handle click on a submit button
        // // // // // // // // // // // // // // // // // // // // // // // // // // // 
        var submitBtnHandler = function(event) {
            var $btnSubmit = $(this),
                $fieldset = $(event.delegateTarget),
                $fieldsToValidate = $fieldset.find(options.fieldsToValidateSelector),
                valRes = doFieldsValidation($fieldsToValidate);

            // if validation passed than run callback function @options.isValidFunc
            if (valRes && typeof (options.isValidFunc) === 'function') {
                options.isValidFunc($btnSubmit, $fieldset);
            }

            return valRes;
        }

        // // // // // // // // // // // // // // // // // // // // // // // // // // // 
        // do validation function
        // // // // // // // // // // // // // // // // // // // // // // // // // // // 
        var doFieldsValidation = function ($fieldsToValidate) {
            var isValid = true,
                validationClasses = new Array(
                    'mxRequired',
                    'mxEmail',
                    'mxNumber',
                    'mxMax',
                    'mxMin'
                );

            // go through all fields to be validated
            $fieldsToValidate.each(function () {
                var $input = $(this);

                // hide all related validation messages beforehand
                $input.parents(options.fieldHolderSelector)
                        .find(options.errMsgClass)
                        .hide();
                // remove a error classname from current field
                $input.removeClass(options.fieldHasErrorClass.substr(1));
                
                for (var i in validationClasses) {
                    var currClass = validationClasses[i];
                    if ($input.hasClass(currClass) && !isFieldValid(currClass, $input)) {
                        isValid = false;
                        return true; // go to the next field to validate
                    }
                }
            });

            return isValid;
        };

        // // // // // // // // // // // // // // // // // // // // // // // // // // // 
        // validate @input field by @way
        // // // // // // // // // // // // // // // // // // // // // // // // // // // 
        var isFieldValid = function(way, $input) {
            var val = $.trim($input.val()),
                opts = $input.data('mxvalidateOptions'),
                $errMsg = $input.parents(options.fieldHolderSelector).find(options.errMsgClass + '.' + way);

            switch (way) {
                // required field
                case 'mxRequired':
                    if (!val) {
                        showErrorMsg($errMsg, $input);
                        return false;
                    }
                    break;
                // email field
                case 'mxEmail':
                    var pattern = /^([a-zA-Z0-9._%-+]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})*$/;
                    if (val.match(pattern) === null) {
                        showErrorMsg($errMsg, $input);
                        return false;
                    }
                    break;
                // number field
                case 'mxNumber':
                    var pattern = /^\d*$/;
                    if (val.match(pattern) === null) {
                        showErrorMsg($errMsg, $input);
                        return false;
                    }
                    break;
                // field with a defined max value
                case 'mxMax':
                    var maxLength = opts.max;
                    if (val.length > maxLength) {
                        showErrorMsg($errMsg, $input);
                        return false;
                    }
                    break;
                // field with a defined min value
                case 'mxMin':
                    var minLength = opts.min;
                    if (val.length < minLength) {
                        showErrorMsg($errMsg, $input);
                        return false;
                    }
            }
            return true;
        }

        // // // // // // // // // // // // // // // // // // // // // // // // // // // 
        // show @errorMsg for @currInput
        // // // // // // // // // // // // // // // // // // // // // // // // // // // 
        var showErrorMsg = function($errorMsg, $currInput) {
            // show an error message
            $errorMsg.css({
                display: 'block'
            });

            // add an error classname to @currInput
            $currInput.addClass(options.fieldHasErrorClass.substr(1)); // substr(1) is needed to remove dot at the begin of classname, e.g. ".mxNotValidated" => "mxNotValidated"
        }

        this.init();
    };
})(jQuery);