(function(){
    var instance = null;

    /**
     * Creates instances for every chart (classes created to handle each chart;
     * the classes are defined in the respective javascript files.
     */
    function init() {
/*
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

        */
///*
        d3.queue()
            .defer(d3.csv, "data/Navid/tris.txt")
            .defer(d3.csv, "data/Navid/xy.txt")
            .defer(d3.csv, "data/Navid/tree_data_ens01.txt")
            .defer(d3.csv, "data/Navid/uv_ens01.txt")
            .defer(d3.csv, "data/Navid/tree_data_ens02.txt")
            .defer(d3.csv, "data/Navid/uv_ens02.txt")
            .defer(d3.csv, "data/Navid/tree_data_ens03.txt")
            .defer(d3.csv, "data/Navid/uv_ens03.txt")
            .defer(d3.csv, "data/Navid/tree_data_ens04.txt")
            .defer(d3.csv, "data/Navid/uv_ens04.txt")
            .defer(d3.csv, "data/Navid/tree_data_ens05.txt")
            .defer(d3.csv, "data/Navid/uv_ens05.txt")
            .defer(d3.csv, "data/Navid/tree_data_ens06.txt")
            .defer(d3.csv, "data/Navid/uv_ens06.txt")
            .defer(d3.csv, "data/Navid/tree_data_ens07.txt")
            .defer(d3.csv, "data/Navid/uv_ens07.txt")
            .defer(d3.csv, "data/Navid/tree_data_ens08.txt")
            .defer(d3.csv, "data/Navid/uv_ens08.txt")
            .defer(d3.csv, "data/Navid/tree_data_ens09.txt")
            .defer(d3.csv, "data/Navid/uv_ens09.txt")
            .defer(d3.csv, "data/Navid/tree_data_ens10.txt")
            .defer(d3.csv, "data/Navid/uv_ens10.txt")
            .defer(d3.csv, "data/Navid/tree_data_ens11.txt")
            .defer(d3.csv, "data/Navid/uv_ens11.txt")
            .defer(d3.csv, "data/Navid/tree_data_ens12.txt")
            .defer(d3.csv, "data/Navid/uv_ens12.txt")
            .defer(d3.csv, "data/Navid/tree_data_ens13.txt")
            .defer(d3.csv, "data/Navid/uv_ens13.txt")
            .defer(d3.csv, "data/Navid/tree_data_ens14.txt")
            .defer(d3.csv, "data/Navid/uv_ens14.txt")
            .defer(d3.csv, "data/Navid/tree_data_ens15.txt")
            .defer(d3.csv, "data/Navid/uv_ens15.txt")
            .await(function (error, faces, verts, cps1, vf1, cps2, vf2, cps3, vf3, cps4, vf4,
                             cps5, vf5, cps6, vf6, cps7, vf7, cps8, vf8, cps9, vf9, cps10, vf10,
                             cps11,vf11,cps12,vf12,cps13,vf13,cps14,vf14,cps15,vf15) {
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

                    var cpsList = [cps1, cps2, cps3, cps4, cps5, cps6, cps7, cps8, cps9, cps10, cps11,cps12,cps13,cps14,cps15];
                    var vfList = [vf1, vf2, vf3, vf4, vf5, vf6, vf7, vf8, vf9, vf10, vf11,vf12,vf13,vf14,vf15];

                    for(var i=0; i<15; i++) {
                        cpsList[i].forEach(function (d) {
                            d.simplexIndex = +d['SIMPLEX'] - 1;
                            d.type = d['TYPE'];
                            d.robustness = +d['ROBUSTNESS'];

                        });
                        vfList[i].forEach(function (d) {
                            d.vx = +d['U'];
                            d.vy = +d['V'];
                        });
                    }

                    var ensData = {
                        'vf': vfList,
                        'treeData': cpsList,
                        'fileLocation': ["img/img1.png", "img/img2.png", "img/img3.png", "img/img4.png", "img/img5.png",
                            "img/img6.png", "img/img7.png", "img/img8.png", "img/img9.png", "img/img10.png",
                            "img/img11.png", "img/img12.png", "img/img13.png", "img/img14.png", "img/img15"]
                    };

                    var manager = new Manager(verts, faces, ensData);

                }
            });
//*/
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