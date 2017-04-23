/**
 * Created by saharmehrpour on 4/23/17.
 */

function Manager(verts, faces, ensData) {
    var self = this;

    self.ensData = ensData; // Not used yet!
    self.verts = verts;
    self.faces = faces;

    self.init();
}

Manager.prototype.init = function() {

    var self= this;

    self.indiTab = d3.select("#individual");
    self.indiDiv = d3.select("#indi_div");
    self.compTab = d3.select("#compare");
    self.compDiv = d3.select("#comp_div");

    self.indiTab.on("click", function () {
        d3.select("#header").selectAll("div").classed("active", false);
        d3.selectAll(".main").classed("hidden", true);
        self.indiDiv.classed("hidden", false);
        self.indiTab.classed("active", true);
    });

    self.compTab.on("click", function () {
        d3.select("#header").selectAll("div").classed("active", false);
        d3.selectAll(".main").classed("hidden", true);
        self.compDiv.classed("hidden", false);
        self.compTab.classed("active", true);
    });
    
    // Global values:
    self.maxX = d3.max(self.verts, function (d) { return d.x; });
    self.minX = d3.min(self.verts, function (d) { return d.x; });
    self.maxY = d3.max(self.verts, function (d) { return d.y; });
    self.minY = d3.min(self.verts, function (d) { return d.y; });

    self.tooltip = d3.select(".tooltip");
    
};

Manager.prototype.individual = function (vf, cps, treeData, fileLocation) {
    var self = this;

    self.drawVF("#indi_vf_div", vf, cps);
    self.drawContour("#indi_contour_div", vf, cps);
    self.drawTree("#indi_tree_div", treeData, vf);

    d3.select("#indi_lic_div").select("img").attr('src', fileLocation);
    
};

Manager.prototype.drawVF = function (parentDIV, vf, cps) {
    var self = this;

    var scaleX = d3.scaleLinear()
        .domain([self.minX, self.maxX])
        .range([30, 470]);

    var scaleY = d3.scaleLinear()
        .domain([self.minY, self.maxY])
        .range([30, 570]);

    var colorScale = d3.scaleLinear()
        .domain([0, 20]) // TODO generalize
        .range(['#ccc', '#111']);

    var arrows = d3.select(parentDIV)
        .select("svg")
        .selectAll('.arrows')
        .data(self.verts);

    arrows.enter().append('line')
        .classed('arrows', true)
        .attr('x1', function (d) {
            return scaleX(d.x);
        })
        .attr('y1', function (d) {
            return scaleY(d.y);
        })
        .attr('x2', function (d) {
            return scaleX(d.x);
        })
        .attr('y2', function (d) {
            return scaleY(d.y);
        })
        .transition()
        .duration(1500)
        .attr('x2', function (d, i) {
            var x1 = scaleX(d.x);
            return x1 + vf[i].vx;
        })
        .attr('y2', function (d, i) {
            var y1 = scaleY(d.y);
            return y1 + vf[i].vy;

        })
        .attr("marker-end", "url(#arrow)");

    var cpoints = d3.select(parentDIV)
        .select("svg")
        .selectAll('.cps')
        .data(cps);

    cpoints.enter().append('path')
        .classed('cps', true)
        .merge(cpoints)
        //.transition()
        //.duration(1500)
        .attr('d', function (d) {
            var v1x = scaleX(self.faces[d.simplexIndex].v1x);
            var v2x = scaleX(self.faces[d.simplexIndex].v2x);
            var v3x = scaleX(self.faces[d.simplexIndex].v3x);
            var v1y = scaleY(self.faces[d.simplexIndex].v1y);
            var v2y = scaleY(self.faces[d.simplexIndex].v2y);
            var v3y = scaleY(self.faces[d.simplexIndex].v3y);
            return 'M' + v1x + ' ' + v1y + ' L' + v2x + ' ' + v2y + ' L' + v3x + ' ' + v3y + ' Z';
        });

    cpoints.exit().remove();
};

Manager.prototype.drawContour = function (parentDIV, vf, cps) {
    var self = this;
    
    var scaleX = d3.scaleLinear()
        .domain([self.minX, self.maxX])
        .range([30, 470]);

    var scaleY = d3.scaleLinear()
        .domain([self.minY, self.maxY])
        .range([30, 570]);

    var colorScale = d3.scaleLinear()
        .domain([0, 20]) // TODO generalize
        .range(['#ccc', '#111']);

    var arrows = d3.select(parentDIV)
        .select("svg")
        .selectAll('.arrows')
        .data(self.verts);

    arrows.enter().append('line')
        .classed('arrows', true)
        .attr('x1', function (d) {
            return scaleX(d.x);
        })
        .attr('y1', function (d) {
            return scaleY(d.y);
        })
        .attr('x2', function (d) {
            return scaleX(d.x);
        })
        .attr('y2', function (d) {
            return scaleY(d.y);
        })
        .transition()
        .duration(1500)
        .attr('x2', function (d, i) {
            var x1 = scaleX(d.x);
            return x1 + vf[i].vx;
        })
        .attr('y2', function (d, i) {
            var y1 = scaleY(d.y);
            return y1 + vf[i].vy;

        })
        .style("stroke", function (d, i) {
            var norm = Math.sqrt(vf[i].vx * vf[i].vx + vf[i].vy * vf[i].vy);
            return colorScale(norm);
        });

    var cpoints = d3.select(parentDIV)
        .select("svg")
        .selectAll('.cps')
        .data(cps);

    cpoints.enter().append('path')
        .classed('cps', true)
        .merge(cpoints)
        //.transition()
        //.duration(1500)
        .attr('d', function (d) {
            var v1x = scaleX(self.faces[d.simplexIndex].v1x);
            var v2x = scaleX(self.faces[d.simplexIndex].v2x);
            var v3x = scaleX(self.faces[d.simplexIndex].v3x);
            var v1y = scaleY(self.faces[d.simplexIndex].v1y);
            var v2y = scaleY(self.faces[d.simplexIndex].v2y);
            var v3y = scaleY(self.faces[d.simplexIndex].v3y);
            return 'M' + v1x + ' ' + v1y + ' L' + v2x + ' ' + v2y + ' L' + v3x + ' ' + v3y + ' Z';
        });

    cpoints.exit().remove();
};

Manager.prototype.drawTree = function (parentDIV, treeData, vf) {
    var self = this;

    var treemap = d3.cluster()
        .size([270, 550]);

    var nodes = d3.hierarchy(treeData, function (d) {
        return d.children;
    });

    nodes = treemap(nodes);

    var group = d3.select(parentDIV)
        .select("svg")
        .append("g")
        .attr("transform", "translate(20, 20)");

    var link = group.selectAll(".link")
        .data(nodes.descendants().slice(1))
        .enter().append("path")
        .attr("class", "link")
        .attr("d", function (d) {
            return "M" + d.x + "," + d.y
                + "C" + (d.x + d.parent.x) / 2 + "," + d.y
                + " " + (d.x + d.parent.x) / 2 + "," + d.parent.y
                + " " + d.parent.x + "," + d.parent.y;
        });

    var node = group.selectAll(".node")
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
            group.selectAll("circle").classed("selected", false);
            d3.select(this).classed("selected", !selected);
            if (!selected) {
                self.changeContour(d.data.value, vf)
            }
            else {
                self.changeContour(0, vf)
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

Manager.prototype.changeContour = function (value, vf) {

    var colorScale = d3.scaleLinear()
        .domain([0, 20]) // TODO generalize
        .range(['#ccc', '#111']);

    d3.select("#indi_contour_div").selectAll('.arrows')
        .transition()
        .duration(1000)
        .style("stroke", function (d, i) {
            var norm = Math.sqrt(vf[i].vx * vf[i].vx + vf[i].vy * vf[i].vy);
            if (norm <= value){
                return "#b91000";
            }
            return colorScale(norm);
        });

};
/******/


Manager.prototype.compare = function () {
    var self = this;

};