/**
 * Created by saharmehrpour on 4/20/17.
 */


function DrawVF(parentID, verts, faces) {
    var self = this;

    self.verts = verts;
    self.faces = faces;
    self.svg = d3.select(parentID).select("svg");

    self.init();

}

DrawVF.prototype.init = function() {
    var self = this;

    var maxX = d3.max(self.verts, function (d) { return d.x; });
    var minX = d3.min(self.verts, function (d) { return d.x; });
    var maxY = d3.max(self.verts, function (d) { return d.y; });
    var minY = d3.min(self.verts, function (d) { return d.y; });

    self.scaleX = d3.scaleLinear()
        .domain([minX, maxX])
        .range([30,470]);

    self.scaleY = d3.scaleLinear()
        .domain([minY, maxY])
        .range([30,570]);

    self.colorScale = d3.scaleLinear()
        .domain([0,20]) // TODO generalize
        .range(['#ccc', '#111']);

    var arrows = self.svg.selectAll('.arrows')
        .data(self.verts);

    arrows.enter().append('line')
        .classed('arrows', true)
        .attr('x1', function (d) {
            return self.scaleX(d.x);
        })
        .attr('y1', function (d) {
            return self.scaleY(d.y);
        })
        .attr('x2', function (d) {
            return self.scaleX(d.x);
        })
        .attr('y2', function (d) {
            return self.scaleY(d.y);
        });

};

DrawVF.prototype.draw = function (vf, cps, fileLocation) {
    var self = this;

    self.svg.selectAll('.arrows')
        .transition()
        .duration(1500)
        .attr('x2', function (d, i) {
            var x1 = self.scaleX(d.x);
            return x1 + vf[i].vx;
        })
        .attr('y2', function (d, i) {
            var y1 = self.scaleY(d.y);
            return y1 + vf[i].vy;

        })
        .attr("marker-end", "url(#arrow)");

    // TODO fix this:

    var cpoints = self.svg.selectAll('.cps')
        .data(cps);

    cpoints.enter().append('path')
        .classed('cps', true)
        .merge(cpoints)
        //.transition()
        //.duration(1500)
        .attr('d', function (d) {
            var v1x = self.scaleX(self.faces[d.simplexIndex].v1x);
            var v2x = self.scaleX(self.faces[d.simplexIndex].v2x);
            var v3x = self.scaleX(self.faces[d.simplexIndex].v3x);
            var v1y = self.scaleY(self.faces[d.simplexIndex].v1y);
            var v2y = self.scaleY(self.faces[d.simplexIndex].v2y);
            var v3y = self.scaleY(self.faces[d.simplexIndex].v3y);
            return 'M'+v1x+' '+v1y+' L'+v2x+' '+v2y+' L'+v3x+' '+v3y+' Z' ;
        });

    cpoints.exit().remove();

    //d3.select('img').attr('src', fileLocation);
};


