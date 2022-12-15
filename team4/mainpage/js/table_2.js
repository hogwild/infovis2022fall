/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(teamData, treeObject) {

        //Maintain reference to the tree Object; 
        this.tree = treeObject;

        // Create list of all elements that will populate the table
        // Initially, the tableElements will be identical to the teamData
        this.tableElements = teamData.slice(0);

        ///** Store all match data for the 2014 Fifa cup */
        this.teamData = teamData;

        //Default values for the Table Headers
        this.tableHeaders = ["Delta Goals", "Result", "Wins", "Losses", "TotalGames"];

        /** To be used when sizing the svgs in the table cells.*/
        this.cell = {
            "width": 70,
            "height": 20,
            "buffer": 15
        };

        this.bar = {
            "height": 20
        };

        /** Set variables for commonly accessed data columns*/
        this.goalsMadeHeader = 'Goals Made';
        this.goalsConcededHeader = 'Goals Conceded';

        /** Setup the scales*/
        this.goalScale = null; 

        /** Used for games/wins/losses*/
        this.gameScale = null; 

        /**Color scales*/
        /**For aggregate columns  Use colors '#ece2f0', '#016450' for the range.*/
        this.aggregateColorScale = null; 

        /**For goal Column. Use colors '#cb181d', '#034e7b'  for the range.*/
        this.goalColorScale = null; 
    }


    /**
     * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
     * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
     *
     */
    createTable() {


        // ******* TODO: PART II *******

        //Update Scale Domains
        var maxGoalsMade = d3.max(this.tableElements, function(d) { return d.value["Goals Made"]; } );
        var maxGamesPlayed = d3.max(this.tableElements, function(d) { return d.value["TotalGames"]; } );

        this.goalScale = d3.scaleLinear().domain([0,maxGoalsMade]).range([this.cell["buffer"], (this.cell["width"] * 2.0) - this.cell["buffer"]]); 
        this.gameScale = d3.scaleLinear().domain([0,maxGamesPlayed]).range([0, this.cell["width"]]); 
        this.aggregateColorScale = d3.scaleLinear().domain([0,maxGamesPlayed]).range([d3.rgb('#ece2f0'), d3.rgb('#016450')]); 
        this.goalColorScale = d3.scaleLinear().domain([0,maxGamesPlayed]).range([d3.rgb('#cb181d'), d3.rgb('#034e7b')]); 

        // Create the x axes for the goalScale.
        let goalScaleXAxis = d3.axisBottom();
        goalScaleXAxis.scale(this.goalScale);
        let goalHeaderSVG = d3.select("#goalHeader").append("svg");
        goalHeaderSVG.style("width", this.cell["width"] * 2.0);
        goalHeaderSVG.style("height", this.cell["height"]);

        //add GoalAxis to header of col 1.
        goalHeaderSVG.call(goalScaleXAxis);

        // ******* TODO: PART V *******

        // Set sorting callback for clicking on headers


        // Clicking on headers should also trigger collapseList() and updateTable(). 

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

        /* Sort teams */
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

        /* Sort goals */
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

        /* Sort results */
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

        /* Sort wins */
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

        /* Sort losses */
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

        /* Sort Total Games */
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


    /**
     * Updates the table contents with a row for each element in the global variable tableElements.
     */
    updateTable() {
        let self = this;
        let gameScale = this.gameScale;
        let goalScale = this.goalScale;
        let aggregateColorScale = this.aggregateColorScale;
        let goalColorScale = this.goalColorScale;
        let updateTable = this.updateTable;

        // ******* TODO: PART III *******
        //Create table rows
        // let tr = d3.select("tbody").selectAll("tr")
        //     .data(this.tableElements)
        //     .enter()
        //     .append('tr');

        //Create table rows
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


        //Append th elements for the Team Names
        let th = tr.selectAll("th").data(function(d, i) {return [{'key': d.key, 'index': i, 'type': d.value.type}]});
        th = th.enter().append("th").merge(th);
        th = th.text(function(d){ return (d.type == "aggregate") ? d.key : 'x' + d.key;})
            .attr("class", function(d) { return d.type;})
            .on("click", function(d) {
                self.updateList(d.index);
            });
        th.exit().remove();




        //Append td elements for the remaining columns. 
        //Data for each cell is of the type: {'type':<'game' or 'aggregate'>, 'value':<[array of 1 or two elements]>}
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


        //Add scores as title property to appear on hover

        //Populate cells (do one type of cell at a time )
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

        //Create diagrams in the goals column
        //Set the color of all games that tied to light gray
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

    /**
     * Updates the global tableElements variable, with a row for each row to be rendered in the table.
     *
     */

    updateList(i) {
        // ******* TODO: PART IV *******
       
        //Only update list for aggregate clicks, not game clicks
        let row = this.tableElements[i];
        
        /* If the row isn't aggregated, ignore it. */
        if (row.value.type != "aggregate") return;

        /* If the next row is either null or another aggregate row, expand */
        let nextRow = this.tableElements[i + 1];
        if (nextRow == null || nextRow.value.type == "aggregate") {
            let games = row.value.games.slice(0);
            Array.prototype.splice.apply(this.tableElements, [i + 1, 0].concat(games));
        } 
        /* Else collapse the rows */
        else {
            let games = row.value.games;
            this.tableElements.splice(i+1, games.length);
        }
        
        this.updateTable();
    }

    /**
     * Collapses all expanded countries, leaving only rows for aggregate values per country.
     *
     */
    collapseList() {
        
        // ******* TODO: PART IV *******
        this.tableElements = this.teamData.slice(0);

    }


}
