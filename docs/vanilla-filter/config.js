const subscribers = [];
const activeFilters = new Set();

export const liveConfig = {
  get activeFilters() {
    return activeFilters;
  },
  add(v) {
    activeFilters.add(v);
    subscribers.forEach((f) => f());
  },
  remove(v) {
    activeFilters.delete(v);
    subscribers.forEach((f) => f());
  },
  subscribe(fn) {
    subscribers.push(fn);
  },
};
