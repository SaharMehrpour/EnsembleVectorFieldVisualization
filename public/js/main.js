(function(){
    var instance = null;

    /**
     * Creates instances for every chart (classes created to handle each chart;
     * the classes are defined in the respective javascript files.
     */
    function init() {

        d3.csv("data/tris.txt", function (error, faces) {
            d3.csv("data/xy.txt", function (error, verts) {
                d3.csv("data/cps1.txt", function (error, cps1) {
                    d3.csv("data/ens1-uv.csv", function (error, vf1) {
                        d3.csv("data/cps2.txt", function (error, cps2) {
                            d3.csv("data/ens2-uv.csv", function (error, vf2) {
                                d3.csv("data/cps3.txt", function (error, cps3) {
                                    d3.csv("data/ens3-uv.csv", function (error, vf3) {
                                        d3.csv("data/cps4.txt", function (error, cps4) {
                                            d3.csv("data/ens4-uv.csv", function (error, vf4) {
                                                d3.csv("data/cps5.txt", function (error, cps5) {
                                                    d3.csv("data/ens5-uv.csv", function (error, vf5) {

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

                                                        draw_vf.draw();

                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
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