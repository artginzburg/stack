export const initialDocumentTitle = document.title;

export function getNonProductionDocumentTitle() {
  return `${initialDocumentTitle} · ${(process.env.NODE_ENV === 'development'
    ? 'dev'
    : 'test'
  ).toUpperCase()}`;
}
