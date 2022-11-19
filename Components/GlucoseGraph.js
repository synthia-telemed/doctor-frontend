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
    <div className="mx-[100px] mb-[100px]">
      <div className=" mt-[28px]">
        <h1 className="typographyTextLgSemibold text-base-black">Glucose</h1>
        <h1 className="typographyTextXsMedium text-gray-600 mt-[5px]">
          Total Avg this day
        </h1>
        <div className="flex flex-col">
          {/* {checkGlucoseData()} */}
          {glucoseData?.summary?.fasting?.hyperglycemia.length ||
          glucoseData?.summary?.fasting?.hypoglycemia.length ||
          glucoseData?.summary?.fasting?.normal.length ||
          glucoseData?.summary?.fasting?.warning.length ? (
            <div>
              <div className="flex items-center" onClick={onClickFasting}>
                <div className="w-[16px] h-[16px] bg-[#131957] rounded-[16px]"></div>{' '}
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
                  {glucoseData?.summary?.fasting?.warning.length &&
                    glucoseData?.summary?.fasting?.warning.map(item => {
                      return (
                        <div className="flex justify-between w-[418px] mb-[8px] border-b-[1px] border-solid border-gray-200">
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
              <div className="flex items-center" onClick={() => onClickBeforeMeal}>
                <div className="w-[16px] h-[16px] bg-[#303ed9] rounded-[16px]"></div>{' '}
                <h1 className="typographyTextMdRegular ml-[4px] text-gray-600">
                  BeforeMeal
                </h1>
                <GroupBadgeStatus
                  data={glucoseData?.summary?.beforeMeal}
                  dataName="beforemeal"
                  isClick={clickDetailGraphBeforeMeal}
                />
              </div>
              {clickDetailGraphBeforeMeal ? (
                <div className="pt-[8px] bg-gray-50 w-[418px] rounded-[8px]">
                  {glucoseData?.summary?.afterMeal?.warning.length &&
                    glucoseData?.summary?.afterMeal?.warning.map(item => {
                      return (
                        <div className="flex justify-between w-[418px] mb-[8px] border-b-[1px] border-solid border-gray-200">
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
              <div className="flex items-center" onClick={onClickAfterMeal}>
                <div className="w-[16px] h-[16px] bg-[#4F84F6] rounded-[16px]"></div>{' '}
                <h1 className="typographyTextMdRegular ml-[4px] text-gray-600">
                  AfterMeal
                </h1>
                <GroupBadgeStatus
                  data={glucoseData?.summary?.afterMeal}
                  dataName="aftermeal"
                  isClick={clickDetailGraphAfterMeal}
                />
              </div>
              {clickDetailGraphAfterMeal ? (
                <div className="pt-[8px] bg-gray-50 w-[418px] rounded-[8px]">
                  {glucoseData?.summary?.afterMeal?.warning.length &&
                    glucoseData?.summary?.afterMeal?.warning.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className="flex justify-between w-[418px] mb-[8px] border-b-[1px] border-solid border-gray-200"
                        >
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
        <LineChart width="100%" height={250} className="mt-[5px]">
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="label"
            allowDuplicatedCategory={false}
            // label={glucoseData.xLabel}
            interval="preserveStartEnd"
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

          <YAxis domain={[0, 200]} axisLine={false} className="typographyTextXsMedium" />
          <Tooltip labelFormatter={label => dayjs.unix(label).format('D MMM YYYY')} formatter={(v) => Math.round(v)} />
          <Legend
            wrapperStyle={{ fontSize: '12px' }}
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
              isAnimationActive={false}
            ></Line>
            <Line
              name="BeforeMeal"
              data={glucoseData?.data?.beforeMeal}
              dataKey="value"
              stroke="#303ed9"
              fill="#303ed9"
              radius={30}
              isAnimationActive={false}
            ></Line>
            <Line
              name="AfterMeal"
              data={glucoseData?.data?.afterMeal}
              dataKey="value"
              stroke="#4F84F6"
              fill="#4F84F6"
              radius={30}
              isAnimationActive={false}
            ></Line>
          </>
        </LineChart>
      </ResponsiveContainer>
      <h1 className="typographyTextXsMedium text-gray-500 text-center">{xLabel}</h1>
    </div>
  )
}
export default GlucoseGraph
