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
  ResponsiveContainer
} from 'recharts'
import GroupBadgeStatus from '../Components/GroupBadgeStatus'
import dayjs from 'dayjs'
import * as utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

const BloodPressureGraph = ({ bloodPressureData, xLabel }) => {
  return (
    <div className="mx-[100px] mb-[100px]">
      <div className=" mt-[28px]">
        <h1 className="typographyTextLgSemibold text-base-black">BloodPressure</h1>
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
            interval="preserveStartEnd"
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
            <Bar barSize={10} dataKey={'values'} radius={30}>
              {bloodPressureData?.data.map((entry, index) => (
                // entry.label&&
                <Cell fill={bloodPressureData?.data[index]?.color} />
              ))}
              <LabelList
                className="typographyTextXsMedium"
                width={20}
                dataKey="values"
                formatter={v => `${Math.round(v[1])} ${bloodPressureData?.unit}`}
                position="top"
              />

              <LabelList
                className="typographyTextXsMedium"
                width={20}
                dataKey="values"
                formatter={v => `${Math.round(v[0])} ${bloodPressureData?.unit}`}
                position="bottom"
              />
            </Bar>
          </>
        </BarChart>
      </ResponsiveContainer>
      <h1 className="typographyTextXsMedium text-gray-500 text-center">{xLabel}</h1>
    </div>
  )
}
export default BloodPressureGraph
