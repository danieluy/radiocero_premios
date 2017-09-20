import React, { Component, PureComponent } from 'react';

import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import Subheader from 'material-ui/Subheader';

import styles from '../../assets/styles'

class Home extends Component {
  render() {
    return (
      <div>
        <div className="home-root">
          <img src="/assets/img/icon_192.png" alt="Logotipo de Radiocero" />
        </div>
        <PermissionsDescription />
      </div>
    );
  }
}

export default Home;

class PermissionsDescription extends PureComponent {
  constructor() {
    super()
    // this.permissions = [
    //   { 'Ver Usuario': 'Administrador' },
    //   { 'Crear Usuario': 'Administrador' },
    //   { 'Editar Usuario': 'Administrador' },
    //   { 'Eliminar Usuario': 'Administrador' }
    // ]

    this.permissions = [
      {
        'Usuarios': {
          create: 'Administrador',
          read: 'Administrador',
          update: 'Administrador',
          delete: 'Administrador'
        }
      }, {
        'Premios': {
          create: 'Usuarios',
          read: 'Usuarios',
          update: 'Usuarios',
          delete: 'Administrador'
        }
      }, {
        'Ganadores': {
          create: 'Usuarios',
          read: 'Usuarios',
          update: 'Usuarios',
          delete: 'Usuarios'
        }
      }
    ]
  }
  render() {
    return (
      <div>
        <Subheader>Descripcíon de Permisos</Subheader>
        <p style={{ padding: '0 16px', color: styles.color.grey500 }}>
          <small>Acceso a los principales tipos de datos por tipo de usuario</small>
        </p>
        <Table>
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}
          >
            <TableRow>
              <TableHeaderColumn></TableHeaderColumn>
              <TableHeaderColumn>Crear</TableHeaderColumn>
              <TableHeaderColumn>Leer</TableHeaderColumn>
              <TableHeaderColumn>Editar</TableHeaderColumn>
              <TableHeaderColumn>Eliminar</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={false}
          >
            {this.permissions.map((row, i) => {
              const key = Object.keys(row)[0]
              return (
                <TableRow key={i}>
                  <TableRowColumn>{key}</TableRowColumn>
                  <TableRowColumn>{row[key].create}</TableRowColumn>
                  <TableRowColumn>{row[key].read}</TableRowColumn>
                  <TableRowColumn>{row[key].update}</TableRowColumn>
                  <TableRowColumn>{row[key].delete}</TableRowColumn>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    )
  }
}