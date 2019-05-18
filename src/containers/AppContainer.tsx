import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MuiThemeProvider } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import LeftContainer from './LeftContainer';
import MainContainer from './MainContainer';
import theme from '../components/theme';
import { loadInitData } from '../actions/components';
import { ComponentInt, ComponentsInt, ChildInt } from '../utils/interfaces';

type Props = {
  components: ComponentsInt;
  focusComponent: ComponentInt;
  totalComponents: number;
  loading: boolean;
  selectableChildren: Array<number>;
  loadInitData: any;
};

const mapStateToProps = (store: any) => ({
  components: store.workspace.components,
  totalComponents: store.workspace.totalComponents,
  focusComponent: store.workspace.focusComponent,
  loading: store.workspace.loading,
  selectableChildren: store.workspace.selectableChildren,
});

const mapDispatchToProps = { loadInitData };

class AppContainer extends Component<Props> {
  state = {
    width: 25,
    rightColumnOpen: true,
  };

  componentDidMount() {
    this.props.loadInitData();
  }

  render(): JSX.Element {
    const { components, focusComponent, loading, selectableChildren } = this.props;
    const { width, rightColumnOpen } = this.state;

    // uses component childIds and parentIds arrays (numbers) to build component-filled children and parents arrays
    //const updatedComponents = convertIdsToObjs(components);

    return (
      <MuiThemeProvider theme={theme}>
        <div className="app-container">
          <LeftContainer
            components={components}
            focusComponent={focusComponent}
            selectableChildren={selectableChildren}
          />
          <MainContainer
            components={components}
            // width={width}
            // rightColumnOpen={rightColumnOpen}
          />
          {loading ? (
            <div
              style={{
                alignSelf: 'flex-end',
                position: 'fixed',
                width: '100%',
              }}
            >
              <LinearProgress color="secondary" />
            </div>
          ) : null}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppContainer);
