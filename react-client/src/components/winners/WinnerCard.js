import React, { Component, PureComponent } from 'react';

import styles from '../../assets/styles'

import { WinnersIcon, FacebookIcon, PhoneIcon, EmailIcon } from '../../assets/icons'

import { formatCI } from '../../local-utils'

import Dialog from 'material-ui/Dialog';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

class WinnerCard extends Component {
  render() {
    if (this.props.open) {
      const winner = this.props.winner
      console.log('WinnerCard', winner)
      return (
        <Dialog
          modal={false}
          open={this.props.open}
          onRequestClose={this.props.onClose}
          contentStyle={styles.dialog}
          autoScrollBodyContent={true}
        >
          <CardHeader
            title='Detalles de ganador'
            //subtitle={'No habilitado'}
            avatar={<WinnersIcon fill={styles.color.primary} height="35px" width="35px" />}
          />
          <Divider />
          <CardTitle
            title={`${winner.name} ${winner.lastname}`}
            subtitle={formatCI(winner.ci)}
          />
          <CardText>
            <div className="winner-card-contact-link">
              <WinnerCardAction
                link={winner.mail}
                protocol={'mailto:'}
                actionName="Enviar Email"
                target="_self"
                copyText="Copiar Email"
              >
                <EmailIcon width="30px" height="30px" />
              </WinnerCardAction>
              <WinnerCardAction
                link={winner.phone}
                protocol={'tel:'}
                actionName="Llamar"
                target="_self"
                copyText="Copiar Teléfono"
              >
                <PhoneIcon width="30px" height="30px" />
              </WinnerCardAction>
              <WinnerCardAction
                link={winner.facebook}
                protocol={null}
                actionName="Abrir Link"
                target="_balnk"
                copyText="Copiar Link"
              >
                <FacebookIcon width="24px" height="30px" />
              </WinnerCardAction>
            </div>

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






import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

class WinnerCardAction extends PureComponent {
  constructor() {
    super()
    this.state = {
      open: false,
      anchorEl: null
    }
    this.toggleOpen = this.toggleOpen.bind(this)
  }
  toggleOpen(evt) {
    if (typeof evt.preventDefault === 'function')
      evt.preventDefault();
    this.setState({
      open: !this.state.open,
      anchorEl: evt.currentTarget
    })
  }
  render() {
    const childrenWithProps = React.cloneElement(
      this.props.children,
      {
        onClick: this.toggleOpen,
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
            open={this.state.open}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            targetOrigin={{ horizontal: 'left', vertical: 'top' }}
            onRequestClose={this.toggleOpen}
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
              <MenuItem primaryText={this.props.copyText} />
            </Menu>
          </Popover>
          : null
        }
      </span>
    )
  }
}
