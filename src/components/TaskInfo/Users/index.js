import React from 'react';
import styled from 'styled-components';

import UserCreationForm from '../UserCreationForm';
import User from '../User';

const UsersStyleWrapper = styled.div``;

function Users({ users, stepId, refetchQueries }) {
  return (
    <UsersStyleWrapper>
      <UserCreationForm
        parentId={stepId}
        refetchQueries={refetchQueries}
      />

      {users.map(user => (
        <User
          key={user.id}
          user={user}
          parentId={stepId}
          refetchQueries={refetchQueries}
        />
      ))}
    </UsersStyleWrapper>
  );
}

export default Users;
