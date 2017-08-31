import React, { Component } from 'react'

import _ from 'lodash'

import { SearchIcon } from '../../assets/icons'

import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

class PrizesToolbar extends Component {
  handleInput(e) {
    e.persist()
    _.debounce(this.props.onSearch.bind(null, e.target.value), 1000).call()
  }
  render() {
    return (
      <Paper zDepth={1}>
        <div className="prizes-toolbar">
          <div className="search-bar">
            <SearchIcon fill="#888" width="30px" height="100%" />
            <TextField
              fullWidth={true}
              hintText="Buscar"
              style={{ marginLeft: '20px' }}
              onChange={this.handleInput.bind(this)}
            />
          </div>
        </div>
      </Paper>
    );
  }
}

export default PrizesToolbar