/*

    jQuery Milax Validation"
    jQuery Plugin

    Author: Eugene Kuzmin
    Copyright: 2011-12, Eugene Kuzmin

-----------------------------------------------------------------------*/

$.fn.mxValidation = function(options) {

    // options
    var options = jQuery.extend({
        errorMsgClass: '.mxError',
        errorFieldClass: '.mxNotValidated',
        fieldsToValidateSelector: '.mxValidate',
        btnSubmitSelector: '.btnSubmit',
        fieldHolderSelector: 'dd',
        isValidFunc: false   
    }, options);

    // go through all fields' sets
    this.each(function(){
        var self = $(this);
        
        self.find(options.errorMsgClass).hide();

        self.find(options.fieldsToValidateSelector).live('keyup', function(event) {
            if (event.keyCode == 13) { // if Enter key has been pressed
                btnSubmit.click(); // fire a submit button click
            }
        });

        self.delegate(options.btnSubmitSelector, 'click', currParentBox = self, function(){
            var fieldsToValidate = self.find(options.fieldsToValidateSelector),            
                valRes = doFieldsValidation(fieldsToValidate);

            if (valRes && typeof(options.isValidFunc) == 'function') {
                options.isValidFunc.call(this);
            }

            return valRes;
        });
    });

    // do validation function
    var doFieldsValidation = function(fieldsToValidate) {
        var isValid = true;
        var validationClasses = new Array(
            'mxRequired', 'mxEmail', 'mxDate', 'mxNumber', 'mxPhone', 'mxMax', 'mxMin'
        );

        // go through all fields to be validated
        fieldsToValidate.each(function() {
            var self = $(this);
        
            self.parents(options.fieldHolderSelector).find(options.errorMsgClass).hide();
            for(var i in validationClasses) {
                var currClass = validationClasses[i];
                if (self.hasClass(currClass)) {
                    if(!validate(currClass, self)) {
                        return !(isValid = false);
                    }
                }
            }
        });


        // validate
        function validate(way, currInput) {
            var currValue = $.trim(currInput.val()),
                currOpts = currInput.data('mxvalidateOptions'),
                errorMsg = currInput.parents(options.fieldHolderSelector).find(options.errorMsgClass + '.' + way);
            
            switch(way){
                case 'mxRequired':
                    if (!currValue) {
                        showErrorMsg(errorMsg, currInput);
                        return false;
                    }
                    break;

                case 'mxEmail':
                    var pattern = /^([a-zA-Z0-9._%-+]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})*$/ ;
                    if (currValue.match(pattern) === null) {
                        showErrorMsg(errorMsg, currInput);
                        return false;
                    }
                    break;

                case 'mxDate':
                    break;

                case 'mxNumber':
                    break;

                case 'mxPhone':
                    break;

                case 'mxMax':
                    var maxLength = currOpts.max;
                    if(currValue.length > maxLength) {
                        showErrorMsg(errorMsg, currInput);
                        return false;
                    }
                    break;

                case 'mxMin':
                    var minLength = currOpts.min;
                    if(currValue.length < minLength) {
                        showErrorMsg(errorMsg, currInput);
                        return false;
                    }
            }
            return true;
        }

        function showErrorMsg(errorMsg, currInput) {
            errorMsg.css({
                display: 'block'
            });
        }

        return isValid;
    };    
}