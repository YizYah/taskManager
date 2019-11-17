import React from 'react';
import styled from 'styled-components';

import StepCreationForm from '../StepCreationForm';
import Step from '../Step';

const StepsStyleWrapper = styled.div``;

function Steps({ steps, taskId, currentTodoId, onUpdate, refetchQueries }) {
  return (
    <StepsStyleWrapper>
      <StepCreationForm
        parentId={taskId}
        refetchQueries={refetchQueries}
      />

      {steps.map(step => (
        <Step
          key={step.id}
          step={step}
          onUpdate={onUpdate}
          parentId={taskId}
          refetchQueries={refetchQueries}
        />
      ))}
    </StepsStyleWrapper>
  );
}

export default Steps;
