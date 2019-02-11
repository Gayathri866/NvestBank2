/*!tdct-pod-ts 2018-08-27 17:11:39 */

(function () { 'use strict'; angular.module('tdctRedesign', ['tdct', 'ngCookies','ngAria'],function config($ariaProvider) {
    $ariaProvider.config({
            ariaHidden:false
        });
    });
})();
(function () {
    'use strict';
    /**
     * TDCT Redesign Controller Start
    */
    angular.module('tdctRedesign').controller('tdctRedesignController', tdctRedesignController).controller('filterToolController', filterToolController);
    tdctRedesignController.$inject = ['$scope', '$rootScope', '$http', '$cookies', '$timeout', '$compile', '$window', '$location', 'factoryFilterTool', 'filtertoolLoad', 'apiFactory'];

    function tdctRedesignController($scope, $rootScope, $http, $cookies, $timeout, $compile, $window, $location, factoryFilterTool, filtertoolLoad, apiFactory) {
        var vm = this;

        /* Functions */
        vm.init = init;
        vm.cardClassification = cardClassification;
        vm.cardSelected = cardSelected;        
        vm.appendCookie = appendCookie;
        vm.checkRecent = checkRecent;
        vm.removeSelectedProduct = removeSelectedProduct;
        vm.isRatingReady = isRatingReady;
        vm.setCard = setCard;
        vm.closeButton =closeButton;

        /* constants */
        vm.lang = "en";
        vm.classifications={'classifications':[]}; 
        vm.productId="";
        vm.classification = {};
        vm.selectionCriteria = '';
        vm.catalogueLength = '';
        vm.userInit = null;
        vm.getSelectedData = {};
        vm.cardJson = {};
        vm.catalogueLength = 0;
        vm.error = '';
        vm.compareCookies = '';
        vm.selectedCardIds = [];
        vm.selectedCardList = [];
        vm.matchedProducts = [];
        vm.isThreeCardsAvailable = false;
        vm.login = false;
        vm.logout = false;
        vm.mobile = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
        vm.provinceData={};
        vm.provincePlaceholder="";
        vm.province="";
        vm.provinceList = [];//($cookies.get('province_list')!=null)? JSON.parse($cookies.get('province_list')):[];
        vm.provinceListRight=[];
        vm.provinceListLeft=[];
        vm.radioProvinceMid = 0;
        vm.anonymousUserInCa = false;
        vm.identifiedUserChangeLoc = false;
        vm.identifiedUserOutCa = false;
        vm.authUserNoChangeLoc = false;
        vm.authUserChangeLoc = false;
        vm.authUserOutCa = false;
        var currentURL= window.location.href;
        currentURL = (currentURL.charAt(currentURL.length-1)=='https://www.td.com/')?currentURL.slice(0,-1):currentURL;

        $('#compareTableHeadDefault3').addClass("td-hide-cell");
        $('.compareTableTdDefault3').addClass("td-hide-cell");
        $('#compareTableToggleDefault3').addClass("td-hide-cell");
        $('#compareTableToggleDefaultMobile3').addClass("td-hide-cell");

        init();

        function init() {
            //Set language Constant
            if (window.conTextPathVal != undefined || window.conTextPathVal != "") {
                vm.lang = window.conTextPathVal.split('https://www.td.com/')[2];
            }

            //Login
            var xhttp = new XMLHttpRequest($cookies);
            var isCookie = $cookies.get("infositeCookie");
            var tempInfositeUrl = infositeUrl + "?x=" + $.now();
            if(isCookie == null){
                if (window.env.toLowerCase() != "stg") { //Required to avoid calling in staging website
                    xhttp.onreadystatechange = function () {
                        if (this.readyState == 4) {
                            vm.login=true;
                            vm.logout=false;
                            $scope.$digest();
                            if(this.status==200)
                            {
                                var tempResponse = this.responseText.trim();
                                var cookieArr=[];
                                cookieArr=JSON.parse(tempResponse);
                                angular.forEach(cookieArr, function(value, key) {
                                        if(key=="infositeCookie"||key=="omSessionID"){
                                            document.cookie = key+"="+value+ ";domain=.td.com;path=/;";
                                        }
                                });
                                if($cookies.get('infositeCookie')!=null){
                                        vm.login=false;
                                        vm.logout=true;
                                        $scope.$digest();
                                        OmniOnloadTrigger();
                                }
                            }
                        }
                    };
                    xhttp
                        .open(
                            "GET/index.html",
                            tempInfositeUrl,
                            true);
                    xhttp.withCredentials = true;
                    xhttp.send();
                } else{
                    vm.login=true;
                    vm.logout=false;
                }
            } else{
                vm.login=false;
                vm.logout=true;
                OmniOnloadTrigger();
            }
        }
        /**
         * Region selector
         * 
         */
        checkProvince();

        function checkProvince(){
            if($('.td_rq_region-selector').length){
                vm.provinceList= province_list.category.keywords;
                var provinceCookie = $cookies.get('ca_user_loc');
                var savedRegionData = [];
                if(provinceCookie!=null){
                    var userType =  $cookies.get('user_type');
                    var savedRegionData = JSON.parse("{\""+provinceCookie.split("|").join("\",\"").split("=").join("\":\"")+"\"}");
                    vm.province =savedRegionData.province.toUpperCase();
                    for(var i=0;i<vm.provinceList.length;i++){ 
                        if(vm.provinceList[i].key == vm.province){
                            vm.provincePlaceholder = vm.provinceList[i].title;
                            break;
                        }
                    }
                    if(typeof  $(".td_rq_region-selector").tdRegionSelector !== "undefined")
                        $(".td_rq_region-selector").tdRegionSelector({province: vm.province});
                    switch(userType){
                        case "PROVINCE_CHANGE_IN_CA": vm.identifiedUserChangeLoc = true; break;
                        case "IDENTIFIED_OUT_CA": vm.identifiedUserOutCa = true; break;
                        case "AUTH_NO_PROVINCE_CHANGE": vm.authUserNoChangeLoc = true;break;
                        case "AUTH_PROVINCE_CHANGE": vm.authUserChangeLoc=true; break;
                        case "AUTH_OUT_CA": vm.authUserOutCa=true; break;
                        default: vm.anonymousUserInCa = true;
                    }
                } else {
                    var  delay = (window.innerWidth < 768 )?1500:500;
                    setTimeout(function(){
                        $('#anonymousUserOutCA').tdModal({'show':true});
                        $("#anonymousUserOutCA .close-button").addClass('hide');
                    }, delay);
                }
            }
        }

        function closeButton(){
            var city = 'na';
            var country = 'ca';
            var province = '';
            var provinceCookie = $cookies.get('ca_user_loc')
            if( provinceCookie !=null){
                var savedRegionData = JSON.parse("{\""+ provinceCookie.split("|").join("\",\"").split("=").join("\":\"")+"\"}");
                city = savedRegionData.city;
                country = savedRegionData.country;
                province = savedRegionData.province;
            }
            if(province!= vm.province.toLowerCase()){
                sessionStorage.setItem("isProvinceManualChange","true");
                $cookies.put('user_type','NO_PROVINCE_CHANGE_IN_CA', {'path':conTextPathVal,'domain':'.td.com'});
                var d = new Date();
                d.setTime(d.getTime() + (7*365*24*60*60*1000));
                var expires = "expires="+ d.toUTCString();
                var cookieData = "province="+vm.province.toLowerCase()+"|city="+city+"|country="+country;
                //$cookies.put('ca_user_loc', cookieData, {'path':conTextPathVal,'expires':  d.toUTCString()});
                $cookies.put('ca_user_loc', cookieData, {'path':conTextPathVal,'expires':  d.toUTCString(),'domain':'.td.com'}); 
                if($('#anonymousUserOutCA').length){
                    currentURL= (vm.province.toLowerCase() == 'qc')?getQueryParameterByName('source',currentURL)+'/quebec':getQueryParameterByName('source',currentURL);
                    window.location.replace(currentURL);
                }
                vm.identifiedUserChangeLoc = false;
                vm.identifiedUserOutCa = false;
                vm.authUserNoChangeLoc = false;
                vm.authUserChangeLoc = false;
                vm.authUserOutCa = false;
                vm.anonymousUserInCa = true;
                $('.td-indicator-recently-viewed').removeClass('show');
                $cookies.put('RecentItems','', {'path':conTextPathVal,'expires':'Thu, 01 Jan 1970 00:00:00 UTC'});
                removeCompareProductCookie();
                if(currentURL.indexOf('/quebec')==-1&&(vm.province.toLowerCase()=='qc'||vm.province.toLowerCase()=='pq')){
                    window.location.replace(currentURL+'/quebec');
                }else if(currentURL.indexOf('/quebec')!=-1&&vm.province.toLowerCase()!='qc'&&vm.province.toLowerCase() !='pq'){
                    window.location.replace(currentURL.replace('/quebec',''));
                }else if ($('.td_rq_compare-sticky-drawer').length){
                    if ($('.anchor_emptyslot').length<3)
                        window.location.reload();
                }
            }
        }
        
        function getQueryParameterByName(name, url) {
            if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        }

        function removeCompareProductCookie(){
            var decodedCookie = unescape(document.cookie);
            var ca = decodedCookie.split(';');
            for(var i=0;i<ca.length;i++){
                if((ca[i].indexOf("_ba=")!=-1)||(ca[i].indexOf("prod_ids_")!=-1)||(ca[i].indexOf("_id=")!=-1)||(ca[i].indexOf("_cc=")!=-1)||(ca[i].indexOf("_name=")!=-1)||(ca[i].indexOf("_img=")!=-1)||(ca[i].indexOf("_type=")!=-1)||(ca[i].indexOf("_offer=")!=-1)||(ca[i].indexOf("_url=")!=-1)){
                    var cdata = ca[i].split('=');
                    $cookies.put(cdata[0].trim(),'', {'path':conTextPathVal,'expires':'Thu, 01 Jan 1970 00:00:00 UTC'});
                }
            }
        }

        /**
         * Recently viewed indicator
         * 
         */

	    function setCard(cardId,cardType){
            if(maxRecentlyViewed>0){
                var cookieValue=appendCookie(cardId,cardType);
                if(cookieValue!=null){
                    var d = new Date();
                    d.setTime(d.getTime() + (365*24*60*60*1000));
                    var expires = "expires="+ d.toUTCString();
                    document.cookie = "RecentItems="+ cookieValue+ ";path="+conTextPathVal+";expires="+expires;
                }
            }
        }
		
        function appendCookie(cardId, cardType) {
            var cookieValue = $cookies.get('RecentItems');
            if (cookieValue != null) {
                var items = getCardTypeElements(cookieValue, cardType);
                if (items != null) {
                    var cardArr = getItemArrayList(items);
                    if (!isCardExist(cardArr, cardId)) {
                        var updatedItems = '';
                        if(cardArr.length<maxRecentlyViewed+1) {
                            for (var i = 0; i < cardArr.length; i++) {
                                updatedItems = updatedItems + cardArr[i] + '|';
                            }
                            updatedItems = updatedItems + cardId + '|';
                        }
                        else if(cardArr.length==maxRecentlyViewed+1) {
                            for (var i=1;i<cardArr.length-1;i++)
                                cardArr[i]=cardArr[i+1];
                            cardArr[cardArr.length-1]=cardId;
                            for (var i = 0; i < cardArr.length; i++) {
                                updatedItems = updatedItems + cardArr[i] + '|';
                            }
                        }
                        cookieValue = cookieValue.replace(items, updatedItems);
                    }
                } else {
                    cookieValue = cookieValue + cardType + '|' + cardId + '|||';
                }
            } else {
                cookieValue = cardType + '|' + cardId + '|||';
            }
            return cookieValue;
        }

        function checkRecent(elementId, cardId, cardType) {
            var cookieValue = $cookies.get('RecentItems');
            if (cookieValue != null) {
                var items = getCardTypeElements(cookieValue, cardType);
                if (items != null) {
                    var cardArr = getItemArrayList(items);
                    if (isCardExist(cardArr, cardId)) {
                        var  pos='left';
                        $("#" + elementId).find(".td-indicator-recently-viewed").addClass(pos).addClass("show");
                        $(".td-catalogue-card").tdCatalogueCard({'re_render':true});
                    }
                }
            }
            if(!$('.td-filter-tool').length){
                if($(".td_rq_product_grid").length){
                    $(".td_rq_product_grid .td-row").animate({opacity:1}); 
                }
                if($(".td-product-service-illustration-grid").length){
                    $(".td-product-service-illustration-grid .td-row").animate({opacity:1});
                }
            }
        }

        function getCardTypeElements(cookieValue, cardType) {
            if (cookieValue.indexOf(cardType) != -1) {
                var startIndex = cookieValue.indexOf(cardType);
                var endIndex = cookieValue.indexOf('|||', startIndex);
                var items = cookieValue.substring(startIndex, endIndex) + '|';
                return items;
            }
            return null;
        }

        function getItemArrayList(items) {
            var cardArr = [];
            while (items != '') {
                cardArr.push(items.substring(0, items.indexOf('|')));
                items = items.replace(items.substring(0, items.indexOf('|') + 1), '');
            }
            return cardArr;
        }

        function isCardExist(cardArr, cardId) {
            for (var i = 0; i < cardArr.length; i++) {
                if (cardArr[i] == cardId)
                    return true;
            }
            return false;
        }

        function cardClassification(classification,id) {
            vm.classification = classification;
            vm.classifications.classifications.push({"id":id,"classification":classification}); 
        }

        $rootScope.$on("sendDataParentCtrl", function (event,id) {
            if($(".td_rq_product_grid").length){
                $(".td_rq_product_grid .td-row").css('opacity', 0);
            }
            if($(".td-product-service-illustration-grid").length){
                $(".td-product-service-illustration-grid .td-row").css('opacity', 0);
            }
            vm.getSelectedData = factoryFilterTool.getFilterData();
            vm.keyCombination = '';
            vm.indexList = [];
            vm.productId=(id=="")?"1":id;
            if(vm.classifications.classifications.length>1){
                for (var i = 0; i < vm.classifications.classifications.length; i++){
                    if (vm.classifications.classifications[i].id == vm.productId){
                        vm.classification = vm.classifications.classifications[i].classification;
                        break;
                     }
                }
            }

            var obj = eval('(' + vm.classification + ')');
            var parsedString = JSON.stringify(obj);
            vm.cardJson = JSON.parse(parsedString);
            vm.catalogueLength = Object.keys(vm.cardJson).length;
            vm.selectedDataLength = vm.getSelectedData.length;

            for (var j = 0; j < vm.getSelectedData.length; j++) {
                if (j == 0) {
                    vm.keyCombination = vm.keyCombination + vm.getSelectedData[j];
                } else if (j > 0 && j <= vm.getSelectedData.length - 1) {
                    vm.keyCombination = vm.keyCombination + '-' + vm.getSelectedData[j];
                }
            }
            for (var i = 0; i < vm.catalogueLength; i++) {
                for (var k = 0; k < Object.keys(vm.cardJson[i]).length; k++) {
                    for (var l = 0; l < Object.keys(vm.cardJson[i][k]).length; l++) {
                        if (l == 0) {
                            vm.selectionCriteria = vm.selectionCriteria + vm.cardJson[i][k][l];

                        } else if (l > 0 && l <= Object.keys(vm.cardJson[i][k]).length - 1) {
                            vm.selectionCriteria = vm.selectionCriteria + '-' + vm.cardJson[i][k][l];
                        }
                    }
                    if (vm.keyCombination == vm.selectionCriteria) {
                        vm.indexList.push(i);
                        vm.selectionCriteria = '';
                        break;
                    }
                    vm.selectionCriteria = '';
                }
            }
            
            var itemCount = 0;
            for (var r = 0; r < vm.catalogueLength; r++) {
                if (vm.indexList.indexOf(r) < 0) {
                    ($("#catalogue"+vm.productId.toString()+"_product" + r)).addClass("hide");
                } else {
                    ($("#catalogue"+vm.productId.toString()+"_product"  + r)).removeClass("hide");
                    itemCount++;
                }
            }

            if(itemCount>0){
                if($(".td_rq_product_grid").length){
                    $(".td-catalogue-card").tdCatalogueCard({'re_render':true});
                    $(".td_rq_product_grid").tdProductGrid();
                    $(".td_rq_product_grid .td-row").animate({opacity:1}); 
                }
                if($(".td-product-service-illustration-grid").length){
                    $(".td-product-service-illustration-grid").tdProductServiceIllustrationGrid({'re_render':true});
                    $(".td-product-service-illustration-grid .td-row").animate({opacity:1});
                }
            }
        });

        function cardSelected(selectedCompareCardId, keyType, featureLength) {
            if (keyType == 'creditCard') {
                if ($window.conTextPathVal.indexOf('en') > -1) {
                    vm.compareCookies = $cookies.get('prod_ids_cc_en');
                    vm.selectedCardIds = vm.compareCookies.split("%2C");
                } else {
                    vm.compareCookies = $cookies.get('prod_ids_cc_fr');
                    vm.selectedCardIds = vm.compareCookies.split("%2C");
                }
            } else if (keyType == 'accounts') {
                if ($window.conTextPathVal.indexOf('en') > -1) {
                    vm.compareCookies = $cookies.get('prod_ids_ba_en');
                    vm.selectedCardIds = vm.compareCookies.split("%2C");
                } else {
                    vm.compareCookies = $cookies.get('prod_ids_ba_fr');
                    vm.selectedCardIds = vm.compareCookies.split("%2C");
                }
            }

            vm.totalCrad = selectedCompareCardId.split(",");

            for (var i = 0; i < vm.totalCrad.length; i++) {
                for (var j = 0; j < vm.selectedCardIds.length; j++) {
                    vm.selectedCardIds[j] = vm.selectedCardIds[j].replace('en_cc_', '').replace('fr_cc_', '').replace('en_ba_', '').replace('fr_ba_', '');
                    if (vm.totalCrad[i] == vm.selectedCardIds[j]) {
                        vm.selectedCardList.push(i);
                    }
                }
            }

            for (var i = 0; i < vm.selectedCardIds.length; i++) {
                for (var j = 0; j < vm.totalCrad.length; j++) {
                    if (vm.selectedCardIds[i] == vm.totalCrad[j]) {
                        vm.matchedProducts.push(j);
                        $compile($('#compareTableHeadDefault' + i).html($('#compareTableHead' + j).html()))($scope);
                        for (var k = 0; k < featureLength; k++) {
                            $compile($('#compareTableBodyDefault' + k + i).html($('#compareTableTd' + k + j).html()))($scope);
                        }
                        $compile($('#compareTableToggleDefault' + i).html($("#stickyDrawer" + j).html()))($scope);
                        $compile($('#compareTableToggleDefaultMobile' + i).html($('#stickyDrawerMobile' + j).html()))($scope);
                        isRatingReady();
                    }
                }
            }
            for (var border = 0; border < vm.selectedCardList.length; border++) {
                if (border == 2) {
                    $("#compareTableHead" + vm.selectedCardList[border]).addClass("td-col-last-spacing");
                }
            }

            $(".td_rq_compare-table").compareTable('init');
            $(".td_rq_compare-table-sticky").compareTableSticky('init');

        }

        function isRatingReady() {
            if ($("#starsLoaded").length > 0) {
                for (var i = 0; i < vm.matchedProducts.length; i++) {
                    if(vm.selectedCardIds[i] == vm.totalCrad[vm.matchedProducts[i]]) {
                        $compile($('#compareTableHeadDefault' + i).html($('#compareTableHead' + vm.matchedProducts[i]).html()))($scope);
                    }
                }
                $(".td_rq_compare-table").compareTable('init');
                $(".td_rq_compare-table-sticky").compareTableSticky('init');
            } else {
                $timeout(isRatingReady, 50);
            }
        }

        function removeSelectedProduct(id, cardId, productType) {
            var cardType = "cc"; //Setting default as credit card product type

            if (productType == 'accounts') {
                cardType = "ba";
            }

            //Remove and reassign id's to cookie prod_ids_cardtype_lang (prod_id's_cc_en)
            var prodIdCookieName = 'prod_ids_' + cardType + '_' + vm.lang;
            var prodIdSplittedCookie = $cookies.get(prodIdCookieName).split("%2C");
            for (var i = 0; i < prodIdSplittedCookie.length; i++) {
                if (prodIdSplittedCookie[i] == vm.lang + "_" + cardType + "_" + cardId) {
                    prodIdSplittedCookie.splice(prodIdSplittedCookie.indexOf(prodIdSplittedCookie[i]), 1);
                }
            }
            $cookies.put(prodIdCookieName, prodIdSplittedCookie.join('%2C'), { path: window.conTextPathVal });

            //Remove individual card cookie
            angular.forEach($cookies.getAll(), function (value, key) {
                if (key.indexOf(vm.lang + "_" + cardType + "_" + cardId) == 0) {
                    $cookies.remove(key, { path: window.conTextPathVal });
                }
            });

            //Delete the card from the UI
            $compile($('#compareTableHeadDefault' + vm.selectedCardIds.indexOf(cardId)).html($("#compareTableHeadDefault3").html()))($scope);
            $compile($('.compare-row' + id).html(''))($scope);
            $compile($('#compareTableToggleDefault' + vm.selectedCardIds.indexOf(cardId)).html($("#compareTableToggleDefault3").html()))($scope);
            $compile($('#compareTableToggleDefaultMobile' + vm.selectedCardIds.indexOf(cardId)).html($("#compareTableToggleDefaultMobile3").html()))($scope);
			var val = vm.selectedCardIds.indexOf(cardId);
            vm.selectedCardIds[val] = "empty";

        }
    }

    function filterToolController($http, factoryFilterTool, filtertoolLoad, $window, $rootScope, $location, apiFactory) {
        /*jshint validthis: true */
        var vm = this;

        vm.dynamicDropdownJson = {};
        vm.getJsonFrom = $window.conTextPathVal + '/system/assets/taxonomy/filter-tool.json';
        vm.interActiveValues = $location.search();
        vm.filterToolType = '';
        vm.filterToolDropDownJson = {};
        vm.catagories = {};
        vm.allDropDownData = {};


        vm.filterToolCategory = filterToolCategory;
        vm.filterToolLogic = filterToolLogic;
        vm.changeDropDownData = changeDropDownData;
        vm. setCatalogueNumber =  setCatalogueNumber;
        vm.productId = "";

        filterToolLogic();

        function filterToolCategory(filterToolType) {
            vm.filterToolType = filterToolType;
        }

        function filterToolLogic() {
            return apiFactory.getHttp(vm.getJsonFrom).then(function successCallback(response) {

                vm.filterToolDropDownJson = response.data;

                for (var a = 0; a < vm.filterToolDropDownJson.category.keywords.length; a++) {
                    if (vm.filterToolDropDownJson.category.keywords[a].key == vm.filterToolType) {
                        vm.catagories = vm.filterToolDropDownJson.category.keywords[a].keywords;
                        angular.forEach(vm.catagories, function (value, key) {
                            if (vm.interActiveValues != '' || vm.interActiveValues != undefined) {
                                if (vm.interActiveValues['ftparm' + (key + 1)] == '' || vm.interActiveValues['ftparm' + (key + 1)] == undefined) {
                                    vm.dynamicDropdownJson[vm.catagories[key].key] = vm.catagories[key].keywords[0].key;
                                } else {
                                    if (vm.interActiveValues['ftparm' + (key + 1)] > vm.catagories[key].keywords.length) {
                                        vm.dynamicDropdownJson[vm.catagories[key].key] = vm.catagories[key].keywords[0].key;
                                    } else {
                                        vm.dynamicDropdownJson[vm.catagories[key].key] = vm.catagories[key].keywords[vm.interActiveValues['ftparm' + (key + 1)]].key;
                                    }
                                }
                            } else {
                                vm.dynamicDropdownJson[vm.catagories[key].key] = vm.catagories[key].keywords[0].key;
                            }
                        });
                    }
                }

                vm.allDropDownData = Object.keys(vm.dynamicDropdownJson).map(function (k) { return vm.dynamicDropdownJson[k] });
                factoryFilterTool.setFilterData(vm.allDropDownData);
                $rootScope.$emit("sendDataParentCtrl", vm.productId);

            }, function errorCallback(response) {
                vm.error = response.error;
            });
        }

        function setCatalogueNumber(id){
            vm.productId = id;
        }
        
        function changeDropDownData() {
            vm.allDropDownData = Object.keys(vm.dynamicDropdownJson).map(function (k) { return vm.dynamicDropdownJson[k] });
            factoryFilterTool.setFilterData(vm.allDropDownData);
            $rootScope.$emit("sendDataParentCtrl", vm.productId);
        }

    }

})();

/**
   * TDCT Redesign Controller End
   */


/**
  * TDCT Redesign Factory Start
  */


angular.module('tdctRedesign').factory('factoryFilterTool', factoryFilterTool)
.factory('filtertoolLoad', filtertoolLoad)
.factory('apiFactory', apiFactory);

function factoryFilterTool() {
    var value = [];
    var filterData = {
        setFilterData: setFilterData,
        getFilterData: getFilterData,
        value: value
    };
    return filterData;

    ////////////
    function setFilterData(getXMLData) {
        filterData.value = getXMLData;
    };

    function getFilterData() {
        return filterData.value;
    };
}

function apiFactory($http, $window) {
    var httpData = {
        getHttp: getHttp
    };
    return httpData;

    ////////////
    function getHttp(url) {
        return $http.get(url);
    };
}


function filtertoolLoad() {
    var filterToolLoadData = {
        setFilterToolLoadData: setFilterToolLoadData,
        getFilterToolLoadData: getFilterToolLoadData
    };
    return filterToolLoadData;

    ////////////
    function setFilterToolLoadData(getXMLData) {
        filterToolLoadData.value = getXMLData;
    };

    function getFilterToolLoadData() {
        return filterToolLoadData.value;
    };
}

/**
   * TDCT Redesign Factory End
   */
