import React, { PureComponent } from 'react'

import { getPrizesGroup, handoverPrize, cancelHandoverPrize } from '../../radiocero-api'

import { PrizesIcon, CheckIcon } from '../../assets/icons'

import styles from '../../assets/styles'

import moment from 'moment';

import PrizeCard from '../prizes/PrizeCard'

import Checkbox from 'material-ui/Checkbox';
import CircularProgress from 'material-ui/CircularProgress';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import { List, ListItem } from 'material-ui/List';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

class WinnerPrizes extends PureComponent {
  constructor() {
    super()
    this.state = {
      prizes: null,
      prizesToShow: null,
      showAll: false,
      prizesLoadReady: false,
      prizeToDisplay: null
    }
    this.toggleShowall = this.toggleShowall.bind(this)
    this.filterPrizesToShow = this.filterPrizesToShow.bind(this)
    this.renderPrizes = this.renderPrizes.bind(this)
    this.setPrizesLoadReady = this.setPrizesLoadReady.bind(this)
    this.handoverPrize = this.handoverPrize.bind(this)
    this.cancelHandoverPrize = this.cancelHandoverPrize.bind(this)
  }
  componentWillMount() {
    this.setPrizesLoadReady(true)
    getPrizesGroup(this.props.winner.prizes.map(prize => prize.id))
      .then(fullPrizes => {
        this.setState({
          prizes: this.matchAndMergePrizesInfo(fullPrizes, this.props.winner.prizes).sort((a, b) => a.granted > b.granted)
        }, this.filterPrizesToShow)
      })
  }
  setPrizesLoadReady(prizesLoadReady) {
    this.setState({ prizesLoadReady })
  }
  filterPrizesToShow() {
    if (!this.state.showAll) {
      this.setState({
        prizesToShow: this.state.prizes.filter(prize => !prize.handed)
      }, this.setPrizesLoadReady.bind(null, false))
    }
    else {
      this.setState({
        prizesToShow: this.state.prizes
      }, this.setPrizesLoadReady.bind(null, false))
    }
  }
  matchAndMergePrizesInfo(prizes, status) {
    return prizes.map(prize => {
      status.forEach(prizeStatus => {
        if (prize.id === prizeStatus.id) {
          prize.handed = prizeStatus.handed
          prize.granted = prizeStatus.granted
        }
        else
          throw new Error('Incoherence found between existing prizes and granted prizes')
      });
      return prize
    })
  }
  toggleShowall() {
    this.setState({
      showAll: !this.state.showAll
    }, this.filterPrizesToShow)
  }
  handoverPrize(prizeId) {
    handoverPrize(this.props.winner.ci, prizeId)
      .then(result => {
        this.props.onQuickNotice('Premio entregado')
        this.props.onActionCanceled()
        this.props.onActionSuccess()
      })
      .catch(err => {
        console.error(err)
        this.props.onQuickNotice('ERROR al entregar premio')
      })
  }
  cancelHandoverPrize(prizeId) {
    cancelHandoverPrize(this.props.winner.ci, prizeId)
      .then(result => {
        this.props.onQuickNotice('Premio cancelado')
        this.props.onActionCanceled()
        this.props.onActionSuccess()
      })
      .catch(err => {
        console.error(err)
        this.props.onQuickNotice('ERROR al cancelar premio')
      })
  }
  renderPrizes() {
    if (this.state.prizesToShow && this.state.prizesToShow.length) {
      return this.state.prizesToShow.map((prize, i) => {
        return (
          <ListItem
            key={i}
            className="winner-prize-item"
            primaryText={prize.description}
            secondaryTextLines={1}
            secondaryText={
              <span>
                <strong>Otorgado: </strong>
                {moment(prize.granted).format('DD/MM/YYYY')}
                <strong> Entregado: </strong>
                {prize.handed ? moment(prize.handed).format('DD/MM/YYYY') : 'Pendiente'}
              </span>
            }
            onClick={() => {
              this.setState({ prizeToDisplay: prize })
            }}
            leftIcon={<PrizesIcon fill={styles.color.grey500} />}
            rightIconButton={!prize.handed ?
              <IconMenu iconButtonElement={
                <IconButton
                  touch={true}
                  tooltip="Acciones"
                  tooltipPosition="bottom-left"
                >
                  <MoreVertIcon color={styles.color.grey500} />
                </IconButton>
              }>
                <MenuItem onClick={this.handoverPrize.bind(null, prize.id)}>Entregar</MenuItem>
                <MenuItem onClick={this.cancelHandoverPrize.bind(null, prize.id)}>Devolver</MenuItem>
              </IconMenu>
              : null
            }
          />
        )
      })
    }
    return <strong>Todos los premios han sido entregados</strong>
  }
  render() {
    return (
      <div className="winner-prize-list">
        <div className="winner-prize-list-header">
          <div className="winner-prize-list-header-title">
            <PrizesIcon width="30px" fill={styles.color.primary} />
            <span>Premios</span>
          </div>
          <Checkbox
            label="Mostrar entregados"
            checked={this.state.showAll}
            onCheck={this.toggleShowall}
            style={{ width: 190 }}
            labelPosition="left"
          />
        </div>
        {this.state.prizesLoadReady
          ?
          <CircularProgress />
          :
          <List>{this.renderPrizes()}</List>
        }

        <PrizeCard
          prize={this.state.prizeToDisplay}
          open={!!this.state.prizeToDisplay}
          onClose={() => { this.setState({ prizeToDisplay: null }) }}
        />
      </div>
    )
  }
}

export default WinnerPrizes