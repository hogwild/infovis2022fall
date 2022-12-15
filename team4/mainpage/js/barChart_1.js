class BarChart {


    constructor(worldMap, infoPanel, allData) {
        this.worldMap = worldMap;
        this.infoPanel = infoPanel;
        this.allData = allData;
    }

    updateBarChart(selectedDimension) {

        let yMin = 0;
        let yMax = d3.max(this.allData, d => d[selectedDimension]);

        let xr1 = 60;
        let xr2 = 490;
        let yr1 = 10;
        let yr2 = 330;

        let xScale = d3.scaleBand()
            .domain(this.allData.map(d => d.year))
            .range( [xr2, xr1]);
        let yScaleReversed = d3.scaleLinear()
            .domain( [yMin, yMax])
            .range([yr2, yr1]).nice();
        let yScale = d3.scaleLinear()
            .domain( [yMin, yMax])
            .range([yr1, yr2]).nice();



        let colorScale = d3.scaleLinear()
            .domain([yMin, yMax])
            .range(["lightgray", "steelblue"]);

        let xAxis = d3.axisBottom().scale(xScale);
        let yAxis = d3.axisLeft().scale(yScaleReversed);
        
        d3.select("#xAxis")
            .attr("transform", "translate(0," + yr2 + ")")
            .transition().duration(2004)
            .call(xAxis)
            .selectAll("text")
            .attr("y", 0)
            .attr("x", -45)
            .attr("dy", ".35em")
            .attr("transform", "rotate(270)")
            .style("text-anchor", "start");

        d3.select("#yAxis")
            .attr("transform", "translate(" + (xr1 - 1) + ", 0)")
            .transition().duration(2004).call(yAxis);


        let barGroup = d3.select("#bars").selectAll("rect");
        d3.select("#bars").attr("transform", "scale(1, -1) translate(0, -330)");
        let bars = barGroup.data(this.allData);
        bars = bars.enter().append("rect").merge(bars);
        
        bars.attr("width", xScale.step())
            .attr("x", function (d, i) { return xScale(d.year) })
            .merge(bars);

        bars.transition().duration(2004)
            .attr("height", d => yScale(d[selectedDimension]))
            .style("fill", function (d) {
                    return colorScale(d[selectedDimension]);
                });



        bars.on("mouseover", function(d) {
              d3.select(this).style("fill", "red").style("cursor", "pointer");
              window.barChart.worldMap.updateMap(d);
              window.barChart.infoPanel.updateInfo(d);
            })
            .on("mouseout", function(d) {
              d3.select(this).style("fill", colorScale(d[selectedDimension])).style("cursor", "default");
            })
            .on("click", function(d) {
                
                let a = (2022-d.year) / 4;
                window.open('http://127.0.0.1:550'+a+'/'+d.year+'.html');
            })
            .on("touch", function(d) {
                window.barChart.worldMap.updateMap(d);
                window.barChart.infoPanel.updateInfo(d);
            });
    }
}