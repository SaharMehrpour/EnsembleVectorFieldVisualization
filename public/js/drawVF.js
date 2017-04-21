/**
 * Created by saharmehrpour on 4/20/17.
 */


function DrawVF(vf, vf2) {
    var self = this;

    self.vf = vf;
    self.vf2 = vf2;
    self.svg = d3.select("#vf_svg");

    self.init();

}

DrawVF.prototype.init = function() {
    var self = this;

    var maxX = d3.max(self.vf, function (d) {
        return d.x;
    });
    var minX = d3.min(self.vf, function (d) {
        return d.x;
    });
    var maxY = d3.max(self.vf, function (d) {
        return d.y;
    });
    var minY = d3.min(self.vf, function (d) {
        return d.y;
    });

    self.scaleX = d3.scaleLinear()
        .domain([minX, maxX])
        .range([50,650]);

    self.scaleY = d3.scaleLinear()
        .domain([minY, maxY])
        .range([50,650]);

    d3.select('#change').on('click', function () {
        self.draw2();
    });
};

DrawVF.prototype.draw = function () {
    var self = this;

    var arrows = self.svg.selectAll('.arrow')
        .data(self.vf);

    arrows.enter().append('line')
        .classed('arrow', true)
        .attr('x1', function (d) {
            return self.scaleX(d.x);
        })
        .attr('y1', function (d) {
            return self.scaleY(d.y);
        })
        .attr('x2', function (d) {
            var x1 = self.scaleX(d.x);
            var scaled_vx = self.scaleX(d.vx);
            var scaled_vy = self.scaleY(d.vy);
            var norm = Math.sqrt(scaled_vx * scaled_vx + scaled_vy * scaled_vy);
            return x1 + d.vx;// / norm;
        })
        .attr('y2', function (d) {
            var y1 = self.scaleY(d.y);
            var scaled_vx = self.scaleX(d.vx);
            var scaled_vy = self.scaleY(d.vy);
            var norm = Math.sqrt(scaled_vx * scaled_vx + scaled_vy * scaled_vy);
            return y1 + d.vy;// / norm;

        })
        .attr("marker-end", "url(#arrow)");
};

DrawVF.prototype.draw2 = function () {
    var self = this;

    console.log('draw2');
    self.svg.selectAll('.arrow')
        .transition()
        .duration(1500)
        .attr('x2', function (d, i) {
            var x1 = self.scaleX(d.x);
            return x1 + self.vf2[i].vx;
        })
        .attr('y2', function (d, i) {
            var y1 = self.scaleY(d.y);
            return y1 + self.vf2[i].vy;

        });
};


