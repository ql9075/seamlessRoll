/*
*		author: 404Nan 
*		gitub: ql9075.github.com
*		version: 1.0
*		ep: <ul>
*				<li></li>
*				<li></li>
*			</ul>
*/

;(function($,window,undefined){

	$.fn._seamlessRoll = function( opt ){

		this.each(function(){

			return new $._seamlessRoll( this , opt )

		})

	};

	$._seamlessRoll = function( target , opt ){

		this.target = target;

		this.opt = {

			width:"",
			height:"",
			button:"",
			index :"",
			currindex:"",
			fadetime:100,
			times:100,
			autotime:2000,

			easing:"",
			isAuto:true,
			isLoop:true,
			event:"click"// event type
			
		}

		$.extend( this.opt , opt );

		this.init();

	}

	$._seamlessRoll.prototype = {
		init:function(){
			var _this = this;
			_this._flag = true,
			_this._li = $(this.target).find("li") ,
			_this._length = _this._li.length , 
			_this._height = this.opt.height  ||  _this._li.height() ,
			_this._width =  this.opt.width  || _this._li.width() ;

			$(this.target).css({
				position:"relative",
				height:_this._height,
				width:3*_this._width,
				"margin-left":-_this._width,
				"left":"0"
			});
			_this._li.css({position:"absolute",height:_this._height,width:_this._width});

			_this.wrap();
			_this.move();
			_this.events();
			_this.opt.isAuto && _this.atuo();

		},
		wrap:function(){

			var _sRollWrapper = $('<div class="sRoll-Wrapper" />'), _main = $('<div class="sRoll-Main" style="overflow:hidden;"/>');
			 
			$(this.target).wrap( _sRollWrapper ).wrap( _main );

			 this.opt.index &&	$(this.target).parent().after( this.set_Index() );
			
			 this.opt.button && $(this.target).parent().after( this.set_Button() );
	
		},
		set_Index:function(){
			var _this = this , doc = document , n ="" ,

			    frag = doc.createDocumentFragment(),

			    frag2 = doc.createDocumentFragment(),

			    _ol = $("<ol class=\"sRoll-Index\" ></ol>")
			;
			
			for (var i = 0; i < _this._length ; i++) {

				n += "<li><a>"+i+"</a></li>";
				
			};

			frag.appendChild( _ol.append( n )[0] );

			return frag;
		},
		set_Button:function(){
			var _this = this , doc = document ,

			    frag = doc.createDocumentFragment(),

			    _btn = $("<div class=\"sRoll-Button-wp\" ><div class=\"sRoll-prev sRoll-btn\" ></div><div class=\"sRoll-next sRoll-btn\" ></div></div>")
			;

			frag.appendChild( _btn[0] );
			return frag;
		},
		move:function( index , btn ){
			var _this = this,  $index = index||0  , x ;
			clearTimeout(this._timer);
			if( _this._flag ){
				$index  = this.opt.currindex ||0;
				_this._flag = false;
				_this._li.eq( $index ).siblings().removeClass("selectdShow");
				_this._li.eq( $index ).addClass("selectdShow")
			
			}
			
			x =  $(_this.target).find('li.selectdShow').index();
	
			_this._li.eq( $index ).siblings().removeClass("selectdShow");
			_this._li.eq( $index ).addClass("selectdShow")

			var curr_elem = _this._li.eq( $index ) ,
				next_elem = _this._li.eq( $index  == _this._length - 1 ? 0 : $index + 1 ) ,
				prev_elem = _this._li.eq( $index == 0 ? _this._length - 1 : $index - 1 ),
				queue = [ prev_elem , curr_elem , next_elem  ];

			queue[1].siblings().css({ left: -3*_this._width	});
			$(_this.target).css({ left:0 });

			/*move*/
			
			switch( btn ){
				case "next":
					queue[0].css({ left:  _this._width });
					queue[1].css({ left: 2*_this._width });
					this._timer = setTimeout(function(){

						$(_this.target).animate({
							left:-_this._width
						},_this.opt.fadetime,_this.opt.easing)

					},this.opt.times);
					break;
				case "prev":
					queue[2].css({ left: _this._width });
					queue[1].css({ left: 0 });
					this._timer = setTimeout(function(){

						$(_this.target).animate({
							left:_this._width
						
						},_this.opt.fadetime,_this.opt.easing)

					},this.opt.times);
					break;
				default:
					var _w ;
					
					if( $index > x) {
						_w = -_this._width;
						queue[0].css({ left:  _this._width });
						queue[1].css({ left:  2*_this._width });
				

					}else if( $index < x ){
						_w = _this._width;
						queue[2].css({ left: _this._width });
						queue[1].css({ left: 0 });
						
					}else{
						_w = _this._width;
						queue[2].css({ left: 2*_this._width });
						queue[0].css({ left: 0 });
					}

					this._timer = setTimeout(function(){

						$(_this.target).animate({
							left:_w
						},_this.opt.fadetime,_this.opt.easing)

					},this.opt.times);

			};
				
		},
		atuo:function(){
			var _this = this;

			clearTimeout(_this._timer)

			var _index = $(_this.target).find('li.selectdShow').index() == _this._length - 1 ?  0 : $(_this.target).find('li.selectdShow').index() + 1 ;
		
			_this.move( _index , "next");

			_this._timer = setTimeout(function(){

				_this.atuo();

			},_this.opt.autotime);
		},
		events:function(){
			var _this = this;
			if( _this.opt.isAuto ){

				$(this.target).parents( ".sRoll-Wrapper" ).hover(function(){
					clearTimeout(_this._timer);
				
				},function(){

					_this._timer = setTimeout(function(){

						_this.atuo();

					},_this.opt.autotime);
				});
			}
				
				$(this.target).parents( ".sRoll-Wrapper" ).delegate('.sRoll-btn',_this.opt.event,function(){
		
					if( $(this).hasClass("sRoll-prev") ){
						clearTimeout(_this._timer)

						if ( !_this.opt.isLoop && $(_this.target).find('li.selectdShow').index() == 0){
							return ;
						}
						var _index = $(_this.target).find('li.selectdShow').index() == 0 ?  _this._length - 1  :  $(_this.target).find('li.selectdShow').index() - 1 ;

						_this._timer = setTimeout(function(){

							_this.move( _index , "prev");

						},400);
					
					}else if( $(this).hasClass("sRoll-next") ){
						clearTimeout(_this._timer)
						if ( !_this.opt.isLoop && $(_this.target).find('li.selectdShow').index() ==  _this._length - 1){
							return ;
						}
						var _index = $(_this.target).find('li.selectdShow').index() == _this._length - 1 ?  0 : $(_this.target).find('li.selectdShow').index() + 1 ;
						_this._timer = setTimeout(function(){
							_this.move( _index , "next");

						},400/*_this.opt.times*/);
							
					}

				});

				$(this.target).parents( ".sRoll-Wrapper" ).delegate('.sRoll-Index li a',_this.opt.event,function(){

					var _i = $(this).parent().index();
					if( _i ==  $(_this.target).find('li.selectdShow').index() ) return;
					_this._timer = setTimeout(function(){
							_this.move( _i );

					},400/*_this.opt.times*/);
				});

		}
	};


})(jQuery,window,undefined);