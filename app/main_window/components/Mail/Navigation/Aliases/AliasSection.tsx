import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// COMPONENTS
import AliasModal from './Modal/AliasModal';
import NamespaceBlock from './NamespaceBlock';

// INTERNATIONALIZATION
import i18n from '../../../../../i18n/i18n';

// TYPESCRIPT TYPES
import { StateType } from '../../../../reducers/types';

type Props = {};

export default function AliasSection(props: Props) {
  const dispatch = useDispatch();

  const [showAliasModal, setShowAliasModal] = useState(false);
  const [editAlias, setEditAlias] = useState(null);
  const namespaceKeys = useSelector(
    (state: StateType) => state.mail.namespaces.allIds
  );

  const handleHideAliasModal = () => {
    setShowAliasModal(false);
  };

  const handleNewAlias = () => {
    setEditAlias(null);
    setShowAliasModal(true);
  };

  const handleEditAlias = (alias, e) => {
    e.stopPropagation();
    setEditAlias(alias);
    setShowAliasModal(true);
  };

  return (
    <>
      <NamespaceBlock
        handleNewAlias={handleNewAlias}
        handleEditAlias={handleEditAlias}
      />
      <AliasModal show={showAliasModal} onHide={handleHideAliasModal} />
    </>
  );
}
