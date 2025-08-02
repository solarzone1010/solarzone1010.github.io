const count=(x)=>(x.match(/\(/g)||[]).length-(x.match(/\)/g)||[]).length;

function lexlt(X,Y){
  if(!Y.length){return 0;}
  if(!X.length){return 1;}
  if(X[0]>Y[0]){return 0;}
  if(X[0]<Y[0]){return 1;}
  return lexlt(X.slice(1),Y.slice(1))
}

function lt(X,Y){
  let [x,y,x0,y0]=[0,0,X[0],Y[0]];
  if(X.length==1&&X[0]==0){return 1;}
  while(X.length>0){
     x++;
     X=X.slice(1);
     if(X[0]!=x0){break;}
  }
  while(Y.length>0){
     y++;
     Y=Y.slice(1);
     if(Y[0]!=y0){break;}
  }
  if(x<y){return 1;}
  if(x>y){return 0;}
  return lexlt(X,Y);
}

function parent(M,n){
  let i=n;
  while(M[i][0]>=M[n][0]){i--;}
  return i;
}

function decrease(M,n){
  if(M[n].length==1&&M[n][0]==1){return [0];}
  if(M[n].at(-1)==1){return M[n].slice(0,-1);}
  let i=n;
  while(M[i][0]!=M[n].at(-1)-1){i=parent(M,i);}
  return M[n].slice(0,-1).concat(decrease(M,i));
}

function FS(M,n){
  M=M.map(x=>x.filter(y=>y!=0)).map(x=>(x.length>0?x:[0]));
  if(!M.length){return M;}
  if(M.at(-1).length==1&&!M.at(-1)[0]){return M.slice(0,-1);}
  let i=M.length-1;
  if(M.at(-1).length==2&&M.at(-1)[1]==1){
    let r=parent(M,i);
    M=M.slice(0,-1);
    let l=M.length+0;
    for(let i=0;i<n;i++){M=M.concat(M.slice(r,l));}
    return M;
  }
  while(!lt(M[i],M.at(-1))){i=parent(M,i);}
  let r=i;
  M[M.length-1]=decrease(M,M.length-1);
  let l=M.length+0;
  for(let i=1;i<=n;i++){
    for(let j=r+1;j<l;j++){
      M.push([]);
      for(let k=0;k<M[j].length;k++){
        M.at(-1).push(M[j][k]+(M[l-1][0]-M[r][0])*i*(M[j][k]>M[r][0]));
      }
    }
  }
  return M
}

function parse(s){
  return eval(s.replaceAll(')(','],[').replaceAll('(','[[').replaceAll(')',']]'));
}

function display(M){
  return '('+M.map(x=>x.toString()).join(')(')+')';
}

function calculate(){
  if(count(document.getElementById('input').value)!=0){return;}
  document.getElementById('result').innerHTML=display(FS(parse(document.getElementById('input').value),parseInt(document.getElementById('element').value)));
}

calculate();



