import React, { PureComponent } from 'react'

import styles from '../../assets/styles'

import { PrizesIcon } from '../../assets/icons'

import moment from 'moment';
import Chart from 'chart.js';

import Dialog from 'material-ui/Dialog';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';

class PrizeCard extends PureComponent {
  checkEnabled() {
    const prize = this.props.prize
    if (!!prize.due_date && prize.due_date < moment().valueOf())
      return false
    if (prize.stock !== null && prize.stock === 0)
      return false
    return true
  }
  render() {
    console.log(this.props.prize)
    if (this.props.open) {
      const prize = this.props.prize
      const enabled = this.checkEnabled()
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
            subtitle={enabled ? 'Habilitado' : 'No habilitado'}
            avatar={<PrizesIcon fill={styles.color.primary} height="35px" width="35px" />}
          />
          <Divider />
          <CardTitle
            title={prize.description}
            subtitle={prize.type}
          />
          <CardText>
            <p><strong>Patrocina:</strong> {prize.sponsor}</p>
            <br />
            <p><strong>Notas:</strong> {prize.note ? prize.note : 'Sin notas'}</p>
            <br />
            <p>
              <strong>Creado:</strong> {moment(prize.set_date).locale('es').format("DD/MM/YYYY")}
              <strong> Última edición:</strong> {prize.update_date ? moment(prize.update_date).locale('es').format("DD/MM/YYYY") : 'No editado'}
              <strong> Vencimiento:</strong> {prize.due_date ? moment(prize.due_date).locale('es').format("DD/MM/YYYY") : 'Sin vencimiento'}
            </p>
            <br />
            {(prize.stock !== null) ?
              <div>
                <p><strong>Stock:</strong></p>
                <GrantedChart
                  title="Stock"
                  granted={prize.total_handed}
                  total={prize.total_handed + prize.stock}
                />
              </div>
              :
              <p><strong>Stock:</strong> No corresponde</p>
            }
            <br />
            <p>
              <strong>Premio periódico:</strong>
              <span style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '15px' }}>
                <Checkbox
                  checked={prize.periodic}
                />
              </span>
            </p>

          </CardText>

          {/* <CardActions>
              <FlatButton label="Action1" />
              <FlatButton label="Action2" />
            </CardActions> */}
        </Dialog>
      )
    }
    return null
  }
}

export default PrizeCard


class GrantedChart extends PureComponent {
  onCanvasReady(node) {
    if (node)
      new Chart(node.getContext("2d"), {
        type: 'doughnut',
        data: {
          labels: ['Entregados', 'Disponibles'],
          datasets: [{
            label: '',
            data: [
              this.props.granted,
              this.props.total - this.props.granted
            ],
            backgroundColor: ['#CCCCCC', styles.color.primary],
            borderWidth: 0
          }]
        },
        options: {
          cutoutPercentage: 50,
          title: {
            display: false,
            text: this.props.title
          },
          legend: {
            display: false
          },
          tooltips: {
            enabled: true
          },
          scales: {
            xAxes: [{
              display: false,
              ticks: {
                beginAtZero: true,
              }
            }],
            yAxes: [{
              display: false,
              ticks: {
                beginAtZero: true,
              }
            }]
          },
        }
      });
  }
  render() {
    return (
      <div style={{ width: '150px', marginLeft: '20px' }}>
        <canvas ref={this.onCanvasReady.bind(this)} />
      </div>
    );
  }
}