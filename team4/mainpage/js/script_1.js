
d3.csv("data/fifa-world-cup.csv", function (error, allData) {
    allData.forEach(function (d) {
        d.year = +d.YEAR;
        d.teams = +d.TEAMS;
        d.matches = +d.MATCHES;
        d.goals = +d.GOALS;
        d.avg_goals = +d.AVERAGE_GOALS;
        d.attendance = +d.AVERAGE_ATTENDANCE;
        d.win_pos = [+d.WIN_LON, +d.WIN_LAT];
        d.ru_pos = [+d.RUP_LON, +d.RUP_LAT];

        d.teams_iso = d3.csvParse(d.TEAM_LIST).columns;
        d.teams_names = d3.csvParse(d.TEAM_NAMES).columns;
    });

    let infoPanel = new InfoPanel();
    let worldMap = new Map();


    d3.json("data/world.json", function (error, world) {
        if (error) throw error;
        worldMap.drawMap(world);
    });

    window.barChart = new BarChart(worldMap, infoPanel, allData);

    barChart.updateBarChart('attendance');
});


function chooseData() {

    let dataset = document.getElementById("dataset"); 
    let selection = dataset.options[dataset.selectedIndex].text;
    window.barChart.updateBarChart(selection.toLowerCase());
}