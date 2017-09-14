import React, { PureComponent } from 'react'

import { getPrizesGroup } from '../../radiocero-api'

import { PrizesIcon } from '../../assets/icons'

import styles from '../../assets/styles'

import moment from 'moment';

import Checkbox from 'material-ui/Checkbox';

class WinnerPrizes extends PureComponent {
  constructor() {
    super()
    this.state = {
      prizes: null,
      prizesToShow: null,
      showAll: false
    }
    this.toggleShowall = this.toggleShowall.bind(this)
    this.filterPrizesToShow = this.filterPrizesToShow.bind(this)
    this.renderPrizes = this.renderPrizes.bind(this)
  }
  componentWillMount() {
    getPrizesGroup(this.props.prizes.map(prize => prize.id))
      .then(fullPrizes => {
        this.setState({
          prizes: this.matchAndMergePrizesInfo(fullPrizes, this.props.prizes).sort((a, b) => a.granted > b.granted)
        }, this.filterPrizesToShow)
      })
  }
  filterPrizesToShow() {
    if (!this.state.showAll) {
      this.setState({
        prizesToShow: this.state.prizes.filter(prize => !prize.handed)
      })
    }
    else {
      this.setState({
        prizesToShow: this.state.prizes
      })
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
  renderPrizes() {
    if (this.state.prizesToShow && this.state.prizesToShow.length) {
      return this.state.prizesToShow.map((prize, i) => {
        return (
          <div key={i} className="winner-prize-item">
            <pre key={i}>{JSON.stringify(prize, null, 2)}</pre>
          </div>
        )
      })
    }
    return 'Todos los premios han sido enrtegados'
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
        {this.renderPrizes()}
      </div>
    )
  }
}

export default WinnerPrizes