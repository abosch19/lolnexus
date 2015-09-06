(function() {

var API_KEY = "93d33598-7d65-444e-8daa-788818f097a1";
var API_URL_ROOT = ".api.pvp.net/api/lol/"
var API_URL_SUMMONERNAME ="/v1.4/summoner/by-name/";
var API_URL_WINS = "/v1.3/stats/by-summoner/"

var API_ICON_URL_AVATAR = "http://avatar.leagueoflegends.com/";
var API_ICON_URL_DDRAGON = "http://ddragon.leagueoflegends.com/cdn/5.2.1/img/profileicon/";


//Formulari
var username = $("[data-username]");
var button = $("[data-searchbtn]");
$(username).val("");
$(button).on("click", searchSummoner);


var summoner = $("[data-name]");


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
    var region = c.value;
    var summonerName = $(username).val().toLowerCase().replace(/ /g,'');
    var id = document.getElementById('id');
    var lvl = document.getElementById('lvl');

    id.innerHTML = "Name: " + data[summonerName].name;
    lvl.innerHTML = "Lvl: " + data[summonerName].summonerLevel;
    getIcon(summonerName, data, region);
    getRankedStats(summonerName, data, region);


    console.log(data);
    $(username).val("");
  }
}




function getIcon(summonerName, data, region) {
  var icon = document.getElementById('img');
  var iconPath = API_ICON_URL_DDRAGON + data[summonerName].profileIconId + ".png";

 //Cambia el path de la imagen/icono si no funciona con ddragon
  $.get(iconPath).done (
    function () {
      icon.src = iconPath;
    }).fail(function (){
    iconPath = API_ICON_URL_AVATAR + region + "/" + summonerName + ".png";
    icon.src = iconPath;
  })
}




function getRankedStats(summonerName, dataStats, region) {
  var wins = document.getElementById('wins/losses');
  var winsPath = "https://"+ region + API_URL_ROOT + region + API_URL_WINS + dataStats[summonerName].id + "/summary?season=SEASON2015&api_key=" + API_KEY;
  $.getJSON(winsPath, function (data){
    console.log(data);

    //Busca en data(json) el número de rankeds wins/losses
    var matched = false;
    var i;
    for(i = 0;i < 12 && !matched; ++i) {
      if(data.playerStatSummaries[i].playerStatSummaryType == "RankedSolo5x5") {
        console.log("Matched!");
        matched = true;
      }
    }
    wins.innerHTML = "Ranked W/L: " + data.playerStatSummaries[i-1].wins + "/" + data.playerStatSummaries[i-1].losses;
  });
}

})()
