import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer
} from 'recharts'
import GroupBadgeStatus from '../Components/GroupBadgeStatus'
import dayjs from 'dayjs'
import * as utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

const PulseGraph = ({ pulseData, xLabel }) => {
  return (
    <div className="mb-[100px]">
      <div className=" mt-[28px]">
        <h1 className="typographyTextLgSemibold text-base-black">Pulse</h1>
        <h1 className="typographyTextXsMedium text-gray-600 mt-[5px]">
          Total Avg this Month
        </h1>
        <h1 className={`typographyHeadingXsSemibold text-success-700 mr-[16px]`}>
          {Math.round(pulseData?.summary?.pulse) + ' '}
          <span className="typographyTextSmMedium text-gray-600">{pulseData?.unit}</span>
        </h1>
      </div>
      <ResponsiveContainer width="100%" height={240} className="ml-[-24px] mt-[24px]">
        <LineChart width="100%" height={250} className="mt-[5px]">
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="label"
            allowDuplicatedCategory={false}
            // label={pulseData.xLabel}
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
          <ReferenceLine y={150} stroke="red" />
          <ReferenceLine y={60} stroke="red" />

          <YAxis
            domain={[0, 240]}
            tick={{ fontSize: 12, dx: -5 }}
            axisLine={false}
            label={{
              value: pulseData?.unit,
              angle: -90,
              position: 'insideLeft',
              fontFamily: 'Poppins',
              fontWeight: 500,
              fontSize: '12px',
              fill: '#475467'
            }}
            className="typographyTextXsMedium"
          />
          <Tooltip
            labelFormatter={label => dayjs.unix(label).format('D MMM YYYY')}
            formatter={v => Math.round(v)}
          />
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
              fill={pulseData && pulseData.data && pulseData?.data[0]?.color}
              radius={30}
              strokeWidth={3}
              isAnimationActive={false}
            ></Line>
          </>
        </LineChart>
      </ResponsiveContainer>
      <h1 className="typographyTextXsMedium text-gray-500 text-center">{xLabel}</h1>
    </div>
  )
}
export default PulseGraph
