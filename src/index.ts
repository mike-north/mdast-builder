import { Node, Parent } from 'unist';

export type Children = Node | Node[] | (() => Node | Node[]);

function normalizeChildren(children?: Children): Node[] {
  if (Array.isArray(children)) {
    return children;
  } else if (typeof children === 'function') {
    const res = children();
    return normalizeChildren(res);
  } else if (typeof children === 'undefined') {
    return [];
  } else {
    return [children];
  }
}

const valueNode = (type: string, value: string): Node => ({
  type,
  value
});

const nodeWithChildren = (type: string, kids?: Children): Parent => {
  const children = kids ? normalizeChildren(kids) : [];

  return {
    type,
    children
  };
};

export const text = (value: string) => valueNode('text', value);
export const inlineCode = (value: string) => valueNode('inlineCode', value);

export const strong = (kids?: Children) => nodeWithChildren('strong', kids);
export const tableCell = (kids?: Children) =>
  nodeWithChildren('tableCell', kids);
export const tableRow = (kids?: Children) => nodeWithChildren('tableRow', kids);
export const table = (
  align?: ['left' | 'right', 'left' | 'right' | 'center'],
  kids?: Children
) => ({ ...nodeWithChildren('table', kids), align });

export const link = (url: string, title: string = '', kids?: Children) => ({
  ...nodeWithChildren('link', kids),
  url,
  title
});

export const root = (kids?: Children) => nodeWithChildren('root', kids);

export const rootWithTitle = (
  depth: number,
  title: Children,
  kids?: Children
) => root([heading(depth, title), paragraph(kids)]);

export const paragraph = (kids?: Children) =>
  nodeWithChildren('paragraph', kids);
export const code = (lang: string, value: string) => ({
  ...valueNode('code', value),
  lang
});

export const heading = (depth: number, kids: Children): Parent => ({
  ...nodeWithChildren('heading', kids),
  depth
});

export const list = (
  ordered: 'ordered' | 'unordered',
  kids: Children
): Parent => ({
  ...nodeWithChildren('list', kids),
  ordered: ordered === 'ordered'
});
export const listItem = (kids: Children): Parent =>
  nodeWithChildren('listItem', kids);
