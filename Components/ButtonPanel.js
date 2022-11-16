const ButtonPanel = ({ text, style, value, panel, onClick }) => {
  return (
    <div
      className={`cursor-pointer w-[109px] h-[36px] text-center ${
        panel === value ? 'bg-gray-50 text-base-black' : 'bg-base-white text-gray-500'
      } ${style}`}
      onClick={onClick}
    >
      <h1 className="flex items-center w-full h-full justify-center typographyTextSmMedium ">
        {text}
      </h1>
    </div>
  )
}
export default ButtonPanel
