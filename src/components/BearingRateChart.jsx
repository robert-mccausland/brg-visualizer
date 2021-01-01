import React from 'react'
import {
  LineChart, YAxis, CartesianGrid, Line, XAxis, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import PropTypes from 'prop-types'

function BearingRateChart({ currentTime, chartData, durationShown }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        layout="vertical"
      >
        <YAxis
          dataKey="time"
          reversed
          domain={[currentTime - durationShown, currentTime]}
          tickCount={11}
          unit="s"
          tickFormatter={(t) => ((currentTime - t) / 1000).toFixed(1)}
        />
        <XAxis tickCount={9} domain={[-180, 180]} type="number" />
        <CartesianGrid stroke="#e0e0e0" />
        <ReferenceLine x={0} stroke="#666666" strokeWidth={1} />
        <ReferenceLine x={180} stroke="#666666" strokeWidth={1} />
        <ReferenceLine x={-180} stroke="#666666" strokeWidth={1} />
        <Line type="monotone" dataKey="bearing" stroke="#ff0000" connectNulls={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

BearingRateChart.propTypes = {
  currentTime: PropTypes.number,
  durationShown: PropTypes.number,
  chartData: PropTypes.arrayOf(PropTypes.shape({
    bearing: PropTypes.number,
    time: PropTypes.number,
  })),
}

BearingRateChart.defaultProps = {
  durationShown: 5000,
  currentTime: 0,
  chartData: [],
}

export default BearingRateChart
