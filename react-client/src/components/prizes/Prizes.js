import React, { PureComponent } from 'react';

import { getPrizes } from '../../radiocero-api'
import events from '../../events'

import moment from 'moment';

import AddPrizeForm from './AddPrizeForm'
import PrizeCard from './PrizeCard'

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

class Users extends PureComponent {
  constructor() {
    super()
    this.state = {
      prizes: [],
      prizeToEdit: null,
      prizeToDelete: null,
      addPrizeOpen: false,
      prizeToDisplay: null
    }
  }
  componentDidMount() {
    this.updatePrizes()
    events.on('login', this.updatePrizes.bind(this))
  }

  updatePrizes() {
    getPrizes()
      .then(prizes => {
        this.setState({
          prizes: prizes
        })
        this.resetModals()
        this.props.onQuickNotice('Premios actualizados')
      })
      .catch(err => {
        console.error(err)
      })
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
        <List>
          <Subheader>Premios</Subheader>
          <Paper zDepth={1}>
            {this.state.prizes.map((prize, i) => {
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
                        {/* <MenuItem onClick={this.openEditPassword.bind(this, user)}>Contraseña </MenuItem> */}
                        {/* <MenuItem onClick={this.openDeleteUser.bind(this, user)}>Borrar</MenuItem> */}
                      </IconMenu>
                    }
                  />
                  <Divider />
                </div>
              )
            })}
          </Paper>
        </List>


        <AddPrizeForm
          open={this.state.addPrizeOpen}
          prizes={this.state.prizes}
          onActionSuccess={this.updatePrizes.bind(this)}
          onActionCanceled={this.resetModals.bind(this)}
        />

        <PrizeCard
          prize={this.state.prizeToDisplay}
          open={!!this.state.prizeToDisplay}
          onClose={() => { this.setState({ prizeToDisplay: null }) }}
        />

        <FloatingActionButton
          style={{ position: 'fixed', bottom: '10px', right: '10px' }}
          onClick={this.openAddPrize.bind(this)}
        >
          <ContentAdd />
        </FloatingActionButton>
      </div>
    )
  }
}

export default Users;