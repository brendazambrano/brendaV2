'use strict';

var summer = (function ($) {

    var indexPostClass = '.summer-index-post',
        mobileMenuButton = '.summer-mobile-menu a',
        mobileMenuCloseButton = '.summer-mobile-close-btn',
        mainMenu = '.summer-menu',
        bgCheckClass = '.bg-check',
        postBgImages = '.bg-img img',
        postCoverImg = '.summer-post-header .bg-img',
        tagsDiv = '.tags-loop',
        allAnimationTypes = ['simple', 'sliced', 'push'],

    // post animations on homepage
    indexPostAnimate = function () {
        if ($('.animated-post').length && $('.post-loop-animations').length) {
            $(indexPostClass).each(function () {
            var postPos = $(this).offset().top;
            var topOfWindow = $(window).scrollTop(),
                windowHeight = $(window).height();
                if (postPos < topOfWindow + (windowHeight/ 1.4)) {
                    $(this).addClass('fadeInDown');
                }
            });
        }
    },

    mobileMenu = function () {
        if($(mainMenu).length) {
            $(mobileMenuButton).on('click', function(e){
                e.preventDefault();
                $(mainMenu).addClass('opened');
            });
            $(mobileMenuCloseButton).on('click', function(e){
                e.preventDefault();
                $(mainMenu).removeClass('opened');
            });
        }
    },

    headerTitlesBackgroundCheck = function () {
        if ($(bgCheckClass).length && $(postBgImages).length) {
            imagesLoaded(postCoverImg, function () {
                BackgroundCheck.init({
                    targets: bgCheckClass,
                    images: postBgImages
                });
            });
        }
    },

    // for now only this nasty hacks can do this
    // hiding animation types tags used to switching posts covers
    removeSimpleTagHelper = function () {
        if ($(tagsDiv).length) {
            $(tagsDiv).each(function () {
                var tagLink = $(this).find('.tag-link > a'),
                    tagPrefix = $(this).find('.tag-prefix');
                tagLink.each(function () {
                    if (allAnimationTypes.indexOf($(this).text()) !== -1) {
                        $(this).closest('.tag-link').remove();
                    }
                });
                if(tagPrefix.next().length === 0) {
                    tagPrefix.remove();
                }
            });
        }
    },

    // https://highlightjs.org/
    syntaxHighlighter = function () {
        hljs.initHighlightingOnLoad();
    },

    searchModule = function () {
        var $openSearchBtn = $('.js-open-search');
        var $closeSearchBtn = $('.js-close-search');
        var $bigSearchContainer = $('.big-search');
        // ghost hunter init
        var ghostHunter = $('.js-search-input').ghostHunter({
            results: '.js-search-results',
            result_template: '<a href="{{link}}"><p><h2><i class="fa fa-fw fa-dot-circle-o"></i> {{title}}</h2></p></a>',
            onKeyUp: true,
            rss: '/rss/'
        });
        $openSearchBtn.on('click', function (e) {
            e.preventDefault();
            $bigSearchContainer.addClass('open');
            $(window).scrollTop(0);
            $('html').addClass('html-search-height');
            $bigSearchContainer.find('input[type=text]').focus();
        });
        $closeSearchBtn.on('click', function (e) {
            e.preventDefault();
            ghostHunter.clear();
            $('html').removeClass('html-search-height');
            $bigSearchContainer.removeClass('open');
        });
    },

    postStickySidebar = function () {
        var $stickySidebar = $('.js-post-sticky-sidebar');
        var stickyTop;
        var windowTop;
        if ($stickySidebar.length) {
            stickyTop = $stickySidebar.offset().top;
            $(window).on('scroll', function() {
                windowTop = $(window).scrollTop();
                if (stickyTop - 130 <= windowTop) {
                    $stickySidebar.addClass('sticky');
                } else {
                    $stickySidebar.removeClass('sticky');
                }
            });
        }
    },

    // parse feed - for recent posts
    recentPostsParseFeed = function () {
        var $recentPostsContainer = $('.js-post-view-recent');
        if ($recentPostsContainer.length && $recentPostsContainer.is(':visible')) {
            var itemsAmount = $recentPostsContainer.data('items');
            var $items;
            var prepareList = function ($items) {
                var itemCount = $items.length;
                var iterator, $singleItem;
                var $container = $('<ul/>');
                if (itemCount > itemsAmount) {
                    iterator = itemsAmount;
                } else {
                    iterator = itemCount;
                }
                for (var i = 0; i < iterator; i++) {
                    $singleItem = '<li><a href="' + $items.eq(i).find('link').text() + '" class="title">' +
                                    $items.eq(i).find('title').text() + '</a><span class="date"><i class="fa fa-clock-o"></i> ' +
                                    new Date($items.eq(i).find('pubDate').text()).toLocaleString() + '</span></li>';
                    $container.append($singleItem);
                }
                $recentPostsContainer.append($container);
            };
            if (window.globalRSSDataJQObj && window.globalRSSDataJQObj.length) {
                $items = window.globalRSSDataJQObj;
                prepareList($items);
            } else {
                $.get('/rss/',function (data) {
                    $items = $(data).find('item');
                    prepareList($items);
                });
            }
        }
    },

    // based on : 'Reading Position Indicator' article
    // http://css-tricks.com/reading-position-indicator/
    positionIndicator = function () {
        if ($('.js-post-reading-time').is(':visible')) {
            imagesLoaded('.summer-post-content', function () {
                var getMax = function() {
                    return $('.summer-post-content').height();
                };
                var getValue = function() {
                    return $(window).scrollTop();
                };
                var progressBar, max, value, width, percent;
                if('max' in document.createElement('progress')){
                    // Browser supports progress element
                    progressBar = $('progress');
                    // Set the Max attr for the first time
                    progressBar.attr({ max: getMax() });
                    $(document).on('scroll', function(){
                        // On scroll only Value attr needs to be calculated
                        progressBar.attr({ value: getValue() });
                        percent = Math.floor((getValue() / getMax()) * 100) - 5;
                        if (percent < 0) {
                            percent = 0;
                        } else if (percent > 100) {
                            percent = 100;
                            $('.js-post-sticky-sidebar').fadeOut();
                        } else {
                            $('.js-post-sticky-sidebar').fadeIn();
                        }
                        $('.js-percent-count').text(percent + '%');
                    });
                    $(window).resize(function(){
                        // On resize, both Max/Value attr needs to be calculated
                        progressBar.attr({ max: getMax(), value: getValue() });
                    });
                }
                else {
                    progressBar = $('.progress-bar'),
                        max = getMax(),
                        value, width;
                    var getWidth = function(){
                        // Calculate width in percentage
                        value = getValue();
                        width = (value/max) * 100;
                        width = width + '%';
                        return width;
                    };
                    var setWidth = function(){
                        progressBar.css({ width: getWidth() });
                        $('.js-percent-count').text(getWidth());
                    };
                    $(document).on('scroll', setWidth);
                    $(window).on('resize', function(){
                        // Need to reset the Max attr
                        max = getMax();
                        setWidth();
                    });
                }
            });
        }
    },

    readingTime = function () {
        var $postArticleContent = $('.summer-post-content');
        if ($postArticleContent.length) {
            $postArticleContent.readingTime({
                wordCountTarget: $('.js-post-reading-time').find('.js-word-count')
            });
        }
    },

    goToTop = function() {
        var backToTopButton = $('.js-back-to-top-btn');
        if($(backToTopButton).length) {
            $(window).scroll(function () {
                if ($(this).scrollTop() > 300) {
                    $(backToTopButton).removeClass('hidden');
                } else {
                    $(backToTopButton).addClass('hidden');
                }
            });
            $(backToTopButton).on('click', function () {
                $('body,html').animate({
                    scrollTop: 0
                }, 800);
            });
        }
    },

    // summer javascripts initialization
    init = function () {
        indexPostAnimate();
        $(window).on('scroll', function() {
            indexPostAnimate();
        });
        mobileMenu();
        headerTitlesBackgroundCheck();
        $('p:has(> img)').addClass('with-image');
        removeSimpleTagHelper();
        syntaxHighlighter();
        searchModule();
        postStickySidebar();
        recentPostsParseFeed();
        positionIndicator();
        readingTime();
        goToTop();
        $(document).foundation();
    };

    return {
        init: init
    };

})(jQuery);

(function () {
    summer.init();
})();
