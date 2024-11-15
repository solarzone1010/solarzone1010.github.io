
function update(){
  let X=new Date();
  let time=X.getTime();
  let tt=new Astronomy.AstroTime(X).tt;
  let obs=new Astronomy.Observer(Number(document.getElementById('la').value),Number(document.getElementById('lo').value),0);
  let Y=Astronomy.Equator('Sun',X,obs,false,true);
  let Z=Astronomy.Horizon(X,obs,Y.ra,Y.dec).altitude;
  let r0=Astronomy.SearchAltitude('Sun',obs,-1,X,-10000,0);
  let r6=Astronomy.SearchAltitude('Sun',obs,1,r0,10000,0);
  while(tt<r6.tt&&-90+180*(tt-r0.tt)/(r6.tt-r0.tt)<0){
    r0=Astronomy.SearchRiseSet('Sun',obs,-1,r0,-10000,0);
    r6=Astronomy.SearchRiseSet('Sun',obs,1,r0,10000,0);
  }
  let r18=Astronomy.SearchAltitude('Sun',obs,-1,r6,10000,0);
  let r30=Astronomy.SearchAltitude('Sun',obs,1,r18,10000,0);
  [r0,r6,r18,r30]=[r0.tt,r6.tt,r18.tt,r30.tt];
  let c;
  if(tt<r6){Z=-90+180*(tt-r0)/(r6-r0);c=.5/(r6-r0);}
  else if(tt<r18){Z=90+180*(tt-r6)/(r18-r6);c=.5/(r18-r6);}
  else if(tt<r30){Z=270+180*(tt-r18)/(r30-r18);c=.5/(r30-r18);}
  let D0=Astronomy.AstroTime.FromTerrestrialTime(r0).AddDays(Number(document.getElementById('lo').value)/360).toString().slice(0,-14);
  let D6=Astronomy.AstroTime.FromTerrestrialTime(r6).AddDays(Number(document.getElementById('lo').value)/360).toString().slice(0,-14);
  let D12=Astronomy.AstroTime.FromTerrestrialTime(r18).AddDays(Number(document.getElementById('lo').value)/360).toString().slice(0,-14);
  let D18=Astronomy.AstroTime.FromTerrestrialTime(r30).AddDays(Number(document.getElementById('lo').value)/360).toString().slice(0,-14);
  let Da=null;
  if(D0==D6&&D6==D12){Da=D0;}
  else if(D6==D12&&D12==D18){Da=D6;}
  else if(D0==D6){Da=D0;}
  else if(D6==D12){Da=D6;}
  else if(D12==D18){Da=D12;}
  else{Da=D0}
  let h=parseInt(Z/15);
  let m=parseInt((Z/15*60)%60);
  let s=parseInt((Z/15*3600)%60);
  let f=parseInt((Z/15*3600000)%1000);
  document.getElementById('time').innerHTML=(`${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}<span style="font-size:50%">.${f.toString().padStart(3,'0')}</span>`);
  document.getElementById('date').innerHTML=`${Da} <span style="font-size:50%">(${c.toFixed(3)}s/s)</span>`;
}

setInterval(update,17);