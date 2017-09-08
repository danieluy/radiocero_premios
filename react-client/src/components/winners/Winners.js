import React, { PureComponent } from 'react';

import { getWinners } from '../../radiocero-api'
import events from '../../events'
import { checkEnabled, formatCI } from '../../local-utils'

import { removeVowelAccent } from 'ds-mini-utils'
import moment from 'moment';
import _ from 'lodash'

import styles from '../../assets/styles'

import AddWinnerForm from './AddWinnerForm'
import EditWinnerForm from './EditWinnerForm'
import DeleteWinnerForm from './DeleteWinnerForm'
import WinnerCard from './WinnerCard'
import WinnersToolbar from './WinnersToolbar'

import { WinnersIcon } from '../../assets/icons'

import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

class Winners extends PureComponent {
  constructor() {
    super()
    this.state = {
      winners: [],
      winnersToDisplay: [],
      winnerToEdit: null,
      winnerToDelete: null,
      addWinnerOpen: false,
      winnerToDisplay: null,
      filters: {
        query: null,
        enabledOnly: true
      }
    }
  }
  componentDidMount() {
    this.updateWinners()
    events.on('login', this.updateWinners.bind(this))
  }
  updateWinners() {
    getWinners()
      .then(winners => {
        this.setState({ winners }, this.renderWinners)
        this.resetModals()
        this.props.onQuickNotice('Ganadores actualizados')
      })
      .catch(err => {
        this.props.onQuickNotice('ERROR actualizando ganadores')
        console.error(err)
      })
  }
  renderWinners() {
    let winnersToDisplay = _.cloneDeep(this.state.winners)
    if (this.state.filters.query)
      winnersToDisplay = winnersToDisplay.filter(winner => {
        const regex = new RegExp(removeVowelAccent(this.state.filters.query), 'ig')
        if (removeVowelAccent(winner.type).match(regex)) return true
        if (removeVowelAccent(winner.sponsor).match(regex)) return true
        if (removeVowelAccent(winner.description).match(regex)) return true
        if (winner.note && removeVowelAccent(winner.note).match(regex)) return true
      })
    if (this.state.filters.enabledOnly)
      winnersToDisplay = winnersToDisplay.filter(winner => {
        return checkEnabled(winner)
      })
    this.setState({ winnersToDisplay })
  }
  filterEnabledOnly() {
    const filters = _.cloneDeep(this.state.filters)
    filters.enabledOnly = !filters.enabledOnly
    this.setState({ filters }, this.renderWinners.bind(this))
  }
  filterByQuery(query) {
    const filters = _.cloneDeep(this.state.filters)
    filters.query = (query && query !== '') ? query : null
    this.setState({ filters }, this.renderWinners.bind(this))
  }
  resetModals() {
    this.setState({
      winnerToEdit: null,
      winnerToDelete: null,
      addWinnerOpen: false
    })
  }
  openEditWinner(winner) {
    this.setState({
      winnerToEdit: winner
    })
  }
  openDeleteWinner(winner) {
    this.setState({
      winnerToDelete: winner
    })
  }
  openAddWinner() {
    this.setState({
      addWinnerOpen: true
    })
  }
  openWinnerCard(winner) {
    this.setState({
      winnerToDisplay: winner
    })
  }

  render() {
    console.log('winnersToDisplay', this.state.winnersToDisplay)
    return (
      <div className="app-container">
        <WinnersToolbar
          onSearch={this.filterByQuery.bind(this)}
          onEnabledOnlyChange={this.filterEnabledOnly.bind(this)}
          filtersState={this.state.filters}
        />
        <List>
          <Subheader>Ganadores</Subheader>
          <Paper zDepth={1}>
            {this.state.winnersToDisplay.map((winner, i) => {
              return (
                <div key={i}>
                  <ListItem
                    className="winners-item"
                    leftAvatar={<WinnersIcon width="30px" fill={styles.color.grey500} />}
                    primaryText={`${winner.name} ${winner.lastname}`}
                    secondaryTextLines={1}
                    onClick={this.openWinnerCard.bind(this, winner)}
                    secondaryText={formatCI(winner.ci)}
                    rightIconButton={
                      <IconMenu iconButtonElement={
                        <IconButton
                          touch={true}
                          tooltip="Opciones"
                          tooltipPosition="bottom-left"
                        >
                          <MoreVertIcon color={'#888'} />
                        </IconButton>
                      }>
                        <MenuItem onClick={this.openEditWinner.bind(this, winner)}>Editar</MenuItem>
                        <MenuItem onClick={this.openDeleteWinner.bind(this, winner)}>Borrar</MenuItem>
                      </IconMenu>
                    }
                  />
                  <Divider />
                </div>
              )
            })}
          </Paper>
        </List>

        <AddWinnerForm
          open={this.state.addWinnerOpen}
          winners={this.state.winners}
          onActionSuccess={this.updateWinners.bind(this)}
          onActionCanceled={this.resetModals.bind(this)}
        />

        <EditWinnerForm
          open={!!this.state.winnerToEdit}
          winner={this.state.winnerToEdit}
          winners={this.state.winners}
          onActionSuccess={this.updateWinners.bind(this)}
          onActionCanceled={this.resetModals.bind(this)}
        />

        <DeleteWinnerForm
          winner={this.state.winnerToDelete}
          onActionSuccess={this.updateWinners.bind(this)}
          onActionCanceled={this.resetModals.bind(this)}
        />

        <WinnerCard
          winner={this.state.winnerToDisplay}
          open={!!this.state.winnerToDisplay}
          onClose={() => { this.setState({ winnerToDisplay: null }) }}
        />

        <FloatingActionButton
          style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: '10' }}
          secondary={true}
          onClick={this.openAddWinner.bind(this)}
        >
          <ContentAdd />
        </FloatingActionButton>
      </div>
    )
  }
}

export default Winners;