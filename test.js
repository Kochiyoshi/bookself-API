// const page = 50;
// const read = 5;

// const finished = (page === read);

// console.log(finished);

function foo(x, ...args) {
    console.log(x, args, ...args, arguments);
  }
  
foo('a', 'b', 'c', z='d')