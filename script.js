!(function (l) {
  'function' === typeof define && define.amd
    ? define(['jquery'], l)
    : 'object' === typeof module && module.exports
    ? (module.exports = function (m, a) {
        void 0 === a &&
          (a =
            'undefined' !== typeof window
              ? require('jquery')
              : require('jquery')(m));
        l(a);
        return a;
      })
    : l(jQuery);
})(function (l) {
  l.fn.imageScale = function (a) {
    return this.each(function () {
      var f = this,
        d = l(this),
        b = d.data('imageScale'),
        g = 'IMG' === this.tagName ? d : d.find('img');
      if (b) {
        if ('string' == typeof a) {
          b[a]();
        } else if ('object' == typeof a) {
          b[a.method || 'scale'](!1, a);
        } else {
          b.scale();
        }
      } else {
        var e = g[0].complete,
          k = l.extend({}, l.fn.imageScale.defaults, 'object' == typeof a && a),
          h = function () {
            d.data('imageScale', (b = new m(f, k)));
            b.scale(!0, k);
          };
        e ? h.apply(d[0]) : g.on('load', h).attr('src', g.attr('src'));
      }
    });
  };
  l.fn.imageScale.defaults = {
    scale: 'best-fill',
    align: 'center',
    parent: null,
    hideParentOverflow: !0,
    fadeInDuration: 0,
    rescaleOnResize: !1,
    didScale: function (a, f) {},
    logLevel: 0,
  };
  var m = function (a, f) {
    var d = this;
    d.options = f;
    d.element = a;
    var b = (d.$element = l(a)),
      g = (d.$img = 'IMG' === a.tagName ? b : b.find('img')),
      e = (d.img = g[0]);
    d.src = g.attr('src');
    d.imgWidth = e.naturalWidth || e.width;
    d.imgHeight = e.naturalHeight || e.height;
    b = d.$parent = f.parent ? f.parent : l(b.parent()[0]);
    d.parent = b[0];
    'static' === b.css('position') && b.css('position', 'relative');
    f.rescaleOnResize &&
      l(window).resize(function (a) {
        d.scheduleScale();
      });
  };
  l.fn.imageScale.Constructor = m;
  m.prototype = {
    NONE: 'none',
    FILL: 'fill',
    BEST_FILL: 'best-fill',
    BEST_FIT: 'best-fit',
    BEST_FIT_DOWN_ONLY: 'best-fit-down',
    ALIGN_LEFT: 'left',
    ALIGN_RIGHT: 'right',
    ALIGN_CENTER: 'center',
    ALIGN_TOP: 'top',
    ALIGN_BOTTOM: 'bottom',
    ALIGN_TOP_LEFT: 'top-left',
    ALIGN_TOP_RIGHT: 'top-right',
    ALIGN_BOTTOM_LEFT: 'bottom-left',
    ALIGN_BOTTOM_RIGHT: 'bottom-right',
    constructor: m,
    element: null,
    options: null,
    scale: function (a, f) {
      if (!this._isDestroyed && !1 !== this._canScale) {
        var d = this,
          b = this.options,
          g = this.$parent,
          e = this.element,
          k = this.$element,
          h = this.$img;
        if (a) {
          b.hideParentOverflow &&
            g.css({
              overflow: 'hidden',
            });
        } else if (this.src !== h.attr('src')) {
          this.destroy();
          k.data('imageScale', null);
          k.imageScale(b);
          return;
        }
        this._didScheduleScale = !1;
        if (!b.rescaleOnResize || f || this._needUpdate(this.parent)) {
          f = f ? f : {};
          if ((h = f.transition))
            (this._canScale = !1),
              k.css('transition', 'all ' + h + 'ms'),
              setTimeout(function () {
                d._canScale = null;
                k.css('transition', 'null');
              }, h);
          var h = f.destWidth ? f.destWidth : g.outerWidth(),
            c = f.destHeight ? f.destHeight : g.outerHeight(),
            l = f.destWidth ? f.destWidth : g.innerWidth(),
            n = f.destHeight ? f.destHeight : g.innerHeight(),
            g = h - l,
            l = c - n,
            n = k.attr('data-scale'),
            m = k.attr('data-align'),
            n = n ? n : b.scale,
            r = m ? m : b.align,
            m = b.fadeInDuration;
          if (n) {
            this._cacheDestWidth === h &&
              this._cacheDestHeight === c &&
              2 < b.logLevel &&
              console.log(
                "imageScale - DEBUG NOTICE: The parent size hasn't changed: dest width: '" +
                  h +
                  "' - dest height: '" +
                  c +
                  "'.",
                e
              );
            var p = this.imgWidth,
              q = this.imgHeight;
            h && c && p && q
              ? ((this._cacheDestWidth = h),
                (this._cacheDestHeight = c),
                (e = this._innerFrameForSize(n, r, p, q, h, c)),
                g && (e.x -= g / 2),
                l && (e.y -= l / 2),
                k.css({
                  position: 'absolute',
                  top: e.y + 'px',
                  left: e.x + 'px',
                  width: e.width + 'px',
                  height: e.height + 'px',
                  'max-width': 'none',
                }),
                a &&
                  m &&
                  (k.css({
                    display: 'none',
                  }),
                  k.fadeIn(m)),
                b.didScale.call(this, a, f))
              : 0 < b.logLevel &&
                console.error(
                  "imageScale - DEBUG ERROR: The dimensions are incorrect: source width: '" +
                    p +
                    "' - source height: '" +
                    q +
                    "' - dest width: '" +
                    h +
                    "' - dest height: '" +
                    c +
                    "'.",
                  e
                );
          } else
            2 < b.logLevel &&
              console.log(
                'imageScale - DEBUG NOTICE: The scale property is null.',
                e
              );
        }
      }
    },
    destroy: function () {
      this._isDestroyed = !0;
      this.$element.removeData('imageScale');
    },
    _innerFrameForSize: function (a, f, d, b, g, e) {
      var k, h, c;
      c = {
        x: 0,
        y: 0,
        width: g,
        height: e,
      };
      if (a === this.FILL) return c;
      k = g / d;
      h = e / b;
      switch (a) {
        case this.BEST_FIT_DOWN_ONLY:
          a !== this.BEST_FIT_DOWN_ONLY &&
            1 < this.options.logLevel &&
            console.warn(
              "imageScale - DEBUG WARNING: The scale '" +
                a +
                "' was not understood."
            );
          a = d > g || b > e ? (k < h ? k : h) : 1;
          break;
        case this.BEST_FIT:
          a = k < h ? k : h;
          break;
        case this.NONE:
          a = 1;
          break;
        default:
          a = k > h ? k : h;
      }
      d *= a;
      b *= a;
      c.width = Math.round(d);
      c.height = Math.round(b);
      switch (f) {
        case this.ALIGN_LEFT:
          c.x = 0;
          c.y = e / 2 - b / 2;
          break;
        case this.ALIGN_RIGHT:
          c.x = g - d;
          c.y = e / 2 - b / 2;
          break;
        case this.ALIGN_TOP:
          c.x = g / 2 - d / 2;
          c.y = 0;
          break;
        case this.ALIGN_BOTTOM:
          c.x = g / 2 - d / 2;
          c.y = e - b;
          break;
        case this.ALIGN_TOP_LEFT:
          c.x = 0;
          c.y = 0;
          break;
        case this.ALIGN_TOP_RIGHT:
          c.x = g - d;
          c.y = 0;
          break;
        case this.ALIGN_BOTTOM_LEFT:
          c.x = 0;
          c.y = e - b;
          break;
        case this.ALIGN_BOTTOM_RIGHT:
          c.x = g - d;
          c.y = e - b;
          break;
        default:
          f !== this.ALIGN_CENTER &&
            1 < this.options.logLevel &&
            console.warn(
              "imageScale - DEBUG WARNING: The align '" +
                f +
                "' was not understood."
            ),
            (c.x = g / 2 - d / 2),
            (c.y = e / 2 - b / 2);
      }
      return c;
    },
    _needUpdate: function (a) {
      a = a.clientHeight + ' ' + a.clientWidth;
      return this._lastParentSize !== a ? ((this._lastParentSize = a), !0) : !1;
    },
    scheduleScale: function () {
      if (!this._didScheduleScale)
        if (window.requestAnimationFrame) {
          var a = this;
          this._didScheduleScale = !0;
          requestAnimationFrame(function () {
            setTimeout(function () {
              a.scale();
            }, 0);
          });
        } else this.scale();
    },
  };
}),
  $.widget('custom.spotlightmenu', $.ui.selectmenu, {
    _renderItem: function (ul, item) {
      var label = $(item.element.context).data('label');
      var level = $(item.element.context).data('level');
      var directChildren = $(item.element.context).data('direct-children');
      var padding =
        directChildren != null && directChildren.length > 0 ? 0 : 17;

      if (level == null) {
        var li = $('<li style="padding-left: 31px">');
      } else if (level == 0) {
        var li = $(
          '<li value="' +
            item.value +
            '" style="padding-left: ' +
            (padding + 15) +
            'px">'
        );
      } else {
        var li = $(
          '<li class="ui-menu-item-disabled" value="' +
            item.value +
            '" style="padding-left: ' +
            (level * 30 + padding) +
            'px">'
        );
      }
      this._setText(li, item.label);
      if (typeof label != 'undefined') {
        if (label != 'all') {
          label = label.toLowerCase().replace(' ', '-');
          var allChildren = $(item.element.context).data('all-children');
          var childrenHasProducts = $(item.element.context).data(
            'children-products'
          );
          if (
            directChildren != null &&
            directChildren.length > 0 &&
            childrenHasProducts == true
          ) {
            var but = $(
              '<button id="categories-button-' +
                item.value +
                '" class="categories-button " onClick="onClickFunc(event, \'' +
                item.value +
                "', '" +
                directChildren +
                "', '" +
                allChildren +
                '\')">+</button>'
            );

            but.prependTo(li);
          }
        }
      } else {
        li.hide();
      }
      return li.appendTo(ul);
    },
    open: function (event, ui) {
      console.log('hello');
      $(event.currentTarget)
        .find('.icon_Menu')
        .removeClass('icon_Menu')
        .addClass('icon_Remove');
      return this._superApply(event, ui);
    },
    close: function (event, ui) {
      $('.icon_Remove').removeClass('icon_Remove').addClass('icon_Menu');
      return this._superApply(event, ui);
    },
  });
$.widget('custom.spotlight', {
  datas: {},
  options: {
    lang: 'fr',
    country: 'fr',
    now: new Date(),
    currentArea: '',
    currentCategory: '',
    tracking: '',
    skipHomepage: false,
    linksLabel: 'View details',
    areaMenuLabel: {
      en: 'Take me to...',
      fr: 'Faites-moi découvrir...',
      de: 'Go to...',
      es: 'Ir a...',
      it: 'Take me to...',
      nl: 'Take me to...',
    },
    categoryMenuLabel: {
      en: "I'm interested in...",
      fr: 'Je suis intéressé(e) par...',
      de: 'Ich interessiere mich für...',
      es: 'Estoy interesado en...',
      it: "I'm interested in...",
      nl: "I'm interested in...",
    },
    seeAllLabel: {
      en: 'See All',
      fr: 'Voir tout',
      de: 'Alle anzeigen',
      es: 'Ver todo',
      it: 'See All',
      nl: 'See All',
    },
    allCategoriesLabel: {
      en: 'All categories',
      fr: 'Toutes les catégories',
      de: 'Alle Kategorien',
      es: 'Todas las categorias',
      it: 'All categories',
      nl: 'All categories',
    },
    hideLabel: {
      en: 'Hide',
      fr: 'Moins',
      de: 'Ausblenden',
      es: 'Ocultar',
      it: 'Hide',
      nl: 'Hide',
    },
    showMoreLabel: {
      en: 'Learn more',
      fr: 'En savoir plus',
      de: 'Weitere Informationen',
      es: 'Más información',
      it: 'Learn more',
      nl: 'Learn more',
    },
    hideAllLabel: {
      en: 'Show less product content',
      fr: 'Reduire les descriptions',
      de: 'Weniger Produkte anzeigen Inhalt',
      es: 'Mostrar menos contenido de productos',
      it: 'Hide',
      nl: 'Hide',
    },
    showAllLabel: {
      en: 'Show more product content',
      fr: 'En savoir plus sur les produits',
      de: 'Weitere Produkte anzeigen Inhalt',
      es: 'Mostrar el contenido de más productos',
      it: 'Learn more',
      nl: 'Learn more',
    },
    PrintLabel: {
      en: 'Download as PDF',
      fr: 'Télécharger en PDF',
      de: 'Als PDF herunterladen',
      es: 'Descargar como PDF',
      it: 'Download as PDF',
      nl: 'Download as PDF',
    },
    tableTitleLabel: {
      en: 'Product code',
      fr: 'Code produit',
      de: 'Produktcode',
      es: 'Código de producto',
      it: 'Product code',
      nl: 'Product code',
    },
    markLabel: {
      en: 'Brand',
      fr: 'Marque',
      de: 'Marke',
      es: 'Marca',
      it: 'Brand',
      nl: 'Brand',
    },
    quantityLabel: {
      en: 'Quantity',
      fr: 'Quantité',
      de: 'Menge',
      es: 'Cantidad',
      it: 'Quantity',
      nl: 'QUantity',
    },
    homeLabel: 'Spotlight Home',
    allCarousels: false,
    url: './data2.json',
    debug: 0,
    itemPerLines: 3,
    hide: true,
  },
  _create: function () {
    console.log('create');
    this._on(this.element, {
      'spotlightmenuselect select#areas': function (event) {
        var self = this;
        $('#spotlight-content').fadeOut('fast', function () {
          $('#spotlight-content').html(self._getLoaderHtml());
          self.options.currentArea = $(event.currentTarget).val();
          if (
            (self.options.currentArea == '' &&
              self.options.currentCategory == '') ||
            self.options.currentArea == '0'
          ) {
            self.options.currentCategory = '';
            self.options.currentArea = '';
            self._buildHomepage();
            if (self.datas.showAttributes) {
              $('.spotlight_show_all_div').html('').fadeIn('fast');
              self.options.hide = true;
            }
            $('.spotlight-item-image img').imageScale();
          } else {
            if (self.options.currentCategory == '')
              $('select#categories')
                .val(0)
                .spotlightmenu('refresh')
                .trigger('spotlightmenuselect');
            var content = self._getItemsHtml();
            if (self.datas.showAttributes) {
              self.options.hide = true;
              $('.spotlight_show_all_div')
                .html(
                  '<button class="show-all-button" onclick="showAll(' +
                    self.options.hide +
                    ')">' +
                    self.options.showAllLabel[self.options.lang] +
                    '</button>'
                )
                .fadeIn('fast');
            }
            $('#spotlight-content').html(content).fadeIn('fast');
            self._highlightFirstRow();
            $('.spotlight-item-image img').imageScale();
          }
        });
      },
      'spotlightmenuselect select#categories': function (event) {
        var self = this;
        $('#spotlight-content').fadeOut('fast', function () {
          $('#spotlight-content').html(self._getLoaderHtml());
          self.options.currentCategory = $(event.currentTarget).val();
          if (self.options.currentCategory != '0') {
            const id = self.options.currentCategory.toString();
            const lang = self.options.lang;
            self.datas.categories.map((cat, i) => {
              if (cat.id == id) {
                console.log(self.options.lang.toUpperCase());
                console.log(cat);
                if (
                  cat[`content_category_${self.options.lang.toUpperCase()}`] !=
                  undefined
                ) {
                  self.options.findContentCategory =
                    cat[
                      `content_category_${self.options.lang.toUpperCase()}`
                    ] != null;
                  self.options.contentCat =
                    cat[
                      `content_category_${self.options.lang.toUpperCase()}`
                    ] != null
                      ? cat[
                          `content_category_${self.options.lang.toUpperCase()}`
                        ]
                      : null;
                  self.options.selectLabelCat = cat?.label;
                  let newString = self.options.contentCat;
                  $('#displayCat').text(newString);
                } else {
                  self.options.findContentCategory = false;
                }
              }
              if (self.options.findContentCategory) {
                console.log(
                  'findContentCategoryfindContentCategoryfindContentCategoryfindContentCategoryfindContentCategoryfindContentCategory'
                );
                $('#displayCat').show();
              } else {
                $('#displayCat').hide();
              }
            });
          } else {
            $('#displayCat').hide();
          }
          if (
            self.options.currentArea == '' &&
            self.options.currentCategory == ''
          ) {
            self._buildHomepage();
            if (self.datas.showAttributes) {
              $('.spotlight_show_all_div').html('').fadeIn('fast');
              self.options.hide = true;
            }
            $('.spotlight-item-image img').imageScale();
          } else {
            var content = self._getItemsHtml();
            if (self.datas.showAttributes) {
              self.options.hide = true;
              $('.spotlight_show_all_div')
                .html(
                  '<button class="show-all-button" onclick="showAll(' +
                    self.options.hide +
                    ')">' +
                    self.options.showAllLabel[self.options.lang] +
                    '</button>'
                )
                .fadeIn('fast');
            }
            $('#spotlight-content').html(content).fadeIn('fast');
            self._highlightFirstRow();
            $('.spotlight-item-image img').imageScale();
          }
        });
      },
      'click a.spotlight-carousel-nav.prev': function (event) {
        event.preventDefault();
        this._moveCarousel(
          $(event.currentTarget)
            .closest('div.spotlight-carousel-container')
            .find('div.spotlight-carousel'),
          'prev'
        );
      },
      'click a.spotlight-carousel-nav.next': function (event) {
        event.preventDefault();
        this._moveCarousel(
          $(event.currentTarget)
            .closest('div.spotlight-carousel-container')
            .find('div.spotlight-carousel'),
          'next'
        );
      },
      'click div.spotlight-carousel-item': function (event) {
        window.location.href = $(event.currentTarget).find('a').attr('href');
      },
      'click .spotlight-seeall-button': function (event) {
        var areaid = $(event.currentTarget).attr('name').split('-')[1];
        $('select#areas')
          .val(areaid)
          .spotlightmenu('refresh')
          .trigger('spotlightmenuselect');
      },
      'click .show-all-button': function (event) {
        if (this.options.hide) {
          this.options.hide = !this.options.hide;
          $('.spotlight_show_all_div')
            .html(
              '<button class="show-all-button" onclick="showAll(' +
                this.options.hide +
                ')">' +
                this.options.hideAllLabel[this.options.lang] +
                '</button>'
            )
            .fadeIn('fast');
        } else {
          this.options.hide = !this.options.hide;
          $('.spotlight_show_all_div')
            .html(
              '<button class="show-all-button" onclick="showAll(' +
                this.options.hide +
                ')">' +
                this.options.showAllLabel[this.options.lang] +
                '</button>'
            )
            .fadeIn('fast');
        }
      },
    });
    this.element.html(
      '<div id="spotlight-content">\n\
    ' +
        this._getLoaderHtml() +
        '\n\
    </div>'
    );
    var t = this;
    console.log(this.options.url, 'URLLLLLLLLL');
    try {
      $.ajax({
        url: t.options.url,
        type: 'GET',
        dataType: 'json',
        success: function (e) {
          'object' == typeof e
            ? ((t.datas = e), t._build())
            : t.element.html('<p>No results</p>');
        },
        error: function (e) {
          t.element.html('<p>Unable to load data</p>');
        },
      });
    } catch (t) {
      this.element.html('<p>Unable to load data</p>');
    }
  },
  _build: function () {
    this.options.currentArea = this._getUrlParameter('area');
    this.options.currentCategory = this._getUrlParameter('category');
    if (
      this.options.skipHomepage == false &&
      this.options.currentArea == '' &&
      this.options.currentCategory == ''
    ) {
      this._buildHomepage();
      $('.spotlight-item-image img').imageScale();
      if (this.options.debug == 1 && this.datas.errors) {
        for (var e = 0; e < this.datas.errors.length; e++) {
          this.element.prepend(
            '<sdiv class="message is-danger"><p class="message-body">' +
              this.datas.errors[e] +
              '</p></div>'
          );
        }
      }
    } else {
      var content = this._getItemsHtml();
      this.element.html('');
      if ($('#spotlight select').length == 0) {
        var selects = this._getDropdownsHtml();
        this.element.prepend(
          '<div id="spotlight-dropdown">' +
            selects +
            '<div style="clear:both"></div></div>'
        );
        $('#spotlight-dropdown select').spotlightmenu({
          icons: {
            button: 'font_icon icon_Menu',
          },
        });
      }
      this.element.append('<div id="spotlight-content">' + content + '</div>');
      this._highlightFirstRow();
      $('.spotlight-item-image img').imageScale();
    }
  },
  _filterProducts: function () {
    var self = this;
    return this.datas.products.filter(function (elem) {
      var sdate = new Date(elem.start_date);
      var edate = new Date(elem.end_date);
      return (
        elem.countries.indexOf(self.options.country.toUpperCase()) >= 0 &&
        self.options.now.getTime() >= sdate.getTime() &&
        self.options.now.getTime() <= edate.getTime() &&
        (self.options.currentCategory == '' ||
          self.options.currentCategory == 0 ||
          elem.categories.indexOf(self.options.currentCategory) >= 0) &&
        (self.options.currentArea == '' ||
          elem.areas.indexOf(self.options.currentArea) >= 0)
      );
    });
  },
  _getFormattedProduct: function (prod) {
    var displayPromotion = prod.offer === 'promotion';
    var title =
      prod[this.options.lang].title && prod[this.options.lang].title.length > 0
        ? prod[this.options.lang].title
        : prod.title;
    var bullet = this.datas.showAttributes
      ? prod[this.options.lang].bullet
      : '';
    var teaser = this.datas.showAttributes
      ? prod[this.options.lang].teaser
      : '';
    var table = '';
    var link = '';
    var image = prod[`image_${this.options.lang.toUpperCase()}`]
      ? prod[`image_${this.options.lang.toUpperCase()}`]
      : prod.image;
    var ext =
      prod.url && this.options.country == 'gb'
        ? 'co.uk/gb/en/'
        : prod.url && this.options.country != 'gb'
        ? this.options.country +
          '/' +
          this.options.country +
          '/' +
          this.options.country +
          '/'
        : this.options.country == 'gb'
        ? 'co.uk'
        : this.options.country;
    let selectedCat = '';
    if (this.options.currentCategory != '0') {
      const id = this.options.currentCategory.toString();
      this.datas.categories.map((cat, i) => {
        if (cat.id == id) {
          selectedCat = cat.label;
        }
      });
    }
    if (prod.link_type == '1' && selectedCat == 'Chemicals') {
      if (prod.url) {
        link = 'https://www.fishersci.' + ext + prod.url;
      } else {
        link =
          'https://www.fishersci.' +
          ext +
          '/shop/products/product/' +
          prod.item_code +
          this.options.tracking;
      }
      if (
        prod[this.options.lang].tableContent != null &&
        this.datas.showAttributes
      ) {
        tableContent = prod[this.options.lang].tableContent
          .replaceAll('EXT', ext)
          .replaceAll('TRACKING', this.options.tracking);
        const newTableContent = tableContent.replace('</td></tr>');

        table =
          "<table class='attributesChemicals'><tr><thead><td>" +
          this.options.tableTitleLabel[this.options.lang] +
          '</td><td>' +
          this.options.markLabel[this.options.lang] +
          '</td>' +
          prod[this.options.lang].tableTitle +
          '<td>' +
          this.options.quantityLabel[this.options.lang] +
          '</td>' +
          '</td> </thead></tr><tr>' +
          newTableContent +
          '</td></tr></table>';
        bullet = '';
        teaser = '';
      }
    }
    if (prod.link_type == '1' && selectedCat != 'Chemicals') {
      if (prod.url) {
        link = 'https://www.fishersci.' + ext + prod.url;
      } else {
        link =
          'https://www.fishersci.' +
          ext +
          '/shop/products/product/' +
          prod.item_code +
          this.options.tracking;
      }
      if (
        prod[this.options.lang].tableContent != null &&
        this.datas.showAttributes
      ) {
        tableContent = prod[this.options.lang].tableContent
          .replaceAll('EXT', ext)
          .replaceAll('TRACKING', this.options.tracking);
        table =
          "<table class='attributes'><tr><thead><td>" +
          this.options.tableTitleLabel[this.options.lang] +
          '</td><td>' +
          this.options.markLabel[this.options.lang] +
          '</td>' +
          prod[this.options.lang].tableTitle +
          '<td>' +
          this.options.quantityLabel[this.options.lang] +
          '</td></thead></tr><tr>' +
          tableContent +
          '</tr></table>';
      }
    } else if (prod.link_type == '2' && selectedCat == 'Chemicals') {
      let newContent = '';
      if (prod.url) {
        link = 'https://www.fishersci.' + ext + prod.url;
      } else {
        link =
          'https://www.fishersci.' +
          ext +
          '/shop/products/family/p-' +
          prod.family_code +
          this.options.tracking;
      }
      if (
        prod[this.options.lang].tableContent != null &&
        this.datas.showAttributes
      ) {
        tableContent = prod[this.options.lang].tableContent
          .replaceAll('EXT', ext)
          .replaceAll('TRACKING', this.options.tracking);
        const removeTrArray = tableContent
          .split('<tr>')
          .join('')
          .split('</tr>');
        const finalArray = removeTrArray.filter((item) => {
          return item != '';
        });
        let newContent = '';
        finalArray.map((item, i) => {
          newContent += '<tr>' + item + '</tr>';
        });
        table =
          "<table class='attributesChemicals'><tr><thead><td>" +
          this.options.tableTitleLabel[this.options.lang] +
          '</td><td>' +
          this.options.markLabel[this.options.lang] +
          '</td>' +
          prod[this.options.lang].tableTitle +
          '<td>' +
          this.options.quantityLabel[this.options.lang] +
          '</td></thead></tr><tr>' +
          newContent +
          '</tr></table>';
      }
      bullet = '';
      teaser = '';
    } else if (prod.link_type == '2' && selectedCat != 'Chemicals') {
      if (prod.url) {
        link = 'https://www.fishersci.' + ext + prod.url;
      } else {
        link =
          'https://www.fishersci.' +
          ext +
          '/shop/products/family/p-' +
          prod.family_code +
          this.options.tracking;
      }
      if (
        prod[this.options.lang].tableContent != null &&
        this.datas.showAttributes
      ) {
        tableContent = prod[this.options.lang].tableContent
          .replaceAll('EXT', ext)
          .replaceAll('TRACKING', this.options.tracking);
        table =
          "<table class='attributes'><tr><thead><td>" +
          this.options.tableTitleLabel[this.options.lang] +
          '</td><td>' +
          this.options.markLabel[this.options.lang] +
          '</td>' +
          prod[this.options.lang].tableTitle +
          '<td>' +
          this.options.quantityLabel[this.options.lang] +
          '</td></thead></tr><tr>' +
          tableContent +
          '</tr></table>';
      }
    } else if (prod.link_type == '3')
      if (prod.url) {
        link = 'https://www.fishersci.' + ext + prod.url;
      } else {
        link =
          'https://www.fishersci.' +
          ext +
          '/' +
          this.options.country +
          '/' +
          this.options.lang +
          '/catalog/featured/' +
          prod.featured_code +
          this.options.tracking;
      }
    var offer =
      prod[this.options.lang].offer && prod[this.options.lang].offer.length > 0
        ? prod[this.options.lang].offer
        : prod.offer;
    var d = prod.discounts[this.options.country.toUpperCase()]
      ? prod.discounts[this.options.country.toUpperCase()]
      : 0;
    if (d != '' && d != '0') {
      //offer = "-" + d + "%";
      if (!isNaN(parseFloat(d)) && isFinite(d)) offer = '-' + d + '%';
      else offer = d;
    }
    var hlclass = '';
    if (prod.highlight == '1') hlclass = 'spotlight-item-highlight';
    return {
      title: title,
      link: link,
      offer: offer,
      class: hlclass,
      image: image,
      teaser: teaser,
      bullet: bullet,
      table: table,
      displayPromotion: displayPromotion,
    };
  },
  _getCategoryLevel: function (categories, parent, level) {
    categories.forEach((category) => {
      if (parent == category.id) {
        level++;
        level = this._getCategoryLevel(categories, category.parent, level);
      }
    });

    return level;
  },
  _getDirectChildren: function (categories, id) {
    var children = '';

    categories.forEach((category) => {
      if (id == category.parent) {
        children += category.id + '-';
      }
    });
    children.substr(0, children.length - 1);

    return children;
  },
  _getAllChildren: function (categories, id) {
    var children = '';

    categories.forEach((category) => {
      if (id == category.parent) {
        children += category.id + '-';
        children += this._getAllChildren(categories, category.id, children);
      }
    });

    return children;
  },
  _sortSubCategoriesByLang: function (finalCategories, categories, id, lang) {
    const subCategories = categories.filter((elem) => elem.parent == id);

    if (subCategories.length > 0) {
      subCategories.sort((a, b) => a[lang].localeCompare(b[lang]));
      subCategories.forEach((subCategory) => {
        finalCategories.push(subCategory);
        this._sortSubCategoriesByLang(
          finalCategories,
          categories,
          subCategory.id,
          lang
        );
      });
    }
  },
  _sortCategoriesByLang: function (categories, lang) {
    const finalCategories = [];
    const mainCategories = categories.filter((elem) => elem.parent == null);

    mainCategories.forEach((category) => {
      finalCategories.push(category);
      this._sortSubCategoriesByLang(
        finalCategories,
        categories,
        category.id,
        lang
      );
    });

    return finalCategories;
  },
  _childrenHasProducts: function (children, products, country) {
    for (var i = 0; i < products.length; i++) {
      const filterCountry = products[i].countries.filter(
        (count) => count == country.toUpperCase()
      );
      const allChildren = children.split('-');

      if (filterCountry.length > 0) {
        for (var j = 0; j < allChildren.length; j++) {
          const filterCategory = products[i].categories.filter(
            (cat) => cat == allChildren[j]
          );

          if (filterCategory.length > 0) {
            return 'true';
          }
        }
      }
    }
    return 'false';
  },
  _hasProducts: function (category, products, country) {
    for (var i = 0; i < products.length; i++) {
      const filterCategory = products[i].categories.filter(
        (cat) => cat == category.id
      );
      const filterCountry = products[i].countries.filter(
        (count) => count == country.toUpperCase()
      );
      if (filterCategory.length > 0 && filterCountry.length > 0) {
        return true;
      }
    }
    return false;
  },
  _getDropdownsHtml: function () {
    var select1 =
      '<select id="areas" name="area"><option value="">' +
      this.options.areaMenuLabel[this.options.lang] +
      '</option>\n\
    <option value="0" data-label="Home">' +
      this.options.homeLabel +
      '</option>';
    var select2 =
      '<select id="categories" name="category"><option value="">' +
      this.options.categoryMenuLabel[this.options.lang] +
      '</option>\n\
      <option data-label="all" value="0">' +
      this.options.allCategoriesLabel[this.options.lang] +
      '</option>';
    var l1 = this.datas.areas.length;
    var l2 = this.datas.categories.length;
    for (var i = 0; i < l1; i++) {
      var areaid = this.datas.areas[i].id;
      var label = this.datas.areas[i].label;
      var text =
        this.datas.areas[i][this.options.lang] &&
        this.datas.areas[i][this.options.lang].length > 0
          ? this.datas.areas[i][this.options.lang]
          : this.datas.areas[i].label;
      var selected = this.options.currentArea == areaid ? 'selected' : '';
      select1 =
        select1 +
        '<option data-label="' +
        label +
        '" value="' +
        areaid +
        '" ' +
        selected +
        '>' +
        text +
        '</option>';
    }
    var sortedCategories = this._sortCategoriesByLang(
      this.datas.categories,
      this.options.lang
    );
    for (var i = 0; i < l2; i++) {
      if (
        this._hasProducts(
          sortedCategories[i],
          this.datas.products,
          this.options.country
        )
      ) {
        var text =
          sortedCategories[i][this.options.lang] &&
          sortedCategories[i][this.options.lang].length > 0
            ? sortedCategories[i][this.options.lang]
            : sortedCategories[i].label;
        var label = sortedCategories[i].label;
        var selected =
          this.options.currentCategory == sortedCategories[i].id
            ? 'selected'
            : '';
        var level = this._getCategoryLevel(
          sortedCategories,
          sortedCategories[i].parent,
          0
        );
        var directChildren = this._getDirectChildren(
          sortedCategories,
          sortedCategories[i].id
        );
        var allChildren = this._getAllChildren(
          sortedCategories,
          sortedCategories[i].id
        );
        allChildren.substr(0, allChildren.length - 1);
        select2 =
          select2 +
          '<option data-children-products="' +
          this._childrenHasProducts(
            allChildren,
            this.datas.products,
            this.options.country
          ) +
          '" data-direct-children="' +
          directChildren +
          '" data-all-children="' +
          allChildren +
          '" data-level="' +
          level +
          '" data-label="' +
          label +
          '" value="' +
          sortedCategories[i].id +
          '" ' +
          selected +
          '>' +
          text +
          '</option>';
      }
    }
    select1 = select1 + '</select><span class="spotlight_show_all_div"></span>';
    select2 = select2 + '</select>';
    var displayCatSelect =
      '</br> </br><p id="displayCat" style="display:none; margin-left: 22rem; font-size: 1.75rem; bold: 500">' +
      this.options.selectLabelCat +
      '</p>';
    return select1 + select2 + displayCatSelect;
    return select1 + select2;
  },
  _buildHomepage: function () {
    var products = this._filterProducts();
    var hpprod = [];
    var content = [];
    var l1 = this.datas.areas.length;
    for (var i = 0; i < l1; i++) {
      var areaid = this.datas.areas[i].id;
      var title = this.datas.areas[i][this.options.lang];
      if (title == '' && this.datas.areas[i].en != '')
        title = this.datas.areas[i].en;
      else if (title == '') title = this.datas.areas[i].label;
      hpprod = products
        .filter(function (elem) {
          return elem.areas.indexOf(areaid) >= 0;
        })
        .slice(0, 3);
      if (hpprod.length > 0) {
        content[i] =
          '<h3 class="title is-4">' +
          title +
          '</h3>' +
          this._getCarouselHtml(hpprod) +
          '<button class="button spotlight-seeall-button" name="area-' +
          areaid +
          '">' +
          this.options.seeAllLabel[this.options.lang] +
          '</button>';
      }
      if (this.options.allCarousels == false) break;
    }
    if (this.options.allCarousels == false) {
      for (var i = 1; i < l1; i++) {
        var areaid = this.datas.areas[i].id;
        var title = this.datas.areas[i][this.options.lang];
        if (title == '' && this.datas.areas[i].en != '')
          title = this.datas.areas[i].en;
        else if (title == '') title = this.datas.areas[i].label;
        hpprod = products
          .filter(function (elem) {
            return elem.areas.indexOf(areaid) >= 0;
          })
          .slice(0, 3);
        if (hpprod.length > 0) {
          content[i] =
            '<h3 class="title is-4">' +
            title +
            '</h3><div class="spotlight-items-hp">' +
            this._getItemsHtml(hpprod) +
            '</div>' +
            '<button class="button spotlight-seeall-button" name="area-' +
            areaid +
            '">' +
            this.options.seeAllLabel[this.options.lang] +
            '</button>';
        }
      }
    }
    var selects = this._getDropdownsHtml();
    this.element.html('');
    this.element.prepend(
      '<div id="spotlight-dropdown">' +
        selects +
        '<div style="clear:both"></div></div>'
    );
    this.element.append('<div id="spotlight-content"></div>');
    for (var i = 0; i < content.length; i++) {
      $('#spotlight-content').append(content[i]).fadeIn('fast');
    }
    $('#spotlight-dropdown select').spotlightmenu({
      icons: {
        button: 'font_icon icon_Menu',
      },
    });
  },
  _getItemsHtml: function (products) {
    var isHomePage = true;
    if (typeof products == 'undefined') {
      products = this._filterProducts();
      isHomePage = false;
    }
    var content = '';
    var ptotal = products.length;
    var count = 0;
    for (var i = 0; i < ptotal; i++) {
      var prod = this._getFormattedProduct(products[i]);
      let image;
      console.log(prod);
      const langSelected = this.options.lang.toUpperCase();
      if (prod?.image_FR) {
        image = prod?.image_FR;
      } else {
        image = prod?.image;
      }
      var classext = '';
      if (typeof prod.title != 'undefined' && prod.title != '') {
        if (count % this.options.itemPerLines == 0 && !isHomePage) {
          content += '<div class="row spotlight-line-item">';
        }
        if (count == 1 && !isHomePage) {
          content =
            content +
            "\n\
            <div class='spotlight-item " +
            prod.class +
            '\' style="margin-left:43px !important ;margin-right:43px !important">\n ';
        } else {
          content =
            content +
            "\n\
            <div class='spotlight-item " +
            prod.class +
            "'>\n ";
        }
        var imageDisplay =
          'https://static.fishersci.eu/content/dam/fishersci/en_EU/promotions/monthly_promotions/great_deals/18773_great_deal_chemicals_EN.png';
        if (prod.displayPromotion) {
          content =
            content +
            "<a class='spotlight-item-link' href='" +
            prod.link +
            "'>\n\
            <div class='spotlight-item-image'>\n\
              <img src='" +
            prod.image +
            "' alt='" +
            prod.title.replace("'", '') +
            "' \n\
              data-scale='best-fit-down' data-align='center'>\n\
               <img src='" +
            imageDisplay +
            "' alt='" +
            prod.title.replace("'", '') +
            "' \n\
               class='spotlight-item-image-promotion'>\n\
            </div>\n\
            <div class='spotlight-offer'>" +
            prod.offer +
            "</div>\n\
            <div class='spotlight-item-title'>\n\
              <h3>" +
            prod.title +
            '</h3>\n\
            </div>\n\
          </a>';
        } else {
          content =
            content +
            "<a class='spotlight-item-link' href='" +
            prod.link +
            "'>\n\
            <div class='spotlight-item-image'>\n\
              <img src='" +
            prod.image +
            "' alt='" +
            prod.title.replace("'", '') +
            "' \n\
              data-scale='best-fit-down' data-align='center'>\n\
            </div>\n\
            <div class='spotlight-offer'>" +
            prod.offer +
            "</div>\n\
            <div class='spotlight-item-title'>\n\
              <h3>" +
            prod.title +
            '</h3>\n\
            </div>\n\
          </a>';
        }
        if (!isHomePage && this.datas.showAttributes) {
          content +=
            "<div class='spotlight-item-description'><div class='spotlight-item-description-extended hidden'><div>";
          content +=
            "<div class='spotlight-item-description-teaser shrink-description'>" +
            prod.teaser +
            "</div>\n\
                <div class='spotlight-item-description-keySpecs shrink-description'>" +
            prod.bullet +
            "</div>\n\
                <div class='attributesContainer'>" +
            prod.table +
            '</div>\n\
              </div>\n\
              <button onclick="hideDescription(this.parentElement)" class="show-more-button">' +
            this.options.hideLabel[this.options.lang] +
            '</button>  \n\
          </div>\n\
          <div class=\'spotlight-item-description-reduced\'>\n\
            <button onclick="showDescription(this.parentElement)" class="hide-button">' +
            this.options.showMoreLabel[this.options.lang] +
            '</button>  \n\
          </div></div>';
        }
        content += '</div>';
        if (
          (count + 1) % this.options.itemPerLines == 0 &&
          !isHomePage &&
          this.datas.showAttributes
        ) {
          content += '</div>';
          count = -1;
        }
        count++;
      }
    }
    if (content == '') content = 'No products found';
    return content;
  },
  _getCarouselHtml: function (products) {
    var content =
      '<div class="spotlight-carousel-container"><div class="spotlight-carousel">';
    var items = '';
    let image;
    var ptotal = products.length;
    for (var i = 0; i < ptotal; i++) {
      var prod = this._getFormattedProduct(products[i]);
      const lang = this.options.lang.toUpperCase();
      if (prod?.image_?.lang != null) {
        image = prod?.image_?.lang;
      } else {
        image = prod?.image;
      }
      items =
        items +
        '<div class="spotlight-carousel-item">\n\
        <a href="' +
        prod.link +
        '">\n\
          <h3>' +
        prod.title +
        '</h3>\n\
          <img src="' +
        image +
        '" alt="' +
        prod.title +
        '" ></a>\n\
      </div>';
    }
    if (ptotal <= 2) items = items + items;
    content =
      content +
      items +
      '</div>\n\
    <a class="spotlight-carousel-nav prev">&#10094;</a>\n\
    <a class="spotlight-carousel-nav next">&#10095;</a>\n\
    </div>';
    return content;
  },
  _moveCarousel: function (container, dir) {
    var margin = container.find('.spotlight-carousel-item:first').width();
    if (dir == 'prev') {
      var $last = container.find('.spotlight-carousel-item:last');
      $last.remove().css({
        'margin-left': '-' + margin + 'px',
      });
      container.find('.spotlight-carousel-item:first').before($last);
      $last.animate(
        {
          'margin-left': '0px',
        },
        600,
        'linear'
      );
    } else if (dir == 'next') {
      var $first = container.find('.spotlight-carousel-item:first');
      $first.animate(
        {
          'margin-left': '-' + margin + 'px',
        },
        600,
        'linear',
        function () {
          $first.remove().css({
            'margin-left': '0px',
          });
          container.find('.spotlight-carousel-item:last').after($first);
        }
      );
    }
  },
  _getUrlParameter: function (name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
      results = regex.exec(location.search);
    return results === null
      ? ''
      : decodeURIComponent(results[1].replace(/\+/g, ' '));
  },
  _getLoaderHtml: function () {
    return '<div class="loader"><img class="ajax_loading" src="//www.fishersci.com/etc/designs/fishersci/images/icons/ajax-loader.gif" /></div>';
  },
  _highlightFirstRow: function () {
    //$('.spotlight-item:lt(3)').removeClass('spotlight-item').addClass('spotlight-item-hp');
  },
});

function onClickFunc(e, item, dChildren, aChildren) {
  e.stopPropagation();

  var directChildren = dChildren.split('-');
  var allChildren = aChildren.split('-');

  childrenAreDisabled = false;
  for (var i = 0; i < directChildren.length; i++) {
    if (
      $("li[value|='" + directChildren[i] + "']").hasClass(
        'ui-menu-item-disabled'
      )
    ) {
      childrenAreDisabled = true;
      break;
    }
  }
  if (childrenAreDisabled) {
    directChildren.forEach((child) => {
      $("li[value|='" + child + "']").removeClass('ui-menu-item-disabled');
      $('#categories-button-' + item).html('-');
    });
  } else {
    allChildren.forEach((child) => {
      $("li[value|='" + child + "']").addClass('ui-menu-item-disabled');
      $('#categories-button-' + child).html('+');
    });
    $('#categories-button-' + item).html('+');
  }

  $('select#categories-menu').selectmenu('refresh');
}

function print() {
  var element = document.getElementById('spotlight-content');
  console.log('<body>' + element.innerHTML + '</body>');
}

function showAll(hide) {
  if (hide) {
    els = document.getElementsByClassName('hide-button');
    for (let i = 0; i < els.length; i++) {
      showDescription(els[i].parentElement);
    }
    hide = false;
  } else {
    els = document.getElementsByClassName('show-more-button');
    for (let i = 0; i < els.length; i++) {
      hideDescription(els[i].parentElement);
    }
    hide = true;
  }
}

function hideDescription(parentDiv) {
  var isAnyChildExtended = false;
  var maxHeight = 0;
  // remove the extended description and show the reduced one then change the height of the line to match with the original one
  parentDiv.classList.add('hidden');
  parentDiv.style.display = 'none';

  parentDiv.parentElement.lastChild.classList.remove('hidden');
  parentDiv.parentElement.lastChild.style.display = 'block';
  completeItem = parentDiv.parentElement.parentElement;
  lineElement = completeItem.parentElement;

  // before changing the height of the line we check if any of the childrens is extended if so we change the height to match the biggest one
  for (let i = 0; i < lineElement.children.length; i++) {
    itemDescription = lineElement.children[i].lastChild;
    if (itemDescription.firstChild.classList.length == 1) {
      height = itemDescription.firstChild.clientHeight;
      if (height > maxHeight) {
        maxHeight = height;
      }
      isAnyChildExtended = true;
    }
  }
  if (!isAnyChildExtended) {
    lineElement.style.height = '480px';
  } else {
    maxHeight += 400;
    lineElement.style.height = maxHeight + 'px';
  }
}

function showDescription(parentDiv) {
  // remove the reduced description and show the extended one then change the height of the line to match with the highest one
  parentDiv.classList.add('hidden');
  parentDiv.style.display = 'none';

  //show the descritpion
  parentDiv.parentElement.firstChild.classList.remove('hidden');

  // set the size of the line to the height of the biggest child
  completeItem = parentDiv.parentElement.parentElement;
  lineElement = completeItem.parentElement;
  var currentHeight = lineElement.clientHeight;
  var supposedHeight =
    completeItem.children[0].clientHeight +
    completeItem.children[1].clientHeight;
  if (currentHeight < supposedHeight) {
    lineElement.style.height = supposedHeight + 'px';
  }
}

function onClickFunc(e, item, dChildren, aChildren) {
  e.stopPropagation();

  var directChildren = dChildren.split('-');
  var allChildren = aChildren.split('-');

  childrenAreDisabled = false;
  for (var i = 0; i < directChildren.length; i++) {
    if (
      $("li[value|='" + directChildren[i] + "']").hasClass(
        'ui-menu-item-disabled'
      )
    ) {
      childrenAreDisabled = true;
      break;
    }
  }
  if (childrenAreDisabled) {
    directChildren.forEach((child) => {
      $("li[value|='" + child + "']").removeClass('ui-menu-item-disabled');
      $('#categories-button-' + item).html('-');
    });
  } else {
    allChildren.forEach((child) => {
      $("li[value|='" + child + "']").addClass('ui-menu-item-disabled');
      $('#categories-button-' + child).html('+');
    });
    $('#categories-button-' + item).html('+');
  }

  $('select#categories-menu').selectmenu('refresh');
}
