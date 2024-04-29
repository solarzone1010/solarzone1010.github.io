const count=(x)=>(x.match(/\(/g)||[]).length-(x.match(/\)/g)||[]).length;

function unabbreviate(x){ // removes sugar
  let y=x;
  y=y.replaceAll('_','');
  y=y.replaceAll('x','χ')
  y=y.replaceAll('ψ1','P');
  y=y.replaceAll('χ','P');
  y=y.replaceAll('ψ','psi');
  y=y.replaceAll('c','P(0)');
  y=y.replaceAll('W','Ω');
  y=y.replaceAll('Ω','p(P(0))');
  y=y.replaceAll('ω','w');
  y=y.replaceAll('psi','p');
  y=y.replaceAll('L','p(P(P(0)))');
  y=y.replaceAll('R','p(P(P(0)+P(0)))');
  y=y.replaceAll('J','p(P(P(P(0))))');
  y=y.replaceAll('I','p(P(d))');
  y=y.replaceAll('d','p(P(P(0))+P(0))');
  y=y.replaceAll('w','p(1)')
  y=y.replaceAll(/[1-9]\d*/g,p=>{return 'p(0)+'.repeat(Number(p)).slice(0,-1)});
  return y;
}

function abbreviate(x){
//  if(x[0]=='P'){
//    if(x=='P(0)'){return 'Ω';}
//    //...
//  }
  x=x.replaceAll('p(0)','1');
  x=x.replaceAll('p(1)','ω');
  x=x.replaceAll(/(1\+)+1/g,p=>((p.length+1)/2).toString());
  x=x.replaceAll('p(P(0))','Ω');
  x=x.replaceAll('p(P(P(0)))','L');
  x=x.replaceAll('p(P(P(0)+P(0)))','R');
  x=x.replaceAll('p(P(p(P(P(0))+P(0))))','I');
  x=x.replaceAll('p(P(P(0))+P(0))','d');
  x=x.replaceAll('p(P(P(P(0))))','J');
  x=x.replaceAll('P(0)','c');
  x=x.replaceAll('P','χ');
  x=x.replaceAll('p','ψ');
  return x;
}

function op(x){
  if(lt(x,'p(p(0))')){return false;}
  let f=(x[0]=='p')?`p(${sua(arg(x))[0]})`:'P(0)';
  let g=null;
  let h=null;
  if(f=='p(0)'){f='p(p(0))';g=log(x);h=exp(g);}
  else{g=div(log(x),f);h=exp(mul(f,g))}
  let c=div(x,h);
  let d=sub(x,mul(h,div(x,h)));
  if(d!='0'){return true;}
  return false;
}

function HTML(x){
  //console.log(x);
  if(x+''=='Infinity'){return 'c';}
  if(x=='0'){return '0';}
  if(/^(p\(0\)\+)*p\(0\)$/.test(x)){return ((x.length+1)/5).toString();}
  let f=(x[0]=='p')?`p(${sua(arg(x))[0]})`:'P(0)';
  let g=null;
  let h=null;
  if(f=='p(0)'){f='p(p(0))';g=log(x);h=exp(g);}
  else{g=div(log(x),f);h=exp(mul(f,g))}
  let c=div(x,h);
  let d=sub(x,mul(h,div(x,h)));
  //console.log(f,g,h,'',c,d);
  if(c=='p(0)'&&d=='0'){
    if(exp(x)!=x){
      if(x=='p(p(0))'){return 'ω';}
      if(lt(x,'p(P(0))')){return `ω<sup>${HTML(log(x))}</sup>`;}
      return `${HTML(f)}<sup>${HTML(g)}</sup>`
    }
    if(x=='P(0)'){return 'c';}
    let m=div(log(lastTerm(arg(x))[1]),'P(0)');
    let k=exp(mul('P(0)',div(log(lastTerm(arg(x))[1]),'P(0)')));
    k=div(arg(x),k);
    //console.log(arg(x),k,m)
    k=sua(k);
    t=exp(add(mul('P(0)',m),'P(0)'));
    let l=null;
    if(k[0]=='0'){l='0';}
    else{l='p('+mul(exp(mul('P(0)',m)),k[0])+')';}
    let r='p('+mul(exp(mul('P(0)',m)),add(k[0],'P(0)'))+')';
    let [a,b]=split(k[1],r);
    a='p('+mul(exp(mul('P(0)',m)),a)+')'
    //console.log(k,r,l,a,b)
    if(a=='p(0)'){a='0';}
    l=add(l,add(a,b))
    let s=''
    if(lastTerm(arg(x))[1][0]=='P'&&b!='0'){
      if(m=='p(0)'){s='Ω';}
      if(m=='p(0)+p(0)'){s='L';}
      if(m=='p(0)+p(0)+p(0)'){s='R';}
      if(m=='P(0)'){s='J';}
      if(s==''){return `ψ(${HTML(arg(x))})`;}
      if(l=='p(0)'){return s;}
      return `${s}<sub>${HTML(l)}</sub>`;
    }
    return `ψ(${HTML(arg(x))})`;
  }
  let a=HTML(h);
  //console.log(f,h,c,d)
  if(c!='p(0)'){
    if(!op(c)){a+=HTML(c)}
    else{a+=`&sdot;(${HTML(c)})`;}
  }
  if(d!='0'){a+='+'+HTML(d);}
  return a;
}

function paren(x,n){
  console.log()
  let q=x[n]=='('?1:-1;
  let i=n;
  let t=0;
  while(1){t+=(x[i]=='('?1:x[i]==')'?-1:0);if(!t){break;};i+=q;}
  return i;
}

function firstTerm(x){
  console.log()
  let m=paren(x,1);
  return[x.slice(0,m+1),x.slice(m+2)||'0'];
}

function lastTerm(x){
  console.log()
  let m=paren(x,x.length-1);
  return[x.slice(0,m-2)||'0',x.slice(m-1)];
}

function terms(x){
  console.log()
  if(x=='0'){return [];}
  return[firstTerm(x)[0]].concat(terms(firstTerm(x)[1]));
}

function trim(s){while(s[s.length-1]==')'){s=s.slice(0,-1);}return s;}

function arg(x){
  console.log()
  return firstTerm(x)[0].slice(2,-1);
}

function lt(x,y){
  console.log()
  if(y=='0'){return false;}
  if(x=='0'){return true;}
  if(x[0]=='p'&&y[0]=='P'){return true;}
  if(x[0]=='P'&&y[0]=='p'){return false;}
  if(arg(x)!=arg(y)){return lt(arg(x),arg(y));}
  return lt(firstTerm(x)[1],firstTerm(y)[1]);
}

function expW(x){
  console.log()
  if(lt(x,'P(0)')){return'0';}
  x=arg(x);
  let y='';
  while(lt('P(0)',firstTerm(x)[0])||(firstTerm(x)[0]=='P(0)')){
    y+=firstTerm(x)[0]+'+';
    x=firstTerm(x)[1];
  }
  if(lt(y.slice(0,-1)||'0','P(p(0))')){y='P(0)+'+y;}
  return y.slice(0,-1);
}

function lv(x){return expW(lastTerm(arg(x)).at(-1));}

function fix(s){while(count(s)){s+=')';}return s;}
function trim(s){while(s.at(-1)==')'){s=s.slice(0,-1);}return s;}

function root1(x){
  let i=trim(x).length+1;
  let c=undefined;
  while(1){
    c=paren(x,i)
    if(lt(x.slice(c-1,i+1),'P(0)')){break;}
    i++;
    if(i==x.length){return undefined;}
  }
  console.log();
  let v=lv(x.slice(c-1,i+1));
  let p=c;
  let q=i;
  let m=c;
  let n=i;
  i++;
  if(i>=x.length){return undefined;}
  while(1){
    c=paren(x,i);
    if(x[c-1]=='p'){
      let l=lv(x.slice(c-1,i+1));
      if(lv(x.slice(m-1,n+1))=='0'){m=p;n=q;break;}
      if(lt(l,v)){break;}
      m=c;
      n=i;
    }
    i++;
    if(i==x.length){return undefined;}
  }
  return [n,x.slice(m-1,n+1)]
}

function root2(x){
  console.log();
  if(root1(x)===undefined){return undefined;}
  let y=root1(x)[1];
  let i=root1(x)[0];
  let k=[i,y];
  let c=null;
  let z=null;
  //console.log(x);
  while(1){
    if(i==x.length){return undefined;}
    c=paren(x,i);
    if(lt(x.slice(c-1,i+1),y)){z=[i,x.slice(c-1,i+1)];break;}
    i++;
  }
  let m=paren(x,i);
  let s=lv('p('+x.slice(m+1,i)+')');
  //console.log(s)
  s=s=='0'?'P(0)':`P({add(sub(s,'P(0)'),'P(0)')})`
  let [p,q]=split(x.slice(m+1,i),s);
  p=findall(p);
  let u='0'
  for(let i of p){
    if(lt(u,i)){u=i;}
  }
  let j=paren(x,i);
  //console.log(z)
  i--;
  while(1){
    m=paren(x,i);
    //console.log(m);
    if(x[m-1]=='p'){
      c=paren(x,i+1);
      z=[i,split(x.slice(c+1,i+1),'P(0)')[1]];
      break;
    }
    i--;
  }
  //console.log(p,q)
  if((!lt(u,q))&&(p.length>0)){
    let v=k[0]-k[1].length;
    let t=x.slice(j-1,v+1);
    t+='P(0)';v+=4;
    return [v,t];
  }
  return z;
}

function fs(x,n){
  if(x=='0'){return x;}
  let y=x;
  let m=paren(x,x.length-1);
  let d=x.slice(m-1);
  if(d=='p(0)'){return x.slice(0,m-2);}
  x=trim(x);
  let o=''
  //console.log(x);
  if(x.at(-3)=='p'){
    x+='))';
    let k=paren(x,x.length-1);
    let z=x.slice(k-1,-5)+')';
    o=x.slice(0,k-1)+('+'+z).repeat(n+1);
  }
  else{
    if(y=='P(0)'||lt('P(0)',y)){
      let b=trim(x).slice(0,-3);
      o=b+'p('+'P('.repeat(n);
    }
    else{
      let r=root2(y);
      if(r==undefined){
        let b=trim(x).slice(0,-3);
        o=b+'p('+'P('.repeat(n);
      }
      else{
        let b=trim(x.slice(r[0]-r[1].length+1,r[0])).slice(0,-3);
        o=x.slice(0,r[0]-r[1].length+1)+b.repeat(n);
      }
    }
  }
  o=fix(o).replaceAll('+)',')').replaceAll('(+','(').replaceAll('++','+').replaceAll('()','(0)');
  if(o[0]=='+'){o=o.slice(1);}
  o=o||'0';
  return o;
}

//=========================

function add(x,y){
  if(x=='0'){return y;}
  if(y=='0'){return x;}
  if(lt(firstTerm(x)[0],firstTerm(y)[0])){return y;}
  let z=firstTerm(x)[0]
  let w=add(firstTerm(x)[1],y);
  if(w!='0'){return z+'+'+w;}
  return z;
}

function sub(x,y){
  if(x=='0'){return '0';}
  if(y=='0'){return x;}
  if(lt(firstTerm(y)[0],firstTerm(x)[0])){return x;}
  return sub(firstTerm(x)[1],firstTerm(y)[1]);
}

function sua(x){return split(x,'P(0)');}

function exp(a){
  if(a[0]=='P'){return `P(${sub(a,'P(0)')})`;}
  if(lt(a,'p(p(P(0)))')){return `p(${a})`;}
  let [x,y]=sua(arg(a));
  let p=split(y,`p(${add(x,'P(0)')})`)[0];
  return 'p('+add(x,add(p,sub(a,'p('+add(x,p)+')')))+')';
}

function log(a){
  if(a=='0'){return [];}
  if(a[0]=='P'){return add('P(0)',arg(a));}
  let [x,y]=sua(arg(a));
  let [p,q]=split(y,`p(${add(x,'P(0)')})`);
  if(x=='0'&&p=='0'){
    return q;
  }
  let m=add(`p(${add(x,p)})`,q);
  return m;
}

function div(a,b){ // only works when b is a.p.
  if(lt(a,b)){return '0';}
  return add(exp(sub(log(a),log(b))),div(firstTerm(a)[1],b));
}

function mul(a,b){ // only works when a is a.p.
  if(b=='0'){return '0';}
  return add(exp(add(log(a),log(b))),mul(a,firstTerm(b)[1]))
}

function split(a,x){
  if(a=='0'){return ['0','0'];}
  if(lt(a,x)){return ['0',a];}
  if(lt(firstTerm(a)[0],x)){return ['0',a];}
  return [add(firstTerm(a)[0],split(firstTerm(a)[1],x)[0]),split(firstTerm(a)[1],x)[1]];
}

function findall(a){
  if(a=='0'){return [];}
  let [p,q]=split(a,'P(0)');
  return terms(p).map(arg).map(findall).flat().filter(x=>x!='0').concat([q].filter(x=>x!='0'));
}

//=========================

function tfs(a,n){
  if(count(a)!=0){return 'Invalid expression';}
  return HTML(fs(unabbreviate(a),n));
}

function executecommand(x){
  if(x==''){return null;}
  let c=x.split(' ')
  if(c[0]=='fs'){return HTML(fs(unabbreviate(c[1]),Number(c[2])));}
  if(c[0]=='lt'){return lt(unabbreviate(c[1]),unabbreviate(c[2]));}
  return 'Unknown command.';
}

function HTMLcommand(x){
  if(x==''){return '';}
  let c=x.split(' ')
  if(c[0]=='fs'){return `fs<br>${HTML(unabbreviate(c[1]))} ${c[2]}`;}
  if(c[0]=='lt'){return `lt ${HTML(unabbreviate(c[1]))} ${HTML(unabbreviate(c[2]))}`;}
  return x;
}

function executecommands(x){
  x=x.split('\n');
  y=''
  for(let i of x){
    y+='<span style="color:#999">'+HTMLcommand(i)+'</span><br>\n'
    let k=executecommand(i);
    y+=(k==null)?'':k;
    y+='<br>\n<br>\n';
  }
  return y;
}

function calculate(){
  document.getElementById('output').innerHTML=executecommands(document.getElementById('input').value);
}
