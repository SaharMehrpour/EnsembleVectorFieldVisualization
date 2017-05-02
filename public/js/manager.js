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
    self.genTab = d3.select("#general");
    self.genDiv = d3.select("#gen_div");
    self.clusterTab = d3.select("#cluster");
    self.clusterDiv = d3.select("#cluster_div");


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

    self.genTab.on("click", function () {
        d3.select("#header").selectAll("div").classed("active", false);
        d3.selectAll(".main").classed("hidden", true);
        self.genDiv.classed("hidden", false);
        self.genTab.classed("active", true);
    });

    self.clusterTab.on("click", function () {
        d3.select("#header").selectAll("div").classed("active", false);
        d3.selectAll(".main").classed("hidden", true);
        self.clusterDiv.classed("hidden", false);
        self.clusterTab.classed("active", true);
    });

    //*******************

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

    //************************

    d3.select("#animation").on("click", function () {
        self.genAnimation()
    });

    d3.select("#mean").on("click", function () {
        self.genMean()
    });

    d3.select("#clustering").on("click", function () {
        self.genCluster()
    });

    /* slider */
    d3.select("#slider").on("input", function () {
        d3.select("#slider-value").text(+this.value);
        d3.select("#slider").property("value", +this.value);
        self.compChangeContour(+this.value);
    });

    self.epsilon = 0.1;
    self.number = 1;
    d3.select("#e_slider").on("input", function () {
        d3.select("#e_slider-value").text(+this.value);
        d3.select("#e_slider").property("value", +this.value);
        self.epsilon = +this.value;
        self.clusterCompute();
    });

    d3.select("#n_slider").on("input", function () {
        d3.select("#n_slider-value").text(+this.value);
        d3.select("#n_slider").property("value", +this.value);
        self.number = +this.value;
        self.clusterCompute();
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

    //********************

    self.tooltip = d3.select(".tooltip");

    /* Individual Tab */

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

    /* Gen Tab */

    var svg = d3.select("#gen_svg_div")
        .select("svg");

    svg.append("text")
        .attr("transform", "translate(200,10)")
        .attr("id", "gen_ens_title");

    svg.selectAll('.contour')
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
        .attr("data-norm", 0)
        .style("fill", "white");

    self.allCPs = [];
    for (var index = 0; index < self.ensData.treeData.length; index++)
        self.allCPs = self.allCPs.concat(self.ensData.treeData[index]);

    var sourceCP = self.allCPs.filter(function (d) {
        return d.TYPE === 'source'
    });
    var sinkCP = self.allCPs.filter(function (d) {
        return d.TYPE === 'sink'
    });
    var saddleCP = self.allCPs.filter(function (d) {
        return d.TYPE === 'saddle'
    });
    var leafCP = self.allCPs.filter(function (d) {
        return d.TYPE === 'leaf'
    });

    // source
    var sourcePoints = svg.selectAll('.source')
        .data(sourceCP)
        .enter().append('circle')
        .attr('class','source cp')
        .attr('cx', function (d) {
            return scaleX(self.faces[d.simplexIndex].v1x);
        })
        .attr('cy', function (d) {
            return scaleY(self.faces[d.simplexIndex].v1y);
        })
        .attr('r', 6)
        .style('opacity', 0)
        .attr("fill","red");


    // sink
    var sinkPoints = svg.selectAll('.sink')
        .data(sinkCP)
        .enter().append('g')
        .attr('class','sink cp')
        .attr('transform',function (d) {
            var x0 = scaleX(self.faces[d.simplexIndex].v1x);
            var y0 = scaleY(self.faces[d.simplexIndex].v1y);
            return 'translate(' + x0 + ',' + y0 + ')';
        })
        .style('opacity', 0)
        .attr("fill","red")
        .append('path')
        .attr('d', this.sinkSymbol);

    // saddle
    var saddlePoints = svg.selectAll('.saddle')
        .data(saddleCP)
        .enter().append('g')
        .attr('class','saddle cp')
        .attr('transform',function (d) {
            var x0 = scaleX(self.faces[d.simplexIndex].v1x);
            var y0 = scaleY(self.faces[d.simplexIndex].v1y);
            return 'translate(' + x0 + ',' + y0 + ')';
        })
        .style('opacity', 0)
        .attr("fill","red")
        .append('path')
        .attr('d', this.saddleSymbol);

    // leaf
    var leafPoints = svg
        .selectAll('.leaf')
        .data(leafCP)
        .attr('class','leaf cp')
        .attr('cx', function (d) {
            return scaleX(self.faces[d.simplexIndex].v1x);
        })
        .attr('cy', function (d) {
            return scaleY(self.faces[d.simplexIndex].v1y);
        })
        .attr('r', 6)
        .attr("fill","red")
        .style('opacity', 0);

    // Compute Mean

    self.vfMean = [];
    for (var i=0; i<self.ensData.vf[0].length; i++) {
        var valueX = 0;
        var valueY = 0;
        for (var j=0; j<self.ensData.vf.length; j++) {
            valueX += self.ensData.vf[j][i].vx;
            valueY += self.ensData.vf[j][i].vy;
        }
        var size = self.ensData.vf.length;
        var norm = Math.sqrt(valueX/size * valueX/size + valueY/size * valueY/size);
        self.vfMean.push({vx: valueX/size, vy: valueY/size, norm: norm});
    }

    /* Cluster Tab */

    var colorScale = d3.scaleLinear()
        .domain([0, 75])
        .range(['#ccc', '#111']);

    svg = d3.select("#cluster_svg_div")
        .select("svg");

    svg.selectAll('.contour')
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
        .attr("data-norm", 0)
        .style("fill", function (d, i) {
            return colorScale(self.vfMean[i].norm);
        });

    self.allCPs.forEach(function (d) {
        d.x = self.faces[d.simplexIndex].v1x;
        d.y = self.faces[d.simplexIndex].v1y;
    });

    self.CPSxy = self.allCPs.map(function (d) {
        return {'x': d.x, 'y': d.y, "cluster_id": -1};
    });

    svg.selectAll('.cluster')
        .data(self.allCPs)
        .enter().append('circle')
        .attr('class','cluster')
        .attr('cx', function (d) {
            return scaleX(self.faces[d.simplexIndex].v1x);
        })
        .attr('cy', function (d) {
            return scaleY(self.faces[d.simplexIndex].v1y);
        })
        .attr('r', 6)
        .style("fill", "black")
        .style('opacity', 1);


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

    // events
    d3.select(parentDIV)
        .select("svg")
        .selectAll('.source , .sink , .leaf , .saddle')
        .on("mouseover", function (d) {
            var s = "#indi_contour_div svg ." + d.TYPE;
            d3.selectAll(s)
                .filter(function (g) {
                    return g.SIMPLEX == d.SIMPLEX
                })
                .classed("selected", true);

            s = "#indi_tree_div svg ." + d.TYPE;
            d3.selectAll(s)
                .filter(function (g) {
                    return g.data.data.SIMPLEX == d.SIMPLEX
                })
                .classed("selected", true);
        })
        .on("mouseout", function () {
            d3.selectAll("#indi_contour_div svg .selected, #indi_tree_div svg .selected")
                .classed("selected", false);

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

    // events
    d3.select(parentDIV)
        .select("svg")
        .selectAll('.source , .sink , .saddle , .leaf')
        .on("mouseover", function (d) {
            var s = "#indi_vf_div svg ." + d.TYPE;
            d3.selectAll(s)
                .filter(function (g) {
                    return g.SIMPLEX == d.SIMPLEX
                })
                .classed("selected", true);

            s = "#indi_tree_div svg ." + d.TYPE;
            d3.selectAll(s)
                .filter(function (g) {
                    return g.data.data.SIMPLEX == d.SIMPLEX
                })
                .classed("selected", true);
        })
        .on("mouseout", function () {
            d3.selectAll("#indi_vf_div svg .selected, #indi_tree_div svg .selected")
                .classed("selected", false);

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
                .style("left", (d3.event.pageX + 28) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function () {
            d3.selectAll("#indi_contour_div svg .selected, #indi_vf_div svg .selected")
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
    div.append("div").attr("id", "comp_robustness_" + divID).attr("class", "robustness_diagram").append("svg");

    //self.compDrawVF("#comp_vf_" + divID, vf, treeData);
    self.compDrawContour("#comp_contour_" + divID, vf, treeData);
    self.compDrawTree("#comp_tree_" + divID, treeData);
    self.compDrawRobutsnessDiagram("#comp_robustness_" + divID, treeData);

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
    var leafCP = treeData.filter(function (d) { return d.TYPE === 'leaf' });

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

    var leafPoints = d3.select(parentDIV)
        .select("svg")
        .selectAll('.leaf')
        .data(leafCP);

    leafPoints.enter().append('circle')
        .classed('leaf', true)
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

    leafPoints.exit().remove();

    // events
    d3.select(parentDIV)
        .select("svg")
        .selectAll('.source , .sink , .saddle , .leaf')
        .on("mouseover", function (d) {
            var parent = d3.select(this.parentNode.parentNode.parentNode.parentNode);
            var s = ".tree_diagram svg ." + d.TYPE;
            parent.selectAll(s)
                .filter(function (g) {
                    return g.data.data.SIMPLEX == d.SIMPLEX
                })
                .classed("selected", true);

            s = ".robustness_diagram svg ." + d.TYPE;
            parent.selectAll(s)
                .filter(function (g) {
                    return g.SIMPLEX == d.SIMPLEX
                })
                .classed("selected", true);
        })
        .on("mouseout", function () {
            var parent = d3.select(this.parentNode.parentNode.parentNode.parentNode);
            var s = ".tree_diagram svg .selected";
            parent.selectAll(s)
                .classed("selected", false);

            s = ".robustness_diagram svg .selected";
            parent.selectAll(s)
                .classed("selected", false);

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

    // slider
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
    var leafNode = nodes.descendants().filter(function (d) {
        return d.data.data.TYPE === 'leaf'
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

    // leaf
    var leafPoints = group
        .selectAll('.leaf')
        .data(leafNode)
        .enter()
        .append("g")
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + valueScale(parseFloat(d.data.data.VALUE)) + ")";
        })
        .classed('leaf', true);

    leafPoints.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 3);

    leafPoints.exit().remove();

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

            s = ".robustness_diagram svg ." + d.data.data.TYPE;
            parent.selectAll(s)
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
                .style("left", (d3.event.pageX + 28) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function () {
            var parent = d3.select(this.parentNode.parentNode.parentNode.parentNode);
            var s = ".contour_diagram svg .selected";
            parent.selectAll(s)
                .classed("selected", false);

            s = ".robustness_diagram svg .selected";
            parent.selectAll(s)
                .classed("selected", false);

            self.tooltip.transition()
                .duration(200)
                .style("opacity", 0);
        });
};

Manager.prototype.compChangeContour = function (value) {

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

    valueScale = d3.scaleLinear()
        .domain([0, 40])
        .range([340, 40]);

    d3.select("#comp_list_div")
        .selectAll(".robustness_diagram svg")
        .select(".slider_line")
        .transition()
        .duration(500)
        .attr("transform", function () {
            return "translate(40," + valueScale(value) + ")";
        });

    var colorScale = d3.scaleLinear()
        .domain([0, 75])
        .range(['#ccc', '#111']);

    d3.select("#comp_list_div").selectAll(".contour_diagram")
        .selectAll('.arrows')
        .transition()
        .delay(1000)
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
};

Manager.prototype.compDrawRobutsnessDiagram = function (parentDIV, treeData) {
    var self = this;

    // prepare data
    var robustnessValues = (treeData.filter(function (d) {
        return d.TYPE == 'merge' && d.DEGREE == "0";
    })).map(function (d) {
        return +d.VALUE
    });

    var maxRobust = d3.max(robustnessValues, function (d) {
            return d
        }) + 0.1;

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
    var mergeNode = treeData.filter(function (d) {
        return d.TYPE === 'merge'
    });

    // prepare scale
    var valueScale = d3.scaleLinear()
        .domain([0, 40])
        .range([340, 40]);

    var cpScale = d3.scaleLinear()
        .domain([0, (treeData.length - mergeNode.length)])
        .range([60, 320]);

    // slider
    d3.select(parentDIV)
        .select("svg")
        .append('g')
        .classed('slider_line', true)
        .attr("transform", "translate(40,340)")
        .append('line')
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 320)
        .attr("y2", 0);

    var ticks = robustnessValues;
    ticks.push(0);
    ticks.push(40);

    d3.select(parentDIV)
        .select("svg")
        .append("g")
        .attr("class", "grid")
        .attr("transform", "translate(40,0)")
        .call(d3.axisLeft(valueScale)
            .tickSize(-320)
            .tickFormat("")
            .tickValues(robustnessValues));

    d3.select(parentDIV)
        .select("svg")
        .append("g")
        .attr("class", "axis")
        .attr("transform", "translate(40,0)")
        .style("stroke-dasharray", ("3, 3"))
        .call(d3.axisLeft(valueScale)
            .tickFormat(d3.format(".3f"))
            .tickValues(ticks));

    d3.select(parentDIV).select(".axis")
        .selectAll("text")
        .filter(function () {
            return d3.select(this).text() == "40.000"
        })
        .text("∞");

    // draw cps
    var sourcePoints = d3.select(parentDIV)
        .select("svg")
        .selectAll('.source')
        .data(sourceCP);

    sourcePoints.enter().append('circle')
        .classed('source', true)
        .attr('cx', function (d, i) {
            return cpScale(i)
        })
        .attr('cy', 340)
        .attr('r', 5)
        .merge(sourcePoints)
        .transition()
        .duration(1500)
        .attr('cy', function (d) {
            var y0 = valueScale.range()[1];
            if (d.robustness < maxRobust)
                y0 = valueScale(+d.robustness);
            return y0;
        });

    sourcePoints.exit().remove();

    var sinkPoints = d3.select(parentDIV)
        .select("svg")
        .selectAll('.sink')
        .data(sinkCP)
        .enter().append('g')
        .classed('sink', true)
        .attr('transform', function (d, i) {
            return "translate(" + cpScale(sourceCP.length + i) + ",340)";
        })
        .append('path')
        .attr('d', this.sinkSymbol);

    sinkPoints.exit().remove();

    d3.select(parentDIV)
        .select("svg")
        .selectAll('.sink')
        .data(sinkCP)
        .transition()
        .duration(1500)
        .attr('transform', function (d, i) {
            var x0 = cpScale(sourceCP.length + i);
            var y0 = valueScale.range()[1] - 5;
            if (d.robustness < maxRobust)
                y0 = valueScale(d.robustness) - 5;
            return 'translate(' + x0 + ',' + y0 + ')';
        });


    var saddlePoints = d3.select(parentDIV)
        .select("svg")
        .selectAll('.saddle')
        .data(saddleCP)
        .enter().append('g')
        .classed('saddle', true)
        .attr('transform', function (d, i) {
            return "translate(" + cpScale(sourceCP.length + sinkCP.length + i)
                + ",340)";
        })
        .append('path')
        .attr('d', this.saddleSymbol);

    saddlePoints.exit().remove();

    d3.select(parentDIV)
        .select("svg")
        .selectAll('.saddle')
        .data(saddleCP)
        .transition()
        .duration(1500)
        .attr('transform', function (d, i) {
            var x0 = cpScale(sourceCP.length + sinkCP.length + i);
            var y0 = valueScale.range()[1] - 5;
            if (d.robustness < maxRobust)
                y0 = valueScale(d.robustness) - 5;
            return 'translate(' + x0 + ',' + y0 + ')';
        });

    var leafPoints = d3.select(parentDIV)
        .select("svg")
        .selectAll('.leaf')
        .data(leafCP);

    leafPoints.enter().append('circle')
        .classed('leaf', true)
        .attr('cx', function (d, i) {
            return cpScale(sourceCP.length + sinkCP.length + saddleCP.length + i);
        })
        .attr('cy', 340)
        .attr('r', 5)
        .merge(sourcePoints)
        .transition()
        .duration(1500)
        .attr('cy', function (d) {
            var y0 = valueScale.range()[1];
            if (d.robustness < maxRobust)
                y0 = valueScale(d.robustness);
            return y0;
        });

    leafPoints.exit().remove();

    // events
    d3.select(parentDIV)
        .select("svg")
        .selectAll('.source , .sink , .saddle , .leaf')
        .on("mouseover", function (d) {
            var parent = d3.select(this.parentNode.parentNode.parentNode.parentNode);
            var s = ".tree_diagram svg ." + d.TYPE;
            parent.selectAll(s)
                .filter(function (g) {
                    return g.data.data.SIMPLEX == d.SIMPLEX
                })
                .classed("selected", true);

            s = ".contour_diagram svg ." + d.TYPE;
            parent.selectAll(s)
                .filter(function (g) {
                    return g.SIMPLEX == d.SIMPLEX
                })
                .classed("selected", true);
        })
        .on("mouseout", function () {
            var parent = d3.select(this.parentNode.parentNode.parentNode.parentNode);
            var s = ".tree_diagram svg .selected";
            parent.selectAll(s)
                .classed("selected", false);

            s = ".contour_diagram svg .selected";
            parent.selectAll(s)
                .classed("selected", false);

        });

};

/*****/

Manager.prototype.genAnimation = function () {

    var self = this;

    var svg = d3.select("#gen_svg_div").select("svg")
        .selectAll('.cp')
        .style('opacity', 0);

    svg.selectAll('.contour')
        .attr("fill", "white");

    svg.selectAll('.cluster')
        .style('opacity', 0);

    // Perform animation
    for (var i = 0; i < self.ensData.vf.length; ++i)
        self.genDrawContour(self.ensData.vf[i], self.ensData.treeData[i], i)
};

Manager.prototype.genDrawContour = function (vf, treeData, index) {
    var self = this;

    var svg = d3.select("#gen_svg_div").select("svg");

    var colorScale = d3.scaleLinear()
        .domain([0, 75])
        .range(['#ccc', '#111']);

    d3.select("#gen_ens_title")
        .transition()
        .delay(1100 * (index + 1))
        .text(function () {
            return "Ensemble " + (index + 1)
        });

    svg.selectAll('.contour')
        .attr("fill", function () {
            var norm = +d3.select(this).attr("data-norm");
            return colorScale(norm);
        })
        .transition()
        .delay(1100 * (index + 1))
        .duration(1000)
        .attr("data-norm", function (d, i) {
            return Math.sqrt(vf[i].vx * vf[i].vx + vf[i].vy * vf[i].vy);
        })
        .style("fill", function (d, i) {
            var norm = Math.sqrt(vf[i].vx * vf[i].vx + vf[i].vy * vf[i].vy);
            return colorScale(norm);
        });

    svg.selectAll('.cp')
        .filter(function (d) {
            return d.ensemble == index;
        })
        .style("opacity", function () {
            return d3.select(this).style("opacity");
        })
        .transition()
        .delay(1100 * (index + 1))
        .duration(70)
        .style('opacity', 1);

    svg.selectAll('.cp')
        .filter(function (d) {
            return d.ensemble != index;
        })
        .style("opacity", function () {
            return d3.select(this).style("opacity");
        })
        .transition()
        .delay(1100 * (index + 1))
        .duration(70)
        .style('opacity', 0);

};

Manager.prototype.genMean = function () {

    var self = this;

    var svg = d3.select("#gen_svg_div").select("svg").transition();

    var colorScale = d3.scaleLinear()
        .domain([0, 75])
        .range(['#ccc', '#111']);

    d3.select("#gen_ens_title")
        .transition()
        .text(function () {
            return "Mean"
        });

    svg.selectAll('.contour')
        .attr("fill", function () {
            var norm = +d3.select(this).attr("data-norm");
            return colorScale(norm);
        })
        .transition()
        .duration(1000)
        .attr("data-norm", function (d, i) {
            return self.vfMean[i].norm;
        })
        .style("fill", function (d, i) {
            return colorScale(self.vfMean[i].norm);
        });

    svg.selectAll('.cluster')
        .style('opacity', 0);

    svg.selectAll('.cp')
        .style("opacity", function () {
            return d3.select(this).style("opacity");
        })
        .transition()
        .duration(70)
        .style("fill","red")
        .style('opacity', 0.15);
};

Manager.prototype.genCluster = function () {
    var self = this;

    var scaleX = d3.scaleLinear()
        .domain([self.minX, self.maxX])
        .range([30, 470]);

    var scaleY = d3.scaleLinear()
        .domain([self.minY, self.maxY])
        .range([30, 570]);

    var svg = d3.select("#gen_svg_div").select("svg");
    svg.transition();

    d3.select("#gen_ens_title")
        .text(function () {
            return "Cluster with epsilon=0.3"
        });

    var colorScale = d3.scaleLinear()
        .domain([0, 75])
        .range(['#ccc', '#111']);

    svg.selectAll('.contour')
        .attr("fill", function () {
            var norm = +d3.select(this).attr("data-norm");
            return colorScale(norm);
        })
        .transition()
        .duration(1000)
        .attr("data-norm", function (d, i) {
            return self.vfMean[i].norm;
        })
        .style("fill", function (d, i) {
            return colorScale(self.vfMean[i].norm);
        });

    svg.selectAll('.cp')
        .style('opacity', 0);

    console.log(self.ensData.cluster);

    var clusters = svg.selectAll('.cluster')
        .data(self.ensData.cluster);

    clusters.enter()
        .append('circle')
        .attr("class", "cluster")
        .attr('cx', function (d) {
            return scaleX(d.x);
        })
        .attr('cy', function (d) {
            return scaleY(d.y);
        })
        .attr('r', 6)
        .style('fill', 'green')
        .style('opacity', 0)
        .merge(clusters)
        .transition()
        .duration(500)
        .style('opacity', 1);

    // events
    svg.selectAll('.cluster ')
        .on("mouseover", function (d) {

            self.tooltip.transition()
                .duration(200)
                .style("opacity", 1);
            self.tooltip.html(function () {
                return self.tooltip_render_cluster(d);
            })
                .style("left", (d3.event.pageX + 28) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function () {

            self.tooltip.transition()
                .duration(200)
                .style("opacity", 0);
        });
};

/*****/

Manager.prototype.clusterCompute = function () {

    var self = this;
    for (var i=0; i<self.CPSxy.length; i++)
        self.CPSxy[i].cluster_id = -1;

    dbscan.run(self.CPSxy, self.CPSxy.length, self.epsilon, self.number, dbscan.euclidean_dist);

    var colorScale = d3.scaleOrdinal(d3.schemeCategory20b);

    d3.select("#cluster_svg_div")
        .select("svg")
        .selectAll('.cluster')
        .attr("data-cluster", function (d, i) {
            return self.CPSxy[i].cluster_id
        })
        .style("fill", function (d, i) {
            if (self.CPSxy[i].cluster_id === -2)
                return "none";
            return colorScale(self.CPSxy[i].cluster_id)
        });

};

/*****/

Manager.prototype.tooltip_render = function (tooltip_data) {
    var format = d3.format(".4n");
    var text = "<strong style='color:darkslateblue'>" + tooltip_data.TYPE + "</strong></br> ";
    text +=  "<strong>Degree</strong>: " + tooltip_data.DEGREE + "</br>";
    text +=  "<strong>Value</strong>: " + tooltip_data.VALUE + "</br>";
    text +=  "<strong>Simplex</strong>: " + tooltip_data.SIMPLEX + "</br>";
    if (tooltip_data.robustness != 3.4028235e+38)
        text +=  "<strong>Robustness</strong>: " + format(tooltip_data.robustness);
    else
        text +=  "<strong>Robustness</strong>: " + "&#x221e;";

    return text;
};

Manager.prototype.tooltip_render_cluster = function (tooltip_data) {
    var format = d3.format(".4n");
    var text = "<strong style='color:darkslateblue'> Cluster Size: " + "</strong>" +
        + tooltip_data.CLUSTER_SIZE + "</br> ";
    text += "<strong style='color:darkslateblue'> Number of Sources: " + "</strong>" +
        + tooltip_data.N_SOURCE + "</br> ";
    text += "<strong style='color:darkslateblue'> Number of Sinks: " + "</strong>" +
        + tooltip_data.N_SINK + "</br> ";
    text += "<strong style='color:darkslateblue'> Number of Saddles: " + "</strong>" +
        + tooltip_data.N_SADDLE + "</br> ";

    var type = "source";
    var max_num = +tooltip_data.N_SOURCE;
    type = +tooltip_data.N_SINK > max_num ? "sink" : type;
    max_num = +tooltip_data.N_SINK > max_num ? +tooltip_data.N_SINK : max_num;
    type = +tooltip_data.N_SADDLE > max_num ? "saddle" : type;
    max_num = +tooltip_data.N_SADDLE > max_num ? +tooltip_data.N_SADDLE : max_num;

    var prob = max_num/+tooltip_data.CLUSTER_SIZE.toString()
    text += "With probability "+ format(prob)
        + " this point is <strong style='color:darkred'>" + type + "</strong></br> ";

    text += "<strong style='color:darkslateblue'> Average Robustness: " + "</strong>";
    if (tooltip_data.MEDROBUSTNESS != 0)
        text +=  format(tooltip_data.MEDROBUSTNESS);
    else
        text +=  "&#x221e;";

    return text;
};
