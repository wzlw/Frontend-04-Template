function showThis() {
  console.log(this);
}

let o = {
  showThis: showThis
};

showThis()
o.showThis()


var arrs = []
for (var i = 0; i < 3; i++) {
  arrs.push(function () {
    return i;
  })
}

console.log(arrs[0]() + arrs[1]())