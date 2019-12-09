import React, { Component, createRef } from 'react';
import { Unit } from '@nostack/no-stack';
import styled from 'styled-components';
import { v4 } from 'uuid';

import { flattenData } from '../../../flattenData';

import TaskCreationForm from '../TaskCreationForm';
import Task from '../Task';

import { SOURCE_TASK_INFO_ID } from '../../../config';
import { TASK_INFO_RELATIONSHIPS, SOURCE_TASK_INFO_QUERY } from '../../source-props/taskInfo';

// add styling here
const TasksStyleWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
`;

class Tasks extends Component {
  state = {
    selectedTaskId: null,
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
      this.setState({ selectedTaskId: null });
    }
  }

  handleSelect = id => this.setState({ selectedTaskId: id });

  render() {
    const { projectId } = this.props;
    const { selectedTaskId } = this.state;

    const parameters = {
      currentProjectId: projectId,
    };

    return (
      <Unit
        id={SOURCE_TASK_INFO_ID}
        typeRelationships={TASK_INFO_RELATIONSHIPS}
        query={SOURCE_TASK_INFO_QUERY}
        parameters={parameters}
      >
        {({loading, error, data, refetchQueries}) => {
          if (loading) return 'Loading...';

          if (error) {
            console.error(error);
            return `Error: ${error.graphQLErrors}`
          };

          const tasks = data.unitData.map(el => flattenData(el));

          return (
            <>
              <TaskCreationForm  projectId={projectId} refetchQueries={refetchQueries}/>
              <TasksStyleWrapper ref={this.wrapperRef} onClick={this.handleClick}>
                {tasks && tasks.map(task => (
                  <Task
                    key={v4()}
                    parentId={projectId}
                    task={task}
                    selected={task.id === selectedTaskId}
                    refetchQueries={refetchQueries}
                    onSelect={this.handleSelect}
                  />
                ))}
              </TasksStyleWrapper>
            </>
          );
        }}
      </Unit>
    );
  }
}

export default Tasks;
