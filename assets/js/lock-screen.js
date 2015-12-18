//=============================================================================
// Unlock
// Dual Sign In Page
//
// 1. Global Variables
// 2. Basic Initialization
// 3. Reset PIN Pad
// 4. Initialize the PIN Pad
// 5. PIN Pad Function & Verify Using Ajax
// 6. Lock Screen Overlay
//=============================================================================


//=============================================================================
// 1. Global Variables
//=============================================================================

$rememberMe = false;
$padNumbers = "";
$padCounter = 0;
$emailVerify = "jane@joesberries.not"
$padNumbersVerify = "";
$attemptsCounter = 0;

$(document).ready(function(){

//=============================================================================
// 2. Basic Initialization
//=============================================================================    

    $('.hideME').toggle();
    new WOW().init();  
    $('#lock-screen').click(function() {
        $(this).toggle('slow');
    });

//=============================================================================
// 3. Reset PIN Pad
//=============================================================================

    $('.registerButtons').click( function() {
        $padNumbers = "";
        $padCounter = 0;
        $('#Messages').empty();
        $('#Messages').append("<p class='animated fadeIn text-info'>Please Enter Your 4-Digit Pin</p>");
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
                $('#Messages').append("<p class='animated fadeIn text-info'>Please Enter Your 4-Digit Pin</p>"); 
            });
        }
    });

//=============================================================================
// 5. PIN Pad Function & Verify Using Ajax
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
                $.ajax({
                    method: "GET",
                    url: "assets/ajax/users.js",
                    cache: false,
                    data: { ajaxEmail: $emailVerify }
                })
                .done(function( result, statusTxt ) {
                    if ( statusTxt == "success" ) {
                        $.each( $Users, function() {
                            if ( this.Email == $emailVerify ) {
                                $padNumbersVerify = this.Pin;
                            }
                        });
                        if ( $padNumbers == $padNumbersVerify ) {
                            $('.padRow').find(".row").toggle();
                            $attemptsCounter = 0;
                            $('#Messages').empty();
                            $('#Messages').append("<p class='text-info'>Verified</p>");
                        }
                        else if ( $padNumbers != $padNumbersVerify ) {
                            $padNumbers = "";
                            $attemptsCounter++
                            $('#Messages').empty();
                            $('#Messages').append("<p class='text-danger'>PIN Did Not Match</p>");
                            if ($attemptsCounter >= 3) {
                                // Do Something after repeated attempts
                                $('#Messages > p').append("*");
                            } 
                             
                        }  
                    }
                    else {
                        $('#Messages').empty(); 
                        $('#Messages').append("<p class='animated fadeIn text-warning'>Please Try Again</p>");
                    } 
                })
                .fail(function( jqxhr, settings, exception ) {
                    $('#Messages').empty(); 
                    $('#Messages').append("<p class='animated fadeIn text-warning'>Please Try Again</p>");
                });

            });
        }
    });

});

//=============================================================================
// 6. Center Lock Screen Overlay
//=============================================================================

! function(i) {
    i.fn.CenteredDiv = function() {
        var t = this;
        return t.css("position", "absolute").promise().done(function() {
            iwidth = i(window).width(), iheight = i(window).height(), dwidth = t.width(), dheight = t.height(), newTop = iheight / 2 - dheight / 2, newLeft = iwidth / 2 - dwidth / 2, t.css({
                top: newTop,
                left: newLeft
            })
        }), i(window).resize(function() {
            iwidth = i(window).width(), iheight = i(window).height(), dwidth = t.width(), dheight = t.height(), newTop = iheight / 2 - dheight / 2, newLeft = iwidth / 2 - dwidth / 2, t.css("top", newTop).css("left", newLeft)
        }), t
    }
}(jQuery), $(document).ready(function() {
    $("#CenteredDiv").CenteredDiv()
});

