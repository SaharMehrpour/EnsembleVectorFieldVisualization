/**
 * Created by saharmehrpour on 4/23/17.
 */

function DrawTree(parentID, draw_contour) {

    var self = this;

    self.svg = d3.select(parentID).select("svg");
    self.group = self.svg.append("g")
        .attr("transform", "translate(20, 20)");

    self.draw_contour = draw_contour;
    self.tooltip = d3.select(".tooltip");
}


DrawTree.prototype.draw = function(treeData) {

    var self = this;

    var treemap = d3.tree()
        .size([270, 550]);

    var nodes = d3.hierarchy(treeData, function (d) {
        return d.children;
    });

    nodes = treemap(nodes);

    var link = self.group.selectAll(".link")
        .data(nodes.descendants().slice(1))
        .enter().append("path")
        .attr("class", "link")
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
        .attr("r", 5)
        .attr("cx", 0)
        .attr("cr", 0)
        .attr("class", function (d) {
            return d.data.type;
        })
        .on("click", function (d) {
            var selected = d3.select(this).classed("selected");
            self.group.selectAll("circle").classed("selected", false);
            d3.select(this).classed("selected", !selected);
            if (!selected) {
                self.draw_contour.changeContour(d.data.value)
            }
            else {
                self.draw_contour.changeContour(0)
            }
        })
        .on("mouseover", function (d) {
            self.tooltip.transition()
                .duration(200)
                .style("opacity", 1);
            self.tooltip.html(function () {
                return d.data.type + " "+ d.data.value;
            })
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function () {
            self.tooltip.transition()
                .duration(200)
                .style("opacity", 0);
        });

};
