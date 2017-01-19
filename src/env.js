export function getBaseUrl(location) {
  return location.port ? `http://${location.hostname}:9001/` : '/';
}
