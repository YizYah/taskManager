import React, { useState } from 'react';
import styled from 'styled-components';
import { graphql } from '@apollo/react-hoc';
import { EXECUTE_ACTION } from '@nostack/no-stack';

import {UPDATE_COMPLETED_FOR_TASK_INFO_ACTION_ID} from '../../../config';

// add styling here
const CompletedStyleWrapper = styled.span`
  margin-left: 1.5em;
  display: inline-block;
  border: 1px solid #eeeeee;
  padding: 0.5em;
`;

function Completed({ completed, label, updateInstance, refetchQueries, disabled = false }) {
  const [ completedValue, updateCompletedValue ] = useState(completed.value);

  async function handleCompletedValueChange() {
    const value = completedValue === 'true' ? 'false' : 'true';

    updateCompletedValue(value);

    await updateInstance({
      variables: {
        actionId: UPDATE_COMPLETED_FOR_TASK_INFO_ACTION_ID,
        executionParameters: JSON.stringify({
          value,
          instanceId: completed.id,
        }),
        unrestricted: false,
      },
      refetchQueries,
    });
  }

  return (
    <CompletedStyleWrapper>
      <label htmlFor={completed.id}>
        {label}
        <input
          id={completed.id}
          type="checkbox"
          checked={completedValue === 'true'}
          onChange={handleCompletedValueChange}
          disabled={disabled}
        />
      </label>
    </CompletedStyleWrapper>
  );
}

export default graphql(EXECUTE_ACTION, { name: 'updateInstance' })(Completed);
