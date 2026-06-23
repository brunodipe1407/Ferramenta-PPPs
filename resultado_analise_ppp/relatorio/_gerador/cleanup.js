// remove elementos exclusivamente de interface (nao-conteudo)
(function(){
  const kill = ['.btn-add','.btn-del','.ch-toggle','button','.header-actions','.status-bar',
    '.statusbar','#sb-status','.note-bar','.toolbar','.tabbar','[role="tablist"]','.hp-form-toggle',
    '[class*="-actions"]','.lock-badge','[class*="lockHint"]','.sync-hint',
    '[class*="toast"]','[class*="snack"]','[class*="notif"]','[class*="-float"]',
    '.progress-bar','.filter-bar','.report-controls','.btn-row'];
  kill.forEach(s=>document.querySelectorAll(s).forEach(e=>e.remove()));
  // selects: troca pelo texto da opcao selecionada (remove aparencia de campo)
  document.querySelectorAll('select').forEach(sel=>{
    const span=document.createElement('span'); span.textContent = sel.options[sel.selectedIndex]?sel.options[sel.selectedIndex].text:'';
    span.className='__val'; sel.replaceWith(span);
  });
  // inputs: troca pelo valor (texto)
  document.querySelectorAll('input').forEach(inp=>{
    if(inp.type==='checkbox'||inp.type==='radio'){ if(!inp.checked) inp.closest('label')?.remove(); return; }
    const span=document.createElement('span'); span.textContent=inp.value||''; span.className='__val'; inp.replaceWith(span);
  });
  // textareas: troca pelo conteudo
  document.querySelectorAll('textarea').forEach(t=>{
    const div=document.createElement('div'); div.textContent=t.value||''; div.className='__val'; t.replaceWith(div);
  });
})();
