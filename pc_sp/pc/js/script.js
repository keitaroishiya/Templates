/**
 * UAからブラウザ判別
 * Ref: https://w3g.jp/blog/tools/js_browser_sniffing
 */
var _ua = (function(){
	return {
		ltIE6:typeof window.addEventListener == "undefined" && typeof document.documentElement.style.maxHeight == "undefined",
		ltIE7:typeof window.addEventListener == "undefined" && typeof document.querySelectorAll == "undefined",
		ltIE8:typeof window.addEventListener == "undefined" && typeof document.getElementsByClassName == "undefined",
		ltIE9:document.uniqueID && typeof window.matchMedia == "undefined",
		gtIE10:document.uniqueID && window.matchMedia,
		Trident:document.uniqueID,
		Gecko:'MozAppearance' in document.documentElement.style,
		Presto:window.opera,
		Blink:window.chrome,
		Webkit:typeof window.chrome == "undefined" && 'WebkitAppearance' in document.documentElement.style,
		Touch:typeof document.ontouchstart != "undefined",
		Mobile:typeof window.orientation != "undefined",
		ltAd4_4:typeof window.orientation != "undefined" && typeof(EventSource) == "undefined",
		Pointer:window.navigator.pointerEnabled,
		MSPoniter:window.navigator.msPointerEnabled
	};
})();

/**
 * IE7, 8用の横スライダー
 * モダンブラウザは、flipsnap使用
 */
var ieSlider = (function($){
	var slider = function() {};
	slider.prototype = {
		$target: null,
		$listener: null,
		options: null,
		count: 0,
		setSlider: function(tgt, opt, params) {
			var self = this;
			var $tgt = this.$target = $(tgt);
			this.options = opt;
			this.$items = $tgt.find('.item');
			this.options.length = this.$items.length;
			this.count = 0;

			//前へボタン
			var $prev = this.$prev = $(params.prev);
			$prev.on('click', function(e) {
				e.preventDefault();
				self.toPrev();
			});

			//次へボタン
			var $next = this.$next = $(params.next);
			$next.on('click', function(e) {
				e.preventDefault();
				self.toNext();
			});

			this.setPager();
			return this;
		},

		toPrev: function() {
			this.move(false);
		},

		toNext: function() {
			this.move(true);
		},

		hasNext: function() {
			return this.count < this.options.length - 1;
		},

		hasPrev: function() {
			return this.count > 0;
		},

		move: function(isNext) {
			var opt = this.options;
			var cnt = this.count;
			cnt += isNext? 1 : -1;

			if(cnt < 0) { cnt = opt.length - 1; }
			else if(cnt >= opt.length) { cnt = 0; }

			this.count = cnt;
			this.moveDistance();
		},

		moveDistance: function() {
			var self = this;
			var opt = this.options;
			var mgn = parseInt(-opt.distance * this.count) + 'px';
			this.$pager.removeClass('pager-on').addClass('pager-off');
			this.$pager.eq(this.count).removeClass('pager-off').addClass('pager-on');
			this.$target.animate({
				'margin-left': mgn
			},
			{
				complete: function() {
					self.$target.trigger('completed', {$items: self.$items, count: self.count});
				}
			});
			this.checkNextSlide(this.$prev, this.$next);
			
		},

		checkNextSlide: function($prev, $next) {
			$prev.removeClass('is-hidden');
			$next.removeClass('is-hidden');

			if(!this.hasNext()) {
				$next.addClass('is-hidden');
			}
			else if(!this.hasPrev()) {
				$prev.addClass('is-hidden');
			}
		},

		setPager: function() {
			var self = this;
			this.$pager = this.$target.parent().parent().find('.js-pager');
			this.$pager.on('click', function() {
				var _id = $(this).attr('id').split('-');
				_id = parseInt(_id[1]);
				self.count = _id;
				self.moveDistance();
			});
			self.moveDistance();
		}

	};
	return slider;
})(jQuery);

(function(){
	Handlebars.registerHelper("math", function(lvalue, operator, rvalue, options) {
		lvalue = parseFloat(lvalue);
		rvalue = parseFloat(rvalue);
		return {
			"+": lvalue + rvalue,
			"-": lvalue - rvalue,
			"*": lvalue * rvalue,
			"/": lvalue / rvalue,
			"%": lvalue % rvalue
		}[operator];
	});
})();
/**
 * Handlebars.jsで要素を生成するためのデータ
 */
var pageData = {
  modal:{
    modal_data:[
      {
        title: 'Modal Title 1',
        src: 'img/img_pop_1.png',
      },
      {
        title: 'Modal Title 2',
        src: 'img/img_pop_2.png',
      },
      {
        title: 'Modal Title 3',
        src: 'img/img_pop_3.png',
      }
    ]
  }
};
/**
 * Main script
 */
(function($){
	'use strict';
	var Main = function(opt){
		if (typeof opt === 'object') {
			for (var k in opt) {
				if (typeof opt[k] !== 'undefined') {
					this[k] = opt[k];
				}
			}
		}
	};

	Main.prototype = {
		isIE9: false,
		isltIE8: false,
		isltIE9: false,
		init: function() {

			var self = this;
			var $block = $('.js-block');
			this.isIE9 = !!(_ua.ltIE9 && !_ua.ltIE8);
			this.isltIE8 = !!_ua.ltIE8;
			this.isltIE9 = !!_ua.ltIE9;

			window.scrollTo(0,0);

			/**
			 *スライド領域の設定
			 */
			var params = {
				dist: 900,
				prev: '.js-prev',
				next: '.js-next'
			}
			var flipArea = this.setSlide('.js-flip', params, true);

			// モーダルポップアップの設定		
			var modalValues = pageData.modal;
			var template = HBTemplates.modal_block;
			$block.append(template(modalValues));


			// 各ポップアップ領域の設定
			this.modalItems = [];
			for (var i=0,l=modalValues.modal_data.length; i<l ; i+=1) {
				this.modalItems[i] = $('.js-modal' + i);
			};

			// var flipModal = this.setSlide('.js-modal-flip', 400);
			$('.js-modal-btn').on('click', function(e) {
				self.popupModal(e);
			});
			this.$modals = $('.js-modal');


			//モーダルポップアップ設定
			var $ovl = $('.js-overlay').addClass('is-hidden');
			var $ovlClose = $('.js-close');
			$ovlClose.on('click', function(e) {
				$ovl.addClass('is-hidden');
				$ovl.addClass('overlay-show');
			});

			
			//PNG Fix
			if(self.isltIE8){ //IE7, 8
				// $('.pngFix').fixPng();
			}

			//開閉処理を設定
			this.setOpenClose();

			//スクロールイベント処理を設定
			this.setScroll();

			//ボタンのマウスオーバーの設定
			this.setMouseover();
		},

		/**
		 * 横方向スライダーを設定
		 */
		setSlide: function(target, params, isGray) {
			var s, self = this;
			s = new ieSlider();
			s.setSlider(target, {distance: params.dist}, params);

			/*
			if(_ua.ltIE8){ //IE7, 8
				s = new ieSlider();
				s.setSlider(target, {distance: params.dist});
			}
			else { //IE7, 8 以外
				s = Flipsnap(target, {distance: params.dist});
			}
			*/

			return $(target);
		},

		/**
		 * モーダルポップアップ全体制御
		 */
		popupModal: function(e) {
			var _id = $(e.currentTarget).attr('id').split('-');
			var type = _id[0];
			_id = parseInt(_id[1]);

			this.$modals.addClass('is-hidden');
			switch(type) {
				default:
					this.modalItems[_id].removeClass('is-hidden');
					break;
			}

			var $v = $('.js-overlay');
			$v.removeClass('is-hidden');
			$v.addClass('overlay-show');
		},

		/**
		 * 開閉
		 */
		setOpenClose: function() {
			$('.js-open-close').next().find('.open-close__contents').toggle();
			$('.js-open-close').on('click', function(e) {
				var $this = $(this)
				var _id = $this.attr('id').split('-')[1];
				$('.js-open-close' + _id).slideToggle(400);

				var cl = 'arrow-close';
				var $ar = $this.find('.arrow-open');
				if($ar.hasClass(cl)) {
					$ar.removeClass(cl);
				}
				else {
					$ar.addClass(cl);
				}

			});
		},

		//スクロール処理	
		setScroll: function() {
			var self = this;
			var isFixed = false;
			var $gnavi = $('.js-gnavi');
			var $win = $(window);
			$win.on('scroll', function() {
				//上部固定
				var s = $win.scrollTop();
				if(s > 568) {
					if(!isFixed) {
						$gnavi.addClass('gnavi__fixed');
						isFixed = true;
					}
				}
				else {
					if(isFixed) {
						$gnavi.removeClass('gnavi__fixed');
						isFixed = false;	
					}
				}
			});

			$('a[href^=#]').on('click', function(){
				var speed = 500;
				var href= $(this).attr("href");
				var target = $(href == "#" || href == "" ? 'html' : href);
				var position = target.offset().top;
				$("html, body").animate({scrollTop:position}, speed, "swing");
				return false;
			});
		},

		//ボタンのマウスオーバーの設定
		setMouseover: function() {
			this.hoverSetting('a', 0.6);
			this.hoverSetting('.bt-pop-close', 0.6);
			this.hoverSetting('.sqr-list li', 0.7);
			this.hoverSetting('.btn-prev-pop', 0.8);
			this.hoverSetting('.btn-next-pop', 0.8);
			this.hoverSetting('.btn-prev', 0.6);
			this.hoverSetting('.btn-next', 0.6);
		},

		hoverSetting: function(key, out) {
			$(key).hover(function(){
					// $(this).css('opacity', out); // マウスオーバーで透過設定
					$(this).fadeTo(100, out); // マウスオーバーで透過設定
				},
				function(){
					// $(this).css('opacity', 1); // マウスオーバーで透過設定
					$(this).fadeTo(100, 1.0); // マウスアウトで透過解除
			});
		},
	};

	var main = new Main();
	main.init();

})(jQuery);
