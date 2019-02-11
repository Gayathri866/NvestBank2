var mainApp = angular.module("RatingAndReview", []).controller("ratingReview", function ($scope, $timeout, $compile, $window) {

    //$scope.readAllReviews = "Read all reviews";
    $scope.viewRatings = "View ratings and reviews";
    $scope.rnrTitle = "Ratings and Reviews";
    $scope.rnrSubTitle = "Ratings and Reviews for";
    $scope.prodcutIdList = [];
    $scope.bazzarIdList = [];
    $scope.internalLinkList = [];
    $scope.url = '';
	$scope.isDefaultAvailable = false;
    var bazzarIdListLength = 0;


    if (location.pathname.indexOf("https://www.td.com/fr/") > -1) {
        // $scope.readAllReviews = "Lire toutes les revues";
        $scope.viewRatings = "Lire toutes les revues";
        $scope.rnrTitle = "Notes et &#233;valuations";
        $scope.rnrSubTitle = "Notes et &#233;valuations de la carte";
    }
    $scope.reviewIni = false;
    $scope.inRatingList = "";
    $scope.mobile = false;
    $scope.trackcustomer = false;
    // URL Parameter value
    $scope.getURLParam = function () {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == 'ssreview' && sParameterName[1] == 'true') {
                return (true);
            }
        }
        return (false);
    };
    // Check mobile
    $scope.ifMobile = function () {
        if ($scope.mobile) return (true);

        var htmlclass = ($("html")).attr("class");
        if (htmlclass != null && (htmlclass.indexOf("ui-mobile") > -1)) {
            $scope.mobile = true;
            return (true);
        } else {
            return (false);
        }
    };


    $scope.getProdIdByCCID = function (ccid) {
        var prodId = "";
        angular.forEach($scope.bazzarIdList, function (ind, obj) {
            if (ccid == obj) {
                prodId = obj;
                return (false);
            }
        });
        return (prodId);
    };
    $scope.verifyProdId = function (obj) {
        var prodId = "";
        var attvalue = ($(obj)).attr("data-button-id");
        angular.forEach($scope.bazzarIdList, function (ind, obj) {
            if (attvalue == obj) {
                prodId = obj;
                return (false);
            }
        });
        return (prodId);
    };

    // Check Landing page
    $scope.isCCLandingPage = function () {
        if (($('[id^=CCRatesReviews-]')).length == 0) {
            return (true);
        } else {
            return (false);
        }
    };

    // Scroll into RnR View
    $scope.scrollInto = function () {
        $('html, body').animate({ scrollTop: $(".td-expand-collapse-content").position().top }, 'slow');
    };


    // add inline ratings tags 
    $scope.addInlineRatingsTags = function () {
        // Update inline rating tags
        // Check data-button-id attribute for apply button
        bazzarIdListLength = $scope.prodcutIdList.length;
        $scope.bazzarIdList = $scope.prodcutIdList;
        angular.forEach(($('a[data-button-id!=""]')), function (obj, ind) {

            var prodid = $scope.verifyProdId(obj);


            if (prodid != "" && !($("#CCInlineRating-" + prodid)).length) {
                ($(obj)).parent().parent().parent().css({ "height": "100%" });

                if (!$scope.ifMobile()) {
                    ($(obj)).parent().parent().append("<div id='CCInlineRating-" + prodid + "'/>");
                } else if (!$scope.isCCLandingPage()) {
                    ($("<div id='CCInlineRating-" + prodid + "'/>")).insertBefore(($(obj)));
                } else {
                    var imgElem = ($(($(obj)))).find("img");
                    if (($(imgElem)).length) {
                        ($("<div id='CCInlineRating-" + prodid + "'/>")).insertAfter(($(imgElem)));
                    } else {
                        ($("<div id='CCInlineRating-" + prodid + "'/>")).insertAfter(($(obj)));
                    }
                }
            }
        });

        // Check href attribute for apply button for card query parameter



        // Add inline rating tags
        angular.forEach($scope.bazzarIdList, function (obj, ind) {
            if (($("#CCInlineRating-" + obj)).length && !($("#BVRRInlineRating-" + obj)).length) {

                var pagepath = ($("#CCInlineRating-" + obj)).parent().attr("href");
                if (typeof pagepath == 'undefined') {
                    pagepath = ($("#CCInlineRating-" + obj)).parent().find("a:first-child").attr("href");
                    if (typeof pagepath == 'undefined') {
                        pagepath = location.pathname;
                    }
                }

                if (!$scope.ifMobile()) {
                    ($("#CCInlineRating-" + obj)).addClass("td-bv-align-centre");
                    if ($scope.isCCLandingPage()) {
                        ($("#CCInlineRating-" + obj)).css({ "position": "relative", "top": "-10px" });
                    } else {
                        ($("#CCInlineRating-" + obj)).css({ "position": "relative", "top": "5px" });
                    }

                } else {
                    if ($scope.isCCLandingPage()) {
                        ($("#CCInlineRating-" + obj)).addClass("td-bv-align-centre");

                        if (($("#CCInlineRating-" + obj)).prev("img").length) {
                            ($("#CCInlineRating-" + obj)).css({ "position": "relative", "top": "-5px" });
                        } else {
                            ($("#CCInlineRating-" + obj)).css({ "position": "relative", "top": "5px" });
                        }
                    } else {
                        ($("#CCInlineRating-" + obj)).addClass("td-bv-align-centre");
                        ($("#CCInlineRating-" + obj)).css({ "position": "relative", "top": "-10px" });
                    }
                }


                if ($scope.ifMobile()) {
                    ($("#CCInlineRating-" + obj)).append("<div class=\"td-layout-fluidrow td-margin-top-small td-margin-bottom-small\" style=\"width:100%\" id=\"BVRRInlineRating-" + obj + "\" ></div>");
                } else {
                    ($("#CCInlineRating-" + obj)).append("<div class=\"td-layout-column td-layout-grid3\" style=\"width:100%\" id=\"BVRRInlineRating-" + obj + "\" ></div>");
                }

                if ($scope.ifMobile()) {
                    //($("#CCInlineRating-" + obj)).append("<a class=\"td-link-standalone td-link-standalone-primary td-button-compact\" style=\"position:relative;top:-5px;\" onClick=\"abc()\">" + $scope.readAllReviews + "</a>");
                } else if ($scope.isCCLandingPage()) {
                    //($("#CCInlineRating-" + obj)).append("<p align=\"left\"><a class=\"td-link-standalone td-link-standalone-primary td-button-compact\" onClick=\"abc()\">" + $scope.readAllReviews + "</a></p>");
                } else {
                    // ($("#CCInlineRating-" + obj)).append("<p align=\"left\"><a class=\"td-link-standalone td-link-standalone-primary td-button-compact\" onClick=\"abc()\">" + $scope.viewRatings + "</a></p>");
                }


                if ($scope.inRatingList != "")
                    $scope.inRatingList += ",";

                $scope.inRatingList += "'" + obj + "'";
            }

        });


        // Initialize Inline Ratings
        if ($scope.inRatingList != "") {
            $scope.showInlineRatings($scope.inRatingList);
        }
    };
    // Document is ready 
    $timeout(function () {
        if ($scope.isCCLandingPage()) {
            $timeout($scope.addInlineRatingsTags, 1500);
        } else {
            $scope.addInlineRatingsTags();
        }
    });

    // Show BV Inline Ratings
    $scope.showInlineRatings = function (value) {
        eval("$BV.ui( 'rr', 'inline_ratings', {productIds : [" + value + "], containerPrefix : 'BVRRInlineRating' });");
        angular.forEach($scope.bazzarIdList, function (obj, ind) {
            angular.element(document.querySelector('#CCInlineRating-' + obj)).css('display', "none");
            $timeout(function () {
                angular.forEach($scope.internalLinkList, function (obj1, ind1) {
                    if ($scope.internalLinkList[ind1].indexOf(obj) > -1) {
                        $scope.url = obj1;
                    }
                });
                var values = $scope.url.split("**");
                $scope.internalLink = values[1];
                if (document.querySelector('#CCInlineRating-' + obj + ' .bv-rating') != null && document.querySelector('#CCInlineRating-' + obj + ' .bv-rating-ratio-count') != null
				&& document.querySelector('#CCInlineRating-' + obj + ' .bv-rating-stars-on') != null && document.querySelector('#CCInlineRating-' + obj + ' .bv-off-screen') != null) {
                    var avgRatings = angular.element(document.querySelector('#CCInlineRating-' + obj + ' .bv-rating'))[0].textContent;
                    var tot_Reviews = angular.element(document.querySelector('#CCInlineRating-' + obj + ' .bv-rating-ratio-count'))[0].textContent.match(/\d+/);
                    var star_On = angular.element(document.querySelector('#CCInlineRating-' + obj + ' .bv-rating-stars-on')).context.attributes.style.nodeValue.toString().split(" ")[0];
                    var forScreenReader = angular.element(document.querySelector('#CCInlineRating-' + obj + ' .bv-off-screen'))[0].innerHTML;

                    if ($scope.internalLink == undefined) {
                        angular.element(document.querySelector('#CCCardRating-' + obj)).append("<div class=\"td-star-ratings\"> <div class=\"td-stars\" aria-hidden=\"true\"> <div class=\"td-stars off\"> <span class=\"td-icon\"></span> <span class=\"td-icon \"></span> <span class=\"td-icon \"></span> <span class=\"td-icon \"></span> <span class=\"td-icon \"></span> </div> <div class=\"td-stars-clip\" style=" + star_On + "> <div class=\"td-stars on\" style=\"\"> <span class=\"td-icon \"></span> <span class=\"td-icon \"></span> <span class=\"td-icon \"></span> <span class=\"td-icon \"></span> <span class=\"td-icon \"></span> </div> </div> </div> <span class=\"td-forscreenreader\">" + forScreenReader + "</span> <span class=\"td-static-number\">" + avgRatings + "</span> <span class=\"td-comments\"><a href=\"#\">" + tot_Reviews + "<span class=\"td-forscreenreader\">reviews</span></a></span> </div>");
                    } else {
                        angular.element(document.querySelector('#CCCardRating-' + obj)).append("<div id=\"starsLoaded\" class=\"td-star-ratings\"> <div class=\"td-stars\" aria-hidden=\"true\"> <div class=\"td-stars off\"> <span class=\"td-icon\"></span> <span class=\"td-icon \"></span> <span class=\"td-icon \"></span> <span class=\"td-icon \"></span> <span class=\"td-icon \"></span> </div> <div class=\"td-stars-clip\" style=" + star_On + "> <div class=\"td-stars on\" style=\"\"> <span class=\"td-icon \"></span> <span class=\"td-icon \"></span> <span class=\"td-icon \"></span> <span class=\"td-icon \"></span> <span class=\"td-icon \"></span> </div> </div> </div> <span class=\"td-forscreenreader\">" + forScreenReader + "</span> <span class=\"td-static-number\">" + avgRatings + "</span> <span class=\"td-comments\"><a href=\"" + $scope.internalLink + "?ssreview=true" + "\">" + tot_Reviews + "<span class=\"td-forscreenreader\">reviews</span></a></span> </div>");
                    }
                }
					
				$('#defaultContainer'+obj).css('display', 'none');
            }, 2550);
        });
    };

    $timeout(function () {
        var myEl = angular.element(document.querySelector('.td-comments'));
        myEl.attr('ng-click', "myreviewrating()");
        $compile(myEl)($scope);
    }, 3000);

    $scope.bannerProduct = function (bazzarId) {
        $scope.internalLink = '#';
        $scope.productId = bazzarId;
        $scope.prodcutIdList.push($scope.productId);
        if (($("#CCRatesReviews-" + $scope.productId)).length) {
            $scope.addCCReview($scope.productId);
            $scope.productIdForReview = $scope.productId;
            if ($scope.getURLParam() == true) {
                $(window).load(function () {
                    $scope.myreviewrating();
                    $scope.scrollInto();

                });
            }
        }
    };

    $scope.productCatalogue = function (url, bazzarId) {
        $scope.internalLinkList.push(bazzarId + '**' + url);
        $scope.productId = bazzarId;
        $scope.prodcutIdList.push(bazzarId);
        if ($scope.bazzarIdList.length > 0 && $scope.prodcutIdList.length != bazzarIdListLength) {
            $scope.prodcutIdList = [];
            $scope.bazzarIdList = [];
            $scope.prodcutIdList.push(bazzarId);
            $timeout($scope.addInlineRatingsTags, 1500);
        }
    };

    // Add Ratings and Reviews Form
    $scope.addCCReview = function (prId) {


        if (($("#CCRatesReviews-" + prId)).length) {
            var cc_raterevie = "toggleReviews";
            var myEl = angular.element(document.querySelector('#' + cc_raterevie));
            myEl.attr('ng-click', "myreviewrating('toggleReviews')");
            $compile(myEl)($scope);
            ($("#CCRatesReviews-" + prId)).append("<div class=\" td-layout-row td-detailsRnR\"><div id=\"ccrrelement\" class=\"td-layout-column td-layout-column-first td-layout-column-last\"></div></div>");

            if (!$scope.ifMobile()) {
                ($("#ccrrelement")).addClass("td-layout-grid10");
            }

            if (($("#BVRRContainer")).length) {
                ($("#ccrrelement")).append(($("#BVRRContainer")));
            } else {
                ($("#ccrrelement")).append("<div id=\"BVRRContainer\"></div>");
            }
        }
    };
    // Initialize Rating and Review Form

    $scope.truckCustom_Conditional = function (param, prId) {
        if ($scope.trackcustomer) {
            if (($("#CCRatesReviews-toggle-" + prId)).html().indexOf("Expand") > -1) {
                eval("trackCustomLink('tdct:p:rnr:" + param + "','Link','onClick');");
            }
        }
        $scope.trackcustomer = false;
    };

    $scope.showCCReview = function (productId) {
        if (($("#CCRatesReviews-" + productId)).length && !($("#BVRRContainer > div").length)) {
            eval("$BV.ui( 'rr', 'show_reviews', {  productId: '" + productId + "' });");
        }
    };

    $scope.myreviewrating = function (inputData) {

        $scope.showCCReview($scope.productIdForReview);
        if (inputData != 'toggleReviews') {
            if ($("#expIcon").hasClass("td-triggericon-expanded")) {
                $('#expIcon').removeClass('td-triggericon-expanded')
            } else {
                $('#expIcon').addClass('td-triggericon-expanded')
            }
            $('.rrBazaarVoice').toggle();
            $scope.scrollInto();
        }
    };


});
// BV ROI-omniture tags
$BV.configure('global', {
    events: {
        bvRender: function (data) {

            //omniture code to execute
            //trackConversions("tdct:m:bv", "ToolInteract", false, "render", "", "");
            s.t(); s.eVar21 = s.Var22 = s.eVar23 = s.events = '';
        }
    }
});

$BV.configure('global', {
    events: {
        submissionLoad: function (data) {

            //omniture code to execute
            //trackConversions("tdct:m:bv", "ToolInteract", false, "open " + data.contentType, "", "");
            s.t(); s.eVar21 = s.Var22 = s.eVar23 = s.events = '';
        }
    }
});

$BV.configure('global', {
    events: {
        submissionClose: function (data) {

            //omniture code to execute
            //trackConversions("tdct:m:bv", "ToolInteract", false, "abandon " + data.contentType, "", "");
            s.t(); s.eVar21 = s.Var22 = s.eVar23 = s.events = '';
        }
    }
});

$BV.configure('global', {
    events: {
        submissionSubmitted: function (data) {

            //omniture code to execute
            //trackConversions("tdct:m:bv", "ToolInteract", false, "submit " + data.contentType, data.Id, "");
            s.t(); s.eVar21 = s.Var22 = s.eVar23 = s.events = '';
        }
    }
});