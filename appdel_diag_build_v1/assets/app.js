
document.addEventListener('DOMContentLoaded',()=>{
  const hamb=document.querySelector('.hamb');
  const links=document.querySelector('.navlinks');
  if(hamb && links){ hamb.addEventListener('click', ()=> links.classList.toggle('open')); }
  const io=new IntersectionObserver(es=>{
    es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('on'); io.unobserve(e.target); } });
  },{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
});
