(function() {

var API_KEY = "93d33598-7d65-444e-8daa-788818f097a1";
var API_URL_ROOT = ".api.pvp.net/api/lol/"
var API_URL_SUMMONERNAME ="/v1.4/summoner/by-name/";
var API_URL_RANKED = "/v2.5/league/by-summoner/"

var API_ICON_URL = "http://sk2.op.gg/images/profile_icons/profileIcon"

//Rank path
var rankImages = {
  BRONZE: {
    I:"images/bronze_i.png",
    II:"images/bronze_ii.png",
    III: "images/bronze_iii.png",
    IV: "images/bronze_iv.png",
    V: "images/bronze_v.png"
  },
  SILVER: {
    I: "images/silver_i.png",
    II: "images/silver_ii.png",
    III: "images/silver_iii.png",
    IV: "images/silver_iv.png",
    V: "images/silver_v.png"
  },
  GOLD: {
    I: "images/gold_i.png",
    II: "images/gold_ii.png",
    III: "images/gold_iii.png",
    IV: "images/gold_iv.png",
    V: "images/gold_v.png"
  },
  PLATINUM: {
    I: "images/platinum_i.png",
    II: "images/platinum_ii.png",
    III: "images/platinum_iii.png",
    IV: "images/platinum_iv.png",
    V: "images/platinum_v.png"
  },
  DIAMOND: {
    I: "images/diamond_i.png",
    II: "images/diamond_ii.png",
    III: "images/diamond_iii.png",
    IV: "images/diamond_iv.png",
    V: "images/diamond_v.png"
  },
  MASTER: {
    I: "images/master.png"
  },
  CHALLENGER: {
    I: "images/challenger.png"
  },
  UNRANKED: "images/unranked.png"
};

//Formulari
var username = $("[data-username]");
var button = $("[data-searchbtn]");
$(username).val("");
$(button).on("click", searchSummoner);


var summoner = $("[data-name]");

var region = "euw";
var summonerName;


//Cambio de region
function regionNA() {
  region = "na";
}
function regionEUW() {
  region = "euw";
}
function regionEUNE() {
  region = "eune";
}
function regionBR() {
  region = "br";
}




//Start!
if(localStorage.getItem("lastSummoner")){
  /*var lastSummoner = localStorage.getItem("lastSummoner");
  var lastRegion = localStorage.getItem("lastRegion");
  $(username).val(lastSummoner);
  var c = document.getElementById('region');
  searchSummoner();
  */
  console.log("LocalStorage: OK");
}


function searchSummoner (event) {
  event.preventDefault();
  console.log(region);
  summonerName = $(username).val().toLowerCase().replace(/ /g,'');
  if(summonerName != "") {
    var summonerPath = "https://" + region + API_URL_ROOT + region + API_URL_SUMMONERNAME + summonerName + "/?api_key=" + API_KEY;
    $.getJSON(summonerPath, getID).fail(errorFound);
}
}


//Error si no encuentra summoner
function errorFound (jqxhr, textStatus, err) {
    var error = textStatus + ", " + error;
    alert("Request Failed: " + err);
}

//Rellena los campos del summoner
function getID (data) {
  if(!$(username).val() == ""){
    summonerName = $(username).val().toLowerCase().replace(/ /g,'');
    var id = document.getElementById('id');
    var lvl = document.getElementById('lvl');

    id.innerHTML = "Name: " + data[summonerName].name;
    lvl.innerHTML = "Lvl: " + data[summonerName].summonerLevel;

    getIcon(data[summonerName].profileIconId);
    getRankedStats(data[summonerName].id);


    //Reinicar input a 0

    localStorage.setItem("lastSummoner",summonerName);
    localStorage.setItem("region", region);

    $(username).val("");
  }
}




function getIcon(id) {
  var icon = document.getElementById('img');
  var iconPath = API_ICON_URL + id + ".jpg";
  icon.src = iconPath;
}




function getRankedStats(id) {
  var rank = document.getElementById('wins/losses');
  var rankIco = document.getElementById('rank');
  var rankPath = "https://"+ region + API_URL_ROOT + region + API_URL_RANKED + id + "/entry?api_key=" + API_KEY;
  $.getJSON(rankPath, function (data){

    var wins = data[id][0].entries[0].wins;
    var losses = data[id][0].entries[0].losses;
    var league = data[id][0].tier;
    var division = data[id][0].entries[0].division;
    var leaguePoints = data[id][0].entries[0].leaguePoints;

    //console.log(data);
    rankIco.src = rankImages[league][division];
    rank.innerHTML = league + " " + division + "<br>Ranked W/L: " + wins + "/" + losses + "<br>" + leaguePoints  +" LP";
  }).error(function () {
    rank.innerHTML = "-UNRANKED-";
    rankIco.src = rankImages.UNRANKED;
  });
}


})()
