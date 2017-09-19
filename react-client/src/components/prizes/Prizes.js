import React, { PureComponent } from 'react';

import { getPrizes } from '../../radiocero-api'
import events from '../../events'
import { checkEnabled } from '../../local-utils'

import { removeVowelAccent } from 'ds-mini-utils'
import moment from 'moment';
import _ from 'lodash'

import styles from '../../assets/styles'

import AddPrizeForm from './AddPrizeForm'
import EditPrizeForm from './EditPrizeForm'
import DeletePrizeForm from './DeletePrizeForm'
import PrizeCard from './PrizeCard'
import PrizesToolbar from './PrizesToolbar'

import { PrizesIcon } from '../../assets/icons'

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

class Prizes extends PureComponent {
  constructor() {
    super()
    this.state = {
      prizes: [],
      prizesToDisplay: [],
      prizeToEdit: null,
      prizeToDelete: null,
      addPrizeOpen: false,
      prizeToDisplay: null,
      filters: {
        query: null,
        enabledOnly: true
      }
    }
  }
  componentDidMount() {
    this.updatePrizes()
    events.on('login', this.updatePrizes.bind(this))
  }
  updatePrizes() {
    getPrizes()
      .then(prizes => {
        this.setState({ prizes }, this.renderPrizes)
        this.resetModals()
        this.props.onQuickNotice('Premios actualizados')
      })
      .catch(err => {
        this.props.onQuickNotice('ERROR actualizando premios')
        console.error(err)
      })
  }
  renderPrizes() {
    let prizesToDisplay = _.cloneDeep(this.state.prizes)
    if (this.state.filters.query)
      prizesToDisplay = prizesToDisplay.filter(prize => {
        const regex = new RegExp(removeVowelAccent(this.state.filters.query), 'ig')
        if (removeVowelAccent(prize.type).match(regex)) return true
        if (removeVowelAccent(prize.sponsor).match(regex)) return true
        if (removeVowelAccent(prize.description).match(regex)) return true
        if (prize.note && removeVowelAccent(prize.note).match(regex)) return true
      })
    if (this.state.filters.enabledOnly)
      prizesToDisplay = prizesToDisplay.filter(prize => {
        return checkEnabled(prize)
      })
    this.setState({ prizesToDisplay })
  }
  filterEnabledOnly() {
    const filters = _.cloneDeep(this.state.filters)
    filters.enabledOnly = !filters.enabledOnly
    this.setState({ filters }, this.renderPrizes.bind(this))
  }
  filterByQuery(query) {
    const filters = _.cloneDeep(this.state.filters)
    filters.query = (query && query !== '') ? query : null
    this.setState({ filters }, this.renderPrizes.bind(this))
  }
  resetModals() {
    this.setState({
      prizeToEdit: null,
      prizeToDelete: null,
      addPrizeOpen: false
    })
  }
  openEditPrize(prize) {
    this.setState({
      prizeToEdit: prize
    })
  }
  openDeletePrize(prize) {
    this.setState({
      prizeToDelete: prize
    })
  }
  openAddPrize() {
    this.setState({
      addPrizeOpen: true
    })
  }
  openPrizeCard(prize) {
    this.setState({
      prizeToDisplay: prize
    })
  }

  render() {
    return (
      <div className="app-container">
        <PrizesToolbar
          onSearch={this.filterByQuery.bind(this)}
          onEnabledOnlyChange={this.filterEnabledOnly.bind(this)}
          filtersState={this.state.filters}
        />
        <Subheader>
          Premios
          <small style={{ float: 'right', marginRight: 16 }}>
            Actualizado: {moment().format('DD/MM/YYYY - HH:mm')}
          </small>
          <small style={{ float: 'right', marginRight: 16 }}>
            Total mostrado: {this.state.prizesToDisplay.length}
          </small>
        </Subheader>
        <Paper zDepth={1}>
          <List>
            {this.state.prizesToDisplay.map((prize, i) => {
              return (
                <div key={i}>
                  <ListItem
                    className="prizes-item"
                    leftAvatar={<PrizesIcon width="30px" fill="#888" />}
                    primaryText={prize.description}
                    secondaryTextLines={2}
                    onClick={this.openPrizeCard.bind(this, prize)}
                    secondaryText={
                      <p>
                        <span>{prize.sponsor}</span>
                        <br />
                        {prize.due_date ? moment(prize.due_date).locale('es').format("DD/MM/YYYY") : 'Sin vencimiento'}
                      </p>
                    }
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
                        <MenuItem onClick={this.openEditPrize.bind(this, prize)}>Editar</MenuItem>
                        <MenuItem onClick={this.openDeletePrize.bind(this, prize)}>Borrar</MenuItem>
                      </IconMenu>
                    }
                  />
                  <Divider />
                </div>
              )
            })}
          </List>
        </Paper>

        <AddPrizeForm
          open={this.state.addPrizeOpen}
          prizes={this.state.prizes}
          onActionSuccess={this.updatePrizes.bind(this)}
          onActionCanceled={this.resetModals.bind(this)}
        />

        <EditPrizeForm
          open={!!this.state.prizeToEdit}
          prize={this.state.prizeToEdit}
          prizes={this.state.prizes}
          onActionSuccess={this.updatePrizes.bind(this)}
          onActionCanceled={this.resetModals.bind(this)}
        />

        <DeletePrizeForm
          prize={this.state.prizeToDelete}
          onActionSuccess={this.updatePrizes.bind(this)}
          onActionCanceled={this.resetModals.bind(this)}
        />

        <PrizeCard
          prize={this.state.prizeToDisplay}
          open={!!this.state.prizeToDisplay}
          onClose={() => { this.setState({ prizeToDisplay: null }) }}
        />

        <FloatingActionButton
          style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: '10' }}
          secondary={true}
          onClick={this.openAddPrize.bind(this)}
        >
          <ContentAdd />
        </FloatingActionButton>
      </div>
    )
  }
}

export default Prizes;