/*

    Project name
    JavaScript functions

    Author: Creuna Danmark A/S / www.creuna.dk
    Copyright: 2010, Creuna Danmark A/S. All rights resevered

-----------------------------------------------------------------------*/

$(function(){
    $('.formFields').validation();
})

$.fn.validation = function(options) {
    var options = jQuery.extend({
        fieldsToValidateSelector: '.validatedField',
        btnSubmitSelector: '.btnSubmit',
        fieldHolderSelector: 'dd'
    }, options);

    var fieldsToValidate = this.find(options.fieldsToValidateSelector),
        btnSubmit = this.find(options.btnSubmitSelector);

    btnSubmit.live('click', function(){
        return doFieldsValidation();
    })


    var doFieldsValidation = function()
    {
        var isValid = true;
        var validationClasses = new Array(
            'required', 'email', 'date', 'number', 'phone'
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
            var currValue = $.trim(currInput.val());
            var errorMsg = currInput.parents(options.fieldHolderSelector).find('.error.' + way);
            errorMsg.hide();

            switch(way){
                case 'required':
                    if (!currValue) {
                        showErrorMsg(errorMsg, currInput);
                        return false;
                    }
                    break;
                case 'email':
                    var pattern = /^([a-zA-Z0-9._%-+]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})*$/ ;
                    if (currValue.match(pattern) === null) {
                        showErrorMsg(errorMsg, currInput);
                        return false;
                    }
                    break;
                case 'date':
                    break;
                case 'number':
                    break;
                case 'phone':
            }
            return true;
        }
        function showErrorMsg(errorMsg, currInput) {
            errorMsg.show();
        }
        return isValid;
    };    
}