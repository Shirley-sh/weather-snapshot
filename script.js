/**
 * Created by Shirley on 3/2/16.
 */

var sunrise, sunset, sunriseText, sunsetText, time, condition, code, morningLight,
        eveningLight,city,tempF,tempC, current,msg,seaLevel,today,starDisplay;
var drops = [];
var stars = [];
var isF = true;
var isSnow = false;
var timezone = -9;

if ("geolocation" in navigator) {
    $('#get-loc').show();
} else {
    $('#get-loc').css("opacity", 0);
}

$('#get-loc').on('click', function() {
    timezone = date.getTimezoneOffset()/60;
    getHour();
    resetAnimation();
    navigator.geolocation.getCurrentPosition(function(position) {
        loadWeather(position.coords.latitude+','+position.coords.longitude); //load weather using your lat/lng coordinates
    });
    document.getElementById("condition").textContent = "Loading...";
    document.getElementById("location").textContent = "Loading...";
    setGreetings();
    $('#get-loc').css("opacity", 0);
    console.log("city: " + city + " condition:" + condition+ " code:" +code);
});

$('#shanghai').on('click', function() {
    timezone = -8;
    getHour();
    resetAnimation();
    loadWeather("Shanghai",2151849);
    document.getElementById("condition").textContent = "Loading...";
    document.getElementById("location").textContent = "Loading...";
    setGreetings();
    document.querySelector("#skyline img").src = "images/shanghai.png";
    $('#get-loc').css("opacity", 1);
    console.log("city: " + city + " condition:" + condition+ " code:" +code);

});

$('#new-york').on('click', function() {
    timezone = 4;
    getHour();
    resetAnimation();
    loadWeather("New York",	12761335);
    document.getElementById("condition").textContent = "Loading...";
    document.getElementById("location").textContent = "Loading...";
    setGreetings();
    document.querySelector("#skyline img").src = "images/newyork2.png";
    $('#get-loc').css("opacity", 1);
    console.log("city: " + city + " condition:" + condition+ " code:" +code);

});

$('#abu-dhabi').on('click', function() {
    timezone = -4;
    getHour();
    resetAnimation();
    loadWeather("Abu Dhabi",1940330);
    document.getElementById("condition").textContent = "Loading...";
    document.getElementById("location").textContent = "Loading...";
    setGreetings();
    document.querySelector("#skyline img").src = "images/abudhabi2.png";
    $('#get-loc').css("opacity", 1);
    console.log("city: " + city + " condition:" + condition+ " code:" +code);

});

$('#unit').on('click',function(){
    isF = !isF;
    if(isF){
        document.getElementById("temp").textContent = tempF+"℉";
        document.getElementById("unit").textContent = "/℃";

    }else {
        document.getElementById("temp").textContent = tempC+"℃";
        document.getElementById("unit").textContent = "/℉";
    }
});

function loadWeather(location, woeid) {
    $.simpleWeather({
        location: location,
        woeid: woeid,
        unit: 'f',
        success: function (weather) {
            today = weather.forecast[0].date;
            city = weather.city;
            condition = weather.currently;
            tempC = weather.alt.temp;
            tempF = weather.temp;
            code = weather.code;
            sunriseText = weather.sunrise;
            sunsetText = weather.sunset;
            sunrise = convertTime(weather.sunrise);
            sunset = convertTime(weather.sunset);
            document.getElementById("condition").textContent = condition;
            document.getElementById("location").textContent = city;
            if(isF){
                document.getElementById("temp").textContent = tempF+"℉";
                document.getElementById("unit").textContent = "/℃";

            }else {
                document.getElementById("temp").textContent = tempC+"℃";
                document.getElementById("unit").textContent = "/℉";
            }
            switch (city){
                case "Shanghai":
                    document.querySelector("#skyline img").src = "images/shanghai2.png";
                    break;
                case "New York":
                    document.querySelector("#skyline img").src = "images/newyork2.png";
                    break;
                case "Abu Dhabi":
                    document.querySelector("#skyline img").src = "images/abudhabi2.png";
                    break;
                default:
                    document.querySelector("#skyline img").src = "images/city2.png";
            }
        },
        error: function (error) {
        }
    });
}

$.simpleWeather({
    location: 'Tokyo',
    unit: 'f',
    success: function (weather) {
        today = weather.forecast[0].date;
        city = weather.city;
        condition = weather.currently;
        tempC = weather.alt.temp;
        tempF = weather.temp;
        code = weather.code;
        sunriseText = weather.sunrise;
        sunsetText = weather.sunset;
        sunrise = convertTime(weather.sunrise);
        sunset = convertTime(weather.sunset);
    }
});


function setup() {
    frameRate(20);
    date = new Date();

    getHour();
    resetAnimation();
    setGreetings();

    document.getElementById("condition").textContent = condition;
    document.getElementById("location").textContent = city;
    document.getElementById("temp").textContent = tempF+"℉";
    document.getElementById("unit").textContent = "/℃";

    createCanvas(windowWidth, windowHeight);
    if(windowWidth>500){
        size=50;
    }else {
        size=windowWidth/15;
    }
    seaLevel = windowHeight / 8 * 5;
    $("#skyline").height(seaLevel-0.66*size);


    bgImg = loadImage("images/background.jpg");
    bgImgAlt = loadImage("images/background-alt.jpg");
    cloudImg = loadImage("images/cloud.png");

    morningLight=constrain(map(time, sunrise-3600,36000, 255, 0),0,220);
    eveningLight=constrain(map(time, 50400, sunset+3600, 0, 255),0,220);//bright hours:10-2pm


    for(i=0; i<200;i++){
        drops.push(new Drop());
    }
    for(i=0; i<100;i++){
        stars.push(new Star());
    }
}

function draw() {
    //update Time
    getHour();
    //wright time to page
    document.getElementById("time").textContent = checkTime(currentH)+":"+ checkTime(minute())+":"+ checkTime(second());
    document.getElementById("date").textContent = today;
    //sun animation
    if(current<sunset && current>sunrise && time<current){
        time+=1600;
        if(time>current){
            time=current;
        }
    }else{
        time=current;
    }

    risePoint = width / 6;
    setPoint = width - risePoint;
    seaLevel = height / 8 * 5;
    morningLight=constrain(map(time, sunrise-3600,36000, 255, 0),0,220);
    eveningLight=constrain(map(time, 50400, sunset+3600, 0, 255),0,220);


    checkCondition(code);

    //sunrise and sunset
    strokeWeight(1);
    stroke(255, 70);
    noFill();
    strokeWeight(10);
    stroke(200,240,255, 70);
    ellipse(risePoint, seaLevel, size*1.5, size*1.5);
    ellipse(setPoint, seaLevel, size*1.5, size*1.5);
    strokeWeight(5);
    ellipse(risePoint, seaLevel, size*1.5-3, size*1.5-3);
    ellipse(setPoint, seaLevel, size*1.5-3, size*1.5-3);
    noStroke();
    fill(255);
    textAlign(CENTER);
    text(sunriseText,risePoint,seaLevel+2);
    text(sunsetText,setPoint,seaLevel+2);


}

function convertTime(str) {
    var parts, noon, t, h, m;
    if (str.length > 10) {
        parts = str.split(" ");
        noon = parts[5];
        t = parts[4];
    } else {
        parts = str.split(" ");
        t = parts[0].split(":");
        noon = parts[1];
    }
    h = t[0];
    m = t[1];
    if (noon == "am") {
        return (h * 60 * 60 + m * 60);
    } else {
        return ((parseInt(h) + 12) * 60 * 60 + m * 60);
    }
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    if(windowWidth>500){
        size=50;
    }else {
        size=windowWidth/15;
    }
    $("#skyline").height(seaLevel-0.66*size);
    risePoint = width / 6;
    setPoint = width - risePoint;
    seaLevel = height / 8 * 5;

}

function checkTime(i) {
    if (i < 10) {
        i = "0" + i
    }
    return i;
}

function setGreetings(){
    if(currentH>4 && currentH<12){
        msg = "Good Morning";
    }else if((currentH)<18 && currentH>=12){
        msg = "Good Afternoon";
    }else if((currentH)>=18){
        msg = "Good Evening";
    }else {
        msg = "Greetings Night Owl";
    }

    document.getElementById("greeting").textContent = msg;
}

function getHour(){
    if(date.getUTCHours()-timezone>=24){
        currentH = date.getUTCHours()-timezone-24;
    }else if(date.getUTCHours()-timezone<0) {
        currentH = date.getUTCHours()-timezone+24;
    }else {
        currentH = date.getUTCHours()-timezone;
    }
    current = (currentH)* 60 * 60 + date.getUTCMinutes() * 60 + date.getSeconds();


}

function resetAnimation(){
    if(current<sunset && current>sunrise){
        time = sunrise-6000;
    }else{
        time=current;
    }
}

function drawLights(){
    //lights
    noStroke();
    fill(0, 0, 0, morningLight);
    rect(0, 0, width, height);
    fill(0, 0, 0, eveningLight);
    rect(0, 0, width, height);
    fill(180, 0, 100, eveningLight/10);
    rect(0, 0, width, height);
    fill(0);
    rect(0,seaLevel-0.66*size,width,height);
}

function drawSun(){
    //sun
    sunX = map(time, sunrise, sunset, risePoint, setPoint);
    sunR = dist(risePoint, seaLevel, width / 2, seaLevel + height / width);
    if(time<sunrise-600 || time>sunset+600){
        sunY = -100;
    }else {
        sunY = seaLevel + height / width - sqrt(sq(sunR) - sq(sunX - width / 2));
    }
    noStroke();
    fill(255,240,200, 100);
    ellipse(sunX, sunY, size*1.3, size*1.3);
    ellipse(sunX, sunY, size*1.7, size*1.7);
    fill(255);
    ellipse(sunX, sunY, size, size);
    fill(255,51,0, eveningLight/2);
    ellipse(sunX, sunY, size, size);
}

function drawCloud(){
    imageMode(CENTER);
    if(width>height) {
        image(cloudImg, width/2,seaLevel/3*2,width/1.3,seaLevel/3*2+30);
    }else {
        image(cloudImg, width/2,seaLevel/3*2+30,width,seaLevel/3*2);
    }
}


function drawDrops(isSnow){
    for (var i=0; i<drops.length; i++) {
        drops[i].isSnow = isSnow;
        drops[i].move();

    }
}


function Drop() {
    this.x = random(width/4,width/4*3);
    this.y = random(height/3,seaLevel);
    this.offset = random(-30,30);
    this.opacity;
    this.isSnow = true;
    this.size = size/10+random(0, 2);
    this.move = function() {
        this.y += this.offset/20+4;
        this.opacity = map(this.y,height/3,seaLevel,255,0)+this.offset;
        if(this.y>height){
            this.y=height/3+random(40,100);
            this.x = random(width/4,width/4*3);
        }
        fill(255,this.opacity);
        if(this.isSnow){
            ellipse(this.x, this.y, this.size, this.size);
        }else {
            rect(this.x, this.y, 1,this.size*3);
        }



    };
}

function drawStars(){
    starDisplay =constrain(map(sq(time/3600-12), 64, 16, 0, 255),0,255);
    for (var i=0; i<stars.length; i++) {
        stars[i].twinkle();
    }
}

function Star() {
    this.x = random(width/8,width/8*7);
    this.y = random(height/8,height/2);
    this.opacity=200;
    this.size = random(1, 3);
    this.twinkle = function(){
        if(random(0,2)<1){
            this.opacity+=random(-30,30);
            this.opacity=constrain(this.opacity,0,255);
        }
        fill(255,this.opacity-starDisplay);
        ellipse(this.x, this.y, this.size, this.size);
    }
}

function checkCondition(code){
    imageMode(CORNER);
    if(['23','24','31','32','33','34','36'].indexOf(code)>=0){
        //clear
        //clear bg
        //draw sun
        background(bgImg);
        drawLights();
        drawStars();
        drawSun();
    }else if(['26','27','28'].indexOf(code)>=0){
        //heavy cloud
        //alt bg
        //draw cloud
        //draw sun
        background(bgImgAlt);
        drawCloud();
        drawLights();
        drawSun();
    }else if(['29','30','44'].indexOf(code)>=0){
        //light cloudy
        //clear bg
        //draw cloud
        //draw sun
        background(bgImg);
        drawCloud();
        drawLights();
        drawStars();
        drawSun();
    }else if( ['5','6','7','13','14','15','16','17','18','41','42','43','46','5','6','7','35'].indexOf(code)>=0){
        //snow
        //alt bg
        //draw cloud
        //draw sun
        //draw snow
        background(bgImgAlt);
        drawCloud();
        drawDrops(true);
        drawLights();
        drawSun();

    }else if( ['19','20','21','22','25'].indexOf(code)>=0){
        //foggy
        //alt bg
        //draw sun
        background(bgImgAlt);
        drawLights();
        drawSun();


    }else if(['0', '1', '2','3','4','8','9','10','11','12','37','38','38','39','40','45','47'].indexOf(code) >= 0){
        //rain
        //alt bg
        //draw cloud
        //draw sun
        //draw rain
        background(bgImgAlt);
        drawCloud();
        drawDrops(false);
        drawLights();
        drawSun();

    }else {
        background(bgImg);
        drawLights();
        drawSun();
        drawStars();

    }
}