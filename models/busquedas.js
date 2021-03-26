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
            'language' : 'es'
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
            }))
            
        } catch (error) {
            console.log(error.response);
            return [];
        }

    }

}

module.exports = Busquedas;