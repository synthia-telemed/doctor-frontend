import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  LabelList,
  ReferenceLine,
  ResponsiveContainer
} from 'recharts'
import GroupBadgeStatus from '../Components/GroupBadgeStatus'
import dayjs from 'dayjs'
import * as utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

const BloodPressureGraph = ({ bloodPressureData, xLabel }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    console.log(payload)
    if (active && payload && payload.length) {
      return (
        <div className="bg-base-white padding-[20px] w-[130px] h-[100px] flex flex-col justify-center items-start pl-[20px]">
          <h1 className="typographyTextSmMedium">{dayjs.unix(label).format('DD MMM')}</h1>
          <h1 className="typographyTextSmMedium">
            Systolic:{' '}
            <span className="text-primary-500">{Math.round(payload[0]?.value[1])}</span>
            <br />
            Diastolic:{' '}
            <span className="text-primary-500">{Math.round(payload[0]?.value[0])}</span>
          </h1>
        </div>
      )
    }
    return null
  }
  return (
    <div className="mb-[100px]">
      <div className=" mt-[28px]">
        <h1 className="typographyTextLgSemibold text-base-black">Blood Pressure</h1>
        <h1 className="typographyTextXsMedium text-gray-600 mt-[5px]">
          Total Avg this Month
        </h1>
        <h1 className={`typographyHeadingXsSemibold text-success-700 mr-[16px]`}>
          {Math.round(bloodPressureData?.summary?.systolic) +
            ' / ' +
            Math.round(bloodPressureData?.summary?.diastolic) +
            ' '}
          <span className="typographyTextSmMedium text-gray-600">
            {bloodPressureData?.unit}
          </span>
        </h1>
      </div>
      <ResponsiveContainer width="100%" height={240} className="ml-[-24px] mt-[24px]">
        <BarChart
          width="100%"
          height={250}
          data={bloodPressureData?.data}
          className="mt-[5px]"
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="label"
            allowDuplicatedCategory={false}
            // label={pulseData.xLabel}
            ticks={bloodPressureData?.ticks}
            axisLine={false}
            // domain={data?.domain}
            domain={bloodPressureData?.domain}
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
              value: bloodPressureData?.unit,
              angle: -90,
              position: 'insideLeft',
              fontFamily: 'Poppins',
              fontWeight: 500,
              fontSize: '12px',
              fill: '#475467'
            }}
            className="typographyTextXsMedium"
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            barSize={10}
            data={bloodPressureData?.data}
            dataKey="values"
            radius={30}
            isAnimationActive={false}
          >
            {bloodPressureData &&
              bloodPressureData?.data &&
              bloodPressureData?.data.map((entry, index) => (
                // entry.label&&
                <Cell key={index} fill={bloodPressureData?.data[index]?.color} />
              ))}
            {/* {newBloodPressureData &&
                newBloodPressureData.map((entry, index) => (
                  <Cell key={index} fill={newBloodPressureData[index]?.color} />
                ))} */}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <h1 className="typographyTextXsMedium text-gray-500 text-center">{xLabel}</h1>
    </div>
  )
}
export default BloodPressureGraph
