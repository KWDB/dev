function normalizePath(pathname) {
  if (!pathname) return '/';
  return pathname.replace(/\/+$/, '') || '/';
}

function getLinkPath(link) {
  try {
    const href = link.getAttribute('href') || '';
    if (href.startsWith('http')) {
      const u = new URL(href);
      return normalizePath(u.pathname);
    }
    return normalizePath(href);
  } catch (_) {
    return '';
  }
}

function isInternal(linkBase) {
  return linkBase.startsWith('/dev/');
}

function pickBestMatch(currentPath, links) {
  let best = null;
  let bestLen = -1;
  for (const link of links) {
    const base = getLinkPath(link);
    if (!base || !isInternal(base)) continue;
    if (currentPath === base || currentPath.startsWith(base + '/')) {
      if (base.length > bestLen) {
        best = link;
        bestLen = base.length;
      }
    }
  }
  return best;
}

function updateActiveNav() {
  if (typeof document === 'undefined') return;
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  const links = Array.from(nav.querySelectorAll('.navbar__link'));
  const current = normalizePath(window.location.pathname);
  let target = pickBestMatch(current, links);
  for (const link of links) {
    link.classList.remove('navbar__link--active');
    link.removeAttribute('aria-current');
    link.removeAttribute('data-active');
  }
  if (!target) return;
  target.classList.add('navbar__link--active');
  target.setAttribute('aria-current', 'page');
  target.setAttribute('data-active', 'true');
}

function installHistoryHook() {
  if (typeof window === 'undefined' || !window.history) return;
  const push = history.pushState;
  const replace = history.replaceState;
  history.pushState = function() {
    const r = push.apply(this, arguments);
    window.dispatchEvent(new Event('kwdb:navigation'));
    return r;
  };
  history.replaceState = function() {
    const r = replace.apply(this, arguments);
    window.dispatchEvent(new Event('kwdb:navigation'));
    return r;
  };
  window.addEventListener('popstate', function() {
    window.dispatchEvent(new Event('kwdb:navigation'));
  });
  window.addEventListener('hashchange', function() {
    window.dispatchEvent(new Event('kwdb:navigation'));
  });
}

function init() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateActiveNav);
  } else {
    updateActiveNav();
  }
  installHistoryHook();
  window.addEventListener('kwdb:navigation', updateActiveNav);
}

if (typeof window !== 'undefined') {
  init();
}

