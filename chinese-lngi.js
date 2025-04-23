let t = new Decimal(0);
let speed = 1;
var precision = 4;
var limit = new Decimal('10^^8;4.0000000000006e12')
var exp;

var baseChars = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
var powers = ["十", "百", "千"];
var exps = ["万", "亿", "兆", "京", "垓", "秭", "穰", "沟", "涧", "正", "载", "极", "恒河沙", "阿僧祇", "那由他", "不可思议", "无量大数", "大数"];
var filler = "ㅤ"

function baseChar(x){
  return "<span class='c" + x + "'>" + baseChars[x] + "</span>";
}

function expChar(x,id=7){
  if(x.gt(9998)){
    x=x.add(1);
    return `第<br>${chinese(x).split('<br>').map(x=>filler.repeat(id+1)+x).join('<br>')}<br>${filler.repeat(id)}数`;
  }
  if(x.gt(17)){
    return `第${chinese(x.add(1))}数`;
  }
  return "<span class='exp" + x.add(2) + "'>" + exps[x] + "</span>";
}

function mod(x,y){
	return x.sub(x.div(y).floor().mul(y)).floor()
}

function roundTo(n, places){
  return n.mul(new Decimal(10).pow(places)).floor().div(new Decimal(10).pow(places));
}

function chinese(x,prec=precision){
  //let str='';
  if(x.lt(10000)){
    if(x.lt(10)){return filler.repeat(6)+baseChar(x);}
    if(x.lt(100)){return filler.repeat(4)+(x.lt(20)?filler:baseChar(x.div(10).floor()))+'十'+(mod(x,10).eq(0)?filler:baseChar(mod(x,10)))}
    if(x.lt(1000)){return filler.repeat(2)+baseChar(x.div(100).floor())+'百'+(mod(x,100).eq(0)?filler.repeat(3):chinese(mod(x,100)).slice(4))}
    return baseChar(x.div(1000).floor())+'千'+(mod(x,1000).eq(0)?filler.repeat(5):chinese(mod(x,1000)).slice(2))
  }
  let y=x.log10().div(4).floor();
  let str=chinese(x.div(new Decimal(10).pow(y.mul(4))).floor())+expChar(y.sub(1));
  if(x.gte(new Decimal('e4e12'))){str=baseChar(1)+expChar(y.sub(1),1);}
  let m=y.sub(mod(x,new Decimal(10).pow(y.mul(4))).log10().div(4).floor()).sub(1).toNumber();
  if(prec-m-1>0&&x.lt(new Decimal('e40000'))&&mod(x,new Decimal(10).pow(y.mul(4))).gt(0)){
    str+=(filler+'<br>').repeat(m)
    str+='<br>'+chinese(mod(x,new Decimal(10).pow(y.mul(4))),prec-m-1);
  }
  return str+filler;
}

function getNum(){
  if(exp.gt(limit)){return chinese(limit).split('<br>').map(x=>x+filler).join('<br>').replaceAll('ㅤ','<span style="color: #000000">零</span>');}
  return chinese(exp.floor()).split('<br>').map(x=>x+filler).join('<br>').replaceAll('ㅤ','<span style="color: #000000">零</span>');
}

function dispNum(x){
  x=x.min(limit);
  // return x.toString() // I give up. It's too slow otherwise.
  if(x.lt(1e7)){return x.toNumber().toLocaleString('en-US');}
  if(x.lt('e1e7')){return x.div(new Decimal(10).pow(x.log10().floor())).toNumber().toFixed(6)+` × 10<sup>${dispNum(x.log(10).floor())}</sup>`;}
  return `10<sup>${dispNum(x.log10().floor())}</sup>`;
}

function getNumEq(){
  return dispNum(exp.floor());
}

function updateText(){
  t = t.lt(2)?t.add(0.001*speed):t.mul(1.00005**speed);
  exp = t.lt(2)?t.mul(5):new Decimal(10).tetrate(t.sub(1))
  document.getElementById("number").innerHTML = getNum();
  document.getElementById("equals").innerHTML = getNumEq();
}

setInterval(updateText, 20);
