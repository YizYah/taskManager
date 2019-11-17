import React, {useState} from 'react';
import styled from 'styled-components';
import {EXECUTE_ACTION} from '@nostack/no-stack';
import compose from '@shopify/react-compose';
import {graphql} from '@apollo/react-hoc';

import {UPDATE_STEP_FOR_TASK_INFO_ACTION_ID, DELETE_STEP_FOR_TASK_INFO_ACTION_ID, TYPE_GOAL_ID, TYPE_USER_ID} from '../../../config';


import Goals from '../Goals'; 
import Users from '../Users'; 

// add styling here
const StepStyleWrapper = styled.div`
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

function Step({step, parentId, updateInstance, deleteInstance, refetchQueries}) {
  const [stepValue, updateStepValue] = useState(step.value);
  const [isEditMode, updateIsEditMode] = useState(false);
  const [isSaving, updateIsSaving] = useState(false);
  const [ isDeleteMode, updateIsDeleteMode ] = useState(false);
  const [ isDeleting, updateIsDeleting ] = useState(false);

  
  const goalData = step.children && step.children.find(child => child.typeId === TYPE_GOAL_ID);
  const goals = goalData ? goalData.instances : [];
  const userData = step.children && step.children.find(child => child.typeId === TYPE_USER_ID);
  const users = userData ? userData.instances : [];


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

  return (
    <StepStyleWrapper isDeleting={isDeleting}>
      {isEditMode ?
        (
          <>
            <label htmlFor={step.id}>
              Step Value:
              <input
                id={step.id}
                type="text"
                value={stepValue}
                onChange={handleStepValueChange}
                disabled={isSaving}
              />
            </label>
            <Button
              type="button"
              hoverColor="#00FF00"
              onClick={handleStepValueSave}
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
            {stepValue}
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
          </>
        )
      }
    </StepStyleWrapper>
  );
}

export default compose(
  graphql(EXECUTE_ACTION, { name: 'updateInstance' }),
  graphql(EXECUTE_ACTION, { name: 'deleteInstance' })
)(Step);
