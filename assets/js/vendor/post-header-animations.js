
// based on: http://tympanus.net/Development/ArticleIntroEffects

(function() {

    if ($('.post-template:not(.page, .tag-simple)').length) {
        // disable/enable scroll (mousewheel and keys) from http://stackoverflow.com/a/4770179                  
        // left: 37, up: 38, right: 39, down: 40,
        // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
        var keys = [32, 37, 38, 39, 40], wheelIter = 0;

        function preventDefault(e) {
            e = e || window.event;
            if (e.preventDefault)
            e.preventDefault();
            e.returnValue = false;  
        }
        function keydown(e) {
            for (var i = keys.length; i--;) {
                if (e.keyCode === keys[i]) {
                    preventDefault(e);
                    return;
                }
            }
        }
        function touchmove(e) {
            preventDefault(e);
        }
        function wheel(e) {
            // for IE 
            //if( ie ) {
                //preventDefault(e);
            //}
        }
        function disable_scroll() {
            window.onmousewheel = document.onmousewheel = wheel;
            document.onkeydown = keydown;
            document.body.ontouchmove = touchmove;
        }
        function enable_scroll() {
            window.onmousewheel = document.onmousewheel = document.onkeydown = document.body.ontouchmove = null;  
        }
        var docElem = window.document.documentElement,
            scrollVal,
            isRevealed, 
            noscroll,
            isAnimating,
            container = document.getElementById( 'summer-post-container' ) || document,
            trigger = container.querySelector( 'button.trigger' );
        function scrollY() {
            return window.pageYOffset || docElem.scrollTop;
        }
        function scrollPage() {
            scrollVal = scrollY();
            if( noscroll ) {
                if( scrollVal < 0 ) return false;
                // keep it that way
                window.scrollTo( 0, 0 );
            }
            if( $(container).hasClass('notrans')) {
                $(container).removeClass('notrans');
                return false;
            }
            if( isAnimating ) {
                return false;
            }
            if( scrollVal <= 0 && isRevealed ) {
                toggle(0);
            }
            else if( scrollVal > 0 && !isRevealed ){
                toggle(1);
            }
        }
        function toggle( reveal ) {
            isAnimating = true;
            if( reveal ) {
                $(container).addClass('modify');
            }
            else {
                noscroll = true;
                disable_scroll();
                $(container).removeClass('modify');
            }
            // simulating the end of the transition:
            setTimeout( function() {
                isRevealed = !isRevealed;
                isAnimating = false;
                if( reveal ) {
                    noscroll = false;
                    enable_scroll();
                }
                BackgroundCheck.refresh();
            }, 600 );
        }
        // refreshing the page...
        var pageScroll = scrollY();
        noscroll = pageScroll === 0;
        disable_scroll();
        if( pageScroll ) {
            isRevealed = true;
            $(container).addClass('notrans');
            $(container).addClass('modify');
        }
        window.addEventListener( 'scroll', scrollPage );
        trigger.addEventListener( 'click', function() { toggle( 'reveal' ); } );
        document.body.addEventListener('touchstart', function() { toggle( 'reveal' )});
    }
})();