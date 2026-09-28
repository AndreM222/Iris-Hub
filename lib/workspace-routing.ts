export function withWorkspacePath(pathname: string, path: string) {
  const workspace = pathname.split('/').filter(Boolean)[0];

  if (
    !workspace ||
    !path.startsWith('/') ||
    path === `/${workspace}` ||
    path.startsWith(`/${workspace}/`)
  ) {
    return path;
  }

  return `/${workspace}${path === '/' ? '' : path}`;
}

export function replaceWorkspacePath(pathname: string, workspace: string) {
  const segments = pathname.split('/').filter(Boolean);
  segments[0] = workspace;
  return `/${segments.join('/')}`;
}
