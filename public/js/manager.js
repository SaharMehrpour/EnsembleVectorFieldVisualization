/**
 * Created by saharmehrpour on 4/23/17.
 */

function Manager(verts, faces, ensData) {
    var self = this;

    self.ensData = ensData;
    self.verts = verts;
    self.faces = faces;

    self.sinkSymbol = "M 4 0 L 8 4 L 12 0 L 16 4 L 12 8 L 16 12 L 12 16 L 8 12 L 4 16 L 0 12 L 4 8 L 0 4 Z";
    self.saddleSymbol = "M 0 6 S 7 7 6 0 L 10 0 S 9 7 16 6 L 16 10 S 9 9 11 16 L 6 16 S 7 9 0 10 Z";

    self.init();
}

Manager.prototype.init = function() {

    var self = this;

    self.indiTab = d3.select("#individual");
    self.indiDiv = d3.select("#indi_div");
    self.compTab = d3.select("#compare");
    self.compDiv = d3.select("#comp_div");
    self.aboutTab = d3.select("#about");
    self.aboutDiv = d3.select("#about_div");

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

    self.aboutTab.on("click", function () {
        d3.select("#header").selectAll("div").classed("active", false);
        d3.selectAll(".main").classed("hidden", true);
        self.aboutDiv.classed("hidden", false);
        self.aboutTab.classed("active", true);
    });

    d3.select("#ens_drop_down_indi").selectAll("option")
        .data([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
        .enter()
        .append("option")
        .attr("value", function (d) {
            return d;
        })
        .text(function (d) {
            return "Ensemble " + d
        });

    d3.select("#ens_drop_down_indi").on("change", function () {
        var ensNumber = +document.getElementById("ens_drop_down_indi").value;

        self.individual(self.ensData.vf[ensNumber - 1],
            self.ensData.treeData[ensNumber - 1],
            self.ensData.fileLocation[ensNumber - 1])
    });


    d3.select("#ens_drop_down_comp").selectAll("option")
        .data([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
        .enter()
        .append("option")
        .attr("value", function (d) {
            return d;
        })
        .text(function (d) {
            return "Ensemble " + d
        });

    d3.select("#ens_drop_down_comp").on("change", function () {
        var ensNumber = +document.getElementById("ens_drop_down_comp").value;
        var ensDiv = d3.selectAll("#ens" + ensNumber);
        if (ensDiv.size() === 0) {
            self.compare(ensNumber,
                self.ensData.vf[ensNumber - 1],
                self.ensData.treeData[ensNumber - 1],
                self.ensData.fileLocation[ensNumber - 1])
        }
        else {
            console.log("The ensemble already exists");
        }
    });

    // Global values:
    self.maxX = d3.max(self.verts, function (d) {
        return d.x;
    });
    self.minX = d3.min(self.verts, function (d) {
        return d.x;
    });
    self.maxY = d3.max(self.verts, function (d) {
        return d.y;
    });
    self.minY = d3.min(self.verts, function (d) {
        return d.y;
    });

    self.tooltip = d3.select(".tooltip");

    /* draw vf and contour */

    var scaleX = d3.scaleLinear()
        .domain([self.minX, self.maxX])
        .range([30, 470]);

    var scaleY = d3.scaleLinear()
        .domain([self.minY, self.maxY])
        .range([30, 570]);

    d3.select("#indi_vf_div")
        .select("svg")
        .selectAll('.arrows')
        .data(self.verts)
        .enter().append('line')
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
        });

    d3.select("#indi_contour_div")
        .select("svg")
        .selectAll('.contour')
        .data(self.verts)
        .enter().append('circle')
        .classed('contour', true)
        .attr('cx', function (d) {
            return scaleX(d.x);
        })
        .attr('cy', function (d) {
            return scaleY(d.y);
        })
        .attr('r', 5)
        .style("fill", "white");

    /* slider */
    d3.select("#slider").on("input", function () {
        d3.select("#slider-value").text(+this.value);
        d3.select("#slider").property("value", +this.value);
        self.compChangeContour(+this.value);
    });

    console.log("Ready!");

};

/******/

Manager.prototype.individual = function (vf, treeData, fileLocation) {
    var self = this;

    self.drawVF("#indi_vf_div", vf, treeData);
    self.drawContour("#indi_contour_div", vf, treeData);
    self.drawTree("#indi_tree_div", treeData, vf);

    //d3.select("#indi_lic_div").select("img").attr('src', fileLocation);
    
};

Manager.prototype.drawVF = function (parentDIV, vf, treeData) {
    var self = this;

    var scaleX = d3.scaleLinear()
        .domain([self.minX, self.maxX])
        .range([30, 470]);

    var scaleY = d3.scaleLinear()
        .domain([self.minY, self.maxY])
        .range([30, 570]);

    var arrows = d3.select(parentDIV)
        .select("svg")
        .selectAll('.arrows')
        .transition()
        .duration(1000)
        .attr('x2', function (d, i) {
            var norm = Math.sqrt(vf[i].vx * vf[i].vx + vf[i].vy * vf[i].vy) / 5;
            var x1 = scaleX(d.x);
            return x1 + vf[i].vx / norm;
        })
        .attr('y2', function (d, i) {
            var norm = Math.sqrt(vf[i].vx * vf[i].vx + vf[i].vy * vf[i].vy) / 5;
            var y1 = scaleY(d.y);
            return y1 + vf[i].vy / norm;

        })
        .attr("marker-end", "url(#arrow)");

    var sourceCP = treeData.filter(function (d) {
        return d.TYPE === 'source'
    });
    var sinkCP = treeData.filter(function (d) {
        return d.TYPE === 'sink'
    });
    var saddleCP = treeData.filter(function (d) {
        return d.TYPE === 'saddle'
    });
    var leafCP = treeData.filter(function (d) {
        return d.TYPE === 'leaf'
    });

    d3.select(parentDIV)
        .select("svg")
        .selectAll('.source , .sink > path , .saddle > path, .leaf')
        .transition()
        .duration(10)
        .style('opacity', 0.5);

    var sourcePoints = d3.select(parentDIV)
        .select("svg")
        .selectAll('.source')
        .data(sourceCP);

    sourcePoints.exit()
        .transition()
        .delay(2000)
        .duration(1500)
        .style('opacity', 0)
        .remove();

    sourcePoints.enter().append('circle')
        .classed('source', true)
        .attr('cx', function (d) {
            return scaleX(self.faces[d.simplexIndex].v1x);
        })
        .attr('cy', function (d) {
            return scaleY(self.faces[d.simplexIndex].v1y);
        })
        .attr('r', 5)
        .style('opacity', 0)
        .merge(sourcePoints)
        .transition()
        .delay(2000)
        .duration(1500)
        .style('opacity', 1)
        .attr('cx', function (d) {
            return scaleX(self.faces[d.simplexIndex].v1x);
        })
        .attr('cy', function (d) {
            return scaleY(self.faces[d.simplexIndex].v1y);
        });

    var sinkPoints = d3.select(parentDIV)
        .select("svg")
        .selectAll('.sink')
        .data(sinkCP);

    sinkPoints.exit()
        .transition()
        .delay(2000)
        .duration(1500)
        .style('opacity', 0)
        .remove();

    sinkPoints.enter().append('g')
        .classed('sink', true)
        .attr('transform', function (d) {
            var x0 = scaleX(self.faces[d.simplexIndex].v1x);
            var y0 = scaleY(self.faces[d.simplexIndex].v1y);
            return 'translate(' + x0 + ',' + y0 + ')';
        })
        .append('path')
        .attr('d', this.sinkSymbol)
        .style('opacity', 0);

    d3.select(parentDIV)
        .select("svg")
        .selectAll('.sink')
        .data(sinkCP)
        .transition()
        .delay(2000)
        .duration(1500)
        .attr('transform', function (d) {
            var x0 = scaleX(self.faces[d.simplexIndex].v1x);
            var y0 = scaleY(self.faces[d.simplexIndex].v1y);
            return 'translate(' + x0 + ',' + y0 + ')';
        })
        .selectAll('path')
        .style('opacity', 1);


    var saddlePoints = d3.select(parentDIV)
        .select("svg")
        .selectAll('.saddle')
        .data(saddleCP);

    saddlePoints.exit()
        .transition()
        .delay(2000)
        .duration(1500)
        .style('opacity', 0)
        .remove();

    saddlePoints.enter().append('g')
        .classed('saddle', true)
        .attr('transform', function (d) {
            var x0 = scaleX(self.faces[d.simplexIndex].v1x);
            var y0 = scaleY(self.faces[d.simplexIndex].v1y);
            return 'translate(' + x0 + ',' + y0 + ')';
        })
        .append('path')
        .attr('d', this.saddleSymbol)
        .style('opacity', 0);

    d3.select(parentDIV)
        .select("svg")
        .selectAll('.saddle')
        .data(saddleCP)
        .transition()
        .delay(2000)
        .duration(1500)
        .attr('transform', function (d) {
            var x0 = scaleX(self.faces[d.simplexIndex].v1x);
            var y0 = scaleY(self.faces[d.simplexIndex].v1y);
            return 'translate(' + x0 + ',' + y0 + ')';
        })
        .selectAll('path')
        .style('opacity', 1);

    var leafPoints = d3.select(parentDIV)
        .select("svg")
        .selectAll('.leaf')
        .data(leafCP);

    leafPoints.exit()
        .transition()
        .delay(2000)
        .duration(1500)
        .style('opacity', 0)
        .remove();

    leafPoints.enter().append('circle')
        .classed('leaf', true)
        .attr('cx', function (d) {
            return scaleX(self.faces[d.simplexIndex].v1x);
        })
        .attr('cy', function (d) {
            return scaleY(self.faces[d.simplexIndex].v1y);
        })
        .attr('r', 5)
        .style('opacity', 0)
        .merge(sourcePoints)
        .transition()
        .delay(2000)
        .duration(1500)
        .style('opacity', 1)
        .attr('cx', function (d) {
            return scaleX(self.faces[d.simplexIndex].v1x);
        })
        .attr('cy', function (d) {
            return scaleY(self.faces[d.simplexIndex].v1y);
        });
};

Manager.prototype.drawContour = function (parentDIV, vf, treeData) {
    var self = this;

    var scaleX = d3.scaleLinear()
        .domain([self.minX, self.maxX])
        .range([30, 470]);

    var scaleY = d3.scaleLinear()
        .domain([self.minY, self.maxY])
        .range([30, 570]);

    var colorScale = d3.scaleLinear()
        .domain([0, 75])
        .range(['#ccc', '#111']);

    var contours = d3.select(parentDIV)
        .select("svg")
        .selectAll('.contour')
        .transition()
        .delay(1000)
        .duration(1000)
        .style("fill", function (d, i) {
            var norm = Math.sqrt(vf[i].vx * vf[i].vx + vf[i].vy * vf[i].vy);
            return colorScale(norm);
        });

    var sourceCP = treeData.filter(function (d) { return d.TYPE === 'source' });
    var sinkCP = treeData.filter(function (d) { return d.TYPE === 'sink' });
    var saddleCP = treeData.filter(function (d) { return d.TYPE === 'saddle' });
    var leafCP = treeData.filter(function (d) { return d.TYPE === 'leaf' });

    d3.select(parentDIV)
        .select("svg")
        .selectAll('.source , .sink > path , .saddle > path , .leaf')
        .transition()
        .duration(10)
        .style('opacity', 0.5);

    var sourcePoints = d3.select(parentDIV)
        .select("svg")
        .selectAll('.source')
        .data(sourceCP);

    sourcePoints.exit()
        .transition()
        .delay(2000)
        .duration(1500)
        .style('opacity', 0)
        .remove();

    sourcePoints.enter().append('circle')
        .classed('source', true)
        .attr('cx', function (d) {
            return scaleX(self.faces[d.simplexIndex].v1x);
        })
        .attr('cy', function (d) {
            return scaleY(self.faces[d.simplexIndex].v1y);
        })
        .attr('r', 5)
        .style('opacity', 0)
        .merge(sourcePoints)
        .transition()
        .delay(2000)
        .duration(1500)
        .style('opacity', 1)
        .attr('cx', function (d) {
            return scaleX(self.faces[d.simplexIndex].v1x);
        })
        .attr('cy', function (d) {
            return scaleY(self.faces[d.simplexIndex].v1y);
        });

    var sinkPoints = d3.select(parentDIV)
        .select("svg")
        .selectAll('.sink')
        .data(sinkCP);

    sinkPoints.exit()
        .transition()
        .delay(2000)
        .duration(1500)
        .style('opacity', 0)
        .remove();

    sinkPoints.enter().append('g')
        .classed('sink', true)
        .attr('transform', function (d) {
            var x0 = scaleX(self.faces[d.simplexIndex].v1x);
            var y0 = scaleY(self.faces[d.simplexIndex].v1y);
            return 'translate(' + x0 + ',' + y0 + ')';
        })
        .append('path')
        .attr('d', this.sinkSymbol)
        .style('opacity', 0);

    d3.select(parentDIV)
        .select("svg")
        .selectAll('.sink')
        .data(sinkCP)
        .transition()
        .delay(2000)
        .duration(1500)
        .attr('transform', function (d) {
            var x0 = scaleX(self.faces[d.simplexIndex].v1x);
            var y0 = scaleY(self.faces[d.simplexIndex].v1y);
            return 'translate(' + x0 + ',' + y0 + ')';
        })
        .selectAll('path')
        .style('opacity', 1);


    var saddlePoints = d3.select(parentDIV)
        .select("svg")
        .selectAll('.saddle')
        .data(saddleCP);

    saddlePoints.exit()
        .transition()
        .delay(2000)
        .duration(1500)
        .style('opacity', 0)
        .remove();

    saddlePoints.enter().append('g')
        .classed('saddle', true)
        .attr('transform', function (d) {
            var x0 = scaleX(self.faces[d.simplexIndex].v1x);
            var y0 = scaleY(self.faces[d.simplexIndex].v1y);
            return 'translate(' + x0 + ',' + y0 + ')';
        })
        .append('path')
        .attr('d', this.saddleSymbol)
        .style('opacity', 0);

    d3.select(parentDIV)
        .select("svg")
        .selectAll('.saddle')
        .data(saddleCP)
        .transition()
        .delay(2000)
        .duration(1500)
        .attr('transform', function (d) {
            var x0 = scaleX(self.faces[d.simplexIndex].v1x);
            var y0 = scaleY(self.faces[d.simplexIndex].v1y);
            return 'translate(' + x0 + ',' + y0 + ')';
        })
        .selectAll('path')
        .style('opacity', 1);


    var leafPoints = d3.select(parentDIV)
        .select("svg")
        .selectAll('.leaf')
        .data(leafCP);

    leafPoints.exit()
        .transition()
        .delay(2000)
        .duration(1500)
        .style('opacity', 0)
        .remove();

    leafPoints.enter().append('circle')
        .classed('leaf', true)
        .attr('cx', function (d) {
            return scaleX(self.faces[d.simplexIndex].v1x);
        })
        .attr('cy', function (d) {
            return scaleY(self.faces[d.simplexIndex].v1y);
        })
        .attr('r', 5)
        .style('opacity', 0)
        .merge(sourcePoints)
        .transition()
        .delay(2000)
        .duration(1500)
        .style('opacity', 1)
        .attr('cx', function (d) {
            return scaleX(self.faces[d.simplexIndex].v1x);
        })
        .attr('cy', function (d) {
            return scaleY(self.faces[d.simplexIndex].v1y);
        });

};

Manager.prototype.drawTree = function (parentDIV, treeData, vf) {
    var self = this;

    // prepare data
    var root = d3.stratify()
        .id(function (d) {
            return +d.ID;
        })
        .parentId(function (d) {
            if (d.PARENT === "") return;
            return d.PARENT;
        })
        (treeData);

    var treemap = d3.cluster()
        .size([440, 550]);

    var nodes = d3.hierarchy(root, function (d) {
        return d.children;
    });
    nodes = treemap(nodes);

    // prepare scale
    var valueScale = d3.scaleLinear()
        .domain([0, d3.max(treeData, function (d) {
            return +d.VALUE
        })])
        .range([550, 50]);

    // Axis
    var ticks = d3.map(treeData, function (d) {
        return +d.VALUE
    }).keys();

    // TODO add a slider -> fade upper part of the tree update the contour

    d3.select(parentDIV)
        .select("svg .grid")
        .transition()
        .delay(2000)
        .duration(1500)
        .call(d3.axisRight(valueScale)
            .tickSize(-450)
            .tickFormat("")
            .tickValues(ticks));

    d3.select(parentDIV)
        .select("svg .axis")
        //.style("stroke-dasharray", ("3, 3"))
        .transition()
        .delay(2000)
        .duration(1500)
        .call(d3.axisRight(valueScale)
            .tickFormat(d3.format(".3f"))
            .tickValues(ticks));

    var group = d3.select(parentDIV)
        .select("svg .tree");

    var link = group.selectAll(".link")
        .data(nodes.descendants().slice(1));

    link.enter().append("path")
        .attr("class", "link")
        .merge(link)
        .transition()
        .delay(2000)
        .duration(1500)
        .attr("d", function (d) {
            return "M" + d.x + "," + valueScale(parseFloat(d.data.data.VALUE))
                + "C" + (d.x + d.parent.x) / 2 + "," + valueScale(parseFloat(d.data.data.VALUE))
                + " " + (d.x + d.parent.x) / 2 + "," + valueScale(parseFloat(d.parent.data.data.VALUE))
                + " " + d.parent.x + "," + valueScale(parseFloat(d.parent.data.data.VALUE));
        });

    link.exit()
        .transition()
        .delay(2000)
        .duration(1500)
        .style('opacity',0)
        .remove();
    //////////

    var sourceCP = nodes.descendants().filter(function (d) {
        return d.data.data.TYPE === 'source'
    });
    var sinkCP = nodes.descendants().filter(function (d) {
        return d.data.data.TYPE === 'sink'
    });
    var saddleCP = nodes.descendants().filter(function (d) {
        return d.data.data.TYPE === 'saddle'
    });
    var mergeNode = nodes.descendants().filter(function (d) {
        return d.data.data.TYPE === 'merge'
    });
    var leafNode = nodes.descendants().filter(function (d) {
        return d.data.data.TYPE === 'leaf'
    });

    // source
    var sourcePoints = group
        .selectAll('.source')
        .data(sourceCP);

    sourcePoints.enter()
        .append("g")
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + valueScale(parseFloat(d.data.data.VALUE)) + ")";
        })
        .classed('source', true)
        .style('opacity', 0)
        .append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 5);

    sourcePoints.exit()
        .transition()
        .delay(2000)
        .duration(1500)
        .style('opacity', 0)
        .remove();

    group.selectAll('.source')
        .data(sourceCP)
        .transition()
        .delay(2000)
        .duration(1500)
        .style('opacity', 1)
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + valueScale(parseFloat(d.data.data.VALUE)) + ")";
        });

    // sink
    var sinkPoints = group
        .selectAll('.sink')
        .data(sinkCP);

    sinkPoints.enter()
        .append('g')
        .classed('sink', true)
        .attr("transform", function (d) {
            return "translate(" + (d.x - 8) + "," + (valueScale(parseFloat(d.data.data.VALUE)) - 8) + ")";
        })
        .style('opacity', 0)
        .append('path')
        .attr('d', this.sinkSymbol);

    sinkPoints.exit()
        .transition()
        .delay(2000)
        .duration(1500)
        .style('opacity', 0)
        .remove();

    group.selectAll('.sink')
        .data(sinkCP)
        .transition()
        .delay(2000)
        .duration(1500)
        .style('opacity', 1)
        .attr("transform", function (d) {
            return "translate(" + (d.x - 8) + "," + (valueScale(parseFloat(d.data.data.VALUE)) - 8) + ")";
        });

    // saddle
    var saddlePoints = group
        .selectAll('.saddle')
        .data(saddleCP);

    saddlePoints.enter()
        .append('g')
        .classed('saddle', true)
        .attr("transform", function (d) {
            return "translate(" + (d.x - 8) + "," + (valueScale(parseFloat(d.data.data.VALUE)) - 8) + ")";
        })
        .style('opacity', 0)
        .append('path')
        .attr('d', this.saddleSymbol);

    saddlePoints.exit()
        .transition()
        .delay(2000)
        .duration(1500)
        .style('opacity', 0)
        .remove();

    group.selectAll('.saddle')
        .data(saddleCP)
        .transition()
        .delay(2000)
        .duration(1500)
        .style('opacity', 1)
        .attr("transform", function (d) {
            return "translate(" + (d.x - 8) + "," + (valueScale(parseFloat(d.data.data.VALUE)) - 8) + ")";
        });

    // merge
    var mergePoints = group
        .selectAll('.merge')
        .data(mergeNode);

    mergePoints.enter()
        .append("g")
        .classed('merge', true)
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + valueScale(parseFloat(d.data.data.VALUE)) + ")";
        })
        .style('opacity', 0)
        .append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 5);

    mergePoints.exit()
        .transition()
        .delay(2000)
        .duration(1500)
        .style('opacity', 0)
        .remove();

    group.selectAll('.merge')
        .data(mergeNode)
        .transition()
        .delay(2000)
        .duration(1500)
        .style('opacity', 1)
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + valueScale(parseFloat(d.data.data.VALUE)) + ")";
        });

    // leaf
    var leafPoints = group
        .selectAll('.leaf')
        .data(leafNode);

    leafPoints.enter()
        .append("g")
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + valueScale(parseFloat(d.data.data.VALUE)) + ")";
        })
        .classed('leaf', true)
        .style('opacity', 0)
        .append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 5);

    leafPoints.exit()
        .transition()
        .delay(2000)
        .duration(1500)
        .style('opacity', 0)
        .remove();

    group.selectAll('.leaf')
        .data(leafNode)
        .transition()
        .delay(2000)
        .duration(1500)
        .style('opacity', 1)
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + valueScale(parseFloat(d.data.data.VALUE)) + ")";
        });

    // events
    group.selectAll('.source , .sink , .saddle , .merge , .leaf ')
        .on("click", function (d) {
            var selected = d3.select(this).classed("selected");
            group.selectAll(".selected").classed("selected", false);
            d3.select(this).classed("selected", !selected);
            if (!selected) {
                self.changeContour(d.data.data.VALUE, vf);
            }
            else {
                self.changeContour(0, vf)
            }
        })
        .on("mouseover", function (d) {

            var s = "#indi_contour_div svg ." + d.data.data.TYPE + " , #indi_vf_div svg ." + d.data.data.TYPE;
            d3.selectAll(s)
                .filter(function (g) {
                    return g.SIMPLEX == d.data.data.SIMPLEX
                })
                .classed("selected", true);

            self.tooltip.transition()
                .duration(200)
                .style("opacity", 1);
            self.tooltip.html(function () {
                return self.tooltip_render(d.data.data);
            })
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function () {
            var sd = d3.selectAll("#indi_contour_div svg .selected, #indi_vf_div svg .selected")
                .classed("selected", false);

            self.tooltip.transition()
                .duration(200)
                .style("opacity", 0);
        });

};

Manager.prototype.changeContour = function (value, vf) {

    var colorScale = d3.scaleLinear()
        .domain([0, 75])
        .range(['#ccc', '#111']);

    d3.select("#indi_contour_div").selectAll('.contour') // TODO also change the color of cps (should be matched with the tree)
        .transition()
        .duration(1000)
        .style("fill", function (d, i) {
            var norm = Math.sqrt(vf[i].vx * vf[i].vx + vf[i].vy * vf[i].vy);
            if (norm <= (parseFloat(value) + 0.1)){
                var val = d3.rgb(colorScale(norm));
                val.r += 70;
                return val;

            }
            return colorScale(norm);
        });
};

/******/

Manager.prototype.compare = function (ensNumber, vf, treeData, fileLocation) {
    var self = this;

    var divID = "ens" + ensNumber;

    var div = d3.select("#comp_list_div").append("div")
        .attr("id", divID);

    var remove = div.append("div")
        .attr("class", "icon")
        .attr("id", "remove_" + divID);

    remove.append("img")
        .attr("src", "img/remove.png")
        .on("click", function () {
            d3.select("#" + divID).remove();
        });

    remove.append("h4")
        .text(function () {
            return "Ensemble " + ensNumber;
        });

    //div.append("div").attr("id", "comp_vf_" + divID).attr("class", "vf_diagram").append("svg");
    div.append("div").attr("id", "comp_contour_" + divID).attr("class", "contour_diagram").append("svg");
    div.append("div").attr("id", "comp_tree_" + divID).attr("class", "tree_diagram").append("svg");
    //div.append("div").attr("id", "comp_lic_" + divID).attr("class", "lic_diagram")
    //.append("img").attr("src", fileLocation);

    //self.compDrawVF("#comp_vf_" + divID, vf, treeData);
    self.compDrawContour("#comp_contour_" + divID, vf, treeData);
    self.compDrawTree("#comp_tree_" + divID, treeData);

};

Manager.prototype.compDrawVF = function (parentDIV, vf, cps) { // Not used!
    var self = this;

    var scaleX = d3.scaleLinear()
        .domain([self.minX, self.maxX])
        .range([20, 230]);

    var scaleY = d3.scaleLinear()
        .domain([self.minY, self.maxY])
        .range([20, 330]);

    var colorScale = d3.scaleLinear()
        .domain([0, 20])
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

    cpoints.enter().append('circle')
        .classed('cps', true)
        .merge(cpoints)
        //.transition()
        //.duration(1500)
        .attr('cx', function (d) {
            return scaleX(self.faces[d.simplexIndex].v1x);
        })
        .attr('cy', function (d) {
            return scaleY(self.faces[d.simplexIndex].v1y);
        })
        .attr('r', 5);

    cpoints.exit().remove();
};

Manager.prototype.compDrawContour = function (parentDIV, vf, treeData) {
    var self = this;

    var scaleX = d3.scaleLinear()
        .domain([self.minX, self.maxX])
        .range([20, 230]);

    var scaleY = d3.scaleLinear()
        .domain([self.minY, self.maxY])
        .range([20, 330]);

    var colorScale = d3.scaleLinear()
        .domain([0, 75])
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
        .attr('x2', function (d, i) {
            var x1 = scaleX(d.x);
            return x1 + vf[i].vx/2;
        })
        .attr('y2', function (d, i) {
            var y1 = scaleY(d.y);
            return y1 + vf[i].vy/2;

        })
        .attr('data-norm', function (d, i) {
            return Math.sqrt(vf[i].vx * vf[i].vx + vf[i].vy * vf[i].vy);
        })
        .style("stroke", function (d, i) {
            var norm = Math.sqrt(vf[i].vx * vf[i].vx + vf[i].vy * vf[i].vy);
            return colorScale(norm);
        });


    var sourceCP = treeData.filter(function (d) { return d.TYPE === 'source' });
    var sinkCP = treeData.filter(function (d) { return d.TYPE === 'sink' });
    var saddleCP = treeData.filter(function (d) { return d.TYPE === 'saddle' });

    var sourcePoints = d3.select(parentDIV)
        .select("svg")
        .selectAll('.source')
        .data(sourceCP);

    sourcePoints.enter().append('circle')
        .classed('source', true)
        .attr('cx', function (d) {
            return scaleX(self.faces[d.simplexIndex].v1x);
        })
        .attr('cy', function (d) {
            return scaleY(self.faces[d.simplexIndex].v1y);
        })
        .attr('r', 0)
        .merge(sourcePoints)
        .transition()
        .duration(1500)
        .attr('cx', function (d) {
            return scaleX(self.faces[d.simplexIndex].v1x);
        })
        .attr('cy', function (d) {
            return scaleY(self.faces[d.simplexIndex].v1y);
        })
        .attr('r', 5);

    sourcePoints.exit().remove();

    var sinkPoints = d3.select(parentDIV)
        .select("svg")
        .selectAll('.sink')
        .data(sinkCP)
        .enter().append('g')
        .classed('sink', true)
        .attr('transform',"translate(0,0)")
        .append('path')
        .attr('d', this.sinkSymbol);

    sinkPoints.exit().remove();

    d3.select(parentDIV)
        .select("svg")
        .selectAll('.sink')
        .data(sinkCP)
        .transition()
        .duration(1500)
        .attr('transform',function (d) {
            var x0 = scaleX(self.faces[d.simplexIndex].v1x);
            var y0 = scaleY(self.faces[d.simplexIndex].v1y);
            return 'translate(' + x0 + ',' + y0 + ')';
        });


    var saddlePoints = d3.select(parentDIV)
        .select("svg")
        .selectAll('.saddle')
        .data(saddleCP)
        .enter().append('g')
        .classed('saddle', true)
        .attr('transform',"translate(0,0)")
        .append('path')
        .attr('d', this.saddleSymbol);

    saddlePoints.exit().remove();

    d3.select(parentDIV)
        .select("svg")
        .selectAll('.saddle')
        .data(saddleCP)
        .transition()
        .duration(1500)
        .attr('transform',function (d) {
            var x0 = scaleX(self.faces[d.simplexIndex].v1x);
            var y0 = scaleY(self.faces[d.simplexIndex].v1y);
            return 'translate(' + x0 + ',' + y0 + ')';
        });

};

Manager.prototype.compDrawTree = function (parentDIV, treeData) {
    var self = this;

    // prepare data
    var root = d3.stratify()
        .id(function (d) {
            return +d.ID;
        })
        .parentId(function (d) {
            if (d.PARENT === "") return;
            return d.PARENT;
        })
        (treeData);

    var treemap = d3.cluster()
        .size([200, 320]);

    var nodes = d3.hierarchy(root, function (d) {
        return d.children;
    });
    nodes = treemap(nodes);

    // prepare scale
    var valueScale = d3.scaleLinear()
        .domain([0, 40])
        .range([320, 20]);

    // Axis
    var ticks = d3.map(treeData, function (d) {
        return +d.VALUE
    }).keys();
    ticks.push(40);

    // TODO add a slider -> fade upper part of the tree update the contour
    d3.select(parentDIV)
        .select("svg")
        .append('g')
        .classed('slider_line', true)
        .attr("transform", "translate(0,340)")
        .append('line')
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 200)
        .attr("y2", 0);

    d3.select(parentDIV)
        .select("svg")
        .append("g")
        .attr("class", "grid")
        .attr("transform", "translate(200,20)")
        .call(d3.axisRight(valueScale)
            .tickSize(-220)
            .tickFormat("")
            .tickValues(ticks));

    d3.select(parentDIV)
        .select("svg")
        .append("g")
        .attr("class", "axis")
        .attr("transform", "translate(200,20)")
        .style("stroke-dasharray", ("3, 3"))
        .call(d3.axisRight(valueScale)
            .tickValues([0, 40]));

    var group = d3.select(parentDIV)
        .select("svg")
        .append("g")
        .attr("transform", "translate(0, 20)");

    var link = group.selectAll(".link")
        .data(nodes.descendants().slice(1))
        .enter().append("path")
        .attr("class", "link")
        .attr("d", function (d) {
            return "M" + d.x + "," + valueScale(parseFloat(d.data.data.VALUE))
                + "C" + (d.x + d.parent.x) / 2 + "," + valueScale(parseFloat(d.data.data.VALUE))
                + " " + (d.x + d.parent.x) / 2 + "," + valueScale(parseFloat(d.parent.data.data.VALUE))
                + " " + d.parent.x + "," + valueScale(parseFloat(d.parent.data.data.VALUE));
        });
    //////////

    var sourceCP = nodes.descendants().filter(function (d) {
        return d.data.data.TYPE === 'source'
    });
    var sinkCP = nodes.descendants().filter(function (d) {
        return d.data.data.TYPE === 'sink'
    });
    var saddleCP = nodes.descendants().filter(function (d) {
        return d.data.data.TYPE === 'saddle'
    });
    var mergeNode = nodes.descendants().filter(function (d) {
        return d.data.data.TYPE === 'merge'
    });

    // source
    var sourcePoints = group
        .selectAll('.source')
        .data(sourceCP)
        .enter()
        .append("g")
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + valueScale(parseFloat(d.data.data.VALUE)) + ")";
        })
        .classed('source', true);

    sourcePoints.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 3);

    sourcePoints.exit().remove();

    // sink
    var sinkPoints = group
        .selectAll('.sink')
        .data(sinkCP)
        .enter()
        .append('g')
        .classed('sink', true)
        .attr("transform", function (d) {
            return "translate(" + (d.x - 8) + "," + (valueScale(parseFloat(d.data.data.VALUE)) - 8) + ")";
        })
        .append('path')
        .attr('d', this.sinkSymbol);

    sinkPoints.exit().remove();

    // saddle
    var saddlePoints = group
        .selectAll('.saddle')
        .data(saddleCP)
        .enter().append('g')
        .classed('saddle', true)
        .attr("transform", function (d) {
            return "translate(" + (d.x - 8) + "," + (valueScale(parseFloat(d.data.data.VALUE)) - 8) + ")";
        }).append('path')
        .attr('d', this.saddleSymbol);

    saddlePoints.exit().remove();

    // events
    group.selectAll('.source , .sink, .saddle , .leaf')
        .on("mouseover", function (d) {
            var parent = d3.select(this.parentNode.parentNode.parentNode.parentNode);
            var s = ".contour_diagram svg ." + d.data.data.TYPE;
            parent.selectAll(s)
                .filter(function (g) {
                    return g.SIMPLEX == d.data.data.SIMPLEX
                })
                .classed("selected", true);
        })
        .on("mouseout", function () {
            var parent = d3.select(this.parentNode.parentNode.parentNode.parentNode);
            var s = ".contour_diagram svg .selected";
            parent.selectAll(s)
                .classed("selected", false);
        });
};

Manager.prototype.compChangeContour = function (value) {

    var colorScale = d3.scaleLinear()
        .domain([0, 75])
        .range(['#ccc', '#111']);

    d3.select("#comp_list_div").selectAll(".contour_diagram")
        .selectAll('.arrows')
        .transition()
        .duration(1000)
        .style("stroke", function () {
            var norm = +d3.select(this).attr("data-norm");
            if (norm <= value) {
                var val = d3.rgb(colorScale(norm));
                val.r += 70;
                return val;
            }
            return colorScale(norm);
        });

    var valueScale = d3.scaleLinear()
        .domain([0, 40])
        .range([320, 20]);

    d3.select("#comp_list_div")
        .selectAll(".tree_diagram svg")
        .select(".slider_line")
        .transition()
        .duration(500)
        .attr("transform", function () {
            return "translate(0," + (valueScale(value) + 20) + ")";
        });
};
/*****/

Manager.prototype.tooltip_render = function (tooltip_data) {
    var format = d3.format(".4n");
    var text = "<strong style='color:darkslateblue'>" + tooltip_data.TYPE + "</strong></br> ";
    text +=  "<strong>Degree</strong>: " + tooltip_data.DEGREE + "</br>";
    text +=  "<strong>Value</strong>: " + tooltip_data.VALUE + "</br>";
    text +=  "<strong>Simplex</strong>: " + tooltip_data.SIMPLEX + "</br>";
    text +=  "<strong>Robustness</strong>: " + format(tooltip_data.robustness);
    return text;
};

Manager.prototype.drawSlider = function () {

};