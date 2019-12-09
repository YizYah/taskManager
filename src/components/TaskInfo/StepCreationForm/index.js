import React, { useState } from 'react';
import { graphql } from '@apollo/react-hoc';
import styled from 'styled-components';
import { withNoStack, EXECUTE_ACTION } from '@nostack/no-stack';
import compose from '@shopify/react-compose';

import { CREATE_STEP_FOR_TASK_INFO_ACTION_ID } from '../../../config';

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

function StepCreationForm({ parentId, createStep, refetchQueries }) {
  const [ stepValue, updateStepValue ] = useState('');
  const [ loading, updateLoading ] = useState(false);

  function handleChange(e) {
    updateStepValue(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!stepValue) {
      return;
    }

    updateLoading(true);

    const createStepResponse = await createStep({
      variables: {
        actionId: CREATE_STEP_FOR_TASK_INFO_ACTION_ID,
        executionParameters: JSON.stringify({
          parentInstanceId: parentId,
          value: stepValue,
        }),
        unrestricted: false,
      },
      refetchQueries
    });

    const newStepData = JSON.parse(createStepResponse.data.ExecuteAction);

    

    updateStepValue('');
    updateLoading(false);
  }

  function handleKeyPress(e) {
    if (e.charCode === 13) {
      handleSubmit(e);
    }
  }

  return (
    <Form>
      <label htmlFor="step-value">
        Step:
        <input
          id="step-value"
          type="text"
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          value={stepValue}
          disabled={loading}
        />
      </label>
      <Button type="submit"  disabled={loading}  onClick={handleSubmit}>
        {
          loading
            ? 'Creating Step...'
            : 'Create Step'
        }
      </Button>
    </Form>
  );
}

export default compose(
  graphql(EXECUTE_ACTION, { name: 'createStep' }),
)(StepCreationForm);
