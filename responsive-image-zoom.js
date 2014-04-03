$.fn.responsiveImageZoom = function(config){
    
    var $config = {
        event: 'doubletap'
    };
    $.extend($config, config);
    
    $(this).each(function(){

        var $el = $(this),
            $img,
            $offset,
            $dimensions = {},
            $max = {},
            $dragStart = {};
            
        var zoomImage = function(e){
            
            console.log('zoomImage');

            $offset = $el.offset();
            $dimensions = {
                width: $el.width(),
                height: $el.height()
            };

            $img = $(e.target);
            if($img.data('zoomed')){

                // Return image back to original state
                $img.css({
                    maxWidth: '100%',
                    position: 'static',
                    top: 'auto',
                    left: 'auto'
                });
                $img.data('zoomed', false);
                $img.removeClass('responsive-image-zoom-active');
                $img = false;
            }
            else{

                // Set element dimensions so zooming is only shown inside original box
                $el.css({
                    position: 'relative',
                    overflow: 'hidden',
                    height: $dimensions.height,
                    width: $dimensions.width
                });

                $img.css({
                    maxWidth: 'none',
                    position: 'absolute'
                }).css({
                    left: -($img.width() - $dimensions.width) / 2,
                    top: -($img.height() - $dimensions.height) / 2
                });
                $img.data('zoomed', true);
                $img.addClass('responsive-image-zoom-active');

                $max = {
                    left: parseInt(-($img.width() - $dimensions.width)),
                    top: parseInt(-($img.height() - $dimensions.height))
                };
            }
        };

        var moveZoomArea = function(e){
            if(!$img)
                return;

            var horizontalPixelRatio = ($img.width() - $dimensions.width) / $dimensions.width;
            var verticalPixelRatio = ($img.height() - $dimensions.height) / $dimensions.height;

            $img.css({
                left: Math.max($max.left, -((e.pageX - $offset.left) * horizontalPixelRatio)),
                top: Math.max($max.top, -((e.pageY - $offset.top) * verticalPixelRatio))
            });
        };

        var startDragging = function(e){
            if(!$img)
                return;

            $dragStart = {
                left: parseInt($img.css('left')),
                top: parseInt($img.css('top'))
            };
        };
        var continueDragging = function(e){
            if(!$img)
                return;

            $img.css({
                left: Math.max($max.left, Math.min(0, e.gesture.deltaX + $dragStart.left)),
                top: Math.max($max.top, Math.min(0, e.gesture.deltaY + $dragStart.top))
            });
        };

        // All Devices
        $(this).find('img').hammer().on($config.event, zoomImage);

        // Desktop
        $(this).on('mousemove', moveZoomArea);

        // Mobile
        $(this).hammer().on('dragstart', startDragging);
        $(this).hammer().on('drag', continueDragging);
        $(document).on('touchmove', function(e){
            if($img && $img.data('zoomed') && $(e.target).hasClass('responsive-image-zoom-active'))
                e.preventDefault();
        });
    
    });
};