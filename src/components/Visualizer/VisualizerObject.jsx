import { React } from 'react'
import PropTypes from 'prop-types'
import Draggable from 'react-draggable'

const VisualizerObject = ({ onObjectDrag, nodeRef }) => (
  <Draggable nodeRef={nodeRef} bounds="parent" onDrag={onObjectDrag}>
    <div ref={nodeRef} className="Visualizer-Object">
      <svg height="100%" width="100%">
        <circle cx="1em" cy="1em" r="0.9em" stroke="black" strokeWidth="1" fill="red" />
      </svg>
    </div>
  </Draggable>
)
VisualizerObject.propTypes = {
  onObjectDrag: PropTypes.func.isRequired,
  nodeRef: PropTypes.shape({
    current: null,
  }).isRequired,
}

export default VisualizerObject
