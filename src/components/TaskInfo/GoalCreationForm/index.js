import React, { useState } from 'react';
import { graphql } from '@apollo/react-hoc';
import styled from 'styled-components';
import { withNoStack, EXECUTE_ACTION } from '@nostack/no-stack';
import compose from '@shopify/react-compose';

import { CREATE_GOAL_FOR_TASK_INFO_ACTION_ID } from '../../../config';

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

function GoalCreationForm({ parentId, createGoal, refetchQueries }) {
  const [ goalValue, updateGoalValue ] = useState('');
  const [ loading, updateLoading ] = useState(false);

  function handleChange(e) {
    updateGoalValue(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!goalValue) {
      return;
    }

    updateLoading(true);

    const createGoalResponse = await createGoal({
      variables: {
        actionId: CREATE_GOAL_FOR_TASK_INFO_ACTION_ID,
        executionParameters: JSON.stringify({
          parentInstanceId: parentId,
          value: goalValue,
        }),
        unrestricted: false,
      },
      refetchQueries
    });

    const newGoalData = JSON.parse(createGoalResponse.data.ExecuteAction);

    

    updateGoalValue('');
    updateLoading(false);
  }

  function handleKeyPress(e) {
    if (e.charCode === 13) {
      handleSubmit(e);
    }
  }

  return (
    <Form>
      <label htmlFor="goal-value">
        Goal:
        <input
          id="goal-value"
          type="text"
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          value={goalValue}
          disabled={loading}
        />
      </label>
      <Button type="submit"  disabled={loading}  onClick={handleSubmit}>
        {
          loading
            ? 'Creating Goal...'
            : 'Create Goal'
        }
      </Button>
    </Form>
  );
}

export default compose(
  graphql(EXECUTE_ACTION, { name: 'createGoal' }),
)(GoalCreationForm);
