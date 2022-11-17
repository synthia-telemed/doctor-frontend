import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import GroupBadgeStatus from '../Components/GroupBadgeStatus'
import dayjs from 'dayjs'
import * as utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

const PulseGraph = ({ pulseData, xLabel }) => {
  return (
    <div className="mx-[100px] mb-[100px]">
      <div className=" mt-[28px]">
        <h1 className="typographyTextLgSemibold text-base-black">Pulse</h1>
        <h1 className="typographyTextXsMedium text-gray-600 mt-[5px]">
          Total Avg this Month
        </h1>
      </div>
      <ResponsiveContainer width="100%" height={240} className="ml-[-24px] mt-[24px]">
        <LineChart width="100%" height={250} className="mt-[5px]">
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="label"
            allowDuplicatedCategory={false}
            // label={pulseData.xLabel}
            interval="preserveStartEnd"
            ticks={pulseData?.ticks}
            axisLine={false}
            // domain={data?.domain}
            domain={pulseData?.domain}
            type="number"
            className="typographyTextXsMedium"
            tick={{ fontSize: 12 }}
            width="100%"
            tickFormatter={t => dayjs.unix(t).format('DD MMM')}
          />

          <YAxis domain={[0, 200]} axisLine={false} className="typographyTextXsMedium" />
          <Tooltip />
          {/* <Legend
            wrapperStyle={{ fontSize: '12px' }}
            layout="horizontal"
            verticalAlign="top"
            align="right"
            iconType="circle"
          /> */}
          <>
            <Line
              name="Pulse"
              data={pulseData?.data}
              dataKey="values"
              stroke={pulseData && pulseData.data && pulseData?.data[0]?.color}
              radius={30}
            ></Line>
          </>
        </LineChart>
      </ResponsiveContainer>
      <h1 className="typographyTextXsMedium text-gray-500 text-center">{xLabel}</h1>
    </div>
  )
}
export default PulseGraph
