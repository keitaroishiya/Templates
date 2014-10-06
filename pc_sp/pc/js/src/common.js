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