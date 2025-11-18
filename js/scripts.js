document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.gallery-img').forEach(function(img){
    img.addEventListener('click', function () {
      var full = img.dataset.full || img.src;
      var modalImg = document.getElementById('lightbox-img');
      modalImg.src = full;
      modalImg.alt = img.alt || '';
      var lightbox = new bootstrap.Modal(document.getElementById('lightbox'));
      lightbox.show();
    });
  });

  // scroll para links
  document.querySelectorAll('a.nav-link[href^="#"]').forEach(function(link){
    link.addEventListener('click', function(e){
      e.preventDefault();
      var target = document.querySelector(this.getAttribute('href'));
      if(target){
        target.scrollIntoView({behavior:'smooth', block:'start'});
      }
      // Fechar menu mobile se estiver aberto
      var navMenu = document.getElementById('navMenu');
      if(navMenu && navMenu.classList.contains('show')){
        var bsCollapse = bootstrap.Collapse.getInstance(navMenu) || new bootstrap.Collapse(navMenu);
        bsCollapse.hide();
      }
    });
  });


  // Lazy-load do embed do Instagram usando IntersectionObserver
  var igWrap = document.getElementById('instagram-embed');
  if(igWrap){
    var igObserver = new IntersectionObserver(function(entries, observer){
      if(entries[0].isIntersecting){
        fetch('/api/instagram/media', { credentials: 'same-origin' })
          .then(function(response){
            if(!response.ok) throw new Error('Network response was not ok');
            return response.json();
          })
          .then(function(json){
            var posts = json.data || json;
            if(!posts || posts.length === 0){
              var placeholder = igWrap.querySelector('.instagram-placeholder');
              if(placeholder){
                placeholder.innerHTML = '<div class="p-3 text-start">Nenhuma mídia disponível. <a href="https://www.instagram.com/etecbarretosoficial/" target="_blank" rel="noopener noreferrer">Abrir perfil</a></div>';
              }
              return;
            }

            var col = document.createElement('div');
            col.className = 'col-12';
            var grid = document.createElement('div');
            grid.className = 'instagram-grid';

            posts.slice(0, 9).forEach(function(p){
              var mediaUrl = p.media_type === 'VIDEO' ? (p.thumbnail_url || p.media_url) : p.media_url;
              var link = document.createElement('a');
              link.href = p.permalink || '#';
              link.target = '_blank';
              link.rel = 'noopener noreferrer';
              link.className = 'd-block';

              var img = document.createElement('img');
              img.src = mediaUrl;
              img.alt = (p.caption || '').slice(0, 120);
              img.loading = 'lazy';
              img.className = 'ig-thumb';

              link.appendChild(img);
              grid.appendChild(link);
            });

            col.appendChild(grid);
            igWrap.innerHTML = '';
            igWrap.appendChild(col);
          })
          .catch(function(){
            var placeholder = igWrap.querySelector('.instagram-placeholder');
            if(placeholder){
              placeholder.innerHTML = '<div class="p-3 text-start">Não foi possível carregar o feed automaticamente. <a href="https://www.instagram.com/etecbarretosoficial/" target="_blank" rel="noopener noreferrer">Abrir perfil</a></div>';
            }
          })
          .finally(function(){
            observer.disconnect();
          });
      }
    }, {rootMargin: '300px'});

    igObserver.observe(igWrap);
  }
});
document.addEventListener('DOMContentLoaded', function () {
  var verTodos = document.getElementById('verTodosBtn');
  if (verTodos) {
    verTodos.addEventListener('click', function () {
      var tabEl = document.getElementById('tecnicos-tab');
      if (tabEl) {
        var tab = new bootstrap.Tab(tabEl);
        tab.show();
        document.getElementById('cursos').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
});
document.addEventListener('DOMContentLoaded', function () {
  var container = document.getElementById('instagram-embed');
  if (!container) return;

  // Lista de posts
  var INSTAGRAM_POSTS = [
    'https://www.instagram.com/p/DQaYPuSDUI1/',
 
  ];

  function renderGrid(posts) {
    var col = document.createElement('div');
    col.className = 'col-12';
    var grid = document.createElement('div');
    grid.className = 'instagram-grid';
    posts.forEach(function (url) {
      var block = document.createElement('blockquote');
      block.className = 'instagram-media';
      block.setAttribute('data-instgrm-permalink', url);
      block.style = 'background:#fff; border:0; margin:0; padding:0;';
      var a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = 'Ver no Instagram';
      block.appendChild(a);
      grid.appendChild(block);
    });
    col.appendChild(grid);
    container.innerHTML = '';
    container.appendChild(col);
  }

  function loadInstagramScript(callback) {
    if (window.instgrm) {
      if (callback) callback();
      return;
    }
    var s = document.createElement('script');
    s.src = 'https://www.instagram.com/embed.js';
    s.async = true;
    s.defer = true;
    s.onload = function () {
      if (callback) callback();
    };
    document.body.appendChild(s);
  }

  function initWidget() {
    var posts = INSTAGRAM_POSTS.filter(Boolean);
    if (posts.length === 0) return;
    renderGrid(posts);
    loadInstagramScript(function () {
      try { window.instgrm.Embeds.process(); } catch (e) {  }
    });
  }

  // Lazy-load com IntersectionObserver
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries, observer) {
      if (entries[0].isIntersecting) {
        initWidget();
        observer.disconnect();
      }
    }, { rootMargin: '300px' });
    obs.observe(container);
  } else {
    // fallback imediato
    initWidget();
  }
});
