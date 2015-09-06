(function() {

var API_KEY = "93d33598-7d65-444e-8daa-788818f097a1";
var API_URL_ROOT = ".api.pvp.net/api/lol/"
var API_URL_SUMMONERNAME ="/v1.4/summoner/by-name/";
var API_URL_RANKED = "/v2.5/league/by-summoner/"

var API_ICON_URL_AVATAR = "http://avatar.leagueoflegends.com/";
var API_ICON_URL_DDRAGON = "http://ddragon.leagueoflegends.com/cdn/5.2.1/img/profileicon/";

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
  PLATINIUM: {
    I: "images/platinum_i.png",
    II: "images/platinum_ii.png",
    III: "images/platinum_iii.png",
    IV: "images/platinum_iv.png",
    V: "images/platinum_v.png"
  },
  DIAMOND: {
    I: "imgages/diamond_i.png",
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

var region;
var summonerName;

function searchSummoner (event) {
  event.preventDefault();
  var c = document.getElementById('region');
  var region = c.value;
  console.log("OK");
  var summonerName = $(username).val().toLowerCase().replace(/ /g,'');
  var summonerPath = "https://" + region + API_URL_ROOT + region + API_URL_SUMMONERNAME + summonerName + "/?api_key=" + API_KEY;
  $.getJSON(summonerPath, getID).fail(errorFound);
}


//Error si no encuentra summoner
function errorFound (jqxhr, textStatus, err) {
  if(!$(username).val("")){
    var error = textStatus + ", " + error;
    alert("Request Failed: " + err);
  }
}

//Rellena los campos del summoner
function getID (data) {
  if(!$(username).val() == ""){
    var c = document.getElementById('region');
    region = c.value;
    summonerName = $(username).val().toLowerCase().replace(/ /g,'');
    var id = document.getElementById('id');
    var lvl = document.getElementById('lvl');

    id.innerHTML = "Name: " + data[summonerName].name;
    lvl.innerHTML = "Lvl: " + data[summonerName].summonerLevel;
    getIcon(data[summonerName].profileIconId);
    getRankedStats(data[summonerName].id);


    console.log(data);
    $(username).val("");
  }
}




function getIcon(url) {
  var icon = document.getElementById('img');
  var iconPath = API_ICON_URL_DDRAGON + url + ".png";

 //Cambia el path de la imagen/icono si no funciona con ddragon
  $.get(iconPath).done (
    function () {
      icon.src = iconPath;
    }).fail(function (){
    iconPath = API_ICON_URL_AVATAR + region + "/" + summonerName + ".png";
    icon.src = iconPath;
  })
}




function getRankedStats(url) {
  var rank = document.getElementById('wins/losses');
  var rankIco = document.getElementById('rank');
  var rankPath = "https://"+ region + API_URL_ROOT + region + API_URL_RANKED + url + "/entry?api_key=" + API_KEY;
  $.getJSON(rankPath, function (data){
    if(data)
    console.log(data);
    var wins = data[url][0].entries[0].wins;
    var losses = data[url][0].entries[0].losses;
    /*
    //Busca en data(json) el número de rankeds wins/losses
    var matched = false;
    var i;
    for(i = 0;i < 12 && !matched; ++i) {
      if(data.playerStatSummaries[i].playerStatSummaryType == "RankedSolo5x5") {
        console.log("Matched!");
        matched = true;
      }
    }*/
    var league = data[url][0].tier;
    var division = data[url][0].entries[0].division;
    rankIco.src = rankImages[league][division];
    rank.innerHTML = "Ranked W/L: " + wins + "/" + losses;
  }).error(function () {
    rank.innerHTML = "-unranked-";
    rankIco.src = rankImages.UNRANKED;
  });
}


})()
