import React, { useState } from 'react';
import { graphql } from '@apollo/react-hoc';
import styled from 'styled-components';
import { withNoStack, EXECUTE_ACTION } from '@nostack/no-stack';
import compose from '@shopify/react-compose';

import { CREATE_TASK_FOR_TASK_INFO_ACTION_ID, CREATE_COMPLETED_FOR_TASK_INFO_ACTION_ID, TYPE_COMPLETED_ID } from '../../../config';

// change styling here
const Form = styled.div`
  margin: 2em;
  padding: 1.5em;
  border: none;
  border-radius: 5px;
  background-color: #F5F5F5;
`;

const Button = styled.button`
  margin-left: 1em;
`;

function TaskCreationForm({ projectId, createTask, createCompleted, refetchQueries }) {
  const [ taskValue, updateTaskValue ] = useState('');
  const [ loading, updateLoading ] = useState(false);

  function handleChange(e) {
    updateTaskValue(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!taskValue) {
      return;
    }

    updateLoading(true);

    const createTaskResponse = await createTask({
      variables: {
        actionId: CREATE_TASK_FOR_TASK_INFO_ACTION_ID,
        executionParameters: JSON.stringify({
          parentInstanceId: projectId,
          value: taskValue,
        }),
        unrestricted: false,
      },
    });

    const newTaskData = JSON.parse(createTaskResponse.data.ExecuteAction);

        await createCompleted({
      variables: {
        actionId: CREATE_COMPLETED_FOR_TASK_INFO_ACTION_ID,
        executionParameters: JSON.stringify({
          parentInstanceId: newTaskData.instanceId,
          value: 'false',
        }),
        unrestricted: false,
      },
      refetchQueries,
    });


    updateTaskValue('');
    updateLoading(false);
  }

  function handleKeyPress(e) {
    if (e.charCode === 13) {
      handleSubmit(e);
    }
  }

  return (
    <Form>
      <label htmlFor="task-value">
        Task:
        <input
          id="task-value"
          type="text"
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          value={taskValue}
          disabled={loading}
        />
      </label>
      <Button type="submit"  disabled={loading}  onClick={handleSubmit}>
        {
          loading
            ? 'Creating Task...'
            : 'Create Task'
        }
      </Button>
    </Form>
  );
}

export default compose(
  graphql(EXECUTE_ACTION, { name: 'createTask' }),
  graphql(EXECUTE_ACTION, { name: 'createCompleted' }),
)(TaskCreationForm);
