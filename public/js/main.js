(function(){
    var instance = null;

    /**
     * Creates instances for every chart (classes created to handle each chart;
     * the classes are defined in the respective javascript files.
     */
    function init() {
        //Creating instances for each view

        d3.csv("data/ensemble1/vf.txt", function (error, vf) {
            d3.csv("data/ensemble2/vf2.txt", function (error, vf2) {
                vf.forEach(function (d) {
                    d.x = +d['X'];
                    d.y = +d['Y'];
                    d.vx = +d['VX'];
                    d.vy = +d['VY'];
                });

                vf2.forEach(function (d) {
                    d.vx = +d['VX'];
                    d.vy = +d['VY'];
                });

                var draw_vf = new DrawVF(vf, vf2);
                draw_vf.draw();
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