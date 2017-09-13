import React, { Component, PureComponent } from 'react';

import { getPrizesGroup } from '../../radiocero-api'

import styles from '../../assets/styles'

import { WinnersIcon, FacebookIcon, PhoneIcon, EmailIcon } from '../../assets/icons'

import { formatCI, getFullGender } from '../../local-utils'

import Clipboard from 'clipboard'
import moment from 'moment';

import Dialog from 'material-ui/Dialog';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

class WinnerCard extends Component {
  render() {
    console.log(this.props.winner)
    if (this.props.open) {
      const winner = this.props.winner
      return (
        <Dialog
          modal={false}
          open={this.props.open}
          onRequestClose={this.props.onClose}
          contentStyle={styles.dialog}
          autoScrollBodyContent={true}
        >
          <CardHeader
            title={winner.gender && winner.gender === 'F' ? 'Detalles de la ganadora' : 'Detalles del ganador'}
            //subtitle={'No habilitado'}
            avatar={<WinnersIcon fill={styles.color.primary} height="35px" width="35px" />}
          />
          <Divider />
          <CardTitle
            title={`${winner.name} ${winner.lastname}`}
            subtitle={formatCI(winner.ci)}
          />
          <CardText>
            <p><strong>Sexo:</strong> {getFullGender(winner.gender)}</p>
            <br />
            <p>
              <strong>Creado:</strong> {moment(winner.set_date).locale('es').format("DD/MM/YYYY")}
              <strong> Última edición:</strong> {winner.update_date ? moment(winner.update_date).locale('es').format("DD/MM/YYYY") : 'No editado'}
            </p>
            <br />
            <div className="winner-card-contact-link">
              <WinnerCardAction
                link={winner.mail}
                protocol={'mailto:'}
                actionName="Enviar Email"
                target="_self"
                copyText="Copiar Email"
                onQuickNotice={this.props.onQuickNotice}
              >
                <EmailIcon width="30px" height="30px" />
              </WinnerCardAction>
              <WinnerCardAction
                link={winner.phone}
                protocol={'tel:'}
                actionName="Llamar"
                target="_self"
                copyText="Copiar Teléfono"
                onQuickNotice={this.props.onQuickNotice}
              >
                <PhoneIcon width="30px" height="30px" />
              </WinnerCardAction>
              <WinnerCardAction
                link={winner.facebook}
                protocol={null}
                actionName="Abrir Link"
                target="_balnk"
                copyText="Copiar Link"
                onQuickNotice={this.props.onQuickNotice}
              >
                <FacebookIcon width="24px" height="30px" />
              </WinnerCardAction>
            </div>
            <WinnerPrizes
              prizes={winner.prizes}
            />

            {/* <p>
              <strong>Creado:</strong> {moment(winner.set_date).locale('es').format("DD/MM/YYYY")}
              <strong> Última edición:</strong> {winner.update_date ? moment(winner.update_date).locale('es').format("DD/MM/YYYY") : 'No editado'}
              <strong> Vencimiento:</strong> {winner.due_date ? moment(winner.due_date).locale('es').format("DD/MM/YYYY") : 'Sin vencimiento'}
            </p>
            <br />
            {(winner.stock !== null) ?
              <div className="prize-card-stock-wrapper">
                <p><strong>Stock:</strong></p>
                <StockChart
                  title="Stock"
                  granted={winner.total_handed}
                  total={winner.total_handed + winner.stock}
                />
                <div className="prize-card-stock-wrapper-counter">
                  <div className="prize-card-stock-wrapper-counter-stock">{winner.stock}</div>
                  <div className="prize-card-stock-wrapper-counter-total">{winner.total_handed + winner.stock}</div>
                </div>
              </div>
              :
              <p><strong>Stock:</strong> No corresponde</p>
            }
            <br />
            <div>
              <strong>Premio periódico:</strong>
              <span style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '15px' }}>
                <Checkbox checked={winner.periodic} />
              </span>
            </div> */}

          </CardText>

          <CardActions>
            <RaisedButton label="Otorgar este premio" primary={true} disabled={true} />
            <FlatButton label="Cancelar" onClick={this.props.onClose} />
          </CardActions>
        </Dialog>
      )
    }
    return null
  }
}

export default WinnerCard;


class WinnerPrizes extends PureComponent {
  constructor(){
    super()
    
  }
  componentDidMount() {
    getPrizesGroup(this.props.prizes.map(prize => prize.id))
      .then(res => { console.log(res) })
  }
  render() {
    return (
      <div>
        <pre>{JSON.stringify(this.props.prizes, null, 2)}</pre>
      </div>
    )
  }
}



import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

class WinnerCardAction extends PureComponent {
  constructor() {
    super()
    this.state = {
      openPopover: false,
      anchorEl: null
    }
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.setClipboard = this.setClipboard.bind(this)
  }
  handleOpen(evt) {
    if (typeof evt.preventDefault === 'function')
      evt.preventDefault();
    this.setState({
      openPopover: true,
      anchorEl: evt.currentTarget
    })
  }
  handleClose() {
    this.setState({
      openPopover: false,
      anchorEl: null
    })
  }
  setClipboard(node) {
    if (node) {
      const clipboard = new Clipboard(node)
      clipboard.on('success', (e) => {
        console.log('Copied text:', e.text)
        e.clearSelection()
        this.handleClose()
        this.props.onQuickNotice(`Texto copiado`)
      })
      clipboard.on('error', (e) => {
        this.handleClose()
        this.props.onQuickNotice('Error copiando texto')
      })
    }
  }
  render() {
    const childrenWithProps = React.cloneElement(
      this.props.children,
      {
        onClick: this.handleOpen,
        style: this.props.link ? { cursor: 'pointer' } : { cursor: 'default', pointerEvents: 'none' },
        fill: this.props.link ? styles.color.primary : styles.color.grey300,
        className: "winner-card-action-icon"
      }
    )
    return (
      <span className="winner-card-action">
        {childrenWithProps}
        {this.props.link ?
          <Popover
            open={this.state.openPopover}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            targetOrigin={{ horizontal: 'left', vertical: 'top' }}
            onRequestClose={this.handleClose}
            canAutoPosition={true}
          >
            <Menu>
              <MenuItem>
                <a
                  href={`${this.props.protocol ? this.props.protocol : ''}${this.props.link}`}
                  style={{ cursor: 'pointer' }}
                  target={this.props.target}
                  className="winner-card-action-link"
                >
                  {this.props.actionName}
                </a>
              </MenuItem>
              <MenuItem style={{ pointerActions: 'none' }}>
                <span ref={this.setClipboard} data-clipboard-text={this.props.link}>{this.props.copyText}</span>
              </MenuItem>
            </Menu>
          </Popover>
          : null
        }
      </span>
    )
  }
}
