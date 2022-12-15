class Table {

    constructor(teamData, treeObject) {

        this.tree = treeObject;

 
        this.tableElements = teamData.slice(0);

        this.teamData = teamData;

        this.tableHeaders = ["Delta Goals", "Result", "Wins", "Losses", "TotalGames"];

        this.cell = {
            "width": 70,
            "height": 20,
            "buffer": 15
        };

        this.bar = {
            "height": 20
        };

        this.goalsMadeHeader = 'Goals Made';
        this.goalsConcededHeader = 'Goals Conceded';


        this.goalScale = null; 

 
        this.gameScale = null; 


        this.aggregateColorScale = null; 

        this.goalColorScale = null; 
    }



    createTable() {



        var maxGoalsMade = d3.max(this.tableElements, function(d) { return d.value["Goals Made"]; } );
        var maxGamesPlayed = d3.max(this.tableElements, function(d) { return d.value["TotalGames"]; } );

        this.goalScale = d3.scaleLinear().domain([0,maxGoalsMade]).range([this.cell["buffer"], (this.cell["width"] * 2.0) - this.cell["buffer"]]); 
        this.gameScale = d3.scaleLinear().domain([0,maxGamesPlayed]).range([0, this.cell["width"]]); 
        this.aggregateColorScale = d3.scaleLinear().domain([0,maxGamesPlayed]).range([d3.rgb('#ece2f0'), d3.rgb('#016450')]); 
        this.goalColorScale = d3.scaleLinear().domain([0,maxGamesPlayed]).range([d3.rgb('#cb181d'), d3.rgb('#034e7b')]); 

        let goalScaleXAxis = d3.axisBottom();
        goalScaleXAxis.scale(this.goalScale);
        let goalHeaderSVG = d3.select("#goalHeader").append("svg");
        goalHeaderSVG.style("width", this.cell["width"] * 2.0);
        goalHeaderSVG.style("height", this.cell["height"]);

        goalHeaderSVG.call(goalScaleXAxis);

   

        let teamHeader = d3.select("#teamHeader");
        let goalsHeader = d3.select("#goalsHeader");
        let resultHeader = d3.select("#resultHeader");
        let winsHeader = d3.select("#winsHeader");
        let lossesHeader = d3.select("#lossesHeader");
        let totalGamesHeader = d3.select("#totalGamesHeader");

        this.teamsAssending = true;
        this.goalsAssending = true;
        this.resultsAssending = true;
        this.winsAssending = true;
        this.lossesAssending = true;
        this.totalGamesAssending = true;

        teamHeader.on("click", (d) => {
            this.collapseList();
            this.tableElements.sort(function(a, b) {
                var textA = a.key.toUpperCase();
                var textB = b.key.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });
            if (!this.teamsAssending) {
                this.tableElements = this.tableElements.reverse();
            }
            this.updateTable();
            this.teamsAssending = !this.teamsAssending;
        });

        goalsHeader.on("click", (d) => {
            this.collapseList();
            this.tableElements.sort(function(a, b) {
                return a.value["Delta Goals"] - b.value["Delta Goals"];
            });
            if (!this.goalsAssending) {
                this.tableElements = this.tableElements.reverse();
            }
            this.updateTable();
            this.goalsAssending = !this.goalsAssending;
        });

        resultHeader.on("click", (d) => {
            this.collapseList();
            this.tableElements.sort(function(a, b) {
                return a.value.Result.rank - b.value.Result.rank;
            });
            if (!this.resultsAssending) {
                this.tableElements = this.tableElements.reverse();
            }
            this.updateTable();
            this.resultsAssending = !this.resultsAssending;
        });

        winsHeader.on("click", (d) => {
            this.collapseList();
            this.tableElements.sort(function(a, b) {
                return a.value.Wins - b.value.Wins;
            });
            if (!this.winsAssending) {
                this.tableElements = this.tableElements.reverse();
            }
            this.updateTable();
            this.winsAssending = !this.winsAssending;
        });

        lossesHeader.on("click", (d) => {
            this.collapseList();
            this.tableElements.sort(function(a, b) {
                return a.value.Losses - b.value.Losses;
            });
            if (!this.lossesAssending) {
                this.tableElements = this.tableElements.reverse();
            }
            this.updateTable();
            this.lossesAssending = !this.lossesAssending;
        });

        totalGamesHeader.on("click", (d) => {
            this.collapseList();
            this.tableElements.sort(function(a, b) {
                return a.value.TotalGames - b.value.TotalGames;
            });
            if (!this.totalGamesAssending) {
                this.tableElements = this.tableElements.reverse();
            }
            this.updateTable();
            this.totalGamesAssending = !this.totalGamesAssending;
        });
    }



    updateTable() {
        let self = this;
        let gameScale = this.gameScale;
        let goalScale = this.goalScale;
        let aggregateColorScale = this.aggregateColorScale;
        let goalColorScale = this.goalColorScale;
        let updateTable = this.updateTable;

        // let tr = d3.select("tbody").selectAll("tr")
        //     .data(this.tableElements)
        //     .enter()
        //     .append('tr');

        let tr = d3.select("tbody").selectAll("tr").data(this.tableElements);
        tr.exit().remove();
        tr = tr.enter().append('tr').merge(tr);
        tr.on("mouseover", (d) => {
            this.tree.clearTree();
            this.tree.updateTree(d);
        })

        //     let bars = barGroup.data(this.allData);
        // // bars.exit().remove();
        // bars = bars.enter().append("rect").merge(bars);

        let th = tr.selectAll("th").data(function(d, i) {return [{'key': d.key, 'index': i, 'type': d.value.type}]});
        th = th.enter().append("th").merge(th);
        th = th.text(function(d){ return (d.type == "aggregate") ? d.key : 'x' + d.key;})
            .attr("class", function(d) { return d.type;})
            .on("click", function(d) {
                self.updateList(d.index);
            });
        th.exit().remove();




        
        let visType = ['goals', 'text', 'bar', 'bar', 'bar'];
        let td = tr.selectAll("td").data(function(d, i) { 
                let rowType = d.value.type;
                let goals = {
                    'type': rowType, 
                    'vis': 'goals',
                    'value': {
                        'Goals Made': d.value["Goals Made"],
                        'Goals Conceded': d.value["Goals Conceded"],
                        'Delta Goals': d.value["Delta Goals"]
                    }
                };
                let result = {
                    'type': rowType, 
                    'vis': 'text',
                    'value': d.value["Result"]["label"]
                };
                let wins = {
                    'type': rowType, 
                    'vis': 'bar',
                    'value': d.value["Wins"]
                };
                let losses = {
                    'type': rowType, 
                    'vis': 'bar',
                    'value': d.value["Losses"]
                };
                let totalGames = {
                    'type': rowType, 
                    'vis': 'bar',
                    'value': d.value["TotalGames"]
                };
                return [goals, result, wins, losses, totalGames]; 
            });
        td = td.enter().append("td").merge(td);


        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        let goalsTd = td.filter(function (d) {
            return d.vis == 'goals';
        });

        goalsTd.on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html("Goals Made: " + d.value["Goals Made"] + "</br> Goals Conceded: " + d.value["Goals Conceded"])
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
           })
         .on("mouseout", function(d) {
           div.transition()
                .duration(500)
                .style("opacity", 0);
           });

        goalsTd.select("svg").remove();
        goalsTd = goalsTd.append("svg")
            .style("width", this.cell["width"] * 2.0)
            .style("height", this.cell["height"]);


        goalsTd.append("rect")
            .attr("x", function(d) {return Math.min(goalScale(d.value["Goals Conceded"]), goalScale(d.value["Goals Made"]));})
            .attr("y", (d) => { return (d.type == "aggregate") ? this.cell["height"] / 4.0 : ( this.cell["height"] / 2.0) - (this.cell["height"] / 8.0); })
            .attr("height", (d) => { return (d.type == "aggregate") ? this.cell["height"] / 2.0 : this.cell["height"] / 4.0;})
            .attr("width", function(d) {
                    return Math.max(goalScale(d.value["Goals Conceded"]), goalScale(d.value["Goals Made"])) 
                    - Math.min(goalScale(d.value["Goals Conceded"]), goalScale(d.value["Goals Made"]));
                })
            .style("fill", function(d) { return (d.value["Delta Goals"] > 0) ?  "#6594b0" : "#e27375";});

        goalsTd.append("circle")
            .attr("cx", function(d) {return goalScale(d.value["Goals Conceded"]);})
            .attr("cy", this.cell["height"] / 2.0)
            .attr("class", "goalCircle")
            .style("fill", function(d) {
                if (d.type == "aggregate")
                    return (d.value["Delta Goals"] != 0) ? "#cd1311" : "#808080";
                else return "white";
            }).style("stroke", (d) => {
                if (d.type != "aggregate")
                    return (d.value["Delta Goals"] != 0) ? "#cd1311" : "#808080";
                else return "none";
            });

        goalsTd.append("circle")
            .attr("cx", function(d) {return goalScale(d.value["Goals Made"]);})
            .attr("cy", this.cell["height"] / 2.0)
            .attr("class", "goalCircle")
            .style("fill", function(d) {
                if (d.type == "aggregate")
                    return (d.value["Delta Goals"] != 0) ? "#004d7d" : "#808080";
                else return "white";
            }).style("stroke", (d) => {
                if (d.type != "aggregate")
                    return (d.value["Delta Goals"] != 0) ? "#004d7d" : "#808080";
                else return "none";
            });


        let textTd = td.filter(function (d) {
                return d.vis == 'text';
            })
            .style("width", (2.0 * this.cell["width"]) + "px")
            .text(function(d) {return d.value;});

        let barsTd = td.filter(function (d) {
                return d.vis == 'bar';
            });
        barsTd.select("svg").remove();
        barsTd = td.filter(function (d) {
                return d.vis == 'bar' && d.type == 'aggregate';
            });
        barsTd = barsTd.append("svg")
            .style("width", this.cell["width"])
            .style("height", this.cell["height"]);

        barsTd.append("rect")
            .attr("height", this.cell["height"])
            .attr("width", function(d) {return gameScale(d.value);})
            .style("fill", function(d) { return aggregateColorScale(d.value);});

        barsTd.append("text")
            .attr("x", function(d) {return gameScale(d.value) - 10;})
            .attr("y", this.cell["height"] / 2.0 + 5)
            .style("fill", "white")
            .text(function(d) {return d.value;});

        td.exit().remove();


    };



    updateList(i) {

        let row = this.tableElements[i];
        
        if (row.value.type != "aggregate") return;

        let nextRow = this.tableElements[i + 1];
        if (nextRow == null || nextRow.value.type == "aggregate") {
            let games = row.value.games.slice(0);
            Array.prototype.splice.apply(this.tableElements, [i + 1, 0].concat(games));
        } 
        else {
            let games = row.value.games;
            this.tableElements.splice(i+1, games.length);
        }
        
        this.updateTable();
    }


    collapseList() {
        
        this.tableElements = this.teamData.slice(0);

    }


}
