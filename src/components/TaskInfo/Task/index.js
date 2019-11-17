import React, {useState} from 'react';
import styled from 'styled-components';
import {EXECUTE_ACTION} from '@nostack/no-stack';
import compose from '@shopify/react-compose';
import {graphql} from '@apollo/react-hoc';

import {UPDATE_TASK_FOR_TASK_INFO_ACTION_ID, DELETE_TASK_FOR_TASK_INFO_ACTION_ID, TYPE_COMPLETED_ID, TYPE_STEP_ID} from '../../../config';


import Completed from '../Completed'; 
import Steps from '../Steps'; 

// add styling here
const TaskStyleWrapper = styled.div`
  margin: 2em 1em;
  padding: 1.5em;
  border: none;
  border-radius: 10px;
  box-shadow: 5px 5px 10px #888888;
`;

const Row = styled.div`
  margin: 1em 0;
`;

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

const DeleteMenu = styled.div`
  color: red;
  margin: 1em;
  padding: 1em;
  border: 1px solid #eeeeee;
`;

function Task({task, parentId, updateInstance, deleteInstance, refetchQueries}) {
  const [taskValue, updateTaskValue] = useState(task.value);
  const [isEditMode, updateIsEditMode] = useState(false);
  const [isSaving, updateIsSaving] = useState(false);
  const [ isDeleteMode, updateIsDeleteMode ] = useState(false);
  const [ isDeleting, updateIsDeleting ] = useState(false);

  
  const completedData = task.children && task.children.find(child => child.typeId === TYPE_COMPLETED_ID);
            const completed = completedData ? completedData.instances[0] : [];
  const stepData = task.children && task.children.find(child => child.typeId === TYPE_STEP_ID);
  const steps = stepData ? stepData.instances : [];


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
        refetchQueries,
      });
    } catch (e) {
      updateIsDeleting(false);
    }
  }

  return (
    <TaskStyleWrapper isDeleting={isDeleting}>
      {isEditMode ?
        (
          <>
            <label htmlFor={task.id}>
              Task Value:
              <input
                id={task.id}
                type="text"
                value={taskValue}
                onChange={handleTaskValueChange}
                disabled={isSaving}
              />
            </label>
            <Button
              type="button"
              hoverColor="#00FF00"
              onClick={handleTaskValueSave}
              disabled={isSaving}
            >
              &#10003;
            </Button>
            <Button
              type="button"
              hoverColor="#FF0000"
              onClick={() => updateIsEditMode(false)}
              disabled={isSaving}
            >
              &#10005;
            </Button>
            <Button
              type="button"
              onClick={() => updateIsDeleteMode(true)}
            >
              &#128465;
            </Button>
          </>
        ) :
        (
          <>
            {taskValue}
            {isDeleteMode ? (
                <DeleteMenu>
                  Delete?
                  <Button
                    type="button"
                    hoverColor="#00FF00"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    &#10003;
                  </Button>
                  <Button
                    type="button"
                    hoverColor="#FF0000"
                    onClick={() => updateIsDeleteMode(false)}
                    disabled={isDeleting}
                  >
                    &#10005;
                  </Button>
                </DeleteMenu>
              ) :
              (
                <>
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
                </>
              )
            }

            
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
          </>
        )
      }
    </TaskStyleWrapper>
  );
}

export default compose(
  graphql(EXECUTE_ACTION, { name: 'updateInstance' }),
  graphql(EXECUTE_ACTION, { name: 'deleteInstance' })
)(Task);
