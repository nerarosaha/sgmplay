/*
 *Author: PVT
 *
 *Date: 03/04/2015
 *
 *Plugin: Lazyload
 *
 **/
(function($) {
    var options;
    $.fn.lazyload = function(options) {

        var defaults = {
            event           : "scroll",
            effect          : "show",
            container       : window,
            data_attribute  : "data-original"
        };

        options = $.extend(defaults, options);

        checkRequiredValue(options);

        var self = this;
        var obj = $(this);
        
        var scrollTop = $(options.container).scrollTop();

        $(options.container).bind(options.event, function() {

            var scrollTop = $(options.container).scrollTop();
            
            self.each(function(i, object) {

                var item = $(object);
                var top = item.offset().top;
                var left = item.offset().left;

                if((top - (window.screen.availHeight/2) - 300) <= scrollTop && item.attr('isLoaded') !== 'true'){
                    item.attr('isLoaded', 'true');                       
                    item.hide();
                    item.bind("load", function() {
                        //$(this).fadeOut();
                        }).attr('src', item.attr(options.data_attribute)); 
                    item.fadeIn();             
                }
            });
            //$("img.lazy").height('auto');
        });

        obj.each(function(i, object) {

            var item = $(object);
            var top = item.offset().top;
            var left = item.offset().left;

            if((top - (window.screen.availHeight/2) - 300) <= scrollTop && item.attr('isLoaded') !== 'true'){
                item.attr('isLoaded', 'true');                       
                item.hide();
                item.bind("load", function() {
                    //$(this).fadeOut();
                    }).attr('src', item.attr(options.data_attribute)); 
                item.fadeIn();
            }

        });

        //console.log(this);

        /*return this.each(function() {
            var opts = options;

            var data = opts.data;

            var obj = $(this);



        });*/


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