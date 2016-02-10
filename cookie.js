// ==UserScript==
// @name        Auto Cookie Clicker
// @author      Reblerebel
// @namespace   *
// @description Clicks the cookie automatically, buys upgrades automatically, clicks golden cookies automatically
// @include     http://orteil.dashnet.org/*
// @version     1.5
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// ==/UserScript==

function ClickLoop()
{
$("#bigCookie").click();

}
ClickLoop();

function delayedLoop()
{
$("#goldenCookie").click();


var grandmaResearch = /Switch/gi;
var sellLoop = /Revoke.*Elder.*Covenant.*Switch/g;


   
    
var cpatt = /[0-9,.]+$/;
var producePatt = /[^0-9,.]+/g;
var cookiesPer = new Array();
var price = new Array();
var totalCookies = new Array();
var pricePerCookie = new Array();
var cookiesPatt = /^[0-9,]+/;


    $('.cleanMe').remove();
    
    var craw = $("#cookies div").text();
    var cps =0;
    if (craw.length > 10){
		cps = parseFloat(craw.replace("per second : ","").replace(/,/g,""));
        
    
        for (var i=0;i<10;i++){
            var prodRaw = $(Game.ObjectsById[i].tooltip()).text().split(producePatt);
            if (prodRaw[1] != undefined && prodRaw[1] > 0){
                cookiesPer[i] = parseFloat(prodRaw[4].replace(/,/g,""));
                totalCookies[i] = parseFloat(prodRaw[2].replace(/,/g,"")) ;
                price[i] = parseFloat($("#product"+i+" .content .price").text().replace(/,/g,""));
                pricePerCookie[i] = price[i] / cookiesPer[i];
                //console.log(price[i], cookiesPer[i], totalCookies[i], pricePerCookie[i]);

            }
        }
        
    //console.log("CpS: "+cps);
        
    }
    var totalPrice = 0;
    var currCookies = parseInt(cookiesPatt.exec($("#cookies").text().replace(/,/g,"")),10);    

    var buyIndex = 0;
    
    
    
        for(var i=0;i<10;i++){
            var U0C = $("#upgrade" + i);
            
            
                //console.log(i+"possible");
                if (grandmaResearch.test(U0C.attr('onmouseover'))){
                    U0C.css('background-color','red');
                    
                }
                else {
                    
                    U0C.css('background-color','green');
                    if(U0C.attr('class') == "crate upgrade enabled")
                        U0C.click();
                }
            
            
        }
                
        if ($("#product9 .content .owned").text() < 1){
            for(var i=9;i>=0;i--){
                var P0C = $("#product" + i);
                if ($("#product"+i+" .content .owned").text() < 1){
                    $("#product"+i+" .content .owned").css('background-color','green');
                    
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
        totalPrice += totalCookies[i];
        //console.log(i+": "+pricePerCookie[i]);
        if (pricePerCookie[i] < pricePerCookie[buyIndex])
            buyIndex = i;
       //console.log(cookiesPer[i]+ " "+price[i]);
        
    }
    
    //console.log("buying: "+buyIndex);
    
   
    
   $("#product"+buyIndex+" .content .owned").css('color','#116611');
   $("#product"+buyIndex+" .content .owned").css('opacity','1');

    
    var P0C = $("#product" + buyIndex);
    
   /* if (sellLoop.test($("#upgrade0").attr('onmouseover'))){
        $("#upgrade0").css('background-color','yellow');
        for (var i=0;i<10;i++){
        	Game.ObjectsById[i].sell();
        }
    } else { */       
   //console.log( cps*100 +" "+ parseInt($("#product"+buyIndex+" .content .price").text().replace(/,/g,"")) +" "+ (cps * 1200 * 7 * 10)+" "+ parseInt($("#product"+buyIndex+" .content .price").text().replace(/,/g,"")) +" "+ cookiesPatt.exec($("#cookies").text().replace(/,/g,"")));
    if(P0C.attr('class') == "product unlocked enabled"){
        var buyPrice = parseInt($("#product"+buyIndex+" .content .price").text().replace(/,/g,""),10);
        console.log(format_cookies((cps * 1200 * 7 * 10+buyPrice) - currCookies));
        if (( (cps * 1200 * 7 * 10+buyPrice) < currCookies ) || ( pricePerCookie[buyIndex]/ (cps / totalPrice) < 10000 )){
			P0C.click();
        }
    }
    //}
    
    //console.log ("total cookies " + totalPrice);
    //console.log ("multiplier " + cps / totalPrice);
    
    
}
delayedLoop();

window.setInterval(ClickLoop,1);
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

