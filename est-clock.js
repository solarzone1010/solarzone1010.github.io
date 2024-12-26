let p=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59]
p=[...Array(60).keys()].filter(x=>!p.includes(x));
p=[...Array(43).keys()].map(x=>p[x]+x);
let r=new Date().getTime();
let n=1;
let t=new Date().getTime();

/*

00 01 02 03 04 05 06 07 08 09
   00    01          04
00    01    02 03 04    05 05

*/

function Q(d){ // find the next full EST hour after d in which there is no reversal of time
  d=new Astronomy.AstroTime(d);
  let f=Astronomy.SearchMoonPhase(180,d,-30).ut;
  let f1=Astronomy.SearchMoonPhase(180,d,30).ut;
  d=d.ut;
  if(d-f<1/6){d=f+1/6;}
  if(f1-d<1/24){d=f1+1/6;} // if a full moon will occur in <1h after d
  m=EST(d,1);
  m[5]=Math.floor(m[5]);
  if(m[3]>22){d+=(86640-3600*m[3]-60*m[4]-m[5])/86400;} // 24:00 is not a full hour
  d+=((3600-60*m[4]-m[5])%3600)/86400;
  d=Math.round(d*1440)/1440; // prevent rounding errors
  return d+103/1440; // 60+|non-prime numbers below 60|
}

function EST(d,k=0){ // k = 1 => "simplified" version to avoid infinite recursion
  if(typeof(d)=='number'){d=new Astronomy.AstroTime(d);}
  if(d.date){d=d.date;}
  let s=Object.values(Astronomy.Seasons(d)).map(x=>x.ut);
  let y=d.getUTCFullYear();
  d=new Astronomy.AstroTime(d);
  let m=d.ut+10945.5;
  let f=Astronomy.SearchMoonPhase(180,d,-30).ut;
  let f1=f+10945.5;
  let F=0;
  if(d.ut-f<1/6){
    m=2*f1-m;
    m+=1/3;
    F=1;
  }
  else{
    if(d.ut-f<1/3){F=2;}
    if(!k){
      s=s.map(Q);
      s1=s.filter(x=>(x<d.ut));
      if(s1.length<4){
        if(s[s1.length]-d.ut<103/1440){
          let h=Math.floor(102-1440*(s[s1.length]-d.ut));
          m-=p.filter(x=>x<=h).length/1440;
          if(p.includes(h)){F++;}
        }
      }
    }
  }
  s=s.filter(x=>(x<d.ut));
  m-=43/1440*(4*(y-1970)+s.length);
  m-=1/3*Math.round((f+10965.766913245843)/29.53058867)
  let R=[];
  m*=86400;
  R.push(Math.floor(m/31190400)+1970);
  R.push(Math.floor((m/2599200)%12+12)%12+1);
  R.push(Math.floor((m/86640)%30+30)%30+1);
  m=m%86640;
  R.push(Math.floor((m/3600)%24+24)%24+24*(m%86640>86400||(m%86640<0&&m%86640> -240)));
  R.push(Math.floor((m/60)%60+60)%60);
  R.push((m%60+60)%60);
  R.push(F);
  return R; // year, month, day, hour, minute, second, "fold" (number of times this time has been repeated)
            //  0      1     2    3      4       5       6
}

function update(){
  let g=new Date().getTime();
  let k=EST(new Date((g-r)*n+t));
  document.getElementById('time').innerHTML=`${k[3].toString().padStart(2,'0')}:${k[4].toString().padStart(2,'0')}:${Math.floor(k[5]).toString().padStart(2,'0')}<span style="font-size:50%">.${Math.floor(k[5]*10)%10}</span>`
  document.getElementById('date').innerHTML=`${k[0].toString().padStart(4,'0')}-${k[1].toString().padStart(2,'0')}-${k[2].toString().padStart(2,'0')}<span style="font-size:50%"> F${k[6]}</span>`
}

function update2(){
  let m=document.getElementById('settime').value;
  if(!m.includes('x')){m+='x1';}
  n=m.split('x')[1];
  m=m.split('x')[0].trimRight();
  r=new Date().getTime();
  if(m.toLowerCase()=='now'){
    t=new Date().getTime();
    return;
  }
  t=Date.parse(m);
}

update();
setInterval(update,20);