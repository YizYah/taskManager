import React, { useState } from 'react';
import { graphql } from '@apollo/react-hoc';
import styled from 'styled-components';
import { withNoStack, EXECUTE_ACTION } from '@nostack/no-stack';

// expected: `import UserSelect from '../../AllUsers/UserSelect';`
import UserSelect from '../../AllUsers/UserSelect';
import { CREATE_USER_FOR_TASK_INFO_ACTION_ID } from '../../../config';

// change styling here
const Form = styled.div`
  margin: 2em;
  padding: 1.5em;
  border: none;
  border-radius: 5px;
  background-color: #F5F5F5;
`;

function UserCreationForm({ parentId, createUser, refetchQueries }) {
  const [ loading, updateLoading ] = useState(false);

  const handleSubmit = async value => {
    if (!value) {
      return;
    }

    updateLoading(true);

    try {
      const createUserResponse = await createUser({
        variables: {
          actionId: CREATE_USER_FOR_TASK_INFO_ACTION_ID,
          executionParameters: JSON.stringify({
            parentInstanceId: parentId,
            childInstanceId: value,
          }),
          unrestricted: false,
        },
        refetchQueries
      });
    } catch (e) {
      console.log(e);
    }

    updateLoading(false);
  }

  const selectId = `user-value-${parentId}`;

  return (
    <div>
      <label htmlFor={selectId}>
        User:
        <UserSelect
          id={selectId}
          onSubmit={handleSubmit}
          disabled={loading}
        />
      </label>
    </div>
  );
}

export default graphql(EXECUTE_ACTION, { name: 'createUser' })(UserCreationForm);
