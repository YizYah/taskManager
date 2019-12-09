import React, { useState } from 'react';
import { Unit } from '@nostack/no-stack';
import styled from 'styled-components';
import Select from 'react-select';

import { flattenData } from '../../../flattenData';

import { SOURCE_ALL_USERS_ID } from '../../../config';
import { ALL_USERS_RELATIONSHIPS, SOURCE_ALL_USERS_QUERY } from '../../source-props/allUsers';

// add styling here
const UserSelectStyleWrapper = styled.div``;

const Button = styled.button`
  margin-left: 1em;
`;

function UserSelect({ id, onSubmit, disabled }) {
  const [selected, updateSelected] = useState();

  const handleChange = option => updateSelected(option);

  const handleSubmit = async () => {
    if (!selected || !selected.value || !selected.label ) {
      return;
    }

    await onSubmit(selected.value);

    updateSelected(null);
  }

  const parameters = {};

  return (
    <Unit
      id={SOURCE_ALL_USERS_ID}
      typeRelationships={ALL_USERS_RELATIONSHIPS}
      query={SOURCE_ALL_USERS_QUERY}
      parameters={parameters}
    >
      {({loading, error, data, refetchQueries}) => {
        if (loading) return 'Loading...';

        if (error) {
          console.error(error);
          return `Error: ${error.graphQLErrors}`
        };

        const users = data.unitData.map(el => flattenData(el));

        const options = users.map(user => ({
          value: user.id,
          label: user.value,
        }));

        return (
          <UserSelectStyleWrapper>
            <Select
              inputId={id}
              isClearable={true}
              value={selected}
              onChange={handleChange}
              options={options}
              isDisabled={disabled}
            />
            <Button
              onClick={handleSubmit}
              disabled={disabled
                || !selected
                || !selected.value}
            >
              Add User
            </Button>
          </UserSelectStyleWrapper>
        );
      }}
    </Unit>
  );
}

export default UserSelect;
