//=============================================================================
// Unlock
// Dual Sign In Page
//
// 1. Global Variables
// 2. Basic Initialization
// 3. Reset PIN Pad
// 4. Initialize the PIN Pad
// 5. PIN Pad Function
// 6. Alert Which Input is Focused
// 7. Initialize formValidation & Verify Using Ajax
//=============================================================================


//=============================================================================
// 1. Global Variables
//=============================================================================

$attemptsCounter = 0;
$emailConfirmed = false;
$padNumbers = "";
$padNumbersVerify = "";
$padCounter = 0;

$(document).ready(function(){

//=============================================================================
// 2. Basic Initialization
//=============================================================================    

    $('.hideME').toggle();
    new WOW().init();  
    $('#sidebar-toggle-button').click(function(event) {
        $('nav').toggleClass('active');
    });

//=============================================================================
// 3. Reset PIN Pad
//=============================================================================

    $('.registerButtons').click( function() {
        $padNumbers = "";
        $padCounter = 0;
        $('#Messages').empty();
        $('#Messages').append("<p class='animated fadeIn text-info'>Please Enter a 4-Digit Pin</p>");
        return false;
    });

//=============================================================================
// 4. Initialize the PIN Pad
//=============================================================================

    $('.padRow').find('.innerPad').one('webkitAnimationEnd oanimationend msAnimationEnd animationend',   
        function(e) {
        $('.padRow').find('.innerPad').removeClass('wow zoomIn zoomInUp zoomInDown zoomInRight zoomInLeft animated');
        $('.padRow').find('.innerPad').removeAttr('style');
        if ( $('#Messages > p').text() == "PIN Did Not Match" ) {
            $('#Messages > p').delay(500).removeClass("animated fadeIn").fadeOut(1000, function() { 
                $(this).remove();
                $('#Messages').empty();
                $('#Messages').append("<p class='animated fadeIn text-info'>Please Enter a 4-Digit Pin</p>"); 
            });
        }
    });

//=============================================================================
// 5. PIN Pad Function
//=============================================================================

    $('.padRow').find('.innerPad').click( function() {
        whichnum = $(this).data("whichnum");
        if ( $padCounter == 0 ) {
            //$(this).removeClass();
            $padNumbers = $padNumbers+whichnum;
            $padCounter++;
            $('#Messages').empty();
            $('#Messages').append("<p class='text-warning'>*</p>");
            $(this).addClass('pressButton');
            $(this).one('webkitAnimationEnd oanimationend msAnimationEnd animationend',   
                function(e) {
                $(this).removeClass('pressButton');
            });
        }
        else if ( $padCounter == 1 || $padCounter == 2 ) {
            //$(this).removeClass();
            $padNumbers = $padNumbers+whichnum;
            $padCounter++;
            $('#Messages > .text-warning').append("*");
            $(this).addClass('pressButton');
            $(this).one('webkitAnimationEnd oanimationend msAnimationEnd animationend',   
                function(e) {
                $(this).removeClass('pressButton');
            });
        }
        else if ( $padCounter == 3 ) {
            //$(this).removeClass();
            $padNumbers = $padNumbers+whichnum;
            $padCounter = 0;
            $('#Messages > .text-warning').append("*");
            $(this).addClass('pressButton');
            $(this).one('webkitAnimationEnd oanimationend msAnimationEnd animationend',   
                function(e) {
                $(this).removeClass('pressButton');
                // Verify Pin and decide what to do next.
                if ( $padNumbers == $padNumbersVerify ) {
                    $('.padRow').find(".row").toggle();
                    $('#Messages').empty();
                    $('#Messages').append("<p class='text-info'>Email Has Been Sent</p>");
                }
                else if ( $padNumbers != $padNumbersVerify ) {
                    $padNumbers = "";
                    $padCounter = 0;
                    nextAction = "#SetPin";
                    $('#Messages').empty();
                    $('#Messages').append("<p class='text-danger'>PIN Did Not Match</p>");  
                }
            });
        }
    });

//=============================================================================
// 6. Alert Which Input is Focused
//=============================================================================

    $("input").focus( function() { 
        $('#Messages').empty(); 
        $('#Messages').append("<p class='input-p animated fadeIn text-info'>"+$(this).attr('placeholder')+"</p>");
        $('#Messages > .input-p').delay(1000).removeClass("animated fadeIn").fadeOut(1000, function() { $(this).remove(); }); 
    });  

//=============================================================================
// 7. Initialize formValidation & Verify Using Ajax
//============================================================================= 

    $('#SignInForm').formValidation().on('success.form.fv',function(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        $('#Messages').empty(); 
        $('#Messages').append("<p class='animated fadeIn text-warning'>Verifying Info</p>");
        var unlockEmail = $('#email').val();
        $.ajax({
            method: "GET",
            url: "assets/ajax/users.js",
            cache: false,
            data: { ajaxEmail: unlockEmail }
        })
        .done(function( result, statusTxt ) {
            if ( statusTxt == "success" ) {
                $.each( $Users, function() {
                    if ( this.Email == unlockEmail ) {
                        $emailConfirmed = !$emailConfirmed;
                        $attemptsCounter = 0;
                        $padNumbersVerify = this.Pin;
                    }
                });
                if ( $emailConfirmed ) {
                    $('#Messages').empty(); 
                    $('#Messages').append("<p class='animated fadeIn text-success'><i class'glyphicon glyphicon-ok'></i></p>");
                    $('#SignInForm').toggle();
                    // Show key pad now that user is validated
                    $('.formRow').fadeOut(200, function() {
                        $('.padRow').fadeIn(200);
                    });
                    $('#Messages').empty(); 
                    $('#Messages').append("<p class='animated fadeIn text-info'>Please Enter Your 4-Digit Pin</p>");
                }
                else {
                    $attemptsCounter++
                    $('#Messages').empty(); 
                    $('#Messages').append("<p class='animated fadeIn text-danger'>Email Not Found : Attempt "+$attemptsCounter+"</p>");
                    $('#SignInForm').data('formValidation').resetForm();
                    $('#password').val(""); 
                    $('#SignInForm').formValidation();
                    if ($attemptsCounter >= 3) {
                        // Do Something after repeated attempts
                        $('#Messages > p').append("*");
                    }   
                }    
            }
            else {
                $('#Messages').empty(); 
                $('#Messages').append("<p class='animated fadeIn text-warning'>Please Try Again</p>");
                $('#SignInForm').data('formValidation').resetForm();
                $('#SignInForm').formValidation();
            } 
        })
        .fail(function( jqxhr, settings, exception ) {
            $('#Messages').empty(); 
            $('#Messages').append("<p class='animated fadeIn text-warning'>Please Try Again</p>");
            $('#SignInForm').data('formValidation').resetForm();
            $('#SignInForm').formValidation();
        });  
        return false;
    });

});