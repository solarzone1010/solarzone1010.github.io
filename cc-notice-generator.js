function X(t){ // day number as from 2000-01-01 00:00+0800
  return Math.floor(t.ut+5/6);
}

function newyear(y){
  let x=new Date(Date.UTC(2000,0,1,0,0,0));
  x.setUTCFullYear(y);
  x.setUTCHours(-8);
  return x;
}

function calcSui(y){
  let r0=Astronomy.Seasons(y).dec_solstice;
  let r1=Astronomy.Seasons(y+1).dec_solstice;
  let dong0=Astronomy.SearchMoonPhase(0,r0,-30); // edge cases - if winter before new moon but on same day
  let dong0r=Astronomy.SearchMoonPhase(0,r0,30);
  let dong1=Astronomy.SearchMoonPhase(0,r1,-30);
  let dong1r=Astronomy.SearchMoonPhase(0,r1,30);
  if(X(r0)==X(dong0r)){dong0=dong0r;}
  if(X(r1)==X(dong1r)){dong1=dong1r;}
  const M=[11,12,1,2,3,4,5,6,7,8,9,10];
  if(dong1.ut-dong0.ut<360){
    let s={};
    for(let i of M){
      s[i]=[dong0];
      dong0=Astronomy.SearchMoonPhase(0,dong0.AddDays(1),30);
    }
    return s;
  }
  let zhongqi=[...Array(12).keys()].map(x=>(x*30+270)%360).map(x=>Astronomy.SearchSunLongitude(x,dong0,366));
  let shuo=[];
  while(dong1.ut-dong0.ut>1){
    shuo.push(dong0);
    dong0=Astronomy.SearchMoonPhase(0,dong0.AddDays(1),30);
  }
  shuo.push(dong0);
  let r;
  for(let i=0;i<13;i++){
    let m=zhongqi.filter(x=>X(x)>=X(shuo[i])&&X(x)<X(shuo[i+1]));
    if(!m.length){r=i;break;}
  }
  r=r?r:12;
  let s={};
  for(let i of [...Array(13).keys()].filter(x=>x!=r)){
    if(i+1!=r){s[M[i-(i>r)]]=[shuo[i]];}
    else{s[M[i]]=[shuo[i],shuo[i+1]];}
  }
  return s;
}

function calcYear(y){
  let nian={};
  let M=calcSui(y-1);
  let N=calcSui(y);
  for(let i=1;i<11;i++){nian[i]=M[i];}
  nian[11]=N[11];
  nian[12]=N[12];
  return nian;
}


function hou(y){
  //console.log(y);
  let m=[Astronomy.SearchSunLongitude(0,newyear(y),150)]
  if(m[0]==null){m[0]=hou(y-1)[0].AddDays(365.2422);}
  for(let i=1;i<72;i++){
    m.push(Astronomy.SearchSunLongitude(5*i,m.at(-1),6))
    if(m.at(-1)==null){
      m.pop();
      m.push(hou(y-1)[i].AddDays(365.2422)); // approximate
    }
    if(m.at(-1).ut>=new Astronomy.AstroTime(newyear(y+1)).ut){
      m.pop();
      m.push(Astronomy.SearchSunLongitude(5*i,newyear(y),366));
    }
    if(m.at(-1)==null){
      m.pop();
      m.push(hou(y-1)[i].AddDays(365.2422)); // approximate
    }
    else if(m.at(-1).ut>=new Astronomy.AstroTime(newyear(y+1)).ut){
      m.pop();
      m.push(hou(y-1)[i].AddDays(365.2422)); // approximate
    }
  }
  return m;
}

function assign(x){
  return [...Array(x.length).keys()].map(i=>[x[i],i])
}

function convertToChinese(x){
  let d=X(x);
  let y=new Date(Date.UTC(2000,0,d+1,0,0,0)).getUTCFullYear();
  let C0=calcYear(y-1);
  let C1=calcYear(y);
  let l,m;
  let k=0;
  if(d<X(C1[1][0])){
    for(ii=12;ii>0;ii--){
      for(jj=C0[ii].length-1;jj>=0;jj--){
        if(X(C0[ii][jj])<=d){k=1;break;}
      }
      if(k){break;}
    }
    m=d-X(C0[ii][jj])+1;
    l=jj+C0[ii].length-1;
  }
  else{
    for(ii=12;ii>0;ii--){
      for(jj=C1[ii].length-1;jj>=0;jj--){
        if(X(C1[ii][jj])<=d){k=1;break;}
      }
      if(k){break;}
    }
    m=d-X(C1[ii][jj])+1;
    l=jj+C1[ii].length-1;
  }
  return [ii,l,m];
}

function ordinal(x){
  let n=['','first','second','third','fourth','fifth','sixth','seventh','eighth','ninth','tenth',
         'eleventh','twelfth','thirteenth','fourteenth','fifteenth','sixteenth','seventeenth','eighteenth','nineteenth'];
  let m=[,,'twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
  if(x<20){return n[x];}
  if(x<100&&x%10){return m[parseInt(x/10)]+'-'+n[x%10];}
  return m[x/10].slice(0,-1)+'ieth';
}

function shortOrdinal(x){
  return x+(x%100<10||x%100>19?'thstndrdthththththth'.slice(x%10*2,x%10*2+2):'th');
}

function formatChinese(x,s){
  let o=(s?shortOrdinal:ordinal);
  return `the ${o(x[2])} day of the ${x[1]?o(x[1])+' ':''}${o(x[0])} month`
}

function formatChinese2(x){
  let o=shortOrdinal;
  return `${o(x[2])} of ${x[1]?o(x[1])+' ':''}${o(x[0])}`
}

//function ganzhi(x){
//  let S='甲乙丙丁戊己庚辛壬癸';
//  let B='子丑寅卯辰巳午未申酉戌亥';
//  return S[x%10]+B[x%12];
//}

function table(x){
  let t='<table>';
  //t+=['<b>公历</b>','','<b>农历</b>','<b>廿四节气</b>','<b>七十二候</b>']
  t+='<tr><td><b>Date to be sent</b></td><td><b>Content</b></td></tr>'
  for(let i of x){
    t+='<tr class="border">';
    for(let j of i){
      let style='';
//      if(j[1]=='*'){style+="color:#f00;";j=j.slice(2);}
//      else if(j[0]=='*'){style+="color:#00f;";j=j.slice(1);}
//      if(j[10]==' '&&!j.includes('<b>')){style+="background-color:#fcf";}
//      else if(j[9]==' '&&!j.includes('<b>')){style+="background-color:#0cc";}
//      else if(j[8]==' '&&!j.includes('<b>')){style+="background-color:#0ff";}
//      else if(j[7]==' '&&!j.includes('<b>')){style+="background-color:#f55";}
//      else if(j[6]==' '&&!j.includes('<b>')){style+="background-color:#bff";}
//      else if(j[5]==' '&&!j.includes('<b>')){style+="background-color:#ddd";}
//      else if(j[4]==' '&&!j.includes('<b>')){style+="background-color:#ffc";}
//      else if(j[3]==' '){style+="background-color:#0ff";}
//      else if(j[2]==' '){style+="background-color:#f80";}
//      else if(j[1]==' '){style+="background-color:#8f0";}
      if(j[0]==' '){style+="text-align:left;";}
      t+=`<td class="border" style="${style}">${j.trimLeft()}</td>`;
    }
    t+='</tr>';
  }
  return t+'</table>';
}

let translations={
  '雨水':['Rainwater','Yushoei'],
  '獭祭鱼':['otter sacrifices fish','Taajihyu'],
  '鸿雁北':['the black-billed goose goes north','Horngyannbeei'],
  '草木萌':['grasses and trees sprout','Tsaomuhmerng'],

  '惊蛰':['Hibernating Insects Awaken','Jingjer'],
  '桃始华':['the peach tree starts flowering','Taurshyyhwa'],
  '仓庚鸣':['the black-naped oriole calls','Tsang\'gengmyng'],
  '鹰化鸠':['eagles turn into doves','Inghuahjiou'],

  '处暑':['End of Heat','Chuhshuu'],
  '鹰乃祭':['the eagle sacrifices','Ingnaejih'],
  '天地肃':['sky and earth shrink','Tiandihsuh'],
  '禾乃登':['crops ascend','Hernaedeng'],

  '白露':['White Dew','Bairluh'],
  '鸿雁来':['the swan goose comes','Horngyannlair'],
  '玄鸟归':['swallow returns','Shyuan\'neauguei'],
  '群鸟羞':['birds store food','Chyun\'neaushiou']
}

let shinjintai={
  '凉':'涼',
  '风':'風',
  '鸣':'鳴',
  '东':'東',
  '蛰':'蟄',
  '鱼':'魚',
  '负':'負',
  '冰':'氷',
  '处':'処',
  '鹰':'鷹',
  '獭':'獺',
  '獭':'獺',
  '鸿':'鴻',
  '鸟':'鳥',
  '归':'帰',
  '惊':'驚',
  '蛰':'蟄',
  '华':'華',
  '仓':'倉',
  '鸠':'鳩'
}

function getTranslation(x){
  return (translations[x]||['*trans.*','*rom.*'])[0];
}

function getRomanization(x){
  return (translations[x]||['*trans.*','*rom.*'])[1];
}

function addShinjintai(x){
  let m=[...Array(x.length).keys()].map(i=>(shinjintai[x[i]]||x[i])).join('');
  if(m!=x){return `${x} (${m})`;}
  return x;
}

function discordTimestamp(x){
  return `&lt;t:${Math.round(x.date.getTime()/1000)}:R>`;
}

function update(){
  let y=parseInt(document.getElementById('year').value);
  let J='春分 、 清明 、 谷雨 、 立夏 、 小满 、 芒种 、 夏至 、 小暑 、 大暑 、 立秋 、 处暑 、 白露 、 秋分 、 寒露 、 霜降 、 立冬 、 小雪 、 大雪 、 冬至 、 小寒 、 大寒 、 立春 、 雨水 、 惊蛰'.split(' 、 ');
  let H='玄鸟至，雷乃声，光始电，桐始华，田鼠隐，虹始见，萍始生，鸠拂羽，戴胜降，蝼蝈鸣，蚯蚓出，王瓜生，苦菜秀，靡草死，麦秋至，螳螂生，鹃始鸣，乌鸫寂，';
  H+=   '鹿角解，蜩始鸣，半夏生，温风至，蟋居宇，鹰始挚，腐草萤，土润溽，大雨行，凉风至，白露降，寒蝉鸣，鹰乃祭，天地肃，禾乃登，鸿雁来，玄鸟归，群鸟羞，';
  H+=   '雷收声，蛰坯户，水始涸，鸿雁宾，雀入水，菊花黄，豺祭兽，草木黄，蛰虫伏，水始冻，地始冻，雉入水，虹不见，气降升，闭塞冬，鴠不鸣，虎始交，荔挺出，';
  H+=   '蚯蚓结，麋角解，水泉动，雁北乡，鹊始巢，雉鸡鸣，鸡乳雉，征鸟疾，泽腹坚，东风解，蛰虫振，鱼负冰，獭祭鱼，鸿雁北，草木萌，桃始华，仓庚鸣，鹰化鸠';
  H=H.split('，');
  let M='Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec'.split(',');
  let D='Sun,Mon,Tue,Wed,Thu,Fri,Sat'.split(',');
  let T=[];
  let [y0,y1]=[X(new Astronomy.AstroTime(newyear(y))),X(new Astronomy.AstroTime(newyear(y+1)))]
  let C=assign(hou(y)).concat(assign(hou(y+1))).concat(assign(hou(y-1)));
  R=C.toSorted((x,y)=>(x[0].ut>y[0].ut?1:-1));
  //R=R.filter(x=>(y0<=X(x[0])&&X(x[0])<y1));
  for(let i=0;i<R.length;i++){
    if(X(R[i][0])<y0||X(R[i][0])>=y1){continue;}
    let h=R[i][0];
    let c=convertToChinese(h);
    let q=X(h)-y0+1;
    let t=R[i][1];
    let date=new Date(Date.UTC(2000,0,X(h)+1,0,0,0));
    T.push([`${D[date.getDay()]} ${'0'.repeat(date.getDate()<10)+date.getDate()} ${M[date.getMonth()]}`])
    let s=undefined;
    if(t%3>0){
      s=` Today is ${addShinjintai(H[t])}, or ${addShinjintai(H[(t+36)%72])} here; to be precise, it (will occur/occured) ${discordTimestamp(h)}.
It is ${formatChinese(c,1)}, and the ${shortOrdinal(q)} day of the year.`
    }
    else{
      let p=t/3;
      let p1=(p+12)%24;
      let t1=(t+36)%72;
      s=` Today is ${addShinjintai(J[p])}, or ${addShinjintai(J[p1])} here. It is ${formatChinese(c,0)}, and the ${shortOrdinal(q)} day of the year.

The three parts (候) of ${J[p]} (${getTranslation(J[p])}; ${getRomanization(J[p])}) are:
1. **${addShinjintai(H[t])}** = ${getTranslation(H[t])} (${getRomanization(H[t])})
<img> <img> \u2064${discordTimestamp(R[i][0])} = ${formatChinese2(convertToChinese(R[i][0]))}
2. ${addShinjintai(H[t+1])} = ${getTranslation(H[t+1])} (${getRomanization(H[t+1])})
<img> <img> \u2064${discordTimestamp(R[i+1][0])} = ${formatChinese2(convertToChinese(R[i+1][0]))}
3. ${addShinjintai(H[t+2])} = ${getTranslation(H[t+2])} (${getRomanization(H[t+2])})
<img> <img> \u2064${discordTimestamp(R[i+2][0])} = ${formatChinese2(convertToChinese(R[i+2][0]))}

The three parts (候) of ${J[p1]} (${getTranslation(J[p1])}; ${getRomanization(J[p1])}) are:
1. **${addShinjintai(H[t1])}** = ${getTranslation(H[t1])} (${getRomanization(H[t1])})
2. ${addShinjintai(H[t1+1])} = ${getTranslation(H[t1+1])} (${getRomanization(H[t1+1])})
3. ${addShinjintai(H[t1+2])} = ${getTranslation(H[t1+2])} (${getRomanization(H[t1+2])})
`
    }
    T.at(-1).push(s.replaceAll('\n','<br>\n'));
  }
  document.getElementById('notices').innerHTML=table(T);
}

document.getElementById('year').value=new Date().getFullYear();
update();

document.getElementById('year').addEventListener('keyup',(e)=>{e.key=='Enter'?update():null;});

