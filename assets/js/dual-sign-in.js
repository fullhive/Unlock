//=============================================================================
// Unlock
// Dual Sign In Page
//
// 1. Global Variables
// 2. Basic Initialization
// 3. Remember Me Feature
// 4. Reset PIN Pad
// 5. Initialize the PIN Pad
// 6. PIN Pad Function
// 7. Alert Which Input is Focused
// 8. Initialize formValidation & Verify Using Ajax
//=============================================================================


//=============================================================================
// 1. Global Variables
//=============================================================================

$rememberMe = false;
$attemptsCounter = 0;
$signInConfirmed = false;
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
// 3. Remember Me Feature
//=============================================================================

    $('#Remember-Me').click( function() {
        $rememberMe = !$rememberMe
        if ($rememberMe) {
            $('#Messages').append("<p class='remember-me-p wow fadeIn text-info'>Remember Me On</p>");
            $(this).find("i").removeClass().addClass('fa fa-check');
        }
        else {
            $('#Messages').append("<p class='remember-me-p wow fadeIn text-warning'>Remember Me Off</p>");
            $(this).find("i").removeClass().addClass('fa fa-user-secret');  
        }
        $('#Messages > .remember-me-p').delay(2000).removeClass("wow fadeIn").fadeOut(1000, function() { $(this).remove(); });
        return false;
    });

//=============================================================================
// 4. Reset PIN Pad
//=============================================================================

    $('.registerButtons').click( function() {
        $padNumbers = "";
        $padCounter = 0;
        $('#Messages').empty();
        $('#Messages').append("<p class='animated fadeIn text-info'>Please Enter a 4-Digit Pin</p>");
        return false;
    });

//=============================================================================
// 5. Initialize the PIN Pad
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
// 6. PIN Pad Function
//=============================================================================

    $('.padRow').find('.innerPad').click( function() {
        whichnum = $(this).data("whichnum");
        if ( $padCounter == 0 ) {
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
            $padNumbers = $padNumbers+whichnum;
            $padCounter = 0;
            $('#Messages > .text-warning').append("*");
            $(this).addClass('pressButton');
            $(this).one('webkitAnimationEnd oanimationend msAnimationEnd animationend',   
                function(e) {
                $(this).removeClass('pressButton');
                if ( $padNumbers == $padNumbersVerify ) {
                    $('.padRow').find(".row").toggle();
                    $('#Messages').empty();
                    $('#Messages').append("<p class='text-info'>Sign In Complete</p>");
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
// 7. Alert Which Input is Focused
//=============================================================================

	$("input").focus( function() { 
        $('#Messages').empty(); 
        $('#Messages').append("<p class='input-p animated fadeIn text-info'>"+$(this).attr('placeholder')+"</p>");
        $('#Messages > .input-p').delay(1000).removeClass("animated fadeIn").fadeOut(1000, function() { $(this).remove(); }); 
    });

//=============================================================================
// 8. Initialize formValidation & Verify Using Ajax
//=============================================================================

    $('#SignInForm').formValidation().on('success.form.fv',function(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        $('#Messages').empty(); 
        $('#Messages').append("<p class='animated fadeIn text-warning'>Verifying Info</p>");
        var unlockEmail = $('#email').val();
        var unlockPassword = $('#password').val();
        $.ajax({
            method: "GET",
            url: "assets/ajax/users.js",
            cache: false,
            data: { 
                ajaxEmail: unlockEmail, 
                ajaxPassword: unlockEmail,
                rememberMe: $rememberMe
            }
        })
        .done(function( result, statusTxt ) { 
            if ( statusTxt == "success" ) {
                $.each( $Users, function() {
                    if ( this.Email == unlockEmail && this.Password == unlockPassword ) {
                        $signInConfirmed = !$signInConfirmed;
                        $attemptsCounter = 0;
                        $padNumbersVerify = this.Pin;
                        if ($rememberMe) {
                            // Do Something to Remember the User
                        }
                    }
                });
                if ( $signInConfirmed ) {
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
                    $('#Messages').append("<p class='animated fadeIn text-danger'>Sign In Failed : Attempt "+$attemptsCounter+"</p>");
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