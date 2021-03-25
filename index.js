

const { leerInput, inquirerMenu, pausa } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");





const main = async() => {

    const busqueda = new Busquedas();
    let opt;

    do {

        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                //mostrar mensaje
                const lugar = await leerInput('Ciudad: ');
                console.log(lugar);
                a = await busqueda.ciudad(lugar);

                //buscar lugares
                
                //seleccionar lugar
                
                //datos del clima al lugar 
                
                //mostrar resultado
                console.log('\n Informacion de la ciudad \n'.green);
                console.log('Cidudad: ');
                console.log('Lat: ');
                console.log('Long: ');
                console.log('Temperatura: ');
                console.log('Maxima: ');
                console.log('Minima: ');

                break;
        }


        if (opt !== 0) await pausa();

    } while (opt !== 0);

}


main();
