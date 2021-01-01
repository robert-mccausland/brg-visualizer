import {
  React, useEffect, useRef, useState,
} from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import VisualizerObject from './VisualizerObject'
import './Visualizer.css'

function parseTransform(transform) {
  let x = 0
  let y = 0
  // Check that transform has the form: "translate(123px, 123px)"
  if (transform && transform.startsWith('translate(') && transform.endsWith(')')) {
    const xNumber = transform.slice(10).split(',')[0]
    const yNumber = transform.slice(0, -1).split(',')[1]
    if (xNumber) {
      x = parseInt(xNumber, 10)
    }
    if (yNumber) {
      y = parseInt(yNumber, 10)
    }
  }
  return { x, y }
}

function Visualizer({ onDataUpdated } = {}) {
  const containerRef = useRef(null)
  const targetRef = useRef(null)
  const [centerPosition, setCenterPosition] = useState(null)

  const onObjectDrag = (event, data) => {
    onDataUpdated({ x: data.x - centerPosition.x, y: data.y - centerPosition.y })
  }

  const handleResize = () => {
    if (containerRef.current) {
      const x = _.floor((containerRef.current.offsetWidth - 32) / 2)
      const y = _.floor((containerRef.current.offsetHeight - 32) / 2)
      setCenterPosition({ x, y })
    }
  }

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    if (centerPosition) {
      const targetPosition = parseTransform(targetRef.current.style.transform)
      onDataUpdated({ x: targetPosition.x - centerPosition.x, y: targetPosition.y - centerPosition.y })
    }
  }, [onDataUpdated, centerPosition])

  return (
    <div
      ref={containerRef}
      className="Visualizer-Container"
    >
      <VisualizerObject nodeRef={targetRef} onObjectDrag={onObjectDrag} />
      {centerPosition && (
        <div
          className="Visualizer-Object"
          style={{ transform: `translate(${centerPosition.x}px, ${centerPosition.y}px)` }}
        >
          <svg height="100%" width="100%">
            <circle cx="1em" cy="1em" r="0.9em" stroke="black" strokeWidth="1" fill="green" />
          </svg>
        </div>
      )}
    </div>
  )
}

Visualizer.propTypes = {
  onDataUpdated: PropTypes.func.isRequired,
}

export default Visualizer
