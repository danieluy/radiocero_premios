import React, { PureComponent } from 'react'

import styles from '../../assets/styles'

import { PrizesIcon } from '../../assets/icons'

import Dialog from 'material-ui/Dialog';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import Divider from 'material-ui/Divider';

class PrizeCard extends PureComponent {
  render() {
    console.log(this.props.prize)
    if (this.props.open)
      return (
        <Dialog
          modal={false}
          open={this.props.open}
          onRequestClose={this.props.onClose}
          contentStyle={styles.dialog}
          autoScrollBodyContent={true}
        >
          <CardHeader
            title='Detalles de premio'
            subtitle='Habilitado'
            avatar={<PrizesIcon fill={styles.color.primary} height="35px" width="35px"/>}
          />
          <Divider />
          <CardTitle
            title={this.props.prize.description}
            subtitle={this.props.prize.type}
          />
          <CardText>
            <p><strong>Patrocina:</strong> {this.props.prize.sponsor}</p>
            <br/>
            <p><strong>Notas:</strong> {this.props.prize.note}</p>
          </CardText>
          {/* <CardActions>
              <FlatButton label="Action1" />
              <FlatButton label="Action2" />
            </CardActions> */}
        </Dialog>
      )
    return null
  }
}

export default PrizeCard