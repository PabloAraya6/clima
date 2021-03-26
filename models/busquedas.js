const fs = require('fs');
const { default: axios } = require("axios");


class Busquedas {

    // historial = ['Tegucigalpa', 'Buenos Aires', 'Madrid'];
    historial = [];
    dbPath = './db/database.json';

    constructor() {
        this.leerDB();
    }

    get historialCapitalizado(){
        return this.historial.map( lugar => {
            let palabras =  lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1));
            return palabras.join(' ');
        })
    }

    get paramsMapbox() {
        return {
            'access_token' : process.env.MAPBOX_KEY,
            'limit' : 5,
            'language' : 'es',
        }
    }

    get paramsOpenWeather() {
        return {
            'appid' : process.env.OPENWEATHER_KEY,
            'lang' : 'es',
            'units' : 'metric',
        }
    }

    async ciudad ( lugar = '') {
        try {
            //peticion http
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox,
            });
    
            const resp = await instance.get();

            return resp.data.features.map( lugar => ({
                id : lugar.id,
                nombre : lugar.place_name,
                long: lugar.center[0],
                lat: lugar.center[1],
            }));
            
        } catch (error) {
            console.log(error.response);
            return [];
        }

    }
    
    async clima ( lat , lon ) {

        try {

            const instance1 = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params: {lat, lon, ... this.paramsOpenWeather},
            });
            const resp = await instance1.get();
            const {weather, main} = resp.data
            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp,
            };

        } catch (error) {
            console.log(error.response);
            return [];
        }

    }

    agregarHistorial ( lugar = '') {
        //prevent duplicate
        if( this.historial.includes(lugar.toLocaleLowerCase()) ){
            return;
        } 

        this.historial.unshift(lugar.toLocaleLowerCase());
        this.guardarDB();

    }

    guardarDB() {

        const payload = {
            historial : this.historial
        };

        fs.writeFileSync(this.dbPath, JSON.stringify(payload), function (err){
            if (err) throw err;
            console.log("It's saved!");
        });

    }

    leerDB() {
        if ( !fs.existsSync( this.dbPath ) ) return;

        const info = fs.readFileSync( this.dbPath, {encoding: 'utf-8'});
        const data = JSON.parse(info);
        this.historial = data.historial;
    }

}

module.exports = Busquedas;