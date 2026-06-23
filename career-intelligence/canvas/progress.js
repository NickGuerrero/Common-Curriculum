(function () {
  var PROGRESS_ENDPOINT = 'https://canvas-progress-lti.netlify.app/.netlify/functions/canvas-progress';

  function pageContext() {
    return new URLSearchParams(window.location.search).get('context')
      || (window.self !== window.top ? 'canvas' : 'web');
  }

  function resolveLinks(ctx) {
    document.querySelectorAll('a[data-canvas-href]').forEach(function (a) {
      if (ctx === 'canvas') {
        a.href = a.getAttribute('data-canvas-href');
        return;
      }
      try {
        var u = new URL(a.getAttribute('href'), window.location.href);
        u.searchParams.set('context', 'web');
        a.href = u.pathname + u.search + u.hash;
      } catch (e) {
        /* leave the authored link as-is */
      }
    });
  }

  function ensureProgressCheck(row) {
    var existing = row.querySelector('.progress-check');
    if (existing) return existing;
    var check = document.createElement('span');
    check.className = 'progress-check';
    check.setAttribute('aria-label', 'Progress unavailable');
    check.setAttribute('title', 'Progress unavailable');
    check.innerHTML = '<span class="progress-box"></span><span class="progress-label">Progress unavailable</span>';
    row.appendChild(check);
    return check;
  }

  function setStatus(text, visible) {
    var statusEl = document.getElementById('progress-status');
    if (!statusEl) return;
    statusEl.textContent = text || '';
    statusEl.hidden = !visible;
  }

  function setItemState(row, state, label) {
    row.setAttribute('data-progress-state', state);
    var check = ensureProgressCheck(row);
    var labelEl = check.querySelector('.progress-label');
    check.setAttribute('aria-label', label);
    check.setAttribute('title', label);
    if (labelEl) labelEl.textContent = label;
  }

  function progressToken() {
    var params = new URLSearchParams(window.location.search);
    var hash = new URLSearchParams((window.location.hash || '').replace(/^#/, ''));
    var fromQuery = params.get('progress_token');
    var fromHash = hash.get('progress_token');
    var storedToken = null;

    try {
      storedToken = window.sessionStorage.getItem('canvas_progress_token');
    } catch (e) {
      /* storage can be unavailable in some embedded browser contexts */
    }

    var token = fromHash || fromQuery || storedToken;

    if (fromHash || fromQuery) {
      try {
        window.sessionStorage.setItem('canvas_progress_token', token);
        params.delete('progress_token');
        hash.delete('progress_token');
        var next = window.location.pathname
          + (params.toString() ? '?' + params.toString() : '')
          + (hash.toString() ? '#' + hash.toString() : '');
        window.history.replaceState(null, '', next);
      } catch (e) {
        /* progress can still continue for this page load */
      }
    }
    return token;
  }

  function loadProgress(ctx) {
    var rows = Array.prototype.slice.call(document.querySelectorAll('.item[data-progress-id]'));
    if (!rows.length) return;

    rows.forEach(ensureProgressCheck);

    if (ctx !== 'canvas') {
      rows.forEach(function (row) {
        setItemState(row, 'unavailable', 'Progress available in Canvas');
      });
      return;
    }

    var token = progressToken();
    if (!token) {
      setStatus('Progress is unavailable until this page is opened through Canvas.', true);
      rows.forEach(function (row) {
        setItemState(row, 'unavailable', 'Progress unavailable');
      });
      return;
    }

    rows.forEach(function (row) {
      setItemState(row, 'loading', 'Checking progress');
    });
    setStatus('Checking Canvas progress...', true);

    window.fetch(PROGRESS_ENDPOINT, { headers: { Authorization: 'Bearer ' + token } })
      .then(function (response) {
        if (!response.ok) throw new Error('Progress request failed');
        return response.json();
      })
      .then(function (data) {
        var byModuleItem = {};
        var progressItems = data.items || [];

        if (!progressItems.length) {
          setStatus('Canvas progress is available for enrolled participants; no learner progress was returned for this Canvas account.', true);
          rows.forEach(function (row) {
            setItemState(row, 'unavailable', 'Progress unavailable for this Canvas account');
          });
          return;
        }

        progressItems.forEach(function (item) {
          if (item.moduleItemId != null) byModuleItem[String(item.moduleItemId)] = item;
        });

        var completeCount = 0;
        var matchedCount = 0;
        rows.forEach(function (row) {
          var moduleItemId = row.getAttribute('data-canvas-module-item-id');
          var progress = moduleItemId ? byModuleItem[String(moduleItemId)] : null;
          if (progress && progress.completed) {
            completeCount += 1;
            matchedCount += 1;
            setItemState(row, 'complete', 'Completed in Canvas');
          } else if (progress) {
            matchedCount += 1;
            setItemState(row, 'incomplete', 'Not completed in Canvas');
          } else {
            setItemState(row, 'unavailable', 'Progress unavailable for this item');
          }
        });
        if (matchedCount) {
          setStatus(completeCount + ' of ' + matchedCount + ' mapped items completed in Canvas.', true);
        } else {
          setStatus('Canvas progress loaded, but no mapped homepage rows matched Canvas module items.', true);
        }
      })
      .catch(function () {
        setStatus('Canvas progress could not be loaded right now.', true);
        rows.forEach(function (row) {
          setItemState(row, 'unavailable', 'Progress unavailable');
        });
      });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var ctx = pageContext();
    resolveLinks(ctx);
    loadProgress(ctx);
  });
})();
