/* =========================================================
   FRANKENSTEIN TRIKES — KIT FINDER
   Year → Make → Model → matching kit.
   Mount: add `data-kit-finder` to any container.
   Persists last selection in localStorage.
   ========================================================= */

const KIT_DATA = {
  "Harley-Davidson": {
    years: [2025,2024,2023,2022,2021,2020,2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001,2000,1999],
    models: {
      "Softail":       { slug: "softail",           kit: "Softail",            platform: "Hot Rod Billet", priceFrom: "$9,995" },
      "Fat Boy":       { slug: "fatboy-heritage",   kit: "Fat Boy & Heritage", platform: "Hot Rod Billet", priceFrom: "$10,295" },
      "Heritage":      { slug: "fatboy-heritage",   kit: "Fat Boy & Heritage", platform: "Hot Rod Billet", priceFrom: "$10,295" },
      "Road King":     { slug: "flt-flh-roadking",  kit: "FLT FLH Roadking",   platform: "Hot Rod Billet", priceFrom: "$10,495" },
      "Street Glide":  { slug: "flt-flh-roadking",  kit: "FLT FLH Roadking",   platform: "Hot Rod Billet", priceFrom: "$10,495" },
      "Road Glide":    { slug: "flt-flh-roadking",  kit: "FLT FLH Roadking",   platform: "Hot Rod Billet", priceFrom: "$10,495" },
      "Electra Glide": { slug: "flt-flh-roadking",  kit: "FLT FLH Roadking",   platform: "Hot Rod Billet", priceFrom: "$10,495" },
      "Dyna":          { slug: "dyna",              kit: "Dyna",               platform: "Light Sport",    priceFrom: "$8,995" },
      "Sportster":     { slug: "sportster",         kit: "Sportster",          platform: "Light Sport",    priceFrom: "$7,995" },
      "V-Rod":         { slug: "v-rod",             kit: "V-Rod",              platform: "Hot Rod Billet", priceFrom: "$10,995" },
      "FXR":           { slug: "fxr",               kit: "FXR",                platform: "Light Sport",    priceFrom: "$8,995" },
      "Rocker":        { slug: "rocker-breakout",   kit: "Rocker & Breakout",  platform: "Hot Rod Billet", priceFrom: "$10,495" },
      "Breakout":      { slug: "rocker-breakout",   kit: "Rocker & Breakout",  platform: "Hot Rod Billet", priceFrom: "$10,495" },
      "Street 500/750":{ slug: "street",            kit: "Street",             platform: "Light Sport",    priceFrom: "$7,495" }
    }
  },
  "Yamaha": {
    years: [2024,2023,2022,2021,2020,2019,2018,2017,2016,2015,2014,2013,2012],
    models: {
      "Road Star": { slug: "yamaha", kit: "Yamaha", platform: "Hot Rod Billet", priceFrom: "$10,995" },
      "V-Star":    { slug: "yamaha", kit: "Yamaha", platform: "Light Sport",    priceFrom: "$8,995" }
    }
  },
  "Kawasaki": {
    years: [2024,2023,2022,2021,2020,2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004],
    models: {
      "Vulcan 1700": { slug: "kawasaki-1700", kit: "Kawasaki 1700", platform: "Hot Rod Billet", priceFrom: "$10,995" }
    }
  }
};

const STORAGE_KEY = 'frankenstein.bike';

function render(container) {
  container.innerHTML = `
    <div class="kit-finder__head">
      <div>
        <div class="eyebrow">Kit Finder</div>
        <div class="kit-finder__title">Find the kit<br>for your bike.</div>
      </div>
      <button type="button" class="btn btn--ghost" data-kf-reset hidden>Reset</button>
    </div>

    <div class="kit-finder__row">
      <div class="kit-finder__field">
        <label for="kf-make">01 · Make</label>
        <select id="kf-make" data-kf-make>
          <option value="">Select your make</option>
          ${Object.keys(KIT_DATA).map(m => `<option value="${m}">${m}</option>`).join('')}
        </select>
      </div>
      <div class="kit-finder__field">
        <label for="kf-year">02 · Year</label>
        <select id="kf-year" data-kf-year disabled>
          <option value="">— Pick a make first</option>
        </select>
      </div>
      <div class="kit-finder__field">
        <label for="kf-model">03 · Model</label>
        <select id="kf-model" data-kf-model disabled>
          <option value="">— Pick make + year</option>
        </select>
      </div>
      <div class="kit-finder__field" style="flex:0 1 auto">
        <label>&nbsp;</label>
        <a href="#" class="btn btn--primary" data-kf-go hidden>View Your Kit</a>
      </div>
    </div>

    <div class="kit-finder__result" data-kf-result hidden></div>
  `;

  const makeEl  = container.querySelector('[data-kf-make]');
  const yearEl  = container.querySelector('[data-kf-year]');
  const modelEl = container.querySelector('[data-kf-model]');
  const goEl    = container.querySelector('[data-kf-go]');
  const resetEl = container.querySelector('[data-kf-reset]');
  const resultEl= container.querySelector('[data-kf-result]');

  function populateYears(make) {
    yearEl.innerHTML = '<option value="">Select year</option>' +
      KIT_DATA[make].years.map(y => `<option value="${y}">${y}</option>`).join('');
    yearEl.disabled = false;
  }
  function populateModels(make) {
    modelEl.innerHTML = '<option value="">Select model</option>' +
      Object.keys(KIT_DATA[make].models).map(m => `<option value="${m}">${m}</option>`).join('');
  }

  function showResult() {
    const make = makeEl.value, year = yearEl.value, model = modelEl.value;
    if (!make || !year || !model) { resultEl.hidden = true; goEl.hidden = true; return; }
    const match = KIT_DATA[make].models[model];
    if (!match) { resultEl.hidden = true; goEl.hidden = true; return; }

    goEl.href = `kit-detail.html?id=${match.slug}`;
    goEl.hidden = false;

    resultEl.innerHTML = `
      <div class="ph" style="min-height:240px">
        <div class="ph-tag">// ${match.kit} trike · ${year} ${make} ${model}</div>
        <div class="ph-tag">Match</div>
      </div>
      <div>
        <div class="eyebrow">Match Found</div>
        <div class="display" style="font-size:clamp(1.75rem,3vw,2.75rem);line-height:0.9">${match.kit}<br>Trike Kit.</div>
        <p class="text-secondary" style="margin-top:16px">For your ${year} ${make} ${model}. ${match.platform} rear end. Installs in one day.</p>
        <dl class="kit-finder__specs" style="margin-top:16px;display:grid;grid-template-columns:auto 1fr;gap:8px 16px;font-size:13px">
          <dt class="mono" style="color:var(--text-mute)">Platform</dt><dd>${match.platform}</dd>
          <dt class="mono" style="color:var(--text-mute)">Install</dt><dd>One business day</dd>
          <dt class="mono" style="color:var(--text-mute)">Warranty</dt><dd>3 years, unlimited miles</dd>
          <dt class="mono" style="color:var(--text-mute)">From</dt><dd style="color:var(--accent);font-weight:600">${match.priceFrom}</dd>
        </dl>
        <div class="btn-row" style="margin-top:20px">
          <a href="kit-detail.html?id=${match.slug}" class="btn btn--primary">View Kit Page</a>
          <a href="dealers.html" class="btn btn--ghost">Find a Dealer</a>
        </div>
      </div>
    `;
    resultEl.hidden = false;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ make, year, model, slug: match.slug }));
    } catch(e) {}
  }

  makeEl.addEventListener('change', () => {
    const m = makeEl.value;
    yearEl.disabled = !m;
    modelEl.disabled = true;
    modelEl.innerHTML = '<option value="">— Pick year</option>';
    if (m) { populateYears(m); populateModels(m); }
    else { yearEl.innerHTML = '<option value="">— Pick a make first</option>'; }
    toggleReset();
    showResult();
  });
  yearEl.addEventListener('change', () => {
    modelEl.disabled = !(makeEl.value && yearEl.value);
    toggleReset();
    showResult();
  });
  modelEl.addEventListener('change', () => { toggleReset(); showResult(); });

  function toggleReset() {
    resetEl.hidden = !(makeEl.value || yearEl.value || modelEl.value);
  }

  resetEl.addEventListener('click', () => {
    makeEl.value = ''; yearEl.value = ''; modelEl.value = '';
    yearEl.disabled = true; modelEl.disabled = true;
    yearEl.innerHTML = '<option value="">— Pick a make first</option>';
    modelEl.innerHTML = '<option value="">— Pick make + year</option>';
    resultEl.hidden = true; goEl.hidden = true; resetEl.hidden = true;
    try { localStorage.removeItem(STORAGE_KEY); } catch(e) {}
  });

  // Restore from localStorage
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (saved && saved.make && KIT_DATA[saved.make]) {
      makeEl.value = saved.make; populateYears(saved.make); populateModels(saved.make);
      yearEl.disabled = false;
      if (saved.year) { yearEl.value = saved.year; modelEl.disabled = false; }
      if (saved.model) { modelEl.value = saved.model; showResult(); }
      toggleReset();
    }
  } catch(e) {}
}

document.querySelectorAll('[data-kit-finder]').forEach(render);
