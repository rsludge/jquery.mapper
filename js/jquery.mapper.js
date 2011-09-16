(function($){
    $.fn.mapper = function(userOptions){

        var options = {
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

            $image.before($hover_canvas);
            $image.before($event_img);

            $map.find('area').hover(areaHover, clearCanvas);
            $map.find('area').click(areaClick);

            function areaHover(e){
                //console.log('hover worked');
                e.preventDefault();
                drawArea($(this), $hover_canvas[0]);
            }

            function areaClick(e){
                console.log('click worked');
            }

            function drawArea($area, $canvas){
                var context;
                if($area.attr('shape').toLowerCase() == 'poly'){
                    var coords = $area.attr('coords').split(',');
                    context = $canvas.getContext('2d');
                    context.beginPath();
                    context.moveTo(coords[coords.length-2], coords[coords.length-1]); //last point
                    for(var i = 0; i < coords.length; i+=2){
                        context.lineTo(coords[i], coords[i+1]);
                    }
                    context.closePath();
                    context.stroke();
                }else{
                    console.log('drawing for non-polynomial areas not yet implemented');
                }
            }

            function clearCanvas(){
            }
        })
    };
})(jQuery)

$(function(){

    $('.mapper').mapper({

    });
})
