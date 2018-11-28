/**
 * Created by Chris on 11/16/2018.
 */

class Map {
    constructor() {
        this.projection = d3.geoNaturalEarth1()
            .rotate([-3.44, -55.37]);
        this.geoGen = d3.geoPath().projection(this.projection);
        this.selected = null;
    }

    draw(world) {
        let map = d3.select('#map');
        let colonies = topojson.feature(world, world.objects.countries);
        let isos = window.dataSet.map(x => x.key);

        colonies.features = colonies.features.filter(x => isos.includes(x.id));

        // Draw graticule
        map.select("#grat").append("path")
            .attr('d', this.geoGen(d3.geoGraticule()()));

        // Draw empty globe
        let globe = {
            "type": "Sphere",
            "coordinates": [
                [[-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90]]
            ]
        };
        map.select("#globe")
            .append("path")
            .attr('d', this.geoGen(globe))
            .style("fill", "#9bbff4");

        // Draw continents
        d3.json("./data/continents.json").then(continents => {
            map.select("#continents").selectAll("path")
                .data(continents.features)
                .enter()
                .append("path")
                .attr("id", d => d.id)
                .classed("continent", true)
                .attr('d', this.geoGen);

            // Draw colonies
            map.select("#colonies").selectAll("path")
                .data(colonies.features)
                .enter()
                .append("path")
                .attr("id", d => d.id)
                .classed("colony", true)
                .attr('d', this.geoGen)
                .on("mouseover", this.handleMouseOver)
                .on("mouseout", this.handleMouseOut)
                .on("click", this.selectColony);
        });
        console.log(window.dataSet)
        this.drawTradeLinks();
    }

    drawTradeLinks() {
        d3.csv("./data/country_centroids_az8.csv", d => {
            d.latitude = +d.Latitude;
            d.longitude = +d.Longitude;
            d.id = d["adm0_a3_is"];

            return d;
        }).then(centroids => {
            // Use properties of centroids: id, latitude, longitude.

            // Filter to relevant countries
            let isos = window.dataSet.map(x => x.key);
            centroids = centroids.filter(x => isos.includes(x.id));

            // Shortcut for the GBR item
            let gbr = centroids.find(x => x.id === "GBR");

            // Create arc pairs
            let arcs = centroids.map(x => {
                return {
                    id: x.id,
                    type: "LineString",
                    coordinates: [
                        [x.longitude, x.latitude],
                        [gbr.longitude, gbr.latitude]
                    ]
                }
            });

            d3.select("#trade-arcs")
                .selectAll("path")
                .data(arcs)
                .enter()
                .append("path")
                .attr('id', d => {return d.id + "-arc"})
                .attr('d', this.geoGen)
                .classed("trade-arcs", true)
                .on("mouseover", this.handleMouseOver)
                .on("mouseout", this.handleMouseOut)
                .on("click", this.selectColony);
        });
    }

    // Highlight a country on mouse out of the arc or feature
    handleMouseOver(d, i){
        d3.select('#' + d.id).classed("colony-hover", true);
        d3.select('#' + d.id + "-arc").classed("arc-hover", true);
    };

    // Un-highlight a country on mouse out of the arc or feature
    handleMouseOut(d, i){
        d3.select('#' + d.id).classed("colony-hover", false);
        d3.select('#' + d.id + "-arc").classed("arc-hover", false);
    };

    // Select the clicked colony.
    selectColony(d, i) {
        console.log(d.id)
        let toggled = !d3.select("#" + d.id).classed("colony-selected");
        d3.selectAll(".colony").classed("colony-selected", false);
        d3.select("#" + d.id).classed("colony-selected", toggled);
    }

}