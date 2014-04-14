define(['psd.parser', 'template'], function(PSD, tpl){

    "use strict";

    var doc = document;

    /**
     * layer list
     */
    var layer = {
        el: doc.getElementById("layer"),
        templates: tpl.layerList,
        render: function(layerAndMaskInformation){
            this.el.innerHTML = this.templates(layerAndMaskInformation.layerInfo);
        }
    };

    /**
     * preview the psd on the canvas
     */
    var preview = (function(){
        var el = doc.getElementById("preview");
        var ctx = el.getContext("2d");

        return {
            el: el,
            ctx: ctx,
            /**
             * put data to canvas
             * @param image
             */
            render: function(image){
                var imageData = this.ctx.createImageData(454, 340);
                for(var i = 0, len = imageData.data.length; i < len; i += 4) {
                    imageData.data[i] = image.channel[0][i / 4];
                    imageData.data[i + 1] = image.channel[1][i / 4];
                    imageData.data[i + 2] = image.channel[2][i / 4];
                    imageData.data[i + 3] = image.channel[3][i / 4];
                }
                this.ctx.putImageData(imageData, 0, 0);
            },
            renderLayer: function(layerInfo){
                var record, imageData, excanvas = doc.createElement("canvas"), exctx = excanvas.getContext("2d");

                layerInfo.channelImageData.forEach(function(layer, index){
                    record = layerInfo.layerRecord[index];
                    console.log(record, layer);

                    excanvas.width = record.right - record.left;
                    excanvas.height = record.bottom - record.top;
                    imageData = this.ctx.createImageData(record.right - record.left, record.bottom - record.top);
                    for(var i = 0, len = imageData.data.length; i < len; i += 4) {
                        imageData.data[i] = layer.channel[1].channel[i / 4];
                        imageData.data[i + 1] = layer.channel[2].channel[i / 4];
                        imageData.data[i + 2] = layer.channel[3].channel[i / 4];
                        imageData.data[i + 3] = layer.channel[0].channel[i / 4];
                    }
                    exctx.putImageData(imageData, 0, 0);
                    this.ctx.drawImage(excanvas, record.left, record.top);
                }.bind(this));

            }
        }
    }());

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
//                preview.render(parser.imageData.image);
                preview.renderLayer(parser.layerAndMaskInformation.layerInfo);
                layer.render(parser.layerAndMaskInformation);
            };

            //start read as array buffer
            reader.readAsArrayBuffer(file);
        }
    };

    app.init();
});




