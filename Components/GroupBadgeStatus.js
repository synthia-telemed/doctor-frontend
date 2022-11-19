import BadgeStatus from './BadgeStatus'
const GroupBadgeStatus = ({ data, dataName, isClick }) => {
  const ArrowUp = () => {
    return (
      <svg
        className="ml-[16px]"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4.16634 12.916L9.99967 7.08268L15.833 12.916"
          stroke="#344054"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  const ArrowDown = () => {
    return (
      <svg
        className="ml-[16px]"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.8337 7.08398L10.0003 12.9173L4.16699 7.08398"
          stroke="#344054"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  return dataName === 'fasting' ? (
    <div className="flex">
      {data?.warning.length ? (
        <>
          <BadgeStatus
            width="116px"
            style="bg-warning-100 text-warning-600 typographyTextXsMedium "
            text={data?.warning.length + ' ' + 'Warning Values'}
          />
        </>
      ) : (
        <></>
      )}
      {data?.hyperglycemia.length ? (
        <BadgeStatus
          width="116px"
          style="bg-error-50 text-error-700 typographyTextXsMedium "
          text={data?.hyperglycemia.length + ' ' + 'Hyperglycemia Values'}
        />
      ) : (
        <></>
      )}
      {data?.hypoglycemia.length ? (
        <BadgeStatus
          width="116px"
          style="bg-error-50 text-error-700 typographyTextXsMedium "
          text={data?.hypoglycemia.length + ' ' + 'Hypoglycemia Values'}
        />
      ) : (
        <></>
      )}
      {data?.normal.length ? (
        <BadgeStatus
          width="116px"
          style="bg-error-50 text-error-700 typographyTextXsMedium "
          text={data?.normal.length + ' ' + 'Normal Values'}
        />
      ) : (
        <></>
      )}
      {isClick ? <ArrowUp /> : <ArrowDown />}
    </div>
  ) : (
    <div className="flex">
      {data?.hyperglycemia.length ? (
        <BadgeStatus
          width="116px"
          style="bg-error-50 text-error-700 typographyTextXsMedium "
          text={data?.hyperglycemia.length + ' ' + 'Hyperglycemia Values'}
        />
      ) : (
        <></>
      )}
      {data?.hypoglycemia.length ? (
        <BadgeStatus
          width="116px"
          style="bg-error-50 text-error-700 typographyTextXsMedium "
          text={data?.hypoglycemia.length + ' ' + 'Hypoglycemia Values'}
        />
      ) : (
        <></>
      )}
      {data?.normal.length ? (
        <BadgeStatus
          width="116px"
          style="bg-error-50 text-error-700 typographyTextXsMedium "
          text={data?.normal.length + ' ' + 'Normal Values'}
        />
      ) : (
        <></>
      )}
      {isClick ? <ArrowUp /> : <ArrowDown />}
    </div>
  )
}
export default GroupBadgeStatus
