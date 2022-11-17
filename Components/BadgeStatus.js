const BadgeStatus = ({ text, style, width }) => {
  return (
    <div
      className={`w-[${width}] h-[22px] flex justify-center items-center py-[2px] rounded-[16px] px-[8px] ${style}`}
    >
      {text}
    </div>
  )
}
export default BadgeStatus
