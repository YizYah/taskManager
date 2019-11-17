import React, { useState } from 'react';
import { graphql } from '@apollo/react-hoc';
import styled from 'styled-components';
import { withNoStack, EXECUTE_ACTION } from '@nostack/no-stack';
import compose from '@shopify/react-compose';

import { CREATE_PROJECT_FOR_PROJECTS_FOR_USER_ACTION_ID } from '../../../config';

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

function ProjectCreationForm({ userId, createProject, refetchQueries }) {
  const [ projectValue, updateProjectValue ] = useState('');
  const [ loading, updateLoading ] = useState(false);

  function handleChange(e) {
    updateProjectValue(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!projectValue) {
      return;
    }

    updateLoading(true);

    const createProjectResponse = await createProject({
      variables: {
        actionId: CREATE_PROJECT_FOR_PROJECTS_FOR_USER_ACTION_ID,
        executionParameters: JSON.stringify({
          parentInstanceId: userId,
          value: projectValue,
        }),
        unrestricted: false,
      },
      refetchQueries
    });

    const newProjectData = JSON.parse(createProjectResponse.data.ExecuteAction);

    

    updateProjectValue('');
    updateLoading(false);
  }

  function handleKeyPress(e) {
    if (e.charCode === 13) {
      handleSubmit(e);
    }
  }

  return (
    <Form>
      <label htmlFor="project-value">
        Project:
        <input
          id="project-value"
          type="text"
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          value={projectValue}
          disabled={loading}
        />
      </label>
      <Button type="submit"  disabled={loading}  onClick={handleSubmit}>
        {
          loading
            ? 'Creating Project...'
            : 'Create Project'
        }
      </Button>
    </Form>
  );
}

export default compose(
  graphql(EXECUTE_ACTION, { name: 'createProject' }),
)(ProjectCreationForm);
