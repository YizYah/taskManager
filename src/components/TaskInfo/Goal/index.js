import React, {useState} from 'react';
import styled from 'styled-components';
import {EXECUTE_ACTION} from '@nostack/no-stack';
import compose from '@shopify/react-compose';
import {graphql} from '@apollo/react-hoc';

import {UPDATE_GOAL_FOR_TASK_INFO_ACTION_ID, DELETE_GOAL_FOR_TASK_INFO_ACTION_ID} from '../../../config';



// add styling here
const GoalStyleWrapper = styled.div`
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

function Goal({goal, parentId, updateInstance, deleteInstance, refetchQueries}) {
  const [goalValue, updateGoalValue] = useState(goal.value);
  const [isEditMode, updateIsEditMode] = useState(false);
  const [isSaving, updateIsSaving] = useState(false);
  const [ isDeleteMode, updateIsDeleteMode ] = useState(false);
  const [ isDeleting, updateIsDeleting ] = useState(false);

  


  function handleGoalValueChange(e) {
    updateGoalValue(e.target.value);
  }

  async function handleGoalValueSave() {
    updateIsSaving(true);

    await updateInstance({
      variables: {
        actionId: UPDATE_GOAL_FOR_TASK_INFO_ACTION_ID,
        executionParameters: JSON.stringify({
          value: goalValue,
          instanceId: goal.id,
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
          actionId: DELETE_GOAL_FOR_TASK_INFO_ACTION_ID,
          executionParameters: JSON.stringify({
            parentInstanceId: parentId,
            instanceId: goal.id,
          }),
        },
        refetchQueries
      });
    } catch (e) {
      updateIsDeleting(false);
    }
  }

  return (
    <GoalStyleWrapper isDeleting={isDeleting}>
      {isEditMode ?
        (
          <>
            <label htmlFor={goal.id}>
              Goal Value:
              <input
                id={goal.id}
                type="text"
                value={goalValue}
                onChange={handleGoalValueChange}
                disabled={isSaving}
              />
            </label>
            <Button
              type="button"
              hoverColor="#00FF00"
              onClick={handleGoalValueSave}
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
            {goalValue}
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

            
          </>
        )
      }
    </GoalStyleWrapper>
  );
}

export default compose(
  graphql(EXECUTE_ACTION, { name: 'updateInstance' }),
  graphql(EXECUTE_ACTION, { name: 'deleteInstance' })
)(Goal);
