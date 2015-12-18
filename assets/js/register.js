//=============================================================================
// Unlock
// Dual Sign In Page
//
// 1. Global Variables
// 2. Basic Initialization
// 3. Reset PIN Pad
// 4. Initialize the PIN Pads
// 5. PIN Pad Functions
// 6. Alert Which Input is Focused
// 7. Initialize formValidation & Verify Using Ajax
//=============================================================================


//=============================================================================
// 1. Global Variables
//=============================================================================

$rememberMe = false;
$padNumbers = "";
$padNumbersVerify = "";
$padCounter = 0;
$currentStep = "#PersonalInfo";
$gotoNextStep = false;
$attemptsCounter = 0;

$(document).ready(function(){

//=============================================================================
// 2. Basic Initialization
//=============================================================================

    $('.hideME').toggle();
    $('.BootStrapValidate').formValidation();
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
// 4. Initialize the PIN Pads
//=============================================================================

    $('#SetPin').find('.innerPad').one('webkitAnimationEnd oanimationend msAnimationEnd animationend',   
        function(e) {
        $('#SetPin').find('.innerPad').removeClass('wow zoomIn zoomInUp zoomInDown zoomInRight zoomInLeft animated');
        $('#SetPin').find('.innerPad').removeAttr('style');
        if ( $('#Messages > p').text() == "PIN Did Not Match" ) {
            $('#Messages > p').delay(500).removeClass("animated fadeIn").fadeOut(1000, function() { 
                $(this).remove();
                $('#Messages').empty();
                $('#Messages').append("<p class='animated fadeIn text-info'>Please Enter a 4-Digit Pin</p>"); 
            });
        }
    });
    $('#VerifyPin').find('.innerPad').one('webkitAnimationEnd oanimationend msAnimationEnd animationend',   
        function(e) {
        $('#VerifyPin').find('.innerPad').removeClass('wow zoomIn zoomInUp zoomInDown zoomInRight zoomInLeft animated');
        $('#VerifyPin').find('.innerPad').removeAttr('style');
    });

//=============================================================================
// 5. PIN Pad Functions
//=============================================================================

    $('#SetPin').find('.innerPad').click( function() {
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
                nextAction = "#VerifyPin";
                $($currentStep).fadeOut(200, function() {
                    $(nextAction).fadeIn(200); 
                });
                $currentStep = nextAction;
                $('#Messages').empty();
                $('#Messages').append("<p class='animated fadeIn text-info'>Please Verify Your 4-Digit Pin</p>");
            });
        }
    });

    $('#VerifyPin').find('.innerPad').click( function() {
        whichnum = $(this).data("whichnum");
        if ( $padCounter == 0 ) {
            $padNumbersVerify = $padNumbersVerify+whichnum;
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
            $padNumbersVerify = $padNumbersVerify+whichnum;
            $padCounter++;
            $('#Messages > .text-warning').append("*");
            $(this).addClass('pressButton');
            $(this).one('webkitAnimationEnd oanimationend msAnimationEnd animationend',   
                function(e) {
                $(this).removeClass('pressButton');
            });
        }
        else if ( $padCounter == 3 ) {
            $padNumbersVerify = $padNumbersVerify+whichnum;
            $padCounter = 0;
            $('#Messages > .text-warning').append("*");
            $(this).addClass('pressButton');
            $(this).one('webkitAnimationEnd oanimationend msAnimationEnd animationend',   
                function(e) {
                $(this).removeClass('pressButton');
                if ( $padNumbers == $padNumbersVerify ) {
                    $($currentStep).find(".row").toggle();
                    $('#Messages').empty();
                    $('#Messages').append("<p class='text-info'>Completing Registration</p>");
                    $.ajax({
                        method: "GET",
                        url: "assets/ajax/users.js",
                        cache: false,
                        data: { 
                            ajaxFirstName: $('#firstname').val(),
                            ajaxLastName: $('#lastname').val(),
                            ajaxEmail: $('#email').val(),
                            ajaxPassword: $('#password').val(),
                            ajaxPin: $padNumbers, 
                        }
                    })
                    .done(function( result, statusTxt ) {
                        if ( statusTxt == "success" ) {
                            $('#Messages').empty();
                            $('#Messages').append("<p class='text-info'>Registration Complete</p><p class='text-default'><small>A confirmation email will be sent to "+$('#email').val()+"</small></p>");
                        }
                        else {
                            $('#Messages').empty();
                            $('#Messages').append("<p class='text-danger'>Registration Failed</p>");  
                        } 
                    })
                    .fail(function( jqxhr, settings, exception ) {
                        $('#Messages').empty();
                        $('#Messages').append("<p class='text-danger'>Registration Failed</p>");
                    }); 
                }
                else if ( $padNumbers != $padNumbersVerify ) {
                    $padNumbers = "";
                    $padNumbersVerify = "";
                    $padCounter = 0;
                    nextAction = "#SetPin";
                    $($currentStep).fadeOut(200, function() {
                        $(nextAction).fadeIn(200); 
                    });
                    $currentStep = nextAction;
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
// 7. Wizard Function & Verify Using Ajax
//=============================================================================

    $('.registerButtons').click( function() {
        nextAction = $(this).attr('href');
        firstFields = ["firstname", "lastname", "email"];
        secondFields = ["password", "confirm-password"];
        counter = 0
        $padNumbers = "";
        $padNumbersVerify = "";
        $padCounter = 0;
        $emailConfirmed = false;
        if ( $(this).text() == 'Continue' ) {
            if ($currentStep == "#PersonalInfo") {
                $.each( firstFields, function( k, v ) {
                    if ( $('#'+v).val() != "" ) {
                        counter++;    
                    }
                });
                if ( counter == 3 ) {
                    // Verify Email
                    $('#Messages').empty();
                    $('#Messages').append("<p class='personal-info-p animated fadeIn text-info'>Verifying Email</p>");
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
                                }
                            });
                            if ( $emailConfirmed ) {
                                $attemptsCounter++
                                $('#Messages').empty(); 
                                $('#Messages').append("<p class='animated fadeIn text-danger'>Email Already Registered : Attempt "+$attemptsCounter+"</p>");
                                $('#email').val();
                                $('.BootStrapValidate').data('formValidation').resetForm();
                                $('.BootStrapValidate').formValidation();
                                if ($attemptsCounter >= 3) {
                                    // Do Something after repeated attempts
                                    $('#Messages > p').append("*");
                                }  
                            }
                            else {
                                $($currentStep).fadeOut(200, function() {
                                    $(nextAction).fadeIn(200); 
                                });
                                $currentStep = nextAction;
                                if ($currentStep == "#PersonalInfo") {
                                    $('#Messages').empty();
                                    $('#Messages').append("<p class='animated fadeIn text-info'>Please Enter Your Personal Info</p>");
                                }
                                else if ($currentStep == "#SetPassword") {
                                    $('#Messages').empty();
                                    $('#Messages').append("<p class='animated fadeIn text-info'>Please Enter a Password</p>");
                                }
                                else if ($currentStep == "#SetPin") {
                                    $('#Messages').empty();
                                    $('#Messages').append("<p class='animated fadeIn text-info'>Please Enter a 4-Digit Pin</p>");
                                }  
                            }    
                        }
                        else {
                            $('#Messages').empty(); 
                            $('#Messages').append("<p class='animated fadeIn text-warning'>Please Try Again</p>");
                            $('.BootStrapValidate').data('formValidation').resetForm();
                            $('.BootStrapValidate').formValidation();
                        } 
                    })
                    .fail(function( jqxhr, settings, exception ) {
                        $('#Messages').empty(); 
                        $('#Messages').append("<p class='animated fadeIn text-warning'>Please Try Again</p>");
                        $('.BootStrapValidate').data('formValidation').resetForm();
                        $('.BootStrapValidate').formValidation();
                    });  
                }
                else {
                    $('#Messages').empty();
                    $('#Messages').append("<p class='personal-info-p animated fadeIn text-danger'>All Fields Are Required</p>");
                    $('#Messages > .personal-info-p').delay(2000).removeClass("animated fadeIn").fadeOut(1000, function() { $(this).remove(); }); 
                }
            }
            else if ($currentStep == "#SetPassword") {
                $.each( secondFields, function( k, v ) {
                    if ( $("i[data-fv-icon-for='"+v+"']").hasClass("glyphicon-ok") ) {
                        counter++;    
                    }
                });
                if ( counter == 2 ) {
                    $gotoNextStep = !$gotoNextStep;
                }
                else {
                    $('#Messages').empty();
                    $('#Messages').append("<p class='personal-info-p animated fadeIn text-danger'>Check Your Password Again</p>");
                    $('#Messages > .personal-info-p').delay(2000).removeClass("animated fadeIn").fadeOut(1000, function() { $(this).remove(); }); 
                }
            }
        }
        else if ( $(this).text() == 'Back' ) {
            $gotoNextStep = !$gotoNextStep;
        }
        else if ( $(this).text() == 'Reset' ) {
            $gotoNextStep = !$gotoNextStep;
        }
        if ($gotoNextStep) {
            $($currentStep).fadeOut(200, function() {
                $(nextAction).fadeIn(200); 
            });
            $currentStep = nextAction;
            if ($currentStep == "#PersonalInfo") {
                $('#Messages').empty();
                $('#Messages').append("<p class='animated fadeIn text-info'>Please Enter Your Personal Info</p>");
            }
            else if ($currentStep == "#SetPassword") {
                $('#Messages').empty();
                $('#Messages').append("<p class='animated fadeIn text-info'>Please Enter a Password</p>");
            }
            else if ($currentStep == "#SetPin") {
                $('#Messages').empty();
                $('#Messages').append("<p class='animated fadeIn text-info'>Please Enter a 4-Digit Pin</p>");
            }
        }
        $gotoNextStep = false;
        return false;
    });

});