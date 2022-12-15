function diagonal(s, d) {
    path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`

    return path
}

/** Class implementing the tree view. */
class Tree {
    /**
     * Creates a Tree Object
     */
    constructor() {
        
    }

    /**
     * Creates a node/edge structure and renders a tree layout based on the input data
     *
     * @param treeData an array of objects that contain parent/child information.
     */
    createTree(treeData) {
        // ******* TODO: PART VI *******
        
        // Full disclosure, lots of this code was modified from http://bl.ocks.org/d3noob/8329447

        //Create a tree and give it a size() of 800 by 300. 
        let tree = d3.tree().size([800, 300]);

        //Create a root for the tree using d3.stratify(); 
        let root = d3.stratify()
            .id((d, i) => { return i; })
            .parentId((d, i) => { return d.ParentGame; })
            (treeData);

        //Add nodes and links to the tree. 
        let group = d3.select("#tree");
        group.attr("transform", function(d) {
            return "translate(" + 100 + "," + 25+ ")";
        });
        let generatedTree = tree(root);

          // Compute the new tree layout.
        let nodes = generatedTree.descendants();
        let links = generatedTree.descendants().slice(1);

        // Declare the nodes…
        var node = group.selectAll("node")
          .data(nodes, function(d) { return d.id || (d.id = ++i); });

        // Enter the nodes.
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


        // Declare the links…
        var link = group.selectAll("path.link")
            .data(links, function(d) { return d.id; });

        // Enter the links.
        link.enter().insert("path", "g")
            .attr("class", (d) => {
                return "link " + d.data.Team + "lnk";
            })
            .attr("d", (d) => { return diagonal(d, d.parent);});
    }

    /**
     * Updates the highlighting in the tree based on the selected team.
     * Highlights the appropriate team nodes and labels.
     *
     * @param row a string specifying which team was selected in the table.
     */
    updateTree(row) {
        // ******* TODO: PART VII *******
        let linkSelection = d3.selectAll("." + row.key + "lnk");
        linkSelection.classed("selected", true);

        let textSelection = d3.selectAll("." + row.key + "txt");
        textSelection.classed("selectedLabel", true);
    }

    /**
     * Removes all highlighting from the tree.
     */
    clearTree() {
        // ******* TODO: PART VII *******

        // You only need two lines of code for this! No loops! 
        d3.selectAll(".selected").classed("selected", false);
        d3.selectAll(".selectedLabel").classed("selectedLabel", false);
    }
}
