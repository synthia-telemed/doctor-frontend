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

const GlucoseGraph = ({
  glucoseData,
  onClickFasting,
  onClickBeforeMeal,
  onClickAfterMeal,
  clickDetailGraphFasting,
  clickDetailGraphBeforeMeal,
  clickDetailGraphAfterMeal,
  xLabel
}) => {
  return (
    <div className="mb-[100px]">
      <div className=" mt-[28px]">
        <h1 className="typographyTextLgSemibold text-base-black">Glucose</h1>
        <div className="flex flex-col">
          {/* {checkGlucoseData()} */}
          {glucoseData?.summary?.fasting?.hyperglycemia.length ||
          glucoseData?.summary?.fasting?.hypoglycemia.length ||
          glucoseData?.summary?.fasting?.normal.length ||
          glucoseData?.summary?.fasting?.warning.length ? (
            <div>
              <div className="flex items-center mt-[8px]" onClick={onClickFasting}>
                <div className="w-[8px] h-[8px] bg-[#131957] rounded-[16px]"></div>{' '}
                <h1 className="typographyTextMdRegular ml-[4px] text-gray-600 mr-[16px]">
                  Fasting
                </h1>
                <GroupBadgeStatus
                  data={glucoseData?.summary?.fasting}
                  dataName="fasting"
                  isClick={clickDetailGraphFasting}
                />
              </div>

              {clickDetailGraphFasting ? (
                <div className="pt-[8px] bg-gray-50 w-[418px] rounded-[8px]">
                  {glucoseData?.summary?.fasting?.warning.length !== 0 &&
                    glucoseData?.summary?.fasting?.warning.map(item => {
                      return (
                        <div className="flex justify-between w-[418px] mx-[16px] mb-[8px] border-b-[1px] border-solid border-gray-200">
                          <h1 className="typographyTextXsMedium text-gray-500">
                            {dayjs(item.dateTime).format('DD MMM YYYY, HH:mm A')}
                          </h1>
                          <h1 className="text-warning-600 typographyTextXsMedium">
                            {' '}
                            {item.value} {glucoseData.unit}
                          </h1>
                        </div>
                      )
                    })}
                  {glucoseData?.summary?.fasting?.normal.length !== 0 &&
                    glucoseData?.summary?.fasting?.normal.map(item => {
                      return (
                        <div className="flex justify-between w-[418px] mx-[16px] mb-[8px] border-b-[1px] border-solid border-gray-200">
                          <h1 className="typographyTextXsMedium text-gray-500">
                            {dayjs(item.dateTime).format('DD MMM YYYY, HH:mm A')}
                          </h1>
                          <h1 className="text-success-700 typographyTextXsMedium">
                            {' '}
                            {item.value} {glucoseData.unit}
                          </h1>
                        </div>
                      )
                    })}
                  {glucoseData?.summary?.fasting?.hyperglycemia.length !== 0 &&
                    glucoseData?.summary?.fasting?.hyperglycemia.map(item => {
                      return (
                        <div className="flex justify-between w-[418px] mx-[16px] mb-[8px] border-b-[1px] border-solid border-gray-200">
                          <h1 className="typographyTextXsMedium text-gray-500">
                            {dayjs(item.dateTime).format('DD MMM YYYY, HH:mm A')}
                          </h1>
                          <h1 className="text-error-700 typographyTextXsMedium">
                            {' '}
                            {item.value} {glucoseData.unit}
                          </h1>
                        </div>
                      )
                    })}
                  {glucoseData?.summary?.fasting?.hypoglycemia.length !== 0 &&
                    glucoseData?.summary?.fasting?.hypoglycemia.map(item => {
                      return (
                        <div className="flex justify-between w-[418px] mx-[16px] mb-[8px] border-b-[1px] border-solid border-gray-200">
                          <h1 className="typographyTextXsMedium text-gray-500">
                            {dayjs(item.dateTime).format('DD MMM YYYY, HH:mm A')}
                          </h1>
                          <h1 className="text-error-700 typographyTextXsMedium">
                            {' '}
                            {item.value} {glucoseData.unit}
                          </h1>
                        </div>
                      )
                    })}
                </div>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <></>
          )}

          {glucoseData?.summary?.beforeMeal?.hyperglycemia.length ||
          glucoseData?.summary?.beforeMeal?.hypoglycemia.length ||
          glucoseData?.summary?.beforeMeal?.normal.length ? (
            <div>
              <div className="flex items-center mt-[8px]" onClick={onClickBeforeMeal}>
                <div className="w-[8px] h-[8px] bg-[#303ed9] rounded-[16px]"></div>{' '}
                <h1 className="typographyTextMdRegular ml-[4px] text-gray-600">
                  Before meal
                </h1>
                <GroupBadgeStatus
                  data={glucoseData?.summary?.beforeMeal}
                  dataName="beforemeal"
                  isClick={clickDetailGraphBeforeMeal}
                />
              </div>
              {clickDetailGraphBeforeMeal ? (
                <div className="pt-[8px] bg-gray-50 w-[418px] rounded-[8px]">
                  {glucoseData?.summary?.beforeMeal?.hyperglycemia.length !== 0 &&
                    glucoseData?.summary?.beforeMeal?.hyperglycemia.map(item => {
                      return (
                        <div className="flex justify-between w-[418px] mx-[16px] mb-[8px] border-b-[1px] border-solid border-gray-200">
                          <h1 className="typographyTextXsMedium text-gray-500">
                            {dayjs(item.dateTime).format('DD MMM YYYY, HH:mm A')}
                          </h1>
                          <h1 className="text-error-700 typographyTextXsMedium">
                            {' '}
                            {item.value} {glucoseData.unit}
                          </h1>
                        </div>
                      )
                    })}
                  {glucoseData?.summary?.beforeMeal?.hypoglycemia.length !== 0 &&
                    glucoseData?.summary?.beforeMeal?.hypoglycemia.map(item => {
                      return (
                        <div className="flex justify-between w-[418px] mx-[16px] mb-[8px] border-b-[1px] border-solid border-gray-200">
                          <h1 className="typographyTextXsMedium text-gray-500">
                            {dayjs(item.dateTime).format('DD MMM YYYY, HH:mm A')}
                          </h1>
                          <h1 className="text-error-700 typographyTextXsMedium">
                            {' '}
                            {item.value} {glucoseData.unit}
                          </h1>
                        </div>
                      )
                    })}
                  {glucoseData?.summary?.beforeMeal?.normal.length !== 0 &&
                    glucoseData?.summary?.beforeMeal?.normal.map(item => {
                      return (
                        <div className="flex justify-between w-[418px] mx-[16px] mb-[8px] border-b-[1px] border-solid border-gray-200">
                          <h1 className="typographyTextXsMedium text-gray-500">
                            {dayjs(item.dateTime).format('DD MMM YYYY, HH:mm A')}
                          </h1>
                          <h1 className="text-success-700 typographyTextXsMedium">
                            {' '}
                            {item.value} {glucoseData.unit}
                          </h1>
                        </div>
                      )
                    })}
                </div>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <></>
          )}

          {glucoseData?.summary?.afterMeal?.hyperglycemia.length ||
          glucoseData?.summary?.afterMeal?.hypoglycemia.length ||
          glucoseData?.summary?.afterMeal?.normal.length ? (
            <div>
              <div className="flex items-center mt-[8px]" onClick={onClickAfterMeal}>
                <div className="w-[8px] h-[8px] bg-[#4F84F6] rounded-[16px]"></div>{' '}
                <h1 className="typographyTextMdRegular ml-[4px] text-gray-600">
                  After meal
                </h1>
                <GroupBadgeStatus
                  data={glucoseData?.summary?.afterMeal}
                  dataName="aftermeal"
                  isClick={clickDetailGraphAfterMeal}
                />
              </div>
              {clickDetailGraphAfterMeal ? (
                <div className="pt-[8px] bg-gray-50 w-[418px] rounded-[8px]">
                  {glucoseData?.summary?.afterMeal?.hyperglycemia.length !== 0 &&
                    glucoseData?.summary?.afterMeal?.hyperglycemia.map(item => {
                      return (
                        <div className="flex justify-between w-[418px] mx-[16px] mb-[8px] border-b-[1px] border-solid border-gray-200">
                          <h1 className="typographyTextXsMedium text-gray-500">
                            {dayjs(item.dateTime).format('DD MMM YYYY, HH:mm A')}
                          </h1>
                          <h1 className="text-error-700 typographyTextXsMedium">
                            {' '}
                            {item.value} {glucoseData.unit}
                          </h1>
                        </div>
                      )
                    })}
                  {glucoseData?.summary?.afterMeal?.hypoglycemia.length !== 0 &&
                    glucoseData?.summary?.afterMeal?.hypoglycemia.map(item => {
                      return (
                        <div className="flex justify-between w-[418px] mx-[16px] mb-[8px] border-b-[1px] border-solid border-gray-200">
                          <h1 className="typographyTextXsMedium text-gray-500">
                            {dayjs(item.dateTime).format('DD MMM YYYY, HH:mm A')}
                          </h1>
                          <h1 className="text-error-700 typographyTextXsMedium">
                            {' '}
                            {item.value} {glucoseData.unit}
                          </h1>
                        </div>
                      )
                    })}
                  {glucoseData?.summary?.afterMeal?.normal.length !== 0 &&
                    glucoseData?.summary?.afterMeal?.normal.map(item => {
                      return (
                        <div className="flex justify-between w-[418px] mx-[16px] mb-[8px] border-b-[1px] border-solid border-gray-200">
                          <h1 className="typographyTextXsMedium text-gray-500">
                            {dayjs(item.dateTime).format('DD MMM YYYY, HH:mm A')}
                          </h1>
                          <h1 className="text-success-700 typographyTextXsMedium">
                            {' '}
                            {item.value} {glucoseData.unit}
                          </h1>
                        </div>
                      )
                    })}
                </div>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240} className="ml-[-24px] mt-[24px]">
        <LineChart width="100%" height={250} className="mt-[5px] p-[20px]">
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="label"
            allowDuplicatedCategory={false}
            // label={glucoseData.xLabel}
            // interval="preserveStartEnd"
            ticks={glucoseData?.ticks}
            axisLine={false}
            // domain={data?.domain}
            domain={glucoseData?.domain}
            type="number"
            className="typographyTextXsMedium"
            tick={{ fontSize: 12 }}
            width="100%"
            tickFormatter={t => dayjs.unix(t).format('DD MMM')}
          />

          <YAxis
            domain={[0, 240]}
            tick={{ fontSize: 12, dx: -5 }}
            axisLine={false}
            label={{
              value: glucoseData?.unit,
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
          <Legend
            wrapperStyle={{ fontSize: '12px', padding: '10px' }}
            iconSize="8"
            layout="horizontal"
            verticalAlign="top"
            align="right"
            iconType="circle"
          />
          <>
            <Line
              name="Fasting"
              data={glucoseData?.data?.fasting}
              dataKey="value"
              stroke="#131957"
              fill="#131957"
              radius={30}
              strokeWidth={3}
              isAnimationActive={false}
            ></Line>
            <Line
              name="Before meal"
              data={glucoseData?.data?.beforeMeal}
              dataKey="value"
              stroke="#303ed9"
              fill="#303ed9"
              radius={30}
              strokeWidth={3}
              isAnimationActive={false}
            ></Line>
            <Line
              name="After meal"
              data={glucoseData?.data?.afterMeal}
              dataKey="value"
              stroke="#4F84F6"
              fill="#4F84F6"
              strokeWidth={3}
              radius={30}
              isAnimationActive={false}
            ></Line>
          </>
        </LineChart>
      </ResponsiveContainer>
      <h1 className="typographyTextXsMedium text-gray-500 text-center mt-[16px]">{xLabel}</h1>
    </div>
  )
}
export default GlucoseGraph
