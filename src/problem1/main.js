var sum_to_n_a = function(n) {
    return Array.from({ length: n }, (v, i) => i + 1)
    .reduce((acc, cur) => acc + cur, 0)
};

var sum_to_n_b = function(n) {
    return n * (n + 1) / 2
};

var sum_to_n_c = function(n) {
   // Initialize sum to 0
  let total = 0;

  // Loop through all numbers from 1 to n
  for (let i = 1; i <= n; i++) {
    total += i;
  }
  return total
};


console.log(sum_to_n_a(10))
console.log(sum_to_n_b(10))
console.log(sum_to_n_c(10))