(function($){
    $.fn.mapper = function(userOptions){

        var options = {
            strokeColor: '#0000ff',
            strokeOpacity: 1.0,
            strokeWidth: 3,
            fillColor: '#ff0000',
            fillOpacity: 0.5
        }

        return this.each(function(){
            var $image = $(this);

            $.extend( options, userOptions );

            var $map = $('map[name=' + $image.attr('usemap').substr(1) + ']');


            var $wrapper = $('<div class="jqm-wrapper" />');
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

            $map.find('area').hover(areaHover, clearHoverCanvas);
            $map.find('area').click(areaClick);

            function areaHover(e){
                e.preventDefault();
                drawArea($(this), $hover_canvas[0]);
            }

            function areaClick(e){
                console.log('click worked');
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