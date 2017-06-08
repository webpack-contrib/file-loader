export const is = function is(expected, value) {
  return new RegExp(`(${expected})`).test(Object.prototype.toString.call(value));
};

export const parsePath = function parsePath(property, slug) {
  if (!property) {
    return slug;
  } else if (is('Function', property)) {
    return property(slug);
  }
  return property + slug;
};
