class Map {

    constructor() {
        this.projection = d3.geoConicConformal().scale(150).translate([400, 350]);

    }

    clearMap() {


        d3.selectAll(".host").classed("host", false);
        d3.selectAll(".team").classed("team", false);

        d3.select("#winner").remove();
        d3.select("#runnerUp").remove();
    }



    updateMap(worldcupData) {


        this.clearMap();

  

        d3.select("#" + worldcupData.host_country_code).classed("host", true);

        for (let i = 0; i < worldcupData.teams_iso.length; ++i) {
            d3.select("#" + worldcupData.teams_iso[i]).classed("team", true);
        }



        d3.select("#points").append("circle")
            .attr("id", "winner")
            .attr("class", "gold")
            .attr("cx", this.projection(worldcupData.win_pos)[0])
            .attr("cy", this.projection(worldcupData.win_pos)[1])
            .attr("r", 10);

        d3.select("#points").append("circle")
            .attr("id", "runnerUp")
            .attr("class", "silver")
            .attr("cx", this.projection(worldcupData.ru_pos)[0])
            .attr("cy", this.projection(worldcupData.ru_pos)[1])
            .attr("r", 10);

    }


    drawMap(world) {

        let map = d3.select("#map");

        var geoPath = d3.geoPath().projection(this.projection);
        let geoJson = topojson.feature(world, world.objects.countries);
        

        d3.select("#map").selectAll("path")
            .data(geoJson.features)
            .enter()
            .append("path")
            .attr("d", geoPath)
            .attr("class", "countries")
            .attr("id", function(d) {return d.id;});

        let graticule = d3.geoGraticule();
        d3.select("#map").append("path")
            .datum(graticule)
            .attr("class", "grat")
            .attr('d', geoPath)
            .attr('fill', 'none');
    }


}
