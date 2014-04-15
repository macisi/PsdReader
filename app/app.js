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
            this.canvas.width = this.data.header.columns;
            this.canvas.height = this.data.header.rows;
            this.el = layerEl;
            //set global alpha
            this.ctx.globalAlpha = this.data.record.opacity / 255;

            this.el.addEventListener("change", this.toggle.bind(this), false);
        },
        render: function(){
            var excanvas = doc.createElement("canvas"),
                exctx = excanvas.getContext("2d"),
                record = this.data.record,
                layer = this.data.channelData,
                width = record.right - record.left,
                height = record.bottom - record.top,
                imageData;

            if (width === 0 || height === 0) return;

            excanvas.width = width;
            excanvas.height = height;
            imageData = this.ctx.createImageData(width, height);

            for(var i = 0, len = imageData.data.length; i < len; i += 4) {
                imageData.data[i] = layer.channel[1].channel[i / 4];
                imageData.data[i + 1] = layer.channel[2].channel[i / 4];
                imageData.data[i + 2] = layer.channel[3].channel[i / 4];
                imageData.data[i + 3] = layer.channel[0].channel[i / 4];
            }
            exctx.putImageData(imageData, 0, 0);
            this.ctx.drawImage(excanvas, record.left, record.top);
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
        render: function(parser){
            var frag = "";
            parser.layerAndMaskInformation.layerInfo.layerRecord.forEach(function(record, index){
                if (record.flags !== 24) {
                    // 8 is normal layer, 24 is a group, here just ignore when group
                    frag += this.templates({
                        record: record,
                        index: index
                    });
                }
            }.bind(this));
            this.el.innerHTML = frag;

            //initialize Layer
            Array.prototype.forEach.call(this.el.querySelectorAll("li"), function(li){
                var id = + li.dataset.id;
                preview.push(new Layer(li, {
                    header: parser.header,
                    channelData: parser.layerAndMaskInformation.layerInfo.channelImageData[id],
                    record: parser.layerAndMaskInformation.layerInfo.layerRecord[id]
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
            var reader = new FileReader();

            reader.onload = function(e){
                var parser = new PSD.Parser(e.target.result);
                parser.parse();
                console.log(parser);
                layerList.render(parser);
            };

            //start read psd file
            reader.readAsArrayBuffer(file);
        }
    };

    app.init();
});




