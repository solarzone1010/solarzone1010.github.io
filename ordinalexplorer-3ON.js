function parenMatch(a,n,d,k=0){
  //console.log(a,n,d,k)
  p=d;
  i=n;
  while(p!=k){i+=d;p+=(a[i]=='[')?1:(a[i]==']')?-1:0}
  return i;
}
function repl(x,a,b){ // replaces a with b in x
  //console.log(x,a,b)
  if(x==''){return '';}
  if(x==a){return b;}
  if(x.at(-1)=='c'){return x;}
  let v=parenMatch(x,x.length-1,-1);
  let m=x.slice(v);
  let c=repl(x.slice(0,v),a,b);
  if(m==a){m=b;}
  else if(m.slice(1,-1)==a){m='['+b+']';}
  else{m='['+repl(m.slice(1,-1),a,b)+']';}
  return c+m;
}
function FS(a,n){
  function f(m,s,x){
    if(s.length==m.length){return x;}
    if(s.length==m.length+1){
      if(s.slice(1)==m){return s[0]+x;}
      return x+s.at(-1);
    }
    return s[0]+x+s.at(-1);
  }
  if(a==''){return'';}
  if(a.slice(-2)=='[]'){return a.slice(0,-2);}
  if(a=='L'){return n>2?'c['+'c'.repeat(n-1)+']':['','[]','c'][n];}
  let h=a;
  while(h.at(-1)==']'){h=h.slice(0,-1);}
  let j=1;
  while(h.at(-j)=='c'){j++;}
  j--;
  if(j==0){
    let x=a.lastIndexOf('[]')+1;
    let i=parenMatch(a,x,-1,1);
    let k=x+2==a.length?-1:parenMatch(a,x+2,-1);
    let b=a.slice(k+1,i)||'c';
    let c=b;
    let v=a.slice(i+1,x-1);
    var o=a.slice(0,i);
    let m=null
    console.log(v)
    for(let i=0;i<n;i++){
      console.log(b,c)
      let t=repl(v,b,c);
      o+='['+t+']';
      c+='['+t+']';
    }
  }
  else if(j==1){var o=h.slice(0,-1)+'[]'.repeat(n);}
  else{
    let i=h.length+1
    let d=''
    while(1){
      var v=(i==a.length)?-1:parenMatch(a,i,-1);
      d=a.slice(v+1,i);
      if(r(d)<'c'.repeat(j)){break;}
      i++;
      if(i==a.length+1){
        d='d';
        break;
      }
    }
    while(d.at(0)=='c'){d=d.slice(1);}
    while(d.at(-1)==']'){d=d.slice(0,-1);}
    d=d.slice(0,-1);
    if(d=='d'){
      o=''
    }
    else{
      o=h.slice(0,-1)+d.repeat(n);
    }
  }
  let l=o.split('[').length-o.split(']').length;
  if(l<0){console.log(`sus ${a}`);window.alert(`sus\nFS(${a},${n})\n${o} ${l}`)}
  o+=']'.repeat(l);
  //if(o[0]!='c'){console.log(`sus2 ${a}`);window.alert(`sus2\nFS(${a},${n})\n${o} ${l}`)}
  return o;
}  
function fancy(a,n){
  let s='';
  switch(n){
    case 0:{
      s=a.replaceAll(/c+/g,x=>(x.length==1)?'&omega;':(x.length==2)?'&Omega;':`&Omega;<sub>${x.length-1}</sub>`)
      s=s.replaceAll(/(\[|^)(\[])+/g,x=>'['.repeat(x.slice(0,2)=='[[')+(Math.floor(x.length/2)))
    }
  }
  return s;
}
function trueFancy(a,n){
  let m=fancy(a,n);
  let x=[0]
  if(x.includes(n)){if(a==[]){return'0';}return m;}
  return m;
}
function r(a){return a.replaceAll(']','!')}
function binary(a){
  a=a+'1';
  let x='';
  let y='L';
  let d='';
  for(let i of a){
    let t=0;
    while(r(FS(y,t))<=r(x)){t++;}
    d=FS(y,t);
    if(i=='0'){y=d;}
    else{x=d;}
    if(y.slice(-2)=='[]'){return'?';}
  }
  if(/^(\[])*$/.test(d)){d=d.slice(0,-2);}
  return d;
}
function click(a){
  const k=document.getElementById(a);
  let e=document.body.getElementsByTagName("*");
  let f=[];
  for(let i of e){f.push(i.id);}
  if(!(a+'1'in e)){
    const p=Number(k.style.marginLeft.slice(0,-2))+20
    a=a.slice(1);
    let x0=null;
    if(binary(a+'0')!='?'){
      x0=document.createElement('div');
      let q=trueFancy(binary(a+'0'),format);
      x0.innerHTML=q;
      x0.id='_'+a+'0';
      x0.style=`margin-left:${p}px`;
    }
    let x1=document.createElement('div');
    let q=trueFancy(binary(a+'1'),format);
    x1.innerHTML=q;
    x1.id='_'+a+'1';
    x1.style=`margin-left:${p}px`;
    if(binary(a+'0')!='?'){
      k.before(x0);
      k.after(x1);
      function F0(){click(x0.id);}
      x0.addEventListener('click',F0);
      function F1(){click(x1.id);}
      x1.addEventListener('click',F1);
    }
    else{
      k.after(x1);
      function F1(){click(x1.id);}
      x1.addEventListener('click',F1)}
  }
}
function expandAll(){
  let e=document.body.getElementsByTagName('div');
  let f=[];
  let g=[];
  for(let i of e){f.push(i.id);}
  for(let i of f){
    k=1;
    for(let j of f){if(j.slice(i.length)==i){k=0;}}
    if(k){g.push(i);}
  }
  for(let i of g){
    if(i!=''){click(i);}
  }
}
function changeFormat(){
  let example='[[][]][[]]';
  format=(format+1)%1;
  let e=document.body.getElementsByTagName('div');
  for(let i=0;i<e.length;i++){
    let q=trueFancy(binary(e[i].id.slice(1)),format);
    e[i].innerHTML=q;
  }
  let b=document.getElementById('changeFormat');
  b.innerHTML=`Change format<br>Current format: ${trueFancy(example,format)}`;
}
function clearList(){
  let e=document.body.getElementsByTagName('div');
  let f=[];
  for(let i of e){f.push(i.id);}
  for(let i of f){if(i!='_'){document.getElementById(i).remove();}}
}
function begin(){click('_');}
format=0;
