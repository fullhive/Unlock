//=============================================================================
// Unlock
// Dual Sign In Page
//
// 1. Global Variables
// 2. Basic Initialization
// 3. Remember Me Feature
// 4. Alert Which Input is Focused
// 5. Initialize formValidation & Verify Using Ajax
//=============================================================================


//=============================================================================
// 1. Global Variables
//=============================================================================

$rememberMe = false;
$attemptsCounter = 0;
$signInConfirmed = false;

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
// 4. Alert Which Input is Focused
//=============================================================================

    $("input").focus( function() { 
        $('#Messages').empty(); 
        $('#Messages').append("<p class='input-p animated fadeIn text-info'>"+$(this).attr('placeholder')+"</p>");
        $('#Messages > .input-p').delay(1000).removeClass("animated fadeIn").fadeOut(1000, function() { $(this).remove(); }); 
    });   

//=============================================================================
// 5. Initialize formValidation & Verify Using Ajax
//============================================================================= 

 $('#SignInForm').formValidation().on('success.form.fv',function(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        $('#Messages').empty(); 
        $('#Messages').append("<p class='remember-me-p animated fadeIn text-warning'>Verifying Info</p>");
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
                        if ($rememberMe) {
                            // Do Something to Remember the User
                        }
                    }
                });
                if ( $signInConfirmed ) {
                    $('#Messages').empty(); 
                    $('#Messages').append("<p class='remember-me-p animated fadeIn text-info'>Sign In Successful</p>");
                    $('#SignInForm').toggle();
                    // Do Something Now that the user is validated
                }
                else {
                    $attemptsCounter++
                    $('#Messages').empty(); 
                    $('#Messages').append("<p class='remember-me-p animated fadeIn text-danger'>Sign In Failed : Attempt "+$attemptsCounter+"</p>");
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
                $('#Messages').append("<p class='remember-me-p animated fadeIn text-warning'>Please Try Again</p>");
                $('#SignInForm').data('formValidation').resetForm();
                $('#SignInForm').formValidation();
            } 
        })
        .fail(function( jqxhr, settings, exception ) {
            $('#Messages').empty(); 
            $('#Messages').append("<p class='remember-me-p animated fadeIn text-warning'>Please Try Again</p>");
            $('#SignInForm').data('formValidation').resetForm();
            $('#SignInForm').formValidation();
        });  
        return false;
    });
});