export function gql(strings, ...args) {
  let str = "";
  strings.forEach((string, i) => {
    str += string + (args[i] || "");
  });
  return str;
}
export const PrintsPartsFragmentDoc = gql`
    fragment PrintsParts on Prints {
  __typename
  prints {
    __typename
    slug
    title
    artist
    price
    size
    paper
    edition
    images
    description
    buyUrl
    featured
  }
}
    `;
export const PrintsDocument = gql`
    query prints($relativePath: String!) {
  prints(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...PrintsParts
  }
}
    ${PrintsPartsFragmentDoc}`;
export const PrintsConnectionDocument = gql`
    query printsConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: PrintsFilter) {
  printsConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...PrintsParts
      }
    }
  }
}
    ${PrintsPartsFragmentDoc}`;
export function getSdk(requester) {
  return {
    prints(variables, options) {
      return requester(PrintsDocument, variables, options);
    },
    printsConnection(variables, options) {
      return requester(PrintsConnectionDocument, variables, options);
    }
  };
}
import { createClient } from "tinacms/dist/client";
const generateRequester = (client) => {
  const requester = async (doc, vars, options) => {
    let url = client.apiUrl;
    if (options?.branch) {
      const index = client.apiUrl.lastIndexOf("/");
      url = client.apiUrl.substring(0, index + 1) + options.branch;
    }
    const data = await client.request({
      query: doc,
      variables: vars,
      url
    }, options);
    return { data: data?.data, errors: data?.errors, query: doc, variables: vars || {} };
  };
  return requester;
};
export const ExperimentalGetTinaClient = () => getSdk(
  generateRequester(
    createClient({
      url: "http://localhost:4001/graphql",
      queries
    })
  )
);
export const queries = (client) => {
  const requester = generateRequester(client);
  return getSdk(requester);
};
