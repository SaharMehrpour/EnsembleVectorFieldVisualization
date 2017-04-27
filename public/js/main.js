(function(){
    var instance = null;

    /**
     * Creates instances for every chart (classes created to handle each chart;
     * the classes are defined in the respective javascript files.
     */
    function init() {
//*
        d3.queue()
            .defer(d3.csv, "data/tile1/tile1.faces.txt")
            .defer(d3.csv, "data/tile1/tile1.verts.txt")
            .defer(d3.csv, "data/tile1/tile1.new.cps.txt")
            .defer(d3.csv, "data/tile1/tile1.vf.txt")
            .defer(d3.csv, "data/tile1/treeData.txt")
            .await(function (error, faces, verts, cps, vf, treeData) {
                if (error) {
                    console.error('Error in reading the data ' + error);
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
                        d.robustness = +d['ROBUSTNESS'];
                    });

                    vf.forEach(function (d, i) {
                        d.vx = +d['VX'];
                        d.vy = +d['VY'];
                        d.norm = Math.sqrt(d.vx * d.vx + d.vy * d.vy);
                        verts[i].norm = Math.sqrt(d.vx * d.vx + d.vy * d.vy);
                    });

                    treeData.forEach(function (d) {
                        d.simplexIndex = +d['SIMPLEX'];
                    });

                    var manager = new Manager(verts, faces, []);
                    manager.individual(vf, cps, treeData, "img/img1.png");
                    manager.compare("ens1", vf, cps, treeData, "img/img1.png")

                }
            });

       // */
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
                    console.error('Error in reading the data: ' + error);
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
                        d.type = d['TYPE'];
                        d.robustness = +d['ROBUSTNESS'];

                    });

                    vf1.forEach(function (d) {
                        d.vx = +d['U'];
                        d.vy = +d['V'];
                    });

                    cps2.forEach(function (d) {
                        d.simplexIndex = +d['SIMPLEX'] - 1;
                        d.type = d['TYPE'];
                        d.robustness = +d['ROBUSTNESS'];
                    });

                    vf2.forEach(function (d) {
                        d.vx = +d['U'];
                        d.vy = +d['V'];
                    });

                    cps3.forEach(function (d) {
                        d.simplexIndex = +d['SIMPLEX'] - 1;
                        d.type = d['TYPE'];
                        d.robustness = +d['ROBUSTNESS'];
                    });

                    vf3.forEach(function (d) {
                        d.vx = +d['U'];
                        d.vy = +d['V'];
                    });

                    cps4.forEach(function (d) {
                        d.simplexIndex = +d['SIMPLEX'] - 1;
                        d.type = d['TYPE'];
                        d.robustness = +d['ROBUSTNESS'];
                    });

                    vf4.forEach(function (d) {
                        d.vx = +d['U'];
                        d.vy = +d['V'];
                    });

                    cps5.forEach(function (d) {
                        d.simplexIndex = +d['SIMPLEX'] - 1;
                        d.type = d['TYPE'];
                        d.robustness = +d['ROBUSTNESS'];
                    });

                    vf5.forEach(function (d) {
                        d.vx = +d['U'];
                        d.vy = +d['V'];
                    });

                    cps6.forEach(function (d) {
                        d.simplexIndex = +d['SIMPLEX'] - 1;
                        d.type = d['TYPE'];
                        d.robustness = +d['ROBUSTNESS'];
                    });

                    vf6.forEach(function (d) {
                        d.vx = +d['U'];
                        d.vy = +d['V'];
                    });

                    cps7.forEach(function (d) {
                        d.simplexIndex = +d['SIMPLEX'] - 1;
                        d.type = d['TYPE'];
                        d.robustness = +d['ROBUSTNESS'];
                    });

                    vf7.forEach(function (d) {
                        d.vx = +d['U'];
                        d.vy = +d['V'];
                    });

                    cps8.forEach(function (d) {
                        d.simplexIndex = +d['SIMPLEX'] - 1;
                        d.type = d['TYPE'];
                        d.robustness = +d['ROBUSTNESS'];
                    });

                    vf8.forEach(function (d) {
                        d.vx = +d['U'];
                        d.vy = +d['V'];
                    });

                    var ensData = [
                        {"id": 1, "vf": vf1, "cps":cps1, "treeData":[], "fileLocation": "img/img1.png"},
                        {"id": 2, "vf": vf2, "cps":cps2, "treeData":[], "fileLocation": "img/img2.png"},
                        {"id": 3, "vf": vf3, "cps":cps3, "treeData":[], "fileLocation": "img/img3.png"},
                        {"id": 4, "vf": vf4, "cps":cps4, "treeData":[], "fileLocation": "img/img4.png"},
                        {"id": 5, "vf": vf5, "cps":cps5, "treeData":[], "fileLocation": "img/img5.png"},
                        {"id": 6, "vf": vf6, "cps":cps6, "treeData":[], "fileLocation": "img/img6.png"},
                        {"id": 7, "vf": vf7, "cps":cps7, "treeData":[], "fileLocation": "img/img7.png"},
                        {"id": 8, "vf": vf8, "cps":cps8, "treeData":[], "fileLocation": "img/img8.png"},
                    ];


                    var manager = new Manager(verts, faces, ensData);

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