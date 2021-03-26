require('dotenv').config()

const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");





const main = async() => {

    const busqueda = new Busquedas();
    let opt;

    do {

        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                //mostrar mensaje
                const entrada = await leerInput('Ciudad: ');
                //buscar lugares
                const lugares = await busqueda.ciudad(entrada);
                //seleccionar lugar
                const id = await listarLugares(lugares);
                if (id === '0') continue; 
                //guardar en db
                const lugarSel = lugares.find( l => l.id === id);
                busqueda.agregarHistorial( lugarSel.nombre );
                //datos del clima al lugar 
                const clima = await busqueda.clima(lugarSel.lat, lugarSel.long);
                //mostrar resultado
                console.log('\n Informacion de la ciudad \n'.green);
                console.log('Cidudad: ',lugarSel.nombre.green);
                console.log('Latitud: ',lugarSel.lat);
                console.log('Longitud: ',lugarSel.long);
                console.log('Descripcion: ', clima.desc.green);
                console.log('Temperatura: ', clima.temp);
                console.log('Maxima: ', clima.max);
                console.log('Minima: ', clima.min);

                break;

            case 2:
                busqueda.historialCapitalizado.forEach( (lugar, i) => {
                    const idx = `${i + 1}.`.green;
                    console.log(`${ idx } ${ lugar }`);
                });
                break;
        }


        if (opt !== 0) await pausa();

    } while (opt !== 0);

}


main();
