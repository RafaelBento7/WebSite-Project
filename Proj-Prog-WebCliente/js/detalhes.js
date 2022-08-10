var moeda ="usd";
var simbolo ="$";
var coin;
var arraycoins=[];
var butaodoTOP = document.getElementById("butaodaCoin").innerText="€";

function pedidoAPI(){
	var path = window.location.href;				// vai buscar o url
	coin= path. split("/").pop();				// retira os caminhos anteriores à pagina
	coin = coin.replace('detalhes.html?id=','');	// obtém o id
	$.ajax({
		method: "GET",
		url: "https://api.coingecko.com/api/v3/coins/"+coin,
		dataType: 'json',

		success: function(dados) {
			detalhes(dados);
		}
	})
}

function detalhes(dados){	
	$('#title').text('Detalhes - '+dados.name)		// titulo da página
	$('#site').attr('href', dados.links.homepage[0]);		// site da coin
	//DETALHES DA COIN
	$("#imagem").attr("src",dados.image.large);
	$("#namerank").text(dados.name+'  #'+dados.market_cap_rank);
	$("#symbol").text(dados.symbol);
	$("#low24").text(dados.market_data.low_24h[moeda]+simbolo);
	$("#high24").text(dados.market_data.high_24h[moeda]+simbolo);
	$("#ath").text(dados.market_data.ath[moeda]+simbolo);
	$("#atl").text(dados.market_data.atl[moeda]+simbolo);
	$("#ath_date").text(dados.market_data.ath_date.eur);
	$("#atl_date").text(dados.market_data.atl_date.eur);
	$("#total_volume").text(dados.market_data.total_volume[moeda].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+simbolo);
	$("#price_change_24h_in_currency").text(dados.market_data.price_change_24h_in_currency[moeda]+simbolo);
	$("#market_cap").text(dados.market_data.market_cap[moeda].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+simbolo);
	$("#current_price").text(dados.market_data.current_price[moeda]+simbolo);

}

function trocarMoeda(){
	if (moeda == "eur") usd();
	else eur();
}

function eur(){
	var butaodoTOP = document.getElementById("butaodaCoin").innerText="$";
	moeda = "eur";
	simbolo = "€";
	pedidoAPI();
}

function usd(){
	var butaodoTOP = document.getElementById("butaodaCoin").innerText="€";
	moeda = "usd";
	simbolo= "$";
	pedidoAPI();
}

function checklocalStorage(){
	var stringcoins;
	if(localStorage.coin!= null){				// Verifica se existe alguma coin na localStorage
		stringcoins=localStorage.coin;
		arraycoins=stringcoins.split(',');		// Coloca todas as moedas do localStorage no arraycoins
	}
}

function addFavorito(){	
	var sair = true;
	var jaexiste=false;
	var i=0;
	checklocalStorage();
	for (var j = 0; j<arraycoins.length ; j++) {		//FOR PARA VER SE A MOEDA JÁ EXISTE NA LOCAL STORAGE
		if (arraycoins[j]==coin) jaexiste=true; 
	}
	if (jaexiste==false){			//CASO N EXISTA
		while(sair){		//	Procura o primeiro espaço vazio no array para adicionar 
			if(arraycoins[i]==null || arraycoins[i]==''){
				arraycoins[i]=coin;
				sair=false;
			} 
			i++;
		}
		if (typeof(Storage) !== "undefined") {		//Adiciona moeda
	        localStorage.coin=arraycoins;
	        alert("Moeda adicionada com sucesso!");
	    } else alert("Erro com a Storage!");
	} else alert("Moeda já está nos favoritos");		//CASO EXISTA
}

function pedidoAPIFavoritos(){
	$.ajax({
		method: "GET",
		url: "https://api.coingecko.com/api/v3/coins/markets?vs_currency="+moeda+"&order=market_cap_desc&per_page=110&page=1&sparkline=false",
		dataType: 'json',

		success: function(dados) {
			listagem(dados);
		}
	})
}

var cloneMedia = $('.media').clone();

function listagem(dados){
	$('.media-list').html('');
	checklocalStorage();
	var liMedia = '';
	for (var i = 0; i < arraycoins.length; i++) {
		for (var j = 0;j<dados.length;j++) {
			if (arraycoins[i]==dados[j]["id"]) {
				var liMedia = cloneMedia.clone();		

			 	$('#detail', liMedia).attr('href', 'detalhes.html?id='+dados[j]["id"]); // link quando se clica na imagem
			 	$('#removeFav', liMedia).attr('href', 'removerfav.html?id='+dados[j]["id"]);
			 	//			DADOS
				$('#image', liMedia).attr("src", dados[j]["image"]);
				$('.title', liMedia).text(dados[j]["name"] + ' - ' + dados[j]["symbol"]);
				$('.marketcap', liMedia).text('Market Cap: '+dados[j]["market_cap"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+simbolo); // separa o número por virgulas
				$('.rank', liMedia).text('#'+dados[j]["market_cap_rank"]);			
				$('.media-list').append(liMedia);

			}
		}
	}
}

function trocarMoedafav(){
	if (moeda == "eur") usdfav();
	else eurfav();
}

function eurfav(){
	var butaodoTOP = document.getElementById("butaodaCoin").innerText="$";
	moeda = "eur";
	simbolo= "€";
	pedidoAPIFavoritos();
}

function usdfav(){
	var butaodoTOP = document.getElementById("butaodaCoin").innerText="€";
	moeda = "usd";
	simbolo= "$";
	pedidoAPIFavoritos();
}

function barraPesquisa() {
    var input = document.getElementById('myInput').value;
    input=input.toLowerCase();
    var li = document.getElementsByClassName('title media-heading');
    var ul = document.getElementsByClassName('media');
    for (i = 0; i < li.length; i++) { 
        if (!li[i].innerHTML.toLowerCase().includes(input)) {
            ul[i].style.display="none";
        }
        else {
            ul[i].style.display="list-item";             
        }
    }
}

function removeFav(){
	var path = window.location.href;				// vai buscar o url
	coin= path. split("/").pop();				// retira os caminhos anteriores à pagina
	coin = coin.replace('removerfav.html?id=','');	// obtém o id
	checklocalStorage();
	for (var i = 0; i < arraycoins.length; i++) {
		if (arraycoins[i]==coin) {
			arraycoins[i]='';	
			localStorage.coin=arraycoins;
	        alert("Moeda removida com sucesso!");	
		}
	}
	window.location = "favoritos.html"
}

function adicionarFav(){
	var path = window.location.href;				// vai buscar o url
	coin= path. split("/").pop();				// retira os caminhos anteriores à pagina
	coin = coin.replace('adicionarfav.html?id=','');	// obtém o id
	addFavorito();
	window.location="index.html"
}