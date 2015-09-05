(function() {

var API_KEY = "93d33598-7d65-444e-8daa-788818f097a1";
var API_URL1 = ".api.pvp.net/api/lol/"
var API_URL2 ="/v1.4/summoner/by-name/";
var API_ICON_URL = "http://avatar.leagueoflegends.com/";

var username = $("[data-username]");
var button = $("[data-searchbtn]");
var summoner = $("[data-name]");

$(button).on("click", searchSummoner);

function searchSummoner (event) {
  event.preventDefault();
  var c = document.getElementById('region');
  var region = c.value;
  var summonerName = $(username).val();
  $.getJSON("https://" + region + API_URL1 + region + API_URL2 + summonerName + "/?api_key=" + API_KEY, getID).fail(errorFound);
}

function errorFound (jqxhr, textStatus, err) {
  var error = textStatus + ", " + error;
  alert("Request Failed: " + err);
}

function getID (data) {

  var c = document.getElementById('region');
  var region = c.value;
  var summonerName = $(username).val()
  var iconPath = API_ICON_URL + region + "/" + summonerName + ".png";

  var id = document.getElementById('name');
  var lvl = document.getElementById('lvl');
  var icon = document.getElementById('img');
  id.innerHTML = data[summonerName].id;
  lvl.innerHTML = data[summonerName].summonerLevel;
  icon.src = iconPath;
  console.log(data);

}

})()
