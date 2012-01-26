/*

    jQuery validation
    JavaScript functions

    Author: Eugene Kuzmin
    Copyright: 2011-12, Eugene Kuzmin. All rights resevered

-----------------------------------------------------------------------*/

$(function(){
    $('.formFields.first,.formFields.second').validation();
})

$.fn.validation = function(options) {
    var options = jQuery.extend({
        errorMsgClass: '.mxError',
        fieldsToValidateSelector: '.mxValidate',
        btnSubmitSelector: '.btnSubmit',
        fieldHolderSelector: 'dd'
    }, options);


    this.each(function(){
        var self = $(this),
            btnSubmit = self.find(options.btnSubmitSelector);        

        btnSubmit.on('click', function(){
            var fieldsToValidate = self.find(options.fieldsToValidateSelector);            
            return doFieldsValidation(fieldsToValidate);
        });
    });

    var doFieldsValidation = function(fieldsToValidate) {
        var isValid = true;
        var validationClasses = new Array(
            'mxRequired', 'mxEmail', 'mxDate', 'mxNumber', 'mxPhone', 'mxMax', 'mxMin'
        );
        fieldsToValidate.each(function() {
            var self = $(this);
            for(var i in validationClasses) {
                var currClass = validationClasses[i];
                if (self.hasClass(currClass)) {
                    if(!validate(currClass, self)) {
                        isValid = false;
                    }
                }
                
            }
        });
        function validate(way, currInput) {
            var currValue = $.trim(currInput.val()),
                currOpts = currInput.data('mxvalidateOptions'),
                errorMsg = currInput.parents(options.fieldHolderSelector).find(options.errorMsgClass + '.' + way);
            
            errorMsg.hide();

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