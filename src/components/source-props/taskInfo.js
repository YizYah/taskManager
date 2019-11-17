import gql from 'graphql-tag';

export const SOURCE_TASK_INFO_QUERY = gql`
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
        children {
            typeId
            instances {
                
		instance {
		    id
		    value
		}
		children {
		    typeId
		    instances {
		        
			instance {
			    id
			    value
			}
		    }
		}
            }
        }
    
    }
  }
`;

  export const TASK_INFO_RELATIONSHIPS = {
   task: {
        completed: null, step: {
        goal: null, user: null
    }
    },
};