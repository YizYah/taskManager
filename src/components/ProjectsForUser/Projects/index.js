import React from 'react';
import { Unit } from '@nostack/no-stack';
import styled from 'styled-components';
import { flattenData } from '../../../flattenData';

import ProjectCreationForm from '../ProjectCreationForm';
import Project from '../Project';

import { SOURCE_PROJECTS_FOR_USER_ID } from '../../../config';
import { PROJECTS_FOR_USER_RELATIONSHIPS, SOURCE_PROJECTS_FOR_USER_QUERY } from '../../source-props/projectsForUser';

// add styling here
const ProjectsStyleWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
`;

function Projects({ userId }) {
  const parameters = {
    __currentUser__: userId,
  };

  return (
    <Unit
      id={SOURCE_PROJECTS_FOR_USER_ID}
      typeRelationships={PROJECTS_FOR_USER_RELATIONSHIPS}
      query={SOURCE_PROJECTS_FOR_USER_QUERY}
      parameters={parameters}
    >
      {({loading, error, data, refetchQueries}) => {
        if (loading) return 'Loading...';

        if (error) {
          console.error(error);
          return `Error: ${error.graphQLErrors}`
        };

        const projects = data.unitData.map(el => flattenData(el));

        return (
          <>
          <ProjectsStyleWrapper>
            {
              projects && projects.map(project => (
                <Project
                  key={project.id}
                  parentId={userId}
                  project={project}
                  refetchQueries={refetchQueries}
                />
              ))
            }
            <ProjectCreationForm  userId={userId} refetchQueries={refetchQueries}/>
          </ProjectsStyleWrapper>
          </>
        );
      }}
    </Unit>
  );
}
export default Projects;

