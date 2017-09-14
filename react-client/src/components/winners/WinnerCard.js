import React, { Component, PureComponent } from 'react';

import { getPrizesGroup } from '../../radiocero-api'

import styles from '../../assets/styles'

import moment from 'moment';

import { WinnersIcon, FacebookIcon, PhoneIcon, EmailIcon } from '../../assets/icons'

import { formatCI, getFullGender } from '../../local-utils'

import WinnerCardAction from './WinnerCardAction'
import WinnerPrizes from './WinnerPrizes'

import Dialog from 'material-ui/Dialog';
import { CardHeader, CardTitle, CardText } from 'material-ui/Card';
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
            <WinnerPrizes
              prizes={winner.prizes}
            />
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
          </CardText>
        </Dialog>
      )
    }
    return null
  }
}

export default WinnerCard;




