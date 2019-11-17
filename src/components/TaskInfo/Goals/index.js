import React from 'react';
import styled from 'styled-components';

import GoalCreationForm from '../GoalCreationForm';
import Goal from '../Goal';

const GoalsStyleWrapper = styled.div``;

function Goals({ goals, stepId, currentTodoId, onUpdate, refetchQueries }) {
  return (
    <GoalsStyleWrapper>
      <GoalCreationForm
        parentId={stepId}
        refetchQueries={refetchQueries}
      />

      {goals.map(goal => (
        <Goal
          key={goal.id}
          goal={goal}
          onUpdate={onUpdate}
          parentId={stepId}
          refetchQueries={refetchQueries}
        />
      ))}
    </GoalsStyleWrapper>
  );
}

export default Goals;
