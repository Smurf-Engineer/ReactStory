import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import GetAppIcon from '@material-ui/icons/GetApp';
import Tooltip from '@material-ui/core/Tooltip';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import LeftColExpansionPanel from '../components/LeftColExpansionPanel';
import HTMLComponentPanel from '../components/HTMLComponentPanel';
import * as actions from '../actions/components';
import createModal from '../utils/createModal.util';

const mapDispatchToProps = dispatch => ({
  addComponent: ({ title }) => dispatch(actions.addComponent({ title })),
    dispatch(
      actions.updateComponent({
        index,
        newParentId,
        color,
        stateful,
      }),
    ),
  addChild: ({ title, childType, HTMLInfo }) => dispatch(actions.addChild({ title, childType, HTMLInfo })),
  changeFocusComponent: ({ title }) => dispatch(actions.changeFocusComponent({ title })),
  changeFocusChild: ({ childId }) => dispatch(actions.changeFocusChild({ childId })),
  deleteComponent: ({ componentId, stateComponents }) => dispatch(actions.deleteComponent({ componentId, stateComponents })),
  deleteAllData: () => dispatch(actions.deleteAllData()),
});

class LeftContainer extends Component {
  state = {
    componentName: '',
    modal: null,
    genOptions: ['Export components', 'Export components with application files'],
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleAddComponent = () => {
    this.props.addComponent({ title: this.state.componentName });
    this.setState({
      componentName: '',
    });
  };

  closeModal = () => this.setState({ modal: null });

  clearWorkspace = () => {
    this.setState({
      modal: createModal({
        message: 'Are you sure want to delete all data?',
        closeModal: this.closeModal,
        secBtnLabel: 'Clear Workspace',
        secBtnAction: () => {
          this.props.deleteAllData();
          this.closeModal();
        },
      }),
    });
  };

  chooseGenOptions = (genOption) => {
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
    const {
      components,
      updateComponent,
      deleteComponent,
      focusComponent,
      totalComponents,
      classes,
      addChild,
      changeFocusComponent,
      changeFocusChild,
      selectableChildren,
      deleteAllData,
      showGenerateAppModal,
      totalComponents,
    } = this.props;
    const { componentName, modal } = this.state;

    const componentsExpansionPanel = components
      .sort((a, b) => parseInt(b.id) - parseInt(a.id)) // sort by id value of comp
      .map((component, i) => (
        <LeftColExpansionPanel
          key={component.id}
          index={i}
          id={component.id}
          component={component}
          focusComponent={focusComponent}
          addChild={addChild}
          changeFocusComponent={changeFocusComponent}
          changeFocusChild={changeFocusChild}
          selectableChildren={selectableChildren}
        />
      ));

    return (
      <div className="column left">
        <Grid container spacing={16} alignItems="baseline" align="stretch">
          <Grid item xs={12}>
            <TextField
              id="title-input"
              label="Add class component"
              placeholder="Name of component"
              margin="normal"
              autoFocus
              onChange={this.handleChange}
              onKeyPress={ev => {
                if (ev.key === 'Enter') {
                  // Do code here
                  this.handleAddComponent();
                  ev.preventDefault();
                }
              }}
              value={componentName}
              name="componentName"
              className={classes.light}
              InputProps={{
                className: classes.input,
              }}
              InputLabelProps={{
                className: classes.input,
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <Button
              variant="fab"
              mini
              color="primary"
              className={classes.button}
              aria-label="Add"
              onClick={this.handleAddComponent}
              disabled={!this.state.componentName}
            >
              <AddIcon />
            </Button>
          </Grid>
        </Grid>
        <div className="expansionPanel">{componentsExpansionPanel}</div>
        <HTMLComponentPanel
          className={classes.htmlCompWrapper}
          focusComponent={focusComponent}
          addChild={addChild}
        />
        <Button
          color="secondary"
          aria-label="Delete All"
          variant="contained"
          onClick={this.clearWorkspace}
          disabled={totalComponents === 1}
          className={classes.clearButton}
        >
          Clear Workspace
        </Button>
        {/* <Tooltip title={'export'}>
          <div>
            <Button
              color="primary"
              variant="text"
              // variant="outlined"
              className={classes.clearButton}
              disabled={totalComponents < 1}
              onClick={this.showGenerateAppModal}
            >
              <GetAppIcon
                className={classes.light}
                style={{ paddingLeft: '5px', paddingRight: '5px' }}
              />
              Export Project
            </Button>
          </div>
        </Tooltip> */}
        {modal}
      </div>
    );
  }
}

function styles() {
  return {
    // htmlCompWrapper: {
    //   bottom: 0,
    //   height: "200px"
    // },
    cssLabel: {
      color: 'white',

      '&$cssFocused': {
        color: 'green',
      },
    },
    cssFocused: {},
    input: {
      color: '#fff',
      opacity: '0.7',
      marginBottom: '10px',
    },
    underline: {
      color: 'white',
      '&::before': {
        color: 'white',
      },
    },
    button: {
      color: '#fff',

      '&:disabled': {
        color: 'grey',
      },
    },
    clearButton: {
      top: '96%',
      position: 'sticky!important',
      zIndex: '1',

      '&:disabled': {
        color: 'grey',
        backgroundColor: '#424242',
      },
    },
  };
}

export default compose(
  withStyles(styles),
  connect(
    null,
    mapDispatchToProps,
  ),
)(LeftContainer);
