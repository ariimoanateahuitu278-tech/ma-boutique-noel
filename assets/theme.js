/* Noël Magique — scripts du thème (sans dépendance) */
(function () {
  'use strict';

  var NM = window.NoelMagique || { routes: {} };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function safeGet(key) { try { return window.localStorage.getItem(key); } catch (e) { return null; } }
  function safeSet(key, val) { try { window.localStorage.setItem(key, val); } catch (e) {} }

  /* ---------- Format monétaire Shopify ---------- */
  function formatMoney(cents) {
    var format = NM.moneyFormat || '{{amount_with_comma_separator}} €';
    cents = Math.round(Number(cents) || 0);
    function fmt(n, dec, thou, sep) {
      var str = (n / 100).toFixed(dec);
      var parts = str.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thou);
      return dec ? parts[0] + sep + parts[1] : parts[0];
    }
    return format.replace(/\{\{\s*(\w+)\s*\}\}/, function (_, key) {
      switch (key) {
        case 'amount': return fmt(cents, 2, ',', '.');
        case 'amount_no_decimals': return fmt(cents, 0, ',', '.');
        case 'amount_no_decimals_with_comma_separator': return fmt(cents, 0, '.', ',');
        case 'amount_with_apostrophe_separator': return fmt(cents, 2, "'", '.');
        case 'amount_with_space_separator': return fmt(cents, 2, ' ', ',');
        case 'amount_with_period_and_space_separator': return fmt(cents, 2, ' ', '.');
        default: return fmt(cents, 2, '.', ',');
      }
    });
  }

  /* ---------- Menu et recherche ---------- */
  var menuBtn = $('[data-menu-toggle]');
  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      var nav = $('#MobileNav');
      var open = nav.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', open);
    });
  }
  var searchBtn = $('[data-search-toggle]');
  if (searchBtn) {
    searchBtn.addEventListener('click', function () {
      var bar = $('#HeaderSearch');
      var open = bar.classList.toggle('is-open');
      searchBtn.setAttribute('aria-expanded', open);
      if (open) { var input = $('input[type="search"]', bar); if (input) input.focus(); }
    });
  }

  /* ---------- Apparition au défilement (le texte reste toujours visible en cas d'échec) ---------- */
  // Les titres et blocs de contenu apparaissent en douceur (jamais le hero, toujours visible dès l'ouverture).
  $$('.main .section-title, .main .section-intro, .main .faq, .main .specs, .main .help-links, .main .trust__item, .main .buyband__inner, .main .pbanner__content')
    .forEach(function (el) { if (!el.closest('.hero') && !el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', ''); });
  var revealEls = $$('[data-reveal]');
  if (!reduceMotion && 'IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    revealEls.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight) el.classList.add('is-visible');
      io.observe(el);
    });
    document.documentElement.classList.add('reveal-ready');
    // Filet de sécurité : tout est visible après 2,5 s quoi qu'il arrive.
    setTimeout(function () { revealEls.forEach(function (el) { el.classList.add('is-visible'); }); }, 2500);
  }

  /* ---------- Neige : une cinquantaine de flocons ---------- */
  var snow = $('[data-snowfall]');
  if (snow && !reduceMotion) {
    var count = window.innerWidth < 600 ? 40 : 55;
    var chars = ['❄', '❅', '❆'];
    var frag = document.createDocumentFragment();
    for (var i = 0; i < count; i++) {
      var f = document.createElement('span');
      var isDot = i % 3 === 0;
      f.className = 'snowflake' + (isDot ? ' snowflake--dot' : '');
      if (!isDot) {
        f.textContent = chars[i % chars.length];
        f.style.fontSize = (10 + Math.random() * 16).toFixed(1) + 'px';
      } else {
        var s = (4 + Math.random() * 6).toFixed(1) + 'px';
        f.style.width = s; f.style.height = s;
      }
      f.style.left = (Math.random() * 100).toFixed(2) + '%';
      f.style.opacity = (0.75 + Math.random() * 0.25).toFixed(2);
      var fall = (12 + Math.random() * 14).toFixed(1);
      var sway = (3 + Math.random() * 4).toFixed(1);
      f.style.animationDuration = fall + 's, ' + sway + 's';
      f.style.animationDelay = (-Math.random() * fall).toFixed(1) + 's, ' + (-Math.random() * sway).toFixed(1) + 's';
      frag.appendChild(f);
    }
    snow.appendChild(frag);
  }

  /* ---------- Coups de cœur ---------- */
  var wish = [];
  try { wish = JSON.parse(safeGet('nm-wishlist') || '[]') || []; } catch (e) { wish = []; }
  $$('[data-wishlist]').forEach(function (btn) {
    var h = btn.getAttribute('data-wishlist');
    if (wish.indexOf(h) > -1) btn.setAttribute('aria-pressed', 'true');
    btn.addEventListener('click', function () {
      var idx = wish.indexOf(h);
      if (idx > -1) { wish.splice(idx, 1); btn.setAttribute('aria-pressed', 'false'); }
      else { wish.push(h); btn.setAttribute('aria-pressed', 'true'); }
      safeSet('nm-wishlist', JSON.stringify(wish));
    });
  });

  /* ---------- Vidéo « Voir le produit en action » ---------- */
  $$('[data-video-open]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var modal = document.getElementById(btn.getAttribute('data-video-open'));
      if (!modal) return;
      var tpl = $('[data-video-template]', modal), slot = $('[data-video-slot]', modal);
      if (tpl && slot && !slot.children.length) slot.appendChild(tpl.content.cloneNode(true));
      modal.classList.add('is-open');
      var v = $('video', modal); if (v) { try { v.play(); } catch (e) {} }
    });
  });
  $$('.video-modal').forEach(function (modal) {
    function close() {
      modal.classList.remove('is-open');
      var v = $('video', modal); if (v) v.pause();
      var slot = $('[data-video-slot]', modal); if (slot) slot.innerHTML = '';
    }
    modal.addEventListener('click', function (e) { if (e.target === modal || e.target.hasAttribute('data-video-close')) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  });

  /* ---------- Galerie produit ---------- */
  $$('[data-gallery]').forEach(function (gallery) {
    var slides = $$('[data-slide]', gallery);
    var thumbs = $$('[data-thumb]', gallery);
    if (!slides.length) return;
    var current = slides.findIndex(function (s) { return s.classList.contains('is-active'); });
    if (current < 0) { current = 0; slides[0].classList.add('is-active'); }

    function show(i) {
      i = (i + slides.length) % slides.length;
      slides[current].classList.remove('is-active', 'is-zooming');
      var oldVid = $('video', slides[current]); if (oldVid) oldVid.pause();
      slides[i].classList.add('is-active');
      thumbs.forEach(function (t, k) { t.setAttribute('aria-current', k === i ? 'true' : 'false'); });
      current = i;
    }
    gallery.showMediaId = function (id) {
      var i = slides.findIndex(function (s) { return s.getAttribute('data-media-id') === String(id); });
      if (i > -1) show(i);
    };
    var prev = $('[data-gallery-prev]', gallery), next = $('[data-gallery-next]', gallery);
    if (prev) prev.addEventListener('click', function () { show(current - 1); });
    if (next) next.addEventListener('click', function () { show(current + 1); });
    thumbs.forEach(function (t) { t.addEventListener('click', function () { show(Number(t.getAttribute('data-thumb'))); }); });

    // Zoom : uniquement quand la souris BOUGE sur l'image (jamais à l'ouverture ni au clic).
    slides.forEach(function (slide) {
      if (!slide.hasAttribute('data-zoom')) return;
      var img = $('img', slide);
      if (!img) return;
      slide.addEventListener('pointermove', function (e) {
        if (e.pointerType !== 'mouse') return;
        var r = slide.getBoundingClientRect();
        var x = ((e.clientX - r.left) / r.width) * 100;
        var y = ((e.clientY - r.top) / r.height) * 100;
        img.style.transformOrigin = x + '% ' + y + '%';
        slide.classList.add('is-zooming');
      });
      slide.addEventListener('pointerleave', function () { slide.classList.remove('is-zooming'); img.style.transformOrigin = 'center'; });
    });

    // Balayage sur mobile
    var startX = null;
    var main = $('.gallery__main', gallery);
    main.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    main.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) show(current + (dx < 0 ? 1 : -1));
      startX = null;
    });
  });

  /* ---------- Fiche produit : offres, quantité, variantes ---------- */
  var DISCOUNTS = { 1: 0, 2: 0.05, 3: 0.10 };
  $$('[data-product-section]').forEach(function (section) {
    var form = $('[data-product-form]', section);
    var unitEl = $('[data-unit-price]', section);
    var unitPrice = null;
    var variantsJson = $('[data-variants-json]', section);
    var variants = variantsJson ? JSON.parse(variantsJson.textContent) : null;

    // Offres Whop : le bouton « Acheter » suit l'offre choisie.
    var whopOffers = $$('[data-whop-offer]', section);
    whopOffers.forEach(function (input) {
      input.addEventListener('change', function () {
        whopOffers.forEach(function (o) { o.closest('.offer-card').classList.toggle('is-selected', o.checked); });
        $$('[data-whop-buy]').forEach(function (a) { a.setAttribute('href', input.value); });
      });
    });

    if (!form) return;
    var qtyInput = $('[data-qty-input]', form);
    var offers = $$('[data-offer]', form);
    var totalEl = $('[data-buy-total]', form);
    var variantInput = $('[data-variant-id]', form);
    var addBtn = $('[data-add-to-cart]', form);
    var errorEl = $('[data-form-error]', form);

    function getUnit() {
      if (unitPrice !== null) return unitPrice;
      if (variants && variantInput) {
        var v = variants.find(function (x) { return String(x.id) === variantInput.value; });
        if (v) return v.price;
      }
      return null;
    }
    function computeTotal(q, unit) {
      var d = q >= 3 ? DISCOUNTS[3] : (DISCOUNTS[q] || 0);
      return Math.round(unit * q * (1 - d));
    }
    function sync(fromOffer) {
      var q = Math.max(1, parseInt(qtyInput.value, 10) || 1);
      qtyInput.value = q;
      if (!fromOffer) {
        var target = String(Math.min(q, 3));
        offers.forEach(function (o) { o.checked = o.value === target; });
      }
      offers.forEach(function (o) { o.closest('.offer-card').classList.toggle('is-selected', o.checked); });
      var unit = getUnit();
      if (unit !== null) {
        if (totalEl) totalEl.textContent = formatMoney(offers.length ? computeTotal(q, unit) : unit * q);
        $$('[data-offer-total]', form).forEach(function (el) {
          var n = Number(el.getAttribute('data-offer-total'));
          el.textContent = formatMoney(computeTotal(n, unit));
        });
      }
    }
    // Prix unitaire de départ, en centimes.
    if (variantInput && variantInput.getAttribute('data-price')) unitPrice = Number(variantInput.getAttribute('data-price'));
    offers.forEach(function (o) {
      o.addEventListener('change', function () { qtyInput.value = o.value; sync(true); });
    });
    var minus = $('[data-qty-minus]', form), plus = $('[data-qty-plus]', form);
    if (minus) minus.addEventListener('click', function () { qtyInput.value = Math.max(1, (parseInt(qtyInput.value, 10) || 1) - 1); sync(false); });
    if (plus) plus.addEventListener('click', function () { qtyInput.value = Math.min(99, (parseInt(qtyInput.value, 10) || 1) + 1); sync(false); });
    if (qtyInput) qtyInput.addEventListener('change', function () { sync(false); });

    // Variantes (seulement si elles existent vraiment avec leur photo)
    if (variants) {
      $$('input[data-option-index]', form).forEach(function (input) {
        input.addEventListener('change', function () {
          var selected = [];
          $$('input[data-option-index]:checked', form).forEach(function (i) { selected[Number(i.getAttribute('data-option-index'))] = i.value; });
          var match = variants.find(function (v) { return v.options.every(function (opt, k) { return opt === selected[k]; }); });
          if (!match) { addBtn.disabled = true; addBtn.textContent = 'Indisponible'; return; }
          variantInput.value = match.id;
          unitPrice = match.price;
          if (unitEl) unitEl.textContent = formatMoney(match.price);
          addBtn.disabled = !match.available;
          addBtn.textContent = match.available ? 'Ajouter au panier' : 'Épuisé';
          var g = $('[data-gallery]', section);
          if (g && g.showMediaId && match.media) g.showMediaId(match.media);
          var url = new URL(window.location.href); url.searchParams.set('variant', match.id);
          window.history.replaceState({}, '', url.toString());
          sync(false);
        });
      });
    }

    // Ajout au panier sans recharger la page
    form.addEventListener('submit', function (e) {
      if (!window.fetch) return;
      e.preventDefault();
      if (errorEl) errorEl.hidden = true;
      addBtn.disabled = true;
      var original = addBtn.textContent;
      addBtn.textContent = 'Ajout en cours…';
      fetch(NM.routes.cartAdd, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ items: [{ id: Number(variantInput.value), quantity: Math.max(1, parseInt(qtyInput.value, 10) || 1) }] })
      }).then(function (r) { return r.json().then(function (data) { return { ok: r.ok, data: data }; }); })
        .then(function (res) {
          if (!res.ok) throw new Error(res.data.description || res.data.message || 'Impossible d\'ajouter ce produit.');
          return refreshCart().then(openCart);
        })
        .catch(function (err) {
          if (errorEl) { errorEl.textContent = err.message; errorEl.hidden = false; }
        })
        .then(function () { addBtn.disabled = false; addBtn.textContent = original; });
    });

    $$('[data-sticky-add]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (form.requestSubmit) form.requestSubmit(); else addBtn.click();
      });
    });
    sync(false);
  });

  /* ---------- Barre d'achat : visible en haut (ordinateur) une fois le bouton principal dépassé ---------- */
  var stickyBar = $('[data-sticky-buy]');
  var mainBuy = $('[data-main-buy]');
  if (stickyBar && mainBuy && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      var e = entries[0];
      stickyBar.classList.toggle('is-shown', !e.isIntersecting && e.boundingClientRect.top < 0);
    }).observe(mainBuy);
  }

  /* ---------- Panier latéral ---------- */
  var drawer = $('#CartDrawer');
  var overlay = $('.drawer-overlay');
  var lastFocus = null;

  function openCart() {
    if (!drawer) return;
    lastFocus = document.activeElement;
    drawer.classList.add('is-open');
    overlay.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('drawer-open');
    drawer.focus();
  }
  function closeCart() {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    overlay.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('drawer-open');
    if (lastFocus) lastFocus.focus();
  }
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  function renderCart(cart) {
    var items = $('[data-cart-items]');
    var foot = $('[data-cart-foot]');
    $$('[data-cart-count]').forEach(function (el) { el.textContent = cart.item_count; el.hidden = cart.item_count === 0; });
    if (!items) return;
    if (!cart.item_count) {
      items.innerHTML = '<div class="drawer__empty"><p><strong>Ton panier est vide pour l\'instant.</strong></p><p>Jette un œil à nos idées cadeaux !</p><a href="' + escapeHtml(NM.routes.gifts || '/collections/all') + '" class="btn btn--primary">Découvrir la boutique</a></div>';
      foot.hidden = true;
      return;
    }
    items.innerHTML = cart.items.map(function (it) {
      var img = it.image ? '<img src="' + escapeHtml(it.image + (it.image.indexOf('?') > -1 ? '&' : '?') + 'width=160') + '" alt="' + escapeHtml(it.product_title) + '" width="72" height="72" loading="lazy">' : '<span></span>';
      return '<div class="line">' + img +
        '<div><a class="line__title" href="' + escapeHtml(it.url) + '">' + escapeHtml(it.product_title) + '</a>' +
        '<div class="line__qty"><button type="button" data-line-change="' + escapeHtml(it.key) + '" data-qty="' + (it.quantity - 1) + '" aria-label="Retirer un article">−</button><span>' + it.quantity + '</span><button type="button" data-line-change="' + escapeHtml(it.key) + '" data-qty="' + (it.quantity + 1) + '" aria-label="Ajouter un article">+</button></div>' +
        '<div><button type="button" class="line__remove" data-line-change="' + escapeHtml(it.key) + '" data-qty="0">Retirer</button></div></div>' +
        '<div class="line__price">' + formatMoney(it.final_line_price) + '</div></div>';
    }).join('');
    foot.hidden = false;
    var disc = $('[data-cart-discount]');
    if (disc) {
      disc.hidden = !cart.total_discount;
      $('[data-cart-discount-amount]').textContent = '−' + formatMoney(cart.total_discount);
    }
    $('[data-cart-total]').textContent = formatMoney(cart.total_price);
  }
  function refreshCart() {
    return fetch(NM.routes.cartJs, { headers: { 'Accept': 'application/json' } })
      .then(function (r) { return r.json(); })
      .then(function (cart) { renderCart(cart); return cart; });
  }

  document.addEventListener('click', function (e) {
    var openBtn = e.target.closest('[data-cart-open]');
    if (openBtn && drawer) { e.preventDefault(); refreshCart().catch(function () {}); openCart(); return; }
    if (e.target.closest('[data-cart-close]')) { closeCart(); return; }
    var change = e.target.closest('[data-line-change]');
    if (change) {
      change.disabled = true;
      fetch(NM.routes.cartChange, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ id: change.getAttribute('data-line-change'), quantity: Math.max(0, Number(change.getAttribute('data-qty'))) })
      }).then(function (r) { return r.json(); }).then(renderCart).catch(function () { window.location.href = NM.routes.cart; });
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('is-open')) closeCart();
  });

  /* ---------- Bandeau cookies (API de confidentialité Shopify) ---------- */
  var banner = $('#CookieBanner');
  function withPrivacyApi(cb) {
    if (window.Shopify && window.Shopify.customerPrivacy) { cb(window.Shopify.customerPrivacy); return; }
    if (window.Shopify && window.Shopify.loadFeatures) {
      window.Shopify.loadFeatures([{ name: 'consent-tracking-api', version: '0.1' }], function (err) {
        if (!err && window.Shopify.customerPrivacy) cb(window.Shopify.customerPrivacy);
      });
    }
  }
  if (banner) {
    var stored = safeGet('nm-cookie-choice');
    if (!stored) {
      withPrivacyApi(function (api) {
        if (api.shouldShowBanner && !api.shouldShowBanner()) return;
        banner.classList.add('is-visible');
      });
      // Sans API (aperçu local par exemple), on affiche quand même le bandeau.
      setTimeout(function () { if (!safeGet('nm-cookie-choice') && !(window.Shopify && window.Shopify.customerPrivacy)) banner.classList.add('is-visible'); }, 1500);
    }
    $$('[data-cookie]', banner).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var accepted = btn.getAttribute('data-cookie') === 'accept';
        safeSet('nm-cookie-choice', accepted ? 'accept' : 'decline');
        withPrivacyApi(function (api) {
          var consent = { analytics: accepted, marketing: accepted, preferences: accepted, sale_of_data: accepted };
          if (api.setTrackingConsent) api.setTrackingConsent(consent, function () {});
        });
        banner.classList.remove('is-visible');
      });
    });
  }
  $$('[data-cookie-open]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); if (banner) banner.classList.add('is-visible'); });
  });
})();
