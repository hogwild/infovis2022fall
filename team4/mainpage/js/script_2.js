
d3.csv("data/2018-fifa-matches.csv", function (error, matchesCSV) {
    /**
     * Loads in the tree information from fifa-tree.csv and calls createTree(csvData) to render the tree.
     *
     */
    d3.csv("data/2018-fifa-tree.csv", function (error, treeCSV) {
        console.log(matchesCSV);

        /* For cleaner lookup */
        let rank = {
           "Winner": 7,
           "Runner-Up": 6,
           "Third Place": 5,
           "Fourth Place": 4,
           "Semi Finals": 3,
           "Quarter Finals": 2,
           "Round of Sixteen": 1,
           "Group": 0
        };

        /* Given a list of matches */
        matches = d3.nest()
            /* Gather by team name. */
            .key(function (d) {
                return d.Team;
            })
            /* Add up per field attrs, deriving overall data */
            .rollup(function (leaves) {
                let entry = {};
                entry["Goals Made"] = d3.sum(leaves,function(l){return l["Goals Made"]});
                entry["Goals Conceded"] = d3.sum(leaves,function(l){return l["Goals Conceded"]});
                entry["Delta Goals"] = d3.sum(leaves,function(l){return l["Delta Goals"]});
                entry["Wins"] = d3.sum(leaves,function(l){return l.Wins});
                entry["Losses"] = d3.sum(leaves,function(l){return l.Losses});
                entry["Result"] = { "label": -1, "rank" : -1 };
                entry["TotalGames"] = d3.sum(leaves,function(l){return 1});
                entry["type"] = "aggregate";
                
                /* Search sequentially for what game resulted in the highest rank, and take that one */
                for (let i = 0; i < leaves.length; ++i) {
                    if (rank[leaves[i].Result] > entry["Result"]["rank"] ) {
                        entry["Result"] = {
                            "label": leaves[i].Result,
                            "rank" : rank[leaves[i].Result]
                        };
                    }
                }
                return entry;
            })
            .entries(matchesCSV);

        /* The games attribute is different, since tuples of interest have opponent names as the primary key, and vise versa. */
        for (let i = 0; i < matches.length; ++i) {
            /* Find all games where we are the opponent. */
            var opponentList = matchesCSV.filter(function(item){
              return item.Opponent == matches[i].key;
            });

            /* Add each game found to the current team's game attribute. */
            matches[i].value["games"] = [];
            for (let j = 0; j < opponentList.length; ++j) {
                matches[i].value["games"][j] = {
                    "key": opponentList[j].Team,
                    "value": {
                        "Goals Made": opponentList[j]["Goals Made"],
                        "Goals Conceded": opponentList[j]["Goals Conceded"],
                        "Delta Goals": opponentList[j]["Delta Goals"], 
                        "Wins": [], "Losses": [],
                        "Result": {
                            "label": opponentList[j].Result, 
                            "ranking": rank[opponentList[j].Result]
                        },
                        "type": "game",
                        "Opponent": opponentList[j].Opponent
                    }
                }
            }
        }

        /* At this point, matches should be interchangable with fifa-matches.json */

        //Create a unique "id" field for each game
        treeCSV.forEach(function (d, i) {
            d.id = d.Team + d.Opponent + i;
        });

        //Create Tree Object
        let tree = new Tree();
        tree.createTree(treeCSV);

        //Create Table Object and pass in reference to tree object (for hover linking)
        let table = new Table(matches,tree);

        table.createTable();
        table.updateTable();
    });

});
// ********************** END HACKER VERSION ***************************
