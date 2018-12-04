/**
 * Created by Tophski on 11/30/2018.
 */

class IsoConverter{
    constructor(data){
        this.data = data;
    }

    alpha3ToAlpha2(iso){
        try {
            return this.data[iso].alpha2;
        }
        catch(err){
            console.log("ISO alpha 2 lookup failed for " + iso);
        }
    }

    alpha3ToName(iso){
        try {
            return this.data[iso].name;
        }
        catch(err){
            console.log("ISO name lookup failed for " + iso);
        }
    }
}