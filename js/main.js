/**
 * Created by Chris on 11/15/2018.
 */

$('document').ready(()=>{
    // Load the JSON to convert between country codes and names
    d3.json("data/iso3.json").then(d => {
        // lut is the lookup table for ISO code => name
        let lut = {};
        for(let i in d){
            item = d[i]
            lut[item["alpha-3"]] = {name: item["name"], alpha2: item["alpha-2"]};
        }
        window.isoConverter = new IsoConverter(lut);
    });

    d3.csv("data/extended_trading.csv", d => {
        d.year = +d.year;
        d.flow = +d.flow;
        d.indepdate = +d.indepdate;
        return d;
    }).then(data => {
        //Nest the data by year, and both trading partners
        let dNested = d3.nest()
            .key(x => x.year)
            .key(x => x.iso_o)
            .key(x => x.iso_d)
            .object(data);

        window.extendedTrading = dNested;
        window.map.updateYear(1948);
    });

    d3.csv("data/primary_colonies.csv", d => {
        d.year = +d.year;
        d.flow = +d.flow;
        d.indepdate = +d.indepdate;
        return d;

    }).then(data => {
        let dNested = d3.nest()
            .key(x => x.iso_o)
            .key(x => x.iso_d)
            .entries(data);

        window.dataSet = dNested;
        window.map = new Map();
        d3.json("data/world.json").then(world =>{
            map.draw(world);
        });

        window.slider = new Slider();
        slider.draw();
        window.details = new Details();
        window.timeline = new Timeline();
    })
});
