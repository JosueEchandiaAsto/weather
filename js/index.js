( function() {
	var API_WEATHER_KEY = "e7dd4cd362bf954ff3a891e6d5d8f389";
	var API_WEATHER_URL = "http://api.openweathermap.org/data/2.5/weather?appid=" + API_WEATHER_KEY + "&";
	var API_WEATHER_IMG = "http://openweathermap.org/img/w/"
	var cityWeather = {};
	var sesion = 0;
	var today = new Date();
	var day = today.getHours() + ":" + today.getMinutes();
	var cities_url = ["http://www.tvperu.gob.pe/sites/default/files/Plaza_de_Arequipa.jpg",
				  	  "http://www.oltursa.pe/files/imagen/110/Cusco.jpg",
				      "http://impacto.net.pe/wp-content/uploads/2016/01/impacto_historia_180116_lima.jpg",
				      "http://www.entrujillo.com/imagenes/plaza-armas-trujillo-peru.jpg"]
	
	var cities_img = ["Abancay", "Cusco", "Lima", "Trujillo"]

	var $body = $("[data-template]");
	var $loader = $(".loader");
	var $nameNewCity = $("[data-input='cityAdd']");
	var $buttonAdd = $("[data-button='add']");
	var $buttonLoad = $("[data-save-cities]")
	var $buttonEraser = $("[data-search]")
	var $nav = $(".navegacion")

	$( $buttonAdd ).on("click", addCity);
	$( $buttonLoad ).on("click", myCities);
	$( $buttonEraser ).on("click", eraser);

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(getCoords, errorFound);
	}
	else {
		alert("Actualiza tu navegador")
	}

	function errorFound(error){
		alert("Ocurrio un error: "+error.code);
	}
	function getCoords(position){
		var lat = position.coords.latitude;
		var lon = position.coords.longitude;
		$.getJSON(API_WEATHER_URL + "lat=" + lat + "&lon=" + lon, getCurrentWeather);
	}

	function getCurrentWeather(data) {
		cityWeather.zone = data.name;
		cityWeather.ico = API_WEATHER_IMG + data.weather[0].icon + ".png";
		cityWeather.tempk = Number((data.main.temp).toFixed(0));
		cityWeather.tempc = Number((cityWeather.tempk-273.15).toFixed(0));
		cityWeather.main = data.weather[0].main;
		renderTemplate(cityWeather)
		if (!localStorage.getItem("ciudades")) {
			localStorage.setItem("ciudades" , "[]");
		};
		
	}

	function activateTemplate(id) {
		var t = document.querySelector(id);
		return document.importNode(t.content, true)
	};

	function renderTemplate(cityWeather) {
		
		var clone = activateTemplate("#weather--city");
		clone.querySelector("[data-time]").innerHTML = day;
		clone.querySelector("[data-city]").innerHTML = cityWeather.zone;
		clone.querySelector("[data-figure]").src = figure(cityWeather.zone)
		clone.querySelector("[data-icon]").src = cityWeather.ico;
		clone.querySelector("[data-temp = 'celsius']").innerHTML = cityWeather.tempc;
		clone.querySelector("[data-temp = 'kelvin']").innerHTML = cityWeather.tempk;
		
		$( $loader ).hide();
		$( $body ).append(clone);
		$( $nameNewCity ).val("");
	}

	function figure(city){
		var option;
		for (var i = 0; i < cities_img.length; i++) {
				if (cities_img[i] == city) {
				return cities_url[i]
			};
		};
	}

	function addCity(event) {
		event.preventDefault();
		var ciudades = JSON.parse( localStorage.getItem("ciudades") )
		ciudades.push($( $nameNewCity ).val())
		$.getJSON(API_WEATHER_URL + "q=" + $( $nameNewCity ).val() , function(data){
			cityWeather.zone = data.name;
			cityWeather.ico = API_WEATHER_IMG + data.weather[0].icon + ".png";
			cityWeather.tempk = Number((data.main.temp).toFixed(0));
			cityWeather.tempc = Number((cityWeather.tempk-273.15).toFixed(0));
			cityWeather.main = data.weather[0].main;
			localStorage.setItem($( $nameNewCity ).val(), JSON.stringify(cityWeather))
			localStorage.setItem("ciudades" , JSON.stringify(ciudades));
			renderTemplate(cityWeather);
		})
		}

	function myCities(event){
		event.preventDefault();
		var ciudades = JSON.parse( localStorage.getItem("ciudades") )
		for (var a in ciudades) {
			$.getJSON(API_WEATHER_URL + "q=" + ciudades[a] , function(data){
			cityWeather.zone = data.name;
			cityWeather.ico = API_WEATHER_IMG + data.weather[0].icon + ".png";
			cityWeather.tempk = Number((data.main.temp).toFixed(0));
			cityWeather.tempc = Number((cityWeather.tempk-273.15).toFixed(0));
			cityWeather.main = data.weather[0].main;
			renderTemplate(cityWeather)})		
			};
		
	}
	function eraser(event){
		event.preventDefault();
		localStorage.setItem("ciudades" , "[]");
		location.reload();
	}

})();

