
class InfoPanel {


    updateInfo(oneWorldCup) {

        let host = oneWorldCup.host;
        let winner = oneWorldCup.winner;
        let runner_up = oneWorldCup.runner_up;
        let team_names = oneWorldCup.teams_names;

        d3.select("#silver").text(runner_up);
        d3.select('#host1').text(winner);
        d3.select("#host2").text(host);

        let teams = d3.select("#teams");
        teams.select("ul").remove();
        let ul = teams.append("ul").selectAll("li").data(team_names);
  
        
        ul = ul.enter().append("li").merge(ul);

        ul.text(function (d) { return d });

    }

}