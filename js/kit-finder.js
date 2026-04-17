// Kit data seeded from Harley production years — verify with Frank before launch.
/* =========================================================
   FRANKENSTEIN TRIKES — KIT FINDER
   Model → Year → matching kit.
   Mount: add `data-kit-finder` to any container.
   Persists last selection in localStorage.
   ========================================================= */

const KITS = [
  { id: 'sportster',         label: 'Sportster',              yearStart: 1957, yearEnd: 2022 },
  { id: 'dyna',              label: 'Dyna',                   yearStart: 1991, yearEnd: 2017 },
  { id: 'softail',           label: 'Softail',                yearStart: 1984, yearEnd: 2025 },
  { id: 'rocker-breakout',   label: 'Rocker & Breakout',      yearStart: 2008, yearEnd: 2025 },
  { id: 'fatboy-heritage',   label: 'Fat Boy & Heritage',     yearStart: 1990, yearEnd: 2025 },
  { id: 'flt-flh-roadking',  label: 'FLT / FLH / Road King',  yearStart: 1980, yearEnd: 2025 },
  { id: 'v-rod',             label: 'V-Rod',                  yearStart: 2002, yearEnd: 2017 },
  { id: 'fxr',               label: 'FXR',                    yearStart: 1982, yearEnd: 2000 },
  { id: '4-speed-fl-fx',     label: '4-Speed FL / FX',        yearStart: 1965, yearEnd: 1984 },
  { id: 'street',            label: 'Street 500 / 750',       yearStart: 2014, yearEnd: 2020 },
  { id: 'yamaha',            label: 'Yamaha',                 yearStart: 1999, yearEnd: 2025 },
  { id: 'kawasaki-1700',     label: 'Kawasaki 1700',          yearStart: 2004, yearEnd: 2025 },
  { id: 'dna-old-school',    label: 'Frankenstein Old School',yearStart: 1936, yearEnd: 2025 }
];

const STORAGE_KEY = 'frankenstein.bike';

function getKit(id) {
  return KITS.find(k => k.id === id);
}

function yearsFor(kit) {
  const years = [];
  for (let y = kit.yearEnd; y >= kit.yearStart; y--) years.push(y);
  return years;
}

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
        <label for="kf-model">01 · Model</label>
        <select id="kf-model" data-kf-model>
          <option value="">Select your model</option>
          ${KITS.map(k => `<option value="${k.id}">${k.label}</option>`).join('')}
        </select>
      </div>
      <div class="kit-finder__field">
        <label for="kf-year">02 · Year</label>
        <select id="kf-year" data-kf-year disabled>
          <option value="">— Pick a model first</option>
        </select>
      </div>
      <div class="kit-finder__field" style="flex:0 1 auto">
        <label>&nbsp;</label>
        <a href="#" class="btn btn--primary" data-kf-go hidden>Find My Kit</a>
      </div>
    </div>

    <div class="kit-finder__result" data-kf-result hidden></div>
  `;

  const modelEl = container.querySelector('[data-kf-model]');
  const yearEl  = container.querySelector('[data-kf-year]');
  const goEl    = container.querySelector('[data-kf-go]');
  const resetEl = container.querySelector('[data-kf-reset]');
  const resultEl= container.querySelector('[data-kf-result]');

  function populateYears(id) {
    const kit = getKit(id);
    if (!kit) return;
    yearEl.innerHTML = '<option value="">Select year</option>' +
      yearsFor(kit).map(y => `<option value="${y}">${y}</option>`).join('');
    yearEl.disabled = false;
  }

  function showResult() {
    const id = modelEl.value, year = yearEl.value;
    if (!id || !year) { resultEl.hidden = true; goEl.hidden = true; return; }
    const kit = getKit(id);
    if (!kit) { resultEl.hidden = true; goEl.hidden = true; return; }

    goEl.href = `kit-detail.html?id=${kit.id}`;
    goEl.hidden = false;

    resultEl.innerHTML = `
      <div class="ph" style="min-height:240px">
        <div class="ph-tag">// ${kit.label} trike · ${year}</div>
        <div class="ph-tag">Match</div>
      </div>
      <div>
        <div class="eyebrow">Match Found</div>
        <div class="display" style="font-size:clamp(1.75rem,3vw,2.75rem);line-height:0.9">${kit.label}<br>Trike Kit.</div>
        <p class="text-secondary" style="margin-top:16px">For your ${year} ${kit.label}. Installs in one day.</p>
        <div class="btn-row" style="margin-top:20px">
          <a href="kit-detail.html?id=${kit.id}" class="btn btn--primary">View Kit Page</a>
          <a href="dealers.html" class="btn btn--ghost">Find a Dealer</a>
        </div>
      </div>
    `;
    resultEl.hidden = false;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ id, year }));
    } catch(e) {}
  }

  function toggleReset() {
    resetEl.hidden = !(modelEl.value || yearEl.value);
  }

  modelEl.addEventListener('change', () => {
    const id = modelEl.value;
    if (id) { populateYears(id); }
    else {
      yearEl.disabled = true;
      yearEl.innerHTML = '<option value="">— Pick a model first</option>';
    }
    toggleReset();
    showResult();
  });
  yearEl.addEventListener('change', () => { toggleReset(); showResult(); });

  resetEl.addEventListener('click', () => {
    modelEl.value = ''; yearEl.value = '';
    yearEl.disabled = true;
    yearEl.innerHTML = '<option value="">— Pick a model first</option>';
    resultEl.hidden = true; goEl.hidden = true; resetEl.hidden = true;
    try { localStorage.removeItem(STORAGE_KEY); } catch(e) {}
  });

  // Restore from localStorage
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (saved && saved.id && getKit(saved.id)) {
      modelEl.value = saved.id; populateYears(saved.id);
      if (saved.year) { yearEl.value = saved.year; showResult(); }
      toggleReset();
    }
  } catch(e) {}
}

function mountAll() {
  document.querySelectorAll('[data-kit-finder]').forEach(render);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountAll);
} else {
  mountAll();
}
