const { default: axios } = require("axios");


class Busquedas {

    historial = ['Tegucigalpa', 'Buenos Aires', 'Madrid']

    constructor() {
        //TODO leer base de datos
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

}

module.exports = Busquedas;