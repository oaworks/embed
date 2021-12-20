// start with a simple set of helper functions
var _OA, _oab,
  indexOf = [].indexOf;

_OA = {
  gebi: function(id) {
    return document.getElementById(id.replace('#', ''));
  },
  gebc: function(cls) {
    return document.getElementsByClassName(cls.replace('.', ''));
  },
  gebn: function(n) {
    var r;
    r = document.getElementsByTagName(n.replace('<', '').replace('>', '')); // e.g. by the element name, like "div"
    if (r != null) {
      return r;
    } else {
      return document.getElementsByName(n); // otherwise by the "name" attribute matching n
    }
  }
};

_OA.each = function(elems, key, val) {
  var elem, i, len, results;
  if (typeof elems === 'string') {
    if (elems.startsWith('#')) {
      elems = [_OA.gebi(elems)];
    } else if (elems.startsWith('.')) {
      elems = _OA.gebc(elems);
    } else {
      elems = _OA.gebn(elems);
    }
  } else if (typeof elems === 'object') {
    if (!Array.isArray(elems)) {
      elems = [elems];
    }
  }
  if (elems != null) {
    results = [];
    for (i = 0, len = elems.length; i < len; i++) {
      elem = elems[i];
      if (elem != null) {
        if (typeof key === 'function') {
          results.push(key(elem));
        } else {
          results.push(_OA.set(elem, key, val));
        }
      } else {
        results.push(void 0);
      }
    }
    return results;
  }
};

_OA.listen = function(action, els, fn) {
  return _OA.each(els, function(el) {
    var wfn;
    if (action === 'enter') {
      action = 'keyup';
      wfn = function(e) {
        if (e.keyCode === 13) {
          return fn(e);
        }
      };
    } else {
      wfn = fn;
    }
    if (!_OA.has(el, 'listen_' + action)) {
      _OA.class(el, 'listen_' + action);
      return el.addEventListener(action, function(e) {
        return wfn(e);
      });
    }
  });
};

_OA.show = function(els, html, append) {
  return _OA.each(els, function(el) {
    var was;
    if (typeof html === 'string') {
      el.innerHTML = (append ? el.innerHTML : '') + html;
    }
    was = _OA.get(el, '_l_display');
    if (typeof was !== 'string' || was === 'none') { // TODO should be inline in which cases...
      was = (el.tagName === 'DIV' ? 'block' : 'inline');
    }
    return el.style.display = was;
  });
};

_OA.hide = function(els) {
  return _OA.each(els, function(el) {
    if (el.style.display !== 'none') {
      _OA.set(el, '_l_display', el.style.display);
    }
    return el.style.display = 'none';
  });
};

_OA.get = function(els, attr) {
  var res;
  res = void 0;
  _OA.each(els, function(el) {
    if (attr == null) {
      try {
        res = el.value;
      } catch (error1) {}
      if (typeof res === 'string' && !res.length) {
        res = void 0;
      }
    }
    try {
      return res != null ? res : res = el.getAttribute(attr);
    } catch (error1) {}
  });
  return res;
};

_OA.set = function(els, attr, val) {
  return _OA.each(els, function(el) {
    // TODO handle dot notation keys e.g if attr is style.display
    if ((val == null) || attr === 'value' || attr === 'val') {
      try {
        return el.value = val == null ? attr : val;
      } catch (error1) {}
    } else {
      try {
        return el.setAttribute(attr, val);
      } catch (error1) {}
    }
  });
};

_OA.checked = function(els) {
  var res;
  res = true;
  _OA.each(els, function(el) {
    return res = el.checked;
  });
  return res;
};

_OA.html = function(els, html, append, show) {
  var ref, rs;
  rs = [];
  _OA.each(els, function(el) {
    if (typeof html === 'string') {
      el.innerHTML = (append ? el.innerHTML : '') + html;
    }
    rs.push(el.innerHTML);
    if (show) {
      return _OA.show(el);
    }
  });
  if (rs.length === 1) {
    return (ref = rs[0]) != null ? ref : '';
  } else if (rs.length) {
    return rs;
  } else {
    return '';
  }
};

_OA.append = function(els, html) {
  return _OA.html(els, html, true);
};

_OA.remove = function(els) {
  return _OA.each(els, function(el) {
    return el.parentNode.removeChild(el);
  });
};

_OA.class = function(el, cls) {
  var c, classes, i, len, ref, rs;
  rs = [];
  classes = el.getAttribute('class');
  if (classes == null) {
    classes = '';
  }
  if (typeof cls === 'string') {
    if (!classes.includes(cls)) {
      if (classes.length) {
        classes += ' ';
      }
      classes += cls;
    } else {
      classes = classes.replace(cls, '').trim().replace(/  /g, ' ');
    }
    el.setAttribute('class', classes);
  }
  ref = classes.split(' ');
  for (i = 0, len = ref.length; i < len; i++) {
    c = ref[i];
    if (indexOf.call(rs, c) < 0) {
      rs.push(c);
    }
  }
  return rs;
};

_OA.has = function(el, cls) {
  var classes;
  classes = _OA.class(el);
  if (cls.startsWith('.')) {
    cls = cls.replace('.');
  }
  if (indexOf.call(classes, cls) >= 0) {
    return true;
  } else {
    if (el.getAttribute(cls)) {
      return true;
    } else {
      return false;
    }
  }
};

_OA.css = function(els, key, val) {
  return _OA.each(els, function(el) {
    var i, k, len, p, ps, ref, ref1, s, ss, style;
    s = (ref = _OA.get(el, 'style')) != null ? ref : '';
    style = {};
    ref1 = s.split(';');
    for (i = 0, len = ref1.length; i < len; i++) {
      p = ref1[i];
      ps = p.split(':');
      if (ps.length === 2) {
        style[ps[0].trim()] = ps[1].trim();
      }
    }
    if (val != null) {
      style[key] = val;
    }
    ss = '';
    for (k in style) {
      if (ss !== '') {
        ss += ';';
      }
      ss += k + ':' + style[k];
    }
    return _OA.set(el, 'style', ss);
  });
};

_OA.jx = function(url, data, success, error) {
  var xhr;
  if (typeof data === 'object' && typeof data.append !== 'function') {
    // a FormData object will have an append function, a normal json object will not. FormData should be POSTable by xhr as-is
    data = JSON.stringify(data);
  }
  xhr = new XMLHttpRequest();
  xhr.open((data != null ? 'POST' : 'GET'), url);
  xhr.send(data);
  xhr.onload = function() {
    var err;
    if (xhr.status !== 200) {
      try {
        error(xhr);
      } catch (error1) {}
    } else {
      try {
        success(JSON.parse(xhr.response), xhr);
      } catch (error1) {
        err = error1;
        console.log(err);
        try {
          success(xhr);
        } catch (error1) {
          try {
            error(xhr);
          } catch (error1) {}
        }
      }
    }
    if (typeof _OA.loaded === 'function') {
      return _OA.loaded(xhr);
    }
  };
  return xhr.onerror = function(err) {
    try {
      return error(err);
    } catch (error1) {}
  };
};

// ==============================================================================
_oab = function(opts) {
  var ap, c, configs, cs, csk, csv, eq, i, j, len, len1, o;
  try {
    if (opts == null) {
      opts = {};
    }
    for (o in opts) {
      this[o] = opts[o];
    }
    if (this.uid == null) {
      this.uid = 'anonymous';
    }
    if (this.api == null) {
      this.api = window.location.host.includes('dev.') ? 'https://beta.oa.works' : 'https://api.oa.works';
    }
    if (this.plugin == null) {
      this.plugin = 'instantill'; // has to be defined at startup, as either instantill or shareyourpaper
    }
    if (this.element == null) {
      this.element = '#' + this.plugin;
    }
    if (this.pushstate == null) {
      this.pushstate = true; // if true, the embed will try to add page state changes to the browser state manager
    }
    if (this.local == null) {
      this.local = false; // local storage of config turned off by default for now
    }
    if (this.config == null) {
      this.config = {};
    }
    if (this.data == null) {
      this.data = {};
    }
    if (this.f == null) {
      this.f = {};
    }
    if (this.template == null) {
      this.template = _oab[this.plugin + '_template'];
    }
    if (this.css == null) {
      this.css = _oab.css;
    }
    this._loading = false; // tracks when loads are occurring
    this.submit_after_metadata = false; // used by instantill to track if metadata has been provided by user
    this.needmore = false; // used by instantill to track that more metadata is required (e.g. if title is too short)
    this.file = false; // used by syp to store the file for sending to backend
    if (this.demo == null) {
      this.demo = window.location.href.includes('/demo') && (window.location.href.includes('openaccessbutton.') || window.location.href.includes('shareyourpaper.') || window.location.href.includes('instantill.'));
    }
    if (this.loaded != null) {
      _OA.loaded = this.loaded; // if this is set to a function, it will be passed to _leviathan loaded, which gets run after every ajax call completes. It is also called directly after every configure
    }
    if (window.location.search.includes('local=')) {
      this.local = window.location.search.includes('local=true') ? true : false;
    }
    if (window.location.search.includes('clear=') || this.local === false) {
      try {
        localStorage.removeItem('_oab_config_' + this.plugin);
      } catch (error1) {}
    }
    if (window.location.search.includes('config=')) {
      try {
        this.config = JSON.parse(window.location.search.split('config=')[1].split('&')[0].split('#')[0]);
      } catch (error1) {}
    }
    if (window.location.search.includes('config.')) {
      configs = window.location.search.split('config.');
      configs.shift();
      for (i = 0, len = configs.length; i < len; i++) {
        c = configs[i];
        cs = c.split('=');
        if (cs.length === 2) {
          csk = cs[0].trim();
          csv = cs[1].split('&')[0].split('#')[0].trim();
          this.configure(csk, csv, false);
        }
      }
    }
    setTimeout(() => {
      return this.configure();
    }, 1);
    if (!this.config.autorun_off) {
      ap = typeof this.config.autorunparams === 'string' && this.config.autorunparams.length ? this.config.autorunparams.split(',') : typeof this.config.autorunparams === 'object' ? this.config.autorunparams : ['doi', 'title', 'url', 'atitle', 'rft_id', 'journal', 'issn', 'year', 'author'];
      if (typeof ap === 'string') {
        ap = ap.replace(/"/g, '').replace(/'/g, '').split(',');
      }
      for (j = 0, len1 = ap.length; j < len1; j++) {
        o = ap[j];
        o = o.split('=')[0].trim();
        if (o.includes('=')) {
          eq = o.split('=')[1].trim();
        }
        if (window.location.search.replace('?', '&').includes('&' + o + '=')) {
          this.data[eq != null ? eq : o] = decodeURIComponent(window.location.search.replace('?', '&').split('&' + o + '=')[1].split('&')[0].replace(/\+/g, ' '));
        }
      }
      if (!this.data.doi && window.location.href.split('?')[0].includes('/10.') && window.location.href.split('?')[0].split('/10.')[1].indexOf('/') > 1 && window.location.href.split('?')[0].split('/10.')[1].trim().split('/').length > 1) {
        this.data.doi = '10.' + window.location.href.split('?')[0].split('/10.')[1].replace(/\/$/, '');
      }
    }
    if (window.location.search.includes('email=')) {
      this.data.email = window.location.search.split('email=')[1].split('&')[0].split('#')[0];
      _OA.remove('#_oab_collect_email');
    }
    if (window.location.search.includes('confirmed=')) {
      this.data.confirmed = window.location.search.split('confirmed=')[1].split('&')[0].split('#')[0];
    }
    if (window.location.search.includes('refresh=true')) {
      this.data.refresh = true;
    }
    if (this.data.doi || (this.plugin === 'instantill' && (this.data.title || this.data.url))) {
      this.find();
    }
    window.addEventListener("popstate", (pe) => {
      return this.state(pe);
    });
    return this;
  } catch (error1) {
    return this.ping('instantill_or_shareyourpaper_try_initialise_catch');
  }
};

_oab.prototype.cml = function() {
  var ref, ref1, ref2;
  return (ref = (ref1 = (ref2 = this.config.problem) != null ? ref2 : this.config.owner) != null ? ref1 : this.config.email) != null ? ref : '';
};

_oab.prototype.contact = function() {
  return 'Please try ' + (this.cml() ? '<a id="_oab_contact_library" href="mailto:' + this.cml() + '">contacting us</a>' : 'contacting us') + ' directly';
};

_oab.prototype.loading = function(load) {
  _OA.hide('#_oab_error');
  if (load !== true && (this._loading || load === false)) {
    try {
      clearInterval(this._loading);
    } catch (error1) {}
    this._loading = false;
    return _OA.each('._oab_loading', (el) => {
      if (_OA.has(el, '_oab_continue')) {
        return el.innerHTML = 'Continue';
      } else if (_OA.has(el, '_oab_submit')) {
        return el.innerHTML = 'Complete request';
      } else if (_OA.has(el, '_oab_deposit')) {
        return el.innerHTML = 'Deposit';
      } else if (_OA.has(el, '_oab_find')) {
        return el.innerHTML = 'Next';
      } else if (_OA.has(el, '_oab_confirm')) {
        return el.innerHTML = '<b>My upload was an accepted manuscript</b>';
      } else {
        return el.innerHTML = 'Find ' + (this.config.say_paper ? 'paper' : 'article'); // this would only happen on instantill, as "Next" above is the default for syp
      }
    });
  } else {
    _OA.html('._oab_find', 'Searching .');
    _OA.html('._oab_submit', 'Submitting .');
    _OA.html('._oab_deposit', 'Depositing .');
    _OA.html('._oab_confirm', 'Depositing .');
    return this._loading = setInterval((function() {
      var button, dots, i, len, ref, results;
      ref = _OA.gebc('._oab_loading');
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        button = ref[i];
        dots = button.innerHTML.split('.');
        if (dots.length >= 4) {
          results.push(button.innerHTML = dots[0]);
        } else {
          results.push(button.innerHTML = button.innerHTML + ' .');
        }
      }
      return results;
    }), 700);
  }
};

_oab.prototype.state = function(pop) {
  var extra, extras, i, k, len, ref, u;
  if (this.pushstate) {
    try {
      u = window.location.pathname;
      if (pop == null) {
        if (window.location.href.includes('shareyourpaper.org')) {
          if (window.location.href.includes('/10.') || window.location.href.replace(/\//g, '').endsWith('.org')) {
            u = window.location.href.split('10.')[0] + ((ref = this.data.doi) != null ? ref : '') + window.location.search + window.location.hash;
          } else {
            u += window.location.search.split('?doi=')[0].split('&doi=')[0];
            u += !u.includes('?') ? '?' : '&';
            u += 'doi=' + this.data.doi;
            if (window.location.search.split('?doi=')[1].includes('&')) {
              extras = window.location.search.split('?doi=')[1].split('&');
              extras.shift();
              for (i = 0, len = extras.length; i < len; i++) {
                extra = extras[i];
                u += '&' + extra;
              }
            }
            u += window.location.hash;
          }
        } else if (!window.location.href.includes('/setup') && !window.location.href.includes('/demo')) {
          if ((this.data.doi != null) || (this.data.title != null) || (this.data.url != null)) {
            k = this.data.doi ? 'doi' : this.data.title ? 'title' : 'url';
            u += window.location.search.split('?' + k + '=')[0].split('&' + k + '=')[0];
            u += !u.includes('?') ? '?' : '&';
            u += k + '=' + this.data[k] + window.location.hash;
          }
        }
      }
      window.history.pushState("", (pop != null ? "search" : "find"), u);
      if (pop != null) {
        // what to do with the pop event? for now just triggers a restart if user tries to go back
        return this.restart();
      }
    } catch (error1) {}
  }
};

_oab.prototype.restart = function(e, val, err) {
  var gf;
  try {
    if (e.target.parentElement.id !== '_oab_permissionemail') {
      e.preventDefault();
    }
  } catch (error1) {}
  this.data = {};
  this.f = {};
  this.needmore = false;
  this.loading(false);
  this.file = false;
  if (gf = _OA.gebi("_oab_file")) {
    gf.value = '';
  }
  _OA.hide('._oab_panel');
  _OA.show('#_oab_inputs');
  this.configure();
  this.state();
  if (err) {
    _OA.show('#_oab_error', err);
  }
  if (val) {
    _OA.set('#_oab_input', val);
    return this.find();
  } else {
    return _OA.set('#_oab_input', '');
  }
};

_oab.prototype.ping = function(what) {
  var url;
  try {
    if (!what.includes(this.plugin)) {
      if (!what.startsWith('_')) {
        what = '_' + what;
      }
      what = this.plugin + what;
    }
    url = this.api + '/ping.png?action=' + what + '&from=' + this.uid + '&url=' + encodeURIComponent(window.location.href);
    if (this.config.pilot) {
      url += '&pilot=' + this.config.pilot;
    }
    if (this.config.live) {
      url += '&live=' + this.config.live;
    }
    return _OA.jx(url);
  } catch (error1) {}
};

_oab.prototype.panel = function(panel, section) {
  var he;
  if (he = _OA.gebi('_oab_' + (panel.startsWith('_oab_') ? panel.replace('_oab_', '') : panel))) {
    _OA.hide('._oab_panel');
    _OA.show(he);
    if (section) {
      return this.section(section);
    }
  }
};

_oab.prototype.section = function(section) {
  var fe;
  // useful for demo/test, just shows a specific section within a panel
  fe = _OA.gebi('_oab_' + (section.startsWith('_oab_') ? section.replace('_oab_', '') : section));
  if (fe == null) {
    fe = _OA.gebc('_oab_' + (section.startsWith('_oab_') ? section.replace('_oab_', '') : section));
  }
  if (fe) {
    _OA.hide('._oab_section');
    return _OA.show(fe);
  }
};

_oab.prototype.submit = function(e) { // only used by instantill
  var data, i, k, len, nfield, ou, ref, ref1, ref10, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9;
  try {
    try {
      e.preventDefault();
    } catch (error1) {}
    if (!this.openurl() && !this.data.email && _OA.gebi('#_oab_email')) {
      return this.validate();
    } else if (JSON.stringify(this.f) === '{}' || (!((ref = this.f.metadata) != null ? ref.title : void 0) || !((ref1 = this.f.metadata) != null ? ref1.journal : void 0) || !((ref2 = this.f.metadata) != null ? ref2.year : void 0))) {
      if (this.submit_after_metadata) {
        return this.done(false);
      } else {
        this.submit_after_metadata = true;
        return this.metadata();
      }
    } else {
      this.loading();
      data = {
        match: this.f.input,
        email: this.data.email,
        from: this.uid,
        plugin: this.plugin,
        embedded: window.location.href
      };
      data.config = this.config;
      data.metadata = (ref3 = this.f.metadata) != null ? ref3 : {};
      ref4 = ['title', 'journal', 'year', 'doi'];
      for (i = 0, len = ref4.length; i < len; i++) {
        k = ref4[i];
        if (!data.metadata[k] && this.data[k]) {
          data.metadata[k] = this.data[k];
        }
        if (data.metadata.doi && data.metadata.doi.startsWith('http')) {
          data.metadata.url = data.metadata.doi;
          delete data.metadata.doi;
        }
      }
      nfield = this.config.notes ? this.config.notes : 'notes';
      if (this.data.usermetadata) {
        data[nfield] = 'The user provided some metadata. ';
      }
      if (this.config.pilot) {
        data.pilot = this.config.pilot;
      }
      if (this.config.live) {
        data.live = this.config.live;
      }
      if (((ref5 = this.f) != null ? (ref6 = ref5.ill) != null ? ref6.subscription : void 0 : void 0) || ((ref7 = this.f) != null ? ref7.url : void 0)) {
        if (typeof data[nfield] !== 'string') {
          data[nfield] = '';
        } else {
          data[nfield] += ' ';
        }
        if ((ref8 = this.f.ill) != null ? ref8.subscription : void 0) {
          data[nfield] += 'Subscription check done, found ' + ((ref9 = this.f.ill.subscription.url) != null ? ref9 : (this.f.ill.subscription.journal ? 'journal' : 'nothing')) + '. ';
        }
        if (this.f.metadata != null) {
          data[nfield] += 'OA availability check done, found ' + ((ref10 = this.f.url) != null ? ref10 : 'nothing') + '. ';
        }
      }
      ou = this.openurl();
      if (ou && !data.email) {
        data.forwarded = true;
      }
      if (this.demo === true) {
        console.log('Not POSTing ILL and not forwarding to ' + ou + ' for demo purposes');
        return console.log(data);
      } else {
        return _OA.jx(this.api + '/ill', data, (res) => {
          return this.done(res);
        }, () => {
          return this.done(false);
        });
      }
    }
  } catch (error1) {
    return this.ping('instantill_try_submit_catch');
  }
};

_oab.prototype.validate = function() {
  var email, ref;
  if (this.config.terms && !_OA.checked('#_oab_read_terms')) { // instantill terms
    return _OA.show('#_oab_error', '<p>Please agree to the terms first.</p>');
  } else {
    email = ((ref = _OA.get('#_oab_email')) != null ? ref : '').trim();
    if (!email.length) {
      _OA.show('#_oab_error', '<p>Please provide your university email address.</p>');
      _OA.css('#_oab_email', 'border-color', '#f04717');
      return _OA.gebi('#_oab_email').focus();
    } else {
      this.loading();
      return _OA.jx(this.api + '/validate?uid=' + this.uid + '&email=' + email, this.config, (res) => {
        this.loading(false);
        if (res === true) {
          this.data.email = _OA.get('#_oab_email').trim();
          if (this.plugin === 'instantill') {
            return this.submit();
          } else {
            return this.deposit();
          }
        } else if (res === 'baddomain') {
          return _OA.show('#_oab_error', '<p>Please try again with your university email address.</p>');
        } else {
          return _OA.show('#_oab_error', '<p>Sorry, your email does not look right. ' + (res !== false ? 'Did you mean ' + res + '? ' : '') + 'Please check and try again.</p>');
        }
      }, () => {
        this.data.email = _OA.get('#_oab_email').trim();
        if (this.plugin === 'instantill') {
          return this.submit();
        } else {
          return this.deposit();
        }
      });
    }
  }
};

_oab.prototype.metadata = function(submitafter) { // only used by instantill
  var i, len, m, ref, ref1, ref2, ref3;
  ref = ['title', 'year', 'journal', 'doi'];
  for (i = 0, len = ref.length; i < len; i++) {
    m = ref[i];
    if ((((ref1 = this.f) != null ? (ref2 = ref1.metadata) != null ? ref2[m] : void 0 : void 0) != null) || (this.data[m] != null)) {
      _OA.set('#_oab_' + m, ((ref3 = this.f.metadata) != null ? ref3 : this.data)[m]);
    }
  }
  _OA.hide('._oab_panel');
  return _OA.show('#_oab_metadata');
};

_oab.prototype.openurl = function() { // only used by instantill
  var author, config, d, defaults, i, k, len, notes, ref, ref1, ref2, ref3, ref4, ref5, ref6, url, v;
  if (!this.config.ill_form) {
    return '';
  } else {
    config = JSON.parse(JSON.stringify(this.config));
    defaults = {
      sid: 'sid',
      title: 'atitle', // this is what iupui needs (title is also acceptable, but would clash with using title for journal title, which we set below, as iupui do that
      doi: 'rft_id', // don't know yet what this should be
      author: 'aulast', // author should actually be au, but aulast works even if contains the whole author, using aufirst just concatenates
      journal: 'title', // this is what iupui needs
      page: 'pages', // iupui uses the spage and epage for start and end pages, but pages is allowed in openurl, check if this will work for iupui
      published: 'date', // this is what iupui needs, but in format 1991-07-01 - date format may be a problem
      year: 'rft.year' // this is what IUPUI uses
    };
    for (d in defaults) {
      if (!config[d]) {
        config[d] = defaults[d];
      }
    }
    url = config.ill_form;
    url += !url.includes('?') ? '?' : '&';
    if (config.ill_added_params) {
      url += config.ill_added_params.replace('?', '') + '&';
    }
    url += config.sid + '=InstantILL&';
    for (k in (ref = this.f.metadata) != null ? ref : {}) {
      v = false;
      if (k === 'author') {
        if (typeof this.f.metadata.author === 'string') {
          v = this.f.metadata.author;
        } else if (Array.isArray(this.f.metadata.author)) {
          v = '';
          ref1 = this.f.metadata.author;
          for (i = 0, len = ref1.length; i < len; i++) {
            author = ref1[i];
            try {
              if (v.length) {
                v += ', ';
              }
              v += typeof author === 'string' ? author : typeof author === 'object' && author.family ? author.family + (author.given ? ', ' + author.given : '') : JSON.stringify(author);
            } catch (error1) {}
          }
        }
      } else if (k === 'doi' || k === 'pmid' || k === 'pmc' || k === 'pmcid' || k === 'url' || k === 'journal' || k === 'title' || k === 'year' || k === 'issn' || k === 'volume' || k === 'issue' || k === 'page' || k === 'crossref_type' || k === 'type' || k === 'publisher' || k === 'published' || k === 'notes') {
        v = this.f.metadata[k];
      }
      if (v) {
        url += ((ref2 = config[k]) != null ? ref2 : k) + '=' + encodeURIComponent(v) + '&';
      }
    }
    notes = this.data.usermetadata ? 'The user provided some metadata. ' : '';
    if ((ref3 = this.f.ill) != null ? ref3.subscription : void 0) {
      notes += 'Subscription check done, found ' + ((ref4 = this.f.ill.subscription.url) != null ? ref4 : (this.f.ill.subscription.journal ? 'journal' : 'nothing')) + '. ';
    }
    if (this.f.metadata != null) {
      notes += 'OA availability check done, found ' + ((ref5 = this.f.url) != null ? ref5 : 'nothing') + '. ';
    }
    if (notes) {
      url += '&' + ((ref6 = this.config.notes) != null ? ref6 : 'notes') + '=' + notes;
    }
    return url.replace('/&&/g', '&');
  }
};

_oab.prototype.done = function(res, msg) {
  var ou;
  this.loading(false);
  if (ou = this.openurl()) {
    window.location = ou;
  } else {
    _OA.hide('._oab_panel');
    _OA.hide('._oab_done');
    if (typeof res === 'string' && _OA.gebi('_oab_' + res)) {
      _OA.show('#_oab_' + res); // various done states for shareyourpaper
      if (res === 'confirm') {
        _OA.hide('#_oab_done_restart');
      } else {
        _OA.show('#_oab_done_restart');
      }
    } else if (res) {
      _OA.html('#_oab_done_header', '<h3>Thanks! Your request has been received</h3><p>Your confirmation code is: ' + res + ', this will not be emailed to you. The ' + (this.config.say_paper ? 'paper' : 'article') + ' will be sent to ' + this.data.email + ' as soon as possible.</p>'); // only instantill falls through to here
    } else {
      _OA.html('#_oab_done_header', '<h3>Sorry, we were not able to create an Interlibrary Loan request for you.</h3><p>' + this.contact() + '</p>');
      _OA.html('#_oab_done_restart', 'Try another');
      this.ping(msg != null ? msg : 'instantill_couldnt_submit_ill');
      setTimeout((() => {
        return this.restart();
      }), 6000);
    }
    _OA.show('#_oab_done');
  }
  if (typeof this.after === 'function') {
    return this.after();
  }
};

_oab.prototype.deposit = function(e) { // only used by shareyourpaper
  var d, data, fl, info, md, ref, ref1, ref2;
  try {
    try {
      e.preventDefault();
    } catch (error1) {}
    if (!this.data.email && _OA.gebi('#_oab_email')) {
      return this.validate();
    } else if (this.demo === true && (this.data.doi != null) && this.data.doi.startsWith('10.1234/oab-syp-')) {
      if (this.data.doi !== '10.1234/oab-syp-confirm') { // demo successful deposit
        info = '<p>You\'ll soon find your paper freely available in ' + ((ref = this.config.repo_name) != null ? ref : 'ScholarWorks') + ', Google Scholar, Web of Science, and other popular tools.';
        info += '<h3>Your paper is now freely available at this link:</h3>';
        _OA.html('#_oab_zenodo_embargo', info);
        _OA.set('#_oab_zenodo_url', 'https://zenodo.org/record/3703317');
        this.done('zenodo'); // demo something wrong, please confirm
      } else {
        this.done('confirm');
      }
      if (typeof this.loaded === 'function') {
        return this.loaded();
      }
    } else {
      fl = _OA.gebi('#_oab_file');
      if ((fl != null) && (fl.files != null) && fl.files.length) {
        this.file = new FormData();
        this.file.append('file', fl.files[0]);
      } else if (this.file !== true) { // can be set to true when dark deposit is being followed - no file required. Or a demo may set it to true
        _OA.show('#_oab_error', '<p>Whoops, you need to give us a file! Check it\'s uploaded.</p>');
        _OA.css('#_oab_file', 'border-color', '#f04717');
        return;
      }
      this.loading();
      // this could be just an email for a dark deposit, or a file for actual deposit
      // if the file is acceptable and can go in zenodo then we don't bother getting the email address
      data = {
        from: this.uid,
        plugin: this.plugin,
        embedded: window.location.href,
        metadata: (ref1 = this.f) != null ? ref1.metadata : void 0
      };
      if (this.demo === true) {
        data.demo = true;
      }
      data.config = this.config;
      if (this.data.email) {
        data.email = this.data.email;
      }
      if (this.data.confirmed) {
        data.confirmed = this.data.confirmed;
      }
      if (typeof ((ref2 = this.f) != null ? ref2.url : void 0) === 'string') {
        data.redeposit = this.f.url;
      }
      if (this.config.pilot) {
        data.pilot = this.config.pilot;
      }
      if (this.config.live) {
        data.live = this.config.live;
      }
      if (typeof this.file !== 'boolean') {
        for (d in data) {
          if (d === 'metadata') {
            for (md in data[d]) {
              if (typeof data[d][md] === 'string' || typeof data[d][md] === 'number') {
                this.file.append(md, data[d][md]);
              }
            }
          } else if (typeof data[d] === 'object') {
            this.file.append(d, JSON.stringify(data[d]));
          } else {
            this.file.append(d, data[d]);
          }
        }
        data = this.file;
      }
      return _OA.jx(this.api.replace('api.', '').replace('://', '://bg.') + '/deposit', data, (res) => {
        var ref10, ref11, ref12, ref13, ref3, ref4, ref5, ref6, ref7, ref8, ref9;
        this.loading(false);
        if (typeof this.file !== 'boolean') {
          if (((ref3 = res.zenodo) != null ? ref3.already : void 0) || (this.data.confirmed && !((ref4 = res.zenodo) != null ? ref4.url : void 0))) {
            return this.done('check');
          } else if (res.error) {
            // if we should be able to deposit but can't, we stick to the positive response and the file will be manually checked
            return this.done('partial');
          } else if ((ref5 = res.zenodo) != null ? ref5.url : void 0) {
            // deposit was possible, show the user a congrats page with a link to the item in zenodo
            _OA.set('#_oab_zenodo_url', res.zenodo.url);
            if (res.embargo) {
              info = '<p>You\'ve done your part for now. Unfortunately, ' + ((ref6 = (ref7 = (ref8 = this.f) != null ? (ref9 = ref8.metadata) != null ? ref9.journal_short : void 0 : void 0) != null ? ref7 : (ref10 = this.f) != null ? (ref11 = ref10.metadata) != null ? ref11.journal : void 0 : void 0) != null ? ref6 : 'the journal') + ' won\'t let us make it public until ';
              info += (new Date(parseInt(res.embargo))).toDateString();
              info += '. After release, you\'ll find your paper on ' + ((ref12 = this.config.repo_name) != null ? ref12 : 'ScholarWorks') + ', Google Scholar, Web of Science.</p>';
              info += '<h3>Your paper will be freely available at this link:</h3>';
            } else {
              info = '<p>You\'ll soon find your paper freely available in ' + ((ref13 = this.config.repo_name) != null ? ref13 : 'ScholarWorks') + ', Google Scholar, Web of Science, and other popular tools.';
              info += '<h3>Your paper is now freely available at this link:</h3>';
            }
            _OA.html('#_oab_zenodo_embargo', info);
            return this.done('zenodo');
          } else {
            // if the file given is not a version that is allowed, show a page saying something looks wrong
            // also the backend should create a dark deposit in this case, but delay it by six hours, and cancel if received in the meantime
            return this.done('confirm');
          }
        } else if (res.type === 'redeposit') {
          return this.done('redeposit');
        } else {
          return this.done('success');
        }
      }, () => {
        this.loading(false);
        _OA.show('#_oab_error', '<p>Sorry, we were not able to deposit this paper for you. ' + this.contact() + '</p><p><a href="#" class="_oab_restart" id="_oab_sorry_try_again"><b>Try again</b></a></p>');
        return this.ping('shareyourpaper_couldnt_submit_deposit');
      });
    }
  } catch (error1) {
    return this.ping('shareyourpaper_try_deposit_catch');
  }
};

_oab.prototype.permissions = function(data) { // only used by shareyourpaper
  var nj, p, paper, ph, pm, ref, ref1, ref10, ref11, ref12, ref13, ref14, ref15, ref16, ref17, ref18, ref19, ref2, ref20, ref21, ref22, ref23, ref24, ref25, ref26, ref27, ref28, ref29, ref3, ref30, ref31, ref32, ref33, ref34, ref35, ref36, ref37, ref38, ref39, ref4, ref40, ref41, ref42, ref43, ref44, ref45, ref46, ref47, ref48, ref49, ref5, ref50, ref51, ref52, ref53, ref54, ref55, ref56, ref6, ref7, ref8, ref9, refs, rm, tcs;
  try {
    if (data != null) {
      this.f = data;
    }
    if (!_OA.gebi(this.element)) {
      return setTimeout((() => {
        return this.permissions();
      }), 100);
    } else {
      this.loading(false);
      if (((ref = this.f) != null ? ref.doi_not_in_crossref : void 0) && ((ref1 = this.f) != null ? ref1.doi_not_in_oadoi : void 0)) {
        this.f = {};
        _OA.show('#_oab_error', '<p>Double check your DOI, that doesn\'t look right to us.</p>');
        return _OA.gebi('_oab_input').focus();
      } else if (((((ref2 = this.f) != null ? (ref3 = ref2.metadata) != null ? ref3.crossref_type : void 0 : void 0) != null) && ((ref4 = this.f.metadata.crossref_type) !== 'journal-article' && ref4 !== 'proceedings-article')) || ((((ref5 = this.f) != null ? (ref6 = ref5.metadata) != null ? ref6.type : void 0 : void 0) != null) && ((ref7 = this.f.metadata.type) !== 'journal-article' && ref7 !== 'proceedings-article'))) {
        _OA.gebi('_oab_input').focus();
        nj = '<p>Sorry, right now this only works with academic journal articles.';
        if (this.cml()) {
          nj += ' To get help with depositing, <a href="';
          nj += this.config.old_way ? (this.config.old_way.includes('@') ? 'mailto:' : '') + this.config.old_way : 'mailto:' + this.cml();
          nj += "?subject=Help%20depositing%20&body=Hi%2C%0D%0A%0D%0AI'd%20like%20to%20deposit%3A%0D%0A%0D%0A%3C%3CPlease%20insert%20a%20full%20citation%3E%3E%0D%0A%0D%0ACan%20you%20please%20assist%20me%3F%0D%0A%0D%0AYours%20sincerely%2C" + '">click here</a>';
        }
        return this.restart(void 0, void 0, nj + '.</p>');
      } else if (((ref8 = this.f) != null ? (ref9 = ref8.metadata) != null ? ref9.title : void 0 : void 0) == null) {
        _OA.show('#_oab_error', '<h3>Unknown paper</h3><p>Sorry, we cannot find this paper or sufficient metadata. ' + this.contact() + '</p>');
        return this.ping('shareyourpaper_unknown_article');
      } else {
        _OA.hide('._oab_panel');
        _OA.hide('._oab_section');
        _OA.show('#_oab_permissions');
        this.loading(false);
        tcs = 'terms <a id="_oab_terms" href="https://openaccessbutton.org/terms" target="_blank">[1]</a>';
        if (this.config.terms) {
          tcs += ' <a id="_oab_config_terms" href="' + this.config.terms + '" target="_blank">[2]</a>';
        }
        ph = 'your.name@institution.edu';
        if ((this.config.email_domains != null) && this.config.email_domains.length) {
          if (typeof this.config.email_domains === 'string') {
            this.config.email_domains = this.config.email_domains.split(',');
          }
          ph = this.config.email_domains[0];
          if (ph.includes('@')) {
            ph = ph.split('@')[1];
          }
          if (ph.includes('//')) {
            ph = ph.split('//')[1];
          }
          ph = ph.toLowerCase().replace('www.', '');
        }
        if ((ph == null) || ph.length < 3) {
          ph = 'your.name@institution.edu';
        }
        if (!ph.includes('@')) {
          ph = 'your.name@' + ph;
        }
        if (this.data.email) {
          _OA.hide('._oab_get_email');
        } else {
          _OA.show('._oab_get_email');
          _OA.set('#_oab_email', 'placeholder', ph);
          _OA.html('._oab_terms', tcs);
        }
        refs = '';
        for (p in (ref10 = (ref11 = this.f) != null ? (ref12 = ref11.permissions) != null ? (ref13 = ref12.best_permission) != null ? (ref14 = ref13.provenance) != null ? ref14.archiving_policy : void 0 : void 0 : void 0 : void 0) != null ? ref10 : []) {
          refs += ' <a id="_oab_policy_text" target="_blank" href="' + this.f.permissions.best_permission.provenance.archiving_policy[p] + '">[' + (parseInt(p) + 1) + ']</a>';
        }
        _OA.html('._oab_refs', refs);
        paper = ((ref15 = this.f) != null ? (ref16 = ref15.metadata) != null ? ref16.doi : void 0 : void 0) ? '<a id="_oab_your_paper" target="_blank" href="https://doi.org/' + this.f.metadata.doi + '"><u>your paper</u></a>' : 'your paper';
        _OA.html('._oab_your_paper', (((ref17 = this.f) != null ? (ref18 = ref17.permissions) != null ? (ref19 = ref18.best_permission) != null ? ref19.version : void 0 : void 0 : void 0) === 'publishedVersion' ? 'the publisher pdf of ' : '') + paper);
        _OA.html('._oab_journal', (ref20 = (ref21 = this.f) != null ? (ref22 = ref21.metadata) != null ? ref22.journal_short : void 0 : void 0) != null ? ref20 : 'the journal');
        if (this.f.url) {
          // it is already OA, depending on settings can deposit another copy
          _OA.set('._oab_oa_url', 'href', this.f.url);
          if (this.config.oa_deposit_off) {
            _OA.hide('._oab_get_email');
            return _OA.show('._oab_oa');
          } else {
            this.file = true; // no file required for oa deposit...
            return _OA.show('._oab_oa_deposit');
          }
        } else if ((ref23 = this.f) != null ? (ref24 = ref23.permissions) != null ? (ref25 = ref24.best_permission) != null ? ref25.can_archive : void 0 : void 0 : void 0) {
          if (((ref26 = this.f) != null ? (ref27 = ref26.permissions) != null ? (ref28 = ref27.best_permission) != null ? ref28.version : void 0 : void 0 : void 0) === 'publishedVersion') {
            // can be shared, depending on permissions info
            _OA.hide('#_oab_not_pdf');
          }
          if (typeof ((ref29 = this.f) != null ? (ref30 = ref29.permissions) != null ? (ref31 = ref30.best_permission) != null ? ref31.licence : void 0 : void 0 : void 0) === 'string' && this.f.permissions.best_permission.licence.startsWith('other-')) {
            _OA.html('._oab_licence', 'under the publisher\'s terms' + refs);
          } else {
            _OA.html('._oab_licence', (ref32 = (ref33 = this.f) != null ? (ref34 = ref33.permissions) != null ? (ref35 = ref34.best_permission) != null ? ref35.licence : void 0 : void 0 : void 0) != null ? ref32 : 'CC-BY');
          }
          return _OA.show('._oab_archivable');
        } else if (this.config.dark_deposit_off) {
          // permission must be requested first
          rm = 'mailto:' + ((ref36 = (ref37 = (ref38 = this.f.permissions) != null ? (ref39 = ref38.best_permission) != null ? ref39.permissions_contact : void 0 : void 0) != null ? ref37 : this.config.deposit_help) != null ? ref36 : this.cml()) + '?';
          if ((ref40 = this.f.permissions) != null ? (ref41 = ref40.best_permission) != null ? ref41.permissions_contact : void 0 : void 0) {
            rm += 'cc=' + ((ref42 = this.config.deposit_help) != null ? ref42 : this.cml()) + '&';
          }
          rm += 'subject=Request%20to%20self%20archive%20' + ((ref43 = (ref44 = this.f.metadata) != null ? ref44.doi : void 0) != null ? ref43 : '') + '&body=';
          rm += encodeURIComponent('To whom it may concern,\n\n');
          rm += encodeURIComponent('I am writing to request permission to deposit the full text of my paper "' + ((ref45 = (ref46 = (ref47 = this.f.metadata) != null ? ref47.title : void 0) != null ? ref46 : (ref48 = this.f.metadata) != null ? ref48.doi : void 0) != null ? ref45 : 'Untitled paper') + '" ');
          if ((ref49 = this.f.metadata) != null ? ref49.journal : void 0) {
            rm += encodeURIComponent('published in "' + this.f.metadata.journal + '"');
          }
          rm += encodeURIComponent('\n\nI would like to archive the final pdf. If that is not possible, I would like to archive the accepted manuscript. Ideally, I would like to do so immediately but will respect a reasonable embargo if requested.\n\n');
          if (this.config.repo_name) {
            rm += encodeURIComponent('I plan to deposit it into "' + this.config.repo_name + '", a not-for-profit, digital, publicly accessible repository for scholarly work created for researchers ' + (this.config.institution_name ? 'at ' + this.config.institution_name : '') + '. It helps make research available to a wider audience, get citations for the original article, and assure its long-term preservation. The deposit will include a complete citation of the published version, and a link to it.\n\n');
          }
          rm += encodeURIComponent('Thank you for your attention and I look forward to hearing from you.');
          _OA.set('#_oab_reviewemail', 'href', rm);
          // or to confirm permission has been received
          pm = 'mailto:' + ((ref50 = this.config.deposit_help) != null ? ref50 : this.cml()) + '?subject=Permission%20Given%20to%20Deposit%20' + ((ref51 = (ref52 = this.f.metadata) != null ? ref52.doi : void 0) != null ? ref51 : '') + '&body=';
          pm += encodeURIComponent('To whom it may concern,\n\nAttached is written confirmation of permission I\'ve been given to deposit, and the permitted version of my paper: ');
          pm += encodeURIComponent('"' + ((ref53 = (ref54 = (ref55 = this.f.metadata) != null ? ref55.title : void 0) != null ? ref54 : (ref56 = this.f.metadata) != null ? ref56.doi : void 0) != null ? ref53 : 'Untitled paper') + '" \n\nCan you please deposit it into the repository on my behalf? \n\nSincerely, ');
          _OA.set('#_oab_permissionemail', 'href', pm);
          _OA.hide('._oab_get_email');
          return _OA.show('._oab_permission_required');
        } else {
          // can't be directly shared but can be passed to library for dark deposit
          this.file = true;
          _OA.hide('#_oab_file');
          return _OA.show('._oab_dark_deposit');
        }
      }
    }
  } catch (error1) {
    return this.ping('shareyourpaper_try_permissions_catch');
  }
};

_oab.prototype.findings = function(data) { // only used by instantill
  var citation, ct, err, hasoa, hassub, ou, ref, ref1, ref10, ref11, ref12, ref13, ref14, ref15, ref16, ref17, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9;
  try {
    if (data != null) {
      this.f = data;
    }
    if (!_OA.gebi(this.element)) {
      return setTimeout((() => {
        return this.findings();
      }), 100);
    } else {
      this.loading(false);
      if (ct = (ref = (ref1 = this.f.metadata) != null ? ref1.crossref_type : void 0) != null ? ref : (ref2 = this.f.metadata) != null ? ref2.type : void 0) {
        if (ct !== 'journal-article' && ct !== 'proceedings-article' && ct !== 'posted-content') {
          if (ct === 'book-section' || ct === 'book-part' || ct === 'book-chapter') {
            err = '<p>Please make your request through our ' + (this.config.book ? '<a id="_oab_book_form" href="' + this.config.book + '">book form</a>' : 'book form');
          } else {
            err = '<p>We can only process academic journal articles, please use another form.';
          }
          this.restart(void 0, void 0, err + '</p>');
          return;
        }
      }
      _OA.hide('._oab_panel');
      _OA.hide('._oab_section');
      if (this.config.resolver) {
        // new setting to act as a link resolver, try to pass through immediately if sub url, OA url, or lib openurl are available
        // TODO confirm if this should send an ILL to the backend first, as a record, or maybe just a pinger
        // also check if could forward the user to the new page before the send to backend succeeds / errors
        data = {
          match: this.f.input,
          from: this.uid,
          plugin: this.plugin,
          embedded: window.location.href
        };
        data.config = this.config;
        data.metadata = (ref3 = this.f.metadata) != null ? ref3 : {};
        if (this.config.pilot) {
          data.pilot = this.config.pilot;
        }
        if (this.config.live) {
          data.live = this.config.live;
        }
        if ((ref4 = this.f.ill) != null ? (ref5 = ref4.subscription) != null ? ref5.url : void 0 : void 0) {
          data.resolved = 'subscription';
        } else if (this.f.url) {
          data.resolved = 'open';
        } else if (ou = this.openurl()) {
          data.resolved = 'library';
        }
        if (data.resolved != null) {
          data.url = (ref6 = (ref7 = (ref8 = this.f.ill) != null ? (ref9 = ref8.subscription) != null ? ref9.url : void 0 : void 0) != null ? ref7 : this.f.url) != null ? ref6 : ou;
          _OA.jx(this.api + '/ill', data, (() => {
            var ref10, ref11, ref12, ref13;
            return window.location = (ref10 = (ref11 = (ref12 = this.f.ill) != null ? (ref13 = ref12.subscription) != null ? ref13.url : void 0 : void 0) != null ? ref11 : this.f.url) != null ? ref10 : ou;
          }), (() => {
            var ref10, ref11, ref12, ref13;
            return window.location = (ref10 = (ref11 = (ref12 = this.f.ill) != null ? (ref13 = ref12.subscription) != null ? ref13.url : void 0 : void 0) != null ? ref11 : this.f.url) != null ? ref10 : ou;
          }));
        }
      }
      _OA.show('#_oab_findings');
      if ((ref10 = this.f.ill) != null ? ref10.error : void 0) {
        _OA.show('#_oab_error', '<p>Please note, we encountered errors querying the following subscription services: ' + this.f.ill.error.join(', ') + '</p>');
      }
      if ((((ref11 = this.f.metadata) != null ? ref11.title : void 0) != null) && ((this.f.metadata.journal != null) || this.data.usermetadata)) {
        citation = '<h2>' + this.f.metadata.title + '</h2>';
        if (this.f.metadata.year || this.f.metadata.journal || this.f.metadata.volume || this.f.metadata.issue) {
          citation += '<p><i>';
          if (this.f.metadata.year) {
            citation += ((ref12 = this.f.metadata.year) != null ? ref12 : '') + (this.f.metadata.journal || this.f.metadata.volume || this.f.metadata.issue ? ', ' : '');
          }
          if (this.f.metadata.journal) {
            citation += this.f.metadata.journal;
          } else {
            if (this.f.metadata.volume) {
              citation += 'vol. ' + this.f.metadata.volume;
            }
            if (this.f.metadata.issue) {
              citation += (this.f.metadata.volume ? ', ' : '') + 'issue ' + this.f.metadata.issue;
            }
          }
          citation += '</i></p>';
        }
        _OA.html('#_oab_citation', citation);
        hassub = false;
        hasoa = false;
        if (((ref13 = this.f.ill) != null ? (ref14 = ref13.subscription) != null ? ref14.journal : void 0 : void 0) || ((ref15 = this.f.ill) != null ? (ref16 = ref15.subscription) != null ? ref16.url : void 0 : void 0)) {
          hassub = true;
          if (this.f.ill.subscription.url != null) {
            // if sub url show the url link, else show the "should be able to access on pub site
            _OA.set('#_oab_sub_url', 'href', this.f.ill.subscription.url);
          }
          _OA.show('#_oab_sub_available');
        } else if (this.f.url) {
          hasoa = true;
          _OA.set('#_oab_url', 'href', this.f.url);
          _OA.show('#_oab_oa_available');
        }
        if ((this.f.ill != null) && !((this.config.ill_if_sub_off && hassub) || (this.config.ill_if_oa_off && hasoa))) {
          _OA.html('#_oab_cost_time', '<p>It ' + (this.config.cost ? 'costs ' + this.config.cost : 'is free to you,') + ' and we\'ll usually email the link within ' + ((ref17 = this.config.time) != null ? ref17 : '24 hours') + '.<br></p>');
          if (!this.data.email) {
            if (this.openurl()) {
              _OA.hide('#_oab_collect_email');
            } else {
              if (this.config.terms) {
                _OA.show('#_oab_terms_note');
                _OA.set('#_oab_terms_link', 'href', this.config.terms);
              } else {
                _OA.hide('#_oab_terms_note');
              }
            }
          }
          return _OA.show('#_oab_ask_library');
        }
      } else if (this.data.usermetadata) {
        _OA.html('#_oab_citation', '<h3>Unknown ' + (this.config.say_paper ? 'paper' : 'article') + '</h3><p>Sorry, we can\'t find this ' + (this.config.say_paper ? 'paper' : 'article') + ' or sufficient metadata. ' + this.contact() + '</p>');
        this.ping('shareyourpaper_unknown_article');
        return setTimeout((() => {
          return this.restart();
        }), 6000);
      } else {
        return this.metadata();
      }
    }
  } catch (error1) {
    return this.ping('instantill_try_findings_catch');
  }
};

_oab.prototype.find = function(e) {
  var base, base1, base2, base3, base4, base5, base6, data, i, k, len, ref, ref1, ref2, ref3, ref4, ref5, ref6, v, val;
  try {
    try {
      e.preventDefault();
    } catch (error1) {}
    if (JSON.stringify(this.f) !== '{}' || this.needmore) {
      ref = ['title', 'journal', 'year', 'doi'];
      for (i = 0, len = ref.length; i < len; i++) {
        k = ref[i];
        if (v = _OA.get('#_oab_' + k)) {
          if (this.data[k] !== v) {
            this.data[k] = v;
            this.data.usermetadata = true;
          }
        }
      }
      if (this.data.year && this.data.year.length !== 4) {
        delete this.data.year;
        _OA.show('#_oab_error', '<p>Please provide the full year e.g 2019</p>');
        return;
      }
      if (!this.data.title || !this.data.journal || !this.data.year) {
        _OA.show('#_oab_error', '<p>Please complete all required fields</p>');
        return;
      }
      if (this.submit_after_metadata) {
        this.submit();
        return;
      }
    }
    if (this.data.atitle) {
      if ((base = this.data).title == null) {
        base.title = this.data.atitle;
      }
    }
    if (this.data.rft_id) {
      if ((base1 = this.data).doi == null) {
        base1.doi = this.data.rft_id;
      }
    }
    if (this.data.doi && this.data.doi.includes('10.') && this.data.doi.startsWith('http')) {
      this.data.url = this.data.doi;
      delete this.data.doi;
    }
    if (val = _OA.get('#_oab_input')) {
      val = val.trim().replace(/\.$/, '');
      if (val.length) {
        if (!val.includes(' ')) {
          if (val.includes('doi.org/')) {
            this.data.url = val;
            this.data.doi = '10.' + val.split('/10.')[1].split(' ')[0];
          } else if (val.includes('10.')) {
            this.data.doi = val;
          } else if (val.startsWith('http') || val.includes('www.')) {
            this.data.url = val;
          } else if (val.toLowerCase().replace('pmc', '').replace('pmid', '').replace(':', '').replace(/[0-9]/g, '').length === 0) {
            this.data.id = val;
          } else {
            this.data.title = val; // unlikely, just a one-word title, but just in case
          }
        } else {
          this.data.title = val; // could also be a citation but backend will try to parse that out
        }
      }
    } else if (this.data.doi || this.data.title || this.data.url || this.data.id) {
      _OA.set('#_oab_input', (ref1 = (ref2 = (ref3 = this.data.doi) != null ? ref3 : this.data.title) != null ? ref2 : this.data.url) != null ? ref1 : this.data.id);
    }
    if (this.plugin === 'instantill' && !this.data.doi && !this.needmore && !((ref4 = this.f) != null ? (ref5 = ref4.metadata) != null ? ref5.journal : void 0 : void 0) && (!this.data.title || (this.data.title.length < 30 && this.data.title.split(' ').length < 3))) {
      this.needmore = true;
      return this.metadata(); // need more metadata for short titles
    } else if (!this.data.doi && (this.plugin === 'shareyourpaper' || (!this.data.url && !this.data.pmid && !this.data.pmcid && !this.data.title && !this.data.id))) {
      if (this.plugin === 'shareyourpaper') {
        delete this.data.title;
        delete this.data.url;
        delete this.data.id;
        return _OA.show('#_oab_error', '<p>Please provide a DOI. If you\'re not sure what a DOI is, go <a id="_oab_doi_howto" href="https://library.uic.edu/help/article/1966/what-is-a-doi-and-how-do-i-use-them-in-citations" target="_blank">here</a>.</p>');
      } else {
        return _OA.show('#_oab_error', '<p><span>&#10060;</span> Sorry please provide the full DOI, title, citation, PMID or PMC ID.</p>');
      }
    } else if (this.data.doi && this.plugin === 'shareyourpaper' && (this.data.doi.startsWith('10') || !this.data.doi.includes('/') || !this.data.doi.includes('.') || this.data.doi.length < 8)) {
      delete this.data.doi;
      _OA.set('#_oab_input', '');
      _OA.gebi('_oab_input').focus();
      return _OA.show('#_oab_error', '<p>Please provide a DOI. If you\'re not sure what a DOI is, go <a id="_oab_doi_howto" href="https://library.uic.edu/help/article/1966/what-is-a-doi-and-how-do-i-use-them-in-citations" target="_blank">here</a>.</p>');
    } else {
      this.state();
      this.loading();
      this.data.config = this.config;
      if ((base2 = this.data).from == null) {
        base2.from = this.uid;
      }
      if ((base3 = this.data).plugin == null) {
        base3.plugin = this.plugin;
      }
      if ((base4 = this.data).embedded == null) {
        base4.embedded = window.location.href;
      }
      if (this.config.pilot) {
        if ((base5 = this.data).pilot == null) {
          base5.pilot = this.config.pilot;
        }
      }
      if (this.config.live) {
        if ((base6 = this.data).live == null) {
          base6.live = this.config.live;
        }
      }
      if (this.demo === true && (this.data.title === 'Engineering a Powerfully Simple Interlibrary Loan Experience with InstantILL' || this.data.doi === '10.1234/567890' || ((this.data.doi != null) && this.data.doi.startsWith('10.1234/oab-syp')))) {
        data = {
          metadata: {
            title: 'Engineering a Powerfully Simple Interlibrary Loan Experience with InstantILL',
            year: '2019',
            crossref_type: 'journal-article',
            doi: (ref6 = this.data.doi) != null ? ref6 : '10.1234/oab-syp-aam'
          }
        };
        data.metadata.journal = 'Proceedings of the 16th IFLA ILDS conference: Beyond the paywall - Resource sharing in a disruptive ecosystem';
        data.metadata.author = [
          {
            given: 'Mike',
            family: 'Paxton'
          },
          {
            given: 'Gary',
            family: 'Maixner III'
          },
          {
            given: 'Joseph',
            family: 'McArthur'
          },
          {
            given: 'Tina',
            family: 'Baich'
          }
        ];
        data.ill = {
          subscription: {
            findings: {},
            uid: this.uid,
            lookups: [],
            error: [],
            url: 'https://scholarworks.iupui.edu/bitstream/handle/1805/20422/07-PAXTON.pdf?sequence=1&isAllowed=y'
          }
        };
        data.permissions = {
          best_permission: {
            can_archive: this.data.doi === '10.1234/oab-syp-aam' ? true : false,
            version: this.data.doi === '10.1234/oab-syp-aam' ? "postprint" : void 0
          },
          file: {
            archivable: true,
            archivable_reason: "Demo acceptance",
            version: "postprint",
            licence: "cc-by",
            same_paper: true,
            name: "example.pdf",
            format: "pdf",
            checksum: "example-checksum"
          }
        };
        if (this.plugin === 'instantill') {
          return this.findings(data);
        } else {
          return this.permissions(data);
        }
      } else {
        return _OA.jx(this.api + '/find', this.data, (data) => {
          if (this.plugin === 'instantill') {
            return this.findings(data);
          } else {
            return this.permissions(data);
          }
        }, () => {
          return _OA.show('#_oab_error', '<p>Oh dear, the service is down! We\'re aware, and working to fix the problem. ' + this.contact() + '</p>');
        });
      }
    }
  } catch (error1) {
    return this.ping(this.plugin + '_try_find_catch');
  }
};

_oab.css = '<style> ._oab_form { display: inline-block; width: 100%; height: 34px; padding: 6px 12px; font-size: 1em; line-height: 1.428571429; color: #555555; vertical-align: middle; background-color: #ffffff; background-image: none; border: 1px solid #cccccc; border-radius: 4px; -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075); box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075); -webkit-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s; transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s; } ._oab_button { display: table-cell; height:34px; padding: 6px 3px; margin-bottom: 0; font-size: 1em; font-weight: normal; line-height: 1.428571429; text-decoration: none; text-align: center; white-space: nowrap; vertical-align: middle; cursor: pointer; background-image: none; border: 1px solid transparent; border-radius: 4px; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; -o-user-select: none; user-select: none; color: #ffffff; background-color: #428bca; border-color: #357ebd; } </style>';

_oab.instantill_template = '<div class="_oab_panel" id="_oab_inputs"> <p id="_oab_intro"> If you need <span class="_oab_paper">an article</span> you can request it from any library in the world through Interlibrary loan. <br>Start by entering a full <span class="_oab_paper">article</span> title, citation, or DOI:<br> </p> <p><input class="_oab_form" type="text" id="_oab_input" placeholder="e.g. World Scientists Warning of a Climate Emergency" aria-label="Enter a search term" style="box-shadow:none;"></input></p> <p><a class="_oab_find btn-iu _oab_button _oab_loading" id="_oab_find" href="#" aria-label="Search" style="min-width:140px;">Find <span class="_oab_paper">article</span></a></p> <div id="_oab_book_or_other"></div> <div id="_oab_advanced_account_info"></div> </div> <div class="_oab_panel" id="_oab_findings" style="display:none;"> <div id="_oab_citation"><h2>A title</h2><p><b>And citation string, OR demo title OR Unknown <span class="_oab_paper">article</span> and refer to library</b></p></div> <p id="_oab_wrong_paper"><a class="_oab_wrong" href="#"><b>This is not the <span class="_oab_paper">article</span> I searched</b></a></p> <div class="_oab_section" id="_oab_sub_available"> <h3>We have an online copy instantly available</h3> <p>You should be able to access it on the publisher\'s website.</p> <p><a target="_blank" id="_oab_sub_url" href="#"><b>Open <span class="_oab_paper">article</span> in a new tab</b></a></p> </div> <div class="_oab_section" id="_oab_oa_available"> <h3><br>There is a free, instantly accessible copy online</h3> <p>It may not be the final published version and may lack graphs or figures making it unsuitable for citations.</p> <p><a id="_oab_url" target="_blank" href="#"><b>Open <span class="_oab_paper">article</span> in a new tab</b></a></p> </div> <div class="_oab_section" id="_oab_ask_library"> <h3><br>Ask the library to send you a digital copy via Interlibrary Loan</h3> <div id="_oab_cost_time"><p>It is free to you, and we\'ll usually email the link within 24 hours.<br></p></div> <div id="_oab_collect_email"> <p id="_oab_terms_note"><input type="checkbox" id="_oab_read_terms"> I have read the <a id="_oab_terms_link" target="_blank" href="#">terms and conditions</a></p> <p><input placeholder="Your university email address" id="_oab_email" type="text" class="_oab_form"></p> </div> <p><a class="_oab_submit btn-iu _oab_button _oab_loading" href="#" id="_oab_submit" style="min-width:140px;">Complete request</a></p> <p><a href="#" class="_oab_restart" id="_oab_try_another"><b>Try another</b></a></p> </div> </div> <div class="_oab_panel" id="_oab_metadata" style="display:none;"> <h2>Sorry we didn\'t find that!</h2> <p id="_oab_doi_not_in_crossref" style="display:none;">The DOI <span id="_oab_bad_doi">you entered</span> does not appear in Crossref</p> <p>Please provide or amend the <span class="_oab_paper">article</span> details.</p> <p><span class="_oab_paper">Article</span> title (required)<br><input class="_oab_form" id="_oab_title" type="text" placeholder="e.g The State of OA: A large-scale analysis of Open Access"></p> <p>Journal title (required)<br><input class="_oab_form" id="_oab_journal" type="text" placeholder="e.g. Nature"></p> <p>Year of publication (required)<br><input class="_oab_form" id="_oab_year" type="text" placeholder="e.g 1992"></p> <p><span class="_oab_paper">Article</span> DOI or URL<br><input class="_oab_form" id="_oab_doi" type="text" placeholder="e.g 10.1126/scitranslmed.3008973"></p> <p><a href="#" class="_oab_find btn-iu _oab_button _oab_loading _oab_continue" id="_oab_continue" style="min-width:140px;">Continue</a></p> <p> <a href="#" class="_oab_restart" id="_oab_try_again"><b>Try another</b></a> <span id="_oab_advanced_ill_form" style="display:none;"></span> </p> </div> <div class="_oab_panel" id="_oab_done" style="display:none;"> <div id="_oab_done_header"> <h2>Thanks! Your request has been received.</h2> <p>And confirmation code and tell we will email soon - OR sorry we could not create an ILL, and refer back to library if possible.</p> </div> <p><a href="#" class="_oab_restart btn-iu _oab_button" id="_oab_done_restart" id="_oab_restart" style="min-width:140px;">Do another</a></p> </div> <div id="_oab_error"></div> <div id="_oab_pilot"></div>';

_oab.shareyourpaper_template = '<div class="_oab_panel" id="_oab_inputs"> <h2>Make your research visible and see 30% more citations</h2> <p><span id="_oab_lib_info">We can help you make your paper Open Access, for free, wherever you publish. It\'s legal and takes just minutes.</span> Join millions of researchers sharing their papers freely with colleagues and the public.</p> <h3>Start by entering the DOI of your paper</h3> <p>We\'ll gather information about your paper and find the easiest way to share it.</p> <p><input class="_oab_form" type="text" id="_oab_input" placeholder="e.g. 10.1126/scitranslmed.abc2344" aria-label="Enter a search term" style="box-shadow:none;"></input></p> <p><a class="_oab_find btn-iu _oab_button _oab_loading" href="#" id="_oab_find" aria-label="Search" style="min-width:140px;">Next</a></p> <p><a id="_oab_nodoi" href="mailto:help@openaccessbutton.org?subject=Help%20depositing%20my%20paper&body=Hi%2C%0D%0A%0D%0AI\'d%20like%20to%20deposit%3A%0D%0A%0D%0A%3C%3CPlease%20insert%20a%20full%20citation%3E%3E%0D%0A%0D%0ACan%20you%20please%20assist%20me%3F%0D%0A%0D%0AYours%20sincerely%2C"><b>My paper doesn\'t have a DOI</b></a></p> </div> <div class="_oab_panel" id="_oab_permissions" style="display:none;"> <div class="_oab_section _oab_oa" id="_oab_oa"> <h2>Your paper is already freely available!</h2> <p>Great news, you\'re already getting the benefits of sharing your work! Your publisher or co-author have already shared it.</p> <p><a target="_blank" href="#" class="_oab_oa_url btn-iu _oab_button" style="min-width:140px;">See free version</a></p> <p><a href="#" class="_oab_restart" id="_oab_restart"><b>Do another</b></a></p> </div> <div class="_oab_section _oab_permission_required" id="_oab_permission_required"> <h2>You may share your paper if you ask the journal</h2> <p>Unlike most, <span class="_oab_journal">the journal</span> requires that you ask them before you share your paper freely. Asking only takes a moment as we find out who to contact and have drafted an email for you.</p> <p><a target="_blank" id="_oab_reviewemail" href="#" class="btn-iu _oab_button" style="min-width:140px;">Review Email</a></p> <p><a target="_blank" id="_oab_permissionemail" class="_oab_restart" href="#"><b>I\'ve got permission now!</b></a></p> </div> <div class="_oab_section _oab_oa_deposit" id="_oab_oa_deposit"> <h2>Your paper is already freely available!</h2> <p>Great news, you\'re already getting the benefits of sharing your work! Your publisher or co-author have already shared a <a class="_oab_oa_url" id="_oab_goto_oa_url" target="_blank" href="#">freely available copy</a>.</p> <h3 class="_oab_section _oab_get_email">Please enter your email to confirm deposit</h3> </div> <div class="_oab_section _oab_archivable" id="_oab_archivable"> <h2>You can freely share your paper!</h2> <p><span class="_oab_library">The library has</span> checked and <span class="_oab_journal">the journal</span> encourages you to freely share <span class="_oab_your_paper">your paper</span> so colleagues and the public can freely read and cite it. <span class="_oab_refs"></span></p> <div id="_oab_not_pdf"> <h3><span>&#10003;</span> Find the manuscript the journal accepted. It\'s not a PDF from the journal site</h3> <p>This is the only version you\'re able to share under copyright. The accepted manuscript is the word file or Latex export you sent the publisher after peer-review and before formatting (publisher proofs).</p> <h3><span>&#10003;</span> Check there aren\'t publisher logos or formatting</h3> <p>It\'s normal to share accepted manuscripts as the research is the same. It\'s fine to save your file as a pdf, make small edits to formatting, fix typos, remove comments, and arrange figures.</p> </div> <h3 class="_oab_section _oab_get_email"><span>&#10003;</span> Tell us your email</h3> </div> <!-- <div class="_oab_section _oab_bronze_archivable" id="_oab_bronze_archivable"> <h2>Keep your paper freely available!</h2> <p>For now, <span class="_oab_journal">the journal</span> is sharing <span class="_oab_your_paper">your paper</span> for free, but that might change. You can do the following to ensure colleagues and the public can always freely read and cite it <span class="_oab_refs"></span>.</p> <div id="_oab_not_pdf"> <h3><span>&#10003;</span> Find the manuscript the journal accepted. It\'s not a PDF from the journal site</h3> <p>This is the only version you\'re able to share under copyright. The accepted manuscript is the word file or Latex export you sent the publisher after peer-review and before formatting (publisher proofs).</p> <h3><span>&#10003;</span> Check there aren\'t publisher logos or formatting</h3> <p>It\'s normal to share accepted manuscripts as the research is the same. It\'s fine to save your file as a pdf, make small edits to formatting, fix typos, remove comments, and arrange figures.</p> </div> <h3 class="_oab_section _oab_get_email"><span>&#10003;</span> Tell us your email</h3> </div> --> <div class="_oab_section _oab_dark_deposit" id="_oab_dark_deposit"> <h2>You can share your paper!</h2> <p>We checked and unfortunately <span class="_oab_journal">the journal</span> won\'t let you share <span class="_oab_your_paper">your paper</span> freely with everyone. <span class="_oab_refs"></span><br><br> The good news is the library can still legally make your paper much easier to find and access. We\'ll put the publisher PDF in <span class="_oab_repo">ScholarWorks</span> and then share it on your behalf whenever it is requested.</p> <h3 class="_oab_section _oab_get_email">All we need is your email</h3> </div> <div class="_oab_section _oab_get_email" id="_oab_get_email"> <p><input class="_oab_form" type="text" id="_oab_email" placeholder="" aria-label="Enter your email" style="box-shadow:none;"></input></p> <p class="_oab_section _oab_oa_deposit">We\'ll use this to send you a link. By depositing, you\'re agreeing to our <span class="_oab_terms">terms</span>.</p> <p class="_oab_section _oab_archivable">We\'ll only use this if something goes wrong.<br> <p class="_oab_section _oab_dark_deposit">We\'ll only use this to send you a link to your paper when it is in <span class="_oab_repo">ScholarWorks</span>. By depositing, you\'re agreeing to the <span class="_oab_terms">terms</span>.</p> </div> <div class="_oab_section _oab_archivable" id="_oab_archivable_file"> <h3>We\'ll check it\'s legal, then promote, and preserve your work</h3> <p><input type="file" name="file" id="_oab_file" class="_oab_form"></p> <p>By depositing you\'re agreeing to the <span class="_oab_terms">terms</span> and to license your work <span class="_oab_licence">CC-BY</span>.</p> </div> <div class="_oab_section _oab_oa_deposit _oab_archivable _oab_dark_deposit" id="_oab_deposits"> <p><a href="#" class="_oab_deposit btn-iu _oab_button _oab_loading" style="min-width:140px;" id="_oab_deposit">Deposit</a></p> <p><a href="#" class="_oab_restart" id="_oab_deposits_restart"><b>Do another</b></a></p> </div> </div> <div class="_oab_panel" id="_oab_done" style="display:none;"> <div class="_oab_done" id="_oab_confirm"> <h2>We need an earlier version</h2> <p>It looks like what you uploaded is a publisher\'s PDF which your journal prohibits legally sharing.<br><br> You\'re nearly done. We need the accepted version, not the PDF from the journal site.</p> <p><a href="#" class="_oab_reload btn-iu _oab_button" id="_oab_upload_again" style="min-width:140px;">Try uploading again</a></p> <p><a href="#" class="_oab_confirm _oab_loading" id="_oab_upload_accept"><b>My upload was an accepted manuscript</b></a></p> </div> <div class="_oab_done" id="_oab_check"> <h2>We\'ll double check your paper</h2> <p>You\'ve done your part for now. Hopefully, we\'ll send you a link soon. First, we\'ll check to make sure it\'s legal to share.</p> </div> <div class="_oab_done" id="_oab_partial"> <h2>Congrats, you\'re done!</h2> <p>Check back soon to see your paper live, or we\'ll email you with issues.</p> </div> <div class="_oab_done" id="_oab_zenodo"> <h2>Congrats! Your paper will be available to everyone, forever!</h2> <div id="_oab_zenodo_embargo"></div> <p><input id="_oab_zenodo_url" class="_oab_form" type="text" style="box-shadow:none;" value=""></input></p> <p>You can now put the link on your website, CV, any profiles, and ResearchGate.</p> </div> <div class="_oab_done" id="_oab_redeposit"> <h2>Congrats, you\'re done!</h2> <p>Check back soon to see your paper live, or we\'ll email you with issues.</p> </div> <div class="_oab_done" id="_oab_success"> <h2>Hurray, you\'re done!</h2> <p>We\'ll email you a link to your paper in <span class="_oab_repo">ScholarWorks</span> soon. Next time, before you publish check to see if your journal allows you to have the most impact by making your research available to everyone, for free.</p> </div> <div class="_oab_done" id="_oab_review"> <h2>You\'ve done your part</h2> <p>All that\'s left to do is wait. Once the journal gives you permission to share, come back and we\'ll help you finish the job.</p> </div> <p><a href="#" class="_oab_restart btn-iu _oab_button" id="_oab_done_restart" style="min-width:140px;">Do another</a></p> </div> <div id="_oab_error"></div> <div id="_oab_pilot"></div>';

// can pass in a key/value pair, or key can be a config object, in which case val can optionally be a user ID string,
// or key can be a user ID string and val must be empty, or key and val can both be empty and config will attempt
// to be retrieved from setup, or localstorage and/or from the API if a user ID is available from setup
_oab.prototype.configure = function(key, val, build, preview) {
  var _whenready, cd, cw, d, k, lc, wc;
  if (typeof key === 'string' && (val == null) && key.startsWith('{')) {
    try {
      key = JSON.parse(key);
    } catch (error1) {}
  }
  if (typeof key === 'string' && (val == null) && ((this.uid == null) || this.uid === 'anonymous')) {
    this.uid = key;
    key = void 0;
  }
  if (((typeof key === 'string' && (val != null)) || ((key == null) && (val == null))) && JSON.stringify(this.config) === '{}') {
    try {
      if (this.local !== false) { // can be disabled if desired, by setting local to false at setup or in url param
        lc = JSON.parse(localStorage.getItem('_oab_config_' + this.plugin));
        if (typeof lc === 'object' && lc !== null) {
          console.log('Config retrieved from local storage');
          this.config = lc;
        }
      }
    } catch (error1) {}
    if (this.remote !== false && this.uid && this.uid !== 'anonymous' && JSON.stringify(this.config) === '{}') { // should a remote call always be made to check for superseded config if one is not provided at startup?
      _OA.jx(this.api + '/' + (this.plugin === 'instantill' ? 'ill' : 'deposit') + '/config?uid=' + this.uid, (res) => {
        console.log('Config retrieved from API');
        return this.configure(res);
      });
      if (this.local === false) { // stop here, once the retrieve from remote works, the rest will run
        return;
      }
    }
  }
  if (typeof key === 'object') {
    if (typeof val === 'string') {
      this.uid = val;
    }
    for (d in key) {
      if ((this.config[d] == null) || (this.config[d] !== key[d] && val === true)) { // val true allows overwrite present values
        if (build !== false) {
          build = true;
        }
        this.config[d] = key[d] === 'true' ? true : key[d] === 'false' ? false : key[d];
      }
    }
    if (val === true) {
      for (cd in this.config) {
        if (cd !== 'owner' && (key[cd] == null)) {
          delete this.config[cd];
        }
      }
    }
  } else if ((key != null) && (val != null)) {
    this.config[key] = val === 'true' ? true : val === 'false' ? false : val;
  }
  if (this.config.pilot === true) {
    // make a "writable" config without unecessary params, such as those setting false etc
    // keep separate from this.config so that additional calls to configure take account of false if they do exist though
    this.config.pilot = Date.now();
  }
  if (this.config.live === true) {
    this.config.live = Date.now();
  }
  for (cw in this.config) {
    if (this.config[cw] === '') {
      delete this.config[cw];
    }
  }
  for (k in wc = JSON.parse(JSON.stringify(this.config))) {
    if ((wc[k] == null) || wc[k] === false || ((typeof wc[k] === 'string' || Array.isArray(wc[k])) && wc[k].length === 0)) {
      delete wc[k];
    }
  }
  try {
    if (JSON.stringify(wc) !== '{}' && this.local !== false) {
      localStorage.setItem('_oab_config_' + this.plugin, JSON.stringify(wc));
    }
  } catch (error1) {}
  if (this.css !== false && this.config.css_off) {
    this.css = false;
    build = true;
  }
  if (this.bootstrap !== false && this.config.bootstrap_off) {
    this.bootstrap = false;
    build = true;
  }
  if (this.element == null) {
    this.element = '#' + this.plugin;
  }
  _whenready = () => {
    var aai, boro, dstr, el, gf, ncwc, nk, pilot, ref, ref1, ref2, ref3;
    if (_OA.gebi(this.element)) {
      if (build !== false) {
        console.log('Building embed');
        _OA.html(this.element, '');
        if (this.bootstrap == null) {
          // hack test for bootstrap calls or classes in page doc
          dstr = document.documentElement.innerHTML;
          this.bootstrap = dstr.includes('bootstrap/') || dstr.includes('/bootstrap') || dstr.includes('bootstrap.css') || dstr.includes('bootstrap.min.css') || dstr.includes('btn-');
          if (this.bootstrap === true) {
            console.log('Found bootstrap indicators in the doc');
          }
        }
        if (this.bootstrap === true) {
          if (!this.template.includes('btn-primary')) {
            this.template = this.template.replace(/_oab_button/g, '_oab_button btn btn-primary').replace(/_oab_form/g, '_oab_form form-control');
          }
        } else if (this.template.includes('btn-primary')) {
          this.template = this.template.replace(/ btn btn-primary/g, '').replace(/ form-control/g, '');
        }
        if (typeof this.css === 'string' && this.css !== 'false' && this.bootstrap !== true) { //this.bootstrap is false
          if (!this.css.startsWith('<style>')) {
            this.css = '<div id="_oab_css"><style>' + this.css + '</style></div>';
          }
          _OA.append(this.element, this.css);
        }
        _OA.append(this.element, this.template);
        if (this.data.doi || this.data.title || this.data.url || this.data.id) {
          _OA.set('#_oab_input', (ref = (ref1 = (ref2 = this.data.doi) != null ? ref2 : this.data.title) != null ? ref1 : this.data.url) != null ? ref : this.data.id);
        }
        _OA.each('._oab_paper', (el) => {
          var cs;
          cs = el.innerHTML;
          if (this.config.say_paper) {
            if (!cs.includes('aper')) {
              return el.innerHTML = (cs === 'an article' ? 'a paper' : cs === 'article' ? 'paper' : 'Paper');
            }
          } else if (cs.includes('aper')) {
            return el.innerHTML = (cs === 'a paper' ? 'an article' : cs === 'paper' ? 'article' : 'Article');
          }
        });
        if (this.config.pilot) {
          pilot = '<p><br>Notice a change? We\'re testing a simpler and faster way to ' + (this.plugin === 'instantill' ? 'get' : 'deposit') + ' your ' + (this.config.say_paper ? 'paper' : 'article') + (this.plugin === 'instantill' ? '' : 's') + '. You can ';
          pilot += '<a href="mailto:' + this.cml() + '">give feedback</a> or ';
          if (this.plugin === 'instantill') {
            pilot += '<a class="_oab_ping" message="instantill_use_the_old_form" target="_blank" href="' + (this.config.advanced_ill_form ? this.config.advanced_ill_form : this.config.ill_form ? this.config.ill_form : 'mailto:' + this.cml()) + '">use the old form</a>.</p>';
          } else {
            pilot += '<a class="_oab_ping" message="shareyourpaper_use_the_old_form" target="_blank" href="' + (this.config.old_way ? (this.config.old_way.includes('@') ? 'mailto:' : '') + this.config.old_way : 'mailto:' + this.cml()) + '">use the old way</a>.</p>';
          }
          _OA.html('#_oab_pilot', pilot);
        } else {
          _OA.html('#_oab_pilot', '');
        }
        // shareyourpaper exclusive configs
        if (this.plugin === 'shareyourpaper') {
          if ((this.cml() != null) && (el = _OA.gebi('_oab_nodoi'))) {
            el.setAttribute('href', el.getAttribute('href').replace('help@openaccessbutton.org', this.cml()));
          }
          if (this.config.not_library) {
            _OA.html('._oab_library', 'We have');
          } else {
            _OA.html('#_oab_lib_info', 'Share your paper with help from the library in ' + ((ref3 = this.config.repo_name) != null ? ref3 : 'ScholarWorks') + '. Legally, for free, in minutes. ');
          }
          if (this.config.repo_name) {
            _OA.html('._oab_repo', this.config.repo_name);
          }
        } else if (this.plugin === 'instantill') {
          if (this.config.book || this.config.other) {
            boro = '<p>Need ';
            if (this.config.book) {
              boro += 'a <a href="' + this.config.book + '">book chapter</a>';
            }
            if (this.config.other) {
              boro += (this.config.book ? ' or ' : ' ') + '<a href="' + this.config.other + '">something else</a>';
            }
            _OA.html('#_oab_book_or_other', boro + '?</p>');
          } else {
            _OA.html('#_oab_book_or_other', '');
          }
          if (this.config.intro_off) {
            _OA.hide('#_oab_intro');
          }
          if (this.config.advanced_ill_form || this.config.account || this.config.ill_info) {
            aai = '<p>Or ';
            if (this.config.advanced_ill_form) {
              _OA.show('#_oab_advanced_ill_form', ' or <a href="' + this.config.advanced_ill_form + '">use full request form</a>');
              aai += '<a href="' + this.config.advanced_ill_form + '">use full request form</a>';
              if (this.config.account && this.config.ill_info) {
                aai += ', ';
              } else if (this.config.account || this.config.ill_info) {
                aai += ' and ';
              }
            }
            if (this.config.account) {
              aai += '<a href="' + this.config.account + '">view account</a>';
              if (this.config.ill_info) {
                aai += ' and ';
              }
            }
            if (this.config.ill_info) {
              aai += '<a href="' + this.config.ill_info + '">learn about Interlibrary Loan</a>';
            }
            _OA.html('#_oab_advanced_account_info', aai + '</p>');
          } else {
            _OA.html('#_oab_advanced_account_info', '');
            _OA.hide('#_oab_advanced_ill_form');
          }
        }
        _OA.listen('enter', '#_oab_input', (e) => {
          return this.find(e);
        });
        _OA.listen('enter', '#_oab_email', (e) => {
          return this.validate(e);
        });
        _OA.listen('click', '._oab_find', (e) => {
          return this.find(e);
        });
        _OA.listen('click', '._oab_submit', (e) => {
          return this.submit(e);
        });
        _OA.listen('click', '._oab_restart', (e) => {
          return this.restart(e);
        });
        _OA.listen('click', '._oab_ping', (e) => {
          return this.ping(_OA.get(e.target, 'message'));
        });
        _OA.listen('click', '._oab_wrong', (e) => {
          e.preventDefault();
          this.ping('_wrong_article');
          return this.metadata();
        });
        _OA.listen('click', '._oab_reload', (e) => {
          var gf;
          e.preventDefault();
          if (gf = _OA.gebi("_oab_file")) {
            gf.value = '';
          }
          this.file = false;
          return this.permissions();
        });
        _OA.listen('click', '._oab_confirm', (e) => {
          e.preventDefault();
          this.data.confirmed = true;
          return this.deposit();
        });
        _OA.listen('click', '#_oab_reviewemail', (e) => {
          return this.done('review');
        });
        _OA.listen('click', '._oab_deposit', (e) => {
          return this.deposit(e);
        });
      }
      if (el = _OA.gebi('_oab_config')) {
        ncwc = JSON.parse(JSON.stringify(wc));
        nk = {
          ill_institution: 'institution', // translate instantill old config keys
          ill_redirect_base_url: 'ill_form',
          ill_redirect_params: 'ill_added_params',
          deposit_terms: 'terms',
          problem_email: 'problem',
          viewaccount: 'account',
          autorun: 'autorun_off',
          intropara: 'intro_off',
          norequests: 'requests_off',
          illinfo: 'ill_info',
          noillifoa: 'ill_if_oa_off',
          noillifsub: 'ill_if_sub_off',
          saypaper: 'say_paper',
          advancedform: 'advanced_ill_form',
          deposit_date: 'depositdate', // and shareyourpaper keys
          deposit_terms: 'terms',
          allow_oa_deposit: 'oa_deposit_off',
          ROR_ID: 'ror',
          not_a_library: 'not_library',
          adminemail: 'email',
          css: 'css_off',
          bootstrap: 'bootstrap_off'
        };
        for (k in nk) {
          if (ncwc[k] != null) {
            ncwc[nk[k]] = ncwc[k];
            delete ncwc[k];
          }
        }
        el.innerHTML = JSON.stringify(ncwc);
      }
      if (window.location.search.includes('panel=')) {
        this.panel(window.location.search.split('panel=')[1].split('&')[0].split('#')[0], (window.location.search.includes('section=') ? window.location.search.split('section=')[1].split('&')[0].split('#')[0] : void 0));
      }
      if (preview) {
        if (typeof preview !== 'string' || (typeof this.config.val === 'string' && this.config.val.length)) {
          preview = this.config.val;
        }
        this.data = {};
        this.f = {};
        this.loading(false);
        if (gf = _OA.gebi("_oab_file")) {
          gf.value = '';
        }
        this.file = false;
        _OA.hide('._oab_panel');
        _OA.show('#_oab_inputs');
        _OA.set('#_oab_input', preview);
        setTimeout((() => {
          return this.find();
        }), 1);
      }
      if (this.needmore) {
        this.metadata();
      }
      if (typeof this.loaded === 'function') {
        return this.loaded();
      }
    } else {
      console.log('waiting for ' + this.element);
      return setTimeout((() => {
        return _whenready();
      }), 100);
    }
  };
  _whenready();
  return wc;
};

this.shareyourpaper = function(opts) {
  if (opts == null) {
    opts = {};
  }
  opts.plugin = 'shareyourpaper';
  return new _oab(opts);
};

this.instantill = function(opts) {
  if (opts == null) {
    opts = {};
  }
  opts.plugin = 'instantill';
  return new _oab(opts);
};
