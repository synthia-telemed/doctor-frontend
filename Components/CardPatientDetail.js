import dayjs from 'dayjs'
import * as utc from 'dayjs/plugin/utc'
dayjs.extend(utc)
const CardPatientDetail = ({ detailAppointment }) => {
  return (
    <div className="border-[1px] border-solid border-gray-200 max-h-[400px] h-full rounded-[8px] mx-[112px] h-[70vh] w-full max-w-[696px] flex flex-col px-[32px]">
      <h1 className="typographyHeadingSmSemibold text-base-black mt-[16px]">
        Patient Detail
      </h1>
      <h1 className="typographyTextXsRegular text-gray-600 ">Name</h1>
      <h1 className="typographyTextMdRegular text-base-black ">
        {detailAppointment?.patient?.full_name}
      </h1>
      <div className="flex mt-[8px] w-[376px] justify-between">
        <div className="flex flex-col">
          <div className="flex-col flex">
            <h1 className="typographyTextXsRegular text-gray-600">Patient Number</h1>
            <h1 className="typographyTextMdMedium text-base-black">
              {detailAppointment?.patient?.id}
            </h1>
          </div>
          <div className="mt-[19px]">
            <h1 className="typographyTextXsRegular text-gray-600">Birthdate</h1>
            <h1 className="typographyTextMdMedium text-base-black">
              {dayjs(detailAppointment?.patient?.birth_date).format('DD/MM/YYYY')}
            </h1>
          </div>
        </div>
        <div className="flex flex-col">
          <div>
            <h1 className="typographyTextXsRegular text-gray-600 ">Weight</h1>
            <h1 className="typographyTextMdMedium text-base-black">
              {detailAppointment?.patient?.weight} Kg.
            </h1>
          </div>
          <div className="mt-[19px]">
            <h1 className="typographyTextXsRegular text-gray-600">Blood type</h1>
            <h1 className="typographyTextMdMedium text-[18px] text-base-black font-[500] font-[Poppins] normal">
              {detailAppointment?.patient?.blood_type}
            </h1>
          </div>
        </div>
        <div>
          <h1 className="typographyTextXsRegular text-gray-600">Height</h1>
          <h1 className="typographyTextMdMedium text-base-black">
            {detailAppointment?.patient?.height} cm
          </h1>
        </div>
      </div>
      <div className="mt-[8px]">
        <h1 className="typographyTextXsRegular text-gray-600">Detail</h1>
        <h1 className="typographyTextMdRegular text-base-black">
          {detailAppointment?.detail}
        </h1>
      </div>
    </div>
  )
}
export default CardPatientDetail
