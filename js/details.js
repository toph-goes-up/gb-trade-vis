/**
 * Created by Tophski on 11/30/2018.
 */

class Details {
    constructor() {
        this.year = 1948;
        this.selectedCountry = null;
    }

    // Update the year, as well as appropriate views
    updateYear(year) {
        this.year = year;
        this.updatePartners();
        this.updateInfo();
    }

    // Select a new country and update appropriate views
    selectCountry(country) {
        this.selectedCountry = country;
        let name = window.isoConverter.alpha3ToName(country);
        d3.select("#title-country")
            .text(name)
            .style("font-size", name.length < 30 ? "2em" : "1.5em");

        let imageurl = "./data/flags/" + window.isoConverter.alpha3ToAlpha2(country) + ".png";
        d3.select("#title-flag")
            .attr("src", imageurl.toLowerCase());

        this.updatePartners();
        this.updateInfo();
    }

    updateInfo(){
        // Check if there is a current entry for this country
        if (!window.extendedTrading[this.year][this.selectedCountry]) return;

        // anyPartner is an arbitrary country that is used here to access the GDP.
        // This is necessary since GDP is stored under a destination country, and there
        // is no country that has a trading relationship in every year with every country.
        let anyPartner = Object.keys(window.extendedTrading[this.year][this.selectedCountry])[0];
        let gdp = window.extendedTrading[this.year][this.selectedCountry][anyPartner][0].gdp_o;

        // Check if the GDP is known for the selection
        if(gdp === "") gdp = "N/A";
        // Make a compact view of the GDP using M for millions, B for billions, T for trillions.
        else if(gdp >= 1000000) gdp = "$" + d3.format(".3n")(gdp / 1000000) + "T";
        else if(gdp >= 1000) gdp = "$" + d3.format(".3n")(gdp / 1000) + "B";
        else gdp = "$" + d3.format(".3n")(gdp) + "M";
        d3.select("#gdp")
            .text(gdp);

        // Population is expressed in millions. Retrieve, format, and display the population.
        // Added a population category for billions. Thanks a lot India.
        let pop = window.extendedTrading[this.year][this.selectedCountry]["GBR"][0].pop_o;
        if(pop === "") pop = "N/A";
        else if(pop >= 1000) pop = d3.format(".3n")(pop / 1000) + "B";
        else pop = d3.format(".3n")(pop) + "M";
        d3.select("#pop")
            .text(pop);

        // GDP per capita is represented in current USD
        let gdpcap = window.extendedTrading[this.year][this.selectedCountry]["GBR"][0].gdpcap_o;
        if(gdpcap === "") gdpcap = "N/A";
        else gdpcap = "$" + d3.format(",.0f")(gdpcap);
        d3.select("#gdpcap")
            .text(gdpcap);

        // 1990 used as reference year to retrieve independence date.
        let indepDate = window.extendedTrading[1990]["GBR"][this.selectedCountry][0]["indepdate"];
        if (indepDate === 0) indepDate = "N/A";
        d3.select("#indep-date")
            .text(indepDate);

        // Is the country currently a colony? Set the data box.
        let entry = window.extendedTrading[this.year]["GBR"][this.selectedCountry];
        let colCur = null;
        if(entry) colCur = entry[0]["col_cur"];
        if(colCur === "1") colCur = "YES";
        // Maybe there's no entry for the year. Try to fall back on using the indepDate.
        else {
            if(this.year <= indepDate) colCur = "YES";
            else colCur = "NO";
        }
        d3.select("#col-cur")
            .text(colCur);

        // What is the current trade totalFlow?
        let flow = window.timeline.getFlow();
        if (flow !== null) flow = d3.format(".5n")(flow);
        else flow = "N/A";
        d3.select("#trade-flow")
            .text(flow);
    }

    // Update the trading partners panel
    updatePartners() {
        // Set the top trading partners for the selected country.
        let partners = this.getTopTradingPartners();
        for (let i = 0; i < 3; i++) {
            let imageurl = "";
            if (!partners) imageurl = "";
            else imageurl = "./data/flags/" + window.isoConverter.alpha3ToAlpha2(partners[i]) + ".png";

            let flag = d3.select("#partner" + i);

            if (!partners) flag.select("span").text("");
            else flag.select("span")
                .text((i+1).toString() + ". " + partners[i]);

            flag.select("img")
                .attr("src", imageurl.toLowerCase())
        }
    }

    // Return the top trading partners for the current year and country
    getTopTradingPartners() {
        let country = this.selectedCountry;
        let year = this.year;
        let partners = window.extendedTrading[year][country];
        if (!partners) return null;

        partners = Object.keys(partners);

        let flowSums = partners.map(partner => {
            let imports = 0;
            let exports = 0;

            if (window.extendedTrading[year][country][partner])
                exports = window.extendedTrading[year][country][partner][0]["flow"];

            if (window.extendedTrading[year][partner][country])
                imports = window.extendedTrading[year][partner][country][0]["flow"];

            let sum = imports + exports;

            return {partner: partner, flowSum: sum}
        });

        flowSums.sort((a, b) => {
            return b.flowSum - a.flowSum
        });

        return [flowSums[0].partner, flowSums[1].partner, flowSums[2].partner]
    }
}