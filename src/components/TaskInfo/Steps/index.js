import React, { Component, createRef } from 'react';
import styled from 'styled-components';
import { v4 } from 'uuid';

import StepCreationForm from '../StepCreationForm';
import Step from '../Step';

const StepsStyleWrapper = styled.div``;

const Button = styled.button`
  display: block;
  margin: 0 auto;
`;

class Steps extends Component {
  state = {
    selectedStepId: null,
  };

  wrapperRef = createRef();

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick);
  }

  handleClick = e => {
    const node = this.wrapperRef.current;

    if (
      node &&
      node !== e.target && 
      !node.contains(e.target)
    ) {
      this.setState({ selectedStepId: null });
    }
  }

  handleSelect = id => this.setState({ selectedStepId: id });

  render () {
    const { taskId, steps, refetchQueries, onUpdate } = this.props;
    const { selectedStepId } = this.state;

    return (
      <StepsStyleWrapper ref={this.wrapperRef} onClick={this.handleClick}>
        <StepCreationForm
          parentId={taskId}
          refetchQueries={refetchQueries}
        />

        {steps.map(step => (
          <Step
            key={v4()}
            step={step}
            selected={step.id === selectedStepId}
            onUpdate={onUpdate}
            parentId={taskId}
            refetchQueries={refetchQueries}
            onSelect={this.handleSelect}
          />
        ))}
      </StepsStyleWrapper>
    )
  }
}

export default Steps;
