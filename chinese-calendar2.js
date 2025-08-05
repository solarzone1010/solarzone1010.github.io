function X(t){
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

//function recursivejieqi(x,m){
//
//}


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

function ganzhi(x){
  let S='甲乙丙丁戊己庚辛壬癸';
  let B='子丑寅卯辰巳午未申酉戌亥';
  return S[x%10]+B[x%12];
}

function number(x){
  let N='日一二三四五六七八九十冬腊';
  if(x==0){return '零';}
  if(x<11){return N[x];}
  if(x<100){
    if(x<20){return'十'+N[x-10];}
    if(x%10==0){return N[x/10]+'十';}
    return N[Math.floor(x/10)]+'十'+N[x%10];
  }
  if(x%100==0){return N[x/100]+'百';}
  if(x%100<10){return N[Math.floor(x/100)]+'百零'+N[x%100];}
  return N[Math.floor(x/100)]+'百'+number(x%100);
}

function number2(x){
  let N='日一二三四五六七八九十冬腊';
  return x<10?'　'+N[x]:x==10?'　十':x<20?'十'+N[x-10]:x==20?'二十':x<30?'廿'+N[x-20]:x==30?'三十':'卅'+N[x-30];
}

function number3(x){
  let N='日一二三四五六七八九十冬腊';
  return x<10?'零'+N[x]:!(x%10)?`${N[x/10]}十`:x<20?'十'+N[x-10]:N[Math.floor(x/10)]+N[x%10];
}

function table(x){
  let t='<table>';
  //t+=['<b>公历</b>','','<b>农历</b>','<b>廿四节气</b>','<b>七十二候</b>']
  t+='<tr><td colspan="2"><b>公历</b></td><td><b>农历与干支</b></td><td><b>廿四节气</b></td><td><b>七十二候</b></td><td><b>果糕历</b></td><td><b>九九与三伏</b></td></tr>'
  for(let i of x){
    t+='<tr class="border">';
    for(let j of i){
      let style='';
      if(j[1]=='*'){style+="color:#f00;";j=j.slice(2);}
      else if(j[0]=='*'){style+="color:#00f;";j=j.slice(1);}
      if(j[10]==' '&&!j.includes('<b>')){style+="background-color:#fcf";}
      else if(j[9]==' '&&!j.includes('<b>')){style+="background-color:#0cc";}
      else if(j[8]==' '&&!j.includes('<b>')){style+="background-color:#0ff";}
      else if(j[7]==' '&&!j.includes('<b>')){style+="background-color:#f55";}
      else if(j[6]==' '&&!j.includes('<b>')){style+="background-color:#bff";}
      else if(j[5]==' '&&!j.includes('<b>')){style+="background-color:#ddd";}
      else if(j[4]==' '&&!j.includes('<b>')){style+="background-color:#ffc";}
      else if(j[3]==' '){style+="background-color:#0ff";}
      else if(j[2]==' '){style+="background-color:#f80";}
      else if(j[1]==' '){style+="background-color:#8f0";}
      else if(j[0]==' '){style+="background-color:#ff0";}
      t+=`<td class="border" style="${style}"${""}>${j.trimLeft()}</td>`;
    }
    t+='</tr>';
  }
  return t+'</table>';
}

function update(){
  let A=[];
  let D=' 东冬江支微鱼虞齐佳灰真文元寒删铢筱巧皓哿马养梗迥有宥沁勘艳卅世';
  let N='日一二三四五六七八九十冬腊';
  let E='㈰㈪㈫㈬㈭㈮㈯'
  let J='春分 、 清明 、 谷雨 、 立夏 、 小满 、 芒种 、 夏至 、 小暑 、 大暑 、 立秋 、 处暑 、 白露 、 秋分 、 寒露 、 霜降 、 立冬 、 小雪 、 大雪 、 冬至 、 小寒 、 大寒 、 立春 、 雨水 、 惊蛰'.split(' 、 ');
  let H='玄鸟至，雷乃声，光始电，桐始华，田鼠隐，虹始见，萍始生，鸠拂羽，戴胜降，蝼蝈鸣，蚯蚓出，王瓜生，苦菜秀，靡草死，麦秋至，螳螂生，鹃始鸣，乌鸫寂，';
  H+=   '鹿角解，蜩始鸣，半夏生，温风至，蟋居宇，鹰始挚，腐草萤，土润溽，大雨行，凉风至，白露降，寒蝉鸣，鹰乃祭，天地肃，禾乃登，鸿雁来，玄鸟归，群鸟羞，';
  H+=   '雷收声，蛰坯户，水始涸，鸿雁宾，雀入水，菊花黄，豺祭兽，草木黄，蛰虫伏，水始冻，地始冻，雉入水，虹不见，气降升，闭塞冬，鴠不鸣，虎始交，荔挺出，';
  H+=   '蚯蚓结，麋角解，水泉动，雁北乡，鹊始巢，雉鸡鸣，鸡乳雉，征鸟疾，泽腹坚，东风解，蛰虫振，鱼负冰，獭祭鱼，鸿雁北，草木萌，桃始华，仓庚鸣，鹰化鸠';
  H=H.split('，');
//  console.log(J)
//  console.log(H)
  let S='甲乙丙丁戊己庚辛壬癸';
  let B='子丑寅卯辰巳午未申酉戌亥';
  let K='冬寒雨春谷芒夏暑露秋霜雪';
  let y=parseInt(document.getElementById('year').value);
  //if(y<1800||y>=2200){return;}
  let C0=calcYear(y-1);
  let C1=calcYear(y);
  let Q=[...Array(24).keys()].map(x=>hou(y)[x*3]);
  let Q1=[...Array(24).keys()].map(x=>hou(y+1)[x*3]);
  Q.push(Q1[Q1.map(x=>x.ut).indexOf(Math.min(...Q1.map(x=>x.ut)))]);
  let Qn=Q1.map(x=>x.ut).indexOf(Math.min(...Q1.map(x=>x.ut)));
  let P=hou(y);
  let P1=hou(y+1);
  let P0=hou(y-1);
  let F=X(new Astronomy.AstroTime(newyear(y)));
  P.push(P1[P1.map(x=>x.ut).indexOf(Math.min(...P1.map(x=>x.ut)))]);
  let Pn=P1.map(x=>x.ut).indexOf(Math.min(...P1.map(x=>x.ut)));
  let r0=Astronomy.SearchSunLongitude(270,newyear(y-1),366);
  let r1=Astronomy.SearchSunLongitude(270,newyear(y),366);
  let q1=Astronomy.SearchSunLongitude(90,newyear(y),366);
  let q2=Astronomy.SearchSunLongitude(135,newyear(y),366);
  let qr=X(q1)+(2-X(q1)+1000000)%10+20;
  let qz=X(q1)+(2-X(q1)+1000000)%10+30;
  let qm=X(q2)+(2-X(q2)+1000000)%10;
  let s0=Astronomy.Seasons(y-1);
  let s1=Astronomy.Seasons(y);
  let s2=Astronomy.Seasons(y+1);
  let s=[s0.dec_solstice,s1.mar_equinox,s1.jun_solstice,s1.sep_equinox,s1.dec_solstice,s2.mar_equinox];
  s=s.map(X);
  for(let i=1;i<13;i++){
    let a0=new Date(Date.UTC(2000,0,1,0,0,0));
    let a1=new Date(Date.UTC(2000,0,1,0,0,0));
    a0.setUTCFullYear(y);
    a0.setUTCMonth(i-1);
    a1.setUTCFullYear(y);
    a1.setUTCMonth(i);
    let l=X(new Astronomy.AstroTime(a1))-X(new Astronomy.AstroTime(a0));
    for(let j=1;j<l+1;j++){
      A.push([]);
      let d=new Date(Date.UTC(2000,0,1,0,0,0));
      d.setUTCFullYear(y);
      d.setUTCMonth(i-1);
      d.setUTCDate(j);
      d.setUTCHours(-8);
      d=X(new Astronomy.AstroTime(d));
      let w=(d+699999999)%7;
      let n=y-(d<X(C1[1][0]))
      let ii,jj,m;
      let k=0;
      let u;
      let W=A.length-1;
      let m0=d-X(r0);
      let m1=d-X(r1);
      if(d<X(C1[1][0])){
        for(ii=12;ii>0;ii--){
          for(jj=C0[ii].length-1;jj>=0;jj--){
            if(X(C0[ii][jj])<=d){k=1;break;}
          }
          if(k){break;}
        }
        m=d-X(C0[ii][jj])+1;
        u=X(C0[ii][jj]);
      }
      else{
        for(ii=12;ii>0;ii--){
          for(jj=C1[ii].length-1;jj>=0;jj--){
            if(X(C1[ii][jj])<=d){k=1;break;}
          }
          if(k){break;}
        }
        m=d-X(C1[ii][jj])+1;
        u=C1[ii][jj];
      }
      let h=4;
      if(m==1){h=0;}
      if(d==X(Astronomy.SearchMoonPhase(90,u,30))){h=1;}
      if(d==X(Astronomy.SearchMoonPhase(180,u,30))){h=2;}
      if(d==X(Astronomy.SearchMoonPhase(270,u,30))){h=3;}
      A.at(-1).push('**'.repeat(!w)+`<b>${number2(i)}月${j<11?N[j]+"日":number2(j)}</b>　${B[i-1]}${D[j]}`);
      A.at(-1).push('**'.repeat(!w)+`周${N[w]}　${E[w]}`)
      let v=d-F+1;
      A[W][1]+='　年第'+(v<100?(v<10?'　':v<20?'一':'')+number(v)+(v<10||v%10==0?'　':''):number(Math.floor(v/100))+number(Math.floor(v/10)%10)+number(v%10))+'日'
      A.at(-1).push(`${ganzhi(n+599996)}${jj?'闰':'年'}${ii>1?N[ii]:'正'}月${m<11?'初'+N[m]:number2(m)}`
        +`　${'朔弦望晦　'[h]}<img/>`);
      if(d==X(C1[1][0])){A[W][2]=' '+A[W][2];}
      if(m==1){A[W][2]=' '+A[W][2];}
      if(m==1&&jj){A[W][2]='  '+A[W][2];}
      A[W][2]+=`　${ganzhi(n*12+ii+5999953)}月${ganzhi((d+599999994)%60)}日`;
      //let v=number(d-F+1);
      let M=Math.min(...Q.filter(x=>X(x)>=d).map(X));
      let q=Q.map(X).indexOf(M);
      let f=M-d;
      let g=(Q[q].ut+5/6+10000000)%1
      g=Math.round(g*1440)/1440;
      let gh=Math.floor(g*24);
      let gm=Math.floor((g*1440)%60);
      let M1=Math.min(...P.filter(x=>X(x)>=d).map(X));
      let q1=P.map(X).indexOf(M1);
      //console.log(Math.max(...P0.map(X)),X(new Astronomy.AstroTime(new Date(Date.UTC(y,0,1,-8)))))
      if(Math.max(...P0.map(X))>=X(new Astronomy.AstroTime(newyear(y)))){
        let M2=Math.max(...P0.map(X));
        if(d<=M2){
          M1=M2;
          q1=P0.map(X).indexOf(M1);
        }
      }
      let f1=M1-d;
      let g1=(P[q1].ut+5/6+10000000)%1;
      g1=Math.round(g1*1440)/1440;
      let gh1=Math.floor(g1*24);
      let gm1=Math.floor((g1*1440)%60);
      if(h==2){A[W][2]='     '+A[W][2]}
      else if(h<4&&h){A[W][2]='      '+A[W][2];}
      A.at(-1).push(`${J[q<24?q:Qn]}${f?"前第"+(f<11?N[f]:'十'+N[f-10])+'日'+'　'.repeat(f<11)+'　　':'　'+(!gh?'　零':gh<10?'　'+N[gh]:gh==10?'　十':gh<20?'十'+N[gh-10]:gh==20?'二十':'廿'+N[gh-20])+'时'+
        (!gm?'正　　':number3(gm)+'分')}<img/>`);
      A.at(-1).push(`${H[q1<72?q1:Pn]}${f1?"前第"+N[f1]+'日　　　':'　'+(!gh1?'　零':gh1<10?'　'+N[gh1]:gh1==10?'　十':gh1<20?'十'+N[gh1-10]:gh1==20?'二十':'廿'+N[gh1-20])+'时'+
        (!gm1?'正　　':number3(gm1)+'分')}<img/>`);
      if(!f&(q<24?q:Qn)%6==0){A[W][3]='        '+A[W][3];}
      else if(!f&(q<24?q:Qn)%3==0){A[W][3]='         '+A[W][3];}
      else if(!f&(q<24?q:Qn)%2==0){A[W][3]='          '+A[W][3];}
      else if(!f){A[W][3]='    '+A[W][3];}
      if(!f1){A[W][4]='       '+A[W][4];}
      let sq=s.filter(x=>x<=d).at(-1);
      let sh=s.filter(x=>x>=d)[0];
      let sq1=(s.indexOf(sq)+3)%4;
      let sh1=(s.indexOf(sh)+3)%4;
      let sq2=d-sq;
      let sh2=sh-d;
//      if(sq==sh){A[W][5]='        '+J[sh1*6];}
//      else{A[W][5]=`${J[sh1*6][0]}前${sh2<11?N[sh2]+'日':number3(sh2)}${J[sq1*6][0]}后${sq2<11?N[sq2]+'日':number3(sq2)}`;}
      A[W][5]='';
      if(m0<81){A[W][6]=`${N[Math.floor(m0/9)+1]}九第${N[m0%9+1]}日<img/>`;}
      //else if(m0<90){A[W][5]=`九九又${N[m0%9+1]}日<img/>`;}
      if(m1>=0){A[W][6]=`${N[Math.floor(m1/9)+1]}九第${N[m1%9+1]}日<img/>`;}
      if(d>=qr&&d<qz){A[W][6]=`入伏第${N[d-qr+1]}日<img/>`;}
      else if(d>=qr&&d<qm){A[W][6]=`中伏第${number2(d-qz+1).replace('　','')+'日'.repeat(d<qz+10)}`;}
      else if(d>=qr&&d<qm+10){A[W][6]=`末伏第${N[d-qm+1]}日<img/>`;}
      if((m0<81&&!(m0%9))||(m1>=0&&!(m1%9))||d==qr||d==qz||d==qm){A[W][6]='           '+A[W][6];}
      let gd=d-16061;
      let gn=Math.floor((gd*293+292.9999)/8918);
      let gn1=gn;
      let gy=Math.floor(gn/12);
      gn-=gy*12
      gy=ganzhi(gy+2044+599996);
      gd-=Math.floor((8918*gn1)/293)-1;
      A[W][5]=`${gy}年${K[gn]}月${gd<11?'初'+N[gd]:number2(gd)}`;
      if(gn==0&&gd==1){A[W][5]='  '+A[W][5];}
      else if(gn%3==0&&gd==1){A[W][5]='        '+A[W][5];}
      else if(gd==1){A[W][5]='          '+A[W][5];}
      else if(gd==16){A[W][5]='    '+A[W][5];}
      let now=new Date();
      if(y==now.getFullYear()&&i==now.getMonth()+1&&j==now.getDate()){A[W][0]='*'+(A[W][0][0]=='*'?A[W][0].slice(2):A[W][0]);}
      //else if(!w){A[j][i]='**'+A[j][i];}
    }
  }
  document.getElementById('cal').innerHTML=table(A);

//周三　晦　乙丑
//甲子年三月十二
//丙寅月一百五六
//　春立前第二
//东风解前第二　
}
document.getElementById('year').value=new Date().getFullYear();
update();
document.getElementById('year').addEventListener('keyup',(e)=>{e.key=='Enter'?update():null;});

//for(let i=3000;;i--){
//  let w=Astronomy.Seasons(i).dec_solstice;
//  let r=Astronomy.SearchMoonPhase(180,w,30).ut-w.ut;
//  let r0=w.ut-Astronomy.SearchMoonPhase(180,w,-30).ut;
//  let d=Math.floor(w.ut+1/2);
//  let t=w.ut+1/2;
//  let h=24*(t-d)-24*(t-d>.5);
//  //if(Math.min(r,r0)<1&&Math.abs(h)<.5){console.log(i,24*Math.min(r,r0));}
//  if(Math.abs(h)<12/293){console.log(i)}
//}

//X=Astronomy.Seasons(2043).dec_solstice;
//Y=[];
//for(let i=0;i<360;i+=5){
//  Y.push(Math.floor(Astronomy.SearchSunLongitude((i+270)%360,X,366).ut-X.ut));
//}
//console.log(Y.toString());
