/*
 * Цели Яндекс Метрики для воронки заявки PLATFORMANCE.
 * Счётчик 111834033. Цели уже созданы в Метрике — идентификаторы менять нельзя.
 *
 *   lead_cta_click     — клик по кнопке, ведущей к форме заявки (#audit)
 *   lead_form_view     — карточка формы заявки появилась на экране
 *   lead_form_start    — посетитель начал вводить данные в форму
 *   lead_form_submit   — Битрикс24 сообщил об успешной отправке формы
 *   lead_form_fallback — форма не загрузилась, показаны запасные контакты
 *
 * Каждая цель отправляется не больше одного раза за загрузку страницы,
 * кроме lead_cta_click (каждый клик). Персональные данные не передаются.
 */
(() => {
  'use strict';

  const COUNTER_ID = 111834033;
  const sent = new Set();

  // Страница: '/' и '/index.html' -> 'index', '/ozon.html' -> 'ozon'.
  const page = location.pathname.replace(/^\/+/, '').replace(/\.html$/, '') || 'index';

  function goal(name, params, callback) {
    if (typeof window.ym !== 'function') {
      if (callback) callback();
      return;
    }
    try {
      window.ym(COUNTER_ID, 'reachGoal', name, params, callback);
    } catch (error) {
      if (callback) callback();
    }
  }

  function goalOnce(name, params) {
    if (sent.has(name)) return;
    sent.add(name);
    goal(name, params);
  }

  // 1. Клик по кнопке заявки.
  // Место кнопки берётся из data-cta, а если его нет — из контейнера.
  const PLACES = [
    ['.header-actions', 'header'],
    ['.mobile-menu', 'mobile_menu'],
    ['.hero-actions', 'hero'],
    ['.cta-band-inner', 'cta_band'],
    ['.footer-bottom', 'footer_bottom'],
    ['.footer-col', 'footer'],
  ];

  function placeOf(link) {
    if (link.dataset.cta) return link.dataset.cta;
    for (const [selector, name] of PLACES) {
      if (link.closest(selector)) return name;
    }
    const section = link.closest('section[id]');
    return section ? 'section_' + section.id : 'other';
  }

  // Слушаем на window в фазе перехвата: обработчик модального окна в app.js
  // висит на document в той же фазе и вызывает stopPropagation().
  window.addEventListener('click', event => {
    const target = event.target;
    const link = target && target.closest ? target.closest('a[href$="#audit"]') : null;
    if (!link) return;

    const params = { lead_cta: { [page]: placeOf(link) } };
    const samePage = link.getAttribute('href').charAt(0) === '#';
    const newTab = event.button !== 0 || event.metaKey || event.ctrlKey ||
      event.shiftKey || event.altKey || link.target === '_blank';

    if (samePage || newTab) {
      goal('lead_cta_click', params);
      return;
    }

    // Переход на другую страницу (например, index.html#audit с посадочной):
    // даём Метрике отправить цель, затем переходим. Не дольше 600 мс.
    event.preventDefault();
    let gone = false;
    const go = () => {
      if (gone) return;
      gone = true;
      location.href = link.href;
    };
    goal('lead_cta_click', params, go);
    setTimeout(go, 600);
  }, true);

  // 2. Карточка формы на экране: при прокрутке до #audit или в модальном окне.
  const card = document.querySelector('#audit .form-card') || document.querySelector('[data-b24-slot]');
  if (card && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        goalOnce('lead_form_view', { lead_form: { view: page } });
        observer.disconnect();
      }
    }, { threshold: 0.25 });
    observer.observe(card);
  }

  // 3. Начал заполнять форму. Только ввод: при открытии модального окна
  // app.js сам ставит фокус в первое поле, поэтому focus не подходит.
  const slot = document.querySelector('[data-b24-slot]');
  if (slot) {
    const onStart = () => goalOnce('lead_form_start', { lead_form: { start: page } });
    slot.addEventListener('input', onStart, true);
    slot.addEventListener('change', onStart, true);
  }

  // 4. Успешная отправка формы Битрикс24.
  window.addEventListener('b24:form:send:success', () => {
    goalOnce('lead_form_submit', { lead_form: { submit: page } });
  });

  // 5. Форма не загрузилась: app.js снимает hidden с запасного блока.
  const fallback = document.querySelector('[data-b24-fallback]');
  if (fallback && 'MutationObserver' in window) {
    const watcher = new MutationObserver(() => {
      if (!fallback.hidden) {
        goalOnce('lead_form_fallback', { lead_form: { fallback: page } });
        watcher.disconnect();
      }
    });
    watcher.observe(fallback, { attributes: true, attributeFilter: ['hidden'] });
  }
})();
