const PrimaryButton = ({
  onClick,
  text,
  width = '165px',
  height = '40px',
  marginTop = '16px'
}) => {
  return (
    <div
      className={`cursor-pointer flex justify-center w-full h-[${height}] items-center mt-[${marginTop}] mb-[30px] min-h-[48px]`}
      onClick={onClick}
    >
      <div
        className={` bg-primary-500  w-[${width}] rounded-[8px]  h-full flex justify-center items-center`}
      >
        <h1 className="typographyTextSmMedium text-base-white text-center">{text}</h1>
      </div>
    </div>
  )
}
export default PrimaryButton
