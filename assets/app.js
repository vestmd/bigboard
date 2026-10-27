// Страница набора тестировщиков BigBoard: отметка пройденных шагов и кнопка «Поделиться».
(function () {
  var STORE_KEY = 'bigboard-steps';

  function loadDone() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY) || '{}') || {};
    } catch (e) {
      return {};
    }
  }

  function saveDone(done) {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(done));
    } catch (e) {
      // Хранилище недоступно (приватный режим) — отметки просто не переживут перезагрузку.
    }
  }

  var done = loadDone();

  function markStep(id) {
    var step = document.querySelector('.step[data-step="' + id + '"]');
    if (step) step.classList.add('done');
  }

  Object.keys(done).forEach(function (id) {
    if (done[id]) markStep(id);
  });

  // Шаг считается пройденным, как только человек открыл его ссылку: страница остаётся
  // открытой во вкладке, и по возвращении видно, что делать дальше.
  document.querySelectorAll('[data-step-link]').forEach(function (link) {
    link.addEventListener('click', function () {
      var id = link.getAttribute('data-step-link');
      done[id] = true;
      saveDone(done);
      markStep(id);
    });
  });

  var shareBtn = document.getElementById('share');
  if (shareBtn) {
    var label = shareBtn.querySelector('.label');
    var original = label ? label.textContent : '';
    shareBtn.addEventListener('click', function () {
      var url = shareBtn.getAttribute('data-url') || location.href;
      var data = { title: document.title, text: shareBtn.getAttribute('data-text') || '', url: url };
      if (navigator.share) {
        navigator.share(data).catch(function () {});
        return;
      }
      var copied = function () {
        if (!label) return;
        label.textContent = shareBtn.getAttribute('data-copied') || original;
        setTimeout(function () { label.textContent = original; }, 2500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(copied, function () { window.prompt('', url); });
      } else {
        window.prompt('', url);
      }
    });
  }
})();
