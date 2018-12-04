/**
 * Created by Tophski on 11/30/2018.
 */

class Slider {
    constructor(){

    }

    draw(){
        let slider = d3.sliderHorizontal()
            .min(1948)
            .max(2006)
            .step(1)
            .width(600)
            //.displayValue(true)
            .on("onchange", year => {
                d3.select("#big-year")
                    .text(year);

                d3.select("#slider-value")
                    .text(year);

                window.timeline.updateYear(year);
                window.details.updateYear(year);
                window.map.updateYear(year);
            });

        d3.select("#slider")
            .attr("width", 800)
            .attr("height", 100)
            .append("g")
            .attr("transform", "translate(170, 30)")
            .call(slider);
    }
}