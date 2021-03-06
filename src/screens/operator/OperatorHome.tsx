import React from 'react';
import { FlatList } from 'react-native';
import { connect, ThunkDispatch } from 'react-redux';
import { ThemeProvider, Header, Card, Text } from 'react-native-elements';
import styled from 'styled-components/native';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';

import { appTheme } from '../../styles/appTheme';
import { AtmCard, CustomHeader } from '../../components/';
import t from '../../common/Translator';
import * as Utils from '../../common/Utils';
import {
  increaseNoteAmount,
  decreaseNoteAmount,
} from '../../store/notes/Actions';
import { NoteState, ValidNote, NoteActioTypes } from '../../store/notes/Types';
import { AppState } from '../../store';

/**
 * Styled Components
 */
const CenteredView = styled.View`
  align-items: center;
`;

/**
 * Interfaces
 */
interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  increaseNoteAmount: typeof increaseNoteAmount;
  decreaseNoteAmount: typeof decreaseNoteAmount;
  notes: NoteState;
}

/**
 * Main tab screen of Operators use-case.
 * Operator may check and edit the notes in the atm.
 */
class OperatorHomeComponent extends React.Component<Props> {
  renderItem = (key: string) => {
    let bankNote = parseInt(key) as ValidNote;
    let piece = this.props.notes[key];
    return (
      <AtmCard
        title={`${Utils.numberWithSeparator(bankNote)} Ft`}
        controls={true}
        contentLeft={`${piece} pc`}
        contentRight={`${Utils.numberWithSeparator(bankNote * piece)} Ft`}
        onDecPressed={() => this.props.decreaseNoteAmount(bankNote)}
        onIncPressed={() => this.props.increaseNoteAmount(bankNote)}
      />
    );
  };

  renderSum = () => {
    return (
      <Card
        title={t._('TOTAL AMOUNT (HUF)')}
        containerStyle={{ marginBottom: 10 }}>
        <CenteredView>
          <Text>{Utils.calculateTotalAmount(this.props.notes)}</Text>
        </CenteredView>
      </Card>
    );
  };

  render() {
    return (
      //@ts-ignore
      <ThemeProvider theme={appTheme}>
        <CustomHeader
          title={t._('ATM Balance')}
          onBackPressed={() => this.props.navigation.navigate('OnBoarding')}
        />
        {this.renderSum()}
        <FlatList
          data={Object.keys(this.props.notes)}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => this.renderItem(item)}
          keyExtractor={(item: any, index: any) => `${item.amount}${index}`}
        />
      </ThemeProvider>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    notes: state.noteState.notes,
    transactionState: state.transactionState.transactions,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, any>) => {
  return {
    increaseNoteAmount: (note: ValidNote) => dispatch(increaseNoteAmount(note)),
    decreaseNoteAmount: (note: ValidNote) => dispatch(decreaseNoteAmount(note)),
  };
};

const OperatorHome = connect(
  mapStateToProps,
  mapDispatchToProps,
)(OperatorHomeComponent);

export { OperatorHome };
