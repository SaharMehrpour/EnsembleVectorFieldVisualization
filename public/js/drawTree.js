/**
 * Created by saharmehrpour on 4/23/17.
 */

function DrawTree() {

    var self = this;

    self.svg = d3.select("#tree_div").append("svg")
        .attr("width", 500)
        .attr("height", 700);
    self.group = self.svg.append("g")
        .attr("translate", "transform(20, 0)");
}


DrawTree.prototype.draw = function(treeData) {

    var self = this;

    var treemap = d3.tree()
        .size([450, 650]);

    var nodes = d3.hierarchy(treeData, function (d) {
        return d.children;
    });

    nodes = treemap(nodes);

    var link = self.group.selectAll(".link")
        .data(nodes.descendants().slice(1))
        .enter().append("path")
        .attr("class", "link")
        .attr("id", function (d) {
            return d.data.id;
        })
        .attr("d", function (d) {
            return "M" + d.x + "," + d.y
                + "C" + (d.x + d.parent.x) / 2 + "," + d.y
                + " " + (d.x + d.parent.x) / 2 + "," + d.parent.y
                + " " + d.parent.x + "," + d.parent.y;
        });

    var node = self.group.selectAll(".node")
        .data(nodes.descendants())
        .enter().append("g")
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

    node.append("circle")
        .attr("r", 3)
        .attr("cx", 0)
        .attr("cr", 0)
        .attr("class", function (d) {
            return d.data.type;
        });
};
