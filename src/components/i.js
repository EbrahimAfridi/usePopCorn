const range = (start, stop, step) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);

// range(1, 10, 2);

console.log(range(1, 10, 2));