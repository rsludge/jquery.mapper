(function($){
    $.fn.mapper = function(userOptions){

        var options = {
            strokeColor: '#0000ff',
            strokeOpacity: 1.0,
            strokeWidth: 3,
            fillColor: '#ff0000',
            fillOpacity: 0.5,
            hoverRelated: true,
            allowSelect: true
        }


        // define function 'trim' for old browsers
        if(typeof(String.prototype.trim) === "undefined")
        {
            String.prototype.trim = function()
            {
                return String(this).replace(/^\s+|\s+$/g, '');
            };
        }


        return this.each(function(){
            var $image = $(this);

            $.extend( options, userOptions );

            var $map = $('map[name=' + $image.attr('usemap').substr(1) + ']');

            // related objects
            var $related_objects  = findAreasRelated($map.find('area'));

            var $wrapper = $('<div class="jqm-wrapper" />');
            $wrapper.css({
                position: 'relative'
            })
            $image.wrap($wrapper);

            // transparent image to catch events
            var $event_img = $('<img class="event-image" width="'+ $image.width() +'" height="' + $image.height() + '" />');
            $event_img.css({
                opacity: 0,
                position: 'absolute',
                top: 0,
                left: 0
            });
            $event_img.attr('usemap', $image.attr('usemap'));
            $event_img.attr('src', $image.attr('src'));


            // create canvas
            var $hover_canvas = $('<canvas class="jqm-hovers" />');

            $hover_canvas.attr('width', $image.width());
            $hover_canvas.attr('height', $image.height());
            $hover_canvas.css({
                top: 0,
                left: 0,
                position: 'absolute'
            })


            // set drawing style
            var context = $hover_canvas[0].getContext('2d');
            context.fillStyle = "rgba(" + hexR(options.fillColor) + ", "
                + hexG(options.fillColor) + ", "
                + hexB(options.fillColor) + ", "
                + options.fillOpacity + ")";

            context.strokeStyle = "rgba(" + hexR(options.strokeColor) + ", "
                + hexG(options.strokeColor) + ", "
                + hexB(options.strokeColor) + ", "
                + options.strokeOpacity + ")";

            context.lineWidth = options.strokeWidth;

            $image.before($hover_canvas);
            $image.before($event_img);


            //events
            $map.find('area').hover(areaHover, areaUnhover);
            $map.find('area').click(areaClick);

            // draw area when hover on related object
            $related_objects.hover(function(){
                var rels = $(this).attr('rel').split(',');
                for(var rel_ind = 0; rel_ind < rels.length; rel_ind++){
                    // check if rel is equal to area id, because rel="ar23" may match with [rel*=ar2]
                    $map.find('#' + rels[rel_ind].trim()).each(function(){
                        drawArea($(this), $hover_canvas[0]);
                    })
                }
            }, clearHoverCanvas);

            function areaHover(e){
                e.preventDefault();
                drawArea($(this), $hover_canvas[0]);
                if(options.hoverRelated){
                    var $relates = findAreasRelated($(this));
                    $relates.addClass('map-hover');
                }
            }

            function areaUnhover(){
                clearHoverCanvas();
                if(options.hoverRelated){
                    $related_objects.removeClass('map-hover');
                }
            }

            function areaClick(e){
                if(options.allowSelect){
                    e.preventDefault();
                    clearHoverCanvas();

                    var $select_canvas = $('canvas#select_canvas_' + $(this).index($map.find('area')));
                    if(!$(this).hasClass('selected')){
                        $(this).addClass('selected');
                        if($select_canvas.length){
                            drawArea($(this), $select_canvas[0]);
                        }else{
                            $select_canvas = $('<canvas class="select_canvas" id="select_canvas_' + $(this).index($map.find('area').selector) + '" />');
                            $select_canvas.attr('width', $image.width());
                            $select_canvas.attr('height', $image.height());
                            $select_canvas.css({
                                top: 0,
                                left: 0,
                                position: 'absolute'
                            })
                            $event_img.before($select_canvas);
                            drawArea($(this), $select_canvas[0]);
                        }
                    }
                }
            }

            function drawArea($area, $canvas){
                var context = $canvas.getContext('2d');
                if($area.attr('shape').toLowerCase() == 'poly'){
                    var coords = $area.attr('coords').split(',');
                    context.beginPath();
                    context.moveTo(coords[coords.length-2], coords[coords.length-1]); //last point
                    for(var i = 0; i < coords.length; i+=2){
                        context.lineTo(coords[i], coords[i+1]);
                    }
                    context.closePath();
                    context.stroke();
                    context.fill();
                }else{
                    console.log('drawing for non-polynomial areas not yet implemented');
                }
            }

            function clearHoverCanvas(){
                clearCanvas($hover_canvas[0]);
            }

            function clearCanvas($canvas){
                var context = $canvas.getContext('2d');
                context.clearRect(0, 0, $canvas.width, $canvas.height);
            }

            function findAreasRelated($areas){
                var result = $('');
                $areas.each(function(){
                    var $related = $('[rel*=' + $(this).attr('id') + ']'); // find objects with rel of areas ids
                    if($related.length){
                        $related.each(function(){
                            var rels = $(this).attr('rel').split(',');
                            for(var rel_ind = 0; rel_ind < rels.length; rel_ind++){
                                // check if rel is equal to area id, because rel="ar23" may match with [rel*=ar2]
                                if($map.find('#' + rels[rel_ind].trim()).length){
                                    result = result.add($(this));
                                }
                            }
                        })
                    }
                });
                return result;
            }

            function hexR(h){
                return parseInt((cutHex(h)).substring(0,2),16);
            }
            function hexG(h){
                return parseInt((cutHex(h)).substring(2,4),16);
            }
            function hexB(h){
                return parseInt((cutHex(h)).substring(4,6),16);
            }
            function cutHex(h){
                return (h.charAt(0)=="#") ? h.substring(1,7):h;
            }

        })
    };
})(jQuery)

$(function(){

    $('.mapper').mapper({

    });
})