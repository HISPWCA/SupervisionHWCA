import React, { Component, PureComponent } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ComposedChart, Area, Bar, Scatter,
} from 'recharts';
const data = [
  {
    name: 'Page A', uv: 590, pv: 800, amt: 1400, cnt: 490,
  },
  {
    name: 'Page B', uv: 868, pv: 967, amt: 1506, cnt: 590,
  },
  {
    name: 'Page C', uv: 1397, pv: 1098, amt: 989, cnt: 350,
  },
  {
    name: 'Page D', uv: 1480, pv: 1200, amt: 1228, cnt: 480,
  },
  {
    name: 'Page E', uv: 1520, pv: 1108, amt: 1100, cnt: 460,
  },
  {
    name: 'Page F', uv: 1400, pv: 680, amt: 1700, cnt: 380,
  },
  {
    name: 'Page A', uv: 4000, pv: 2400, amt: 2400,
  },
  {
    name: 'Page B', uv: 3000, pv: 1398, amt: 2210,
  },
  {
    name: 'Page C', uv: 2000, pv: 9800, amt: 2290,
  },
  {
    name: 'Page D', uv: 2780, pv: 3908, amt: 2000,
  },
  {
    name: 'Page E', uv: 1890, pv: 4800, amt: 2181,
  },
  {
    name: 'Page F', uv: 2390, pv: 3800, amt: 2500,
  },
  {
    name: 'Page G', uv: 3490, pv: 4300, amt: 2100,
  },
];
class Dashboard extends Component {
  render() {
    return (
      <React.Fragment>

        <div className="row m-3">

          <div className="col m-3">

            <LineChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 5, right: 30, left: 20, bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
            </LineChart>

          </div>

          <div className="col m-3">
            <ComposedChart
              width={500}
              height={400}
              data={data}
              margin={{
                top: 20, right: 20, bottom: 20, left: 20,
              }}
            >
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="amt" fill="#8884d8" stroke="#8884d8" />
              <Bar dataKey="pv" barSize={20} fill="#413ea0" />
              <Line type="monotone" dataKey="uv" stroke="#ff7300" />
              {/* <Scatter dataKey="cnt" fill="red" /> */}
            </ComposedChart>
          </div>
        </div>

      </React.Fragment>
    )
  }
}

export default Dashboard
