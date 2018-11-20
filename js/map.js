/**
 * Created by Chris on 11/16/2018.
 */

class Map {
    constructor(){
        this.projection = d3.geoConicEqualArea()
            //.rotate([-3.44, -55.37]);
        this.geoGen = d3.geoPath().projection(this.projection);
    }

    draw(world){
        let map = d3.select('#map');
        let colonies = topojson.feature(world, world.objects.countries);
        let isos = window.dataSet.map(x => x.key);

        colonies.features = colonies.features.filter(x => isos.includes(x.id));

        // Draw colonies
        map.select("#colonies").selectAll("path")
            .data(colonies.features)
            .enter()
            .append("path")
            .attr("id", d => d.id)
            .classed("colony", true)
            .attr('d', this.geoGen);

        // Draw continents
        d3.json("./data/continents.json").then(continents => {
            map.select("#continents").selectAll("path")
                .data(continents.features)
                .enter()
                .append("path")
                .attr("id", d => d.id)
                .classed("continent", true)
                .attr('d', this.geoGen);
        });


        // Draw graticule
        map.append("path")
            .attr('d', this.geoGen(d3.geoGraticule()()))
            .classed("grat", true)
    }
}