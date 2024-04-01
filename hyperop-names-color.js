// from https://naruyoko.github.io/tests/notation/psiletter/Q.html
// (slightly modified)
const ZERO=0;
const ONE={pow:ZERO,coef:1,add:ZERO};
const TWO={pow:ZERO,coef:2,add:ZERO};
const OMEGA={pow:ONE,coef:1,add:ZERO};
const colors = [,'#0000ff','#00d800','#ff0000','#00c0ff','#e0d000','#ff00ff','#8000ff','#7800c0'];
let apos='’'
apos+='​'
function add(a,b){
  if(a===ZERO){return b;}
  if(a.add==ZERO){return {pow:a.pow,coef:a.coef,add:b};}
  else{return {pow:a.pow,coef:a.coef,add:add(a.add,b)};}
}

function lastTerm(a){
  if(a===ZERO){return a;}
  if(a.add===ZERO){return a;}
  return lastTerm(a.add);
}

function colorize(x,c){
  return `<span style="color:${colors[c]}">${x}</span>`;
}

function parseOrdinal(s,index,allowLowPriorityOperations){
  if (index===undefined) index=0;
  if (allowLowPriorityOperations===undefined) allowLowPriorityOperations=true;
  var quit=false;
  var ord=ZERO;
  while (!quit&&index<s.length){
    /** @type {Ordinal} */
    var pow;
    /** @type {number} */
    var coef;
    if (s[index]=="w"||s[index]=="ω"){
      if (s[index+1]=="^"){
        if (s[index+2]=="("||s[index+2]=="{"){
          var result=parseOrdinal(s,index+3,true);
          if (result===null) return null;
          pow=result[0];
          index=result[1];
        }else{
          var result=parseOrdinal(s,index+2,false);
          if (result===null) return null;
          pow=result[0];
          index=result[1];
        }
      }else{
        pow=ONE;
        index++;
      }
      if (allowLowPriorityOperations&&s[index]=="*"){
        index++;
        var coefstart=index;
        while ("0123456789".indexOf(s[index])!=-1) index++;
        coef=parseInt(s.substring(coefstart,index));
      }else coef=1;
    }else if ("0123456789".indexOf(s[index])!=-1){
      pow=ZERO;
      var coefstart=index;
      while ("0123456789".indexOf(s[index])!=-1) index++;
      coef=parseInt(s.substring(coefstart,index));
    }
    if (ord instanceof Object||ord===0) ord=add(ord,{pow:pow,coef:coef,add:ZERO});
    if (allowLowPriorityOperations&&index<s.length){
      if (s[index]==")"||s[index]=="}"){
        index++;
        quit=true;
      }else if (s[index]=="+") index++;
      else return null;
    }else quit=true;
  }
  return [ord,index];
}

function _add(c,p,q){
  if(!c.match(/<span/)){return p+c+q;}
  return c.slice(0,28)+p+c.slice(28,-7)+q+'</span>'
}

function prefix(n,m){
  let v=''
  let w=''
  let o=''
  if(m==0){
    let X=['','hen','di','tri','tetr','pent','hex','hept','oct','enne'];
    let Y=['','dec','icos','triacont','tetracont','pentacont','hexacont','heptacont','octacont','enneacont'];
    let Z=['','hect','dicos','tricos','tetracos','pentacos','hexacos','heptacos','octacos','enneacos'];
    if(n>99){
      if(n%100==2){return 'do'+Z[Math.floor(n/100)];}
      if(n%100==3){return 'tri'+Z[Math.floor(n/100)];}
      return prefix(n%100,0)+Z[Math.floor(n/100)];
    }
    if(n<10){return X[n];}
    if(n==23){return 'trecos'}
    if(n%10==2){return 'do'+Y[Math.floor(n/10)];}
    if(n%10==3){return 'tri'+Y[Math.floor(n/10)];}
    if(n>21&&n<29){return X[n%10]+'ecos';}
    return X[n%10]+(((n>10&&n<20)||(n%10>0))?'a':'')+Y[Math.floor(n/10)];
  }
  if(m==1){
    m--;
    let X=['','kal','mej','gij','ast','lun','ferm','jov','sol','bet','gloc','gax','sup','vers','mult','met','xev','hyp','omniv','out'];
    let Y=['','','barr','gic','asc','luc','ferc','joc','solc','bec'];
    let Z=['','cet','mejet','git','aset','lut','fert','jovt','solt','bect'];
    if(n>99){
      if(n>129&&n<200){v=prefix(n%100,1).slice(28,-8)+Z[Math.floor(n/100)];}
      else{v=prefix(n%100,1).slice(28,-7).replace('barr','bar')+Z[Math.floor(n/100)];}
    }
    else if(n<20){v=X[n];}
    else if(n>39&&n<50){v=X[n%10]+'asc';}
    else{v=X[n%10].slice(0,-1)+Y[Math.floor(n/10)];}
  }
  else{
    m--;
    let X=['','hep','ott','net','det','unt','ent','fit','syt','bront'];
    let Y=['','gep','am','hap','kir','pij','sag','pec','nis','zot'];
    let Z=['','alf','bex','gam','del','thet','yot','kap','lamb','sig'];
    if(m>99){
      if(m==102){v='otalp';}
      else if(m%100==0){v=Z[Math.floor(m/100)]}
      else if(m%100==2){v='o'+Z[Math.floor(m/100)]}
      else if(m<200){v=prefix(1,m%100+1).slice(28,-7)+Z[Math.floor(m/100)];}
      else{v=prefix(1,m%100+1).slice(28,-8)+Z[Math.floor(m/100)];}
    }
    else if(m<10){v=X[m];}
    else if(m==22){v='otam';}
    else if(m%10==2){v='o'+Y[Math.floor(m/10)];}
    else if(m>19&&m<30){v=X[m%10]+'am';}
    else{v=X[m%10].slice(0,-1)+Y[Math.floor(m/10)];}
    if(n>1){w=prefix(n,1).slice(28,-7)+(m%10==6?'i':'e');}
  }
  if(m<5){o=colorize(w+v,m+1);}
  else if(m>=6&&w){o=colorize(w,6)+colorize(v,7);}
  else{o=colorize(v,7);}
  return o;
}

function leftNF(a){
  if(a===ZERO){return [];}
  return [[a.coef,a.add]].concat(leftNF(a.pow));
}

function toString(a){
  if(a===ZERO){return '0';}
  if(a.pow===ZERO){return a.coef.toString();}
  let m='';
  if(a.pow===ONE){m='ω';}
  else if(a.pow.pow===ZERO||(a.pow.coef===1&&a.pow.add===ZERO)){m=`ω^${toString(a.pow)}`;}
  else{m=`ω^(${toString(a.pow)})`}
  if(a.coef>1){
    if(a.pow===ONE){m+=a.coef;}
    else{m+='*'+a.coef;}
  }
  if(a.add!=ZERO){m+='+'+toString(a.add);}
  return m;
}

function toHTML(a,n=2){
  if(!n){return toString(a);}
  if(a===ZERO){return '0';}
  if(a.pow===ZERO){return a.coef.toString();}
  let m='';
  if(a.pow===ONE){m='ω';}
  else{m=`ω<sup>${toHTML(a.pow,n-1)}</sup>`;}
  if(a.coef>1){m+=a.coef;}
  if(a.add!=ZERO){m+='+'+toHTML(a.add,n);}
  return m;
}

function suffix(_m){
  if(_m==0){return colorize('o',1);}
  if(_m==1){return colorize('ik',2);}
  if(_m==2){return colorize('ihek',3);}
  if(_m==3){return colorize('ok',4);}
  if(_m>3){return colorize('i'+prefix(0,_m).slice(28,-8)+'k',(_m<5)?_m+1:8);}
}

function name(a,t=0){
  if(typeof(a)!='object'){a=parseOrdinal(a.toString())[0];}
  let A=leftNF(a);
  let x='_'
  let m=0;
  let r=[];
  for(let i=0;i<A.length;i++){
    if(A[i][0].toString=='1,0'){continue;}
    let y='_'
    let l=''
    if(i+1==A.length||A[i][0]>1){
      let z=A.slice(i+1,-1).map(x=>(x[0])).every(x=>(x==1))?'':apos
      if(A.length==1&&[2,3].includes(A[i][0])&&i+t==0){z='a'+z;}
      if(A[i][0]==2&&i+t==0){y=`di${z}_`;}
      else if(A[i][0]==3&&i+t==0){y=`tri${z}_`;}
      else{y=_add(prefix(A[i][0],i+t),'','a'+z)+'_'};
    }
    if(A[i][1]!=ZERO){y+=(i==A.length-2?'':'-')+name(A[i][1],i+t);}
    let p=toString(lastTerm(A[i][1])).includes('ω')||(A[i][1]==0)
//    let q=false;
//    if(i>0){if(A[i-1][1]!=ZERO){q=true;}}
    if(i!=A.length-1&&m<i&&p&&A[m][1]!=ZERO&&!r.includes(m)){
      r.push(m);
      let _m=m+t;
      y+='['+_m+']'
    }
    x=x.replace('_',y);
    if(toString(lastTerm(A[i][1]))!='0'){m=i;}
  }
  x=x.replace('_','');
  x=x.replaceAll(/a<\/span>\[\d+]/g,x=>'</span>'+suffix(Number(x.slice(9,-1))))
  return x;
}

function hyperop(a){
  if(typeof(a)!='object'){a=parseOrdinal(a.toString())[0];}
  if(toString(a)=='1'){return 'addition';}
  if(toString(a)=='2'){return 'multiplication';}
  if(toString(a)=='3'){return 'exponentiation';}
  if(a.pow==ZERO){return prefix(parseInt(toString(a)),0)+'ation';}
  return name(a)+'tion';
}

function hyperop_(a){
  let x=hyperop(a);
  return x;
}

function calculate(){
  document.getElementById('output2').innerHTML=`[${toHTML(parseOrdinal(document.getElementById('input').value)[0])}] is called`
  document.getElementById('output').innerHTML=hyperop_(document.getElementById('input').value);
}
document.getElementById('input').value='w^w^(w+1)+1'
calculate();
