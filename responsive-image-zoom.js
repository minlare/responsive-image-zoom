(function($){

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
                
            // Return image back to original state
            var imageNatural = function(){
                $img.css({
                    maxWidth: '',
                    width: '',
                    position: '',
                    display: '',
                    left: '',
                    top: ''
                });
                $img.data('zoomed', false);
                $img.removeClass('responsive-image-zoom-active');
                $img = false;
            };
            
            // Enlarge image for zooming
            var imageZoomed = function(){
                $img.css({
                    maxWidth: 'none',
                    width: 'auto',
                    position: 'absolute',
                    display: 'block'
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
            };

            var zoomImage = function(e){

                $offset = $el.offset();
                $dimensions = {
                    width: $el.width(),
                    height: $el.height()
                };

                $img = $(e.target);
                if($img.data('zoomed'))
                    imageNatural();
                else{

                    // Set element dimensions so zooming is only shown inside original box
                    $el.css({
                        position: 'relative',
                        overflow: 'hidden',
                        height: $dimensions.height,
                        width: $dimensions.width
                    });

                    if(!$img.data('url'))
                        imageZoomed();
                    else 
                        // handle lazy loading
                        if($img.next('.responsive-image-zoom-lazyload').length > 0){
                            $img = $img.next('.responsive-image-zoom-lazyload');
                            imageZoomed();
                        }
                        else{
                            $img = $('<img/>', {src: $img.data('url'), class: 'responsive-image-zoom-lazyload'});
                            $img.on('load', function(){
                                $el.append($img);
                                imageZoomed();
                            });
                        }
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
            
            var resetZoom = function(e){
                $el.css({
                    position: '',
                    overflow: '',
                    height: '',
                    width: ''
                });
                
                if($img && $img.data('zoomed'))
                    imageNatural();
            };

            // All Devices
            $(this).hammer().on($config.event, zoomImage);

            // Desktop
            $(this).on('mousemove', moveZoomArea);

            // Mobile
            $(this).hammer().on('dragstart', startDragging);
            $(this).hammer().on('drag', continueDragging);
            $(document).on('touchmove', function(e){
                if($img && $img.data('zoomed') && $(e.target).hasClass('responsive-image-zoom-active'))
                    e.preventDefault();
            });
            
            // Reset on window resize
            $(window).on('resize', resetZoom);
        });
    };

})(jQuery);