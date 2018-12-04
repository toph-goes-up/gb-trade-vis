/**
 * Created by Tophski on 12/1/2018.
 */

class Timeline {
    constructor() {
        this.selectedCountry = "";
        this.data = [];
        this.year = null;

        this.xScale = d3.scaleLinear()
            .domain([1948, 2006])
            .range([0, 600]);

        // Initialize y scale. This gets updated when a country is selected.
        this.yScale = d3.scaleLog()
            .domain([.05, 5])
            .range([195, 0])
            .clamp(true);

        this.area = d3.area()
            //.curve(d3.curveCardinal)
            .x1(d => {return this.xScale(d.year);})
            .y1(d => {return this.yScale(d.totalFlow);})
            .x0(d => {return this.xScale(d.year);})
            .y0(d => {return this.yScale(0);});

        this.yAxis = d3.axisRight()
            .scale(this.yScale)
            .ticks(7, ".1n");

        d3.select("#timeline-svg")
            .append("g")
            .call(this.yAxis)
            .attr("id", "timeline-y-axis")
    }

    updateChart(){
        // Update the timeline chart path.
        d3.select("#timeline-chart").attr('d', this.area(Object.values(this.data)));

        // Get the independence date of the selected country from GBR.
        // 1990 is used as an arbitrary reference year.
        let indepDate = window.extendedTrading[1990]["GBR"][this.selectedCountry][0]["indepdate"];
        d3.select("#indep-line")
            .attr("x1", (this.xScale(indepDate)))
            .attr("y1", (0))
            .attr("x2", (this.xScale(indepDate)))
            .attr("y2", (200));

        this.yAxis.scale(this.yScale);

        d3.select("#timeline-y-axis")
            .transition(50)
            .call(this.yAxis)
    }

    getSurplus(){
        if(this.data && this.year) {
            let a = this.data.find(o => {
                return this.year.toString() === o.year
            });
            return a.totalFlow;
        }
        else return null;
    }

    updateData(){
        // Min and max flows. I'm already iterating the data, the min/max lookup
        // is computationally free here and only a few lines of code.
        let min = 1000;
        let max = 0;

        // Update this.data, tracking min and max to update the scale.
        this.data = Object.entries(window.extendedTrading).map(d => {
            let year = d[0];
            let exports = undefined;
            let imports = undefined;
            let totalFlow = undefined;

            try {
                exports = d[1][this.selectedCountry]["GBR"][0]["flow"];
                imports = d[1]["GBR"][this.selectedCountry][0]["flow"];

                // As in the paper, trade flows are normalized against a reference relationship.
                // This puts the flow values in context for a given year.
                let fr2gb = d[1]["FRA"]["GBR"][0]["flow"];
                let gb2fr = d[1]["GBR"]["FRA"][0]["flow"];

                totalFlow = (exports + imports) / (fr2gb + gb2fr);

                // Update min and max.
                if(totalFlow > max) max = totalFlow;
                // This is being used on the min for a log scale, so filter out zeroes.
                if(totalFlow < min && totalFlow > 0) min = totalFlow;
            }
            catch(err){
                if(err.name === "TypeError"){
                    totalFlow = 0;
                }
            }
            return {year: year, totalFlow: totalFlow}
        });
        //These are to stretch the ends of the background gradient.
        this.data.push({year: 2007, totalFlow: 1000});
        this.data.push({year: 2008, totalFlow: -1000});
        this.data.push({year: 2009, totalFlow: 0});

        // Update scale with new min and max
        this.yScale = d3.scaleLog()
            .domain([min, max])
            .range([200, 0])
            .clamp(true);
    }

    updateCountry(country){
        this.selectedCountry = country;
        this.updateData();
        this.updateChart();
    }

    updateYear(year){
        this.year = year;

        d3.select("#year-line")
            .attr("x1", (this.xScale(this.year)))
            .attr("y1", (0))
            .attr("x2", (this.xScale(this.year)))
            .attr("y2", (200));
    }
}