
d3.csv("data/fifa-matches.csv", function (error, matchesCSV) {

    d3.csv("data/fifa-tree.csv", function (error, treeCSV) {
        console.log(matchesCSV);

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

        matches = d3.nest()
            .key(function (d) {
                return d.Team;
            })
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

        for (let i = 0; i < matches.length; ++i) {
            var opponentList = matchesCSV.filter(function(item){
              return item.Opponent == matches[i].key;
            });

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


        treeCSV.forEach(function (d, i) {
            d.id = d.Team + d.Opponent + i;
        });

        let tree = new Tree();
        tree.createTree(treeCSV);

        let table = new Table(matches,tree);

        table.createTable();
        table.updateTable();
    });

});
