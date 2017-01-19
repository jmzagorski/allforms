export function buildLocationLinks(location, start) {
  start = start || 0;
  location = location || window.location;
  // to prevent the root pathname from splitting twice
  const fixPath = location.pathname === '/' ? '' : location.pathname;
  const segments = [];

  const segs =  (fixPath || location.hash).split('/') || [];

  for (let i = start; i < segs.length; i++) {
    segments.push({
      url: segs.filter((item, idx) => idx <= i).join('/'),
      display: segs[i]
    });
  }

  return segments;
}

export function importFetch() {
  return !self.fetch ? System.import('isomorphic-fetch') :
    Promise.resolve(self.fetch);
}
