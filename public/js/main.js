(function(){
    var instance = null;

    /**
     * Creates instances for every chart (classes created to handle each chart;
     * the classes are defined in the respective javascript files.
     */
    function init() {

        d3.queue()
            .defer(d3.csv, "data/tile1/tile1.faces.txt")
            .defer(d3.csv, "data/tile1/tile1.verts.txt")
            .defer(d3.csv, "data/tile1/tile1.cps.txt")
            .defer(d3.csv, "data/tile1/tile1.vf.txt")
            .defer(d3.json, "data/tile1/tile1.tree.json")
            .await(function (error, faces, verts, cps, vf, treeData) {
                if (error) {
                    console.error('Oh dear, something went wrong: ' + error);
                }
                else {

                    verts.forEach(function (d) {
                        d.x = +d['X'];
                        d.y = +d['Y'];
                    });

                    faces.forEach(function (d) {
                        d.v1x = verts[+d['T1']].x;
                        d.v2x = verts[+d['T2']].x;
                        d.v3x = verts[+d['T3']].x;
                        d.v1y = verts[+d['T1']].y;
                        d.v2y = verts[+d['T2']].y;
                        d.v3y = verts[+d['T3']].y;
                    });


                    cps.forEach(function (d) {
                        d.simplexIndex = +d['SIMPLEX'];
                    });

                    vf.forEach(function (d) {
                        d.vx = +d['VX'];
                        d.vy = +d['VY'];
                        d.norm = Math.sqrt(d.vx * d.vx + d.vy * d.vy)
                    });

                    var draw_vf = new DrawVF(verts, faces);
                    draw_vf.draw();
                    draw_vf.drawEnsemble(vf, cps, 'img/img1.png');

                    var draw_tree = new DrawTree();
                    draw_tree.draw(treeData);
                }
            });

        /*

        d3.queue()
            .defer(d3.csv, "data/tris.txt")
            .defer(d3.csv, "data/xy.txt")
            .defer(d3.csv, "data/cps1.txt")
            .defer(d3.csv, "data/ens1-uv.csv")
            .defer(d3.csv, "data/cps2.txt")
            .defer(d3.csv, "data/ens2-uv.csv")
            .defer(d3.csv, "data/cps3.txt")
            .defer(d3.csv, "data/ens3-uv.csv")
            .defer(d3.csv, "data/cps4.txt")
            .defer(d3.csv, "data/ens4-uv.csv")
            .defer(d3.csv, "data/cps5.txt")
            .defer(d3.csv, "data/ens5-uv.csv")
            .defer(d3.csv, "data/cps6.txt")
            .defer(d3.csv, "data/ens6-uv.csv")
            .defer(d3.csv, "data/cps7.txt")
            .defer(d3.csv, "data/ens7-uv.csv")
            .defer(d3.csv, "data/cps8.txt")
            .defer(d3.csv, "data/ens8-uv.csv")
            .await(function (error, faces, verts, cps1, vf1, cps2, vf2, cps3, vf3, cps4, vf4,
                             cps5, vf5, cps6, vf6, cps7, vf7, cps8, vf8) {
                if (error) {
                    console.error('Oh dear, something went wrong: ' + error);
                }
                else {


                    verts.forEach(function (d) {
                        d.x = +d['X'];
                        d.y = +d['Y'];
                    });


                    faces.forEach(function (d) {
                        d.v1x = verts[+d['T1'] - 1].x;
                        d.v2x = verts[+d['T2'] - 1].x;
                        d.v3x = verts[+d['T3'] - 1].x;
                        d.v1y = verts[+d['T1'] - 1].y;
                        d.v2y = verts[+d['T2'] - 1].y;
                        d.v3y = verts[+d['T3'] - 1].y;
                    });

                    cps1.forEach(function (d) {
                        d.simplexIndex = +d['SIMPLEX'] - 1;
                    });

                    vf1.forEach(function (d) {
                        d.vx = +d['U'];
                        d.vy = +d['V'];
                    });

                    cps2.forEach(function (d) {
                        d.simplexIndex = +d['SIMPLEX'] - 1;
                    });

                    vf2.forEach(function (d) {
                        d.vx = +d['U'];
                        d.vy = +d['V'];
                    });

                    cps3.forEach(function (d) {
                        d.simplexIndex = +d['SIMPLEX'] - 1;
                    });

                    vf3.forEach(function (d) {
                        d.vx = +d['U'];
                        d.vy = +d['V'];
                    });

                    cps4.forEach(function (d) {
                        d.simplexIndex = +d['SIMPLEX'] - 1;
                    });

                    vf4.forEach(function (d) {
                        d.vx = +d['U'];
                        d.vy = +d['V'];
                    });

                    cps5.forEach(function (d) {
                        d.simplexIndex = +d['SIMPLEX'] - 1;
                    });

                    vf5.forEach(function (d) {
                        d.vx = +d['U'];
                        d.vy = +d['V'];
                    });

                    cps6.forEach(function (d) {
                        d.simplexIndex = +d['SIMPLEX'] - 1;
                    });

                    vf6.forEach(function (d) {
                        d.vx = +d['U'];
                        d.vy = +d['V'];
                    });

                    cps7.forEach(function (d) {
                        d.simplexIndex = +d['SIMPLEX'] - 1;
                    });

                    vf7.forEach(function (d) {
                        d.vx = +d['U'];
                        d.vy = +d['V'];
                    });

                    cps8.forEach(function (d) {
                        d.simplexIndex = +d['SIMPLEX'] - 1;
                    });

                    vf8.forEach(function (d) {
                        d.vx = +d['U'];
                        d.vy = +d['V'];
                    });


                    var draw_vf = new DrawVF(verts, faces);

                    d3.select('#change_VF1').on('click', function () {
                        draw_vf.drawEnsemble(vf1, cps1, 'img/img1.png');
                    });

                    d3.select('#change_VF2').on('click', function () {
                        draw_vf.drawEnsemble(vf2, cps2, 'img/img2.png');
                    });

                    d3.select('#change_VF3').on('click', function () {
                        draw_vf.drawEnsemble(vf3, cps3, 'img/img3.png');
                    });

                    d3.select('#change_VF4').on('click', function () {
                        draw_vf.drawEnsemble(vf4, cps4, 'img/img4.png');
                    });

                    d3.select('#change_VF5').on('click', function () {
                        draw_vf.drawEnsemble(vf5, cps5, 'img/img5.png');
                    });

                    d3.select('#change_VF6').on('click', function () {
                        draw_vf.drawEnsemble(vf6, cps6, 'img/img5.png');
                    });

                    d3.select('#change_VF7').on('click', function () {
                        draw_vf.drawEnsemble(vf7, cps7, 'img/img5.png');
                    });

                    d3.select('#change_VF8').on('click', function () {
                        draw_vf.drawEnsemble(vf8, cps8, 'img/img5.png');
                    });

                    draw_vf.draw();


                }
            });
            */

    }

    /**
     *
     * @constructor
     */
    function Main(){
        if(instance  !== null){
            throw new Error("Cannot instantiate more than one Class");
        }
    }

    /**
     *
     * @returns {Main singleton class |*}
     */
    Main.getInstance = function(){
        var self = this;
        if(self.instance == null){
            self.instance = new Main();

            //called only once when the class is initialized
            init();
        }
        return instance;
    };

    Main.getInstance();
})();