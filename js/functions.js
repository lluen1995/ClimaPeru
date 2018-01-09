$(document).ready(function() {

  // borra toda la cache
  $.ajaxSetup({ cache: false });
  // ocultar los campos
  $("#provincia").hide('slow');
  $("#distrito").hide('slow');
  $("#nameProv").hide('slow');
  $("#nameDist").hide('slow');
  $('#btn-clima').hide('fast');
  // ingresa departamentoa buscar
  $("input[name='departamento']").keyup(function () {
    // cada nueva busqueda empieza limpio
    $("#info").html("");
    // obteniendo el valor de la caja de Departamentos
    var depa = $("input[name='departamento']").val();
    // ver si hay contenido en la caja(input)
    if (depa.length > 0) {
      Departamentos(depa);

    } else {
      $("#info").html("");
    }
  });

  $('#btn-clima').click(function() {
    // cambiando el nombre del btn mistras ejecuta la acción
    $("#btn-clima").val('Cargando...');
    // obteniendo el valo del distrito
    var woeid = $("select[name='distrito']").val();
    // enviando el valor del distrito que es el id= woeid para ejecuar el api de yahoo
    calcularClima(woeid);
  });

});

function calcularClima(idClima){

  var buscar = "select * from weather.forecast where woeid=" + idClima;
  $.getJSON("https://query.yahooapis.com/v1/public/yql?q=" + buscar + "&format=json&lang=es-ES", function (data) {
    var resultado = data.query.results.channel;
    var fecha = resultado.lastBuildDate;
    var locacion = resultado.location;
    var item = resultado.item;
    var condicion = item.condition;
    var unidades = resultado.units;
    var wind = resultado.wind;
    var imagen = resultado.image;
    var gradosCelcius = ((condicion.temp - 32)*(5/9));
    gradosCelcius = gradosCelcius.toFixed(2);
    var con;
    if (condicion.text === 'Mostly Cloudy') {
      con = 'Parcialmente nublado';
    }else if (condicion.text === 'Scattered Thundershowers') {
      con = 'Disperso';
    }else if (condicion.text === 'Scattered Showers') {
      con = 'Chubascos dispersos';
    }else if (condicion.text === 'Showers') {
      con = 'Lluvioso';
    }else if (condicion.text === 'Mostly Sunny') {
      con = 'Mayormente soleado';
    }else if (condicion.text === 'Partly Cloudy') {
      con = 'Parcialmente nublado';
    }else if (condicion.text === 'Cloudy') {
      con = 'Nublado';
    }else if (condicion.text === 'Windy') {
      con = 'Ventoso';
    }else if (condicion.text === 'Breezy') {
      con = 'Ventoso';
    }else if (condicion.text === 'Sunny') {
      con = 'Soleado';
    }else if (condicion.text === 'Thunderstorms') {
      con = 'Tormentas';
    }

    $("#infoTitulo").html('<h4>' + locacion.country + ', ' + locacion.region + ', ' + locacion.city +'</h4>');
    $("#info1").html('<span>' + gradosCelcius + '°C , ' + con + '</span>');
    $("#info2").html('<img src=https://s.yimg.com/zz/combo?a/i/us/nws/weather/gr/' + condicion.code +'d.png>');
    var datos = "";
    var dia;
    $("#info3").html('<h2>Proximos días..</h2>');
    datos += '<table class="table table-bordered table-responsive">';
    datos += '<head>';
    datos += '<tr>';
    $.each(item.forecast, function(key, value) {
      if (value.day == 'Mon') {
        dia = 'Lunes';
      }else if (value.day == 'Tue') {
        dia = 'Martes';
      }else if (value.day == 'Wed') {
        dia = 'Miercoles';
      }else if (value.day == 'Thu') {
        dia = 'Jueves';
      }else if (value.day == 'Fri') {
        dia = 'Viernes';
      }else if (value.day == 'Sat') {
        dia = 'Sábado';
      }else if (value.day == 'Sun') {
        dia = 'Domingo';
      }

      datos += '<th class="text-color">' + dia + '-' + value.date +'</th>';
    });
    datos += '</tr>';
    datos += '<tr>';
    datos += '</head>';
    datos += '<tbody>';
    datos += '<tr>';
    $.each(item.forecast, function(key, value) {
      datos += '<td><img src=https://s.yimg.com/zz/combo?a/i/us/nws/weather/gr/' + value.code +'d.png></td>';
    });
    datos += '</tr>';
    $.each(item.forecast, function(key, value) {
      if (value.text === 'Mostly Cloudy') {
        con = 'Parcialmente nublado';
      }else if (value.text === 'Scattered Thundershowers') {
        con = 'Disperso';
      }else if (value.text === 'Scattered Showers') {
        con = 'Chubascos dispersos';
      }else if (value.text === 'Showers') {
        con = 'Lluvioso';
      }else if (value.text === 'Mostly Sunny') {
        con = 'Mayormente soleado';
      }else if (value.text === 'Partly Cloudy') {
        con = 'Parcialmente nublado';
      }else if (value.text === 'Cloudy') {
        con = 'Nublado';
      }else if (value.text === 'Windy') {
        con = 'Ventoso';
      }else if (value.text === 'Breezy') {
        con = 'Ventoso';
      }else if (value.text === 'Sunny') {
        con = 'Soleado';
      }else if (condicion.text === 'Thunderstorms') {
        con = 'Tormentas';
      }
        datos += '<td><ul>';
        var gradosmax = ((value.high - 32)*(5/9));
        gradosmax = gradosmax.toFixed(2);
        var gradosmin = ((value.low - 32)*(5/9));
        gradosmin = gradosmin.toFixed(2);
        datos += '<li>Temperatura Max: ' + gradosmax + '°' + '</li>';
        datos += '<li>Temperatura Min: ' + gradosmin + '°' + '</li>';
        datos += '<li>' + con + '</li>';
        datos += '</ul></td>';
    });
    datos += '</tbody>';
    datos += '</table>'
    $("#info4").html(datos);
  }).done(function() {
    // volviendo el nombre del btn a la normaluidad
    $("#btn-clima").val('Ver el Clima');
    // console.log('exito');
  });
}

function Departamentos(nombreDepa){
  //
  var expression = new RegExp(nombreDepa, "i");
  // se lee el JSON
  $.getJSON('js/departamentos.json', function(data) {
    // recorre todos los datos del JSON
    $.each(data.departamentos, function(key, value) {
      // hace una busqueda de la expresion si no hay arroja -1
      if(value.departamento.search(expression) != -1){
        $("#info").append('<li class="list-group-item link-class" id="'+ value.id +'">' + value.departamento + '</li>');
      }
    });
    clickDepartamento();
  });
}

function Provincias(id){
  // se lee el JSON
  $.getJSON('js/departamentos.json', function(data) {
    // recorre todos los datos del JSON
    var contentIdDepa  = [];
    var contentProvincias = [];
    $.each(data.departamentos, function(key, value) {
      contentIdDepa.push(data.departamentos[id].id);
      return (key == 1);
    });
    // console.log(contentIdDepa);
    $.each(data.departamentos, function(key, value) {
      if (key == contentIdDepa) {
        $.each(value.provincias, function(i, item) {
          // console.log(i);
          contentProvincias.push(item.provincia);
          $("#provincia").append('<option value="'+ i +'">' + item.provincia + '</option>');
        });
      }
    });
    // console.log(contentProvincias);
    clickProvincia();
  });
}

function Distritos(idDepa, idProv) {
  // se lee el JSON
  $.getJSON('js/departamentos.json', function(data) {
    // recorre todos los datos del JSON
    var contIdDepa  = [];
    var contIdProv  = [];
    var contProvincias = [];
    var contDistritos = [];
    // obteniendo el id del departamento
    $.each(data.departamentos, function(key, value) {
      contIdDepa.push(data.departamentos[idDepa].id);
      return (key == 1);
    });
    // obteniendo el id de la provincia
    $.each(data.departamentos, function(key, value) {
      if (key == contIdDepa) {
        $.each(value.provincias, function(i, item) {
          contIdProv.push(value.provincias[idProv].id);
          return (i == 1);
        });
      }
    });
    // mostrando los distritos
    $.each(data.departamentos, function(key, value) {
      if (key == contIdDepa) {
        $.each(value.provincias, function(i, item) {
          if (i == contIdProv) {
            $.each(item.distritos, function(index, el) {
              $("#distrito").append('<option value="'+ el.woeid +'">' + el.distrito + '</option>');
            });
          }
        });
      }
    });
  });
}

function clickDepartamento() {
  // obtener el id
  $("li").click(function() {
    id = $(this).attr('id');
    valor = $("#" + id).text();
    $("input[name='departamento']").val(valor);
    // reemplzando el nuevo id al campo de departamento
    $("input[name='departamento']").attr('id', id);
    $("#info").html("");
    // mostrando campos
    $("#nameProv").show('slow');
    $("#provincia").show('slow');
    // llamamos a la funcion de provincias cuando se da click
    Provincias(id);
  });
}

function clickProvincia(){
  $("select[name='provincia']").change(function() {
    var idDepa =   $("input[name='departamento']").attr('id');
    var idProv = $(this).val();
    Distritos(idDepa, idProv);
    $("#nameDist").show('slow');
    $("#distrito").show('slow');
    $('#btn-clima').show('slow');
  });
}
