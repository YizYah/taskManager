import React, { useState } from 'react';
import styled from 'styled-components';
import { EXECUTE_ACTION } from '@nostack/no-stack';
import compose from '@shopify/react-compose';
import { graphql } from '@apollo/react-hoc';

import {
  UPDATE_STEP_FOR_TASK_INFO_ACTION_ID,
  DELETE_STEP_FOR_TASK_INFO_ACTION_ID, TYPE_GOAL_ID, TYPE_USER_ID,
} from '../../../config';

import EditInstanceForm from '../../EditInstanceForm';
import DeleteInstanceMenu from '../../DeleteInstanceMenu';


import Goals from '../Goals'; 
import Users from '../Users'; 

// add styling here
const StepStyleWrapper = styled.div(({
  selected,
  isDeleting,
}) => `
  margin: 2em 1em;
  padding: 1.5em;
  border: ${selected ? '1px solid aquamarine': '1px solid white'};
  border-radius: 10px;
  box-shadow: 5px 5px 10px #888888;
  background-color: ${isDeleting && 'tomato'};
  cursor: ${selected ? 'auto' : 'pointer'};

  &:hover {
    border: 1px solid aquamarine;
  }
`);

const Button = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0;
  color: #bbbbbb;
  transition: color 0.5s ease;
  &:hover {
    color: ${props => props.hoverColor || '#000000'};
  }
`;

function Step({
  step,
  parentId,
  selected,
  updateInstance,
  deleteInstance,
  refetchQueries,
  onSelect,
}) {
  const [stepValue, updateStepValue] = useState(step.value);
  const [isEditMode, updateIsEditMode] = useState(false);
  const [isSaving, updateIsSaving] = useState(false);
  const [isDeleteMode, updateIsDeleteMode] = useState(false);
  const [isDeleting, updateIsDeleting] = useState(false);

  
  const goalData = step.children && step.children.find(child => child.typeId === TYPE_GOAL_ID);
  const goals = goalData ? goalData.instances : [];
  const userData = step.children && step.children.find(child => child.typeId === TYPE_USER_ID);
  const users = userData ? userData.instances : [];

  if (!selected) {
    return (
      <StepStyleWrapper onClick={() => onSelect(step.id)}>
        {stepValue}
      </StepStyleWrapper>
    );
  }

  function handleStepValueChange(e) {
    updateStepValue(e.target.value);
  }

  async function handleStepValueSave() {
    updateIsSaving(true);

    await updateInstance({
      variables: {
        actionId: UPDATE_STEP_FOR_TASK_INFO_ACTION_ID,
        executionParameters: JSON.stringify({
          value: stepValue,
          instanceId: step.id,
        }),
      },
      refetchQueries,
    });

    updateIsEditMode(false);
    updateIsSaving(false);
  }

  function handleCancelEdit() {
    updateIsEditMode(false);
  }

  if (isEditMode) {
    return (
      <StepStyleWrapper>
        <EditInstanceForm
          id={step.id}
          label="Step Value:" 
          value={stepValue}
          onChange={handleStepValueChange}
          onSave={handleStepValueSave}
          onCancel={handleCancelEdit}
          disabled={isSaving}
        />
      </StepStyleWrapper>
    );
  }

  async function handleDelete() {
    updateIsDeleting(true);

    try {
      await deleteInstance({
        variables: {
          actionId: DELETE_STEP_FOR_TASK_INFO_ACTION_ID,
          executionParameters: JSON.stringify({
            parentInstanceId: parentId,
            instanceId: step.id,
          }),
        },
        refetchQueries
      });
    } catch (e) {
      updateIsDeleting(false);
    }
  }

  function handleCancelDelete() {
    updateIsDeleteMode(false);
  }

  if (isDeleteMode) {
    return (
      <StepStyleWrapper 
        selected={selected}
        isDeleting={isDeleting}
      >
        {stepValue}
        <DeleteInstanceMenu
          onDelete={handleDelete}
          onCancel={handleCancelDelete}
          disabled={isDeleting}
        />
      </StepStyleWrapper>
    );
  }

  return (
    <StepStyleWrapper selected={selected}>
      {stepValue}
      <Button
        type="button"
        onClick={() => updateIsEditMode(true)}
      >
        &#9998;
      </Button>
      <Button
        type="button"
        onClick={() => updateIsDeleteMode(true)}
      >
        &#128465;
      </Button>

      
< Goals
              goals = { goals }
              stepId = {step.id}
              label="Goal?"
              refetchQueries={refetchQueries}
      />
< Users
              users = { users }
              stepId = {step.id}
              label="User?"
              refetchQueries={refetchQueries}
      />
    </StepStyleWrapper>
  );
}

export default compose(
  graphql(EXECUTE_ACTION, { name: 'updateInstance' }),
  graphql(EXECUTE_ACTION, { name: 'deleteInstance' })
)(Step);
