(() => {
  const allowed = new Set(['overview', 'project', 'requests']);
  const views = [...document.querySelectorAll('.page')];
  const navigation = [...document.querySelectorAll('[data-page]')];
  const dialog = document.querySelector('#request-dialog');
  const form = document.querySelector('#request-form');
  const toast = document.querySelector('#toast');
  let count = 1;
  function navigate() {
    const id = location.hash.slice(1);
    const page = allowed.has(id) ? id : 'overview';
    views.forEach(view => { view.hidden = view.id !== page; });
    navigation.forEach(link => {
      const active = link.dataset.page === page;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
    });
    document.querySelector('#breadcrumb').textContent = {overview:'OVERVIEW', project:'YOUR PROJECT', requests:'SUPPORT REQUESTS'}[page];
    window.scrollTo({top: 0, behavior: 'auto'});
  }
  window.addEventListener('hashchange', navigate);
  document.querySelectorAll('[data-go]').forEach(button => button.addEventListener('click', () => { location.hash = button.dataset.go; }));
  document.querySelectorAll('[data-request]').forEach(button => button.addEventListener('click', () => dialog.showModal()));
  document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
  document.querySelector('#cancel-dialog').addEventListener('click', () => dialog.close());
  form.addEventListener('submit', event => {
    event.preventDefault();
    const title = document.querySelector('#request-title').value.trim();
    const details = document.querySelector('#request-detail').value.trim();
    if (!title || !details) return;
    const type = document.querySelector('#request-type').value;
    const item = document.createElement('div'); item.className = 'request-item';
    const icon = document.createElement('div'); icon.className = 'request-icon'; icon.innerHTML = "\n<svg aria-hidden=\"true\" focusable=\"false\" class=\"lucide-icon lucide lucide-arrow-up-right\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" ><path d=\"M7 7h10v10\" /><path d=\"M7 17 17 7\" /></svg>";
    const content = document.createElement('div');
    const heading = document.createElement('h3'); heading.textContent = title;
    const description = document.createElement('p'); description.textContent = `Just added · ${type} · Preview only`;
    const badge = document.createElement('span'); badge.className = 'step-badge current-badge'; badge.textContent = 'Not sent';
    content.append(heading, description); item.append(icon, content, badge); document.querySelector('#request-items').prepend(item);
    document.querySelector('#request-count').textContent = `${++count} samples`;
    form.reset(); dialog.close(); location.hash = 'requests';
    toast.textContent = 'Sample request added — nothing was sent.'; toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4500);
  });
  navigate();
})();
