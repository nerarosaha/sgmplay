var Strings = {
	create : (function() {
		var regexp = /{([^{]+)}/g;

		return function(str, o) {
			 return str.replace(regexp, function(ignore, key){
				   return (key = o[key]) == null ? '' : key;
			 });
		}
	})()
};
String.prototype.create = function(o) {
    return Strings.create(this, o);
}

var SGMCore = function(){
	var _this = this;
	var defaults = {
		blogUrl:'https://sexygirlmedia.blogspot.com/',
		typeGet : 'default',
		maxGet : 10,
		orderGet : 'published',
		catGet : '',
		idGet : '',
		defaultThumb : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAMAAAAoyzS7AAAAA1BMVEXMzMzKUkQnAAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg==',
		imgSize : '/s180',
		templateHtml : {
			idElement : '',
			htmlElememt : ''
		},
		relateSetting : {
			labels : [],
			idCur : '0',
			maxSearched : 12,
			maxInLabel : 2,
			max : 6,
			mainLabel : []
		},
	};	
	
	_this.customOptions = {};
	
	_this.options = $.extend(defaults, _this.customOptions);
	
	console.log(_this.options);
	
	var _ajaxGetJson = function (url, callback){
		var againWhenErr = 1;
		var dt = {
			"alt": "json-in-script",
			"orderby" : _this.options.orderGet,
			"max-results" : _this.options.maxGet
		}
		if(_this.options.idGet != '')
			dt = {
				"alt": "json-in-script"
			}
		
		$.ajax({
			url: url,
			type: 'get',
			beforeSend : function(){
				againWhenErr++;
			},
			dataType: 'jsonp',
			data: dt,
			success : function(data){
				callback(data);
			},
			error : function(e){
				if(againWhenErr < 3)
					_ajaxGetJson(url, callback);
				else
					console.log(e);
			}
		});	
	}
	
	var _slider = function(idE){
		
		$(idE + " img.lazy").lazyload();
		
		var w = $(document).width(); 
		var min = 5;
		if(w > 1366){
			min = 5;
		}

		$(idE +' .item_slider').slider({
			minSlides: min,
			indicator: $(idE +' .list-inline'),
			prevText: '<a class="col-xs-0 col-sm-1 bx-controls-direction bx-next" rel="next" href="javascript:void(0)"><img class="img-reponsive" src="https://fptplay.net/img/icon_right.png" alt=""/></a>',
			nextText: '<a class="col-xs-0 col-sm-1 bx-controls-direction bx-prev" rel="prev" href="javascript:void(0)"><img class="img-reponsive" src="https://fptplay.net/img/icon_left.png" alt=""/></a>',
		});           
	}
	
	_this.getList = function () {
		var url = _this.options.blogUrl + 'feeds/posts/' + _this.options.typeGet + (_this.options.catGet != '' ? '/-/'+ _this.options.catGet : '');
		
		_ajaxGetJson(url, function(data){
			var title 		= '',
				thumbnail 	= '',
				urlPost 	= '',
				idPost 		= '',
				resultHtml 	= '';
			var result = {};	
			var entry = data.feed.entry;
			
			if(entry != undefined){
				for(var i=0, length = entry.length; i<length; i++){
					for(var j=0; j<entry[i].link.length; j++){
						if(entry[i].link[j].rel == "alternate"){
							urlPost = entry[i].link[j].href;
							break;
						}
					}
					
					title = entry[i].title.$t;
					idPost = entry[i].id.$t.split('post-')[1];
					
					if("media$thumbnail" in entry[i]){
						thumbnail = _changeImageSize(entry[i].media$thumbnail.url);
					}else{
						thumbnail = _this.options.defaultThumb;
					}
					
					result.title = title;
					result.thumbnail = thumbnail;
					result.url = urlPost;
					result.id = idPost;
					
					resultHtml += _this.options.templateHtml.htmlElement.create(result);
				}
				
				_this.options.templateHtml.idElement.find('ul.phim-hot').html(resultHtml);
				
				_slider('#' + _this.options.templateHtml.idElement.attr('id'));
			}else{
				$(_this.options.templateHtml.idElement).html('<strong>No Result!</strong>');
			}
		});
	}
	
	_this.getOnceById = function(callback){
		var url = _this.options.blogUrl + 'feeds/posts/' + _this.options.typeGet + '/' + _this.options.idGet;
		_ajaxGetJson(url, function(data){
			var title 		= '',
				thumbnail 	= '',
				urlPost 	= '';
				
			var result = {};	
			var entry = data.feed.entry;
			
			if(entry != undefined){
				for(var j=0; j<entry.link.length; j++){
					if(entry.link[j].rel == "alternate"){
						urlPost = entry.link[j].href;
						break;
					}
				}
				
				var title = entry.title.$t;
				var idPost = entry.id.$t.split('post-')[1];
				var content = "content" in entry ? entry.content.$t : "";
				
				if("media$thumbnail" in entry){
					thumbnail = _changeImageSize(entry.media$thumbnail.url);
				}else{
					thumbnail = _this.defaultThumb;
				}
				
				result.title = title;
				result.thumbnail = thumbnail;
				result.url = urlPost;
				result.id = idPost;
				result.content = content
				
				callback(result);
			}else{
				callback('');
			}
		});
	}
	
	_this.getOnceByUrl = function(){
		
	}
	
	var _changeImageSize = function(image_url){
		return image_url.replace(/\/s[0-9]+(\-c)?/g, _this.options.imgSize);
	}
	
	_this.recentPost = function() {
		var url = _this.options.blogUrl + 'feeds/posts/' + _this.options.typeGet + (_this.options.catGet != '' ? '/-/'+ _this.options.catGet : '');
		
		_ajaxGetJson(url, function(data){
			var title 		= '',
				thumbnail 	= '',
				urlPost 	= '',
				idPost 		= '',
				resultHtml 	= '';
			var result = {};	
			var entry = data.feed.entry;
			
			if(entry != undefined){
				for(var i=0, length = entry.length; i<length; i++){
					for(var j=0; j<entry[i].link.length; j++){
						if(entry[i].link[j].rel == "alternate"){
							urlPost = entry[i].link[j].href;
							break;
						}
					}
					
					titlePost = entry[i].title.$t;
					idPost = entry[i].id.$t.split('post-')[1];
					
					if("media$thumbnail" in entry[i]){
						thumbnail = _changeImageSize(entry[i].media$thumbnail.url);
					}else{
						thumbnail = _this.options.defaultThumb;
					}
					
					result.title = title;
					result.thumbnail = thumbnail;
					result.url = urlPost;
					result.id = idPost;
					
					resultHtml += _this.templateHtml.htmlElement.create(result);
				}
				
				
				
				$(_this.options.templateHtml.idElement).html(resultHtml);
			}else{
				$(_this.options.templateHtml.idElement).html('<strong>No Result!</strong>');
			}
		});
	}
	
	_this.relatedPost = function(num) {
		var url = _this.options.blogUrl + '/feeds/posts/default';
		
		(function init(num){
			if(num === undefined || num === null) num = 0;
			if(_this.options.relateSetting.labels.length == 1)
				url = _this.options.blogUrl + '/feeds/posts/summary/-/' + _this.options.relateSetting.labels[0];
			else{
				if(_this.options.relateSetting.mainLabel.length > 0)
				for(var i = 0,length = _this.options.relateSetting.mainLabel.length; i < length; i++){
					if($.inArray(_this.options.relateSetting.mainLabel[i], _this.options.relateSetting.labels) !== -1){
						if(_this.options.relateSetting.mainLabel[i] !== _this.options.relateSetting.labels[num])
							url = _this.options.blogUrl + '/feeds/posts/summary/-/' + _this.options.relateSetting.mainLabel[i] + '/' + _this.options.relateSetting.labels[num];
						else
							url = _this.options.blogUrl + '/feeds/posts/summary/-/' + _this.options.relateSetting.mainLabel[i];
					break;
					}
				}
				else
					url = _this.options.blogUrl + '/feeds/posts/summary/-/' + _this.options.relateSetting.labels[num];
			}
			
			var htmlEmbed = '';
			var exitsPost = [];
			var result = {};
			$(_this.options.templateHtml.idElement + ' .related-item').each(function() {
				exitsPost.push($(this).attr('id'))
			});
			if(exitsPost.length <= _this.options.relateSetting.max - _this.options.relateSetting.maxInLabel){
				$.ajax({
					url: url,
					data: {
						"max-results": _this.options.relateSetting.maxSearched,
						alt: "json-in-script"
					},
					dataType: "jsonp",
					beforeSend: function(){
						if(num < _this.options.relateSetting.labels.length)
							num++;
					},
					success: function(e) {
						var entry = e.feed.entry;
						if(entry !== undefined){
							if(exitsPost.length > 0){
								for(var f in entry) {									
									if($.inArray(entry[f].id.$t.split('post-')[1], exitsPost) > -1) {
										entry.splice(f, 1)
									}										
								}
							}
							
							for(var f in entry) {
								if(entry[f].id.$t.split('post-')[1] == _this.options.relateSetting.idCur) {
									entry.splice(f, 1);
									break;
								}
							}
							
							if(entry.length > 0){
								entry.sort(function() {
									return .5 - Math.random()
								});
								
								$.each(entry, function(t, n) {
									if (t == maxInLabel)
										return false;
									
									var urlP;
									for (var u = 0; u < entry[t].link.length; u++) {
										if (entry[t].link[u].rel === "alternate") {
											urlP = entry[t].link[u].href
										}
									}
									var thumb;
									if (entry[t].media$thumbnail !== undefined) {
										thumb = entry[t].media$thumbnail.url.split(/s72-c/).join(_this.options.imgSize);
									} else {
										thumb = _this.options.defaultThumb;
									}
									
									result.title = entry[t].title.$t.trim();
									result.thumbnail = thumb;
									result.url = urlP;
									result.id = entry[t].id.$t.split('post-')[1];
									
									htmlEmbed += '<div id="'+ result.id +'" class="related-item">' + _this.options.templateHtml.htmlElement.create(result) + '</div>';
								});
								
								$(_this.options.templateHtml.idElement).append(htmlEmbed);
							}
						}
					}
				}).always(function(){
					if(num < _this.options.relateSetting.labels.length)
						init(num);
				})
			}else{
				return false;
			}
		})();
		
	}
}
