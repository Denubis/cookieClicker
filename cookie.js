// ==UserScript==
// @name        Auto Cookie Clicker
// @author      Brian Ballsun-Stanton (originally by Reblerebel)
// @namespace   *
// @description Clicks the cookie automatically, buys upgrades automatically, clicks golden cookies automatically
// @include     http://orteil.dashnet.org/*
// @version     2
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require     https://raw.githubusercontent.com/adamwdraper/Numeral-js/master/numeral.js
// @require     https://raw.githubusercontent.com/MikeMcl/decimal.js/master/decimal.min.js
// ==/UserScript==

function ClickLoop()
{
    if ($("#clickCookie").prop("checked")){
        $("#bigCookie").click();
    }
}
ClickLoop();

function deWord(number){
    if (number !== undefined) {
        number=number.toString();
        clean=number.replace(/,/g,"");
        return new Decimal(clean);
    } else {
        return undefined;
    }
    //console.log(number, foo.toString());
    
}

$("#topBar").append("<div><input type='checkbox' id='elderPledge'>Elder Pledge</div>");
$("#topBar").append("<div><input type='checkbox' id='clickCookie' checked>Clicker</div>");
$("#topBar").append("<div><input type='checkbox' id='festiveBiscuit' >Fool's Biscuit</div>");

function delayedLoop()
{
    //console.log(Game);
if ($("#clickCookie").prop("checked")){
    $("#goldenCookie").click();
    $("#seasonPopup").click();
    $("a.option.large.framed.title").click();
}
var grandmaResearch = /Switch/gi;
var sellLoop = /Revoke.*Elder.*Covenant.*Switch/g;

var numWrinklers=0;
for (var i in Game.wrinklers) {  if (Game.wrinklers[i].phase == 2)  numWrinklers++; }    
if (numWrinklers >= 10)
    Game.CollectWrinklers();
    
var cpatt = /[0-9,.]+$/;
var producePatt = /[^0-9,.]+/g;
var cookiesPerItemPatt = /each [a-z ]+ produces ([0-9,.e+]+) cookies per second•/;
var cookiesPer = new Array();
var price = new Array();
var amount = new Array();
var totalCookies = new Array();
var pricePerCookie = new Array();
var cookiesPatt = /^[0-9,]+/;
var cookieMult = new Decimal(1200*7*10);

    $('.cleanMe').remove();
    
    
    
    var cps = deWord(Game.cookiesPs);
    if (cps > 0){
        for (var i=0;i<14;i++){
            storeItem = Game.ObjectsById[i];
            var prodText = $(Game.ObjectsById[i].tooltip()).find(".data").text();
            //var prodRaw = prodText.split(producePatt);
            var prodRaw = cookiesPerItemPatt.exec(prodText);
            //console.log("prod", prodText, prodRaw);
            
            
            
            
            if (storeItem.amount > 0){
                //console.log(storeItem);
                //console.log(Game);
                cookiesPer[i] = deWord(prodRaw[1]);
                //console.log(cookiesPer[i]);
                totalCookies[i] = deWord(storeItem.totalCookies);
                price[i] = deWord(storeItem.price);
                amount[i] = deWord(storeItem.amount);
                pricePerCookie[i] = price[i].dividedBy(cookiesPer[i]);
                //console.log(i, price[i].toString(), cookiesPer[i].toString(), totalCookies[i].toString(), pricePerCookie[i].toString(), prodRaw[1]);

            }
        }
        
    //console.log("CpS: "+cps);
        
    }
    var totalPrice = new Decimal(0);
    var currCookies = deWord(Game.cookies);

    var buyIndex = 0;
    
    
    
        for(var i=0;i<10;i++){
            var U0C = $("#upgrade" + i);

                
                click=U0C.attr("onclick");
                if (click != undefined){
                    var upgrade=click.split("[")[1].split("]")[0];
                    //console.log(Game.UpgradesById[upgrade]);
                    if ($("#elderPledge").prop("checked")){

                        if (Game.UpgradesById[upgrade].name == "Elder Pledge"){
                            if(U0C.attr('class') == "crate upgrade enabled"){
                                U0C.click();
                            }
                        }
                    }
                    if ($("#festiveBiscuit").prop("checked")){

                        if (Game.UpgradesById[upgrade].name == "Fool's biscuit"){
                            if(U0C.attr('class') == "crate upgrade enabled"){
                                U0C.click();
                            }
                        }
                    }
                    
                    if ((U0C.attr('class') == "crate upgrade selector enabled")||(Game.UpgradesById[upgrade].pool == "toggle")){
                        U0C.css('background-color','red');

                    }
                    else {




                        if((Game.UpgradesById[upgrade].pool == "cookie") || (Game.UpgradesById[upgrade].pool == "") ){
                            U0C.css('background-color','green');
                            if(U0C.attr('class') == "crate upgrade enabled") {
                                var upgradeBasePrice = deWord(Game.UpgradesById[upgrade].basePrice);
                                console.log(upgradeBasePrice.toString());
                                if (upgradeBasePrice.lessThan(cps.times(10)) || currCookies.greaterThan(cps.times(cookieMult).plus(upgradeBasePrice))) {
                                    U0C.click();
                                }
                            }
                        }
                    }
                }
            
            
        }
        for(var i=0;i<14;i++){
            var P0C = $("#product" + i);
            if ($("#product" + i +" .content .owned").text() < 1){
                if (i==0){
                   P0C.click();
                } else if ($("#product" + (i-1) +" .content .owned").text() > 10){
                    if(P0C.attr('class') == "product unlocked enabled"){
                        P0C.click();
                    }                
                }
            }
        }

    
    for (var i=0;i<totalCookies.length;i++){
        $("#product"+i+" .content .owned").css('color','black');
		$("#product"+i+" .content .owned").css('opacity','.5');
        $("#product"+i+" .content .owned").css('font-size','2em');
        totalPrice = totalPrice.plus(totalCookies[i]);
        //console.log(i+": "+pricePerCookie[i]);
        if (pricePerCookie[i].lessThan(pricePerCookie[buyIndex]))
            buyIndex = i;
       //console.log(cookiesPer[i]+ " "+price[i]);
        
    }
    
    //console.log("buying: "+buyIndex);
    
   
    
   $("#product"+buyIndex+" .content .owned").css('color','#116611');
   $("#product"+buyIndex+" .content .owned").css('opacity','1');

    
    var P0C = $("#product" + buyIndex);
    
    
   //console.log( cps*100 +" "+ parseInt($("#product"+buyIndex+" .content .price").text().replace(/,/g,"")) +" "+ (cps * 1200 * 7 * 10)+" "+ parseInt($("#product"+buyIndex+" .content .price").text().replace(/,/g,"")) +" "+ cookiesPatt.exec($("#cookies").text().replace(/,/g,"")));
    if(P0C.attr('class') == "product unlocked enabled"){
        //var buyPrice = parseInt($("#product"+buyIndex+" .content .price").text().replace(/,/g,""),10);
        //console.log(format_cookies((cps * 1200 * 7 * 10+buyPrice) - currCookies), cps, buyPrice );
        /*
        if (( (cps * 1200 * 7 * 10+buyPrice) < currCookies ) || ( currCookies > buyPrice*Math.sqrt(cps)) ){
			P0C.click();
        }*/
        
        if (currCookies.greaterThan(cps.times(cookieMult).plus(price[buyIndex])) || currCookies.greaterThan(price[buyIndex].times(cps.sqrt()))){
            P0C.click();
        }
    }
    
    //console.log ("total cookies " + totalPrice);
    //console.log ("multiplier " + cps / totalPrice);
    
    
}
delayedLoop();

window.setInterval(ClickLoop,0);
window.setInterval(delayedLoop,300);
$("#cookies").css("visibility",'hidden');

function format_cookies(bytes)
{
    var sizes = [' Cookies', ' kC',  ' MC', ' GC', ' TC', ' PC', ' EC', ' ZC'];
    if (bytes == 0) 
    {
        return 'n/a';
    }
    var i = parseInt(Math.log(bytes) / Math.log(1000));
    return Math.round(bytes *10 / Math.pow(1000, i), 2) /10 + sizes[i];
}
