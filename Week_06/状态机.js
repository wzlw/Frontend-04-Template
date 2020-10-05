// abcabx
function match(str){
  let state = start;
  for (const s of str){
    state = state(s);
  }
  return state == end;
}


function start(c){
  if (c === 'a'){
    return foundA;
  }
  return start;
}

function end(c) {
  return end;
}

function foundA(c){
  if (c === 'b') {
    return foundB;
  }
  return start(c);
}

function foundB(c) {
  if (c === 'c') {
    return foundC;
  }
  if (c === 'x') {
    return foundX;
  }
  return start(c);
}

function foundC(c) {
  if (c === 'a'){
    return foundA2;
  }
  return start(c);
}

function foundA2(c) {
  if (c === 'b') {
    return foundB2;
  }
  return start(c);
}

function foundB2(c) {
  if (c === 'x') {
    return end;
  }
  return foundB;
}

console.log(match('i am match abcabxsaaa'))
