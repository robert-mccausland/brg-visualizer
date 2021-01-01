import {
  React, useEffect, useState, useRef,
} from 'react'
import {
  Grid, Card, CardContent, CardHeader, Typography, CssBaseline, Divider, Link,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Visualizer from './components/Visualizer/Visualizer'
import BearingRateChart from './components/BearingRateChart'
import './App.css'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  headers: {
    textAlign: 'center',
  },
  textBlock: {
    maxWidth: '60em',
    marginBottom: theme.spacing(2),
  },
  chartContainer: {
    height: '600px',
  },
  visualizerContainer: {
    height: '600px',
  },
}))

function App() {
  const classes = useStyles()
  const dataRef = useRef(null)
  const timeRef = useRef(0)

  const [data, setData] = useState(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [chartData, setChartData] = useState([])

  const historyLength = 5000
  const deltaTime = 25

  // Store data in a ref as it will change a lot and we don't want to rerun the interval each time.
  useEffect(() => {
    dataRef.current = data
  }, [data])
  useEffect(() => {
    timeRef.current = currentTime
  }, [currentTime])

  useEffect(() => {
    const getBearing = ({ x, y }) => {
      let angle = (x > 0 ? 90 : -90)
      if (y !== 0) {
        angle = (-180 / Math.PI) * Math.atan(x / y)
      }
      if (x > 0 && y > 0) {
        return 180 + angle
      } if (y > 0) {
        return angle - 180
      }
      return angle
    }

    const interval = setInterval(() => {
      setCurrentTime((previousTime) => previousTime + deltaTime)
      if (dataRef.current) {
        setChartData((c) => {
          const newDataPoint = {
            time: timeRef.current,
            bearing: getBearing(dataRef.current),
          }
          let newChartData
          if (c) {
            // If there is a large difference between the last point (90% of 360 in this case)
            // it has probably crossed the x axis from -180 to +180 and we don't want the points
            // to be joined. So to prevent this we insert a null point.

            if (c[c.length - 1] && Math.abs(c[c.length - 1].bearing - newDataPoint.bearing) > 324) {
              const edge = newDataPoint.bearing > 0 ? 180 : -180
              newChartData = c.concat([
                { time: timeRef.current, bearing: -edge },
                { time: timeRef.current, bearing: null },
                { time: timeRef.current, bearing: edge },
                newDataPoint])
            } else {
              newChartData = c.concat([newDataPoint])
            }

            newChartData = newChartData.slice(-Math.ceil(historyLength / deltaTime))
          } else {
            newChartData = [newDataPoint]
          }
          return newChartData
        })
      }
    }, deltaTime)
    return () => clearInterval(interval)
  }, [setCurrentTime])

  return (
    <div className="App">
      <CssBaseline />
      <header className="App-header">
        Bearing Rate Graph Visualizer
      </header>
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card className={classes.textBlock}>
              <CardHeader title="Intro" />
              <Divider />
              <CardContent>
                <Typography variant="body1" gutterBottom>
                  This shows a Bearing Rate Graph for a single target, the target is the red circle in
                  the Visualizer and can be dragged around to simulate it moving. The green circle in
                  the Visualizer is the object that is measuring the bearings.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item lg={6} xs={12}>
            <Card>
              <CardHeader title="Visualizer" className={classes.headers} />
              <CardContent className={classes.visualizerContainer}>
                <Visualizer onDataUpdated={setData} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item lg={6} xs={12}>
            <Card>
              <CardHeader title="Bearing Rate Graph" className={classes.headers} />
              <CardContent className={classes.chartContainer}>
                <BearingRateChart chartData={chartData} currentTime={currentTime} durationShown={historyLength} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card className={classes.textBlock}>
              <CardHeader title="Extra bits" />
              <Divider />
              <CardContent>
                <Typography variant="body1" gutterBottom>
                  This was mainly inspired by a
                  {' '}
                  <Link href="https://youtu.be/AqqaYs7LjlM?t=480">Smarter Every Day Video</Link>
                  , which explains what Bearing Rate Diagrams are and why they are important, go watch it!
                </Typography>
                <Typography variant="body1" gutterBottom>
                  If you have any feedback / suggestions / bugs you want to let me know
                  about then please make an issue on GitHub.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

export default App
