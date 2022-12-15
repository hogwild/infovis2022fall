function diagonal(s, d) {
    path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`

    return path
}

class Tree {
  
    constructor() {
        
    }

 
    createTree(treeData) {
        
        let tree = d3.tree().size([800, 300]);

        let root = d3.stratify()
            .id((d, i) => { return i; })
            .parentId((d, i) => { return d.ParentGame; })
            (treeData);

        let group = d3.select("#tree");
        group.attr("transform", function(d) {
            return "translate(" + 100 + "," + 25+ ")";
        });
        let generatedTree = tree(root);

        let nodes = generatedTree.descendants();
        let links = generatedTree.descendants().slice(1);

        var node = group.selectAll("node")
          .data(nodes, function(d) { return d.id || (d.id = ++i); });

        var nodeEnter = node.enter().append("g")
            .attr("class", (d) => {
                return (d.data.Wins != 0) ? "node winner" : "node";
            })
            .attr("transform", function(d) { 
                return "translate(" + d.y + "," + d.x + ")"; });

        nodeEnter.append("circle")
            .attr("r", 6);

        nodeEnter.append("text")
            .attr("x", function(d) { 
                return d.children || d._children ? -13 : 13; })
            .attr("dy", ".35em")
            .attr("text-anchor", function(d) { 
                return d.children || d._children ? "end" : "start"; })
            .text(function(d) { return d.data.Team; })
            .style("fill-opacity", 1)
            .attr("class", (d) => {return d.data.Team + "txt";});


        var link = group.selectAll("path.link")
            .data(links, function(d) { return d.id; });

        link.enter().insert("path", "g")
            .attr("class", (d) => {
                return "link " + d.data.Team + "lnk";
            })
            .attr("d", (d) => { return diagonal(d, d.parent);});
    }


    updateTree(row) {
        let linkSelection = d3.selectAll("." + row.key + "lnk");
        linkSelection.classed("selected", true);

        let textSelection = d3.selectAll("." + row.key + "txt");
        textSelection.classed("selectedLabel", true);
    }


    clearTree() {
        
        d3.selectAll(".selected").classed("selected", false);
        d3.selectAll(".selectedLabel").classed("selectedLabel", false);
    }
}
