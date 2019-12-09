import React, { Component, createRef } from 'react';
import { Unit } from '@nostack/no-stack';
import styled from 'styled-components';
import { v4 } from 'uuid';

import { flattenData } from '../../../flattenData';

import ProjectCreationForm from '../ProjectCreationForm';
import Project from '../Project';

import { SOURCE_PROJECTS_FOR_USER_ID } from '../../../config';
import { PROJECTS_FOR_USER_RELATIONSHIPS, SOURCE_PROJECTS_FOR_USER_QUERY } from '../../source-props/projectsForUser';

// add styling here
const ProjectsStyleWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
`;

class Projects extends Component {
  state = {
    selectedProjectId: null,
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
      this.setState({ selectedProjectId: null });
    }
  }

  handleSelect = id => this.setState({ selectedProjectId: id });

  render() {
    const { userId } = this.props;
    const { selectedProjectId } = this.state;

    const parameters = {
      __currentUser__: userId,
    };

    return (
      <Unit
        id={SOURCE_PROJECTS_FOR_USER_ID}
        typeRelationships={PROJECTS_FOR_USER_RELATIONSHIPS}
        query={SOURCE_PROJECTS_FOR_USER_QUERY}
        parameters={parameters}
      >
        {({loading, error, data, refetchQueries}) => {
          if (loading) return 'Loading...';

          if (error) {
            console.error(error);
            return `Error: ${error.graphQLErrors}`
          };

          const projects = data.unitData.map(el => flattenData(el));

          return (
            <>
              <ProjectCreationForm  userId={userId} refetchQueries={refetchQueries}/>
              <ProjectsStyleWrapper ref={this.wrapperRef} onClick={this.handleClick}>
                {projects && projects.map(project => (
                  <Project
                    key={v4()}
                    parentId={userId}
                    project={project}
                    selected={project.id === selectedProjectId}
                    refetchQueries={refetchQueries}
                    onSelect={this.handleSelect}
                  />
                ))}
              </ProjectsStyleWrapper>
            </>
          );
        }}
      </Unit>
    );
  }
}

export default Projects;
