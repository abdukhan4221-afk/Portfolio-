const $ = (selector, root = document) => root.querySelector(selector);
const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const defaultContent = {
  profile: { name:'Hafiz Abdullah Abbas', shortName:'HA', headline:'Developer & Content Creator', about:'I enjoy building for the web, creating digital experiences, and sharing what I make. This portfolio is where I bring my development work and creative projects together.', contactEmail:'abdukhan42121@gmail.com', location:'Pakistan', availability:'Open to interesting projects' },
  skills:['Web Development','Content Creation'],
  education:[{title:'Matriculation — Computer Science',institution:'Punjab',detail:'Computer Science'}],
  projects:[{name:'EclipseNetwork',category:'Minecraft Network',description:'A Minecraft network project focused on building a community and delivering a memorable gameplay experience.',link:'',status:'Featured'}],
  socials:{discord:'https://discord.gg/yyfPVzs6S',youtube:'https://youtube.com/@g1yrexmc?si=CTa_itLup8EOuvbd',tiktok:'https://www.tiktok.com/@user423492238',snapchat:'https://www.snapchat.com/add/hafiz.saheb0?share_id=4So-DKyMUSE&locale=en-PK'}
};
const socialNames = {discord:'Discord',youtube:'YouTube',tiktok:'TikTok',snapchat:'Snapchat'};
function safeUrl(value) { try { const u = new URL(value); return ['https:','http:'].includes(u.protocol) ? u.href : ''; } catch { return ''; } }
function renderSocials(target, socials) {
  if (!target) return;
  target.innerHTML = Object.entries(socialNames).filter(([key]) => safeUrl(socials?.[key])).map(([key,label]) => `<a class="social-link" href="${escapeHtml(safeUrl(socials[key]))}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`).join('');
}
function render(content) {
  const p = content.profile || defaultContent.profile;
  document.title = `${p.name || 'Portfolio'} — ${p.headline || 'Developer & Creator'}`;
  // Keep the custom two-line name lockup visually balanced.
  const words = String(p.name || defaultContent.profile.name).trim().split(/\s+/);
  $('#heroName').innerHTML = words.length > 2 ? `${escapeHtml(words.slice(0,2).join(' '))}<br><span class="gradient-text">${escapeHtml(words.slice(2).join(' '))}.</span>` : `<span class="gradient-text">${escapeHtml(p.name || defaultContent.profile.name)}.</span>`;
  $('#heroHeadline').textContent = p.headline || defaultContent.profile.headline;
  $('#heroDescription').textContent = (p.about || defaultContent.profile.about).slice(0, 190);
  $('#aboutText').textContent = p.about || defaultContent.profile.about;
  $('#availabilityText').textContent = p.availability || 'Open to interesting projects';
  $('#locationText').textContent = p.location || 'Pakistan';
  $('#avatarLetters').textContent = p.shortName || 'HA';
  const email = p.contactEmail || defaultContent.profile.contactEmail;
  $('#contactEmailLink').href = `mailto:${email}`;
  $('#contactEmailLink').innerHTML = `${escapeHtml(email)} <span>↗</span>`;
  const skills = Array.isArray(content.skills) ? content.skills : defaultContent.skills;
  $('#skillList').innerHTML = skills.filter(Boolean).map(skill => `<span class="skill-pill">${escapeHtml(skill)}</span>`).join('');
  const education = Array.isArray(content.education) ? content.education : defaultContent.education;
  $('#educationList').innerHTML = education.map(item => `<article class="glass-card timeline-item"><span class="eyebrow">EDUCATION</span><h3>${escapeHtml(item.title || 'Study')}</h3><p>${escapeHtml(item.institution || '')}${item.detail ? ` · ${escapeHtml(item.detail)}` : ''}</p></article>`).join('') || '<p class="section-subtitle">Education details will be added soon.</p>';
  const projects = Array.isArray(content.projects) ? content.projects : defaultContent.projects;
  $('#projectsGrid').innerHTML = projects.map(project => `<article class="glass-card project-card"><div class="project-meta"><span class="project-tag">${escapeHtml(project.category || 'PROJECT')}</span><span class="project-status">${escapeHtml(project.status || 'Project')}</span></div><h3>${escapeHtml(project.name || 'Untitled project')}</h3><p>${escapeHtml(project.description || '')}</p>${safeUrl(project.link) ? `<a class="project-link" href="${escapeHtml(safeUrl(project.link))}" target="_blank" rel="noopener noreferrer">Explore project ↗</a>` : ''}</article>`).join('');
  renderSocials($('#heroSocials'), content.socials || defaultContent.socials);
  renderSocials($('#contactSocials'), content.socials || defaultContent.socials);
}
async function loadContent() {
  try { const response = await fetch('/api/content'); if (!response.ok) throw new Error('Using preview content'); render(await response.json()); }
  catch { render(defaultContent); }
}
$('#contactForm').addEventListener('submit', async event => {
  event.preventDefault();
  const form = event.currentTarget, button = $('.form-submit', form), feedback = $('#formFeedback');
  button.disabled = true; button.textContent = 'Sending…'; feedback.textContent = '';
  const payload = Object.fromEntries(new FormData(form).entries());
  try {
    const response = await fetch('/api/contact', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Could not send message.');
    form.reset(); feedback.textContent = 'Message sent. Thank you for reaching out!';
  } catch (error) { feedback.textContent = error.message || 'Something went wrong. Please email me directly.'; }
  finally { button.disabled = false; button.innerHTML = 'Send message <span>↗</span>'; }
});
const menuToggle = $('#menuToggle'), nav = $('#mainNav');
menuToggle.addEventListener('click', () => { const open = nav.classList.toggle('open'); menuToggle.setAttribute('aria-expanded', String(open)); });
nav.addEventListener('click', event => { if (event.target.closest('a')) { nav.classList.remove('open'); menuToggle.setAttribute('aria-expanded','false'); } });
$('#year').textContent = new Date().getFullYear();
const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('revealed'); revealObserver.unobserve(entry.target); } }), {threshold:.12});
document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));
// Lightweight starfield; pauses when the tab is hidden and respects reduced motion.
(() => {
  const canvas = $('#starfield'), ctx = canvas.getContext('2d');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width=0,height=0,stars=[],raf=0;
  function resize(){ const dpr=Math.min(devicePixelRatio||1,2); width=innerWidth;height=innerHeight;canvas.width=width*dpr;canvas.height=height*dpr;canvas.style.width=width+'px';canvas.style.height=height+'px';ctx.setTransform(dpr,0,0,dpr,0,0);stars=Array.from({length:Math.min(130,Math.floor(width*height/10500))},()=>({x:Math.random()*width,y:Math.random()*height,r:Math.random()*1.35+.25,a:Math.random()*.6+.15,s:Math.random()*.18+.025,p:Math.random()*6.28}));}
  function draw(){ctx.clearRect(0,0,width,height);for(const star of stars){star.p+=.012;star.y-=reduced?0:star.s; if(star.y<0)star.y=height;const alpha=star.a*(.72+.28*Math.sin(star.p));ctx.beginPath();ctx.arc(star.x,star.y,star.r,0,Math.PI*2);ctx.fillStyle=`rgba(164,205,255,${alpha})`;ctx.fill();}if(!reduced)raf=requestAnimationFrame(draw);}
  resize();draw();addEventListener('resize',()=>{cancelAnimationFrame(raf);resize();draw();});document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(raf);else if(!reduced)draw();});
})();
loadContent();
