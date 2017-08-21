/*
 *Author: PVT
 *
 *Date: 08/10/2012
 *
 *Plugin: Autocomplete
 *
 **/

var time_out = 0;
var position = 1;
var key_current = 1;
var height_li_current = 0;
var height_scroll = 0;
var total_height = 0;
var padding = 4;
(function($) {
    var options;
    $.fn.autocompletesearch = function(options) {

        var defaults = {
            width: 200,
            tags: false,
            maxheight: 200,
            resultfield: null,
            method: "POST",
            url: "ajax.php",
            data: null
        };

        options = $.extend(defaults, options);

        checkRequiredValue(options);

        return this.each(function() {
            var opts = options;

            var data = opts.data;

            var obj = $(this);

            if (opts.tags == true) {
                var body = '<div class="tagsinput tagcenter"><div class="all_tag"></div><div id="tags2_addTag"><input style="color: rgb(102, 102, 102); width: 80px;" id="auto_field" value="" data-default="Add Tag"></div></div>';
                obj.parent().append(body);
                obj.hide();
                obj = $("#auto_field");
                $("#auto_field").focus();

                $(".tagsinput").click(function() {
                    $("#auto_field").focus();
                })
            }

            // Bắt sự kiện gõ vào search
            obj.bind('keyup', function(e) {
                // Lấy code bàn phím khi gõ vào
                var keyCode = e.which;

                clearTimeout(time_out);

                // Lấy giá trị tìm kiếm
                var key = obj.val();

                if (data != null) {
                    data = opts.data;
                } else {
                    data = '';
                }

                // Nếu có nhập từ khóa tìm kiếm
                if (key != '') {

                    // Nếu không gõ 2 phím mũi tên lên xuống thì làm ajax search
                    if (keyCode != 38 && keyCode != 40 && keyCode != 10 && keyCode != 13) {
                        var html = $(".auto_search").html();
                        if (html == undefined) {
                            html = '<div class="auto_search"><ul class="scroll-result"></ul><div class="detail"><a id="result_link" href=""><p class="detail_more">Xem tất cả kết quả tìm kiếm</p><img class="pull-right" alt="" src="https://lh4.googleusercontent.com/-gI3_UUoGNTA/WZqI75hNwII/AAAAAAAAD4U/YiphzD8STcg2TgRpfFlVanub5uj6dDhVACKgBGAs/s1600/search_detail.png"></a></div></div>';
                            $("body").append(html);
                            
                            // Khai báo vị trí thanh search
                            var offet = obj.offset();
                            var left = offet.left;
                            var top = offet.top;

                            // Xét vị trí cho vùng hiện kết quả search
                            $(".auto_search").css({
                                'position': 'absolute',
                                'width': opts.width,
                                'left': left,
                                'top': top + 30
                            });
                        }
						
                        time_out = setTimeout(function() {
                            $("#result_link").attr('href', "/tim-kiem/" +key);
							
							var change_alias = function(a){a=a.toLowerCase();a=a.replace(/\u00e0|\u00e1|\u1ea1|\u1ea3|\u00e3|\u00e2|\u1ea7|\u1ea5|\u1ead|\u1ea9|\u1eab|\u0103|\u1eb1|\u1eaf|\u1eb7|\u1eb3|\u1eb5/g,"a");a=a.replace(/\u00e8|\u00e9|\u1eb9|\u1ebb|\u1ebd|\u00ea|\u1ec1|\u1ebf|\u1ec7|\u1ec3|\u1ec5/g,"e");a=a.replace(/\u00ec|\u00ed|\u1ecb|\u1ec9|\u0129/g,"i");a=a.replace(/\u00f2|\u00f3|\u1ecd|\u1ecf|\u00f5|\u00f4|\u1ed3|\u1ed1|\u1ed9|\u1ed5|\u1ed7|\u01a1|\u1edd|\u1edb|\u1ee3|\u1edf|\u1ee1/g,"o");a=a.replace(/\u00f9|\u00fa|\u1ee5|\u1ee7|\u0169|\u01b0|\u1eeb|\u1ee9|\u1ef1|\u1eed|\u1eef/g,"u");a=a.replace(/\u1ef3|\u00fd|\u1ef5|\u1ef7|\u1ef9/g,"y");return a.replace(/\u0111/g,"d")}
							
                            function searchData(url){
								if(url === undefined) url = opts.url;
								$.ajax({
									type: opts.method,
									url: url,
									data: data,
									dataType: 'jsonp',
									beforeSend: function() {
										$(".auto_search ul").mCustomScrollbar('destroy');
										$(".auto_search ul").html('<li><img src="https://lh3.googleusercontent.com/-HdSkb5n2S-4/WZqJIDozanI/AAAAAAAAD4Y/yM0h7rxzgYI_vwqICG5A4NKqRhBEydFLACKgBGAs/s1600/loading.gif" /></li>');
									},
									success: function(data) {
										var nextLink = '';
										var entry = data.feed.entry,
											globalLink = data.feed.link;
										
										for(var i = 0; i < globalLink.length; i++){
											if(globalLink[i].rel == 'next'){
												nextLink = globalLink[i].href;							
												
												nextLink = opts.url + "?" + nextLink.split('?')[1];
												
												break;
											}
										}
										
										var enKey = change_alias(key);
										var result = '';
										for (var i = 0, len = entry.length; i < len; i++) {
											var enTitle = change_alias(entry[i].title.$t);
											
											if(enTitle.indexOf(enKey) != -1){
												var urlPost = '';
												for (var j = 0; j < entry[i].link.length; j++) {
													if (entry[i].link[j].rel == "alternate") {
														urlPost = entry[i].link[j].href;
													}
												}
												
												var titlePost = entry[i].title.$t;
												
												var thumbPost = '';
												if ("media$thumbnail" in entry) {
													thumbPost = entry.media$thumbnail.url.replace(/\/s[0-9]+(\-c)?\//g, "/w100-h50-c/");;
												} else {													
													thumbPost = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAMAAAAoyzS7AAAAA1BMVEXMzMzKUkQnAAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg==";													
												}
												
												result += '<li><a class="avatar" href="'+urlPost+'"><img class="pull-left" alt="" src="'+ thumbPost +'"><div class="pull-left search_film"><p class="search_film_vi">'+ titlePost +'</p><p class="search_film_en">'+ titlePost +'</p></div></a></li>';
											}
										}
										
										if($('.mCSB_container').html() == undefined){

											$(".auto_search ul").html(result);
										
											$(".auto_search ul").mCustomScrollbar({
												setHeight: "300px",
												theme: "s-event",
												mouseWheel:{ preventDefault: true },
											});
										} else{
											$(".auto_search .mCSB_container").html(result);

											$(".auto_search ul").mCustomScrollbar("update");
										}

										$(".auto_search").show();
										
										$(".auto_search ul").mCustomScrollbar({
											setHeight: "300px",
											theme: "s-event",
											mouseWheel:{ preventDefault: true },
										});

										$("body").on('click', function(e) {
											$(".auto_search").hide();
											position = 1;
											height_li_current = 0;
											height_scroll = 0;
											total_height = 0;
											obj.val('');
										});

										$(".auto_search ul").css({
											'max-height': opts.maxheight,
											'overflow': 'auto'
										});

										// Bắt sự kiện khi rê chuột vào vùng hiện kết quả search
										// $(".auto_search li").mouseover(function() {
										//     $(".auto_search li").removeClass("auto_over");
										//     var id = $(this).attr("id");
										//     $(this).addClass("auto_over");
										// }).mouseout(function() {
										//     $(this).removeClass("auto_over");
										// })

										// Bắt sự kiện khi click chuột vào vùng hiện kết quả search
										$(".auto_search li").click(function() {
											if (opts.tags == true) {
												var value = $(this).find(".show_input").html();
												obj.val("");
												var tag = '<span id="' + $(this).attr("id") + '" class="tag"><span>' + value + '&nbsp;</span><a href="javascript:void(0)" class="remove_tag" title="Removing tag">x</a></span>';
												$(".all_tag").append(tag);

												$(".remove_tag").click(function() {
													$(this).parent().remove();
												});
											} else {
												var value = $(this).find(".show_input").html();
												if (opts.resultfield == null) {
													obj.val(value);
												} else {
													value = $(opts.resultfield).val() + value;
													$(opts.resultfield).val(value);
												}
											}
											$(".auto_search").hide();
										})

										$(".auto_search ul li").each(function(i, item) {
											total_height += $(this).height() + padding;
										})
									}
								})
							}
                        }, 0)
                    }
                } else {
                    $(".auto_search").hide();
                    position = 1;
                    height_li_current = 0;
                    height_scroll = 0;
                    total_height = 0;
                }
            }).keydown(function(e) {
                /*  Nếu có gõ 2 phím mũi tên lên xuống
                 *   position = 1: gõ lần đầu tiên
                 *   position = 2: gõ các lần tiếp theo
                 *   hasclass    : xét xem có class hover chưa
                 *   current     : thẻ chứa class hover hiện tại
                 **/

                // Lấy code bàn phím khi gõ vào                
                var keyCode = e.which;

                //total_height = $(".auto_search ul").prop("scrollHeight");

                if (keyCode == 40) {

                    if (height_li_current == total_height) {
                        height_scroll = 0;
                        $(".auto_search li").removeClass("auto_over");
                    }

                    var hasclass = $(".auto_search li").hasClass("auto_over");
                    var current = $(".auto_search").find('li.auto_over');

                    if (hasclass == false) {
                        $(".auto_search li:first-child").addClass("auto_over");
                    } else {
                        current.next().addClass("auto_over");
                        current.removeClass("auto_over");
                    }

                    var i = 0;
                    var i_current = $('.auto_search ul li').index($(".auto_over"));
                    var index_current = $('.auto_search ul li').eq(i);
                    var total_li = $('.auto_search ul li').length;
                    var h = 0;
                    var scroll = 0;

                    for (i; i <= i_current; i++) {
                        h += $('.auto_search ul li').eq(i).height() + padding;
                    }

                    height_li_current = h;

                    if (h >= opts.maxheight) {
                        height_scroll += current.next().height() + padding;
                    }

                    //console.log('40' +'/'+ height_scroll +'/'+ height_li_current +'/'+ current.next().html());
                    $(".auto_search ul").scrollTop(height_scroll);
                }

                // Nếu gõ phím mũi tên lên
                if (keyCode == 38) {

                    var first = $(".auto_search li:first-child").height() + padding;

                    if (height_scroll == 0 && height_li_current <= first) {
                        height_scroll = total_height;
                        $(".auto_search li").removeClass("auto_over");
                    }

                    var hasclass = $(".auto_search li").hasClass("auto_over");
                    var current = $(".auto_search").find('li.auto_over');

                    if (hasclass == false) {
                        $(".auto_search li:last-child").addClass("auto_over");
                    } else {
                        current.prev().addClass("auto_over");
                        current.removeClass("auto_over");
                    }

                    var i = 0;
                    var i_current = $('.auto_search ul li').index($(".auto_over"));
                    var index_current = $('.auto_search ul li').eq(i);
                    var total_li = $('.auto_search ul li').length;
                    var h = 0;
                    var scroll = 0;

                    for (i; i <= i_current; i++) {
                        h += $('.auto_search ul li').eq(i).height() + padding;
                    }

                    height_li_current = h;

                    height_scroll = height_li_current - (current.prev().height() + padding);

                    //console.log('38' +'/'+ height_scroll +'/'+ height_li_current +'/'+ current.prev().html());
                    $(".auto_search ul").scrollTop(height_scroll);

                }

                // Nếu gõ phím enter                                    
                if (keyCode == 13) {
                    e.preventDefault();
                    if(obj.val().length >= 3){
                        window.location.href = host + '/tim-kiem/' + obj.val();
                    }
                }

                if (opts.tags == true) {
                    if (keyCode == 8 || keyCode == 46) {
                        var auto_val = $("#auto_field").val();
                        if (auto_val == '') {
                            var has_tags = $(".all_tags").html();
                            if (has_tags != '') {
                                $(".all_tag span:last-child").remove();
                            }
                        }
                    }
                }
            });
        });

        /**
         * Check required value 
         * 
         * If not enought, throw an error
         */
        function checkRequiredValue(options) {
            // one of these needs to be non falsy
            if (options.width == '')
                throw new Error("Need to set either Result_id: or Role: option.");
        }
    };

    $.fn.getAllTags = function(options) {
        var tags = [];
        $(".all_tag span.tag").each(function() {
            tags.push($(this).attr("id"));
        })
        return tags;
    };

})(jQuery); 