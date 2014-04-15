define(['psd.parser', 'template'], function(PSD, tpl){

    "use strict";

    var doc = document;

    /**
     * layer constructor
     * @constructor
     */
    function Layer(layerEl, data){
        this.data = data;
        this.init(layerEl);
        console.log(data)
    }

    Layer.prototype = {
        constructor: Layer,
        init: function(layerEl){
            this.canvas = doc.createElement("canvas");
            this.ctx = this.canvas.getContext("2d");
            this.canvas.width = this.data.header.cols;
            this.canvas.height = this.data.header.rows;
            this.el = layerEl;
            //set global alpha
            this.ctx.globalAlpha = this.data.opacity / 255;

            this.el.addEventListener("change", this.toggle.bind(this), false);
        },
        render: function(){
            var excanvas = doc.createElement("canvas"),
                exctx = excanvas.getContext("2d"),
                la = this.data.la,
                imageData;

            if (la.width === 0 || la.height === 0) return;

            if (la.visible === 0) {
                this.canvas.style.display = "none";
                this.el.querySelector("input").checked = false;
            }

            excanvas.width = la.width;
            excanvas.height = la.height;
            imageData = this.ctx.createImageData(la.width, la.height);

            for(var i = 0, len = la.image.pixelData.length; i < len; i += 1) {
                imageData.data[i] = la.image.pixelData[i];
            }
            exctx.putImageData(imageData, 0, 0);
            this.ctx.drawImage(excanvas, la.left, la.top);
        },
        toggle: function(e){
            this.canvas.style.display = e.target.checked ? "": "none";
        }
    };

    /**
     * layer list
     */
    var layerList = {
        el: doc.getElementById("layer"),
        templates: tpl.layerList,
        render: function(psd){
            var frag = "";
            psd.layers.forEach(function(lay, index){
                if (lay.image) {
                    frag += this.templates({
                        layer: lay,
                        index: index
                    });
                }
            }.bind(this));
            this.el.innerHTML = frag;

            //initialize Layer
            Array.prototype.forEach.call(this.el.querySelectorAll("li"), function(li){
                var id = + li.dataset.id;
                preview.push(new Layer(li, {
                    header: psd.header,
                    la: psd.layers[id]
                }));
            });
        }
    };

    /**
     * preview the psd on the canvas
     */
    var preview = {
        el: doc.getElementById("preview"),
        layers: [],
        init: function(){

        },
        push: function(layer){
            layer.render();
            this.layers.push(layer);
            this.el.appendChild(layer.canvas);
            layer.canvas.style.zIndex = 1000 - this.layers.length;
        }
    };

    var app = {
        el: doc.getElementById("file"),
        init: function(){
            this.el.addEventListener("change", this.getPsdFile, false);
        },
        /**
         * get psd file form input element
         * @param e
         */
        getPsdFile: function(e){
            var file = e.target.files[0];

            PSD.fromFile(file, function(psd){
                psd.setOptions({
                    layerImages: true
                });
                psd.parse();
                console.log(psd);
                layerList.render(psd);
            });
        }
    };

    app.init();
});




