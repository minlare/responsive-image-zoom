$.fn.responsiveImageZoom = function(){
    
    var $el = $(this);
    
    var $offset = $(this).offset();
    var $dimensions = {
        width: $(this).width(),
        height: $(this).height()
    };
    
    var $img;
    
    
    var moveZoomArea = function(e){
        if(!$img) 
            return;
        
        var horizontalPixelRatio = ($img.width() - $dimensions.width) / $dimensions.width;
        var verticalPixelRatio = ($img.height() - $dimensions.height) / $dimensions.height;
        
        $img.css({
            left: -((e.pageX - $offset.left) * horizontalPixelRatio),
            top: -((e.pageY - $offset.top) * verticalPixelRatio)
        });
    };
    
    var zoomImage = function(e){
        
        $img = $(this);
        if($img.data('zoomed')){
            
            $img.css({
                maxWidth: '100%',
                position: 'static',
                top: 'auto',
                left: 'auto'
            });
            $img.data('zoomed', false);
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
                position: 'absolute',
                top: 0,
                left: 0
            });
            $img.data('zoomed', true);
        }
    };
    
    $(this).find('img').on('dblclick', zoomImage);
    $(this).on('mousemove', moveZoomArea);
};