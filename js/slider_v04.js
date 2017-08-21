/*
 *Author: PVT
 *
 *Date: 03/04/2015
 *
 *Plugin: Slider
 *
 **/
(function($) {
    var options;
    $.fn.slider = function(options) {

        var defaults = {
            data_attribute  : "data-original"
        };

        options = $.extend(defaults, options);

        checkRequiredValue(options);

        var self = this;
        var obj = $(this);
        obj.addClass('slider');
        obj.attr('page', 0);
        //obj.css({'overflow' : 'hidden'});
        
        var scrollTop = $(options.container).scrollTop();

        var width = obj.find('li').outerWidth(true);
        var height = obj.find('li').outerHeight(true);
        var total_length = obj.find('li').length;
        var total_w = width * (total_length + 1);

        var firstchild = obj.find('li:first-child');

        var page = parseInt(obj.attr('page'));

        if((total_length%options.minSlides) == 0){
            var max_page = parseInt(total_length/options.minSlides);
        } else{
            var max_page = parseInt(total_length/options.minSlides) + 1;
        }
        if(max_page > 1){
            var html_li = '';
            for(var $i = 1; $i <= max_page; $i++){
                if($i == 1){
                    html_li += '<li class="active"></li>';
                } else{
                    html_li += '<li></li>';
                }
            }
            if(options.indicator != undefined){
                options.indicator.html(html_li);
            }
        }
        
        var last_page_item_length = parseInt(total_length - ((max_page-1)*options.minSlides));

        var w = $(document).width();
        var padding = 73;
        var margin = 4;

      /*  if (w >= 1000) {
            var img_w = (w - (padding * 2) - (margin * 4)) / options.minSlides;
            var ratio = Math.ceil((img_w / width) * 100) / 100;

            var total_w = (img_w + margin) * (total_length + 1);

            obj.find('li').width(img_w);
            obj.find('li').height('100%');

            var img_h = (height * ratio);
            if(obj.find('li').hasClass('slide_big_img')){
                img_h = img_h + 7;
            } else{
                img_h = img_h + 3;
            }

            obj.closest('.body_slide').height(img_h);
            obj.width(total_w);
            obj.height('100%');
            width = img_w + margin;   

            obj.find('li.enyo').hover(function( event ) {
                if(event.type === 'mouseenter')  {

                    //$(event.currentTarget).find('.title').css({'visibility' : 'hidden'});
                    $(event.currentTarget).addClass('focused');
                    
                    if($(event.currentTarget).hasClass('slide_big_img')){
                        padding = 13;
                    } else{
                        padding = 35;
                    }

                    var focus_w = img_w + (padding * 2) + margin;
                    var w_add = focus_w - img_w;
                    var ratio_focus_w = Math.ceil((focus_w / img_w) * 100) / 100;
                    var focus_h = (img_h * ratio_focus_w);
                    if(obj.find('li').hasClass('slide_big_img')){
                        focus_h = focus_h + 7;
                    } else{
                        focus_h = focus_h + 5;
                    }
                    $(event.currentTarget).width(focus_w);
                    $(event.currentTarget).height(focus_h);

                    firstchild.css("margin-left", -Math.abs(w_add/2));

                    $(event.currentTarget).bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){ 
                       
                        //$(event.currentTarget).find('.title').css({'visibility' : 'visible'});
                    });

                    //$(event.currentTarget).animate({width: focus_w, height: focus_h}, 'slow');
                    //$(event.currentTarget).find('.title').css('bottom', '12px');
                } else if(event.type === 'mouseleave'){
                    $(event.currentTarget).removeClass('focused'); 
                    $(event.currentTarget).width(img_w);
                    $(event.currentTarget).height('100%');

                    firstchild.css("margin-left", "");
                }
            });   
        } else{
            obj.width(total_w);

            obj.find('li.enyo').hover(function( event ) {
                if(event.type === 'mouseenter')  { 
                    //$(event.currentTarget).find('.title').css({'visibility' : 'hidden'});
                    $(event.currentTarget).addClass('focused');


                    $(event.currentTarget).bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){ 
                        
                        //$(event.currentTarget).find('.title').css({'visibility' : 'visible'});
                    });
                } else if(event.type === 'mouseleave'){
                    $(event.currentTarget).removeClass('focused'); 
                    
                }
            });   
        }*/

        if(max_page > 1){
            obj.append(options.nextText);
            obj.prepend(options.prevText);
            obj.find('a.bx-prev').hide();

            // obj.find('a.bx-prev img').hide();
            // obj.find('a.bx-next img').hide();
        }

        obj.find('a.bx-controls-direction').click(function(e){
            page = parseInt(obj.attr('page'));

            if($(this).attr('rel') == 'next'){
                if(page >= 0 && page < (max_page-1)){
                    page = page + 1;

                    if(page == (max_page-1)){
                        var nextSlide_w = ((page-1) * (options.minSlides * width)) + (last_page_item_length * width);
                        $(this).hide();
                    } else{
                        var nextSlide_w = page * (options.minSlides * width);
                    }
                    obj.attr('page', page);
                    obj.animate({
                        "margin-left": "-" + nextSlide_w,
                    }, 500, function() {
                        // Animation complete.
                    });

                    obj.find('a.bx-prev').show();
                }   
            } else{
                if(page > 0){
                    page = page - 1;
                    var nextSlide_w = page * (options.minSlides * width);
                    obj.attr('page', page);
                    obj.animate({
                        "margin-left": "-" + nextSlide_w,
                    }, 500, function() {
                        // Animation complete.
                    });     

                    if(page == 0){
                        $(this).hide();
                    }

                    obj.find('a.bx-next').show();
                } 
            } 

            options.indicator.find('li').removeClass('active');
            $(options.indicator.find('li')[page]).addClass('active');
        });


        /**
         * Check required value 
         * 
         * If not enought, throw an error
         */
        function checkRequiredValue(options) {
            // one of these needs to be non falsy
            //if (options.width == '')
                //throw new Error("Need to set either Result_id: or Role: option.");
        }

    };

})(jQuery); 