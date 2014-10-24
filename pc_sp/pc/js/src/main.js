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
