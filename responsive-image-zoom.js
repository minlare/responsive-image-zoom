(function($){

    $.fn.responsiveImageZoom = function(config){

        var $config = {
            event: 'doubletap',
            resetZoomClickOutside: true,
            resetZoomMouseExit: true,
            showMessage: true,
            message: 'Tap twice to zoom'
        };
        $.extend($config, config);
        
        $(this).wrapInner($('<div/>', {class: 'responsive-image-zoom-wrapper'}));
        $(this).find('img').addClass('responsive-image-zoom-image');

        $(this).each(function(){
            
            var $el = $(this).find('.responsive-image-zoom-wrapper'),
                $img,
                $offset,
                $dimensions = {},
                $max = {},
                $dragStart = {};
                
            var getContainerData = function(){
                $offset = $el.offset();
                $dimensions = {
                    width: $el.width(),
                    height: $el.height()
                };
            };
                
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
                $('.responsive-image-zoom-message').remove();
                
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
                getContainerData();

                $img = $(e.target);
                if($img.hasClass('responsive-image-zoom-message'))
                    $img = $img.next('img');
                
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
            
            // Show message
            if($config.showMessage){
                $(window).on('load', function(){
                    getContainerData();
                    var $message = $('<span/>', {class: 'responsive-image-zoom-message'}).css({
                        background: 'rgba(0,0,0,0.5)',
                        position: 'absolute',
                        padding: '.5em',
                        fontSize: '.9em',
                        color: 'white'
                    }).html($config.message);
                    $el.prepend($message);
                    $message.css({
                        left: (($dimensions.width - $message.width()) / 2),
                        top: (($dimensions.height - $message.height()) / 2)
                    });
                });
            }
            
            // Handle close on click outside
            if($config.resetZoomClickOutside)
                $(document).on('click', function(e){
                    if($img && $img.data('zoomed') && !$(e.target).hasClass('responsive-image-zoom-image') && !$(e.target).hasClass('responsive-image-zoom-lazyload'))
                        resetZoom();
                });
            
            // Handle close on mouse exit
            if($config.resetZoomMouseExit)
                $el.on('mouseout', function(e){
                    if($img && $img.data('zoomed') && $(e.target).get(0) === $img.get(0))
                        resetZoom();
                });
        });
    };

})(jQuery);