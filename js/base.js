/*

    jQuery validation
    JavaScript functions

    Author: Eugene Kuzmin
    Copyright: 2011-12, Eugene Kuzmin

-----------------------------------------------------------------------*/

$(function(){
    $('.formFields.first,.formFields.second').mxValidation();

    $('.formFields.searchBox').mxValidation({
        isValidFunc: function() {
        	alert('you are looking for: ' + currParentBox.find('.searchField').val());
        }    	
    });    
})