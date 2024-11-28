function tuple(x){
  let y=new Date(x);
  return[y.getUTCFullYear(),y.getUTCMonth(),y.getUTCDate(),y.getUTCHours()*3600+y.getUTCMinutes()*60+y.getUTCSeconds()]
}
function number(x){
  let s='negative '.repeat(x<0);
  x=x>0?x:-x;
  let n=['','one','two','three','four','five','six','seven','eight','nine','ten',
         'eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
  let m=[,,'twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
  if(x<20){return s+n[x];}
  if(x<100){return s+m[parseInt(x/10)]+(x%10?'-'+n[x%10]:'');}
  if(x<1000){return s+n[parseInt(x/100)]+' hundred'+(x%100?' '+number(x%100):'');}
  if(x<1000000){return s+number(parseInt(x/1000))+' thousand'+(x%1000?' '+number(x%1000):'');}
  return s+x;
}
function monthlength(q,p){return[31,28,31,30,31,30,31,31,30,31,30,31][p]+(p==2&&(!(q%4)&&!(q%100))||!(q%400));}
function f(){
  let d1=document.getElementById('date1').value.split('-');
  let t1=document.getElementById('time1').value.split(':');
  if(t1.length==1){t1=[0,0,0];}
  if(d1[0]==''){d1=['-'+d1[1]].concat(d1.slice(2));}
  let d2=document.getElementById('date2').value.split('-');
  let t2=document.getElementById('time2').value.split(':');
  if(t2.length==1){t2=[0,0,0];}
  if(d2[0]==''){d2=['-'+d2[1]].concat(d2.slice(2));}
  if(d1[0].toLowerCase()=='now'){var n=new Date();}
  else{
    if(document.getElementById('utc1').checked){
      var n=new Date(Date.UTC(d1[0],Number(d1[1])-1,d1[2],t1[0],t1[1],t1[2]));
      n.setUTCFullYear(d1[0]);
    }
    else{
      var n=new Date(d1[0],Number(d1[1])-1,d1[2],t1[0],t1[1],t1[2]);
      n.setFullYear(d1[0]);
    }
  }
  if(d2[0].toLowerCase()=='now'){var r=new Date();}
  else{
    if(document.getElementById('utc2').checked){
      var r=new Date(Date.UTC(d2[0],Number(d2[1])-1,d2[2],t2[0],t2[1],t2[2]));
      r.setUTCFullYear(d2[0]);
    }
    else{
      var r=new Date(d2[0],Number(d2[1])-1,d2[2],t2[0],t2[1],t2[2]);
      r.setFullYear(d2[0]);
    }
  }
  n=tuple(n);
  r=tuple(r);
  let S=r[3]-n[3];
  if(S<0){
    S+=86400;
    r=tuple(new Date(Date.UTC(r[0],r[1],r[2],0,0,r[3])-86400e3));
  }
  let Y=r[0]-n[0];
  let M=r[1]-n[1];
  let D=r[2]-n[2];
  if(D<0){
    p=(r[1]+11)%12;
    q=r[0]-!p;
    if(monthlength(q,p)>=n[2]-1){D+=monthlength(q,p);}
    else{D+=n[2]-1;}
    M-=1;
  }
  if(M<0){M+=12;Y-=1;}
  let H=parseInt(S/3600);
  let L=parseInt((S%3600)/60);
  S=S%60;
  f='';
  if(Y){f+=number(Y)+' '+'year'+'s'.repeat(Y!=1)+', ';}
  if(M){f+=number(M)+' '+'month'+'s'.repeat(M!=1)+', ';}
  if(D&&(Y||M)){f+=number(D)+' '+'day'+'s'.repeat(D!=1)+', ';}
  else if(D){
    if(D>=7){f+=number(parseInt(D/7))+' '+'week'+'s'.repeat(D>13)+', ';}
    if(D%7>0){f+=number(parseInt(D%7))+' '+'day'+'s'.repeat(D%7!=1)+', ';}
  }
  if(H){f+=number(H)+' '+'hour'+'s'.repeat(H!=1)+', ';}
  if(L){f+=number(L)+' '+'minute'+'s'.repeat(L!=1)+', ';}
  if(S){f+=number(S)+' '+'second'+'s'.repeat(S!=1)+', ';}
  if(!f){f+='zero seconds, '}
  f=f.slice(0,-2);
  f=f[0].toUpperCase()+f.slice(1);
  document.getElementById('countdown').innerHTML=f;
}


setInterval(f,100)
