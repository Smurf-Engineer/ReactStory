import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { MuiThemeProvider } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import BottomPanel from '../components/BottomPanel.jsx';
import theme from '../components/theme.ts';
import {
  openExpansionPanel,
  handleTransform,
  changeFocusChild,
  changeComponentFocusChild,
  deleteChild,
  deleteComponent,
  createApplication,
} from '../actions/components';
import KonvaStage from '../components/KonvaStage.jsx';
import MainContainerHeader from '../components/MainContainerHeader.jsx';
import createModal from '../utils/createModal.util.tsx';

const IPC = require('electron').ipcRenderer;

const mapDispatchToProps = dispatch => ({
  handleTransformation: (componentId, childId, { x, y, width, height }) =>
    dispatch(
      handleTransform(componentId, childId, {
        x,
        y,
        width,
        height,
      }),
    ),
  openPanel: component => dispatch(openExpansionPanel(component)),
  changeFocusChild: ({ childId }) => dispatch(changeFocusChild({ childId })),
  changeComponentFocusChild: ({ componentId, childId }) =>
    dispatch(changeComponentFocusChild({ componentId, childId })),
  deleteChild: ({}) => dispatch(deleteChild({})), // if u send no prms, function will delete focus child.
  deleteComponent: ({ componentId, stateComponents }) => dispatch(deleteComponent({ componentId, stateComponents })),
  createApp: ({ path, components, genOption }) =>
    dispatch(
      createApplication({
        path,
        components,
        genOption,
      }),
    ),
});

const mapStateToProps = store => ({
  focusComponent: store.workspace.focusComponent,
  focusChild: store.workspace.focusChild,
  stateComponents: store.workspace.components,
});

class MainContainer extends Component {
  state = {
    image: '',
    draggable: false,
    modal: null,
    genOptions: ['Export components', 'Export components with application files'],
    genOption: 0,
    draggable: false,
    toggleClass: true,
    scaleX: 1,
    scaleY: 1,
    x: undefined,
    y: undefined,
  };

  constructor(props) {
    super(props);

    IPC.on('new-file', (event, file) => {
      const image = new window.Image();
      image.src = file;
      this.props.changeImagePath(file);
      image.onload = () => {
        this.setState({ image });
      };
      this.draggableItems = [];
    });

    IPC.on('app_dir_selected', (event, path) => {
      const { components } = this.props;
      const { genOption } = this.state;
      this.props.createApp({
        path,
        components,
        genOption,
      });
    });
  }

  closeModal = () => this.setState({ modal: null });

  chooseAppDir = () => IPC.send('choose_app_dir');

  chooseGenOptions = genOption => {
    // set option
    this.setState({ genOption });
    // closeModal
    this.closeModal();
    // Choose app dir
    this.chooseAppDir();
  };

  showGenerateAppModal = () => {
    console.log('clicked on export button');
    const { closeModal, chooseGenOptions } = this;
    const { genOptions } = this.state;
    const children = (
      <List className="export-preference">
        {genOptions.map((option, i) => (
          <ListItem
            key={i}
            button
            onClick={() => chooseGenOptions(i)}
            style={{
              border: '1px solid #3f51b5',
              marginBottom: '2%',
              marginTop: '5%',
            }}
          >
            <ListItemText primary={option} style={{ textAlign: 'center' }} />
          </ListItem>
        ))}
      </List>
    );
    this.setState({
      modal: createModal({
        closeModal,
        children,
        message: 'Choose export preference:',
      }),
    });
  };

  render() {
    const { draggable, scaleX, scaleY, modal, toggleClass } = this.state;
    const {
      components,
      handleTransformation,
      openPanel,
      focusComponent,
      focusChild,
      changeFocusChild,
      changeComponentFocusChild,
      deleteChild,
      deleteComponent,
      stateComponents,
      classes,
    } = this.props;
    const { main, showGenerateAppModal } = this;
    const cursor = this.state.draggable ? 'move' : 'default';

    // show a string of all direct parents. SO the user can gaze at it.
    const directParents = !focusComponent.id
      ? 'Waiting for a focused component'
      : stateComponents
          .filter(comp => comp.childrenArray.some(kiddy => kiddy.childComponentId === focusComponent.id))
          .map(comp => comp.title)
          .join(',');

    return (
      <MuiThemeProvider theme={theme}>
        <div className="main-container" style={{ cursor }}>
          {modal}
          {/* <MainContainerHeader
            // showImageDeleteModal={showImageDeleteModal}
            showGenerateAppModal={showGenerateAppModal}
          /> */}

          <div className="main" ref={main}>
            <KonvaStage
              scaleX={1}
              scaleY={1}
              draggable={draggable}
              components={components}
              handleTransform={handleTransformation}
              openExpansionPanel={openPanel}
              focusComponent={focusComponent}
              focusChild={focusChild}
              changeFocusChild={changeFocusChild}
              changeComponentFocusChild={changeComponentFocusChild}
              deleteChild={deleteChild}
              classes={classes}
            />
          </div>
          <BottomPanel focusComponent={focusComponent} />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainContainer);
