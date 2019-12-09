import React, { Component, createRef } from 'react';
import styled from 'styled-components';
import { v4 } from 'uuid';

import GoalCreationForm from '../GoalCreationForm';
import Goal from '../Goal';

const GoalsStyleWrapper = styled.div``;

const Button = styled.button`
  display: block;
  margin: 0 auto;
`;

class Goals extends Component {
  state = {
    selectedGoalId: null,
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
      this.setState({ selectedGoalId: null });
    }
  }

  handleSelect = id => this.setState({ selectedGoalId: id });

  render () {
    const { stepId, goals, refetchQueries, onUpdate } = this.props;
    const { selectedGoalId } = this.state;

    return (
      <GoalsStyleWrapper ref={this.wrapperRef} onClick={this.handleClick}>
        <GoalCreationForm
          parentId={stepId}
          refetchQueries={refetchQueries}
        />

        {goals.map(goal => (
          <Goal
            key={v4()}
            goal={goal}
            selected={goal.id === selectedGoalId}
            onUpdate={onUpdate}
            parentId={stepId}
            refetchQueries={refetchQueries}
            onSelect={this.handleSelect}
          />
        ))}
      </GoalsStyleWrapper>
    )
  }
}

export default Goals;
