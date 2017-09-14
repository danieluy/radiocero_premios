import React, { PureComponent } from 'react'

import Clipboard from 'clipboard'

import styles from '../../assets/styles'

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
        console.info('Copied text:', e.text)
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

export default WinnerCardAction