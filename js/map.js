/**
 * Created by Chris on 11/16/2018.
 */

class Map {
    constructor() {
        this.projection = d3.geoNaturalEarth1()
            .rotate([-3.44, -55.37]);
        this.geoGen = d3.geoPath().projection(this.projection);
        //this.selected = null;
        this.isos = window.dataSet.map(x => x.key);
    }

    draw(world) {
        let map = d3.select('#map');
        let colonies = topojson.feature(world, world.objects.countries);

        colonies.features = colonies.features.filter(x => this.isos.includes(x.id));

        // Draw graticule
        map.select("#grat").append("path")
            .attr('d', this.geoGen(d3.geoGraticule()()));

        // Globe coordinates
        let globe = {
            "type": "Sphere",
            "coordinates": [
                [[-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90]]
            ]
        };

        // Draw globe
        map.select("#globe")
            .append("path")
            .attr('d', this.geoGen(globe))
            .attr("id", "globe-path");

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

            this.updateYear(1948);
        });
        this.drawTradeLinks();
    }

    drawTradeLinks() {
        // Unpack the country centroids
        d3.csv("./data/country_centroids_az8.csv", d => {
            d.latitude = +d.Latitude;
            d.longitude = +d.Longitude;
            d.id = d["adm0_a3_is"];

            return d;
        }).then(centroids => {
            // Use properties of centroids: id, latitude, longitude.

            // Filter to relevant countries
            centroids = centroids.filter(x => this.isos.includes(x.id));

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

            // Draw the arcs
            d3.select("#trade-arcs")
                .selectAll("path")
                .data(arcs)
                .enter()
                .append("path")
                .attr('id', d => {
                    return d.id + "-arc"
                })
                .attr('d', this.geoGen)
                .classed("trade-arc", true)
                .on("mouseover", this.handleMouseOver)
                .on("mouseout", this.handleMouseOut)
                .on("click", this.selectColony);
        });
    }

    // Highlight a country on mouse out of the arc or feature
    handleMouseOver(d, i) {
        d3.select('#' + d.id).classed("colony-hover", true);
        d3.select('#' + d.id + "-arc").classed("arc-hover", true);
    };

    // Un-highlight a country on mouse out of the arc or feature
    handleMouseOut(d, i) {
        d3.select('#' + d.id).classed("colony-hover", false);
        d3.select('#' + d.id + "-arc").classed("arc-hover", false);
    };

    // Select the clicked colony.
    selectColony(d, i) {
        // Remember whether we are selecting or deselecting
        let toggled = !d3.select("#" + d.id).classed("colony-selected");
        d3.selectAll(".colony").classed("colony-selected", false);
        d3.selectAll(".trade-arc").classed("arc-selected", false);
        d3.select("#" + d.id).classed("colony-selected", toggled);
        d3.select("#" + d.id + "-arc").classed("arc-selected", toggled);

        // Send the selection to the details panel
        window.timeline.updateCountry(d.id);
        window.details.selectCountry(d.id);
    }

    updateYear(year) {
        d3.selectAll(".colony")
            .classed("current-colony", d => {
                let entry = window.extendedTrading[year]["GBR"][d.id];
                if (entry) {
                    let colCur = entry[0]["col_cur"];
                    return colCur === "1";
                }

                // No trade entry found for this year. Try 2000 reference.
                else {
                    entry = window.extendedTrading[2000]["GBR"][d.id];
                    if (entry) {
                        let indepDate = entry[0]["indepdate"];
                        if (year <= indepDate) return true;
                    }
                }

                // Couldn't find either entry. If they are included in the colonial list,
                // but do not have an independence date, they are likely still colonies.
                return true;
            })
    }

}