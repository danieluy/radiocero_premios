import React, { Component } from 'react'

import _ from 'lodash'

import styles from '../../assets/styles'

import { SearchIcon } from '../../assets/icons'

import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

class PrizesToolbar extends Component {
  constructor(props) {
    super(props);
    this.debounced = _.debounce(props.onSearch, (props.debounce || 500))
  }
  handleInput(e) {
    this.debounced(e.target.value)
  }
  render() {
    return (
      <div className="prizes-toolbar">
        <div className="search-bar">
          <SearchIcon fill={styles.color.primary} width="30px" height="100%" />
          <TextField
            fullWidth={true}
            hintText="Buscar"
            style={{ marginLeft: '20px' }}
            onChange={this.handleInput.bind(this)}
          />
        </div>
        <div className="prizes-controls">
          <div className="prizes-controls-item">
            <Checkbox
              label="Solo Habilitados"
              checked={this.props.filtersState.enabledOnly}
              onCheck={this.props.onEnabledOnlyChange}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default PrizesToolbar