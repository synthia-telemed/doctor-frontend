const BadgeStatus = ({ text, style }) => {
    return (
      <div
        className={`w-[76px] h-[22px] flex justify-center items-center py-[2px] rounded-[16px] px-[8px] ${style}`}
      >
        {text}
      </div>
    );
  };
  export default BadgeStatus;
  