/**
 * Created by Chris on 11/15/2018.
 */

$('document').ready(()=>{
    d3.csv("data/gbr_family.csv", d => {
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
        console.log(map);
        d3.json("data/world.json").then(world =>{
            map.draw(world)
        })
    })
});
