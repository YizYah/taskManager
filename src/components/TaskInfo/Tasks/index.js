import React from 'react';
import { Unit } from '@nostack/no-stack';
import styled from 'styled-components';
import { flattenData } from '../../../flattenData';

import TaskCreationForm from '../TaskCreationForm';
import Task from '../Task';

import { SOURCE_TASK_INFO_ID } from '../../../config';
import { TASK_INFO_RELATIONSHIPS, SOURCE_TASK_INFO_QUERY } from '../../source-props/taskInfo';

// add styling here
const TasksStyleWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
`;

function Tasks({ projectId }) {
  const parameters = {
    currentProjectId: projectId,
  };

  return (
    <Unit
      id={SOURCE_TASK_INFO_ID}
      typeRelationships={TASK_INFO_RELATIONSHIPS}
      query={SOURCE_TASK_INFO_QUERY}
      parameters={parameters}
    >
      {({loading, error, data, refetchQueries}) => {
        if (loading) return 'Loading...';

        if (error) {
          console.error(error);
          return `Error: ${error.graphQLErrors}`
        };

        const tasks = data.unitData.map(el => flattenData(el));

        return (
          <>
          <TasksStyleWrapper>
            {
              tasks && tasks.map(task => (
                <Task
                  key={task.id}
                  parentId={projectId}
                  task={task}
                  refetchQueries={refetchQueries}
                />
              ))
            }
            <TaskCreationForm  projectId={projectId} refetchQueries={refetchQueries}/>
          </TasksStyleWrapper>
          </>
        );
      }}
    </Unit>
  );
}
export default Tasks;

