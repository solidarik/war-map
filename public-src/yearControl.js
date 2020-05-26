//todo react year changer
import * as React from 'react'
import { Range } from 'react-range'
import ReactDOM from 'react-dom'
import { EventEmitter } from './eventEmitter'
//import RangeControl from './rangeControl'

class SuperSimple extends React.Component {
  state = { values: [0, 100] }
  render() {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          margin: '0 2em',
          marginRight: '8em',
        }}
      >
        <Range
          values={this.state.values}
          step={1}
          min={0}
          max={100}
          onChange={(values) => this.setState({ values })}
          renderTrack={({ props, children }) => (
            <div
              onMouseDown={props.onMouseDown}
              onTouchStart={props.onTouchStart}
              style={{
                ...props.style,
                height: '31px',
                display: 'flex',
                width: '100%',
              }}
            >
              <div
                ref={props.ref}
                style={{
                  height: '5px',
                  width: '100%',
                  borderRadius: '4px',
                  alignSelf: 'center',
                }}
              >
                {children}
              </div>
            </div>
          )}
          renderThumb={({ props, isDragged }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: '34px',
                width: '34px',
                borderRadius: '2px',
                backgroundColor: 'whitesmoke',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0px 2px 6px #AAA',
              }}
            >
              <div
                style={{
                  height: '16px',
                  width: '5px',
                  backgroundColor: isDragged
                    ? '#548BF4'
                    : 'rgba(0,162,232,0.7)',
                }}
              />
            </div>
          )}
        />
      </div>
    )
  }
}

export class YearControl extends EventEmitter {
  constructor() {
    super() //first must

    window.yearControl = this

    const simple = <SuperSimple />

    console.log('before render YearControl')
    ReactDOM.render(simple, document.getElementById('events-info-container'))
  }

  static create() {
    return new YearControl()
  }
}

//https://codesandbox.io/s/rlp1j1183n?file=/src/index.js:240-2385
