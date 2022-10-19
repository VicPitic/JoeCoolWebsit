jQuery(document).ready(function($) {

    //animated headers
    ////check is strong contain HTML tag
    function isHTML(str) {
        var doc = new DOMParser().parseFromString(str, "text/html");
        return Array.from(doc.body.childNodes).some(function(node) {
            return node.nodeType === 1;
        });
    }

    ////prepare headers to animate (all tags with class "animated-header") - close words into divs and letters into spans
    function animateHeaderInit($this) {
        $($this).each(function() {
            var headerLetterArray = $(this).html().split(' ');
            var newHeaderLetterArray = [];
            for (var i = 0; i < headerLetterArray.length; i++) {
                if (isHTML(headerLetterArray[i])) {
                    if (headerLetterArray[i] === '<br>' || headerLetterArray[i] === '<br/>') {
                        newHeaderLetterArray.push(headerLetterArray[i]);
                    } else if (headerLetterArray[i].substr(0, 4) === '<em>') {
                        newHeaderLetterArray.push('<div class="typo">' + headerLetterArray[i].replace(/(_)/ig, ' ').replace(/(&amp;)/ig, '&').replace(/(<([^>]+)>)/ig, '').replace(/([^\x00-\x10\s]|\w)/g, '$&') + '</div>');
                    } else {
                        newHeaderLetterArray.push('<div>' + headerLetterArray[i].replace(/(<([^>]+)>)/ig, '').replace(/([^\x00-\x10\s]|\w)/g, '$&') + '</div>');
                    }
                } else {
                    newHeaderLetterArray.push('<div>' + headerLetterArray[i].replace(/(&amp;)/ig, '&').replace(/([^\x00-\x10\s]|\w)/g, '$&') + '</div>');
                }
            }
            $(this).html(newHeaderLetterArray.join('<span class="sep"> </span>').replace(/(\<span class\="sep"\>\<\/span\>\<br\>\<span class="sep"\>\<\/span\>)/g, '<br>'));
        });
    }

    var animatedHeaderLong = $('.animated-header-long');

    animatedHeaderLong.each(function() {
        animateHeaderInit(this);
    });

    ////animate header
    function animateHeaderLong($this) {
        anime.timeline({
            loop: false
        }).add({
            targets: $this + ' div:not(.typo)',
            translateY: ['50%', 0],
            translateZ: 0,
            opacity: [0, 1],
            easing: 'easeOutExpo',
            duration: 1000,
            delay: function(el, i) {
                return 300 + 30 * i;
            }
        });
    }

    function animateHeaderLongTypo($this) {
        anime.timeline({
            loop: true
        }).add({
            targets: 'h1.animated-header-typo div.typo',
            translateY: ['50%', 0, 0, '-50%'],
            translateZ: 0,
            opacity: [0, 1, 1, 0],
            easing: 'easeOutExpo',
            duration: 2500,
            delay: function(el, i) {
                return 2000 * i;
            }
        });
        $('h1 .typo').css('display', 'inline-block');
    }

    ////start animation on trigger - appear in visible area
    animatedHeaderLong.on('animationStart', function() {
        if (!$(this).hasClass('animationFinished')) {
            animateHeaderLong('.animationStart');
            $(this).addClass('animationFinished');
        }
    });


    ////check if animated header is in visible area
    function appearHeaderAnimation() {
        animatedHeaderLong.each(function() {
            if ($(window).scrollTop() < $(this).offset().top && $(window).scrollTop() + $(window).height() > $(this).offset().top) {
                $(this).addClass('animationStart').trigger('animationStart').removeClass('animationStart');
            }
        });
    }

    ////start animate headers in visible area on page load
    appearHeaderAnimation();

    setTimeout(function() {
        animateHeaderLongTypo('.animationStart');
    }, 500);


    ////start animate headers on scroll and appeare in visible area
    $(document).on('scroll', appearHeaderAnimation);

    if ($('.letterAnimation').length) {
        anime.timeline({
            loop: true
        }).add({
            targets: '.letterAnimation span',
            translateY: ['50%', 0, 0, '-50%'],
            translateZ: 0,
            opacity: [0, 1, 1, 0],
            easing: 'easeOutExpo',
            duration: 2500,
            delay: function(el, i) {
                return 2000 * i;
            }
        });
    }


    //animation on scroll init
    AOS.init({
        duration: 300,
        easing: 'ease-out',
        offset: 0,
        once: true,
    });


    //boxes headers with arrow
    $('.container-services-list-items .services-list-item a h4, .technologies-boxes-container .technologies-boxes-item a h4').each(function(){
        var str = $(this).html();
        var spacePos = str.search(' ');
        var spanPos = str.search('<span');

        if (spacePos < spanPos){
            var output = [str.slice(0, spacePos), ' <wbr>', str.slice(spacePos + 1)].join('');
            $(this).html(output);
        }
    });


    //main menu add arrow
    $('.nav--main .menu > li.menu-item-has-children, .all-submenu').each(function(){
        $(this).children('a').append('<span class="arrow--nav"><svg xmlns="http://www.w3.org/2000/svg" width="7" height="10" viewBox="0 0 7 10"><path d="M8.45 8.45h-2v-5h-5v-2h7v7z" transform="translate(-662 -767) translate(598 761) translate(61 6) rotate(45 4.95 4.95)" /></svg></span>');
    });


    // blog hero image parallax
    if ($('.blog-feature-image').length){
        $(window).on('scroll', function () {
            if ((window.pageYOffset / window.innerHeight * 100) < 100){
                $('.blog-feature-image').css('background-position-y', (window.pageYOffset / window.innerHeight * 100) + '%');
            }
            else {
                $('.blog-feature-image').css('background-position-y', '100%');
            }
        });
    }


    //sticky menu
    var prevScrollPositionMENU = window.pageYOffset;

    $(window).on('scroll', function() {
        if ($(window).scrollTop() >= $('header.header').height()) {

            var currentScrollPositionMENU = window.pageYOffset;

            if (prevScrollPositionMENU > currentScrollPositionMENU) {
                $('.header').addClass('sticky');
                $('header.header').css('transform', 'translateY(0)');
            }
            else {
                $('.header').removeClass('sticky');
                $('header.header').css('transform', 'translateY(' + $('header.header').height() * -1 + 'px)');
            }
            prevScrollPositionMENU = currentScrollPositionMENU;
        }
        else {
            $('.header').removeClass('sticky');
        }
        AOS.refresh();
    });


    //submenu open
    $('.nav--main ul.menu > li.menu-item-has-children').each(function(){
        $(this).hover(
            function() {
                $('header.header').addClass('open-menu');
                $('header.header .submenu-bg').css('height', + $(this).children('.sub-menu').outerHeight() + 'px');
            },
            function() {
                $('header.header').removeClass('open-menu');
                $('header.header .submenu-bg').css('height', '0');
            }
        );
    });


    //responsive menu
    if (performance.navigation.type == 2 || performance.navigation.TYPE_BACK_FORWARD == 2) {
        $('body').removeClass('open-menu');
    }

    $('.mobile-menu ul.menu li a').click(function(e) {
        $('body').removeClass('open-menu');
    });

    $('nav .menu--button').click(function(e) {
        e.preventDefault();
        $('body').toggleClass('open-menu');
        $('body.open-menu header .mobile-menu .menu-container').fadeOut(1).delay(200).fadeIn();
        $('body.open-menu header .mobile-menu .container-social-media').fadeOut(1).delay(200).fadeIn();
    });

    $('.menu-mobile .menu > li.menu-item-has-children').each(function () {
        $(this).append('<span class="arrow--nav"><svg svg xmlns = "http://www.w3.org/2000/svg" width = "30" height = "30" viewBox = "0 0 30 30" ><path d="M21 19h-2V9H9V7h12v12z" transform="translate(-400 -92) translate(400 92) rotate(135 15 13)" /></svg ></span>');
    });

    $('.menu-mobile .menu .sub-menu > li.menu-item-has-children a').each(function () {
        $(this).append('<span class="arrow--nav"><svg xmlns="http://www.w3.org/2000/svg" width="8" height="13" viewBox="0 0 8 13"><path d="M1.5 12.864L.086 11.45l4.949-4.951L.085 1.55 1.5.136 7.864 6.5 1.5 12.864z" transform="translate(-425 -713) translate(317 705) translate(108 8)" /></svg ></span>');
    });

    $('.menu-mobile .menu-container > ul.menu > li > a').click(function (e) {
        if ($(this).parent('li').hasClass('menu-item-has-children')) {
            e.preventDefault();

            $(this).parent('li').siblings('li').removeClass('open');
            $(this).parent('li').toggleClass('open');

            $(this).parent('li').siblings('li').children('.sub-menu').slideUp();

            if ($(this).parent('li').hasClass('open')){
                $(this).parent('li').children('.sub-menu').slideDown('fast');
            }
            else {
                $(this).parent('li').children('.sub-menu').slideUp();
            }
        }
    });


    //// carousels
    //container home portfolio
    var owlHomeCaseStudyItems = $(".container-home-case-study-items"),
        owlHomeCaseStudyItemsOptions = {
            nav: false,
            dots: false,
            loop: false,
            autoWidth: true,
            responsive: {
                0: {
                    items: 1,
                    margin: 12,
                },
                768: {
                    items: 1.5,
                    margin: 24,
                },
                1024: {
                    items: 1.5,
                    margin: 24,
                }
            }
        };

    $(window).on('load resize', function() {
        if ($(window).width() < 769) {
            owlHomeCaseStudyItems.owlCarousel(owlHomeCaseStudyItemsOptions);
        } else {
            owlHomeCaseStudyItems.owlCarousel('destroy');
        }
    });


    //contact people carousel
    var owlContactPeopleFaces = $(".container-contactpeoplefaces-content"),
        owlContactPeopleFacesOptions = {
            nav: false,
            dots: false,
            loop: false,
            autoWidth: true,
            items: 1,
            margin: 12
        };

    $(window).on('load resize', function() {
        if ($(window).width() < 461) {
            owlContactPeopleFaces.owlCarousel(owlContactPeopleFacesOptions);
        } else {
            owlContactPeopleFaces.owlCarousel('destroy');
        }
    });

    //quote slider
    var owlQuoteSlider = $('.section--testimonials-carousel .wrapper-inside'),
        owlQuoteSliderOptions = {
            center: true,
            loop: true,
            responsiveClass: true,
            nav: true,
            responsive: {
                0: {
                    items: 1,
                    margin: 16
                },
                768: {
                    items: 1.75,
                    margin: 30
                },
                1920: {
                    items: 2.5,
                    margin: 30
                }
            }
        };

    owlQuoteSlider.owlCarousel(owlQuoteSliderOptions);

    //blog related posts
    var owlBlogRelatedBlockSlider = $('.blog-related-posts-container'),
        owlBlogRelatedBlockSliderOptions = {
            nav: true,
            dots: false,
            navText: ['<span class="arrow arrow-next"></span>', '<span class="arrow arrow-prev"></span>'],
            loop: false,
            responsive: {
                0: {
                    items: 1,
                    margin: 12,
                },
                768: {
                    items: 1.5,
                    margin: 24,
                },
                1024: {
                    items: 2,
                    margin: 24,
                },
                1025: {
                    items: 3,
                    margin: 30,
                },
                1281: {
                    items: 3,
                    margin: 50,
                },
                1441: {
                    items: 3,
                    margin: 100,
                }
            }
        };

    owlBlogRelatedBlockSliderOptionsMobile = {
        nav: false,
        dots: false,
        loop: false,
        autoWidth: true,
        responsive: {
            0: {
                items: 1,
                margin: 12,
            },
            768: {
                items: 1.5,
                margin: 24,
            },
            1024: {
                items: 2,
                margin: 24,
            },
            1441: {
                items: 3,
                margin: 100,
            }
        }
    };

    $(window).on('load resize', function () {
        if ($(window).width() <= 768) {
            owlBlogRelatedBlockSlider.owlCarousel(owlBlogRelatedBlockSliderOptionsMobile);
        } else {
            owlBlogRelatedBlockSlider.owlCarousel('destroy');
        }
    });


    //blog category filter
    var owlBlogCategoryFilterSlider = $(".category-filter-list"),
        owlBlogCategoryFilterSliderOptions = {
            nav: false,
            dots: false,
            loop: false,
            responsive: {
                0: {
                    items: 3,
                    margin: 15,
                },
                560: {
                    items: 4,
                    margin: 30,
                },
                768: {
                    items: 5,
                    margin: 30,
                },
                1024: {
                    items: 6,
                    margin: 30,
                }
            }
        };

    $(window).on('load resize', function () {
        if ($(window).width() < 1440) {
            owlBlogCategoryFilterSlider.owlCarousel(owlBlogCategoryFilterSliderOptions);
        } else {
            owlBlogCategoryFilterSlider.owlCarousel('destroy');
        }
    });


    //downloadables menu slider
    var owlDownloadablesMenuSlider = $(".downloadables-menu"),
        owlDownloadablesMenuSliderOptions = {
            nav: false,
            dots: false,
            loop: false,
            autoWidth: true,
            responsive: {
                0: {
                    items: 3,
                    margin: 15,
                },
                560: {
                    items: 4,
                    margin: 30,
                },
                768: {
                    items: 5,
                    margin: 30,
                },
                1024: {
                    items: 6,
                    margin: 30,
                }
            }
        };

    $(window).on('load resize', function () {
        if ($(window).width() < 461) {
            owlDownloadablesMenuSlider.owlCarousel(owlDownloadablesMenuSliderOptions);
        } else {
            owlDownloadablesMenuSlider.owlCarousel('destroy');
        }
    });

    // cookie more info
    $('.cookie-text-more').click(function() {
        if ($(this).hasClass('cookie_open')) {
            $(this).removeClass('cookie_open');
            $('.cn-text-container p').css('max-height', '40px');
        } else {
            $(this).addClass('cookie_open');
            $('.cn-text-container p').css('max-height', 'unset');
        }
    });


    // get a quote policy more info
    $('.cookie-policy-more').click(function () {
        if ($(this).hasClass('cookie_open')) {
            $(this).removeClass('cookie_open').children('.form-legend').text('Show more');
            $(this).siblings('.form-legend').children('.policy-more').slideUp();
        } else {
            $(this).addClass('cookie_open').children('.form-legend').text('Show less');
            $(this).siblings('.form-legend').children('.policy-more').slideDown();
        }
    });


    // newsletter policy more info
    $('.mc4wp-form .cookie-policy-more').click(function () {
        if ($(this).hasClass('cookie_open')) {
            $(this).removeClass('cookie_open').children('.form-legend').text('Show more');
            $('.mc4wp-form .policy .policy-more').hide();
        } else {
            $(this).addClass('cookie_open').children('.form-legend').text('Show less');
            $('.mc4wp-form .policy .policy-more').slideDown();
        }
    });


    //landing slide to
    $('.askaquestion').click(function(e) {
        e.preventDefault();
        if (window.innerWidth < 460) {
            $('html, body').animate({
                scrollTop: $($(this).attr('href')).offset().top - 50
            }, 600);
        } else {
            $('html, body').animate({
                scrollTop: $($(this).attr('href')).offset().top - 140
            }, 600);
        }
    });


    //hero slide to
    window.addEventListener("message", function (event) {
        if (event.data.type === 'hsFormCallback' && event.data.eventName === 'onFormSubmitted') {
            $('p.hubspot-policy').remove();
        }
    });


    //hero slide to
    $('.container-hero-header p a').click(function(e) {
        e.preventDefault();
        if (window.innerWidth < 460) {
            $('html, body').animate({
                scrollTop: $($(this).attr('href')).offset().top - 50
            }, 600);
        } else {
            $('html, body').animate({
                scrollTop: $($(this).attr('href')).offset().top - 140
            }, 600);
        }
    });


    //content side navigation slide to
    $('.content-with-side-navigation-sidenav li a').click(function (e) {
        e.preventDefault();
        if (!$(this).parent('li').hasClass('current')){
            $windowsPosition = $(window).scrollTop();
            $targetElementPosition = parseInt($($(this).attr('href')).offset().top);

            if ($targetElementPosition <= $windowsPosition) {
                $('html, body').animate({
                    scrollTop: $($(this).attr('href')).offset().top
                }, 300);
            }
            else {
                $('html, body').animate({
                    scrollTop: $($(this).attr('href')).offset().top - 100
                }, 300);
            }
            setTimeout(function() {
                $('header.header').removeClass('sticky');
                $('.section--navigation-block').css('top', '0');
            }, 350);
        }
    });


    // slide to top
    $('.toTop a').click(function(e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top
        }, 600);
    });

    $(window).on('scroll', function () {
        if ($(window).scrollTop() >= $(window).height() ) {
            $('.toTop').addClass('showed');
        }
        else {
            $('.toTop').removeClass('showed');
        }
    });


    //content side navigation mark current item
    if ($('.content-with-side-navigation-sidenav').length) {
        $(window).on('scroll resize', function () {
            $topLimit = $('.section--content-with-side-navigation-block').offset().top;
            $bottomLimit = $('.section--content-with-side-navigation-block').offset().top + $('.section--content-with-side-navigation-block').height();
            $windowPos = $(window).scrollTop();

            var filterArr = [];
            if ($windowPos > $topLimit && $windowPos < $bottomLimit) {
                $('.content-with-side-navigation-content .content-items .content-item').each(function () {
                    if ($(this).offset().top >= $windowPos) {
                        $filterClass = $(this).attr('id');
                        filterArr.push($filterClass);
                    }
                });
            }
            else {
                $('.content-with-side-navigation-sidenav li').each(function () {
                    $(this).removeClass('current');
                    filterArr = [];
                });
            }
            $('.content-with-side-navigation-sidenav li').removeClass('current');
            $('.content-with-side-navigation-sidenav li.' + filterArr[0]).addClass('current');
        });
    }


    //content side navigation slide to
    $('.content-benefits-sidenav li a').click(function (e) {
        e.preventDefault();
        if (!$(this).parent('li').hasClass('current')) {
            $windowsPosition = $(window).scrollTop();
            $targetElementPosition = parseInt($($(this).attr('href')).offset().top);

            if ($targetElementPosition <= $windowsPosition) {
                $('html, body').animate({
                    scrollTop: $($(this).attr('href')).offset().top
                }, 300);
            }
            else {
                $('html, body').animate({
                    scrollTop: $($(this).attr('href')).offset().top - 100
                }, 300);
            }
            setTimeout(function () {
                $('header.header').removeClass('sticky');
                $('.section--navigation-block').css('top', '0');
            }, 350);
        }
    });


    //it glossary slide to navigation
    $('.container-menu ul li a, .glossary-item dl dd p a').click(function (e) {
        e.preventDefault();

        if (window.innerWidth < 460) {
            $('html, body').animate({
                scrollTop: $($(this).attr('href')).offset().top - 20
            }, 300);
        }
        else {
            $('html, body').animate({
                scrollTop: $($(this).attr('href')).offset().top - 50
            }, 300);
        }

        setTimeout(function () {
            $('header.header').removeClass('sticky open-menu').css('transform', 'translateY(-80px)');
        }, 350);
    });

    //content side navigation mark current item
    if ($('.content-benefits-sidenav').length) {
        $(window).on('scroll resize', function () {
            $topBenefitsLimit = $('.section--content-benefits-block').offset().top;
            $bottomBenefitsLimit = $('.section--content-benefits-block').offset().top + $('.section--content-benefits-block').height();
            $windowPos = $(window).scrollTop();

            var filterBenefitsArr = [];
            if ($windowPos > $topBenefitsLimit && $windowPos < $bottomBenefitsLimit) {
                $('.content-benefits-content .content-items .content-item').each(function () {
                    if ($(this).offset().top >= $windowPos) {
                        $filterBenefitsClass = $(this).attr('id');
                        filterBenefitsArr.push($filterBenefitsClass);
                    }
                });
            }
            else {
                $('.content-benefits-sidenav li').each(function () {
                    $(this).removeClass('current');
                    filterBenefitsArr = [];
                });
            }
            $('.content-benefits-sidenav li').removeClass('current');
            $('.content-benefits-sidenav li.' + filterBenefitsArr[0]).addClass('current');
        });
    }


    //blog table of content current item
    if ($('.container-blog-single-content-left-column .lwptoc').length) {
        window.addEventListener('scroll', throttle(scrollAnimation, 100));

        function throttle(fn, wait) {
            var time = Date.now();
            return function () {
                if ((time + wait - Date.now()) < 0) {
                    fn();
                    time = Date.now();
                }
            }
        }

        function scrollAnimation() {
            $topContentLimit = $('.container-blog-single-content').offset().top;
            $bottomContentLimit = $('.container-blog-single-content').offset().top + $('.container-blog-single-content').height();
            $windowPos = $(window).scrollTop();

            if ($windowPos > $topContentLimit && $windowPos < $bottomContentLimit) {
                $('.container-blog-single-content h2 span, .container-blog-single-content h3 span').each(function () {
                    if ($(this).offset().top >= $windowPos) {
                        $filterContentID = $(this).attr('id');
                        $('a[href="#' + $filterContentID + '"').parent('.lwptoc_item').addClass('current');
                    }
                    else {
                        $('.lwptoc_item').removeClass('current');
                    }
                });
            }

            $i = 0;
            $('.container-blog-single-content-left-column .lwptoc_item.current').each(function () {
                if ($i > 0) {
                    $(this).removeClass('current');
                }
                $i++;
            });

            $j = 0;
            $('.container-blog-single-content-right-column .lwptoc_item.current').each(function () {
                if ($j > 0) {
                    $(this).removeClass('current');
                }
                $j++;
            });

            $('.lwptoc_itemWrap').each(function () {
                $(this).removeClass('currentParent');
            });

            $('.lwptoc_item.current').closest('.lwptoc_itemWrap').addClass('currentParent');
        }

        $('.lwptoc_item a').click(function (e) {
            e.preventDefault();
            if (window.innerWidth < 460) {
                $('html, body').animate({
                    scrollTop: $($(this).attr('href')).offset().top - 50
                }, 600);
            } else {
                $('html, body').animate({
                    scrollTop: $($(this).attr('href')).offset().top - 140
                }, 600);
            }
        });
    }

    //downloadables current item
    if ($('.container-downloadables-menu').length) {
        $(window).on('scroll resize', function () {
            $topDownloadablesLimit = $('.container-downloadables-items').offset().top - 100;
            $bottomDownloadablesLimit = $('.container-downloadables-items').offset().top + $('.container-downloadables-items').height();
            $scrollPos = $(window).scrollTop();

            var filterDownloadablesArr = [];
            if ($scrollPos > $topDownloadablesLimit && $scrollPos < $bottomDownloadablesLimit) {
                $('.downloadables-type-items').each(function () {
                    if ($(this).offset().top >= $scrollPos) {
                        $filterDownloadablesClass = $(this).attr('id');
                        filterDownloadablesArr.push($filterDownloadablesClass);
                    }
                });
            }
            else {
                $('.container-downloadables-menu li a').each(function () {
                    $(this).removeClass('current');
                    filterDownloadablesArr = [];
                });
            }
            $('.container-downloadables-menu li a').removeClass('current');

            $('.container-downloadables-menu li a.' + filterDownloadablesArr[0]).addClass('current');
        });
    }


    //navigation block menu - carousel on mobile
    var owlNavigationBlockMenu = $(".navigation-content .menu-items"),
        owlNavigationBlockMenuOptions = {
            nav: false,
            dots: false,
            loop: false,
            autoWidth: true,
            responsive: {
                0: {
                    items: 2,
                    margin: 12,
                },
                560: {
                    items: 3,
                    margin: 24,
                },
                1024: {
                    items: 3,
                    margin: 24,
                }
            }
        };

    $(window).on('load resize', function () {
        if ($(window).width() <= 768) {
            owlNavigationBlockMenu.owlCarousel(owlNavigationBlockMenuOptions);
        } else {
            owlNavigationBlockMenu.owlCarousel('destroy');
        }
    });


    // navigation block menu - active menu item
    if ($('.section--navigation-block').length) {

        var prevScrollPosition = window.pageYOffset;

        $(window).on('scroll resize', function () {
            $topNavLimit = $('.section--navigation-block').prev().offset().top + $('.section--navigation-block').prev().height();
            $bottomNavLimit = $('footer.footer').offset().top + $('footer.footer').height();
            $windowPos = $(window).scrollTop();
            $windowPosBottom = $(window).scrollTop() + $(window).height();

            var filterNavArr = [];

            if ($windowPos > $topNavLimit && $windowPos < $bottomNavLimit) {

                $('.section--navigation-block').addClass('sticky');

                var currentScrollPosition = window.pageYOffset;

                if (prevScrollPosition > currentScrollPosition) {
                    $('.section--navigation-block').css('transform', 'translateY(' + $('header.header').height() + 'px)');
                }
                else {
                    $('.section--navigation-block').css('transform', 'translateY(0)');


                }

                prevScrollPosition = currentScrollPosition;

                $('.section-nav-anchor').each(function () {
                    if ($windowPos >= $(this).offset().top - 150 && $windowPos <= ($(this).offset().top + $(this).height())){
                        $filterClass = $(this).attr('id');
                        filterNavArr.push($filterClass);
                    }
                });
            }
            else {
                $('.section--navigation-block').removeClass('sticky');

                $('.navigation-content .menu-items span a').each(function () {
                    $(this).removeClass('current');
                    filterNavArr = [];
                });
            }

            $('.navigation-content .menu-items span a').removeClass('current');
            $('.navigation-content .menu-items span a.' + filterNavArr[0]).addClass('current');

            if (filterNavArr[0] !== undefined) {
                $filterIndex = 0;
                $('.navigation-content .owl-stage .owl-item').each(function () {
                    if ($(this).children('span').children('a').hasClass(filterNavArr[0])) {
                        $('.navigation-content .menu-items').trigger('to.owl.carousel', $filterIndex).trigger('refresh.owl.carousel');
                    }
                    $filterIndex++;
                });
            }

        });
    }


    // navigation block menu - scroll to animation
    $('.navigation-content div span a').on('click', function (e) {
    e.preventDefault();

    if(!$(this).hasClass('current')){

        $windowsPosition = $(window).scrollTop();
        $targetId = $(this).attr('href');
        $navBlockHeight = $('.section--navigation-block').height();
        $targetHeight = parseInt($($targetId).offset().top) - $navBlockHeight;


        if ($(this).closest('.section--navigation-block').hasClass('sticky')){
            $('html, body').animate({
                scrollTop: $targetHeight
            }, {
                duration: 600,
                complete: function() {
                    setTimeout(function() {
                        $('header.header').removeClass('sticky');
                        $('.section--navigation-block').css('top', '0');
                    }, 100);
                }
            });
        }
        else {
            $('html, body').animate({
                scrollTop: $targetHeight - $('.section--navigation-block').outerHeight(true)
            }, {
                duration: 600,
                complete: function() {
                    setTimeout(function() {
                        $('header.header').removeClass('sticky');
                        $('.section--navigation-block').css('top', '0');
                    }, 10);
                }
            });
        }

    }
});


    //brand carousel
    var owlHomeBrandCarousel1 = $('.brand-items-carousel1'),
        owlHomeBrandCarouselOptions1 = {
            touchDrag: false,
            mouseDrag: false,
            nav: false,
            dots: false,
            autoplay: true,
            autoplaySpeed: 50,
            autoplayTimeout: 4000,
            loop: true,
            margin: 0,
            responsive: {
                0: {
                    items: 2,
                    slideBy: 2,
                },
                460: {
                    items: 3,
                    slideBy: 3,
                },
                1024: {
                    items: 6,
                    slideBy: 6,
                    margin: 50
                }
            }
        };

    owlHomeBrandCarousel1.on('translate.owl.carousel', function(event) {

        owlHomeBrandCarousel1.trigger('stop.owl.autoplay');

        $($(this).find('.owl-item')).each(function(index) {
            (function(that, i) {
                var translateTime = setTimeout(function() {
                    $(that).css('opacity', 0);
                }, 4000);
            })(this, index);
        });

        $(this).find('.owl-item').css('opacity', 0).css('transform', 'translateY(100%)');

        setTimeout(function() {
            owlHomeBrandCarousel1.trigger('play.owl.autoplay');
        }, 100);
    });

    owlHomeBrandCarousel1.on('translated.owl.carousel', function(event) {
        $($(this).find('.owl-item.active')).each(function(index) {
            (function(that, i) {
                var translatedTime = setTimeout(function() {
                    $(that).css('opacity', 1).css('transform', 'translateY(0)');
                }, 100 * i);
            })(this, index);
        });
    });

    owlHomeBrandCarousel1.owlCarousel(owlHomeBrandCarouselOptions1);

    var owlHomeBrandCarousel2 = $('.brand-items-carousel2');

    owlHomeBrandCarousel2.on('translate.owl.carousel', function(event) {

        owlHomeBrandCarousel2.trigger('stop.owl.autoplay');

        $($(this).find('.owl-item')).each(function(index) {
            (function(that, i) {
                var translateTime = setTimeout(function() {
                    $(that).css('opacity', 0);
                }, 4000);
            })(this, index);
        });

        $(this).find('.owl-item').css('opacity', 0).css('transform', 'translateY(100%)');

        setTimeout(function() {
            owlHomeBrandCarousel2.trigger('play.owl.autoplay');
        }, 100);
    });

    owlHomeBrandCarousel2.on('translated.owl.carousel', function(event) {
        $($(this).find('.owl-item.active')).each(function(index) {
            (function(that, i) {
                var translatedTime = setTimeout(function() {
                    $(that).css('opacity', 1).css('transform', 'translateY(0)');
                }, 100 * i);
            })(this, index);
        });
    });

    owlHomeBrandCarousel2.owlCarousel(owlHomeBrandCarouselOptions1);

    //portfolio block project slider
    var owlPortfolioSlider = $('.container-portfolio-slider'),
    owlPortfolioSliderOptions = {
        nav: true,
        navText: ['<span class="arrow arrow-next"></span>', '<span class="arrow arrow-prev"></span>'],
        dots: false,
        loop: false,
        items: 1,
        margin: 1
    };

    window.onpageshow = function(event) {
        if (event.persisted) {
            window.location.reload();
        }
    };

    owlPortfolioSlider.owlCarousel(owlPortfolioSliderOptions);

    //container services case study
    var owlServicesCaseStudyItemsDesktop = $(".container-portfolio-list-items-desktop"),
        owlServicesCaseStudyItemsOptionsDesktop = {
            nav: true,
            navText: ['<span class="arrow arrow-next"></span>', '<span class="arrow arrow-prev"></span>'],
            dots: false,
            loop: false,
            responsive: {
                0: {
                    items: 1,
                    slideBy: 1,
                    margin: 12,
                    autoWidth: true,
                },
                768: {
                    items: 3,
                    slideBy: 1,
                    margin: 30,
                    autoWidth: false,
                }
            }
        };

    owlServicesCaseStudyItemsDesktop.owlCarousel(
        owlServicesCaseStudyItemsOptionsDesktop
    );


    var owlServicesCaseStudyItemsMobile = $(".container-portfolio-list-items-mobile-only"),
        owlServicesCaseStudyItemsOptionsMobile = {
            nav: false,
            dots: false,
            loop: false,
            autoWidth: true,
            items: 1,
            margin: 12
        };

    $(window).on('load resize', function() {
        if ($(window).width() < 769) {
            owlServicesCaseStudyItemsMobile.owlCarousel(
                owlServicesCaseStudyItemsOptionsMobile
            );
        } else {
            owlServicesCaseStudyItemsMobile.owlCarousel("destroy");
        }
    });

    //portfolio archive
    var owlPortfolioArchive = $(".portfolio-page---slide"),
    owlPortfolioArchiveOptions = {
        nav: true,
        navText: ['<span class="arrow arrow-prev"></span>', '<span class="arrow arrow-next"></span>'],
        dots: true,
        loop: true,
        items: 1,
        margin: 1
    };

    owlPortfolioArchive.owlCarousel(owlPortfolioArchiveOptions);


    //portfolio slider wall
    var owlPortfolioSlideWall = $(".portfolio-slide .portfolio-slide-image"),
        owlPortfolioSlideWallOptions = {
            nav: true,
            navText: ['<span class="arrow arrow-prev"></span>', '<span class="arrow arrow-next"></span>'],
            dots: false,
            loop: false,
            items: 1,
            margin: 1
        };

    owlPortfolioSlideWall.owlCarousel(owlPortfolioSlideWallOptions);

    var owlPortfolioSlideWallText = $(".portfolio-slide .portfolio-slide-text"),
        owlPortfolioSlideWallTextOptions = {
            nav: true,
            navText: ['<span class="arrow arrow-prev"></span>', '<span class="arrow arrow-next"></span>'],
            dots: false,
            loop: false,
            animateIn: 'fadeIn',
            animateOut: 'fadeOut',
            items: 1,
            margin: 1
        };

    owlPortfolioSlideWallText.owlCarousel(owlPortfolioSlideWallTextOptions);

    $(".container-portfolio-list-logos .portfolio-list-logos-logo").each(function () {
        $(this).on('click', function () {
            $targetItem = $(this).attr('data-item');
            owlPortfolioSlideWall.trigger("to.owl.carousel", $targetItem);
            owlPortfolioSlideWallText.trigger("to.owl.carousel", $targetItem);
        });
    });

    owlPortfolioSlideWall.on("changed.owl.carousel", function (event) {
        $targetItem = event.item.index;

        $(".container-portfolio-list-logos .portfolio-list-logos-logo").each(function () {
            $(this).removeClass("active");
        });
        $(".container-portfolio-list-logos .portfolio-list-logos-logo:nth-child(" + ($targetItem + 1 ) + ")").addClass(
            "active"
        );

        owlPortfolioSlideWallText.trigger("to.owl.carousel", $targetItem);

        $('.portfolio-slide-text .active h2').removeClass('animationFinished').addClass('animationStart').trigger('animationStart').removeClass('animationStart');
    });

    owlPortfolioSlideWallText.on("changed.owl.carousel", function (event) {
        $targetItem = event.item.index;

        owlPortfolioSlideWall.trigger("to.owl.carousel", $targetItem);

        $('.portfolio-slide-text .active h2').removeClass('animationFinished').addClass('animationStart').trigger('animationStart').removeClass('animationStart');
    });


    //events slider wall
    var owlEventsSlideWall = $(".events-slide .events-slide-image"),
        owlEventsSlideWallOptions = {
            nav: true,
            navText: ['<span class="arrow arrow-prev"></span>', '<span class="arrow arrow-next"></span>'],
            dots: false,
            loop: false,
            items: 1,
            margin: 1
        };

    owlEventsSlideWall.owlCarousel(owlEventsSlideWallOptions);

    var owlEventsSlideWallText = $(".events-slide .events-slide-text"),
        owlEventsSlideWallTextOptions = {
            nav: true,
            navText: ['<span class="arrow arrow-prev"></span>', '<span class="arrow arrow-next"></span>'],
            dots: false,
            loop: false,
            animateIn: 'fadeIn',
            animateOut: 'fadeOut',
            items: 1,
            margin: 1
        };

    owlEventsSlideWallText.owlCarousel(owlEventsSlideWallTextOptions);

    $(".container-events-list-logos .events-list-logos-logo").each(function () {
        $(this).on('click', function () {
            $targetItem = $(this).attr('data-item');
            owlEventsSlideWall.trigger("to.owl.carousel", $targetItem);
            owlEventsSlideWallText.trigger("to.owl.carousel", $targetItem);
        });
    });

    owlEventsSlideWall.on("changed.owl.carousel", function (event) {
        $targetItem = event.item.index;

        $(".container-events-list-logos .events-list-logos-logo").each(function () {
            $(this).removeClass("active");
        });
        $(".container-events-list-logos .events-list-logos-logo:nth-child(" + ($targetItem + 1 ) + ")").addClass(
            "active"
        );

        owlEventsSlideWallText.trigger("to.owl.carousel", $targetItem);

        $('.events-slide-text .active h2').removeClass('animationFinished').addClass('animationStart').trigger('animationStart').removeClass('animationStart');
    });

    owlEventsSlideWallText.on("changed.owl.carousel", function (event) {
        $targetItem = event.item.index;

        owlEventsSlideWall.trigger("to.owl.carousel", $targetItem);

        $('.events-slide-text .active h2').removeClass('animationFinished').addClass('animationStart').trigger('animationStart').removeClass('animationStart');
    });


    //services awards carousel
    var owlServicesawardedItems = $(".awarded-items"),
        owlServicesawardedItemsOptions = {
            nav: false,
            dots: false,
            loop: false,
            autoWidth: true,
            items: 1,
            margin: 12
        };

    $(window).on('load resize', function() {
        if ($(window).width() < 461) {
            owlServicesawardedItems.owlCarousel(owlServicesawardedItemsOptions);
        } else {
            owlServicesawardedItems.owlCarousel('destroy');
        }
    });

    //services design work process
    var owlDesignWorkProcess = $(".work-process-items"),
        owlDesignWorkProcessOptions = {
            nav: false,
            dots: false,
            loop: false,
            items: 1,
            responsive: {
                0: {
                    margin: 15
                },
                460: {
                    margin: 15
                },
                1024: {
                    margin: 0
                }
            }
        };

    owlDesignWorkProcess.owlCarousel(owlDesignWorkProcessOptions);

    $(".slider-work-process ul li").each(function() {
        $(this).on('click', function() {
            $targetItem = $(this).attr('data-item');
            owlDesignWorkProcess.trigger("to.owl.carousel", $targetItem);
        });
    });

    owlDesignWorkProcess.on("changed.owl.carousel", function(event) {
        $targetItem = event.item.index;

        $(".slider-work-process ul li").each(function() {
            $(this).removeClass("active");
        });
        for ($i = 1; $i <= parseInt($targetItem) + 1; $i++) {
            $(".slider-work-process ul li:nth-child(" + $i + ")").addClass(
                "active"
            );
        }
    });


    //about numbers slider
    var owlAboutNumbersSlider = $('.section--about-numbers-counter'),
        owlAboutNumbersSliderOptions = {
            nav: false,
            loop: false,
            margin: 0,
            responsive: {
                0: {
                    items: 2,
                },
                768: {
                    items: 4
                }
            }
        };

    owlAboutNumbersSlider.owlCarousel(owlAboutNumbersSliderOptions);


    //numbers slider columns
    var owlNumbersColumnsSlider = $('.section--about-numbers-columns-counter'),
        owlNumbersColumnsSliderOptions = {
            nav: false,
            loop: false,
            margin: 0,
            responsive: {
                0: {
                    items: 2,
                },
                768: {
                    items: 4
                }
            }
        };

    owlNumbersColumnsSlider.owlCarousel(owlNumbersColumnsSliderOptions);


    //about quote slider
    var owlAboutQuoteSlider = $('.container--quotes-slider'),
        owlCowlAboutQuoteSliderOptions = {
            nav: true,
            navText: ['<span class="arrow arrow-next"></span>', '<span class="arrow arrow-prev"></span>'],
            dots: false,
            loop: false,
            items: 1,
            margin: 0
        };

    owlAboutQuoteSlider.owlCarousel(owlCowlAboutQuoteSliderOptions);


    //about gallery slider
    var owlAboutGallerySlider = $('.container--gallery-slider'),
        owlAboutGallerySliderOptions = {
            nav: false,
            dots: false,
            loop: false,
            responsive: {
                0: {
                    items: 1,
                    margin: 12,
                },
                560: {
                    items: 2,
                    margin: 24,
                },
                1024: {
                    items: 3,
                    margin: 24,
                },
                1441: {
                    items: 3,
                    margin: 30,
                }
            }
        };

    owlAboutGallerySlider.owlCarousel(owlAboutGallerySliderOptions);


    //service carousel
    var owlServiceSlider = $('.container-service--carousel'),
        owlServiceOptions = {
            dots: false,
            nav: true,
            navText: ['<span class="arrow arrow-next"></span>', '<span class="arrow arrow-prev"></span>'],
            autoplay: false,
            loop: false,
            items: 1,
            margin: 1
        };

    owlServiceSlider.owlCarousel(owlServiceOptions);

    owlServiceSlider.on('changed.owl.carousel', function(event) {
        $('.container-service-carousel-text-item').each(function() {
            $(this).fadeOut(100);
        });

        $('.container-service-carousel-text-item:nth-child(' + (event.item.index + 1) + ')').delay(100).fadeIn();
    });


    //about gallery slider
    var owlBlogSlider = $('.blog-posts-container'),
        owlBlogSliderOptions = {
            nav: true,
            dots: false,
            navText: ['<span class="arrow arrow-next"></span>', '<span class="arrow arrow-prev"></span>'],
            loop: false,
            responsive: {
                0: {
                    items: 1,
                    margin: 12,
                },
                560: {
                    items: 2,
                    margin: 24,
                },
                1024: {
                    items: 3,
                    margin: 24,
                },
                1441: {
                    items: 3,
                    margin: 30,
                }
            }
        };

    owlBlogSlider.owlCarousel(owlBlogSliderOptions);


    //blog block slider
    var owlBlogBlockSlider = $('.blog-block-container'),
        owlBlogBlockSliderOptions = {
            nav: true,
            dots: false,
            navText: ['<span class="arrow arrow-next"></span>', '<span class="arrow arrow-prev"></span>'],
            loop: false,
            responsive: {
                0: {
                    items: 1,
                    margin: 12,
                },
                768: {
                    items: 1.5,
                    margin: 24,
                },
                1024: {
                    items: 2,
                    margin: 24,
                },
                1025: {
                    items: 3,
                    margin: 30,
                },
                1281: {
                    items: 3,
                    margin: 50,
                },
                1441: {
                    items: 3,
                    margin: 100,
                }
            }
        };

        owlBlogBlockSliderOptionsMobile = {
            nav: true,
            dots: false,
            navText: ['<span class="arrow arrow-next"></span>', '<span class="arrow arrow-prev"></span>'],
            loop: false,
            autoWidth: true,
            responsive: {
                0: {
                    items: 1,
                    margin: 12,
                },
                768: {
                    items: 1.5,
                    margin: 24,
                },
                1024: {
                    items: 2,
                    margin: 24,
                },
                1441: {
                    items: 3,
                    margin: 100,
                }
            }
        };

        owlBlogBlockSlider.owlCarousel(owlBlogBlockSliderOptions);
        $(window).on('load resize', function() {
            if ($(window).width() < 769) {
                owlBlogBlockSlider.owlCarousel('destroy');
                owlBlogBlockSlider.owlCarousel(owlBlogBlockSliderOptionsMobile);
            } else {
                owlBlogBlockSlider.owlCarousel('destroy');
                owlBlogBlockSlider.owlCarousel(owlBlogBlockSliderOptions);
            }
        });


    //portfolio counter
    var containerCasestudyChallengeNumbers = $('.container-numbers');
    if (containerCasestudyChallengeNumbers.length) {
        var a = 0;
        $(window).scroll(function() {
            var oTop = containerCasestudyChallengeNumbers.offset().top - window.innerHeight;
            if (a == 0 && $(window).scrollTop() > oTop) {
                $('.counter').each(function() {
                    var $this = $(this),
                        countTo = $this.attr('data-count');
                    $({
                        countNum: $this.text()
                    }).animate({
                        countNum: countTo
                    }, {
                        duration: 1000,
                        easing: 'swing',
                        step: function() {
                            $this.text(Math.floor(this.countNum));
                        },
                        complete: function() {
                            $this.text(this.countNum);
                        }
                    });
                });
                a = 1;
            }
        });
    }


    //about counter
    var sectionAboutNumbersCounter = $('.section--about-numbers-counter');
    if (sectionAboutNumbersCounter.length) {
        var b = 0;
        $(window).on('load scroll', function() {
            var oTop = sectionAboutNumbersCounter.offset().top - window.innerHeight;
            if (b == 0 && $(window).scrollTop() >= oTop) {
                $('.counter').each(function() {
                    var $this = $(this),
                        countTo = $this.attr('data-count');
                    $({
                        countNum: $this.text()
                    }).animate({
                        countNum: countTo
                    }, {
                        duration: 1000,
                        easing: 'swing',
                        step: function() {
                            $this.text(Math.floor(this.countNum));
                        },
                        complete: function() {
                            $this.text(this.countNum);
                        }
                    });
                });

                $('.counter-dot').each(function() {
                    var $this = $(this),
                        countTo = $this.attr('data-count');
                    $({
                        countNum: $this.text()
                    }).animate({
                        countNum: countTo
                    }, {
                        duration: 1000,
                        easing: 'swing',
                        step: function() {
                            $this.text(Math.round(this.countNum * 10) / 10);
                        },
                        complete: function() {
                            $this.text(this.countNum);
                        }
                    });
                });
                b = 1;
            }
        });
    }


    //numbers columns counter
    var sectionNumbersColumnsCounter = $('.section--about-numbers-columns-counter');
    if (sectionNumbersColumnsCounter.length) {
        var b = 0;
        $(window).on('load scroll', function() {
            var oTop = sectionNumbersColumnsCounter.offset().top - window.innerHeight;
            if (b == 0 && $(window).scrollTop() >= oTop) {
                $('.counter').each(function() {
                    var $this = $(this),
                        countTo = $this.attr('data-count');
                    $({
                        countNum: $this.text()
                    }).animate({
                        countNum: countTo
                    }, {
                        duration: 1000,
                        easing: 'swing',
                        step: function() {
                            $this.text(Math.floor(this.countNum));
                        },
                        complete: function() {
                            $this.text(this.countNum);
                        }
                    });
                });

                $('.counter-dot').each(function() {
                    var $this = $(this),
                        countTo = $this.attr('data-count');
                    $({
                        countNum: $this.text()
                    }).animate({
                        countNum: countTo
                    }, {
                        duration: 1000,
                        easing: 'swing',
                        step: function() {
                            $this.text(Math.round(this.countNum * 10) / 10);
                        },
                        complete: function() {
                            $this.text(this.countNum);
                        }
                    });
                });
                b = 1;
            }
        });
    }

    function addCommasToNumber(inputNumber) {
        var number = inputNumber.toString().split(".");
        number[0] = number[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return number.join(".");
    }

    //block numbers counter
    if ($('.numbers-block-items').length) {
        $(window).scroll(function () {
            $('.numbers-block-items:not("finished")').each(function () {
                var oTop = $(this).offset().top - window.innerHeight;
                if ($(window).scrollTop() > oTop){
                    $(this).addClass('active');

                    $('.active .counter').each(function () {
                        var $this = $(this),
                            countTo = $this.attr('data-count');
                        $({
                            countNum: parseFloat(($this.text()).replace(/,/g, ''), 10)
                        }).animate({
                            countNum: countTo
                        }, {
                            duration: 1000,
                            easing: 'swing',
                            step: function () {
                                if(($this.attr('data-count')% 1 != 0)) {
                                    $this.text(addCommasToNumber(Math.round(this.countNum * 10) / 10));
                                } else {
                                    $this.text(addCommasToNumber(Math.floor(this.countNum)));
                                }
                            },
                            complete: function () {
                                $this.text(addCommasToNumber(this.countNum));
                            }
                        });
                    });

                    $(this).removeClass('active').addClass('finished');
                }
            });
        });
    }


    //services content toggle
    $(".container-tab-photo-switch > ul > li").click(function() {
        if ($(this).hasClass('active')) return;
        $(this).toggleClass('active');
        $(this).siblings('li').toggleClass('active');
        var text = $(".container-tab-photo-switch-text");
        var text_alt = $(".container-tab-photo-switch-text-alt");
        text.toggleClass('active');
        text_alt.siblings('div').toggleClass('active');
    });


    //downloadables tabs
    $(".downloadables-type-items-filter li a").click(function(e) {
        e.preventDefault();
        if ($(this).hasClass('active')) return;

        $('.downloadables-type-items-filter li a').each(function () {
            $(this).removeClass('active');
        });
        $(this).addClass('active');

        var index = $(this).attr('href');
        var indexName = index.substring(1, index.length);

        $('.container-downloadables-type-items .downloadables-type-subitems').each(function(){
            $(this).css('display', '').removeClass('active');
        });

        $('.container-downloadables-type-items .downloadables-type-subitems#' + indexName).addClass('active').css('display', 'flex').hide().fadeIn();

        $('.downloadables-type-subitems-desc .downloadables-type-subitems-desc-txt').each(function () {
            $(this).css('display', '').removeClass('active');
        });

        $('.downloadables-type-subitems-desc .downloadables-type-subitems-desc-txt-' + indexName).addClass('active').css('display', 'flex').hide().fadeIn();
    });


    //tabs with photo
    var owlTabsWithPhoto = $(".container-tabs-content").not('.noslider'),
        owlTabsWithPhotoOptions = {
            nav: false,
            dots: false,
            loop: false,
            items: 1,
            animateIn: 'fadeIn',
            animateOut: 'fadeOut',
            responsive: {
                0: {
                    items: 1,
                    margin: 12,
                },
                1025: {
                    items: 1,
                    margin: 0,
                }
            }
        };

    owlTabsWithPhoto.owlCarousel(owlTabsWithPhotoOptions);

    $(".container-tab-navigation ul li").each(function () {
        $(this).on('click', function () {
            $targetItem = $(this).attr('data-item');
            owlTabsWithPhoto.trigger("to.owl.carousel", $targetItem);
        });
    });

    owlTabsWithPhoto.on("changed.owl.carousel", function (event) {
        $targetItem = event.item.index + 1;
        $(".container-tab-navigation ul li").each(function () {
            $(this).removeClass("active");
        });

        $(".container-tab-navigation ul li:nth-child(" + $targetItem + ")").addClass("active");
    });


    //blog image slider
    if ($('.section--blog-slider-image').length) {
        var owlBlogImageSlider = $(".blog-slider-image"),
            owlBlogImageSliderOptions = {
                nav: true,
                navText: ['<span class="arrow arrow-next"><svg xmlns="http://www.w3.org/2000/svg" width="8" height="13" viewBox="0 0 8 13"><g fill="none" fill-rule="evenodd"><g fill="#FFF"><g><g><path d="M10.864 11h-2V4h-7V2h9v9z" transform="translate(-598.000000, -11615.000000) translate(587.000000, 11371.000000) translate(17.431981, 250.500000) scale(-1, 1) translate(-17.431981, -250.500000) translate(11.000000, 244.000000) translate(6.363961, 6.500000) rotate(45.000000) translate(-6.363961, -6.500000)"/></g></g></g></g></svg></span>', '<span class="arrow arrow-prev"><svg xmlns="http://www.w3.org/2000/svg" width="8" height="13" viewBox="0 0 8 13"><g fill="none" fill-rule="evenodd"><g fill="#FFF"><g><g><g><path d="M10.864 11h-2V4h-7V2h9v9z" transform="translate(-1318.000000, -11615.000000) translate(587.000000, 11371.000000) translate(720.000000, 0.000000) translate(6.136039, 244.000000) translate(6.363961, 6.500000) rotate(45.000000) translate(-6.363961, -6.500000)"/></g></g></g></g></g></svg></span>'],
                dots: false,
                loop: false,
                items: 1,
                margin: 0,
            };

        owlBlogImageSlider.owlCarousel(owlBlogImageSliderOptions);

        $(".blog-slider-nav ul li").each(function () {
            $(this).on('click', function () {
                $targetItem = $(this).attr('data-item')- 1;
                owlBlogImageSlider.trigger("to.owl.carousel", $targetItem);
            });
        });

        owlBlogImageSlider.on("changed.owl.carousel", function (event) {
            $targetItem = event.item.index + 1;
            $(".blog-slider-nav ul li").each(function () {
                $(this).removeClass("active");
            });

            $(".blog-slider-nav ul li:nth-child(" + $targetItem + ")").addClass("active");
        });
    }


    //services diagram flow animation
    var servicesDiagram = $('.container-service-solutions-workflow-diagram ul');
    if (servicesDiagram.length) {
        $(window).on('scroll resize orientationchange', function(e) {
            $indexLi = 0;
            if ($(window).scrollTop() < $(servicesDiagram).offset().top && $(window).scrollTop() + $(window).height() / 2 > $(servicesDiagram).offset().top) {
                $(servicesDiagram).addClass('animated');
                $('.container-service-solutions-workflow-diagram ul li').each(function(i) {
                    var $li = $(this);
                    setTimeout(function() {
                        $li.addClass('active');
                    }, i * 250);
                });
            }
        });
    }


    //blog applause button animation
    $('.blog-meta-clap-share .blog-clap .wp-applaud').not('.active').click(function(){
        $(this).after('<span class="numberup">+1</span>');
    });

    //blog archive layout (isotope)
    function blogArchiveLayoutIsotope() {
        var $blogPosts = $('.container-blog-posts-grid');
        if ($('.container-blog-posts-grid').length) {
            let blogSinglePost = $('.blog-post-item');

            blogSinglePost.height('auto');
            maxHeight = 0;

            blogSinglePost.each(function(index, el) {
                let SinglePostHeight  = parseInt($(this).height());
                SinglePostHeight > maxHeight ? maxHeight = SinglePostHeight : false;
            });
            blogSinglePost.height(maxHeight);

            $blogPosts.isotope({
                transitionDuration: '0.3s',
                itemSelector: '.blog-post-item',
                percentPosition: true,
                masonry: {
                    columnWidth: '.container-blog-posts-sizer'
                }
            });
        }
    };

    blogArchiveLayoutIsotope();

    window.addEventListener(("resize"), function() {
        blogArchiveLayoutIsotope();
    });

    $('.container-blog-posts-all').css('display', 'none');


    function handleBenfitSelectBlock(){
        const hoverCategoryLinks = document.querySelectorAll('.section--benefits-select .benefits-item-text');
        const hoverCategoryAnswer = document.querySelectorAll('.section--benefits-select .benefits-item-answer');
        hoverCategoryLinks.forEach((item) => {
            item.addEventListener('click', () => {
                hoverCategoryLinks.forEach((item) => {
                    item.classList.remove('benefits-item-text--active');
                });

                hoverCategoryAnswer.forEach((item) => {
                    item.classList.remove('benefits-item-answer--active');
                });

                item.classList.add('benefits-item-text--active');

                let connectedAnswer = document.querySelector('[data-benefit-select-answer="' + item.dataset.benefitSelectItem + '"]');
                if (connectedAnswer) {
                    connectedAnswer.classList.add('benefits-item-answer--active');
                }
            });
        });
    }
    handleBenfitSelectBlock();

    // testimonial video
    if ($('.testimonial-player-video').length) {

        var testimonialPlayerVideos = Plyr.setup('.testimonial-player-video-play');

        $('.testimonial-player-video .video-link').on('click', function(e) {
            e.preventDefault();

            $(this).siblings('.video-container').css('z-index', '3');

            var videoIndex = $(this).attr('data-index');
            testimonialPlayerVideos[videoIndex].play();
        });
    }

    // faq
    $('.container-faq-container .faq-item .faq-question').click(function() {
        if (!$(this).parent('.faq-item').hasClass('faq-open')) {
            $('.container-faq-container .faq-item').each(function() {
                $(this).children('.faq-answer').hide();
                $(this).removeClass('faq-open');
            });
            $(this).parent('.faq-item').addClass('faq-open');
            $(this).parent('.faq-item').children('.faq-answer').slideDown("fast");
        } else {
            $(this).parent('.faq-item').children('.faq-answer').hide();
            $(this).parent('.faq-item').removeClass('faq-open');
        }
    });

    //  benefit select mobile
    $('.section--benefits-select-mobile .benefits-mobile-item .benefits-mobile-question').click(function() {
        if (!$(this).parent('.benefits-mobile-item').hasClass('benefits-mobile-item-open')) {
            $('.section--benefits-select-mobile .benefits-mobile-item').each(function() {
                $(this).children('.benefits-mobile-answer').hide();
                $(this).removeClass('benefits-mobile-item-open');
            });
            $(this).parent('.benefits-mobile-item').addClass('benefits-mobile-item-open');
            $(this).parent('.benefits-mobile-item').children('.benefits-mobile-answer').slideDown("fast");
        } else {
            $(this).parent('.benefits-mobile-item').children('.benefits-mobile-answer').hide();
            $(this).parent('.benefits-mobile-item').removeClass('benefits-mobile-item-open');
        }
    });

    // faq blog
    $('.faq-blog .faq-item .faq-question').click(function() {
        if (!$(this).parent('.faq-item').hasClass('faq-open')) {
            $('.faq-blog .faq-item').each(function() {
                $(this).children('.faq-answer').hide();
                $(this).removeClass('faq-open');
            });
            $(this).parent('.faq-item').addClass('faq-open');
            $(this).parent('.faq-item').children('.faq-answer').slideDown("fast");
        } else {
            $(this).parent('.faq-item').children('.faq-answer').hide();
            $(this).parent('.faq-item').removeClass('faq-open');
        }
    });

    // close portfolio modal
    $('.close-modal').click(function(e) {
        e.preventDefault();
        $(this).parent('.container--modal-portfolio-delay').parent('.modal-portfolio').animate({
            opacity: 0, // animate slideUp
            marginRight: '-10vw'
        }, 'fast', 'linear', function() {
            $(this).remove();
        });
    });

    // source cookie
    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');

        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];

            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
    }

    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    var getCookieSource = getCookie('cookieSource');
    var cookieSource = 'direct';

    if (typeof getCookieSource !== 'undefined') {
        if (getCookieSource == 'direct') {
            var url = new URL(window.location.href);
            if (url.searchParams.has("utm_source")) {
                cookieSource = url.searchParams.get("utm_source");
                setCookie('cookieSource', cookieSource, 5);
            } else if (url.searchParams.has("gclid")) {
                cookieSource = "google-ads";
                setCookie('cookieSource', cookieSource, 5);
            } else {
                setCookie('cookieSource', cookieSource, 5);
            }
        }
    } else {
        setCookie('cookieSource', cookieSource, 5);
    }

    //comparison tabs
    $('.benefit-accordion-question').click(function(e) {
        e.preventDefault();
        if (!$(this).parent('.benefit-accordion-item').hasClass('benefit-accordion-open')) {

            $(this).parent('.benefit-accordion-item').addClass('benefit-accordion-open');
            $(this).parent('.benefit-accordion-item').children('.benefit-accordion-answer').slideDown("fast");
        } else {
            $(this).parent('.benefit-accordion-item').children('.benefit-accordion-answer').hide();
            $(this).parent('.benefit-accordion-item').removeClass('benefit-accordion-open');
        }
    });

    $('.close_accordion').click(function(e) {
        e.preventDefault();
        if ($(this).parent('.benefit-accordion-answer').parent('.benefit-accordion-item').hasClass('benefit-accordion-open')) {
            $(this).parent('.benefit-accordion-answer').parent('.benefit-accordion-item').removeClass('benefit-accordion-open');
            $(this).parent('.benefit-accordion-answer').parent('.benefit-accordion-item').children('.benefit-accordion-answer').slideUp();
        }
    });

    // home hero video lightbox
    if ($('#hero-video').length) {
        $("#hero-video source").each(function() {
            var sourceFile = $(this).attr("data-src");
            $(this).attr("src", sourceFile);
            var video = this.parentElement;
            video.load();
            video.onloadeddata = function() {
                video.play();
            };
        });
    }

    $('.play').click(function(e) {
        e.preventDefault();

        var urlStr = $(this).attr('href');
        var urlId = urlStr.substring(urlStr.length - 11);

        player.source = {
            type: 'video',
            sources: [{
                src: urlId,
                provider: 'youtube',
            }, ],
        };

        $('body').addClass('noscroll');

        $('.lightboxPlayer .playerContainer').fadeIn(300);

        $('.lightboxPlayer').css('display', 'block');

        if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            player.on('ready', function () {
                player.play();
            });
        }
    });

    $('.lightboxPlayer .playerClose').on('click', function() {

        setTimeout(function() {
            player.stop();
        }, 500);

        $('.lightboxPlayer').css('display', 'none');
        $('body').removeClass('noscroll');

    });


    //block lightbox
    $('.popup-show').click(function (e) {

        e.preventDefault();

        $('body').addClass('noscroll');

        $('.lightboxContainer').fadeIn(300);

        $('.lightBox').css('display', 'block');
    });

    $('.lightBox .lightBoxClose').on('click', function () {

        $('.lightBox').css('display', 'none');
        $('body').removeClass('noscroll');

    });


    //block popup
    if($('.popup').length){
        $(window).on('scroll', function() {
            if($(window).scrollTop() >= ($(document).height() - $(window).height()) * 0.5) {

                $popupAdress = new URL(window.location.href);

                if (getCookie('popupCookie') != $popupAdress + '1') {
                    $('.popupContainer').fadeIn(300);

                    $('.popup').css('display', 'block');

                    setCookie('popupCookie', $popupAdress + '1', 1);
                }
            }
        });

        $('.popup .lightBoxClose').on('click', function () {
            $('.popup').css('display', 'none');
        });
    }


    //downloadables popup
    $('.downloadables-popup').click(function (e) {

        e.preventDefault();

        $formId = $(this).attr('href');
        $portalId = $(this).data('portalid');

        $('body').addClass('noscroll');

        $('#' + $formId + '.lightboxContainer').fadeIn(300);

        $('#' + $formId + '.lightBox').css('display', 'block');
    });

    $('.lightBox .lightBoxClose').on('click', function () {

        $('.lightBox').css('display', 'none');
        $('body').removeClass('noscroll');

    });


    //bagdes show all bagdes
    $('.badges-button').on('click', function(e){
        e.preventDefault();
        if ($(this).hasClass('open')){
            $(this).removeClass('open').text('Hide');
            $('.section--badges-grid-items').addClass('show-all');
        }
        else {
            $(this).addClass('open').text('Show more');
            $('.section--badges-grid-items').removeClass('show-all');
        }
    });


    //blog search input animation
    $('.container-blog-category-filter .search-icon').click(function(){
        $('.container-blog-category-filter .blog-search').css('display', 'flex').hide().fadeIn();
        $(".container-blog-category-filter-header-cat").hide();
    });

    window.onpopstate = function(e){
            if(e.state !== null) {
                location.reload();
        }
    };

    $('.container-blog-category-filter .search-icon-close').click(function(){
        $('.section--blog-category-filter li').removeClass('active-category');
        $('.section--blog-category-filter li').removeClass('active');
        $('.section--blog-category-filter li').first().addClass('active-category');
        $('.section--blog-category-filter li').first().addClass('active');
        $('.container-blog-category-filter .blog-search').fadeOut();
        $('.blog-search input').val('');
        $(".section--blog-blog-pagination").show();
        $(".container-blog-posts").css('display', '').hide().fadeIn();
        $('.container-blog-posts-empty').hide();
        $('.container-blog-posts-search').css("display", "none");
        $('.section--blog-blog-pagination-all').show();
        $('.section--blog-pagination-category-preload').hide();

        if ($('.container-blog-posts-grid').length) {
            let blogSinglePost = $('.blog-post-item');
            var $blogPosts = $('.container-blog-posts-grid');

            blogSinglePost.height('auto');
            maxHeight = 0;

            blogSinglePost.each(function(index, el) {
                let SinglePostHeight  = parseInt($(this).height());
                SinglePostHeight > maxHeight ? maxHeight = SinglePostHeight : false;
            });
            blogSinglePost.height(maxHeight);

            $blogPosts.isotope({
                transitionDuration: '0.3s',
                itemSelector: '.blog-post-item',
                percentPosition: true,
                masonry: {
                    columnWidth: '.container-blog-posts-sizer'
                }
            });
        }
    });

    //category pagination remove links for custom ajax load - index.php
    $('.container-blog-pagination-category-basic *').removeAttr('href');
    $('.container-blog-pagination-category *').removeAttr('href');


    // hide gleap if not office's ip
    $(window).on('load', function() {
        $.getJSON("https://api.ipify.org?format=json", function (data) {
            if(data.ip != '78.11.41.130'){
                $('.bb-feedback-button').remove();
                $('.gleap-notification-container').remove();
            }
            else {
                $('.bb-feedback-button').attr('style', 'display: flex !important');
            }
       });
    });
    $('.container-blog-pagination-category-basic-preload .page-numbers').click(function() {
        $('.container-blog-pagination-category-basic-preload').hide();
        $(".container-blog-category-filter-header-cat").hide();
    });

    // gtm event text copied
    function getSelectionText() {
        var text = '';
        if (window.getSelection) {
            text = window.getSelection().toString();
        } else if (document.selection && document.selection.type != 'Control') {
            text = document.selection.createRange().text;
        }
        return text;
    }
    document.addEventListener('copy', function() {
        dataLayer.push({
            'event': 'textCopied',
            'clipboardText': getSelectionText(),
            'clipboardLength': getSelectionText().length
        });
    });

    // animated bars
    $('.container-animated-bar-item').click(function() {
        if (!$(this).hasClass('container-animated-bar-item-active')) {

            var activeItem = '';

            if ($(this).hasClass('container-animated-bar-item1')) {
                activeItem = 'active1';
            }
            if ($(this).hasClass('container-animated-bar-item2')) {
                activeItem = 'active2';
            }
            if ($(this).hasClass('container-animated-bar-item3')) {
                activeItem = 'active3';
            }
            if ($(this).hasClass('container-animated-bar-item4')) {
                activeItem = 'active4';
            }
            if ($(this).hasClass('container-animated-bar-item5')) {
                activeItem = 'active5';
            }

            $('.container-animated-bar-item').each(function() {
                $(this).removeClass('container-animated-bar-item-active');
                $(this).children('.animated-bar-desc').hide('fast');
            });
            $(this).addClass('container-animated-bar-item-active');
            $(this).parent('.container-animated-bar-items').removeClass('active1 active2 active3 active4 active5').addClass(activeItem);
            $this = $(this);
            setTimeout(function() {
                $this.children('.animated-bar-desc').fadeIn();
            }, 700);
        }
    });

    $('.container-animated-bar-items-tablet .container-animated-bar-item-tablet').click(function() {
        if (!$(this).hasClass('container-animated-bar-item-tablet-active')) {
            $('.container-animated-bar-item-tablet').each(function() {
                $(this).children('.animated-bar-desc').hide();
                $(this).removeClass('container-animated-bar-item-tablet-active');
            });
            $(this).addClass('container-animated-bar-item-tablet-active');
            $(this).children('.animated-bar-desc').slideDown("fast");
        } else {
            $(this).children('.animated-bar-desc').slideUp('fast');
            $this = $(this);
            setTimeout(function() {
                $this.removeClass('container-animated-bar-item-tablet-active');
            }, 300);
        }
    });

    //lazy video
    $.Lazy('av', ['audio', 'video'], function (element, response) {
        // this plugin will automatically handle '<audio>' and '<video> elements,
        // even when no 'data-loader' attribute was set on the elements
    });


    // portfolio mask
    function portfolioAppear(path, animationTime) {
        TweenLite.to("." + path + " .shape-mask svg path#path1", animationTime, {
            attr: {
                d: "m1994.07689,759.88843c-0.21772,0.20903 0.07757,0.64169 0.25948,0.85856c0.18191,0.21687 0.31613,0.30077 0.53773,0.22654c0.22159,-0.07422 -0.01175,-0.34513 0.09392,-0.76595c0.10566,-0.42082 -0.08434,-0.7681 -0.08434,-0.7681c0,0 0.13258,-0.43948 -0.237,-0.43948c-0.36958,0 -0.56979,0.12543 -0.56979,0.40242c0,0.27698 0.21771,0.27698 0,0.48601z"
            },
            ease: Power1.in,
            repeat: -1,
            yoyo: false
        }).delay(0.15);

        TweenLite.to("." + path + " .shape-mask svg path#path2", animationTime, {
            attr: {
                d: "m2.37633,836.28591c0.35254,-0.95288 0.95396,-1.37618 1.80426,-1.26992c1.27544,0.1594 0.95682,3.34938 -0.23315,4.34713c-1.18998,0.99776 -2.18602,0.69698 -2.18602,-0.03811c0,-0.73509 -0.76142,-1.19562 -0.76142,-1.76736c0,-0.38116 0.45878,-0.80508 1.37633,-1.27174z"
            },
            ease: Power1.in,
            repeat: -1,
            yoyo: false
        }).delay(0.25);

        TweenLite.to("." + path + " .shape-mask svg path#path3", animationTime, {
            attr: {
                d: "m925.88537,25.19077c1.71727,-0.37762 3.05826,-0.19462 4.02298,0.549c0.96471,0.74362 1.29002,1.35229 0.97593,1.826c-0.58528,0.47017 -1.09349,0.55853 -1.52462,0.26507c-0.6467,-0.44019 -1.80542,-0.80594 -2.67264,-0.50046c-0.86722,0.30547 -1.68702,0.08137 -1.68702,-0.75568c0,-0.55803 0.29512,-1.01934 0.88537,-1.38393z"
            },
            ease: Power1.in,
            repeat: -1,
            yoyo: false
        });

        TweenLite.to("." + path + " .shape-mask svg path#path4", animationTime, {
            attr: {
                d: "m76.66159,13.50671c0.50324,-0.21126 0.50324,-0.50671 -0.39782,-0.50671c-0.90106,0 -2.57467,0.93507 -3.15341,2.34549c-0.57873,1.41042 1.25718,0.13064 2.29098,-0.05694c1.0338,-0.18759 0.75701,-1.57057 1.26025,-1.78184z"
            },
            ease: Power1.in,
            repeat: -1,
            yoyo: false
        }).delay(0.4);

        TweenLite.to("." + path + " .shape-mask svg path#path5", animationTime, {
            attr: {
                d: "m1929.89816,1453.22045c0.17121,-1.30572 0.13297,-1.11162 -0.16368,-1.11162c-0.29665,0 -1.06234,-0.3331 -1.13659,0.16621c-0.07425,0.49931 -1.05466,1.23475 -0.33606,1.39667c0.7186,0.16191 1.46512,0.85446 1.63633,-0.45126z"
            },
            ease: Power1.in,
            repeat: -1,
            yoyo: false
        });

        TweenLite.to("." + path + " .shape-mask svg path#path6", animationTime, {
            attr: {
                d: "m999,1500.15134c0,-0.37547 -0.21944,-0.40773 -1.08052,-0.40773c-0.86107,0 -1.21757,-1.67312 -1.77063,0c-0.55305,1.67311 0.54536,1.92822 1.48488,2.22287c0.93952,0.29464 1.36627,-1.43966 1.36627,-1.81514z"
            },
            ease: Power1.in,
            repeat: -1,
            yoyo: false
        }).delay(0.2);

        TweenLite.to("." + path + " .shape-mask svg path#path7", animationTime, {
            attr: {
                d: "m80.98071,1493.23376c0.21478,-2.01428 -1.42433,-1.21323 -1.89973,-1.87622c-0.47539,-0.66299 -0.98424,-3.37055 -1.51489,-1.95224c-0.53066,1.41832 -0.8886,1.6536 -0.13503,2.4991c0.75357,0.8455 3.33486,3.34364 3.54965,1.32936z"
            },
            ease: Power1.in,
            repeat: -1,
            yoyo: false
        });

        TweenLite.to("." + path + " .shape-mask svg path#path8", animationTime, {
            attr: {
                d: "m862.9519,562.85683c0.36914,-2.4236 -1.48532,-1.54976 -2.18969,-1.81211c-0.70436,-0.26234 -2.35164,0.68516 -2.72121,1.3908c-0.36956,0.70564 1.85772,0.13697 2.72121,0.42131c0.8635,0.28433 1.82055,2.4236 2.18969,0z"
            },
            ease: Power1.in,
            repeat: -1,
            yoyo: false
        });

        TweenLite.to("." + path + " .shape-mask svg path#path9", animationTime, {
            attr: {
                d: "m1920.96083,15.22627c0.15361,-1.88437 -0.15485,-3.22627 -0.74575,-3.22627c-0.59091,0 -0.75181,0.05701 -1.13134,1.38385c-0.37952,1.32684 0.6172,1.13893 1.26193,1.3726c0.64473,0.23367 0.46155,2.35418 0.61516,0.46982z"
            },
            ease: Power1.in,
            repeat: -1,
            yoyo: false
        });

    }

    function appearPortfolioAnimation() {
        $('.dportfolio-item').each(function() {
            if ($(window).scrollTop() < $(this).offset().top && $(window).scrollTop() + $(window).height() > $(this).offset().top) {
                portfolioAppear($(this).attr('class').split(' ')[1].toString(), 2);
                $(this).children('.shape-mask').delay(1000).hide(50);
            }
        });
    }

    if ($('.container-design-portfolio').length) {

        $(document).on('ready scroll', appearPortfolioAnimation);
        appearPortfolioAnimation();
    }
});

//passive listeners
jQuery.event.special.touchstart = {
    setup: function( _, ns, handle ) {
        this.addEventListener("touchstart", handle, { passive: !ns.includes("noPreventDefault") });
    }
};
jQuery.event.special.touchmove = {
    setup: function( _, ns, handle ) {
        this.addEventListener("touchmove", handle, { passive: !ns.includes("noPreventDefault") });
    }
};
jQuery.event.special.wheel = {
    setup: function( _, ns, handle ){
        this.addEventListener("wheel", handle, { passive: true });
    }
};
jQuery.event.special.mousewheel = {
    setup: function( _, ns, handle ){
        this.addEventListener("mousewheel", handle, { passive: true });
    }
};
