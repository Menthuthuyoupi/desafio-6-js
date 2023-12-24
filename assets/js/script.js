const apiUrl = "https://mindicador.cl/api/";

async function MonedasDeCambio(url){
    try{
        const monedasApi = await fetch(url);                                                                            //texto plano
        const monedasApiJson = await monedasApi.json();                                                                 //objeto
        const monedasYdatos = Object.entries(monedasApiJson).splice(3, Object.entries(monedasApiJson).length - 8);      //array de array de propiedad(moneda) y su valor objeto
        monedasYdatos.splice(5,1)
        const monedas = [];
        monedasYdatos.forEach((coin) => {
            monedas.push(coin[0]);
        });

        return [monedas,monedasYdatos];
        
    } catch(error){
        console.log(error)
    }
}

//la funcion MonedasDeCambio retorna 2 arreglos, 1 arreglo de las monedas, y otro es un arreglo de arreglos de los datos de la moneda

async function selectMonedas(){
    const coin = await MonedasDeCambio(apiUrl);
    const selectedCoin = document.getElementById('selectedCoin');
    coin[1].forEach((monedas) =>{
        const optionCoin = document.createElement('option');
        optionCoin.innerHTML = monedas[1].nombre;
        selectedCoin.appendChild(optionCoin);
    })
    
}

//la funcion selectMonedas hace el renderizado del select son sus respestivas monedasde cambio

const verificar = document.querySelector('#boton');

verificar.addEventListener('click',async () => {
    const numeroInput = document.querySelector('#numero').value;
    const opcion = document.querySelector('#selectedCoin');

    if(numeroInput === "" || opcion.value === "elegir una opction"){
        alert("INGRESE UN NUMERO PORFAVOR Y ELIGA UNA OPCION");
    }else{
        const coin = await MonedasDeCambio(apiUrl);
        coin[1].forEach((dato) => {
            if(dato[1].nombre === opcion.value){
                let monedaConvertida = numeroInput/(dato[1].valor);
                const resultado = document.querySelector('#resultado');
                resultado.innerHTML = monedaConvertida;
                renderGraph(dato[1].codigo);
            }
        })

    }
})

//verificar, este verifica si el input es un numero y si hay una opcion escogida, en caso de que todo se cumple, muestra el resultado y la grafica


async function datosCoordenadas(arreglo){
    const coor = [];
    arreglo.forEach((dato) => {
        const objetoCoordenada = {
            x: dato.fecha, 
            y: dato.valor
        }
        coor.unshift(objetoCoordenada);
    });
    return coor;
}

//la funcion datosCoordenadas retorna un arreglo de objetos con fecha y valor

const renderGraph = async (codigo) => {
    const info = `https://mindicador.cl/api/${codigo}`;
    var grafico = document.getElementById('grafico');

    try {
        const series = await fetch(info);   
        const seriesJson = await series.json();
        var coordenadas = await datosCoordenadas(seriesJson.serie);
        var dataset = new vis.DataSet(coordenadas);
        var limites = {
            start: coordenadas[0].x,
            end: coordenadas[coordenadas.length-1].x
        };
        grafico.innerHTML = "";
        var graph2d = new vis.Graph2d(grafico, dataset, limites);

    } catch (error) {
        console.log(error)
    }   
}

// rendergraph crea la grafica


function valideKey(eventoInput){          
    var code = (eventoInput.which) ? eventoInput.which : eventoInputt.keyCode;
    
    if(code==8) {
      return true;
    } else if(code>=48 && code<=57) { // is a number.
      return true;
    } else{   // other keys.
      return false;
    }
}

//buscado en internet
//funcion que no deja poner letras, o otros caracteres que no sean numeros
  
selectMonedas();