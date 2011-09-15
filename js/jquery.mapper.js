(function($){
    $.fn.mapper = function(userOptions){

        var options = {
        }
        
  
        return this.each(function(){
            var $image = $(this);

            $.extend( options, userOptions );

            var $map = $('map[name=' + $image.attr('usemap') + ']');        

            var $wrapper = $('<div class="jqm-wrapper" />');
            $image.wrap($wrapper);
            
            // create canvas
            var $canvas = $('<canvas class="jqm-hovers" />');
            $canvas.width = $image.width;
            $canvas.height = $image.height;

            $image.after($canvas);

            $canvas.find('area').hover(areaHover, clearCanvas);
            $canvas.find('area').click(areaClick);

            function areaHover(e){
                e.preventDefault();
                drawArea($(this));
            }

            function areaClick(e){
            
            }

            function drawArea($area){
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
