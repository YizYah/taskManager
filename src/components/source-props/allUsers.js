import gql from 'graphql-tag';

export const SOURCE_ALL_USERS_QUERY = gql`
  query UNIT(
    $id: ID!
    $typeRelationships: String!
    $parameters: String
  ) {
    unitData(
      unitId: $id
      typeRelationships: $typeRelationships
      parameters: $parameters
    )
    {
      instance {
      id
      value
    }
    }
  }
`;

  export const ALL_USERS_RELATIONSHIPS = {
   user: null,
};