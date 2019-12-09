import React, { useState } from 'react';
import styled from 'styled-components';
import { EXECUTE_ACTION } from '@nostack/no-stack';
import compose from '@shopify/react-compose';
import { graphql } from '@apollo/react-hoc';

import {
  UPDATE_TASK_FOR_TASK_INFO_ACTION_ID,
  DELETE_TASK_FOR_TASK_INFO_ACTION_ID, TYPE_COMPLETED_ID, TYPE_STEP_ID,
} from '../../../config';

import EditInstanceForm from '../../EditInstanceForm';
import DeleteInstanceMenu from '../../DeleteInstanceMenu';


import Completed from '../Completed'; 
import Steps from '../Steps'; 

// add styling here
const TaskStyleWrapper = styled.div(({
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

function Task({
  task,
  parentId,
  selected,
  updateInstance,
  deleteInstance,
  refetchQueries,
  onSelect,
}) {
  const [taskValue, updateTaskValue] = useState(task.value);
  const [isEditMode, updateIsEditMode] = useState(false);
  const [isSaving, updateIsSaving] = useState(false);
  const [isDeleteMode, updateIsDeleteMode] = useState(false);
  const [isDeleting, updateIsDeleting] = useState(false);

  
  const completedData = task.children && task.children.find(child => child.typeId === TYPE_COMPLETED_ID);
            const completed = completedData ? completedData.instances[0] : [];
  const stepData = task.children && task.children.find(child => child.typeId === TYPE_STEP_ID);
  const steps = stepData ? stepData.instances : [];

  if (!selected) {
    return (
      <TaskStyleWrapper onClick={() => onSelect(task.id)}>
        {taskValue}
      </TaskStyleWrapper>
    );
  }

  function handleTaskValueChange(e) {
    updateTaskValue(e.target.value);
  }

  async function handleTaskValueSave() {
    updateIsSaving(true);

    await updateInstance({
      variables: {
        actionId: UPDATE_TASK_FOR_TASK_INFO_ACTION_ID,
        executionParameters: JSON.stringify({
          value: taskValue,
          instanceId: task.id,
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
      <TaskStyleWrapper>
        <EditInstanceForm
          id={task.id}
          label="Task Value:" 
          value={taskValue}
          onChange={handleTaskValueChange}
          onSave={handleTaskValueSave}
          onCancel={handleCancelEdit}
          disabled={isSaving}
        />
      </TaskStyleWrapper>
    );
  }

  async function handleDelete() {
    updateIsDeleting(true);

    try {
      await deleteInstance({
        variables: {
          actionId: DELETE_TASK_FOR_TASK_INFO_ACTION_ID,
          executionParameters: JSON.stringify({
            parentInstanceId: parentId,
            instanceId: task.id,
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
      <TaskStyleWrapper 
        selected={selected}
        isDeleting={isDeleting}
      >
        {taskValue}
        <DeleteInstanceMenu
          onDelete={handleDelete}
          onCancel={handleCancelDelete}
          disabled={isDeleting}
        />
      </TaskStyleWrapper>
    );
  }

  return (
    <TaskStyleWrapper selected={selected}>
      {taskValue}
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

      
< Completed
              completed = { completed }
              taskId = {task.id}
              label="Completed?"
              refetchQueries={refetchQueries}
      />
< Steps
              steps = { steps }
              taskId = {task.id}
              label="Step?"
              refetchQueries={refetchQueries}
      />
    </TaskStyleWrapper>
  );
}

export default compose(
  graphql(EXECUTE_ACTION, { name: 'updateInstance' }),
  graphql(EXECUTE_ACTION, { name: 'deleteInstance' })
)(Task);
