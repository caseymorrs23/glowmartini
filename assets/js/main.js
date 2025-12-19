(function(){
  const header = document.querySelector('header');
  const btn = document.querySelector('[data-nav-toggle]');
  if(btn){
    btn.addEventListener('click', () => header.classList.toggle('open'));
  }
  // Close menu when clicking a link
  document.querySelectorAll('nav a').forEach(a => {
    a.addEventListener('click', () => header.classList.remove('open'));
  });
})();


/* --- v5: Open/Closed status badge (America/Los_Angeles) --- */
(function(){
  const el = document.getElementById('openStatus');
  if(!el) return;

  // Hours in local (Bonney Lake) time
  // 0=Sun..6=Sat
  const HOURS = {
    0: { open: 11, close: 21 }, // Sunday 11a-9p
    1: null,                    // Monday closed (happy hour all day note handled elsewhere)
    2: { open: 15, close: 21 }, // Tue 3p-9p
    3: { open: 15, close: 21 }, // Wed
    4: { open: 15, close: 21 }, // Thu
    5: { open: 11, close: 23 }, // Fri 11a-11p
    6: { open: 11, close: 23 }, // Sat
  };

  function getPTNow(){
    const fmt = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Los_Angeles',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: false,
      weekday: 'short'
    });
    const parts = fmt.formatToParts(new Date()).reduce((a,p)=>{a[p.type]=p.value; return a;},{});
    // Build a Date in local time (not timezone accurate as Date), but we only need hour/min/day of week from parts
    const hour = parseInt(parts.hour,10);
    const minute = parseInt(parts.minute,10);
    // Map weekday string to index
    const wdMap = {Sun:0, Mon:1, Tue:2, Wed:3, Thu:4, Fri:5, Sat:6};
    const dow = wdMap[parts.weekday] ?? new Date().getDay();
    return { dow, hour, minute };
  }

  function formatTime(h){
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hr = ((h + 11) % 12) + 1;
    return `${hr}${ampm}`;
  }

  function findNextOpen(fromDow){
    for(let i=0;i<7;i++){
      const d = (fromDow + i) % 7;
      const rule = HOURS[d];
      if(rule){
        return { dow:d, open: rule.open };
      }
    }
    return null;
  }

  function update(){
    const now = getPTNow();
    const rule = HOURS[now.dow];
    const minutes = now.hour*60 + now.minute;

    // Closed all day (Mon)
    if(!rule){
      const next = findNextOpen((now.dow+1)%7);
      el.textContent = next ? `Closed • Opens ${formatTime(next.open)}` : 'Closed';
      return;
    }

    const openMin = rule.open*60;
    const closeMin = rule.close*60;

    if(minutes >= openMin && minutes < closeMin){
      el.textContent = 'Open Now';
    } else if(minutes < openMin){
      el.textContent = `Closed • Opens ${formatTime(rule.open)}`;
    } else {
      const next = findNextOpen((now.dow+1)%7);
      el.textContent = next ? `Closed • Opens ${formatTime(next.open)}` : 'Closed';
    }
  }

  update();
  // Refresh every 5 minutes
  setInterval(update, 5 * 60 * 1000);
})();

