(() => {
  'use strict';
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const storage = {
    get(type,key){ try { return window[type].getItem(key); } catch { return null; } },
    set(type,key,value){ try { window[type].setItem(key,value); return true; } catch { return false; } },
    remove(type,key){ try { window[type].removeItem(key); } catch {} }
  };

  const header = $('[data-header]');
  const menuButton = $('[data-menu-toggle]');
  const mobileMenu = $('[data-mobile-menu]');
  const closeMenu = () => {
    if (!menuButton || !mobileMenu) return;
    menuButton.setAttribute('aria-expanded','false');
    mobileMenu.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  };
  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    mobileMenu.classList.toggle('is-open', !open);
    document.body.classList.toggle('menu-open', !open);
  });
  $$('a', mobileMenu || document).forEach(a => a.addEventListener('click', closeMenu));
  addEventListener('scroll', () => header?.classList.toggle('is-scrolled', scrollY > 12), {passive:true});

  if (!reduceMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), {threshold:.1, rootMargin:'0px 0px -45px'});
    $$('.reveal').forEach(el => observer.observe(el));
  } else $$('.reveal').forEach(el => el.classList.add('is-visible'));

  $$('[data-tabs]').forEach(group => {
    const buttons = $$('[data-tab]', group), panels = $$('[data-panel]', group);
    buttons.forEach(btn => btn.addEventListener('click', () => {
      buttons.forEach(b => { b.classList.toggle('is-active', b === btn); b.setAttribute('aria-selected', String(b === btn)); });
      panels.forEach(p => p.classList.toggle('is-active', p.dataset.panel === btn.dataset.tab));
    }));
  });

  const systemContent = {
    cards: {i:'01', t:'Карточки создают основу конверсии', p:'SEO, характеристики, инфографика и позиционирование определяют, насколько эффективно реклама превращается в заказы.', l:['Качество контента влияет на CTR и конверсию','Ошибки в атрибутах ограничивают органический трафик','Единый стандарт упрощает масштабирование ассортимента'], href:'#service-cards', a:'Подробнее о карточках'},
    supply: {i:'02', t:'Поставки поддерживают доступность товара', p:'Прогноз спроса и точки заказа помогают не терять продажи из-за дефицита и не замораживать деньги в излишках.', l:['План учитывает сезонность и акции','Распределение зависит от географии спроса','Остатки влияют на рекламные решения'], href:'#services', a:'Подробнее о поставках'},
    finance: {i:'03', t:'Финансы задают границы решений', p:'Юнит-экономика показывает допустимые скидки, рекламные расходы и вклад каждого SKU в результат.', l:['P&L отделяет оборот от прибыли','Цена оценивается с учётом всех расходов','Ассортимент развивается по финансовому вкладу'], href:'#services', a:'Подробнее о финансах'},
    ads: {i:'04', t:'Реклама масштабирует только готовую систему', p:'Кампании управляются с учётом конверсии карточки, наличия товара и предельных расходов.', l:['Ставки меняются по данным','Нерабочие связки отключаются','Гипотезы тестируются по понятным критериям'], href:'#services', a:'Подробнее о рекламе'}
  };
  const detail = $('[data-system-detail]');
  $$('[data-system-node]').forEach(btn => btn.addEventListener('click', () => {
    const c = systemContent[btn.dataset.systemNode];
    if (!c || !detail) return;
    $$('[data-system-node]').forEach(x => x.classList.toggle('is-active', x === btn));
    detail.classList.add('is-changing');
    setTimeout(() => {
      detail.innerHTML = `<span class="detail-index">${c.i}</span><h3>${c.t}</h3><p>${c.p}</p><ul>${c.l.map(x => `<li>${x}</li>`).join('')}</ul><a class="text-link" href="${c.href}">${c.a}<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>`;
      detail.classList.remove('is-changing');
    }, 150);
  }));

  const serviceContent = {
    cards: ['Карточки и контент','Анализ конкурентов, позиционирование, SEO, заполнение характеристик, инфографика, фото и видео, работа с вариациями и контроль качества карточек.','Понятная структура товара, корректная индексация и база для эффективной рекламы.'],
    supply: ['Поставки и остатки','Прогноз спроса, расчёт поставок, создание отгрузок, распределение по складам, управление FBO/FBS, контроль оборачиваемости и предотвращение дефицита.','Стабильная доступность приоритетных SKU и меньше денег в избыточных запасах.'],
    ads: ['Реклама и маркетинг','Аудит кампаний, настройка структуры, управление ставками, отключение неэффективных связок, тестирование гипотез и регулярная отчётность.','Контроль рекламных расходов с учётом конверсии, остатков и маржинальности.'],
    finance: ['Цены и финансы','Юнит-экономика, P&L, комиссии, логистика, календарь акций, допустимые скидки, предельные рекламные расходы и прибыльность SKU.','Понимание реальной прибыли и финансовых ограничений до запуска решений.'],
    management: ['Управление и развитие','Управляющий проектом, постановка и контроль задач, аналитика, регулярные отчёты, ассортимент, запуск новых товаров и план развития.','Единая ответственность и прозрачный ритм работы вместо ручной координации подрядчиков.'],
    launch: ['Выход на маркетплейсы','Анализ рынка и продукта, выбор товарной матрицы, юнит-экономика, подготовка кабинета, создание карточек, логистическая модель и план запуска.','Проверенная экономика и последовательный старт без запуска всей матрицы вслепую.']
  };
  const caseContent = {
    home: ['Товары для дома: система остатков, цен и рекламы','Исходная ситуация: высокая доля отсутствующего товара по востребованным позициям, хаотичное участие в скидках и отсутствие единой финансовой модели.','Что сделали: настроили расчёт поставок и точки заказа, пересчитали юнит-экономику, связали рекламные решения с остатками и сформировали правила участия в акциях.','Управленческий результат: решения по рекламе, цене и поставкам перестали противоречить друг другу. Финансовые показатели раскрываются после согласования с клиентом.'],
    cosmetics: ['Производитель косметики: карточки, реклама и P&L','Исходная ситуация: карточки не раскрывали преимущества продуктов, реклама не имела единой структуры, прибыльность товаров не отслеживалась регулярно.','Что сделали: перестроили карточки и инфографику, провели SEO-оптимизацию, создали архитектуру рекламных кампаний и внедрили P&L по SKU.','Управленческий результат: контент, реклама и финансовые решения стали оцениваться по общим показателям. Числовые результаты публикуются после письменного согласования.']
  };
  const dialog = $('[data-info-dialog]');
  const dialogContent = $('[data-dialog-content]');
  const openDialog = (title, blocks) => {
    if (!dialog || !dialogContent) return;
    dialogContent.innerHTML = `<span class="eyebrow">Подробности</span><h2>${title}</h2>${blocks.map((x,i) => i===0 ? `<p>${x}</p>` : `<p>${x}</p>`).join('')}`;
    dialog.showModal();
  };
  $$('[data-service-open]').forEach(btn => btn.addEventListener('click', () => {
    const [title,scope,result] = serviceContent[btn.dataset.serviceOpen];
    openDialog(title,[scope,`<strong>Результат для бизнеса:</strong> ${result}`]);
  }));
  $$('[data-case-open]').forEach(btn => btn.addEventListener('click', () => {
    const [title,...blocks] = caseContent[btn.dataset.caseOpen]; openDialog(title,blocks);
  }));
  $('[data-dialog-close]')?.addEventListener('click', () => dialog.close());
  $('[data-dialog-cta]')?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });

  const form = $('[data-lead-form]');
  if (form) {
    const params = new URLSearchParams(location.search);
    ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(k => {
      const input = form.elements[k];
      if (input) input.value = params.get(k) || storage.get('sessionStorage',k) || '';
      if (params.get(k)) storage.set('sessionStorage',k,params.get(k));
    });
    form.elements.page_url.value = location.href;
    const draftKey = 'platformance_lead_draft';
    try {
      const saved = JSON.parse(storage.get('localStorage',draftKey) || '{}');
      ['name','phone','channel','marketplace','store_url','comment'].forEach(k => { if(saved[k] && form.elements[k]) form.elements[k].value = saved[k]; });
    } catch {}
    form.addEventListener('input', () => {
      const data = Object.fromEntries(new FormData(form).entries());
      const safe = {}; ['name','phone','channel','marketplace','store_url','comment'].forEach(k => safe[k] = data[k] || '');
      storage.set('localStorage',draftKey,JSON.stringify(safe));
    });
    const phone = form.elements.phone;
    phone.addEventListener('input', e => {
      let d = e.target.value.replace(/\D/g,'');
      if(d[0] === '8') d = '7' + d.slice(1);
      if(d[0] !== '7' && d.length) d = '7' + d;
      d = d.slice(0,11);
      let out = d.length ? '+7' : '';
      if(d.length > 1) out += ' (' + d.slice(1,4);
      if(d.length >= 4) out += ') ' + d.slice(4,7);
      if(d.length >= 7) out += '-' + d.slice(7,9);
      if(d.length >= 9) out += '-' + d.slice(9,11);
      e.target.value = out;
    });
    form.addEventListener('submit', async e => {
      e.preventDefault();
      $$('label',form).forEach(l => l.classList.remove('has-error'));
      const errorBox = $('[data-form-error]',form); errorBox.textContent = '';
      let valid = true;
      $$('[required]',form).forEach(input => {
        const bad = input.type === 'checkbox' ? !input.checked : !input.value.trim();
        if(bad){ input.closest('label')?.classList.add('has-error'); valid = false; }
      });
      if(phone.value.replace(/\D/g,'').length < 11){ phone.closest('label')?.classList.add('has-error'); valid = false; }
      const url = form.elements.store_url;
      if(url.value && !/^https?:\/\//i.test(url.value)){ url.closest('label')?.classList.add('has-error'); valid = false; }
      if(!valid){ errorBox.textContent = 'Проверьте обязательные поля и формат данных.'; form.querySelector('.has-error input, .has-error textarea, .has-error select')?.focus(); return; }
      if(form.elements.company_website.value) return;
      const submit = form.querySelector('button[type="submit"]'); const original = submit.innerHTML;
      submit.disabled = true; submit.innerHTML = '<span>Отправляем…</span>';
      const payload = Object.fromEntries(new FormData(form).entries()); delete payload.company_website; payload.created_at = new Date().toISOString();
      try {
        const config = window.PLATFORMANCE_CONFIG || {};
        if(config.webhookUrl){
          const response = await fetch(config.webhookUrl,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
          if(!response.ok) throw new Error('Webhook error');
        } else {
          storage.set('sessionStorage','platformance_last_lead',JSON.stringify(payload));
          console.info('Webhook не настроен. Укажите webhookUrl в assets/config.js');
        }
        storage.remove('localStorage',draftKey);
        location.href = config.thankYouPage || 'thank-you.html';
      } catch {
        errorBox.textContent = 'Не удалось отправить заявку. Позвоните нам или попробуйте ещё раз.';
        submit.disabled = false; submit.innerHTML = original;
      }
    });
  }

  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const target = $(a.getAttribute('href')); if(!target) return;
    e.preventDefault(); target.scrollIntoView({behavior:reduceMotion?'auto':'smooth',block:'start'});
  }));
})();
