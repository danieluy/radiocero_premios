import React, { Component } from 'react';

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
              <a
                href={winner.mail ? `mailto:${winner.mail}` : '#'}
                style={winner.mail ? { cursor: 'pointer' } : { cursor: 'default', pointerEvents: 'none' }}
              >
                <EmailIcon
                  width="30px"
                  height="30px"
                  fill={winner.mail ? styles.color.primary : styles.color.grey300}
                />
              </a>
              <a
                href={winner.phone ? `tel:${winner.phone}` : '#'}
                style={winner.phone ? { cursor: 'pointer' } : { cursor: 'default', pointerEvents: 'none' }}
              >
                <PhoneIcon
                  width="30px"
                  height="30px"
                  fill={winner.phone ? styles.color.primary : styles.color.grey300}
                />
              </a>
              <a
                href={winner.facebook ? `${winner.facebook}` : '#'}
                style={winner.facebook ? { cursor: 'pointer' } : { cursor: 'default', pointerEvents: 'none' }}
                target={winner.facebook ? "_blank" : null}
              >
                <FacebookIcon
                  width="30px"
                  height="30px"
                  fill={winner.facebook ? styles.color.primary : styles.color.grey300}
                  style={{ padding: "3px" }}
                />
              </a>
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



